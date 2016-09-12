/**
 * Created by lixun on 16/9/4.
 */

var request = require('request');

module.exports = function (req, res, next) {

    req.session.reload(function (err) {
        if (err) {
            console.log('session reload error');
        }
        else {
            console.log('session reload')
        }
    });

    res.render('session/get', {count: req.session.count});
};