var contactModel = require('./models/contact'),
    mongoose = require('mongoose'),
    q = require('q');

function Contact(){};

var Contacts = contactModel;

Contact.prototype.create = function(data){
    var def = q.defer();
    var contact = new Contacts({
        phoneNumber: data.phoneNumber,
        personalIdentifier: data.personalIdentifier
    });
    contact.save(function (err) {
        if (err) {
            console.log(err);
            def.reject(new Error(err));
        } else {
            def.resolve();
        }
    });
    return def.promise;
};

Contact.prototype.getAll = function(){
    var def = q.defer();
    Contacts.find({}, function(err, all){
        if (err) {
            def.reject(new Error(err));
        } else {
            def.resolve(all);
        }
    });
    return def.promise;
};

Contact.prototype.getById = function(id){
    var def = q.defer();
    Contacts.findOne({ _id: id }, function(err, contact){
        if (err) {
            def.reject(new Error(err));
        } else {
            //console.log(contact);
            def.resolve(contact);
        }
    });
    return def.promise;
};

Contact.prototype.deleteById = function(id){
    var def = q.defer();
    Contacts.findOneAndRemove({ _id: id }, function(err, contact){
        if (err) {
            def.reject(new Error(err));
        } else {
            console.log("---");
            console.log(contact);
            def.resolve();
        }
    });
    return def.promise;
};

Contact.prototype.ifWordExist = function(word){
    var def = q.defer();
    Contacts.find( { $text: { $search: word } }, function(err, contacts){
        if (err) {
            def.reject(new Error(err));
        } else {
            def.resolve({contacts: contacts, word: word});
        }
    });
    return def.promise;
}

module.exports = Contact;