/**
 * Created by Hey on 13 Jun 2017
 */
var validUrl = require('valid-url');

var shortenedUrlPersister = require('./shortenedUrlPersister');

function createErrorMessage(possibleUrl) {
    return "'" + possibleUrl + "' is not a valid url that follow the format 'http://www.example.com'"
}

function promiseForShortening(possibleUrl, fullHostName) {
    return shortenedUrlPersister.getPromiseFor
        .persistOrReturnExisting(possibleUrl, fullHostName)
        .then(function (shortenedUrl) {
            return {
                "shortened_from": possibleUrl,
                "shortened_to": shortenedUrl
            }
        })
        .catch(function (error) {
            return {
                'error': 'Unable to shorten url, reason: '.concat(error.message)
            }
        });
}

module.exports = {
    tryShortening: function (possibleUrl, fullHostName) {
        if (validUrl.isWebUri(possibleUrl)) {
            return promiseForShortening(possibleUrl, fullHostName);
        } else {
            return Promise.resolve({
                "error": createErrorMessage(possibleUrl)
            });
        }
    },
    shortenAny: function (string, fullHostName) {
        return promiseForShortening(string, fullHostName);
    },
    searchForOriginalUrl: function (urlParam, fullHostname) {
        return shortenedUrlPersister.getPromiseFor
            .search(fullHostname.concat("/").concat(urlParam))
            .then(function (originalUrl) {
                return {
                    'shorten_from': originalUrl
                }
            })
            .catch(function (err) {
                return {
                    'error': err.message
                }
            });
    }
};