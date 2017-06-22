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
    var url = req.params['0'];
    urlShortenerMicroservice.tryShortening(url, getFullHostNameFromReq(req)).then(function (jsonResponse) {
            res.send(jsonResponse);
        }
    );
});

module.exports = router;
