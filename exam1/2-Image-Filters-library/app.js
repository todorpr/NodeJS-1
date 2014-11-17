var convolution = require('./convolution'),
    xMarksTheSpot = [
        [1, 0, 1],
        [0, 1, 0],
        [1, 0, 1]
    ],
    verticalBlur = [
        [0, 0.5, 0],
        [0,   0, 0],
        [0,   1, 0]
    ];

convolution.monochrome.edgeDetection(xMarksTheSpot).then(function(processedImage){
    console.log("edgeDetection:");
    console.log(processedImage);
});

convolution.monochrome.boxBlur(xMarksTheSpot).then(function(processedImage){
    console.log("boxBlur:");
    console.log(processedImage);
});

convolution.rgb.applyKernel(xMarksTheSpot, verticalBlur).then(function(processedImage){
    console.log("applyKernel:");
    console.log(processedImage);
});

