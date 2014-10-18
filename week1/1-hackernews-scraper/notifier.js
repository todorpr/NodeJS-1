/**
 * Created by Todor on 10/14/2014.
 */
var express = require("express");
var http = require("http");
var https = require("https");
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');
var Mailgun = require('mailgun-js');

var api_key = 'key-97c70f32b639db8a9b39f0f541f56677';
var domain = 'sandbox0f81ec7d7a0746f4adf1514aec78e0d1.mailgun.org';
var from_who = 'asadasdasdsadasdd@gmail.com';

var subscribers = {};
var articles = {};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var json = {};
var count = 0;
app.get('/newArticles', function(req, res){
    res.send('Notifier pinged ' + count);
    count++;
    //readArticles();
    //sendMail();
});

app.listen(3333);
//sendMail();
readSubscribers();


//function readArticles(){
//    fs.readFile("articles.json", function (err, data) {
//        if (err) throw err;
//        var content = JSON.parse(data.toString());
//        articles = content;
//    });
//}

function createArticlesJson(){
    fs.writeFile("articles.json", JSON.stringify(json, null, 4), function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("JSON saved to config.json");
        }
    });
}


function sendMail(email, html){
     var mailgun = new Mailgun({apiKey: api_key, domain: domain});

    var data = {
      from: from_who,
      to: email,//'tprikumov@gmail.com',
      subject: 'Hello from Mailgun',
      html: html//'Hello, This is not a plain-text email, I wanted to test some spicy Mailgun sauce in NodeJS! <a href="http://0.0.0.0:3030/validate>Click here to add your email address to a mailing list</a>'
    };

    mailgun.messages().send(data, function (err, body) {
        if (err) {
            console.log("got an error: ", err);
        } else {
            console.log(body);
        }
    });
}

function readSubscribers(){
    fs.readFile("subscribrers.json", function (err, data) {
        if (err) throw err;
        //console.log(data.toString());
        var subscr = JSON.parse(data.toString());
        subscribers = subscr;
        readArticles();
    });
}

function readArticles(){
    fs.readFile("articles.json", function (err, data) {
        if (err) throw err;
        //console.log(data.toString());
        var art = JSON.parse(data.toString());
        articles = art;
        matchSubscribersArticles();
    });
}

function matchSubscribersArticles(){

    subscribers.forEach(function(val){
        var singleMail = {}, keys = {};
        val.keywords.forEach(function(keyword){
            var matched = findMatchedArticles(keyword);
            if(matched.length > 0){
                keys.keyword = findMatchedArticles(keyword);
            }
        });
        if(Object.keys(keys).length > 0){
            singleMail.email = val.email;
            singleMail.keys = keys;
            var html = prepareHtmlForEmails(keys);
            sendMail(singleMail.email, html);
        }
    })
}

function findMatchedArticles(keyword){
    var matchingArticles = [];
    Object.keys(articles).forEach(function(val, index){
        if(articles[val].type == "story"){
            if(articles[val].title.toLowerCase().indexOf(keyword.toLowerCase()) > -1){
                matchingArticles.push(articles[val]);
            }
        }
        //articles[val].processed = true;
    });
    return matchingArticles;
}

function prepareHtmlForEmails(matchingArticles){
    var html = "<h1>Latest articles from Hacker News:</h1>h1>";
    Object.keys(matchingArticles).forEach(function(articlesForKeyword){
        html += "<h2>Articles for keyword: " + matchingArticles.keyword + "</h2>";
        articlesForKeyword.forEach(function(art){
            html += "<p><a href='" + art.url + "'>" + art.title + "</a></p>"

        })
    });

    return html;
}