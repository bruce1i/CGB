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

    //region Ajax
    function httpRequest(url) {

        this.xhr = null;
        this.type = null;
        this.url = url;
        this.method = null;
        this.params = null;


        if (window.XDomainRequest) {
            this.xhr = new XDomainRequest();
            this.type = 'xdr';
        }
        else if (window.XMLHttpRequest) {
            this.xhr = new XMLHttpRequest();
            this.type = 'xhr';
        }
        else {
            throw new Error('初始化httpRequest实例失败。');
        }

        this.get = function (params) {
            this.method = 'GET';

            if (params != null) {
                this.params = params;
            }

            return this;

        };

        this.post = function (params) {
            this.method = 'POST';

            if (params != null) {
                this.params = params;
            }

            return this;
        };

        this.send = function (callback) {
            var xhr = this.xhr;
            var type = this.type;
            var params = this.params;
            var paramsArr = [];

            //region 转换参数为数组
            if (params != null) {

                for (var key in params) {

                    paramsArr.push(key + '=' + params[key]);
                }
            }
            //endregion

            if (type == 'xhr') {

                if (this.method == 'GET') {

                    var url = this.url;

                    if (paramsArr.length > 0) {
                        url += '?' + paramsArr.join('&');
                    }

                    xhr.open(this.method, url, true);

                    xhr.onreadystatechange = function () {

                        if (xhr.readyState == 4 && xhr.status == 200) {

                            callback(JSON.parse(xhr.responseText));
                        }
                    };

                    xhr.send();
                }
                else if (this.method == 'POST') {

                    var postParams = null;

                    if (paramsArr.length > 0) {
                        postParams = paramsArr.join('&');
                    }

                    xhr.open(this.method, this.url, true);

                    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

                    xhr.onreadystatechange = function () {

                        if (xhr.readyState == 4 && xhr.status == 200) {

                            callback(JSON.parse(xhr.responseText));
                        }
                    };

                    xhr.send(postParams);
                }

            }
            else if (type == 'xdr') {

                xhr.open(this.method.toLowerCase(), this.url);

                xhr.onload = function () {

                    callback(JSON.parse(xhr.responseText));
                };

                setTimeout(function () {
                    xhr.send();
                }, 0);
            }

        };

    };

    function httpRequestNew(url) {

        this.requestUrl = url;
        this.requestMethod = 'get';
        this.requestParams = null;
        this.context = {};

        this.get = function (params) {
            this.requestMethod = 'get';

            if (params != null) {
                this.requestParams = params;
            }

            return this;
        };

    }

    var http = fn.http = {};

    http.request = function (url) {

        return new httpRequest(url);
    };
    //endregion

})();