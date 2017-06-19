/**
 * Created by Hey on 15 Jun 2017
 */
require('dotenv').config();

var mongo = require('mongodb').MongoClient;
var idGenerator = require('./idGenerator');

var MONGO_URL = process.env.MONGO_URL;
var COLLECTION_NAME_SHORTEN_URL = 'shortenedUrls';

module.exports = {
    "getPromiseFor": {
        "persistOrReturnExisting": function (oriUrl) {
            var collection;
            return mongo.connect(MONGO_URL)
                .then(function (db) {
                    collection = db.collection(COLLECTION_NAME_SHORTEN_URL);
                    return collection.findOne({
                        'shorten_from': oriUrl
                    });
                })
                .then(function (data) {
                    if (isMappingExists(data)) {
                        return alignFindResultToInsertResultFormat(data);
                    } else {
                        return collection.insert({
                            'shorten_from': oriUrl,
                            'shorten_to': idGenerator.generate()
                        });
                    }
                })
                .then(function (data) {
                    return data.ops[0]["shorten_to"];
                })
                .catch(function (err) {
                    console.log("Error caught for mongo db connections: " + err);
                    throw err;
                });
        },
        "search": function (shortenedUrl) {
            return mongo.connect(MONGO_URL)
                .then(function (db) {
                    return db.collection(COLLECTION_NAME_SHORTEN_URL).findOne({
                        'shorten_to': shortenedUrl
                    })
                })
                .then(function (data) {
                    return data.shorten_from;
                })
        }
    }
};

function alignFindResultToInsertResultFormat(data) {
    return {
        ops: [data]
    };
}

function isMappingExists(data) {
    return (data !== null) && (typeof data === "object") && ("shorten_to" in data);
}