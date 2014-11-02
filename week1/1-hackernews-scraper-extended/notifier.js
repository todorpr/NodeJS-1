var express = require("express");
var http = require("http");
var https = require("https");
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');
var Mailgun = require('mailgun-js');

var api_key = 'key-NUM';
var domain = 'sandbox**********************.mailgun.org';
var from_who = 'SomeWeiredeMailName@DomainName.com';

var subscribers = {};
var articles = {};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var json = {};
var count = 0;
app.get('/newArticles', function(req, res){
    res.send('Notifier pinged ' + count);
    count++;
    readSubscribers();
});

app.listen(3333);
console.log("Server running on port 3333");

function sendMail(email, html){
     var mailgun = new Mailgun({apiKey: api_key, domain: domain});

    var data = {
      from: from_who,
      to: email,//'somemail@gmail.com',
      subject: 'Hello from Mailgun',
      html: html//'Hello, This is not a plain-text email, I wanted to test some spicy Mailgun sauce in NodeJS! <a href="http://0.0.0.0:3030/validate>Click here to add your email address to a mailing list</a>'
    };

    mailgun.messages().send(data, function (err, body) {
        if (err) {
            console.log("got an error: ", err);
        } else {
            console.log("Mail sent!");
        }
    });
}

function readSubscribers(){
    fs.readFile("subscribrers.json", function (err, data) {
        if (err) throw err;
        var subscr = JSON.parse(data.toString());
        subscribers = subscr;
        readArticles();
    });
}

function readArticles(){
    fs.readFile("articles.json", function (err, data) {
        if (err) throw err;
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
                keys[keyword] = findMatchedArticles(keyword);
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
        if(typeof articles[val] != "object") return;
        if(articles[val].type == "story" && articles[val].title){
            if(articles[val].title.toLowerCase().indexOf(keyword.toLowerCase()) > -1){
                matchingArticles.push(articles[val]);
            }
        }
        //articles[val].processed = true;
    });
    return matchingArticles;
}

function prepareHtmlForEmails(matchingArticles){
    var html = "<h1>Latest articles from Hacker News:</h1>";

    if(typeof matchingArticles == "undefined") return false;

    Object.keys(matchingArticles).forEach(function (key, i) {
        html += "<h2>Articles for keyword: " + key + "</h2>";
        matchingArticles[key].forEach(function(art){

            html += "<p><a href='" + art.url + "'>" + art.title + "</a> ("+ art.url + ")</p>"

        });
    });

    return html;
}