/**
 * Created by Hey on 15 Jun 2017
 */
var test = require('chai');
var rewire = require('rewire');

var mockMongo = require('mongo-mock');
mockMongo.max_delay = 0;
var mockMongoClient = mockMongo.MongoClient;

var sinon = require('sinon');
var sinonTest = require('sinon-test');
sinon.test = sinonTest.configureTest(sinon);
sinon.testcase = sinonTest.configureTestCase(sinon);

var idGenerator = require('../idGenerator');
var shortenedUrlPersister = rewire('../shortenedUrlPersister');
shortenedUrlPersister.__set__('mongo', mockMongoClient);

describe("shortenedUrlPersister", function () {
    describe("Usage of dotenv - process.env.MONGO_URL", function () {
        it("should be able to get MONGO_URL from .env", function () {
            //    given
            //    when
            var mongoUrl = process.env.MONGO_URL;

            //    then
            test.expect(mongoUrl).to.be.not.undefined;
        });
    });

    describe("persist", function () {
        it("should be able to persist unique original url", function () {
            //    given
            var mongoUrl = process.env.MONGO_URL;
            var originalUrl = "originalUrl";
            var shortenedUrl = "short";
            var stub_IdGenerator = sinon.stub(idGenerator, "generate");
            stub_IdGenerator.returns(shortenedUrl);

            //    when
            var promise = shortenedUrlPersister.getPromiseFor.persistOrReturnExisting(originalUrl);

            //    then
            var handlerForCleanUp = {};
            return promise.then(function (returnedUrl) {
                test.expect(returnedUrl).to.be.equal(shortenedUrl);

                return mockMongoClient.connect(mongoUrl);
            }).then(function (db) {
                handlerForCleanUp.db = db;

                var collection = db.collection('shortenedUrls');
                handlerForCleanUp.collection = collection;
                return collection.findOne({
                    "shorten_from": originalUrl
                })
            }).then(function (data) {
                test.expect(data["shorten_to"]).to.equal(shortenedUrl);
            }).then(function () {
                // truncate
                handlerForCleanUp.collection.toJSON().documents.length = 0;
                handlerForCleanUp.db.close();
                stub_IdGenerator.restore();
            }).catch(function (err) {
                throw err;
            });
        });

        it("should return existing shortened url if found instead of generating new when persist", function () {
            //    given
            var mongoUrl = process.env.MONGO_URL;
            var originalUrl = "originalUrl";
            var shortenedUrl = "short";
            var stub_IdGenerator = sinon.stub(idGenerator, "generate");
            stub_IdGenerator.throws("Unexpected call of idGenerator.generate()");

            var handlerForCleanUp = {};
            return mockMongoClient.connect(mongoUrl)
                .then(function (db) {
                    handlerForCleanUp.db = db;
                    var collection = db.collection('shortenedUrls');
                    handlerForCleanUp.collection = collection;

                    var existingEntry = {"shorten_from": originalUrl, "shorten_to": shortenedUrl};
                    return collection.insert(existingEntry);

                    /*
                     handlerForCleanUp.collection.find({"shorten_from": originalUrl}).toArray().then(function (data) {
                     console.log(data);
                     });
                     * */
                    // collection.find({"a":1}).toArray().then(function(data){console.log(data)})
                    // var state = collection.toJSON();
                    // if (typeof state.documents === "undefined") {
                    //     state.documents = {};
                    // }
                    // state.documents.push({"shorten_from": originalUrl, "shorten_to": shortenedUrl});
                }).then(function (data) {
                    //    when
                    return shortenedUrlPersister.getPromiseFor.persistOrReturnExisting(originalUrl);
                }).then(function (returnedUrl) {
                    //    then
                    test.expect(returnedUrl).to.be.equal(shortenedUrl);
                    return mockMongoClient.connect(mongoUrl);
                }).then(function (db) {
                    handlerForCleanUp.db = db;

                    var collection = db.collection('shortenedUrls');
                    handlerForCleanUp.collection = collection;
                    return collection.findOne({
                        "shorten_from": originalUrl
                    })
                }).then(function (data) {
                    test.expect(data["shorten_to"]).to.equal(shortenedUrl);
                }).then(function () {
                    // truncate
                    handlerForCleanUp.collection.toJSON().documents.length = 0;
                    handlerForCleanUp.db.close();
                    stub_IdGenerator.restore();
                }).catch(function (err) {
                    throw err;
                });
        });
    });
});