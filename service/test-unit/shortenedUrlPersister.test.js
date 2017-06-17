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
    it("should be able to get MONGO_URL from .env", function () {
        //    given
        //    when
        var mongoUrl = process.env.MONGO_URL;

        //    then
        test.expect(mongoUrl).to.be.not.undefined;
    });

    it("should be able to persist unique original url", function () {
        //    given
        var mongoUrl = process.env.MONGO_URL;
        var originalUrl = "originalUrl";
        var shortenedUrl = "short";
        var stub_IdGenerator = sinon.stub(idGenerator, "generate");
        stub_IdGenerator.returns(shortenedUrl);

        //    when
        var promise = shortenedUrlPersister.getPromiseForPersistingOrReturningExisting(originalUrl);

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

    function simpleHandlerThatThrowsError(callback) {
        return function (err, data) {
            if (err) {
                throw err;
            }
            callback(data);
        }
    }
});