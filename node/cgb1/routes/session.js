/**
 * Created by lixun on 16/9/7.
 */

module.exports = function (app, control) {

    app.get('/getsession', control('session/get'));

    app.get('/reloadsession', control('session/reload'));

    app.get('/sessionid', control('session/id'));
};