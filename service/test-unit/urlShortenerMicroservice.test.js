/**
 * Created by Hey on 13 Jun 2017
 */
var test = require('chai');
var format = require('string-format');

var urlShortenerMicroservice = require('../urlShortenerMicroservice');

describe("urlShortenerMicroservice", function () {
    it("should be able to get MONGO_URL from .env", function () {
        //    given
        //    when
        var mongoUrl = process.env.MONGO_URL;

        //    then
        test.expect(mongoUrl).to.be.not.undefined;
    });
    describe("Shortening URL", function () {
        it("should throw error for invalid URL that does not follow the valid http://www.example.com format", function () {
            //    given
            var anInvalidUrl = "some invalid url";

            //    when
            var jsonResponse = urlShortenerMicroservice.tryShortening(anInvalidUrl);

            //    then
            test.expect(jsonResponse.error).to.equal(format("'{}' is not a valid url that follow the format 'http://www.example.com'", anInvalidUrl));
            test.expect('shortened_from' in jsonResponse).to.be.false;
            test.expect('shortened_to' in jsonResponse).to.be.false;
        });

        it("should try to shorten valid URL return that as json response", function () {
            //    given
            var aValidUrl = "http://www.example.com";
            var shortenedUrl = "short";

            //    when
            var jsonResponse = urlShortenerMicroservice.tryShortening(aValidUrl);

            //    then
            test.expect('error' in jsonResponse).to.be.false;
            test.expect(jsonResponse['shortened_from']).to.equal(aValidUrl);
            test.expect(jsonResponse['shortened_to']).to.equal(shortenedUrl);
        });

    });
});