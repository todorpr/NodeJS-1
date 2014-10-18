var http = require("http");
var json = {};
var thirdArg = process.argv[2];
var forthArg = process.argv[3];

//$ node chirp_client.js --register --user=RadoRado --> POST /register
//    <Response from the API here>

//$ node chirp_client.js --getall --> GET /all_chirps
//<RETURNS ALL CHIRPS IN JSON FORMAT>

//$ node chirp_client.js --getself --> GET /my_chirps
//<RETURNS ALL CHIRPS IN JSON FORMAT>

//$ node test-client.js --create --message="Relationship status: пътувам с автобус"
//    <RESPONSE FROM API WITH CHIRP ID> --> POST /chirp

//$ node chirp_client.js --delete --chirpid=12 --> DELETE /chirp
//    <RESPONSE FROM API>

function getApiPath(arg){
    var pathMethod = {};
    switch(arg){
        case "--register":
            pathMethod.path = "/register";
            pathMethod.method = "POST";
            break;
        case "--getall":
            pathMethod.path = "/all_chirps";
            pathMethod.method = "GET";
            break;
        case "--getself":
            pathMethod.path = "/my_chirps";
            pathMethod.method = "GET";
            break;
        case "--create":
            pathMethod.path = "/chirp";
            pathMethod.method = "POST";
            break;
        case "--delete":
            pathMethod.path = "/chirp";
            pathMethod.method = "DELETE";
            break;
    }
    return pathMethod;
}

var options = {
    hostname: 'localhost',
    port: 8080,
    path: getApiPath(thirdArg).path,
    method: getApiPath(thirdArg).method
};

var req = http.request(options, function(res) {

});
req.on('error', function(e) {
    console.log('problem with request: ' + e);
});

var body = {};
if(forthArg && forthArg.indexOf("=") > -1){
    var keyVal = forthArg.split("=");
    var key = keyVal[0].replace("-","").replace("-","");
    var val = keyVal[1];
    body[key] = val;
    req.write(JSON.stringify(body));
}
req.end();
