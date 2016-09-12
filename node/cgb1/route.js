var fs = require('fs');
var path = require('path');
var control = require('./control');

function load(app) {

    var list = fs.readdirSync(path.join(__dirname, 'routes'));

    list.forEach(function (item) {

        var fileName = './routes/' + item;

        require(fileName)(app, control);
    });

    console.log(list)
}

module.exports = load;