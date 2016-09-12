/**
 * Created by lixun on 16/9/4.
 */

module.exports = {

    env: 'develop',
    env_output_profile_to_console: false,

    /**
     * session 配置
     */
    // session模式(default/redis),default使用默认储存,不推荐使用在生产环境,会有内存泄漏问题。
    session_store: 'default',
    session_redis_host: '10.211.55.16',
    session_redis_port: 6379,

    /**
     * log 日志配置
     */
    log_print_to_console: true,
    log_save_to_file: false,
    // log文件储存在bin目录下
    log_file_name: 'err-file.log',
    log_save_to_mongodb: false,
    log_mongodb_connection: 'mongodb://10.211.55.16:27017/mydb',

};