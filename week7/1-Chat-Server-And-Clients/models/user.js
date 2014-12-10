var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
        username        : String,
        password     : String,
        rooms: Array,
        current: String
    });

module.exports = mongoose.model('User', userSchema);
