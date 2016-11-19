/**
 * Created by lixun on 2016/11/17.
 */

var apiHost = 'http://api.v2.maiche.com/';
var selfHost = 'http://127.0.0.1:3000/';

module.exports = {
    //获取所有车型数量
    'allCarCountInfo': apiHost + 'api/open/car-basic/get-all-car-count-info.htm',

    'hello': selfHost + 'api/test'
};