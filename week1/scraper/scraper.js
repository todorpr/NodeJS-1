/* global require, console */
(function() {
  'use strict';

  var lastMaxItem = 8488000;
  var request = require('request');
  var printf = require('printf');
  var fs = require("fs");

  var allNews = [];

  function getMaxItem(cb) {
    request('https://hacker-news.firebaseio.com/v0/maxitem.json', function(error, response, body) {
        cb(parseInt(body, 10));
    });
  }

  function getItem(id, cb) {
    var itemUrl = printf('https://hacker-news.firebaseio.com/v0/item/%d.json', id);
    request(itemUrl, function(error, response, body) {
      cb(JSON.parse(body));
    });
  }

  function getRangeFrom(prevItemId, maxItemId) {
    var result = [];

    while(prevItemId < maxItemId - 1) {
      result.push(prevItemId);
      prevItemId += 1;
    }

    return result;
  }

  function asyncWhile(items, oper, done) {
    if(items.length === 0) {
      return done();
    }

    var itemToGet = items.shift();
    console.log('Getting item with id: ' + itemToGet);
    oper(itemToGet, function(data) {
      //console.log(data);
      allNews.push(data);
      asyncWhile(items, oper, done);
    });
  }

  function poll(doneCb) {
    getMaxItem(function(currentMaxItem) {
      console.log('max item is ' + currentMaxItem);
      var rangeToGet = getRangeFrom(lastMaxItem, currentMaxItem);
      asyncWhile(rangeToGet, getItem, doneCb);
    });
  }

  function everyX(seconds) {
    setTimeout(function() {
      poll(function() {
        console.log("Done");
        createDbJson();
        everyX(seconds);
      });
    }, seconds)
  }

  function createDbJson(){
    fs.writeFile("docs.json", JSON.stringify(allNews, null, 4), function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("JSON saved to db.json");
        }
    });
}

  everyX(3000);
} () );
