/**
 * Created by Hey on 13 Jun 2017
 */
var test = require('chai');
var format = require('string-format');
var rewire = require('rewire');

var urlShortenerMicroservice = rewire('../urlShortenerMicroservice');

describe("urlShortenerMicroservice", function () {
    it("should be able to get MONGO_URL from .env", function () {
        //    given
        //    when
        var mongoUrl = process.env.MONGO_URL;

        //    then
        test.expect(mongoUrl).to.be.not.undefined;
    });
    describe("Shortening URL", function () {
        describe("invalid URL", function () {
            it("should throw error for invalid URL that does not follow the valid http://www.example.com format", function () {
                //    given
                var anInvalidUrl = "some invalid url";

                //    when
                var promise = urlShortenerMicroservice.tryShortening(anInvalidUrl);

                //    then
                return promise.then(function (jsonResponse) {
                    test.expect(jsonResponse.error).to.equal(format("'{}' is not a valid url that follow the format 'http://www.example.com'", anInvalidUrl));
                    test.expect('shortened_from' in jsonResponse).to.be.false;
                    test.expect('shortened_to' in jsonResponse).to.be.false;
                });
            });
        });

        describe("valid URL", function () {
            var toRestore = {
                'shortenedUrlPersister': ""
            };
            beforeEach(function () {
                Object.keys(toRestore).forEach(function (key) {
                    toRestore[key] = urlShortenerMicroservice.__get__(key);
                });
            });
            afterEach(function () {
                Object.keys(toRestore).forEach(function (key) {
                    urlShortenerMicroservice.__set__('key', toRestore[key]);
                });
            });

            [
                "short",
                "another"
            ].forEach(function (shortenedUrl) {
                it("should try to shorten valid URL return that as json response", function () {
                    //    given
                    var aValidUrl = "http://www.example.com";
                    mockGetPromiseFor({
                        persistOrReturnExisting: function () {
                            return Promise.resolve(shortenedUrl);
                        }
                    });

                    //    when
                    var promise = urlShortenerMicroservice.tryShortening(aValidUrl);

                    //    then
                    return promise.then(function (jsonResponse) {
                        test.expect('error' in jsonResponse).to.be.false;
                        test.expect(jsonResponse['shortened_from']).to.equal(aValidUrl);
                        test.expect(jsonResponse['shortened_to']).to.equal(shortenedUrl);
                    })
                });
            });

            it("should catch any error thrown from the promise and return error message as json response", function () {
                //    given
                var aValidUrl = "http://www.example.com";
                var errMessage = 'some error';
                mockGetPromiseFor({
                    persistOrReturnExisting: function () {
                        return new Promise(function(){
                            throw new Error(errMessage);
                        }).catch(function(err){
                            throw err;
                        });
                    }
                });

                //    when
                var promise = urlShortenerMicroservice.tryShortening(aValidUrl);

                //    then
                return promise.then(function (jsonResponse) {
                    test.expect(jsonResponse.error).to.equal(format("Unable to shorten url, reason: {}", errMessage));
                    test.expect('shortened_from' in jsonResponse).to.be.false;
                    test.expect('shortened_to' in jsonResponse).to.be.false;
                });
            });
        });

        function mockGetPromiseFor(mockGetPromiseFor) {
            urlShortenerMicroservice.__set__('shortenedUrlPersister', {
                'getPromiseFor': mockGetPromiseFor
            });
        }
    });
});