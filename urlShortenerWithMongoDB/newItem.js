//#region definitions
var MongoClient = require("mongodb").MongoClient;
var async = require("async");

var dbUrl = "mongodb://heroku_7rpcp6qs:samvk6sgru0hvp2ch24kadghn8@ds149535.mlab.com:49535/heroku_7rpcp6qs";
var collectionStr = "url-shortenerDB";
var fin = {
    index : -1,
    original : ""
};

var res;

var foundStatus = 0;

var ind = -1;

var validProtocols = ["https://", "http://"];

//#endregion

//#region async.series tests
//var f1 = function (callback) {
//    setTimeout(function () {
//        console.log("f1");
//        callback();
//    }, 10000);
//}

//var f2 = function (callback) {
//    setTimeout(function () {
//        console.log("f2");
//        callback();
//    }, 2500);
//}


//async.series([
//    f1,
//    f2,
//], function () {
//    console.log("finished async.series");
//});

//#endregion

MongoClient.connect(dbUrl, function (err, db) {
    if (err) {
        console.log("Error when trying to connecto to DB while trying to get max Index" + err);
        return
    }
    else {
        //#region getMaxIndex to begin
        findMaxIndex(db, function (_, docs) {
            //console.log("we're just to check if there is docs");
            //console.log(docs);
            
            var res;
            
            if (docs === undefined) {
                console.log("Max Item Not Found");
                //db.close();
                return res = -1;
            } else {
                console.log("weve got Index");
                
                //ind = parseInt(docs[0].index);
                res = parseInt(docs);
                console.log("Current index is:" + ind);
                db.close();
                return res;
                //callback(fin);
            }
        
        });
//#endregion
    }

});
var findMaxIndex = function (db, callback) {
    var collection = db.collection(collectionStr.toString());
    collection.aggregate([{
            $match: {
                index: {
                    $gt: -1
                }
            }
        }, { $count : "count" }], function (_, docs) {
        
        callback(docs[0].count);
    });
}

var findOne = function (db, surl, callback) {
    var collection = db.collection(collectionStr.toString());
    collection.findOne({ original : surl }).toArray(function (err, docs) {
        if (err) {
            console.log("Not Found surl: " + err);
            return -1;
        }
        console.log("We're in findOne docs is: " + docs[0]);
        callback(null, docs);
    });
}

module.exports = function (str, callback) {
    
    //#region protocol check
    console.log(str.slice(0, 5));
    console.log(str.slice(5, 12)); //for http check
    console.log(str.slice(5, 13)); // for https check
    
    var hCheck = validProtocols.indexOf(str.slice(5, 12).valueOf()) > -1;
    var hsCheck = validProtocols.indexOf(str.slice(5, 13).valueOf()) > -1;
    console.log("httpCheck:" + hCheck + " httpsCheck: " + hsCheck);
    
    if (str.slice(0, 5).valueOf() !== "/new/".valueOf()) {
        
        fin.original = "Please enter correct path ~/new/[yourUrl]"
        callback(fin);
        return
    }
    if (!(hCheck || hsCheck)) {
        console.log("Please Enter a correct protocol: http://[yoursite]");
        fin.original = "Please Enter a correct protocol: http://[yoursite]";
        callback(fin);
    } else {
        var input = str.slice(5);
        console.log("input: " + input);
        //#endregion        
        
        MongoClient.connect(dbUrl, function (err, db) {
            if (err) { console.log("DB CONNECTION ERROR" + err) }
            
            var col = db.collection(collectionStr.toString());
            
            col.findOne({ original : input }, function (_, docs) {
                console.log("docs is " + JSON.stringify(docs));
                if (docs !== null) {
                    console.log("weve got docs");
                    console.log("current ind is : " + ind);
                    console.log(docs.index);
                    console.log(docs.original);
                    fin.index = docs.index;
                    fin.original = docs.original;
                    res = fin;
                    //////BURDASIN, BUYUK BUG VAR, BURDAN SONRA DA ASAGIYA GIRIYOR, DUZELT, ASAGIYI FARKLI KONTROL ETMEK LAZIM
                    //fin.index = -1; 
                    //fin.original = "";
                    //foundStatus = 1;
                    //db.close();
                    callback(fin);
                    return;
                } else {
                    console.log("Not Found Document");
                    console.log("fin.index is: " + fin.index);

                    //col.findOne({ $query: {} }, function (_, docs) {
                    //    console.log("when not found and want to insert finOne docs is : " + JSON.stringify(docs));
                    //TODO: Buradaki match query'sini formata uydurmak icin salladim, hepsini aliyor aslinda, bunsuz da yapilir buyuk ihtimalle
                    var currentCount;
                    var getMaxIndex = function (callback) {
                        
                        setTimeout(function () {
                            
                            col.aggregate([{
                                    $match: {
                                        index: {
                                            $gt: -1
                                        }
                                    }
                                }, { $count : "count" }], function (_, docs) {
                                console.log("when not found and want to insert finOne docs is : " + JSON.stringify(docs));
                                console.log("when not found and want to insert finOne docs is : " + docs[0]);
                                console.log("when not found and want to insert finOne docs is : " + docs[0].count);
                                console.log("when not found and want to insert finOne docs is : " + docs[0]["count"]);
                                currentCount = docs[0].count;
                                callback();

                            });
                        }, 1000);
                    }
                    
                    var insertNew = function (callback) {
                        
                        setTimeout(function () {
                            fin.index = currentCount;
                            fin.original = input;
                            res = fin;
                            col.insertOne(fin);
                            console.log("New Item Insertion completed");
                            
                            callback();
                        }, 1000);
                       
                    }
                    
                    var resetFin = function (callback) {
                        
                        setTimeout(function () {
                            //fin.index = -1;
                            //fin.original = "";
                            //foundStatus = 0;
                            console.log("We're inside resetFin");
                            
                            callback();
                    
                        }, 1000);
                    }
                    
                    async.series([
                        getMaxIndex,
                        insertNew,
                        resetFin,
                        function () {
                            setTimeout(function () {
                                callback(fin);
                            }, 500)
                        },
                    ]);
                    //fin.original = input;
                    
                    //if (fin.index === undefined || isNaN(fin.index) || fin.index == -1) {
                    //    console.log("Not inserted into DB because of NaN or Undefined value of index");
                    //    //db.close();
                    //    return;
                    //} 
                }
            });
            
            if ( foundStatus !==1) {
                
                


            }
            


        });
    };
}