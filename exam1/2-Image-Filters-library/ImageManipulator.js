var Q = require('q');
function ImageManipulator(){
}

ImageManipulator.prototype.edgeDetection = function(imageData){
    var def = Q.defer();

    var kernel = [
        [-1, -1, -1],
        [-1,  9, -1],
        [-1, -1, -1]
    ];
    console.log(this.isRgb);
    def.resolve(this.convolve(imageData, kernel));

    return def.promise;
};

ImageManipulator.prototype.boxBlur = function(imageData){
    var def = Q.defer();
    var kernel = [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1]
    ];
    var factor = 1/9;

    def.resolve(this.convolve(imageData, kernel, factor));

    return def.promise;
};

ImageManipulator.prototype.applyKernel = function(imageData, kernel){
    var def = Q.defer();

    def.resolve(this.convolve(imageData, kernel));

    return def.promise;
};

ImageManipulator.prototype.convolve = function(img, ker, fact){
    var that = this;
    var factor = fact || 1;

    var diff = Math.floor(ker[0].length / 2);
    var arr = [];
    for(var r = 0; r < img[0].length; r += 1){
        var subArr = [];
        for(var c = 0; c < img[0].length; c += 1){

            var subSum = 0;
            for(var krKer = 0, krImg = (r - diff); krKer < ker[0].length; krImg += 1, krKer +=1){
                for(var kcKer = 0, kcImg = (c - diff); kcKer < ker[0].length; kcImg += 1, kcKer +=1){
                    subSum += (krImg < 0 || kcImg < 0 || kcImg > img[0].length - 1 || krImg > img[0].length - 1 ? 0 : (img[krImg][kcImg] * ker[krKer][kcKer] * factor))

                }
            }
            subArr.push(subSum);
        }
        arr.push(subArr);
    }
    //console.log(arr);
    console.log("Is RGB: ", this.isRgb);
    return arr;
};

module.exports = ImageManipulator;