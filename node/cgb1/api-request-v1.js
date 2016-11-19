/**
 * Created by lixun on 16/9/5.
 */

var request = require('request');
var apiSet = require('./api');

/**
 * 请求一个api
 * @param args 参数支持的项 {api(string:api接口名称和请求方式), params(obj:请求参数), json(bool:转换返回结果为json格式,默认true), random(bool:添加_r随机数来避免请求缓存,默认false)}
 */
function one(args) {

    var p = new Promise(function (resolve, reject) {

        // 设置json默认为true;
        if (args.json == null) {
            args.json = true;
        }

        // 分解自定义api规则, 获取请求方式和api名称(0为method，1为api keyname)
        var apiItems = args.api.split(':');

        var reqMethod = apiItems[0];
        var reqUrl = apiSet[apiItems[1]];

        // request请求参数配置项
        var requestOptions = {
            url: reqUrl,
            method: reqMethod.toUpperCase()
        };

        //region 处理get/post请求参数
        if (args.params == null) {
            args.params = {};
        }

        if (args.random == true) {
            args.params._r = Math.floor(Math.random() * 100000000).toString();
        }

        if (reqMethod == 'get') {
            requestOptions.qs = args.params;
        }
        else if (reqMethod == 'post') {
            requestOptions.form = args.params;
        }
        //endregion

        request(
            requestOptions,
            function (error, response, body) {

                if (error) {
                    reject('请求出错.');
                }
                else {

                    if (args.json == true) {
                        //json转换
                        try {
                            var jsonResult = JSON.parse(body);

                            resolve(jsonResult);
                        }
                        catch (e) {
                            /** 转换json失败，请求标示为失败 */
                            reject('解析json数据出错.');
                        }
                    }
                    else {
                        resolve(body);
                    }
                }
            }
        );
    });

    return p;
}

/**
 * 请求多个api，需要所有api都完成才执行
 * @param apiList
 */
function all(apiList) {

    var promiseList = [];

    apiList.forEach(function (item) {
        promiseList.push(one(item));
    });

    return Promise.all(promiseList);
}

/**
 * get请求（不推荐使用，仅供测试）
 * @param url 请求url
 * @param params 请求参数
 */
function get(url, params) {

    var p = new Promise(function (resolve, reject) {

        request(
            {
                url: url,
                method: 'GET',
                qs: params
            },
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
}

/**
 * post请求（不推荐使用，仅供测试）
 * @param url 请求url
 * @param params 请求参数
 */
function post(url, params) {
    var p = new Promise(function (resolve, reject) {

        request(
            {
                url: url,
                method: 'POST',
                form: params
            },
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
}

module.exports = {
    one: one,
    all: all,
    get: get,
    post: post
};