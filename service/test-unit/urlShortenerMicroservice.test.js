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
    });
});