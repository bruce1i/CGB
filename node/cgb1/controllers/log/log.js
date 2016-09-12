/**
 * Created by lixun on 16/9/4.
 */

var request = require('request');
var winston = require('winston');

module.exports = function (req, res, next) {

    winston.profile('test profile');

    // winston.log('info', 'hello, test log.', function (err, level, msg, meta) {
    //     console.log('call back');
    // });

    winston.info('another way to log info level');

    winston.error('test error level');

    winston.warn('test warn level');

    winston.info('test info level');

    winston.verbose('test verbose level');

    winston.debug('test debug level');

    winston.silly('test silly level');

    winston.info('test metadata', {anything: 'This is metadata', two: 'heool,sdfs'});

    winston.profile('test profile');

    //region 查询日志
    // var queryOptions = {
    //     from: new Date - 24 * 60 * 60 * 1000,
    //     until: new Date,
    //     limit: 20,
    //     start: 0,
    //     order: 'desc',
    //     fields: ['anything']
    // };
    //
    // winston.query(queryOptions, function (err, results) {
    //
    //     console.log(results)
    // });
    //endregion

    // winston.stream({ start: -1 }).on('log', function(log) {
    //     console.log(log);
    // });

    // throw new Error('test exception');

    res.render('log/log');
};