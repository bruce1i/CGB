/**
 * Created by lixun on 16/4/29.
 */
var express = require('express');
var router = express.Router();

var http = require('http');
// var request = require('request');

/* GET cookie page. */
router.get('/', function (req, res, next) {
    console.log('--output http--');
    console.log(http.request.url);
    // console.log('--output request--');
    // console.log(request);
    console.log('--output cookies--');
    console.log(req.cookies);

    res.render('cookie', {title: 'Cookie'});
});

module.exports = router;
