/**
 * Created by lixun on 2016/11/17.
 */

module.exports = function (app, control) {

    app.get('/test-api', control('test/api'));

};