/**
 * Created by lixun on 16/9/4.
 */

var request = require('request');

module.exports = function (req, res, next) {

    if (req.session.count == undefined) {
        req.session.count = 1;
    } else {
        req.session.count++;
    }


    res.render('session/get', {count: req.session.count});
};