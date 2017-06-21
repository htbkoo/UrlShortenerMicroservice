var express = require('express');
var router = express.Router();

var urlShortenerMicroservice = require("../service/urlShortenerMicroservice");

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', {
        "serverHostName": req.headers.host
    });
});

router.get('/shorten/*', function (req, res) {
    var url = req.params['0'];
    urlShortenerMicroservice.tryShortening(url).then(function (jsonResponse) {
            res.send(jsonResponse);
        }
    );
});

module.exports = router;
