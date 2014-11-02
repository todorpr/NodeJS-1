/**
 * Created by Todor on 10/18/2014.
 */
var express = require("express"),
    http = require("http"),
    https = require("https"),
    Q = require("q");
var app = express();
var fs = require("fs");
var natural = require('natural'),
    tokenizer = new natural.WordTokenizer();

// Global vars
var keywordsFileObj = {};
var startScrapingFrom = 1;
var currentItem = startScrapingFrom;
var stopScrapingAt = 10;
var step = 1000;
var keywordBag = [];
var urlR;// = "https://hacker-news.firebaseio.com/v0/item/" + currentItem + ".json";
var news = [];

function scrapeKeywords(){
    setTimeout(function(){
        https.get(url, function(res){
            console.log(currentItem);
            console.log(res);

            currentItem++;
            scrapeKeywords();
        });
    }, 100);
}

var loadBody = function (res) {
    var deferred = Q.defer();
    var body = "";
    res.on("data", function (chunk) {
        body += chunk;
    });
    res.on("end", function () {
        //console.log(body);
        deferred.resolve(body);
    });
    return deferred.promise;
};
var httpGet = function (opts) {
    var deferred = Q.defer();
    https.get(opts, deferred.resolve);
    return deferred.promise;
};

// chain-loop.js
var redirectGet = function (uri) {
    return httpGet(uri).then(function (res) {

        var body = "";
        if (res.statusCode == 200 && currentItem <= stopScrapingAt) {
            res.on("data", function(chunk) {
                //console.log("BODY: " + chunk);
                body += chunk;
            });
            res.on("end", function(){
                var hackerNews = JSON.parse(body);
//                if(hackerNews.title){
//                    var titleArr =  hackerNews.title.trim().replace(/[.!?;:']]/g, "").split(" ");
//                    console.log(titleArr);
//                    keywordBag = keywordBag.concat(titleArr);
//                    //console.log(titleArr);
//                }
//                if(hackerNews.text){
//                    var textArr = hackerNews.text.trim().replace(/[.!?;:']/g, "").split(" ");
//                    console.log(textArr);
//                    keywordBag = keywordBag.concat(textArr);
//                }

                news.push(hackerNews);
            });
            keywordsFileObj.lastScrapedItem = currentItem;
            console.log("Scraped Hacker News Item: ", currentItem);
            currentItem++;
            var newUrl = "https://hacker-news.firebaseio.com/v0/item/" + currentItem + ".json";
            return redirectGet(newUrl);
        } else {
            keywordsFileObj.keywords = keywordsFileObj.keywords.concat(keywordBag);
            keywordsFileObj.news = keywordsFileObj.news.concat(news);
            //console.log(keywordBag);
            return res;
        }
    });
};
var getBody = function (uri) {
    return redirectGet(uri).then(loadBody);
};

function loadKeywordsFile(){
    var def = Q.defer();
    fs.readFile("histogram.json", function(err, data){
        def.resolve(data.toString());
    });
    return def.promise;
}

function writeToFile(){
    fs.writeFile("histogram.json", JSON.stringify(keywordsFileObj, null, 4), function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("JSON saved to histogram.json");
        }
    });
}

var start;
var loadedKeywords = loadKeywordsFile();
loadedKeywords.then(function(data){
    console.log("raz");
    console.log("Scraping started on: ", new Date());
    start = new Date().getTime();
    keywordsFileObj = JSON.parse(data);
    currentItem = keywordsFileObj.lastScrapedItem ? ++keywordsFileObj.lastScrapedItem : startScrapingFrom;
    stopScrapingAt = currentItem + step;
    //keywordsFileObj.keywords = keywordBag;
}).then(function(){
    console.log("dva");
    urlR = "https://hacker-news.firebaseio.com/v0/item/" + currentItem + ".json";
    var aaa = getBody(urlR);
    aaa.then(function(w){
        console.log("tri");
        writeToFile();
        console.log("Scraping finished on: ", new Date());
        console.log(((new Date().getTime() - start) / 1000) + " seconds");
    });
}).then(function(){
    //console.log(keywordBag);
});

//var sentence = "your dog has! fleas dog t dog...".replace(/[.!]/g, "").split(" ");
//
//// way to get unique items from an array
//function uniq(a) {
//    var prims = {"boolean":{}, "number":{}, "string":{}}, objs = [];
//
//    return a.filter(function(item) {
//        var type = typeof item;
//        if(type in prims)
//            return prims[type].hasOwnProperty(item) ? false : (prims[type][item] = true);
//        else
//            return objs.indexOf(item) >= 0 ? false : objs.push(item);
//    });
//}
//var newSentence = uniq(sentence);
//console.log(newSentence);
//console.log(tokenizer.tokenize("your dog has fleas dog t dog."));