var inherit = require('./inherit'),
    ImageManipulator = require('./ImageManipulator');

function Monochrome(sender){
    this.isRgb = sender;
}
inherit(Monochrome, ImageManipulator);

module.exports = Monochrome;
