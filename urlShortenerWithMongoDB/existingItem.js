var MongoClient = require("mongodb").MongoClient;
var async = require("async");

var dbUrl = "mongodb://heroku_7rpcp6qs:samvk6sgru0hvp2ch24kadghn8@ds149535.mlab.com:49535/heroku_7rpcp6qs";
var collectionStr = "url-shortenerDB";


module.exports = function (str, callback) {
    
    var incomingDataId = parseInt(  str.slice(1));
    
    console.log("What I've got as ID is:  >>>" + incomingDataId);

    console.log("existingItem" + str);
    
    MongoClient.connect(dbUrl, function (err, db) {
        if (err) { console.log("DB Connection Error from existing Item " + err) }

        var col = db.collection(collectionStr.toString());

        col.findOne({ index : incomingDataId }, function (_, docs) {
            console.log("Doc is " + JSON.stringify(docs));
            if (docs !== null) {
                console.log("We've got docs from existing item search");

                callback(docs);
            }
        })

    })

    return "existingItem"
}