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
        "persist": function (oriUrl) {
            return mongo.connect(MONGO_URL)
                .then(function (db) {
                    return db.collection(COLLECTION_NAME_SHORTEN_URL)
                        .insert({
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