/**
 * Created by lixun on 16/9/17.
 */

var globalValue;

exports.setGlobal = function (val) {
    globalValue = val;
};

exports.returnGlobal = function () {
    console.log('> globalValue')
    console.log(global);

    return globalValue;
};
