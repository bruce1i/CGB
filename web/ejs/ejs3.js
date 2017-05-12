/**
 * ejs2是基于ejs的一个扩展，主要用于设置数据自动更新模版，类似于数据单项绑定。
 *
 * 注意：
 * 使用ejs2必须先引入ejs，ejs2不能够单独使用。
 * 使用ejs2需要jquery支持，请事先引入jQuery。
 */

ejs.renderTo = function (html, data, $target) {
    // 生成jquery对象
    var $root = $(ejs.render(html, data));

    if ($target != null) {
        if (typeof $target == 'string') {
            $target = $($target);
        }

        // 插入目标元素
        $target.append($root);
    }

    return $root;
};
