/**
 * Created by lixun on 2016/10/13.
 */

define(function () {
    "use strict";

    var $layout = $('._layout');
    var $right = $('.right-panel');
    var $main = $('.main-panel');
    var $bottom = $('.bottom-panel');
    var $bottomDrag = $('.bottom-panel .drag');

    var dragDom = null;
    var dragStartY = 0;

    $layout.on('mouseup', function (e) {

        dragDom = null;
    });

    $layout.on('mousemove', function (e) {

        if (dragDom != null) {

            if (dragDom === $bottom) {

                // 计算移动位移
                var y = e.pageY;
                var diff = dragStartY - y;
                dragStartY = y;

                // 修改底部面板高度
                dragDom.height(dragDom.height() + diff);

                // 调整右面板和主面板的高度
                var bottomPx = $bottom.height() + 'px';
                $right[0].style.bottom = bottomPx;
                $main[0].style.bottom = bottomPx;
            }
        }
    });

    $bottomDrag.on('mousedown', function (e) {

        dragDom = $bottom;
        dragStartY = e.pageY;
    });

    return {
        $rightPanel: $right,
        $mainPanel: $main,
        $bottomPanel: $bottom
    };
});