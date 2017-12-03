var MongoClient = require("mongodb").MongoClient;
var async = require("async");

var dbUrl = "mongodb://heroku_7rpcp6qs:samvk6sgru0hvp2ch24kadghn8@ds149535.mlab.com:49535/heroku_7rpcp6qs";
var collectionStr = "url-shortenerDB";


module.exports = function (str) {
    console.log("existingItem" + str);

    return "existingItem"
}