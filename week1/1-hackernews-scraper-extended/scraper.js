var express = require("express");
var http = require("http");
var https = require("https");
var app = express();
var fs = require("fs");
var Q = require("q");

var currentMax,
    newMaxItem;

var json = {};

var content = fs.readFileSync('articles.json', 'utf8');
var oldContent = JSON.parse(content.toString());
currentMax = oldContent.maxItem || 8547766;

var loopRunning = false;
function interval(){
    getMaxItem().then(function(){
        setTimeout(function(){
            if(!loopRunning){
                interval();
            }
        }, 60000)
    });
}
interval();

function getMaxItem(){
    var def = Q.defer();
    https.get("https://hacker-news.firebaseio.com/v0/maxitem.json", function(res) {

        res.on("data", function(chunk) {
            var body = chunk.toString();
            json.maxItem = JSON.parse(body);
            newMaxItem = parseInt(body);
            if(newMaxItem > currentMax && !loopRunning){
                loopRunning = true;
                console.log("loop from: ", currentMax);
                loop();
            } else {
                loopRunning = false;
                console.log("no new items");
            }
            def.resolve();
        });

    }).on('error', function(e) {
        console.log("Got error: " + e.message);
        def.reject();
    });
    return def.promise;
}

function loop() {
    if(currentMax <= newMaxItem){
        https.get("https://hacker-news.firebaseio.com/v0/item/" + currentMax + ".json", function(res) {

            var body = "";
            res.on("data", function(chunk) {
                body += chunk;
            });
            res.on("end", function(){
                console.log(currentMax);

                json[currentMax] = JSON.parse(body);
                if(json[currentMax] != null){
                    json[currentMax].processed = false;
                }
                currentMax++;
                loop();

            });
        });
    } else {
        loopRunning = false;
        if(fs.existsSync("articles.json")){
            readFileScraper();
        } else {
            createArticlesJson();
        }
        pingNotifier();
        interval();
    }
}

function pingNotifier(){
    http.get("http://localhost:3333/newArticles", function(res) {
        console.log("Notifier pinged: ");
        console.log(res);
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });
}

function createArticlesJson(){
    fs.writeFile("articles.json", JSON.stringify(json, null, 4), function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("Articles updated");
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