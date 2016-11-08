/**
 * Created by lixun on 16/9/7.
 */

module.exports = function (app, control) {

    app.get('/test', control('test/test'));

    app.get('/test1', control('test/test1'));
};