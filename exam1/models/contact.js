var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var contactSchema = new Schema({
    "phoneNumber": String,
    "personalIdentifier": String
});

module.exports =  mongoose.model('Contacts', contactSchema);