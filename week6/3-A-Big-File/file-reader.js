var http = require('http');
var fs = require('fs');

var filename = "big-file.txt";
var readStream = fs.createReadStream(filename);

// This will wait until we know the readable stream is actually valid before piping
var count = 0;
readStream.on('data', function(data) {
    //console.log("line called");
    var line = JSON.stringify(data).replace(/\n/g, "").replace("[", "").replace("]", "").split(",");
    //console.log(line);
    //line.rorEach(function(i){
    //    console.log(i);
    //})
    //Object.keys(line).forEach(function(i){
    //    console.log(i);
    //})
    //console.log(count++);
})

// This catches any errors that happen while creating the readable stream (usually invalid names)
readStream.on('error', function(err) {
    console.log("Error: " + err);
});

readStream.on('end', function() {
    console.log("Finished...");
});