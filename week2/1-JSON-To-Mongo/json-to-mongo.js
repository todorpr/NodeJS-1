var config = require('./config.json');
var people = require('./people.json');
var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');
// Connection URL
var url = config.mongoConnectionUrl;
var collectionName = process.argv[2].replace(".json", "") || "people";

// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    var collection = db.collection(collectionName);
    //findInDb(collection, db);
    insertInDb(collection, db);
});

var findInDb = function(collection, db){
    var all = collection.find({});
    all.toArray(function(err, docs){
        assert.equal(err, null);
        console.log(docs);
        db.close();
    });
};

var insertInDb = function(collection, db){
    collection.insert(people, function(err, result){
        assert.equal(err, null);
        console.log("Collection inserted successfully");
        db.close();
    })
};