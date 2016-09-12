/**
 * Created by lixun on 16/9/4.
 */

module.exports = function (src) {

    var callback = require('./controllers/' + src);

    return callback;
};