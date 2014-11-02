var express = require("express");
var app = express();
var MongoClient = require('mongodb').MongoClient,
    Q = require("q"),
    bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.all("*", function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", ["X-Requested-With", "Content-Type", "Access-Control-Allow-Methods"]);
    res.header("Access-Control-Allow-Methods", ["GET"]);
    next();
});

app.get("/locations", function(req, res){
    console.log(req.query);
    getAllLocations("features", req.query)
        .then(function(locations){
        res.send(locations);
    });
});

app.post('/locations', function (req, res) {
    var newLocation = req.body;
    console.log(newLocation);
    setNewLocation("features", newLocation);
});

app.listen(7777);
console.log("Server started on port 7777");

var dbPath = "mongodb://localhost:27017/geo-saveit";//"mongodb://geouser:123456%@ds049170.mongolab.com:49170/geo"; //

function setNewLocation(collectionName, body){
    MongoClient.connect(dbPath, function(err, db) {
        if (err) {
            console.log("Error saving location...");
            def.reject(new Error(err));
        } else {
            var collection = db.collection(collectionName);
            insertInDb(collection, db, body);
        }
    });
}

var insertInDb = function(collection, db, newLocation){
    var location = {
        name: newLocation.name,
        tags: newLocation.tags,
        geometry: {
            "type": "Point",
            "coordinates": [
                parseFloat(newLocation.position.lng),
                parseFloat(newLocation.position.lat)
            ]
        }
    };
    collection.insert(location, function(err, result){
        if (err) {
            console.log(err);
            def.reject(new Error(err));
        }
        console.log("Location inserted successfully");
        db.close();
    })
};

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

    var range = parseInt(query.range) * 1000; // meters to kilometers
    var positionLng = parseFloat(query.position.lng);
    var positionLat = parseFloat(query.position.lat);
    var tags = query.tags;
    //console.log(typeof positionLng);

    var all = collection.find({
//        geometry: {
//            $nearSphere: {
//                $geometry: {
//                    type : "Point",
//                    //coordinates : [ 23.363388061261503, 42.658113414012334 ]
//                    coordinates : [ positionLng, positionLat]
//                },
//                $maxDistance: range //50000
//            }
//        }
//        },
//        {
//            "properties.name": 1,
//            "geometry.coordinates": 1
//        });
        geometry: {
            $nearSphere: {
                $geometry: {
                    type: "Point",
                    coordinates : [ positionLng, positionLat]
                },
                $maxDistance: range
            }
        }
    });
    all.toArray(function(err, docs){

        if (err) {
            console.log("Error: ", err);
            def.reject(new Error(err));
        } else {
            //console.log(docs);
            var points = [];
//            docs.forEach(function(val, i){
//                //console.log(val.geometry.coordinates[0][0]);
//                points.push({
//                    name: val.properties.name,
//                    coordinates: val.geometry.coordinates[0][0]
//                })
//            });
            docs.forEach(function(val, i){
                //console.log(val.geometry.coordinates[0][0]);
                points.push({
                    name: val.name,
                    coordinates: val.geometry.coordinates
                })
            });
            console.log(points);
            def.resolve(points);
            db.close();
        }

    });
    return def.promise;
};

