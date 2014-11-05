var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    q = require('q'),
    path = require('path');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));

var db = require('./db.js')(mongoose, q);
var router = require('./router.js')(express, db, app);

//router.get('/', function(req, res){
//    res.render("index");
//});

app.use("/", router);

app.listen(8000);
console.log("Server listening on port 8000");

module.exports = app;
