var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var codeSnippetSchema = new Schema({
    "language": String,
    "fileName": String,
    "code": String,
    "creator": String
});

module.exports =  mongoose.model('Snippet', codeSnippetSchema);