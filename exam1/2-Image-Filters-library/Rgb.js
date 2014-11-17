var inherit = require('./inherit'),
    ImageManipulator = require('./ImageManipulator');

function Rgb(sender){
    this.isRgb = sender;
}

inherit(Rgb, ImageManipulator);

module.exports = Rgb;