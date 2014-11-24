var stream = require('stream');
var util = require('util');

var Transform = stream.Transform ;

function RegexTransform(regex, options) {
    // allow use without new
    if (!(this instanceof RegexTransform)) {
        return new RegexTransform(regex, options);
    }

    // init Transform
    if (!options) options = {}; // ensure object
    options.objectMode = true; // forcing object mode
    Transform.call(this, options);
    this.regex = regex;
}
util.inherits(RegexTransform, Transform);

RegexTransform.prototype._transform = function (input, enc, cb) {
    // just replace the matched values
    this.push(input.replace(this.regex, ""));

    cb();
};

module.exports = RegexTransform;
