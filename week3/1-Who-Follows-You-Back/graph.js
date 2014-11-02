var DirectedGraph = (function() {

    function addEdge(nodeA, nodeB){

    }

    function getNeighborsFor(node){
        console.log("getNeighborsFor");
    }

    function pathBetween(nodeA, nodeB){
        console.log("pathBetween");
    }

    function toString(){
        console.log("toString");
    }

    return {
        addEdge: addEdge,
        getNeighborsFor: getNeighborsFor,
        pathBetween: pathBetween,
        toString: toString
    }
});

module.exports = DirectedGraph;

function Graph(node){
    this.node = node;
}

Graph.prototipe.addNode = function(node){

}

var g = new Graph([]);

Object.keys(g);

g.addNode(node) === Object.getPrototipeOf(g).addNode.call(g, node);

