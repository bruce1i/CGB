/**
 * Created by lixun on 16/9/4.
 */

var config = require('../../config');
var request = require('request');
var mod1 = require('../../test');

module.exports = function (req, res, next) {

    res.render('test/get1', {count: mod1.returnGlobal()});
};