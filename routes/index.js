var express = require('express');
var router = express.Router();

var urlShortenerMicroservice = require("../service/urlShortenerMicroservice");

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', {
        "serverHostName": req.headers.host
    });
});

router.get('/:timestamp', function (req, res) {
    var timestamp = req.params.timestamp;
    res.send(urlShortenerMicroservice(timestamp));
});

module.exports = router;
