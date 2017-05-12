/**
 * ejs2是基于ejs的一个扩展，主要用于设置数据自动更新模版，类似于数据单项绑定。
 *
 * 注意：
 * 使用ejs2必须先引入ejs，ejs2不能够单独使用。
 * 使用ejs2需要jquery支持，请事先引入jQuery。
 */

(function () {

    if (window.ejs2) {
        warn('不要重复加载ejs2');
        return;
    }

    var fn = window.ejs2 = {};
    var ejs2Set = {};

    /**
     * 返回渲染后的模版对象（jQuery对象）
     *
     * @param html 模版
     * @param data 模版数据
     * @param $target 模版要载入的目标，jquery对象
     * @return {*|jQuery|HTMLElement}
     */
    fn.render = function (html, data, $target, init) {
        if (ejs2Set[data.id]) {
            warn('error:render 不要重复渲染模版，请使用setData来更新模版');
            return;
        }

        // 生成jquery对象
        var $result = $(ejs.render(html, data));

        // 执行初始化方法
        // console.log($result);
        init.call($result);

        // ejs2对象格式
        var ejs2Obj = {html: html, data: data, $root: $result, init: init};

        // 存入集合
        ejs2Set[data.id] = ejs2Obj;

        if ($target != null) {
            // 插入目标元素
            $target.append(ejs2Obj.$root);
        }

        // 返回生成的模版jquery对象
        return ejs2Obj.$root;
    };

    /**
     * 更新模版数据
     *
     * @param data 新数据
     */
    fn.setData = function (data) {
        if (ejs2Set[data.id] == null) {
            warn('error:setData 没有找到id为' + data.id + '的模版');
            return;
        }

        // 获取ejs2对象
        var ejs2Obj = ejs2Set[data.id];

        // 合并新数据到旧数据
        for (var key in ejs2Obj.data) {
            if (data[key] === undefined) {
                continue;
            }

            ejs2Obj.data[key] = data[key];
        }

        // 更新模版内容
        var $oldRoot = ejs2Obj.$root;
        var $result = $(ejs.render(ejs2Obj.html, ejs2Obj.data));
        ejs2Obj.init.call($result);
        ejs2Obj.$root = $result;
        // ejs2Obj.$root = $result;
        // var innerHtml = $result.html();
        $oldRoot.replaceWith($result);
        // ejs2Obj.$root = $result;
    };

    function warn(message) {
        if (console.warn) {
            console.warn(message);
        }
        else {
            console.log(message);
        }
    };
})();