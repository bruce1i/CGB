/**
 * Created by lixun on 2016/10/16.
 */

define(
    [
        'text!lib/h5Engine/canvas/html.ejs',
        'css!lib/h5Engine/canvas/style.css'
    ],
    function (template, style) {

        return {
            render: function ($target, args) {

                $target.html(ejs.render(template, args));
            }
        };
    });