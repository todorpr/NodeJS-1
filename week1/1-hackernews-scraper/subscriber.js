/**
 * Created by Todor on 10/14/2014.
 */
//    POST /subscribe - as explained above, this creates a new subscriber
//    POST /unsubscribe - takes a JSON payload with a single "subscriberId" and unsubscribes it if possible
//    GET /listSubscribers - returns a list of all subscribers with their emails, ids and keywords. This is great for testing purposes
var express = require("express");
var http = require("http");
var https = require("https");
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');

var subscribers = [];
var content = fs.readFileSync('subscribrers.json', 'utf8');
var subscr = JSON.parse(content.toString());

subscribers = subscr;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/listSubscribers', function(req, res){
    res.send(subscribers);
});

app.post('/subscribe', function (req, res) {
    var subscriber = req.body;
    subscribers.push(subscriber);
    createSubscriberJson();
//    res.json({
//        'chirpId': data.length - 1,
//    });
});

app.listen(7777);

function createSubscriberJson(){
    fs.writeFile("subscribrers.json", JSON.stringify(subscribers, null, 4), function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("JSON saved to subscriber.json");
        }
    });
}