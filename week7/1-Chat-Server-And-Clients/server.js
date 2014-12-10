var express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);
require('./config/config.js');
var Chat = require('./Chat');

server.listen(8080);

var usernames = {};


var chat = new Chat();

io.sockets.on('connection', function (socket) {
    socket.on('adduser', function(username){
        chat.getRooms().then(function (rooms) {
            socket.username = username;
            socket.room = rooms[0].name;
            usernames[username] = username;
            socket.join(rooms[0].name);
            socket.emit('updatechat2', 'SERVER', 'you have connected to ' + rooms[0].name);
            socket.broadcast.to(rooms[0].name).emit('updatechat2', 'SERVER', username + ' has connected to this room');

            socket.emit('updaterooms', rooms, rooms[0].name);
        })
    });

    socket.on('sendchat', function (data) {
        console.log(data);
        io.sockets.in(socket.room).emit('updatechat', socket.username, data);
    });

    socket.on('switchRoom', function(newroom){
        socket.leave(socket.room);
        socket.join(newroom);
        socket.emit('updatechat2', 'SERVER', 'you have connected to '+ newroom);
        socket.broadcast.to(socket.room).emit('updatechat2', 'SERVER', socket.username +' has left this room');
        socket.room = newroom;
        socket.broadcast.to(newroom).emit('updatechat2', 'SERVER', socket.username +' has joined this room');
        chat.getRooms().then(function (rooms) {
            socket.emit('updaterooms', rooms, newroom);
        });
    });


    socket.on('disconnect', function(){
        delete usernames[socket.username];
        io.sockets.emit('updateusers', usernames);
        socket.broadcast.emit('updatechat2', 'SERVER', socket.username + ' has disconnected');
        socket.leave(socket.room);
    });
});
