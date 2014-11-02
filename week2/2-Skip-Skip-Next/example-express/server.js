var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var Q = require('q');
var MongoClient = require('mongodb').MongoClient;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var data = [
    {
      "rank": 1,
      "keyword": "JavaScript",
      "count": 10000
    }, {
      "rank": 2,
      "keyword": "Python",
      "count": 8000
    }, {
        "rank": 3,
        "keyword": "Aaaaaa",
        "count": 7000
    }, {
        "rank": 4,
        "keyword": "Bbbbbb",
        "count": 7600
    }, {
        "rank": 5,
        "keyword": "Cccccc",
        "count": 7080
    }, {
        "rank": 6,
        "keyword": "Ddddd",
        "count": 6000
    }, {
        "rank": 7,
        "keyword": "Eeeee",
        "count": 5000
    }, {
        "rank": 8,
        "keyword": "Jjjjjj",
        "count": 4000
    }, {
        "rank": 9,
        "keyword": "Kkkkk",
        "count": 3000
    }, {
        "rank": 10,
        "keyword": "Lllll",
        "count": 2000
    }, {
        "rank": 11,
        "keyword": "Mmmmmm",
        "count": 1000
    }
];

var start = 0;
var step = 5;
var dbPath = "mongodb://localhost:27017/keywords";

app.all("*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", ["X-Requested-With", "Content-Type", "Access-Control-Allow-Methods"]);
  res.header("Access-Control-Allow-Methods", ["GET"]);
  next();
});

app.get("/keywords", function(req, res) {
    var query = req.query;
    getAllLocations("keywords", query).then(function(keywords){
        //console.log(firstTen);
        res.json(keywords);
    });
});

app.listen(8000);

function getAllLocations(collectionName, query){
    var def = Q.defer();
    MongoClient.connect(dbPath, function(err, db) {
        if (err) {
            def.reject(new Error(err));
        } else {
            var collection = db.collection(collectionName);
            var result = findInDb(collection, db, query);
            def.resolve(result);
        }
    });
    return def.promise;
}

var findInDb = function(collection, db, query){
    var def = Q.defer();

    var all = collection.find();
    all.count(function(e, count){
        if(e) throw e;
        if(query.direction){
            if(query.direction == "next"){
                if((start + step) < count)
                    start += step;
            } else if(query.direction == "prev"){
                start -= step;
            }
        }
        //query.direction && query.direction == "next" && ((start + step) < count) && (start += step);
        if(start < 0) start = 0;

        all.sort({ count: -1}).skip(start).limit(step).toArray(function(err, docs){
            if (err) {
                console.log("Error: ", err);
                def.reject(new Error(err));
            } else {

                def.resolve(docs);
                db.close();
            }
        });
    })

    return def.promise;
};