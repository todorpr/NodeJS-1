var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var groupSchema = new Schema({
    "groupName": String,
    "contacts": Array
});

module.exports =  mongoose.model('Groups', groupSchema);