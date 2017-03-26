/**
 * Created by lixun on 2017/2/23.
 */

var process = require('child_process');

process.exec(
    'ls',
    function (error, stdout, stderr) {
        console.log(stdout)
        if (error !== null) {
            console.log('exec error: ' + error);
        }
    }
);

process.exec(
    'cd ~/Desktop/pm2 && ls && pm2 deploy pm2.config.js f-test.eg365.cn:local --force',
    function (error, stdout, stderr) {
        console.log(stdout)
        if (error !== null) {
            console.log('exec error: ' + error);
        }
    }
);