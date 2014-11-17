var mapModel = require('./models/map'),
    request = require('request'),
    q = require('q'),
    $ = require('cheerio');

function Sitemap(){
    this.links = [];
    this.isCrawling = false;
    this.count = 0;
    this.currentMapId = null;
}

var Maps = mapModel;

Sitemap.prototype.createMap = function(urlReq){
    var def = q.defer();
    var that = this;
    var map = new Maps({
        status: "currently crawling",
        sitemap: {
            url: urlReq,
            links: []
        }
    });
    map.save(function (err, sitemap) {
        if (err) {
            console.log(err);
            def.reject(new Error(err));
        } else {
            that.currentMapId = sitemap._id;
            that.crawl(urlReq).then(function(links){
                map.status = "done";
                map.sitemap.links = that.links;
                map.save(function (err) {
                    that.isCrawling = false;
                    if (err) {
                        console.log(err);
                        def.reject(new Error(err));
                    } else {
                        def.resolve(map._id);
                    }
                });
            });
        }
    });

    return def.promise;
};

Sitemap.prototype.crawl = function(url){
    var def = q.defer();
    var that = this;

    loopRequests(this.scrapeUrls, url, that).then(function(){
        def.resolve();
    });

    return def.promise;
};

function loopRequests (fn, url, that) {
    return fn(url, that).then(function () {
        var firstUrl = that.links.shift();
        if(that.links.length < 500){
            return loopRequests(fn, firstUrl, that);  // re-execute if successful
        } else {
            return false;
        }
    })
}

function parseUrls(urls, rootUrl){
    var urlArr = [];
    console.log(rootUrl);
    var root = new URL(rootUrl).hostname.replace("www.", "");
    Object.keys(urls).forEach(function(urlObj){
        var url = urls[urlObj] && urls[urlObj].attribs && urls[urlObj].attribs.href;
        var host = url && new URL(url).hostname.replace("www.", "");

        //if(url && url.match(/.*(?:.reddit.com).*$/)){
        if(url && host == root){
            urlArr.push(url);
        }
    });

    return urlArr;
}

Sitemap.prototype.scrapeUrls = function(url, that){
    var def = q.defer();
    var options = {
        url: url
    };
    var links = this.links;
    console.log("Crawled: ", url);
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var anchors = $(body).find("a");
            var realUrls = parseUrls(anchors, url);
            that.links = that.links.concat(realUrls);

            def.resolve(realUrls);
        }
    });

    return def.promise;
};

Sitemap.prototype.findMap = function(url){
    var def = q.defer();

    Maps.findOne({ "sitemap.url": url }, function(err, map){
        def.resolve(map);
    });

    return def.promise;
};

module.exports = Sitemap;