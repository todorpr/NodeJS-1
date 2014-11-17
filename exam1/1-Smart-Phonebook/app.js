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

require('./config');
var router = require('./router');
app.use("/", router);

app.listen(8000);
console.log("Server listening on port 8000");

module.exports = app;
