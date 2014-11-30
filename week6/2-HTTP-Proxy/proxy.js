var http = require('http'),
    httpProxy = require('http-proxy');

var proxy = httpProxy.createProxyServer({});


var server = http.createServer(function(req, res) {

    // if url path is 'any' fix it to 'target'
    if (req.url.match(/any/)) {
        req.url = req.url.replace(/any/, 'target');
    }
    proxy.web(req, res, { target: 'http://localhost:5555' });
}).listen(8888);
console.log("listening on port 8888");


http.createServer(function(req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write('Url path: ' + req.url +'\nHeaders: ' + JSON.stringify(req.headers, true, 2));
    res.end();
}).listen(5555);