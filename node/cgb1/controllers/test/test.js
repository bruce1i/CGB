/**
 * Created by lixun on 16/9/4.
 */

var request = require('request');
var mod1 = require('../../test');

module.exports = function (req, res, next) {

    mod1.setGlobal(34);


    res.render('test/get', {count: mod1.returnGlobal()});
};