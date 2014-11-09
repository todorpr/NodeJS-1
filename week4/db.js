var snippetModel = require('./models/snippet.js');

module.exports = function(mongoose, q){

    var Snippet = snippetModel;

    var findAll = function(){
        var def = q.defer();
        Snippet.find({}, function(err, all){
            if (err) {
                def.reject(new Error(err));
            } else {
                def.resolve(all);
            }
        });
        return def.promise;
    };

    var findAllByName = function(name){
        var def = q.defer();
        Snippet.find({ creator: name }, function(err, all){
            if (err) {
                def.reject(new Error(err));
            } else {
                def.resolve(all);
            }
        });
        return def.promise;
    };

    var create = function(data){
        var def = q.defer();
        var snippet = new Snippet({
            language: data.language,
            fileName: data.fileName,
            code: data.code,
            creator: data.creator
        });
        snippet.save(function (err) {
            if (err) {
                console.log(err);
                def.reject(new Error(err));
            } else {
                def.resolve();
            }
        });
        return def.promise;
    };

    return {
        findAll: findAll,
        findAllByName: findAllByName,
        create: create
    };
};