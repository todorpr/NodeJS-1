var Monochrome = require('./Monochrome'),
    Rgb = require('./Rgb');

module.exports = {
    monochrome: new Monochrome(false),
    rgb: new Rgb(true)
};