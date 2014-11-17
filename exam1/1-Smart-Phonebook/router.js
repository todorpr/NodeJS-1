var Contact = require('./Contact')
    Group = require('./Group'),
    express = require('express');


var router = express.Router();

var dbContact = new Contact();
var dbGroup = new Group();

router.get('/create', function(req, res){
    res.render("create");
});

router.post('/create', function(req, res){
    var words = req.body.personalIdentifier.trim().split(" ");
    //console.log(words);
    dbContact.create(req.body).then(function(){
        words.forEach(function(word){
            dbContact.ifWordExist(word).then(function(params){
                console.log(params.contacts.length);
                if(params.contacts.length > 1){
                    dbGroup.ifExist(params.word, params.contacts).then(function(params){
                        //console.log(params);
                        params.group && dbGroup.updateGroup(params.group[0], params.contacts);
                    });
                }
            });
        });
        res.send("Snippet inserted!");
    });
});

router.get('/contact/:id', function(req, res){
    dbContact.getById(req.params.id).then(function(contact){
        //res.send(contact);
        res.render('contact', { contact: contact});
    });
});

router.delete('/delete/:id', function(req, res){
    dbContact.deleteById(req.params.id).then(function(){
       res.status(200).send('OK');
    });
});

router.get('/all', function(req, res){
    dbContact.getAll().then(function(all){
        res.render("all-contacts", { contacts: all });
        //res.send(all);
    });
});

router.get('/groups', function(req, res){
    dbContact.ifWordExist("mladost").then(function(all){
        res.render("all-contacts", { contacts: all });
        //res.send(all);
    });
});

router.get('*', function(req, res){
    res.redirect('/all');
});

module.exports = router;