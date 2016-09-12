/**
 * Created by lixun on 16/9/4.
 */

var request = require('request');

module.exports = function (req, res, next) {


    res.render('session/id', {sessionId: req.sessionID});
};