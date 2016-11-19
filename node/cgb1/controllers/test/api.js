/**
 * Created by lixun on 16/9/4.
 */

var config = require('../../config');
var apiRequest = require('../../api-request-v1');
// var allCarCountInfoApi = 'http://api.v2.maiche.com/api/open/car-basic/get-all-car-count-info.htm';

module.exports = function (req, res, next) {

    console.log(config.env);
    // easyApi
    //     .all([allCarCountInfoApi, summaryInfoApi])
    //     // .all(['get:userInfo'])
    //     .then(function (data) {
    //         console.log('done')
    //
    //         res.render('home', {title: 'test easyApi', data: 'Hello world'});
    //     })
    //     .catch(function (error) {
    //         console.log(error);
    //     });

    // apiRequest
    //     .one('get:hello', null, true)
    //     .then(function (data) {
    //
    //         console.log('done');
    //         console.log(data);
    //
    //         // console.log(data);
    //
    //         res.render('test/api', {});
    //     })
    //     .catch(function (error) {
    //         console.log(error)
    //     });

    apiRequest
        .one({api: 'get:hello', params: {a: 'world', b: 'test'}, json: false})
        .then(function (data) {

            console.log('done');
            console.log(data);

            // console.log(data);

            res.render('test/api', {});
        })
        .catch(function (error) {
            console.log(error)
        });

    // apiRequest
    //     .all([
    //         {api: 'get:hello', json: false},
    //         {api: 'post:hello', params: {test: 'abc'}, json: false}
    //     ])
    //     .then(function (results) {
    //         console.log('done')
    //         console.log(results)
    //
    //         res.render('test/api', {});
    //     })
    //     .catch(function (error) {
    //         console.log(error);
    //     });

    // apiRequest
    //     .post('http://127.0.0.1:3000/api/test', {a: 'world'})
    //     .then(function (data) {
    //
    //         console.log('done');
    //         console.log(data);
    //
    //         // console.log(data);
    //
    //         res.render('test/api', {});
    //     })
    //     .catch(function (error) {
    //         console.log(error)
    //     });
};