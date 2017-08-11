var express = require('express');
var router = express.Router();

var urlShortenerMicroservice = require("../service/urlShortenerMicroservice");
var serverHostNameFormatter = require("../service/serverHostNameFormatter");

/* GET home page. */
function getFullHostNameFromReq(req) {
    return serverHostNameFormatter.appendProtocolToHostName(req.headers.host);
}

router.get('/', function (req, res) {
    res.render('index', {
        "serverHostNameWithProtocol": getFullHostNameFromReq(req)
    });
});

router.get('/shorten/*', function (req, res) {
    var url = extractUrl(req);

    urlShortenerMicroservice.tryShortening(url, getFullHostNameFromReq(req)).then(function (jsonResponse) {
            res.send(jsonResponse);
        }
    );
});

router.get('/shortenForAny/*', function (req, res) {
    var url = extractUrl(req);

    urlShortenerMicroservice.shortenAny(url, getFullHostNameFromReq(req)).then(function (jsonResponse) {
            res.send(jsonResponse);
        }
    );
});

router.get(/\/(.+)/, function (req, res) {
    var urlParam = req.params['0'];
    urlShortenerMicroservice.searchForOriginalUrl(urlParam, getFullHostNameFromReq(req)).then(function (jsonResponse) {
            if ('shorten_from' in jsonResponse) {
                res.redirect(jsonResponse['shorten_from']);
            } else {
                res.send(jsonResponse);
            }
        }
    );
});

function extractUrl(req) {
    var url = req.params['0'];
    var queries = Object.keys(req.query)
        .map(function (key) {
            return key.concat("=").concat(req.query[key]);
        })
        .join("&");
    if (queries.length > 0) {
        url = url.concat("?").concat(queries);
    }
    return url;
}

module.exports = router;
