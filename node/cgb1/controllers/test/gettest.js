/**
 * Created by lixun on 16/9/4.
 */

var config = require('../../config');

module.exports = function (req, res, next) {

    console.log('> gettest.js');
    console.log(req.url);
    console.log(req.query.b);

    res.send('get:hello');

};