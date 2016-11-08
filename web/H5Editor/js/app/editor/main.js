/**
 * Created by lixun on 2016/10/13.
 */
require.config({
    baseUrl: '../../js',
    paths: {
        layout: 'app/editor/layout',
        h5Core: 'lib/h5Engine/h5Engine.core',
        h5Canvas: 'lib/h5Engine/canvas/main'
    },
    map: {
        '*': {
            'text': 'lib/require-text',
            'css':'lib/require-css'
        }
    },
});

$(function () {
    require(['layout', 'h5Core', 'h5Canvas'], function (layout, h5Core, h5Canvas) {

        // console.log(ejs);
        //
        // var html = ejs.render(text, {name: 'Bruce'});
        //
        // alert(html);

        h5Canvas.render(layout.$mainPanel, {name: 'Andy'});
    });
});