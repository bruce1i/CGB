/**
 * Created by lixun on 16/9/4.
 */

var config = require('./config');
var winston = require('winston');
require('winston-mongodb').MongoDB;


winston.level = 'info';

if (config.log_print_to_console == false) {
    winston.remove(winston.transports.Console);
}

if (config.log_save_to_file) {
    winston.add(winston.transports.File, {filename: config.log_file_name});
}

if (config.log_save_to_mongodb) {
    winston.add(winston.transports.MongoDB, {db: config.log_mongodb_connection});
}
