module.exports = function (app, control) {

    app.get('/users', control('users'));
};