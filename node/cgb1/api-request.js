/**
 * Created by lixun on 16/9/5.
 */

var request = require('request');

var get = function (url) {

    var p = new Promise(function (resolve, reject) {

        request(
            {url: url, json: true},
            function (error, response, body) {

                if (error) {
                    reject('请求出错.');
                }
                else {
                    resolve(body);
                }
            }
        );
    });

    return p;
};

var all = function (urlList) {

    var pList = [];

    urlList.forEach(function (url) {

        pList.push(get(url));
    });

    return Promise.all(pList);
};

module.exports = {
    get: get,
    all: all
};