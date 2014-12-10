var mongoose = require('mongoose');

var roomSchema = mongoose.Schema({
    name        : String,
    author: String,
    users: Array
});

module.exports = mongoose.model('Room', roomSchema);