define(
    [
        "text!ejs/bold/main.ejs",
        "css!ejs/bold/main.css"
    ],
    function (html, css) {
        // var counter = 6;

        return {
            createNew: function (id, $target) {
                var fn = {};
                var counter = 6;

                init();

                fn.show = function () {
                    ejs2.setData({id: id, show: true});
                };

                function init() {
                    // ajax to get data

                    var initData = {
                        id: id,
                        counter: counter,
                        inputTxt: 'no word',
                        txtValue: '',
                        show: false
                    };

                    ejs2.render(html, initData, $target, events);
                    ejs2.renderTo(html, data, $target);
                    ejs.renderTo(html, data, $target);
                    // ejs2.render(id, html, {counter: counter}, $target, events);
                    // ejs.render({id: id, html: html, data: {counter: counter}, target: $target, onEvent: events});
                }

                function events() {
                    var $root = this;
                    console.log($root)

                    $root.on('click', '.container', function () {
                        counter++;
                        console.log(counter)
                        ejs2.setData({id: id, counter: counter});
                    });

                    $root
                        .on('click', '.txt', function () {
                            return false;
                        })
                        .on('keyup', '.txt', function (e) {
                            console.log('keydown')
                            var txt = $(e.target).val();
                            console.log(txt)

                            ejs2.setData({id: id, inputTxt: txt, txtValue: txt});
                        });
                }

                return fn;
            }
        };
    });
