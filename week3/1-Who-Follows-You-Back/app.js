var request = require("request");
var express = require("express"),
    app = express()
    bodyParser = require("body-parser");

var Graph = require("./graph");
var graph1 = new Graph();

var client_id = "73f78a2a79c6879ca6c4";
var client_secret = "08dc061f1558f003523218ba4140d976292d0cac";
var auth = "?client_id=" + client_id + "&client_secret=" + client_secret;
var url = "https://api.github.com/users/ariya";
url += auth;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var options = {
    url: url,
    headers: {
        'User-Agent': 'request'
    }
};

request(options, function (error, response, body) {
    console.log(response);
    if (!error && response.statusCode == 200) {
        console.log(body) // Print the google web page.
    }
});


graph1.getNeighborsFor();
graph1.pathBetween();
graph1.toString();