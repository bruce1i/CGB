/**
 * Created by lixun on 16/9/17.
 */

var globalValue; //这个变量可以理解为静态变量(static)
// var globalValue = 99; //文件只会加载一次执行

exports.setGlobal = function (val) {
    globalValue = val;
};

exports.returnGlobal = function () {
    console.log('> globalValue: test.js')
    // console.log(global);

    return globalValue;
};
