var express = require("express");
var port = process.env.PORT || 1350;
var ni = require("./newItem.js");
var ei = require("./existingItem.js");
var app = express();
var MongoClient = require("mongodb").MongoClient;
var dbUrl = "mongodb://heroku_7rpcp6qs:samvk6sgru0hvp2ch24kadghn8@ds149535.mlab.com:49535/heroku_7rpcp6qs";
var result;

//app.use('/new', ni);
//app.use('/', ei);

//#region tests
//var findDocuments = function (db, callback) {
//    // Get the documents collection
//    var collection = db.collection('url-shortenerDB');
//    // Find some documents
//    collection.find({}).toArray(function (err, docs) {
//        //assert.equal(err, null);
//        //console.log("Found the following records");
//        //console.log(docs);
//        result = docs[0];
//        //console.log("result is: ");
//        //console.log(result);
//        callback(null, docs);
        
//        //return docs
//    });
//}
//#endregion
console.log(port);

app.get('/new*', function (req, res) {
    
    var out = {
        index : -1,
        original : "",
        shortUrl : ""
    };

    ni(req.originalUrl, function (data) {
        console.log("Json stringified data:\n " + JSON.stringify(data));
        out.index = data.index;
        out.original = data.original;
        out.shortUrl = "https://"+ req.headers.host + '/' + data.index;
        res.send(JSON.stringify(out));
    })
    //res.send("youre at /new*" + JSON.stringify(end));
});

app.get('/robots*', function (req, res) {
    
    var out = { original : -1, index : "Please Enter a valid Path" };
    
    res.send(JSON.stringify(out));
})

app.get('/', function (req, res) {
    res.end("<p>Created by Berat Reha Sonmez -- frontpage(this page) Credits to: Rafael Rodriguez</p>" +
"<h1> FreeCodeCamp API Basejump: URL Shortener Microservice</h1>"+
"<blockquote><p>User stories:</p><ul><li>I can pass a URL as a parameter and I will receive a shortened URL in the JSON response.</li></ul><li>When I visit that shortened URL, it will redirect me to my original link.</li></blockquote>"+
"<h3>Example creation usage:</h3>"+
"<code>https://little-url.herokuapp.com/new/https://www.google.com</code>"+
"<br>"+
"<code>https://little-url.herokuapp.com/new/http://foo.com:80</code>"+
"<h3>Example creation output</h3>"+
"<code>{}</code>"+
"<h3>Usage:</h3>"+
"<code>https://little-url.herokuapp.com/2871</code>"+
"<h3>Will redirect to:</h3>"+
"<code>https://www.google.com/</code>" );
})

app.get('/*', function (req, res) {
    ei(req.originalUrl, function (data) {
        console.log("Incoming data:\n", +JSON.stringify(data));

        if (data.index !== -1) {
            console.log("Redirecting Page");
            res.redirect(data.original);
            
        } else {
            res.send(JSON.stringify(data));
        
        }

    });
})


//#region tests2
//app.get('*', function (req, res) {
    
//    MongoClient.connect(dbUrl, function (err, db) {
//        if (err) { console.log("DB Connection Error: " + err) }
        
        
//        findDocuments(db, function () {
//            db.close();
//            console.log("result is: ");
//            console.log(result);
//            res.send(result);
//            //console.log("Just before res.send() result is: " + result);
//            //res.send("URL-Shortener app\n" + result[0]['index'] + " " + result[0]['original']);
//        })
        

//            //result = JSON.stringify(docs);
            

//        //db.close();
//    });
//    //if (result == undefined) { res.send("test") }
//    //else { 
//    //    res.send(result);
//    //}
    
    
//})
//#endregion

app.listen(port, function () {
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});