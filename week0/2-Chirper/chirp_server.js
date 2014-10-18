var http = require('http'),
    fs = require("fs");
var json = {};
var db = {
    "all_users": [],
    "all_chirps": []
};
if(!fs.existsSync("config.json")){
    json = {
        "api_url": "http://localhost:8080"
    };
    createConfigJson();
} else {
    fs.readFile("config.json", function (err, data) {
        if (err) throw err;
        json = JSON.parse(data.toString());
    });
}

var allChirps = [];
http.createServer(function (req, res) {
    var body = "";
    req.on('data', function(chunk) {
        body += chunk.toString();
    });

    req.on('end', function() {
        var bodyArg;
        console.log(typeof body);
        if(body){
            bodyArg = JSON.parse(body);
        }
        var result = handleApiRequests(req.url, req.method, bodyArg);
        console.log(result);
        if(!json.user && !json.key){
            res.writeHead(403);
            res.end();
        } else {
            res.writeHead(200, "OK", {'Content-Type': 'application/json'});
            createConfigJson();
            createDbJson();
            res.end(JSON.stringify(result));
        }
    });

}).listen(8080);

function handleApiRequests(url, method, data){
    switch(url){
        case "/all_chirps":
            return getAllChirps();
            break;
        case "/chirp":
            if(method === "POST"){
                return createChirp(data);
            } else if (method == "DELETE"){
                return deleteChirp(data);
            }
            break;
        case "/all_users":
            return getAllUsers();
            break;
        case "/register":
            json.user = data.user;
            json.key = generateKey();
            registerUser(data);
            return json.key;
            break;
        case "/my_chirps":
            return getMyChirps();
            break;
        case "/chirps":
            // TODO
            break;
    }
}

function deleteChirp(data){
    var id = data.chirpid;
    if(json.user && json.key){
        var chirps = db.all_chirps;
        var targetIndex = -1;
        var username = "";
        Object.keys(chirps).forEach(function (index) {
            var chirpId = chirps[index].chirpId;
            if(chirpId.toString() == id){
                targetIndex = index;
                var userId = db.all_chirps[index].userId;
                username = getUsernameByUserId(userId);
            }
        });
        if(username == json.user){
            db.all_chirps.splice(targetIndex, 1);
            return id;
        } else {
            return "-1";
        }
    }
}

function getMyChirps(){
    if(json.user && json.key){
        var chirps = [];
        Object.keys(db.all_chirps).forEach(function (index) {
            var userId = db.all_chirps[index].userId;
            var username = getUsernameByUserId(userId);
            if(username == json.user){
                chirps.push(db.all_chirps[index]);
            }
        });

        return chirps;
    }
}

function getUsernameByUserId(id){
    var username = "";
    Object.keys(db.all_users).forEach(function (index) {
        if(db.all_users[index].userId == id){
            username = db.all_users[index].user;
        }
    });

    return username;
}

function createChirp(data){
    if(json.user && json.key){
        var id = getAllChirpsCount();
        var newChirp = {
            "userId": getUserId(),
            "chirpId": id,
            "chirpText": data.message,//"Търсим нов служител. Нужно е да е наполовина човеко-прасе, наполовина - мечка. Желание за работа с #WordPress е многу от съществено значка.",
            "chirpTime": new Date()
        };

        db.all_chirps.push(newChirp);

        return id;
    }
}

function getUserId(){
    if(!db.all_users){
        db.all_users = [];
    }
    var userId;
    if(json.user && json.key && db.all_users.length > 0){
        Object.keys(db.all_users).forEach(function (index) {
            if(db.all_users[index].user == json.user){
                userId = db.all_users[index].userId;
            } else {
                userId = db.all_users.length + 1;
            }
        });
    } else {
        userId = db.all_users.length + 1;
    }
    return userId;
}

function getAllChirpsCount(){
    return db.all_chirps.length + 1;
}

function getAllChirps(){
    return db.all_chirps;
}

function getAllUsers(){
    return db.all_users;
}

function getUserChirps(){
    var userId = getUserId();
    if(!db.all_chirps){
        db.all_chirps = [];
    }
    var chirpsCount = 0;
    db.all_chirps.forEach(function(val, index){
        if(val.userId == userId){
            chirpsCount++;
        }
    });

    return chirpsCount;
}


function registerUser(data){
    var newUser = {
        "user": data.user,
        "userId": getUserId(),
        "chirps": getUserChirps()
    };
    db.all_users.push(newUser);
}

function generateKey()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 8; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function createConfigJson(){
    fs.writeFile("config.json", JSON.stringify(json, null, 4), function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("JSON saved to config.json");
        }
    });
}
function createDbJson(){
    fs.writeFile("db.json", JSON.stringify(db, null, 4), function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("JSON saved to db.json");
        }
    });
}

function extend(target) {
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source) {
        for (var prop in source) {
            target[prop] = source[prop];
        }
    });
    return target;
}

