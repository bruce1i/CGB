/*
 ** bBank JavaScript Library 4.5r
 **
 ** bBank Blog
 ** http://www.cnblogs.com/bruceli/archive/2010/04/15/bBank.html
 **
 ** Licensed under LGPL Version 3 licenses.
 ** http://www.gnu.org/licenses/lgpl.html
 **
 ** Author: Bruce Li
 ** Date: 2010-5-11 16:25:00 (in shanghai,China)
 ** Copyright (c) 2009 Bruce Li
 */

(function () {
    if (window.bBank || window.b$) return alert("Error:The \"bBank JavaScript Library\" load fail.");

    var fn = window.bBank = window.b$ = function (arg, css) {
        var domArr = [];
        if (!css) { if (typeof arg == "object") { domArr.push(arg); } else { domArr = fn.getElementsBySelector(arg); } }
        else { domArr = fn.getElementsBySelector(css, arg); }

        if (domArr.length == 0) { return null; }
        return fn.init.instance(domArr);
    };

    //public properties
    fn.version = "4.5r";
    fn.author = "Bruce Li(李迅)";
    fn.releasedate = "2010-7-6";
    fn.about = "(c)copyright:bBank JavaScript Library by Bruce.Li";

    //<<< core code
    fn.init = {
        instance: function (doms) {
            var domArr = this.domsPack(doms);
            if (domArr.length == 1) return domArr.get(0);
            return domArr;
        },
        domExt: function (dom) {
            //get tagName
            var tag = dom.tagName.toLowerCase();

            //extend func for appoint tag
            switch (tag) {
                case "select":
                    dom.getText = function () { var txtArr = []; for (var i = 0, num = this.length; i < num; i++) { if (this.options[i].selected) txtArr.push(this.options[i].text); } return this.multiple ? txtArr : txtArr[0] ? txtArr[0] : null; };
                    dom.getValue = function () { var valArr = []; for (var i = 0, num = this.length; i < num; i++) { if (this.options[i].selected) valArr.push(this.options[i].value); } return this.multiple ? valArr : valArr[0] ? valArr[0] : null; };
                    dom.addOption = function (a) { if (fn.type.isElement(a)) { if (fn.browser.isIE()) this.add(a); else this.add(a, null); return; } var str = '<select>' + a + '</select>'; var slt = fn.parseDom(str)[0]; for (var i = 0, num = slt.length; i < num; i++) { this.appendChild(slt[0]); } };
                    break;
                case "input":
                    dom.resetValue = function () { var objE = document.createElement("form"); var nObj = this.cloneNode(true); objE.appendChild(nObj); objE.reset(); this.parentNode.replaceChild(nObj, this); };
                    break;
                case "iframe":
                    dom.contentHtml = (function (o) { return o.contentWindow ? o.contentWindow : o.contentDocument; })(dom);
                    break;
            }

            //extend func for general
            dom.addChild = function (e) { var nodes = fn.parseDom(e); var num = nodes.length; for (var i = 0; i < num; i++) { this.appendChild(nodes[0]); } };
            dom.findNearNode = function (selector) { var pE = this, fE = []; while (pE != null) { fE = fn.getElementsBySelector(selector, pE); pE = pE.parentNode; if (fE.length != 0) break; } return fE.length == 0 ? null : fE[0]; };
            dom.getTop = function (e) { if (e == null) e = this; var offset = e.offsetTop; if (e.offsetParent != null) offset += this.getTop(e.offsetParent); return offset; };
            dom.getLeft = function (e) { if (e == null) e = this; var offset = e.offsetLeft; if (e.offsetParent != null) offset += this.getLeft(e.offsetParent); return offset; };
            dom.opacity = function (a) { if (fn.browser.isIE()) this.style.filter = "alpha(opacity=" + a + ")"; else this.style.opacity = a / 100; };
            dom.removeSelf = function () { var pE = this.parentNode; if (pE) return pE.removeChild(this); return null; };
            dom.removeAllChild = function () { this.innerHTML = ""; };
            dom.upBody = function () { document.body.appendChild(this); };

            //extend property
            dom.getStyle = (function (o) { return window.getComputedStyle ? window.getComputedStyle(o, null) : o.currentStyle; })(dom);

            //compatibility
            dom.each = function (func) { return fn.init.domsPack([this]).each(func); };
            dom.toArray = function () { return fn.init.domsPack([this]); };
            dom.get = function (index) { if (index != 0) return null; return this; };

            return dom;
        },
        domsPack: function (doms) {
            doms.each = function (func) { var i, num = this.length; for (i = 0; i < num; i++) { this[i].foo = func; } for (i = 0; i < num; i++) { this[i].foo(i); } };
            doms.toArray = function () { return this; };
            doms.get = function (index) { return fn.init.domExt(this[index]); };

            return doms;
        }
    };

    //ajax group
    fn.get = function (sURL, sVars, fnDone) { return fn.ajax(sURL, "get", sVars, fnDone); };
    fn.post = function (sURL, sVars, fnDone) { return fn.ajax(sURL, "post", sVars, fnDone); };

    fn.asyn = {
        formSubmit: function (args, action, func) {
            this.clearContext();
            this.callBack = null;
            this.loadHack = true;
            var subArr = [];
            var subArrT = [];
            if (fn.type.isArray(args)) {
                subArr = args;
            } else {
                var tag = args.tagName.toLowerCase();
                if (tag == "form") { for (var i = 0, num = args.childNodes.length; i < num; i++) { subArr.push(args.childNodes[i]); } }
                else { subArr = [args]; }
            }
            //create asyn form and ifroma
            var objForm = document.createElement("form");
            objForm.action = action;
            objForm.target = "bBankAsynFormSubmit_iframe_1b";
            objForm.encoding = "multipart/form-data";
            objForm.method = "post";
            objForm.id = "bBankAsynFormSubmit_form_1b";
            objForm.style.display = "none";
            var objIframe = fn.parseDom('<iframe id="bBankAsynFormSubmit_iframe_1b" name="bBankAsynFormSubmit_iframe_1b" src="about:blank" style="display:none;" onload="b$.asyn.complete()"></iframe>')[0];
            //add submit value in form
            for (var i = 0, num = subArr.length; i < num; i++) {
                if (!subArr[i].name && subArr[i].nodeType == 1 && subArr[i].tagName.toLowerCase() == "input") subArr[i].name = "bBankAsynFormSubmit_input_1b_" + i;
                var input = subArr[i].cloneNode(true);
                subArrT.push(input);
                subArr[i].parentNode.replaceChild(input, subArr[i]);
                objForm.appendChild(subArr[i]);
            }
            //submit
            document.body.appendChild(objIframe);
            document.body.appendChild(objForm);
            objForm.submit();
            //dispose
            for (var i = 0, num = subArrT.length; i < num; i++) { subArrT[i].parentNode.replaceChild(subArr[i], subArrT[i]); }
            if (func) this.callBack = func;
        },
        complete: function () {
            //check load hack, opera & chrome & safari will load twice for onece add body other is loaded
            if (this.loadHack && !fn.browser.isIE()) {
                this.loadHack = false;
                if (fn.browser.isFF()) setTimeout('b$.asyn.complete()', 100);
                return;
            }

            var responseText = "";
            try {
                responseText = fn('#bBankAsynFormSubmit_iframe_1b').contentHtml.document.body.innerHTML;
            } catch (err) { }

            this.clearContext();
            if (this.callBack) this.callBack(responseText);
        },
        clearContext: function () {
            if (fn('#bBankAsynFormSubmit_form_1b')) fn('#bBankAsynFormSubmit_form_1b').removeSelf();
            if (fn('#bBankAsynFormSubmit_iframe_1b')) fn('#bBankAsynFormSubmit_iframe_1b').removeSelf();
        },
        callBack: null,
        loadHack: true
    };

    //browser's function and property
    fn.browser = {
        scrollLeft: function () { return (document.documentElement.scrollLeft || window.pageXOffset) || 0; },
        scrollTop: function () { return (document.documentElement.scrollTop || window.pageYOffset) || 0; },
        height: function () { return (window.innerHeight) ? window.innerHeight : (document.documentElement && document.documentElement.clientHeight) ? document.documentElement.clientHeight : document.body.offsetHeight; },
        width: function () { return (window.innerWidth) ? window.innerWidth : (document.documentElement && document.documentElement.clientWidth) ? document.documentElement.clientWidth : document.body.offsetWidth; },
        isIE: function () { return ! -[1, ]; },
        isIE6: function () { return fn.browser.isIE() && !window.XMLHttpRequest ? true : false; },
        isFF: function () { return window.navigator.userAgent.indexOf("Firefox") !== -1; },
        isChrome: function () { return window.navigator.userAgent.indexOf("Chrome") !== -1; },
        isOpera: function () { return !!window.opera; },
        isSafari: function () { return /a/.__proto__ == '//'; }
    };

    //cookie operate
    fn.cookie = function (key, val, args) {
        if (typeof val == "undefined") {
            return fn.getValByKey(document.cookie, key, "=", "; ");
        } else {
            args = args || {};
            var expires = '';
            var path = args.path ? '; path=' + (args.path) : '';
            var domain = args.domain ? '; domain=' + (args.domain) : '';
            var secure = args.secure ? '; secure' : '';
            //set expires
            if (val == null) expires = '; expires=' + (new Date()).toUTCString();
            if (args.expiresDate) expires = '; expires=' + fn.Date(args.expiresDate).toUTCString();
            if (args.expiresSec) expires = '; expires=' + (new Date(new Date().getTime() + parseInt(args.expiresSec) * 1000)).toUTCString();
            if (args.expiresMin) expires = '; expires=' + (new Date(new Date().getTime() + parseInt(args.expiresMin) * 60 * 1000)).toUTCString();
            if (args.expiresDay) expires = '; expires=' + (new Date(new Date().getTime() + parseInt(args.expiresDay) * 24 * 60 * 60 * 1000)).toUTCString();

            document.cookie = [key, '=', val, expires, path, domain, secure].join('');
        }
    };

    //date function extend
    fn.Date = function (arg, format) {  //the 'arg' like "2009-5-1" or "2009-1-1 12:45:33" or null, if format is null return Date() obj, else return format date string like function 'dateFormat()'
        if (!arg && !format) return new Date();
        if (format) return fn.dateFormat(fn.Date(arg), format);
        arg = fn.trimLR(arg);
        //split arg for date string and time string
        var dtArr = arg.split(' '); var date = dtArr[0]; var time = dtArr[dtArr.length - 1] ? dtArr[dtArr.length - 1] : ''; if (dtArr.length == 1) time = '';
        //split date string and time string with year,month,day,hour,min,sec arguments
        var year, month, day, hour, min, sec;
        var dArr = date.split('/')[1] ? date.split('/') : date.split('-'); var tArr = time.split(':');
        year = dArr[0]; month = dArr[1] ? dArr[1] - 1 : 0; day = dArr[2] ? dArr[2] : 1; hour = tArr[0] ? tArr[0] : 0; min = tArr[1] ? tArr[1] : 0; sec = tArr[2] ? tArr[2] : 0;
        return new Date(year, month, day, hour, min, sec);
    };
    fn.dateFormat = function (arg, format) {   //format date: 'arg' is Date() obj, 'format' like "YYYY-MM-DD hh:mm:ss" or "YY-M-D h:m:s",you can free combination with "Y:yert" "M:month" "D:day" "h:hour" "m:min" "s:sec"
        if (arg == null) arg = new Date();
        var Y = format.match(/[Y]+/); var M = format.match(/[M]+/); var D = format.match(/[D]+/);
        var h = format.match(/[h]+/); var m = format.match(/[m]+/); var s = format.match(/[s]+/);
        var year = !Y ? "" : Y[0].length == 2 ? String(arg.getFullYear()).substring(2) : arg.getFullYear();
        var month = !M ? "" : M[0].length == 1 ? (arg.getMonth() + 1) : (arg.getMonth() + 1) < 10 ? "0" + (arg.getMonth() + 1) : (arg.getMonth() + 1);
        var day = !D ? "" : D[0].length == 1 ? arg.getDate() : arg.getDate() < 10 ? "0" + arg.getDate() : arg.getDate();
        var hour = !h ? "" : h[0].length == 1 ? arg.getHours() : arg.getHours() < 10 ? "0" + arg.getHours() : arg.getHours();
        var min = !m ? "" : m[0].length == 1 ? arg.getMinutes() : arg.getMinutes() < 10 ? "0" + arg.getMinutes() : arg.getMinutes();
        var sec = !s ? "" : s[0].length == 1 ? arg.getSeconds() : arg.getSeconds() < 10 ? "0" + arg.getSeconds() : arg.getSeconds();
        return format.replace(/[Y]+/, year).replace(/[M]+/, month).replace(/[D]+/, day).replace(/[h]+/, hour).replace(/[m]+/, min).replace(/[s]+/, sec);
    };

    //event
    fn.resize = function (func) {
        var oldResize = window.onresize;
        if (!window.onresize) {
            window.onresize = func;
        } else {
            window.onresize = function () {
                oldResize();
                func();
            };
        }
    };
    fn.scroll = function (func) {
        var oldScroll = window.onscroll;
        if (!window.onscroll) {
            window.onscroll = func;
        } else {
            window.onscroll = function () {
                oldScroll();
                func();
            };
        }
    };

    //split key-value pair string extend
    fn.getKeyAndVal = function (arg, s) {
        var key = arg.indexOf(s) == -1 ? arg : arg.substring(0, arg.indexOf(s));
        var val = arg.indexOf(s) == -1 ? null : arg.substring(arg.indexOf(s) + 1);
        return { key: key, val: val };
    };
    fn.getValByKey = function (arg, key, sA, sB) {
        if (!sB) {
            if (fn.getKeyAndVal(arg, sA).key == key) return fn.getKeyAndVal(arg, sA).val;
            return null;
        }
        var kvArr = arg.split(sB);
        for (var i = 0, num = kvArr.length; i < num; i++) {
            if (fn.getKeyAndVal(kvArr[i], sA).key == key) return fn.getKeyAndVal(kvArr[i], sA).val;
        }
        return null;
    };

    //memoize
    //main function
    fn.memoize = function (func, sec) {
        return function () {
            var seq = func + fn.memoize.calSeq(arguments);
            fn.memoize.expires(seq, sec);

            if (!fn.memoize.cache[seq]) { fn.memoize.cache[seq] = { value: func.apply(this, arguments), expires: sec ? ((new Date()).getTime() + (sec * 1000)) : null }; }
            return fn.memoize.cache[seq].value;
        };
    };
    fn.memoize.mark = function (func) {
        return function () {
            var seq = func + fn.memoize.calSeq(arguments);
            fn.memoize.expires(seq);

            fn.memoize.seq = seq;
            if (fn.memoize.cache[seq]) { return true; }
            fn.memoize.cache[seq] = null;
            func.apply(this, arguments);
            return false;
        };
    };
    fn.memoize.write = function (val) {
        if (!fn.memoize.cache[fn.memoize.seq]) fn.memoize.cache[fn.memoize.seq] = { value: val, expires: null };
    };
    fn.memoize.expires = function (seq, sec) {
        if (fn.memoize.cache[seq]) {
            if (fn.memoize.cache[seq].expires != null) { if ((new Date()).getTime() > fn.memoize.cache[seq].expires) fn.memoize.cache[seq] = null; }
            else if (fn.memoize.cache[seq].expires == null && sec != null) { fn.memoize.cache[seq].expires = (new Date()).getTime() + (sec * 1000); }
        }
    };
    fn.memoize.calSeq = function (arg) {
        var str = '';
        for (var i = 0, num = arg.length; i < num; i++) { str += "[" + fn.serializeMemoize(arg[i]) + "]"; }
        return str;
    };
    fn.memoize.cache = {};
    fn.memoize.seq = '';

    //convert
    fn.parseDom = function (arg) { var objE = document.createElement("div"); objE.innerHTML = arg; return objE.childNodes; };

    //replace
    fn.replace = {
        entityNumberToCharBase: function (str) { var arr = [['&#34;', '\"'], ['&#39;', "\'"], ['&#60;', '<'], ['&#62;', '>']]; for (var i = 0, num = arr.length; i < num; i++) { str = str.replace(eval("/" + arr[i][0] + "/g"), arr[i][1]); } return str; },
        charToEntityNumberBase: function (str) { var arr = [['\"', '&#34;'], ["\'", '&#39;'], ['<', '&#60;'], ['>', '&#62;']]; for (var i = 0, num = arr.length; i < num; i++) { str = str.replace(eval("/" + arr[i][0] + "/g"), arr[i][1]); } return str; },
        enterToSpace: function (str) { return str.replace(/[\n\r]/gi, ' '); },
        filterScript: function (str) { return str.replace(/<script.*?<\/script>/gi, ''); },
        filterIframe: function (str) { return str.replace(/<iframe.*?<\/iframe>/gi, ''); }
    };

    //serialize
    fn.serializeUrlArgs = function (obj) { var str = []; for (var key in obj) { if (obj.hasOwnProperty(key)) str.push("&" + key + "=" + (obj[key] == null ? "" : encodeURIComponent(obj[key]))); } return str.join('').substring(1); };
    fn.serializeMemoize = function (arg) {
        var strhash = "";
        if (fn.type.isArray(arg)) {
            for (var i = 0, num = arg.length; i < num; i++) {
                if (fn.type.isArray(arg[i]) || fn.type.isFunction(arg[i]) || fn.type.isElement(arg) || fn.type.isObject(arg[i])) { strhash += fn.serializeMemoize(arg[i]); }
                else { strhash += "_arr:" + arg[i]; }
            }
        }
        else if (fn.type.isFunction(arg)) { strhash += "_func:" + arg; }
        else if (fn.type.isElement(arg)) { strhash += "elem:" + arg.tagName + "," + arg.id + "," + arg.className + "," + arg.innerHTML; }
        else if (fn.type.isObject(arg)) {
            for (var key in arg) {
                if (arg.hasOwnProperty(key)) {
                    if (fn.type.isArray(arg[key]) || fn.type.isFunction(arg[key]) || fn.type.isElement(arg) || fn.type.isObject(arg[key])) { strhash += fn.serializeMemoize(arg[key]); }
                    else { strhash += "_obj:" + key + "=" + arg[key]; }
                }
            }
        } else { strhash += "_" + arg; }

        return strhash;
    };

    //check type
    fn.type = {
        isType: function (obj, type) { return Object.prototype.toString.call(obj) === "[object " + type + "]"; },
        isArray: function (obj) { return this.isType(obj, "Array"); },
        isBool: function (obj) { return this.isType(obj, "Boolean"); },
        isDate: function (obj) { return this.isType(obj, "Date"); },
        isNumber: function (obj) { return this.isType(obj, "Number"); },
        isObject: function (obj) { return this.isType(obj, "Object"); },
        isRegExp: function (obj) { return this.isType(obj, "RegExp"); },
        isString: function (obj) { return this.isType(obj, "String"); },
        isElement: function (obj) { return !!(obj && obj.nodeType == 1); },
        isFunction: function (fn) { return !!fn && !fn.nodeName && fn.constructor != String && fn.constructor != RegExp && fn.constructor != Array && /function/i.test(fn + ""); }
    };

    //<<< general function
    //exchange string length to byte length of utf-8
    fn.byteLengthUTF8 = function (arg) { var byteLen = 0, charCode = ""; if (arg) { for (var i = 0, num = arg.length; i < num; i++) { charCode = arg.charCodeAt(i); if (charCode <= 0x007f) { byteLen += 1; } else if ((0x0080 <= charCode) && (charCode <= 0x07ff)) { byteLen += 2; } else if ((0x0800 <= charCode) && (charCode <= 0xffff)) { byteLen += 3; } } } return byteLen; };

    //exchange string length to byte length of general
    fn.byteLength = function (arg) { var byteLen = 0; if (arg) { for (var i = 0, num = arg.length; i < num; i++, byteLen++) { if (arg.charCodeAt(i) > 255) { byteLen++; } } } return byteLen; };

    //countdown
    fn.calCountdown = function (time) {  //the argument is second(int) or datetime string, calculate the countdown time
        if (isNaN(time)) time = parseInt((fn.Date(time).getTime() - (new Date()).getTime()) / 1000); time = time < 0 ? 0 : time;
        var timeUp = time == 0 ? true : false;
        var sec = time % 60; var min = parseInt(time / 60) % 60; var hour = parseInt(time / 3600) % 24; var day = parseInt(time / 86400);
        return { second: sec, minute: min, hour: hour, day: day, timeUp: timeUp,
            toDay: function () { return this.day + "天" + this.hour + "小时" + this.minute + "分钟" + this.second + "秒"; },
            toHour: function () { return (this.day * 24 + this.hour) + "小时" + this.minute + "分钟" + this.second + "秒"; },
            toMinute: function () { return (this.day * 1440 + this.hour * 60 + this.minute) + "分钟" + this.second + "秒"; }
        };
    };

    //event group
    fn.keyCode = function (e) { return window.event ? e.keyCode : e.which; }; // Netscape/Firefox/Opera used event.which && IE used event.keyCode
    fn.mousePos = function (e) { var e = e || window.event; return { x: e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft, y: e.clientY + document.body.scrollTop + document.documentElement.scrollTop }; };

    //set the img size in the max range
    fn.imgMaxLimit = function (imgD, maxWidth, maxHeight) {
        var image = new Image();
        image.src = imgD.src;
        if (image.width > 0 && image.height > 0) {
            var rate = (maxWidth / image.width < maxHeight / image.height) ? maxWidth / image.width : maxHeight / image.height;
            if (rate <= 1) {
                imgD.width = image.width * rate;
                imgD.height = image.height * rate;
            }
        }
    };

    //verification
    fn.isEmail = function (arg) { return RegExp(/^([a-zA-Z0-9]+[._-])*[a-zA-Z0-9]+@([a-zA-Z0-9]+[._-])+[a-z]{2,3}$/).test(arg); };

    //set string overstep length with "..."
    fn.strPreview = function (arg, len) { var str = arg.replace(/<.*?>/gi, ''); str = str.replace(/[\n\r]/gi, ''); return str.length > len ? str.substring(0, len) + "..." : str; };

    //format string arguments like .strFormat("hello world!{0} good.", "Is")
    fn.strFormat = function () { if (arguments.length == 0) return ""; var strResult = arguments[0]; for (var i = 1, num = arguments.length; i < num; i++) { strResult = strResult.replace(eval("/\\{" + (i - 1) + "\\}/g"), arguments[i]); } return strResult; };

    //trim space
    fn.trimLR = function (arg) { return arg.replace(/(^\s*)|(\s*$)/g, ""); };

    fn.trimL = function (arg) { return arg.replace(/(^\s*)/g, ""); };

    fn.trimR = function (arg) { return arg.replace(/(\s*$)/g, ""); };

    //get url args
    fn.queryString = function (key, url) {
        if (url == null) url = location;
        if (url == -1) url = document.referrer;
        url += "#";
        var urlArgs = url.match(/\?.+?#/);  //return is Array
        if (!urlArgs) return null;
        if (urlArgs[0][1] == "#") return null; //check the index of 1 equals "#" sign
        urlArgs = urlArgs[0].slice(1, -1);
        return (fn.getValByKey(urlArgs, key, "=", "&") == null ? null : decodeURIComponent(fn.getValByKey(urlArgs, key, "=", "&")));
    };

    //<<< internal object extend
    String.prototype.format = function () { var strResult = this; for (var i = 0, num = arguments.length; i < num; i++) { strResult = strResult.replace(eval("/\\{" + i + "\\}/g"), arguments[i]); } return strResult; };
    String.prototype.byteLength = function () { return fn.byteLength(this); };
    String.prototype.byteLengthUTF8 = function () { return fn.byteLengthUTF8(this); };
    String.prototype.trimLR = function () { return fn.trimLR(this); };
    String.prototype.trimL = function () { return fn.trimL(this); };
    String.prototype.trimR = function () { return fn.trimR(this); };
    Date.prototype.format = function (format) { return fn.dateFormat(this, format); };

    //<<< specially good effect
    fn.SE = {
        //text description value: mouse in the default value is hidden, mouse out the default value is show by the value is not empty
        textDescVal: function (arg, val, color) {
            var objT = fn(arg);
            if (color == null) color = "black";
            objT.value = val;
            objT.style.color = color;
            objT.setAttribute("defC", color);
            objT.setAttribute("defV", val);

            objT.onfocus = function () {
                if (this.value == this.getAttribute("defV")) this.value = "";
                this.style.color = "black";
            };
            objT.onblur = function () {
                this.value = fn.trimLR(this.value);
                if (!this.value || this.value == this.getAttribute("defV")) { this.value = this.getAttribute("defV"); this.style.color = this.getAttribute("defC"); }
            };
        },
        //set html element position with fixed
        posFixed: function (arg, pos) {
            var objT = fn(arg);
            objT.upBody();
            if (pos == '居中' || pos == 'center') {
                objT.style.left = parseInt((fn.browser.width() - parseInt(objT.getStyle.width)) / 2) + "px";
                objT.style.top = parseInt((fn.browser.height() - parseInt(objT.getStyle.height)) / 2) + "px";
            } else if (pos == '上' || pos == 'top') {
                objT.style.left = parseInt((fn.browser.width() - parseInt(objT.getStyle.width)) / 2) + "px";
                objT.style.top = "0px";
            } else if (pos == '左' || pos == 'left') {
                objT.style.left = "0px";
                objT.style.top = parseInt((fn.browser.height() - parseInt(objT.getStyle.height)) / 2) + "px";
            } else if (pos == '下' || pos == 'bottom') {
                objT.style.left = parseInt((fn.browser.width() - parseInt(objT.getStyle.width)) / 2) + "px";
                objT.style.top = parseInt(fn.browser.height() - parseInt(objT.getStyle.height)) + "px";
            } else if (pos == '右' || pos == 'right') {
                objT.style.left = parseInt(fn.browser.width() - parseInt(objT.getStyle.width)) + "px";
                objT.style.top = parseInt((fn.browser.height() - parseInt(objT.getStyle.height)) / 2) + "px";
            } else if (pos == '右下' || pos == 'lowerRight') {
                objT.style.left = parseInt(fn.browser.width() - parseInt(objT.getStyle.width)) + "px";
                objT.style.top = parseInt(fn.browser.height() - parseInt(objT.getStyle.height)) + "px";
            } else if (pos == '右上' || pos == 'topRight') {
                objT.style.left = parseInt(fn.browser.width() - parseInt(objT.getStyle.width)) + "px";
                objT.style.top = "0px";
            } else if (pos == '左下' || pos == 'lowerLeft') {
                objT.style.left = "0px";
                objT.style.top = parseInt(fn.browser.height() - parseInt(objT.getStyle.height)) + "px";
            } else if (pos == '左上' || pos == 'topLeft') {
                objT.style.left = "0px";
                objT.style.top = "0px";
            }
            if (fn.browser.isIE6()) {
                objT.style.position = "absolute";
                objT.style.left = (parseInt(objT.getStyle.left) + fn.browser.scrollLeft()) + "px";
                objT.style.top = (parseInt(objT.getStyle.top) + fn.browser.scrollTop()) + "px";
            }
            else { objT.style.position = "fixed"; }

            //set scroll and resize
            if (objT.getAttribute('bBankPosFixed') != 'bBankPosFixed') {
                objT.setAttribute('bBankPosFixed', 'bBankPosFixed');
                fn.scroll(function () { fn.SE.posFixed(arg, pos); });
                fn.resize(function () { fn.SE.posFixed(arg, pos); });
            }
        },
        //shade layer
        shadeLayer: {
            show: function (jsonArg) {
                fn.SE.shadeLayer.core(jsonArg);
                fn('#bBankShadeLayer_div_1b').style.display = "block";
            },
            hidden: function () {
                var objSL = fn('#bBankShadeLayer_div_1b');
                if (objSL) objSL.style.display = "none";
            },
            core: function (jsonArg) {
                var objSL = fn('#bBankShadeLayer_div_1b');
                //init arguments
                jsonArg = jsonArg || {};
                fn.SE.shadeLayer.zIndex = jsonArg.zIndex ? jsonArg.zIndex : 998;
                fn.SE.shadeLayer.color = jsonArg.color ? jsonArg.color : "#000000";
                fn.SE.shadeLayer.opacity = jsonArg.opacity ? jsonArg.opacity : 55;
                //init shade layer div
                if (objSL) {
                    objSL.upBody();
                } else {
                    objSL = document.createElement("div");
                    objSL.id = "bBankShadeLayer_div_1b";
                    document.body.appendChild(objSL);
                    objSL = fn(objSL);
                    //if in ie6, iframe used shade select element
                    if (fn.browser.isIE6()) {
                        objIframe = document.createElement("iframe");
                        objIframe.style.width = "100%";
                        objIframe.style.height = "100%";
                        objIframe.style.position = "absolute";
                        objIframe.style.top = "0px";
                        objIframe.style.left = "0px";
                        objSL.appendChild(objIframe);
                        fn(objIframe).opacity(0);
                    }
                    //set scroll and resize
                    fn.scroll(function () { fn.SE.shadeLayer.core({ zIndex: fn.SE.shadeLayer.zIndex, color: fn.SE.shadeLayer.color, opacity: fn.SE.shadeLayer.opacity }); });
                    fn.resize(function () { fn.SE.shadeLayer.core({ zIndex: fn.SE.shadeLayer.zIndex, color: fn.SE.shadeLayer.color, opacity: fn.SE.shadeLayer.opacity }); });
                }
                //set shade layer div size and position and style
                if (fn.browser.isIE6()) {
                    objSL.style.position = "absolute";
                    objSL.style.width = (fn.browser.scrollLeft() + fn.browser.width()) + "px";
                    objSL.style.height = (fn.browser.scrollTop() + fn.browser.height()) + "px";
                }
                else {
                    objSL.style.position = "fixed";
                    objSL.style.width = fn.browser.width() + "px";
                    objSL.style.height = fn.browser.height() + "px";
                }
                objSL.style.top = "0px";
                objSL.style.left = "0px";
                objSL.style.zIndex = fn.SE.shadeLayer.zIndex;
                objSL.style.backgroundColor = fn.SE.shadeLayer.color;
                objSL.opacity(fn.SE.shadeLayer.opacity);
            },
            zIndex: 998,
            color: "#000000",
            opacity: 55
        },
        //mouse drag move
        _drag_nn6: document.getElementById && !document.all, //Netscape Navigator 6
        _drag_isdrag: false,
        _drag_y: null,
        _drag_x: null,
        _drag_nTY: null,
        _drag_nTX: null,
        _drag_oDragObj: null,
        drag: function (o, t) {
            o = fn(o); if (t != null) t = fn(t);
            o.setAttribute("bBankDrag_1b", "bBankDrag_1b");
            if (t != null) t.setAttribute("bBankTriggerDrag_1b", "bBankTriggerDrag_1b");
            else o.setAttribute("bBankTriggerDrag_1b", "bBankTriggerDrag_1b");

            function moveMouse(e) {
                if (fn.SE._drag_isdrag) {
                    fn.SE._drag_oDragObj.style.top = (fn.SE._drag_nn6 ? fn.SE._drag_nTY + e.clientY - fn.SE._drag_y : fn.SE._drag_nTY + event.clientY - fn.SE._drag_y) + "px";
                    fn.SE._drag_oDragObj.style.left = (fn.SE._drag_nn6 ? fn.SE._drag_nTX + e.clientX - fn.SE._drag_x : fn.SE._drag_nTX + event.clientX - fn.SE._drag_x) + "px";
                    return false;
                }
            }

            function initDrag(e) {
                var oDragHandle = fn.SE._drag_nn6 ? e.target : event.srcElement;
                var topElement = "HTML";

                while (oDragHandle.tagName != topElement && oDragHandle.getAttribute("bBankTriggerDrag_1b") == null) {
                    oDragHandle = oDragHandle.parentNode;
                }
                if (oDragHandle.getAttribute("bBankTriggerDrag_1b") == "bBankTriggerDrag_1b") {
                    while (oDragHandle.tagName != topElement && oDragHandle.getAttribute("bBankDrag_1b") == null) {
                        oDragHandle = oDragHandle.parentNode;
                    }
                    if (oDragHandle.getAttribute("bBankDrag_1b") == "bBankDrag_1b") {
                        fn.SE._drag_isdrag = true;
                        fn.SE._drag_oDragObj = oDragHandle;
                        fn.SE._drag_nTY = parseInt(fn.SE._drag_oDragObj.style.top + 0);
                        fn.SE._drag_y = fn.SE._drag_nn6 ? e.clientY : event.clientY;
                        fn.SE._drag_nTX = parseInt(fn.SE._drag_oDragObj.style.left + 0);
                        fn.SE._drag_x = fn.SE._drag_nn6 ? e.clientX : event.clientX;
                        document.onmousemove = moveMouse;
                        return false;
                    }
                }
            }

            document.onmousedown = initDrag;
            document.onmouseup = function () { fn.SE._drag_isdrag = false; };
        }
    };

    //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    //<<< adddomloadevent.js modify (substitute for window.onload, is earlier than window.onload, like jquery's ready() function) <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    /*
     * (c)2006 Jesse Skinner/Dean Edwards/Matthias Miller/John Resig
     * Special thanks to Dan Webb's domready.js Prototype extension
     * and Simon Willison's addLoadEvent
     *
     * For more info, see:
     * http://www.thefutureoftheweb.com/blog/adddomloadevent
     * http://dean.edwards.name/weblog/2006/06/again/
     * http://www.vivabit.com/bollocks/2006/06/21/a-dom-ready-extension-for-prototype
     * http://simon.incutio.com/archive/2004/05/26/addLoadEvent
     *
     *
     * To use: call addDOMLoadEvent one or more times with functions, ie:
     *
     *    function something() {
     *       // do something
     *    }
     *    addDOMLoadEvent(something);
     *
     *    addDOMLoadEvent(function() {
     *        // do other stuff
     *    });
     *
     * Modify by Bruce.li, April 11th 2010
     */
    fn.load = (function () {
        // create event function stack
        var load_events = [],
            load_timer,
            script,
            done,
            exec,
            old_onload,
            init = function () {
                done = true;

                // kill the timer
                clearInterval(load_timer);

                // execute each function in the stack in the order they were added
                while (exec = load_events.shift())
                    exec();

                if (script) script.onreadystatechange = '';
            };

        return function (func) {
            // if the init function was already ran, just run this function now and stop
            if (done) return func();

            if (!load_events[0]) {
                // for Mozilla/Opera9
                if (document.addEventListener)
                    document.addEventListener("DOMContentLoaded", init, false);

                // for Internet Explorer
                /*@cc_on@*/
                /*@if (@_win32)
                 document.write("<script id=__ie_onload defer src=//0><\/scr" + "ipt>");
                 script = document.getElementById("__ie_onload");
                 script.onreadystatechange = function () {
                 if (this.readyState == "complete")
                 init(); // call the onload handler
                 };
                 /*@end@*/

                // for Safari
                if (/WebKit/i.test(navigator.userAgent)) { // sniff
                    load_timer = setInterval(function () {
                        if (/loaded|complete/.test(document.readyState))
                            init(); // call the onload handler
                    }, 10);
                }

                // for other browsers set the window.onload, but also execute the old window.onload
                old_onload = window.onload;
                window.onload = function () {
                    init();
                    if (old_onload) old_onload();
                };
            }

            load_events.push(func);
        }
    })();

    //<<< getElementsBySelector.js modify <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    /* document.getElementsBySelector(selector)
     - returns an array of element objects from the current document
     matching the CSS selector. Selectors can contain element names,
     class names and ids and can be nested. For example:

     elements = document.getElementsBySelect('div#main p a.external')

     Will return an array of all 'a' elements with 'external' in their
     class attribute that are contained inside 'p' elements that are
     contained inside the 'div' element which has id="main"

     New in version 0.4: Support for CSS2 and CSS3 attribute selectors:
     See http://www.w3.org/TR/css3-selectors/#attribute-selectors

     Version 0.4 - Simon Willison, March 25th 2003
     -- Works in Phoenix 0.5, Mozilla 1.3, Opera 7, Internet Explorer 6, Internet Explorer 5 on Windows
     -- Opera 7 fails

     -- Detail:http://simonwillison.net/2003/Mar/25/getElementsBySelector/
     -- Modify by Bruce.li, April 11th 2010
     */
    fn.getAllChildren = function (e) {
        // Returns all children of element. Workaround required for IE5/Windows. Ugh.
        return e.all ? e.all : e.getElementsByTagName('*');
    };

    fn.getElementsBySelector = function (selector, contextObj) {
        // Attempt to fail gracefully in lesser browsers
        if (!document.getElementsByTagName) {
            return new Array();
        }
        // Split selector in to tokens
        var tokens = selector.split(' ');
        // Modify by Bruce.li
        contextObj = contextObj || document;
        var currentContext = new Array(contextObj);
        // End Modify
        for (var i = 0, numi = tokens.length; i < numi; i++) {
            token = tokens[i].replace(/^\s+/, '').replace(/\s+$/, ''); ;
            if (token.indexOf('#') > -1) {
                // Token is an ID selector
                var bits = token.split('#');
                var tagName = bits[0];
                var id = bits[1];
                var element = document.getElementById(id);
                // Fixed a bug by Bruce.li for element is not exist the return val is error
                //if (tagName && element.nodeName.toLowerCase() != tagName) {
                if (!element || (tagName && element.nodeName.toLowerCase() != tagName)) {
                    // tag with that ID not found, return false
                    return new Array();
                }
                // Set currentContext to contain just this element
                currentContext = new Array(element);
                continue; // Skip to next token
            }
            if (token.indexOf('.') > -1) {
                // Token contains a class selector
                var bits = token.split('.');
                var tagName = bits[0];
                var className = bits[1];
                if (!tagName) {
                    tagName = '*';
                }
                // Get elements matching tag, filter them for class selector
                var found = new Array;
                var foundCount = 0;
                for (var h = 0, numh = currentContext.length; h < numh; h++) {
                    var elements;
                    if (tagName == '*') {
                        elements = fn.getAllChildren(currentContext[h]);
                    } else {
                        elements = currentContext[h].getElementsByTagName(tagName);
                    }
                    for (var j = 0, numj = elements.length; j < numj; j++) {
                        found[foundCount++] = elements[j];
                    }
                }
                currentContext = new Array;
                var currentContextIndex = 0;
                for (var k = 0, numk = found.length; k < numk; k++) {
                    if (found[k].className && found[k].className.match(new RegExp('\\b' + className + '\\b'))) {
                        currentContext[currentContextIndex++] = found[k];
                    }
                }
                continue; // Skip to next token
            }
            // Code to deal with attribute selectors
            if (token.match(/^(\w*)\[(\w+)([=~\|\^\$\*]?)=?"?([^\]"]*)"?\]$/)) {
                var tagName = RegExp.$1;
                var attrName = RegExp.$2;
                var attrOperator = RegExp.$3;
                var attrValue = RegExp.$4;
                if (!tagName) {
                    tagName = '*';
                }
                // Grab all of the tagName elements within current context
                var found = new Array;
                var foundCount = 0;
                for (var h = 0, numh = currentContext.length; h < numh; h++) {
                    var elements;
                    if (tagName == '*') {
                        elements = fn.getAllChildren(currentContext[h]);
                    } else {
                        elements = currentContext[h].getElementsByTagName(tagName);
                    }
                    for (var j = 0, numj = elements.length; j < numj; j++) {
                        found[foundCount++] = elements[j];
                    }
                }
                currentContext = new Array;
                var currentContextIndex = 0;
                var checkFunction; // This function will be used to filter the elements
                switch (attrOperator) {
                    case '=': // Equality
                        checkFunction = function (e) { return (e.getAttribute(attrName) == attrValue); };
                        break;
                    case '~': // Match one of space seperated words
                        checkFunction = function (e) { return (e.getAttribute(attrName).match(new RegExp('\\b' + attrValue + '\\b'))); };
                        break;
                    case '|': // Match start with value followed by optional hyphen
                        checkFunction = function (e) { return (e.getAttribute(attrName).match(new RegExp('^' + attrValue + '-?'))); };
                        break;
                    case '^': // Match starts with value
                        checkFunction = function (e) { return (e.getAttribute(attrName).indexOf(attrValue) == 0); };
                        break;
                    case '$': // Match ends with value - fails with "Warning" in Opera 7
                        checkFunction = function (e) { return (e.getAttribute(attrName).lastIndexOf(attrValue) == e.getAttribute(attrName).length - attrValue.length); };
                        break;
                    case '*': // Match ends with value
                        checkFunction = function (e) { return (e.getAttribute(attrName).indexOf(attrValue) > -1); };
                        break;
                    default:
                        // Just test for existence of attribute
                        checkFunction = function (e) { return e.getAttribute(attrName); };
                }
                currentContext = new Array;
                var currentContextIndex = 0;
                for (var k = 0, numk = found.length; k < numk; k++) {
                    if (checkFunction(found[k])) {
                        currentContext[currentContextIndex++] = found[k];
                    }
                }
                // alert('Attribute Selector: '+tagName+' '+attrName+' '+attrOperator+' '+attrValue);
                continue; // Skip to next token
            }
            // If we get here, token is JUST an element (not a class or ID selector)
            tagName = token;
            var found = new Array;
            var foundCount = 0;
            for (var h = 0, numh = currentContext.length; h < numh; h++) {
                var elements = currentContext[h].getElementsByTagName(tagName);
                for (var j = 0, numj = elements.length; j < numj; j++) {
                    found[foundCount++] = elements[j];
                }
            }
            currentContext = found;
        }
        return currentContext;
    };

    /* That revolting regular expression explained
     /^(\w+)\[(\w+)([=~\|\^\$\*]?)=?"?([^\]"]*)"?\]$/
     \---/  \---/\-------------/    \-------/
     |      |         |               |
     |      |         |           The value
     |      |    ~,|,^,$,* or =
     |   Attribute
     Tag
     */

    //<<< XHConn.js modify <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    /* XHConn - Simple XMLHTTP Interface - bfults@gmail.com - 2005-04-08        **
     ** Code licensed under Creative Commons Attribution-ShareAlike License      **
     ** http://creativecommons.org/licenses/by-sa/2.0/                           **
     **                                                                          **
     ** Detail:http://xkr.us/code/javascript/XHConn/                             **
     ** Modify by Bruce.li, April 12th 2010                                      */
    fn.ajax = function (sURL, sMethod, sVars, fnDone) {
        //sVars and fnDone dispose, by bruce.li
        if (typeof sVars == "object" && sVars != null) sVars = fn.serializeUrlArgs(sVars);
        if (!fnDone) fnDone = function (d) { };

        var xmlhttp, bComplete = false;
        try { xmlhttp = new ActiveXObject("Msxml2.XMLHTTP"); }
        catch (e) {
            try { xmlhttp = new ActiveXObject("Microsoft.XMLHTTP"); }
            catch (e) {
                try { xmlhttp = new XMLHttpRequest(); }
                catch (e) { xmlhttp = false; }
            }
        }
        if (!xmlhttp) return false;
        sMethod = sMethod.toUpperCase();

        try {
            if (sMethod == "GET") {
                xmlhttp.open(sMethod, sURL + "?" + (sVars || ""), true);
                sVars = "";
            }
            else {
                xmlhttp.open(sMethod, sURL, true);
                xmlhttp.setRequestHeader("Method", "POST " + sURL + " HTTP/1.1");
                xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            }
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4 && !bComplete) {
                    bComplete = true;
                    fnDone(xmlhttp.responseText);
                }
            };
            xmlhttp.send(sVars);
        }
        catch (z) { return false; }
        return true;
    };

    //<<< grayscale.js modify <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    /*
     * -- grayscale.js --
     * Copyright (C) James Padolsey (http://james.padolsey.com)
     *
     * Detail:http://james.padolsey.com/javascript/grayscaling-in-non-ie-browsers/
     * Modify by Bruce.li, May 5th 2010
     */
    fn.grayscale = (function () {

        var config = {
                colorProps: ['color', 'backgroundColor', 'borderBottomColor', 'borderTopColor', 'borderLeftColor', 'borderRightColor', 'backgroundImage'],
                externalImageHandler: {
                    /* Grayscaling externally hosted images does not work
                     - Use these functions to handle those images as you so desire */
                    /* Out of convenience these functions are also used for browsers
                     like Chrome that do not support CanvasContext.getImageData */
                    init: function (el, src) {
                        if (el.nodeName.toLowerCase() === 'img') {
                            // Is IMG element...
                        } else {
                            // Is background-image element:
                            // Default - remove background images
                            data(el).backgroundImageSRC = src;
                            el.style.backgroundImage = '';
                        }
                    },
                    reset: function (el) {
                        if (el.nodeName.toLowerCase() === 'img') {
                            // Is IMG element...
                        } else {
                            // Is background-image element:
                            el.style.backgroundImage = 'url(' + (data(el).backgroundImageSRC || '') + ')';
                        }
                    }
                }
            },
            log = function () {
                try { window.console.log.apply(console, arguments); }
                catch (e) { };
            },
            isExternal = function (url) {
                // Checks whether URL is external: 'CanvasContext.getImageData'
                // only works if the image is on the current domain.
                return (new RegExp('https?://(?!' + window.location.hostname + ')')).test(url);
            },
            data = (function () {

                var cache = [0],
                    expando = 'data' + (+new Date());

                return function (elem) {
                    var cacheIndex = elem[expando],
                        nextCacheIndex = cache.length;
                    if (!cacheIndex) {
                        cacheIndex = elem[expando] = nextCacheIndex;
                        cache[cacheIndex] = {};
                    }
                    return cache[cacheIndex];
                };

            })(),
            desatIMG = function (img, prepare, realEl) {

                // realEl is only set when img is temp (for BG images)

                var canvas = document.createElement('canvas'),
                    context = canvas.getContext('2d'),
                    height = img.naturalHeight || img.offsetHeight || img.height,
                    width = img.naturalWidth || img.offsetWidth || img.width,
                    imgData;

                canvas.height = height;
                canvas.width = width;
                context.drawImage(img, 0, 0);
                try {
                    imgData = context.getImageData(0, 0, width, height);
                } catch (e) { }

                if (prepare) {
                    desatIMG.preparing = true;
                    // Slowly recurse through pixels for prep,
                    // :: only occurs on grayscale.prepare()
                    var y = 0;
                    (function () {

                        if (!desatIMG.preparing) { return; }

                        if (y === height) {
                            // Finished!
                            context.putImageData(imgData, 0, 0, 0, 0, width, height);
                            realEl ? (data(realEl).BGdataURL = canvas.toDataURL())
                                : (data(img).dataURL = canvas.toDataURL())
                        }

                        for (var x = 0; x < width; x++) {
                            var i = (y * width + x) * 4;
                            // Apply Monoschrome level across all channels:
                            imgData.data[i] = imgData.data[i + 1] = imgData.data[i + 2] =
                                RGBtoGRAYSCALE(imgData.data[i], imgData.data[i + 1], imgData.data[i + 2]);
                        }

                        y++;
                        setTimeout(arguments.callee, 0);

                    })();
                    return;
                } else {
                    // If desatIMG was called without 'prepare' flag
                    // then cancel recursion and proceed with force! (below)
                    desatIMG.preparing = false;
                }

                for (var y = 0; y < height; y++) {
                    for (var x = 0; x < width; x++) {
                        var i = (y * width + x) * 4;
                        // Apply Monoschrome level across all channels:
                        imgData.data[i] = imgData.data[i + 1] = imgData.data[i + 2] =
                            RGBtoGRAYSCALE(imgData.data[i], imgData.data[i + 1], imgData.data[i + 2]);
                    }
                }

                context.putImageData(imgData, 0, 0, 0, 0, width, height);
                return canvas;

            },
            getStyle = function (el, prop) {
                var style = document.defaultView && document.defaultView.getComputedStyle ?
                    document.defaultView.getComputedStyle(el, null)[prop]
                    : el.currentStyle[prop];
                // If format is #FFFFFF: (convert to RGB)
                if (style && /^#[A-F0-9]/i.test(style)) {
                    var hex = style.match(/[A-F0-9]{2}/ig);
                    style = 'rgb(' + parseInt(hex[0], 16) + ','
                        + parseInt(hex[1], 16) + ','
                        + parseInt(hex[2], 16) + ')';
                }
                return style;
            },
            RGBtoGRAYSCALE = function (r, g, b) {
                // Returns single monochrome figure:
                return parseInt((0.2125 * r) + (0.7154 * g) + (0.0721 * b), 10);
            },
            getAllNodes = function (context) {
                var all = Array.prototype.slice.call(context.getElementsByTagName('*'));
                all.unshift(context);
                return all;
            };

        var init = function (context) {

            // Handle if a DOM collection is passed instead of a single el:
            if (context && context[0] && context.length && context[0].nodeName) {
                // Is a DOM collection:
                var allContexts = Array.prototype.slice.call(context),
                    cIndex = -1, cLen = allContexts.length;
                while (++cIndex < cLen) { init.call(this, allContexts[cIndex]); }
                return;
            }

            context = context || document.documentElement;

            if (!document.createElement('canvas').getContext) {
                context.style.filter = 'progid:DXImageTransform.Microsoft.BasicImage(grayscale=1)';
                context.style.zoom = 1;
                return;
            }

            var all = getAllNodes(context),
                i = -1, len = all.length;

            while (++i < len) {
                var cur = all[i];

                if (cur.nodeName.toLowerCase() === 'img') {
                    var src = cur.getAttribute('src');
                    if (!src) { continue; }
                    if (isExternal(src)) {
                        config.externalImageHandler.init(cur, src);
                    } else {
                        data(cur).realSRC = src;
                        try {
                            // Within try statement just encase there's no support....
                            cur.src = data(cur).dataURL || desatIMG(cur).toDataURL();
                        } catch (e) { config.externalImageHandler.init(cur, src); }
                    }

                } else {
                    for (var pIndex = 0, pLen = config.colorProps.length; pIndex < pLen; pIndex++) {
                        var prop = config.colorProps[pIndex],
                            style = getStyle(cur, prop);
                        if (!style) { continue; }
                        if (cur.style[prop]) {
                            data(cur)[prop] = style;
                        }
                        // RGB color:
                        if (style.substring(0, 4) === 'rgb(') {
                            var monoRGB = RGBtoGRAYSCALE.apply(null, style.match(/\d+/g));
                            cur.style[prop] = style = 'rgb(' + monoRGB + ',' + monoRGB + ',' + monoRGB + ')';
                            continue;
                        }
                        // Background Image:
                        if (style.indexOf('url(') > -1) {
                            var urlPatt = /\(['"]?(.+?)['"]?\)/,
                                url = style.match(urlPatt)[1];
                            if (isExternal(url)) {
                                config.externalImageHandler.init(cur, url);
                                data(cur).externalBG = true;
                                continue;
                            }
                            // data(cur).BGdataURL refers to caches URL (from preparation)
                            try {
                                var imgSRC = data(cur).BGdataURL || (function () {
                                        var temp = document.createElement('img');
                                        temp.src = url;
                                        return desatIMG(temp).toDataURL();
                                    })();

                                cur.style[prop] = style.replace(urlPatt, function (_, url) {
                                    return '(' + imgSRC + ')';
                                });
                            } catch (e) { config.externalImageHandler.init(cur, url); }
                        }
                    }
                }
            }

        };

        init.reset = function (context) {
            // Handle if a DOM collection is passed instead of a single el:
            if (context && context[0] && context.length && context[0].nodeName) {
                // Is a DOM collection:
                var allContexts = Array.prototype.slice.call(context),
                    cIndex = -1, cLen = allContexts.length;
                while (++cIndex < cLen) { init.reset.call(this, allContexts[cIndex]); }
                return;
            }
            context = context || document.documentElement;
            if (!document.createElement('canvas').getContext) {
                context.style.filter = 'progid:DXImageTransform.Microsoft.BasicImage(grayscale=0)';
                return;
            }
            var all = getAllNodes(context),
                i = -1, len = all.length;
            while (++i < len) {
                var cur = all[i];
                if (cur.nodeName.toLowerCase() === 'img') {
                    var src = cur.getAttribute('src');
                    if (isExternal(src)) {
                        config.externalImageHandler.reset(cur, src);
                    }
                    cur.src = data(cur).realSRC || src;
                } else {
                    for (var pIndex = 0, pLen = config.colorProps.length; pIndex < pLen; pIndex++) {
                        if (data(cur).externalBG) {
                            config.externalImageHandler.reset(cur);
                        }
                        var prop = config.colorProps[pIndex];
                        cur.style[prop] = data(cur)[prop] || '';
                    }
                }
            }
        };

        init.prepare = function (context) {

            // Handle if a DOM collection is passed instead of a single el:
            if (context && context[0] && context.length && context[0].nodeName) {
                // Is a DOM collection:
                var allContexts = Array.prototype.slice.call(context),
                    cIndex = -1, cLen = allContexts.length;
                while (++cIndex < cLen) { init.prepare.call(null, allContexts[cIndex]); }
                return;
            }

            // Slowly recurses through all elements
            // so as not to lock up on the user.

            context = context || document.documentElement;

            if (!document.createElement('canvas').getContext) { return; }

            var all = getAllNodes(context),
                i = -1, len = all.length;

            while (++i < len) {
                var cur = all[i];
                if (data(cur).skip) { return; }
                if (cur.nodeName.toLowerCase() === 'img') {
                    if (cur.getAttribute('src') && !isExternal(cur.src)) {
                        desatIMG(cur, true);
                    }

                } else {
                    var style = getStyle(cur, 'backgroundImage');
                    if (style.indexOf('url(') > -1) {
                        var urlPatt = /\(['"]?(.+?)['"]?\)/,
                            url = style.match(urlPatt)[1];
                        if (!isExternal(url)) {
                            var temp = document.createElement('img');
                            temp.src = url;
                            desatIMG(temp, true, cur);
                        }
                    }
                }
            }
        };

        return init;

    })();

    //END
})();