var Rooms = require('./models/chat');
var Users = require('./models/user');
var q = require('q');

function Chat() {}

Chat.prototype.getRooms = function () {
    var def = q.defer();
    Rooms.find({}, function(err, rooms){
        if(err) console.log(err);

        console.log(rooms);
        def.resolve(rooms);
    });
    return def.promise;
};

Chat.prototype.createRoom = function (req) {
    var def = q.defer();
    var room = new Rooms({
        name: req.body.name,
        author: req.user._id,
        users: [req.user._id]
    });
    this.updateUserData(req.user._id, req.body.name);
    room.save(function (err) {
        if (err) {
            console.log(err);
        } else {
            def.resolve();
        }
    });
    return def.promise;
};

Chat.prototype.updateUserData = function (id, room) {
    var def = q.defer();
    Users.findById(id, function (err, user){
        if(err) console.log(err);

        console.log(user);
        if(user){
            user.rooms.push(room);
            user.current = room;
            user.save();
        }
        def.resolve(user);
    });
    return def.promise;
};

module.exports = Chat;