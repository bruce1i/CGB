/**
 * Created by lixun on 16/8/14.
 */

(function () {

    var SIGNATURE = 'http://bruce1i.github.io/';
    var VERSION = '1.0.0';
    var fn = null;

    function init14helper() {
        //region 检查是否加载过14helper或者有重名
        if (window.one4Helper != null) {

            try {

                if (one4Helper.SIGNATURE != SIGNATURE) {

                    throw new Error('Error:加载14helper失败,请检查是否有重名对象(one4Helper)。');
                }
            }
            catch (e) {
                console.log(e);
            }
        }
        else {

            window.one4Helper = {
                SIGNATURE: SIGNATURE,
                VERSION: VERSION
            };

            if (window._14 != null) {

                console.log('初始化one4Helper默认别名失败(_14),你可以自行设定别名。');
            }
            else {

                window._14 = window.one4Helper;
            }
        }
        //endregion

        return window.one4Helper;
    }

    fn = init14helper();

    //region String
    fn.stringFormat = function () {

        if (arguments.length == 0) {
            return null;
        }

        var str = arguments[0];
        for (var i = 1; i < arguments.length; i++) {
            var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
            str = str.replace(re, arguments[i]);
        }

        return str;
    };
    //endregion

    //region Number
    fn.isNumber = function (num) {
        return !isNaN(num);
    };
    //endregion

    //region Array
    fn.isArray = function (obj) {
        if (typeof obj == 'object' && obj instanceof Array) {
            return true;
        }

        return false;
    };
    //endregion

    //region Object
    fn.isObject = function (obj) {
        if (typeof obj == 'object' && !(obj instanceof Array) && obj instanceof Object) {
            return true;
        }

        return false;
    };

    fn.deepCopy = function (obj) {
        var copy;

        if (typeof obj == 'object' && obj instanceof Array) {
            copy = [];

            for (var i = 0; i < obj.length; i++) {
                var type = typeof obj[i];
                if (type == 'string' || type == 'number' || type == 'boolean' || type == 'function') {
                    copy[i] = obj[i];
                }
                else {
                    copy[i] = fn.deepCopy(obj[i]);
                }
            }
        }
        else if (typeof obj == 'object' && obj instanceof Object) {
            copy = {};

            for (var key in obj) {
                var type = typeof obj[key];
                if (type == 'string' || type == 'number' || type == 'boolean' || type == 'function') {
                    copy[key] = obj[key];
                }
                else {
                    copy[key] = fn.deepCopy(obj[key]);
                }
            }
        }

        return copy;
    };
    //endregion

    //region http
    function httpRequest(url) {

        this.requestUrl = url;
        this.requestMethod = 'get';
        this.requestParams = null;
        this.callback = {};

        this.get = function (params) {
            this.requestMethod = 'get';

            this.requestParams = params;

            return this;
        };

        this.post = function (params) {
            this.requestMethod = 'post';

            this.requestParams = params;

            return this;
        };

        this.send = function (callback) {
            this.callback = callback;

            if (window.XDomainRequest) {

                xdrSend(this);
            }
            else if (window.XMLHttpRequest) {

                xhrSend(this);
            }
            else {
                throw new Error('初始化httpRequest实例失败。');
            }

            return this;
        };
    }

    function getRequestParamsString(params) {
        var paramsArr = [];

        for (var key in params) {

            paramsArr.push(key + '=' + params[key]);
        }

        return paramsArr.join('&');
    }

    function xdrSend(config) {
        /**
         * 注意:由于XDR的post提交不能定义表单头类型application/x-www-form-urlencoded
         * 需要后台服务器单独处理解析,所以对于XDR请求全部以get方式发送
         */

        var xdr = new window.XDomainRequest();
        var url = config.requestUrl;

        if (config.requestParams != null) {
            url += '?' + getRequestParamsString(config.requestParams);
        }

        config.context = {
            type: 'xdr',
            url: url,
            method: 'get',
            params: ''
        };

        xdr.open('get', url);

        xdr.onload = function () {

            config.callback(JSON.parse(xdr.responseText));
        };

        setTimeout(function () {
            xdr.send();
        }, 0);
    }

    function xhrSend(config) {
        var xhr = new window.XMLHttpRequest();

        if (config.requestMethod.toLowerCase() == 'get') {

            var url = config.requestUrl;

            if (config.requestParams != null) {
                url += '?' + getRequestParamsString(config.requestParams);
            }

            config.context = {
                type: 'xhr',
                url: url,
                method: 'get',
                params: ''
            };

            xhr.open(config.requestMethod.toUpperCase(), url, true);

            xhr.onreadystatechange = function () {

                if (xhr.readyState == 4 && xhr.status == 200) {

                    config.callback(JSON.parse(xhr.responseText));
                }
            };

            xhr.send();
        }
        else if (config.requestMethod.toLowerCase() == 'post') {

            var params = null;

            if (config.requestParams != null) {
                params = getRequestParamsString(config.requestParams);
            }

            config.context = {
                type: 'xdr',
                url: config.requestUrl,
                method: 'post',
                params: params
            };

            xhr.open(config.requestMethod.toUpperCase(), config.requestUrl, true);

            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

            xhr.onreadystatechange = function () {

                if (xhr.readyState == 4 && xhr.status == 200) {

                    config.callback(JSON.parse(xhr.responseText));
                }
            };

            xhr.send(params);
        }
    }

    var http = fn.http = {};

    http.request = function (url) {
        // Ajax

        return new httpRequest(url);
    };
    //endregion

})();