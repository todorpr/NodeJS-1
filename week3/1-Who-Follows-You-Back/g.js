function Graph(v) {
    this.edges = 0;
    this.adj = {};
    this.edgeTo = {};
    this.addEdge = addEdge;
    this.showGraph = showGraph;
    this.bfs = bfs;
    this.pathTo = pathTo;
    this.hasPathTo = hasPathTo;
}

function addEdge(v, w) {
    if(this.adj[v]){
        if(this.adj[v].followers){
            this.adj[v].followers.push(w);
        } else {
            this.adj[v].followers = [];
            this.adj[v].followers.push(w);
        }
    } else {
        this.adj[v] = {};
        this.adj[v].followers = [];
        this.adj[v].followers.push(w);
    }
    this.adj[v].marked = false;

    if(this.adj[w]){
        if(this.adj[w].followers){
            this.adj[w].followers.push(v);
        } else {
            this.adj[w].followers = [];
            this.adj[w].followers.push(v);
        }
    } else {
        this.adj[w] = {};
        this.adj[w].followers = [];
        this.adj[w].followers.push(v);
    }
    this.adj[w].marked = false;
    this.edges++;
}

function showGraph() {
    var that = this;
    Object.keys(this.adj).forEach(function(key, i){
        var str = "";
        str += key + " -> ";
        that.adj[key].followers.forEach(function(k, i){
            str += [k] + ' ';
        });
        console.log(str);
    });
}

var count = 0;
function bfs(s) {
    var queue = [];
    this.adj[s].marked = true;
    queue.push(s); // add to back of queue

    while (queue.length > 0) {
        var v = queue.shift(); // remove from front of queue
        console.log("Visited vertex: " + v);

        for(var i = 0;i < this.adj[v].followers.length;i += 1) {
            if (!this.adj[this.adj[v].followers[i]].marked) {
                this.edgeTo[this.adj[v].followers[i]] = v;
                this.adj[this.adj[v].followers[i]].marked = true;
                queue.push(this.adj[v].followers[i]);
            }
        }
    }
    console.log(this.edgeTo);
}
function pathTo(from, to) {
    var source = to;
    if (!this.hasPathTo(from)) {
        return undefined;
    }
    var path = [];
    for (var i = from; i != source; i = this.edgeTo[i]) {
        path.push(i);
    }
    path.push(source);
    return path;
}
function hasPathTo(from) {
    return this.adj[from].marked;
}

var g = new Graph(12);
//g.addEdge(0, 1);
//g.addEdge(0, 2);
//g.addEdge(0, 3);
//g.addEdge(1, 4);
//g.addEdge(1, 5);
//g.addEdge(1, 6);
//g.addEdge(2, 7);
//g.addEdge(2, 8);
//g.addEdge(3, 9);
//g.addEdge(4, 10);
//g.addEdge(5, 11);
g.addEdge("a", "b");
g.addEdge("a", "c");
g.addEdge("a", "d");
g.addEdge("b", "e");
g.addEdge("b", "f");
g.addEdge("b", "g");
g.addEdge("c", "h");
g.addEdge("c", "i");
g.addEdge("d", "j");
g.addEdge("e", "k");
g.addEdge("f", "l");
//console.log(g.adj.length);
//g.showGraph();
//g.dfs(0);
g.bfs("a");
console.log(count);

var from = "k";
var to = "f";
var paths = g.pathTo(from, to);
var str2 = "";
while (paths.length > 0) {
    if (paths.length > 1) {
        str2 += (paths.pop() + '-');
    }
    else {
        str2 += (paths.pop());
    }
}
console.log(str2);
