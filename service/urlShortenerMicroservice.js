/**
 * Created by Hey on 13 Jun 2017
 */
require('dotenv').config();

var validUrl = require('valid-url');

module.exports = {
    tryShortening: function (possibleUrl) {
        if (validUrl.isWebUri(possibleUrl)) {
            return {
                "shortened_from": possibleUrl,
                "shortened_to": "short"
            }
        } else {
            return {
                "error": "'" + possibleUrl + "' is not a valid url that follow the format 'http://www.example.com'"
            };
        }
    }
};