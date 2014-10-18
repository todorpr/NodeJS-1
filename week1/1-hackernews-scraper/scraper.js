var express = require("express");
var http = require("http");
var https = require("https");
var app = express();
var fs = require("fs");

var currentMax,
    newMax = 8452385,
    newMaxItem;

var json = {};

var content = fs.readFileSync('articles.json', 'utf8');
var oldContent = JSON.parse(content.toString());
currentMax = oldContent.maxItem || 8452380;

function interval(){
    console.log(new Date().getSeconds());
    setTimeout(function(){
        getMaxItem();
        interval();
    }, 10000)
}
interval();

function getMaxItem(){
    https.get("https://hacker-news.firebaseio.com/v0/maxitem.json", function(res) {

        res.on("data", function(chunk) {
            var body = chunk.toString();
            json.maxItem = JSON.parse(body);
            newMaxItem = parseInt(body);
            if(newMaxItem > currentMax){
                loop();
            }
        });

    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });
}
//getMaxItem();
//loop();
function loop() {
    if(currentMax <= newMaxItem){
        https.get("https://hacker-news.firebaseio.com/v0/item/" + currentMax + ".json", function(res) {
            //if(err) throw err;
//            if (res.statusCode == 200) {
//                console.log(res.body)
//            }
            var body = "";
            res.on("data", function(chunk) {
                //console.log("BODY: " + chunk);
                body += chunk;
            });
            res.on("end", function(){
                //console.log(body);
                json[currentMax] = JSON.parse(body);
                json[currentMax].processed = false;
            });

            currentMax++;
            loop();
        });
    } else {
        if(fs.existsSync("articles.json")){
            readFileScraper();
        } else {
            createArticlesJson();
        }
        pingNotifier();
    }
}

function pingNotifier(){
    app.get('http://localhost:3333/newArticles', function(req, res){

    })
}

function createArticlesJson(){
    fs.writeFile("articles.json", JSON.stringify(json, null, 4), function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("JSON saved to config.json");
        }
    });
}

function readFileScraper(){
    fs.readFile("articles.json", function (err, data) {
        if (err) throw err;
        //console.log(data.toString());
        var oldContent = JSON.parse(data.toString());
        console.log(oldContent.maxItem);
        var merged = extend({}, oldContent, json);
        json = merged;
        createArticlesJson();
    });
}

function extend(target) {
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source) {
        for (var prop in source) {
            target[prop] = source[prop];
        }
    });
    return target;
}