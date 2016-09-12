/**
 * Created by lixun on 16/9/4.
 */

var request = require('request');
var easyApi = require('../easy-api');
var allCarCountInfoApi = 'http://api.v2.maiche.com/api/open/car-basic/get-all-car-count-info.htm';
var summaryInfoApi = 'http://maiche.ttt.mucang.cn/api/open/serial-summary/get-summary-info.htm?serialId=94';

module.exports = function (req, res, next) {

    easyApi
        .all([allCarCountInfoApi, summaryInfoApi])
        .then(function (data) {
            console.log('done')

            res.render('home', {title: 'test easyApi', data: 'Hello world'});
        })
        .catch(function (error) {
            console.log(error);
        });

};

