/**
 * Created by lixun on 16/9/3.
 */

module.exports = function (app, control) {


    app.get('/api/test', control('test/gettest'));

    app.post('/api/test', control('test/posttest'));
};