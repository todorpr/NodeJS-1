
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(req, res){
    //console.log("refreshed");
    res.render('index');
});

//io.on('connection', function(socket){
//    socket.on('chat message', function(msg){
//        console.log('message: ' + msg);
//    });
//});

io.on('connection', function(socket){
    socket.on('chat message', function(msg){
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});