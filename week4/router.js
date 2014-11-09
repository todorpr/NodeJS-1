module.exports = function(express, db){
    var router = express.Router();
    router.get('/all', function(req, res){
        db.findAll().then(function(all){
            res.render("all-snippets", { creators: all });
        });
    });

    router.get('/allByCreator/:name', function(req, res){
        db.findAllByName(req.params.name).then(function(all){
            res.send(all);
        });
    });

    router.get('/create', function(req, res){
        res.render("create");
    });

    router.post('/create', function(req, res){
        db.create(req.body).then(function(){
            res.send("Snippet inserted!");
        });
    });

    return router;
};