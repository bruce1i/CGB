/**
 * Created by lixun on 16/9/7.
 */

module.exports = function (app, control) {

    app.get('/log', control('log/log'));
};