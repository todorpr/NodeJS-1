var fs = require("fs");
var lineReader = require('line-reader');
var request = require('request');
var http = require("https");
var file = "";
if(process.argv[2]){
    file = process.argv[2];

}

if(process.argv[2].indexOf("http") > -1){
    file = file.substr(file.lastIndexOf('/') + 1);
    http.get(process.argv[2]).on('response', function (response) {
        var body = '';
        var i = 0;
        response.on('data', function (chunk) {
            i++;
            body += chunk;
        });
        response.on('end', function () {
            handleBody(body);
        });
    });
} else {
    fs.readFile(process.argv[2], function (err, data) {
        if (err) throw err;
        handleBody(data);
    });
}

function handleBody(data){

    var content = data.toString();
    var contentArr = content.split("\n");
    var json = {};
    var mainLine = "";
    for(var i = 0;i< contentArr.length;i += 1){
        if(contentArr[i] != "" && contentArr[i].indexOf(";") == -1 && contentArr[i].indexOf("/") == -1){
            if(contentArr[i].indexOf("[") > -1){
                // main
                mainLine = contentArr[i].replace("[","").replace("]","");

                json[mainLine] = {};
            } else if (contentArr[i].indexOf("=") > -1) {
                var line = contentArr[i].split("=");
                var key = line[0].toString();
                var val = line[1].toString();
                json[mainLine][key] = val;

            }
        }

    }
    var outputFilename = file.split(".")[0] + ".json";

    fs.writeFile(outputFilename, JSON.stringify(json, null, 4), function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("JSON saved to " + outputFilename);
        }
    });
}




















