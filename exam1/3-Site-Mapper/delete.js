var q = require('q');


var count = 0;
var promises = [];

function de(){
    var def = q.defer();

    if(count < 100){
        promises.push(de());
        count++;
        //de();
    }

    setTimeout(function(){

        def.resolve()
    }, 1000);



    return def.promise;
}

console.log("started");
q.all(promises).then(function(){
    console.log("finished");
});