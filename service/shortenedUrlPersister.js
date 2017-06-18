/**
 * Created by Hey on 15 Jun 2017
 */
require('dotenv').config();

var mongo = require('mongodb').MongoClient;
var idGenerator = require('./idGenerator');

var MONGO_URL = process.env.MONGO_URL;
var COLLECTION_NAME_SHORTEN_URL = 'shortenedUrls';

function alignFindResultToBInsertResultFormat(data) {
    return {
        ops: data
    };
}

module.exports = {
    "getPromiseFor": {
        "persistOrReturnExisting": function (oriUrl) {
            var collection;
            return mongo.connect(MONGO_URL)
                .then(function (db) {
                    collection = db.collection(COLLECTION_NAME_SHORTEN_URL);
                    return collection.find({
                        'shorten_from': oriUrl
                    }).toArray();
                })
                .then(function (data) {
                    if (data.length > 0) {
                        return data[0]["shorten_to"];
                    }

                    return collection.insert({
                        'shorten_from': oriUrl,
                        'shorten_to': idGenerator.generate()
                    }).then(function (data) {
                        return data.ops[0]["shorten_to"];
                    });
                })
                .catch(function (err) {
                    console.log("Error caught for mongo db connections: " + err);
                    throw err;
                });
        }
    }
};