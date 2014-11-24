var http = require('http'),
    fs = require('fs'),
    RegexTransform = require('./transform');

//var reg = /^[a-zA-Z]+$/;
var reg = /[a-zA-Z]/g; // match all letters
var regex = new RegexTransform(reg);

regex
    .on('readable', function () {
        var obj;
        while (null !== (obj = regex.read())) {
            console.log("===Chunk===");
            console.log(obj);
        }
    });

// Test the new transform stream
var filename = "input.txt";
var readStream = fs.createReadStream(filename);

readStream.on('data', function(data) {
    // populate the Regex stream with some data
    regex.write(data.toString());

});

// This catches any errors that happen while creating the readable stream (usually invalid names)
readStream.on('error', function(err) {
    console.log("Error: " + err);
});

readStream.on('end', function() {
    console.log("Finished...");
});