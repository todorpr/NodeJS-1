var express  = require('express');
var app      = express();
var port     = process.env.PORT || 7070;
var mongoose = require('mongoose');
var flash    = require('connect-flash');
var morgan       = require('morgan');
var path = require('path');

var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var passport = require('passport');

require('./config/config.js');
require('./passport')(passport);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

app.use(session({    secret: "whatever"   }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./routes.js')(app);

app.listen(port);
console.log('The magic happens on port ' + port);
