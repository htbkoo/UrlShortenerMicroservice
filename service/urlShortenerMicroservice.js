/**
 * Created by Hey on 13 Jun 2017
 */
var validUrl = require('valid-url');

var shortenedUrlPersister = require('./shortenedUrlPersister');

function createErrorMessage(possibleUrl) {
    return "'" + possibleUrl + "' is not a valid url that follow the format 'http://www.example.com'"
}

module.exports = {
    tryShortening: function (possibleUrl) {
        if (validUrl.isWebUri(possibleUrl)) {
            return shortenedUrlPersister.getPromiseFor
                .persistOrReturnExisting(possibleUrl)
                .then(function (shortenedUrl) {
                    return {
                        "shortened_from": possibleUrl,
                        "shortened_to": shortenedUrl
                    }
                });
        } else {
            return Promise.resolve({
                "error": createErrorMessage(possibleUrl)
            });
        }
    }
};