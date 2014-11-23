var express = require('express')
  , passport = require('passport')
  , util = require('util'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    methodOverride = require('method-override');

var app = express();
require('./config');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(bodyParser());
app.use(methodOverride());
app.use(session({ secret: 'web magic' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));

var p = require('./passport')(passport);
var router = require('./routes.js')(express, passport);
app.use("/", router);

app.listen(3000);
console.log("Server started on port 3000");


