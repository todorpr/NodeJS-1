var fs = require('fs'),
    q = require('q');

var size = process.argv[4];
var file = process.argv[6];

var arr = [];
var data = "";
var fileName = "big-file.txt";

// empty the file first
fs.openSync(fileName, 'w');

function makeFile(){
    var rand = Math.floor(Math.random() * 100);
    //console.log(rand);
    if(rand < 20){
        arr.push("\n" + rand);
    } else {
        arr.push(rand);
    }
}

function loop(){
    for(var i = 0;i < 1000000;i+= 1){
        makeFile();
    }
    getFileSize().then(function(size){
        console.log("Size is: " + size / 1000000 + " MB");
        if(size < 100000000){ // 10 000 000 = 10MB

            fs.readFile(fileName, function (err, content) {
                if (err) throw err;
                data = content + arr.join();
                writeBigFile().then(function(){
                    loop();
                });
            });
        } else {
            data = content + arr.join();
            writeBigFile();
        }
    });
}
//console.log(typeof arr.join());
loop();


function writeBigFile() {
    var def = q.defer();

    fs.writeFile(fileName, data, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("JSON saved to big-file.txt");
            def.resolve();
        }
    });
    return def.promise;
}


function getFileSize(){
    var def = q.defer();

    fs.stat(fileName, function (err, stats) {
        def.resolve(stats.size);
    });

    return def.promise;
}



