/**
 * Created by lixun on 16/9/3.
 */

module.exports = function (app, control) {

    // app.get('/', function (req, res, next) {
    //
    //     control.load('home', req, res, next);
    // });

    app.get('/', control('home'));

    app.get('/about', control('about'));
};