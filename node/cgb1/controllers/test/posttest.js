/**
 * Created by lixun on 16/9/4.
 */

var config = require('../../config');

module.exports = function (req, res, next) {

    console.log('> posttest.js');
    console.log(req.url);
    console.log(req.body);
    console.log(req.body.b);

    res.send('post:hello');

};