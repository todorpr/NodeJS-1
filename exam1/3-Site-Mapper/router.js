var express = require('express'),
    Sitemap = require('./Sitemap'),
    Maps = require('./models/map');


    var map = new Sitemap();
    var router = express.Router();
    // request must be in format
    // http://localhost:3000/sitemap?id=546a1573cf5b687c120b71bf
    router.get('/sitemap', function(req, res){
        Maps.findOne({ "_id": req.query.id }, function(err, sitemap){
            if(map.isCrawling){
                res.send({"status": "currently crawling"})
            } else {
                res.send(sitemap);
            }
        });

    });

    router.post('/map', function(req, res){
        map.url = req.body.url;
        map.findMap(req.body.url).then(function(sitemap){
            if(sitemap){
                res.send(sitemap);
            } else {
                map.isCrawling = true;
                console.log("Crawling started...");
                map.createMap(req.body.url).then(function(id){
                    res.send({ _id: id});
                    console.log("Crawling finished!");
                });
            }
        })
    });

module.exports = router;
