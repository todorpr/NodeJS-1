//var contactModel = require('./models/contact.js'),
//    mongoose = require('mongoose'),
//    q = require('q');
//
//module.exports = function(){
//
//    var Contact = contactModel;
//
//    var create = function(data){
//        var def = q.defer();
//        var contact = new Contact({
//            phoneNumber: data.phoneNumber,
//            personalIdentifier: data.personalIdentifier
//        });
//        contact.save(function (err) {
//            if (err) {
//                console.log(err);
//                def.reject(new Error(err));
//            } else {
//                def.resolve();
//            }
//        });
//        return def.promise;
//    };
//
//    var getAll = function(){
//        var def = q.defer();
//        Contact.find({}, function(err, all){
//            if (err) {
//                def.reject(new Error(err));
//            } else {
//                def.resolve(all);
//            }
//        });
//        return def.promise;
//    };
//
//    var getById = function(id){
//        var def = q.defer();
//        Contact.findOne({ _id: id }, function(err, contact){
//            if (err) {
//                def.reject(new Error(err));
//            } else {
//                //console.log(contact);
//                def.resolve(contact);
//            }
//        });
//        return def.promise;
//    };
//
//    var deleteById = function(id){
//        var def = q.defer();
//        Contact.findOneAndRemove({ _id: id }, function(err, contact){
//            if (err) {
//                def.reject(new Error(err));
//            } else {
//                console.log("---");
//                console.log(contact);
//                def.resolve();
//            }
//        });
//        return def.promise;
//    };
//
//    //return {
//    //    getAll: getAll,
//    //    getById: getById,
//    //    create: create,
//    //    deleteById: deleteById
//    //};
//};