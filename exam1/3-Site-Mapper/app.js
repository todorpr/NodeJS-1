var express = require('express'),
    request = require('request'),
    app = express(),
    bodyParser = require("body-parser");
    config = require('./config/config.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var router = require('./router');
app.use("/", router);

app.listen(3000);
console.log("Server listening on port 3000");