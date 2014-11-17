var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var mapSchema = new Schema({
    "status": String,
    "sitemap": {
        "url": String,
        "links": Array
    }
});

module.exports =  mongoose.model('Maps', mapSchema);