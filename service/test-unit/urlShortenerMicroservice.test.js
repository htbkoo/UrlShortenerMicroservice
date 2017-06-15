/**
 * Created by Hey on 13 Jun 2017
 */
var test = require('chai');

var urlShortenerMicroservice = require('../urlShortenerMicroservice');

describe("urlShortenerMicroservice", function () {
    it("should be able to get MONGO_URL from .env", function () {
        //    given
        //    when
        var mongoUrl = process.env.MONGO_URL;

        //    then
        test.expect(mongoUrl).to.be.not.undefined;
    });
});