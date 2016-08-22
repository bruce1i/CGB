/**
 * Created by lixun on 16/6/14.
 */

/** IE 9 or older setTimeout 垫片 */
//region setTimeout 垫片
if (document.all && !window.atob) {

    /* 支持setTimeout参数传递 */
    (function (f) {
        window.setTimeout = f(window.setTimeout);
        window.setInterval = f(window.setInterval);
    })(function (f) {
        return function (c, t) {
            var a = [].slice.call(arguments, 2);
            return f(function () {
                c.apply(this, a)
            }, t)
        }
    });
}
//endregion
/** IE 9 or older END */

/** IE 9 or older classList 垫片 */
//region classList 垫片
if (document.all && !window.atob) {

    (function () {
        var HTMLNames = [
            "Unknown", "UList", "Title", "TextArea", "TableSection",
            "TableRow", "Table", "TableCol", "TableCell", "TableCaption",
            "Style", "Span", "Select", "Script", "Param", "Paragraph",
            "Option", "Object", "OList", "Meta", "Marquee", "Map", "Link",
            "Legend", "Label", "LI", "Input", "Image", "IFrame", "Html",
            "Heading", "Head", "HR", "FrameSet", "Frame", "Form", "Font",
            "FieldSet", "Embed", "Div", "DList", "Button", "Body",
            "Base", "BR", "Area", "Anchor", "Phrase"
        ];

        if (!('classList' in document.createElement('_'))) {
            for (var i = 0; i < HTMLNames.length; i++) {
                Object.defineProperty(window["HTML" + HTMLNames[i] + "Element"].prototype, 'classList', {
                    get: function () {
                        return DOMTokenList(this);
                    }
                });
            }
        }

        function DOMTokenList(element) {
            var result = {};
            var int_idx = 0;
            var str_classNames = element.className;
            var arr_classNames = str_classNames.split(' ');

            for (var i = 0; i < arr_classNames.length; i++) {
                if (arr_classNames[i] == '') {
                    continue;
                }

                result[int_idx++] = arr_classNames[i];
            }

            result.length = int_idx;

            result.contains = function (cname) {
                for (var j = 0; j < arr_classNames.length; j++) {
                    if (arr_classNames[j] == '') {
                        continue;
                    }

                    if (arr_classNames[j] == cname) {
                        return true;
                    }
                }

                return false;
            };

            result.add = function (cname) {
                if (!this.contains(cname)) {
                    element.className = element.className + ' ' + cname;
                }
            };

            result.remove = function (cname) {
                var arr_newCname = [];
                if (this.contains(cname)) {
                    for (var j = 0; j < arr_classNames.length; j++) {
                        if (arr_classNames[j] == '') {
                            continue;
                        }

                        if (cname != arr_classNames[j]) {
                            arr_newCname.push(arr_classNames[j]);
                        }
                    }

                    element.className = arr_newCname.join(' ');
                }
            };

            result.toggle = function (cname, opt) {
                if (opt != null) {
                    if (opt == true) {
                        this.add(cname);
                    } else {
                        this.remove(cname);
                    }
                } else {
                    if (this.contains(cname)) {
                        this.remove(cname);
                    } else {
                        this.add(cname);
                    }
                }
            };

            return result;
        }
    })();
}
//endregion
/** IE 9 or older END */

/** IE 8 or older HTML5 Shiv 垫片*/
//region HTML5 Shiv 垫片
if (document.all && !document.addEventListener) {

    /**
     * @preserve HTML5 Shiv 3.7.3 | @afarkas @jdalton @jon_neal @rem | MIT/GPL2 Licensed
     */
    ;
    (function (window, document) {
        /*jshint evil:true */
        /** version */
        var version = '3.7.3';

        /** Preset options */
        var options = window.html5 || {};

        /** Used to skip problem elements */
        var reSkip = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i;

        /** Not all elements can be cloned in IE **/
        var saveClones = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i;

        /** Detect whether the browser supports default html5 styles */
        var supportsHtml5Styles;

        /** Name of the expando, to work with multiple documents or to re-shiv one document */
        var expando = '_html5shiv';

        /** The id for the the documents expando */
        var expanID = 0;

        /** Cached data for each document */
        var expandoData = {};

        /** Detect whether the browser supports unknown elements */
        var supportsUnknownElements;

        (function () {
            try {
                var a = document.createElement('a');
                a.innerHTML = '<xyz></xyz>';
                //if the hidden property is implemented we can assume, that the browser supports basic HTML5 Styles
                supportsHtml5Styles = ('hidden' in a);

                supportsUnknownElements = a.childNodes.length == 1 || (function () {
                        // assign a false positive if unable to shiv
                        (document.createElement)('a');
                        var frag = document.createDocumentFragment();
                        return (
                            typeof frag.cloneNode == 'undefined' ||
                            typeof frag.createDocumentFragment == 'undefined' ||
                            typeof frag.createElement == 'undefined'
                        );
                    }());
            } catch (e) {
                // assign a false positive if detection fails => unable to shiv
                supportsHtml5Styles = true;
                supportsUnknownElements = true;
            }

        }());

        /*--------------------------------------------------------------------------*/

        /**
         * Creates a style sheet with the given CSS text and adds it to the document.
         * @private
         * @param {Document} ownerDocument The document.
         * @param {String} cssText The CSS text.
         * @returns {StyleSheet} The style element.
         */
        function addStyleSheet(ownerDocument, cssText) {
            var p = ownerDocument.createElement('p'),
                parent = ownerDocument.getElementsByTagName('head')[0] || ownerDocument.documentElement;

            p.innerHTML = 'x<style>' + cssText + '</style>';
            return parent.insertBefore(p.lastChild, parent.firstChild);
        }

        /**
         * Returns the value of `html5.elements` as an array.
         * @private
         * @returns {Array} An array of shived element node names.
         */
        function getElements() {
            var elements = html5.elements;
            return typeof elements == 'string' ? elements.split(' ') : elements;
        }

        /**
         * Extends the built-in list of html5 elements
         * @memberOf html5
         * @param {String|Array} newElements whitespace separated list or array of new element names to shiv
         * @param {Document} ownerDocument The context document.
         */
        function addElements(newElements, ownerDocument) {
            var elements = html5.elements;
            if (typeof elements != 'string') {
                elements = elements.join(' ');
            }
            if (typeof newElements != 'string') {
                newElements = newElements.join(' ');
            }
            html5.elements = elements + ' ' + newElements;
            shivDocument(ownerDocument);
        }

        /**
         * Returns the data associated to the given document
         * @private
         * @param {Document} ownerDocument The document.
         * @returns {Object} An object of data.
         */
        function getExpandoData(ownerDocument) {
            var data = expandoData[ownerDocument[expando]];
            if (!data) {
                data = {};
                expanID++;
                ownerDocument[expando] = expanID;
                expandoData[expanID] = data;
            }
            return data;
        }

        /**
         * returns a shived element for the given nodeName and document
         * @memberOf html5
         * @param {String} nodeName name of the element
         * @param {Document} ownerDocument The context document.
         * @returns {Object} The shived element.
         */
        function createElement(nodeName, ownerDocument, data) {
            if (!ownerDocument) {
                ownerDocument = document;
            }
            if (supportsUnknownElements) {
                return ownerDocument.createElement(nodeName);
            }
            if (!data) {
                data = getExpandoData(ownerDocument);
            }
            var node;

            if (data.cache[nodeName]) {
                node = data.cache[nodeName].cloneNode();
            } else if (saveClones.test(nodeName)) {
                node = (data.cache[nodeName] = data.createElem(nodeName)).cloneNode();
            } else {
                node = data.createElem(nodeName);
            }

            // Avoid adding some elements to fragments in IE < 9 because
            // * Attributes like `name` or `type` cannot be set/changed once an element
            //   is inserted into a document/fragment
            // * Link elements with `src` attributes that are inaccessible, as with
            //   a 403 response, will cause the tab/window to crash
            // * Script elements appended to fragments will execute when their `src`
            //   or `text` property is set
            return node.canHaveChildren && !reSkip.test(nodeName) && !node.tagUrn ? data.frag.appendChild(node) : node;
        }

        /**
         * returns a shived DocumentFragment for the given document
         * @memberOf html5
         * @param {Document} ownerDocument The context document.
         * @returns {Object} The shived DocumentFragment.
         */
        function createDocumentFragment(ownerDocument, data) {
            if (!ownerDocument) {
                ownerDocument = document;
            }
            if (supportsUnknownElements) {
                return ownerDocument.createDocumentFragment();
            }
            data = data || getExpandoData(ownerDocument);
            var clone = data.frag.cloneNode(),
                i = 0,
                elems = getElements(),
                l = elems.length;
            for (; i < l; i++) {
                clone.createElement(elems[i]);
            }
            return clone;
        }

        /**
         * Shivs the `createElement` and `createDocumentFragment` methods of the document.
         * @private
         * @param {Document|DocumentFragment} ownerDocument The document.
         * @param {Object} data of the document.
         */
        function shivMethods(ownerDocument, data) {
            if (!data.cache) {
                data.cache = {};
                data.createElem = ownerDocument.createElement;
                data.createFrag = ownerDocument.createDocumentFragment;
                data.frag = data.createFrag();
            }


            ownerDocument.createElement = function (nodeName) {
                //abort shiv
                if (!html5.shivMethods) {
                    return data.createElem(nodeName);
                }
                return createElement(nodeName, ownerDocument, data);
            };

            ownerDocument.createDocumentFragment = Function('h,f', 'return function(){' +
                'var n=f.cloneNode(),c=n.createElement;' +
                'h.shivMethods&&(' +
                // unroll the `createElement` calls
                getElements().join().replace(/[\w\-:]+/g, function (nodeName) {
                    data.createElem(nodeName);
                    data.frag.createElement(nodeName);
                    return 'c("' + nodeName + '")';
                }) +
                ');return n}'
            )(html5, data.frag);
        }

        /*--------------------------------------------------------------------------*/

        /**
         * Shivs the given document.
         * @memberOf html5
         * @param {Document} ownerDocument The document to shiv.
         * @returns {Document} The shived document.
         */
        function shivDocument(ownerDocument) {
            if (!ownerDocument) {
                ownerDocument = document;
            }
            var data = getExpandoData(ownerDocument);

            if (html5.shivCSS && !supportsHtml5Styles && !data.hasCSS) {
                data.hasCSS = !!addStyleSheet(ownerDocument,
                    // corrects block display not defined in IE6/7/8/9
                    'article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}' +
                    // adds styling not present in IE6/7/8/9
                    'mark{background:#FF0;color:#000}' +
                    // hides non-rendered elements
                    'template{display:none}'
                );
            }
            if (!supportsUnknownElements) {
                shivMethods(ownerDocument, data);
            }
            return ownerDocument;
        }

        /*--------------------------------------------------------------------------*/

        /**
         * The `html5` object is exposed so that more elements can be shived and
         * existing shiving can be detected on iframes.
         * @type Object
         * @example
         *
         * // options can be changed before the script is included
         * html5 = { 'elements': 'mark section', 'shivCSS': false, 'shivMethods': false };
         */
        var html5 = {

            /**
             * An array or space separated string of node names of the elements to shiv.
             * @memberOf html5
             * @type Array|String
             */
            'elements': options.elements || 'abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output picture progress section summary template time video',

            /**
             * current version of html5shiv
             */
            'version': version,

            /**
             * A flag to indicate that the HTML5 style sheet should be inserted.
             * @memberOf html5
             * @type Boolean
             */
            'shivCSS': (options.shivCSS !== false),

            /**
             * Is equal to true if a browser supports creating unknown/HTML5 elements
             * @memberOf html5
             * @type boolean
             */
            'supportsUnknownElements': supportsUnknownElements,

            /**
             * A flag to indicate that the document's `createElement` and `createDocumentFragment`
             * methods should be overwritten.
             * @memberOf html5
             * @type Boolean
             */
            'shivMethods': (options.shivMethods !== false),

            /**
             * A string to describe the type of `html5` object ("default" or "default print").
             * @memberOf html5
             * @type String
             */
            'type': 'default',

            // shivs the document according to the specified `html5` object options
            'shivDocument': shivDocument,

            //creates a shived element
            createElement: createElement,

            //creates a shived documentFragment
            createDocumentFragment: createDocumentFragment,

            //extends list of elements
            addElements: addElements
        };

        /*--------------------------------------------------------------------------*/

        // expose html5
        window.html5 = html5;

        // shiv the document
        shivDocument(document);

        /*------------------------------- Print Shiv -------------------------------*/

        /** Used to filter media types */
        var reMedia = /^$|\b(?:all|print)\b/;

        /** Used to namespace printable elements */
        var shivNamespace = 'html5shiv';

        /** Detect whether the browser supports shivable style sheets */
        var supportsShivableSheets = !supportsUnknownElements && (function () {
                // assign a false negative if unable to shiv
                var docEl = document.documentElement;
                return !(
                    typeof document.namespaces == 'undefined' ||
                    typeof document.parentWindow == 'undefined' ||
                    typeof docEl.applyElement == 'undefined' ||
                    typeof docEl.removeNode == 'undefined' ||
                    typeof window.attachEvent == 'undefined'
                );
            }());

        /*--------------------------------------------------------------------------*/

        /**
         * Wraps all HTML5 elements in the given document with printable elements.
         * (eg. the "header" element is wrapped with the "html5shiv:header" element)
         * @private
         * @param {Document} ownerDocument The document.
         * @returns {Array} An array wrappers added.
         */
        function addWrappers(ownerDocument) {
            var node,
                nodes = ownerDocument.getElementsByTagName('*'),
                index = nodes.length,
                reElements = RegExp('^(?:' + getElements().join('|') + ')$', 'i'),
                result = [];

            while (index--) {
                node = nodes[index];
                if (reElements.test(node.nodeName)) {
                    result.push(node.applyElement(createWrapper(node)));
                }
            }
            return result;
        }

        /**
         * Creates a printable wrapper for the given element.
         * @private
         * @param {Element} element The element.
         * @returns {Element} The wrapper.
         */
        function createWrapper(element) {
            var node,
                nodes = element.attributes,
                index = nodes.length,
                wrapper = element.ownerDocument.createElement(shivNamespace + ':' + element.nodeName);

            // copy element attributes to the wrapper
            while (index--) {
                node = nodes[index];
                node.specified && wrapper.setAttribute(node.nodeName, node.nodeValue);
            }
            // copy element styles to the wrapper
            wrapper.style.cssText = element.style.cssText;
            return wrapper;
        }

        /**
         * Shivs the given CSS text.
         * (eg. header{} becomes html5shiv\:header{})
         * @private
         * @param {String} cssText The CSS text to shiv.
         * @returns {String} The shived CSS text.
         */
        function shivCssText(cssText) {
            var pair,
                parts = cssText.split('{'),
                index = parts.length,
                reElements = RegExp('(^|[\\s,>+~])(' + getElements().join('|') + ')(?=[[\\s,>+~#.:]|$)', 'gi'),
                replacement = '$1' + shivNamespace + '\\:$2';

            while (index--) {
                pair = parts[index] = parts[index].split('}');
                pair[pair.length - 1] = pair[pair.length - 1].replace(reElements, replacement);
                parts[index] = pair.join('}');
            }
            return parts.join('{');
        }

        /**
         * Removes the given wrappers, leaving the original elements.
         * @private
         * @params {Array} wrappers An array of printable wrappers.
         */
        function removeWrappers(wrappers) {
            var index = wrappers.length;
            while (index--) {
                wrappers[index].removeNode();
            }
        }

        /*--------------------------------------------------------------------------*/

        /**
         * Shivs the given document for print.
         * @memberOf html5
         * @param {Document} ownerDocument The document to shiv.
         * @returns {Document} The shived document.
         */
        function shivPrint(ownerDocument) {
            var shivedSheet,
                wrappers,
                data = getExpandoData(ownerDocument),
                namespaces = ownerDocument.namespaces,
                ownerWindow = ownerDocument.parentWindow;

            if (!supportsShivableSheets || ownerDocument.printShived) {
                return ownerDocument;
            }
            if (typeof namespaces[shivNamespace] == 'undefined') {
                namespaces.add(shivNamespace);
            }

            function removeSheet() {
                clearTimeout(data._removeSheetTimer);
                if (shivedSheet) {
                    shivedSheet.removeNode(true);
                }
                shivedSheet = null;
            }

            ownerWindow.attachEvent('onbeforeprint', function () {

                removeSheet();

                var imports,
                    length,
                    sheet,
                    collection = ownerDocument.styleSheets,
                    cssText = [],
                    index = collection.length,
                    sheets = Array(index);

                // convert styleSheets collection to an array
                while (index--) {
                    sheets[index] = collection[index];
                }
                // concat all style sheet CSS text
                while ((sheet = sheets.pop())) {
                    // IE does not enforce a same origin policy for external style sheets...
                    // but has trouble with some dynamically created stylesheets
                    if (!sheet.disabled && reMedia.test(sheet.media)) {

                        try {
                            imports = sheet.imports;
                            length = imports.length;
                        } catch (er) {
                            length = 0;
                        }

                        for (index = 0; index < length; index++) {
                            sheets.push(imports[index]);
                        }

                        try {
                            cssText.push(sheet.cssText);
                        } catch (er) {
                        }
                    }
                }

                // wrap all HTML5 elements with printable elements and add the shived style sheet
                cssText = shivCssText(cssText.reverse().join(''));
                wrappers = addWrappers(ownerDocument);
                shivedSheet = addStyleSheet(ownerDocument, cssText);

            });

            ownerWindow.attachEvent('onafterprint', function () {
                // remove wrappers, leaving the original elements, and remove the shived style sheet
                removeWrappers(wrappers);
                clearTimeout(data._removeSheetTimer);
                data._removeSheetTimer = setTimeout(removeSheet, 500);
            });

            ownerDocument.printShived = true;
            return ownerDocument;
        }

        /*--------------------------------------------------------------------------*/

        // expose API
        html5.type += ' print';
        html5.shivPrint = shivPrint;

        // shiv for print
        shivPrint(document);

        if (typeof module == 'object' && module.exports) {
            module.exports = html5;
        }

    }(typeof window !== "undefined" ? window : this, document));
}
//endregion
/** IE 8 or older END */

/** es5-shim */
//region es5-shim
/*!
 * https://github.com/es-shims/es5-shim
 * @license es5-shim Copyright 2009-2015 by contributors, MIT License
 * see https://github.com/es-shims/es5-shim/blob/master/LICENSE
 */

// vim: ts=4 sts=4 sw=4 expandtab

// Add semicolon to prevent IIFE from being passed as argument to concatenated code.
;

// UMD (Universal Module Definition)
// see https://github.com/umdjs/umd/blob/master/templates/returnExports.js
(function (root, factory) {
    'use strict';

    /* global define, exports, module */
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.returnExports = factory();
    }
}(this, function () {
    /**
     * Brings an environment as close to ECMAScript 5 compliance
     * as is possible with the facilities of erstwhile engines.
     *
     * Annotated ES5: http://es5.github.com/ (specific links below)
     * ES5 Spec: http://www.ecma-international.org/publications/files/ECMA-ST/Ecma-262.pdf
     * Required reading: http://javascriptweblog.wordpress.com/2011/12/05/extending-javascript-natives/
     */

        // Shortcut to an often accessed properties, in order to avoid multiple
        // dereference that costs universally. This also holds a reference to known-good
        // functions.
    var $Array = Array;
    var ArrayPrototype = $Array.prototype;
    var $Object = Object;
    var ObjectPrototype = $Object.prototype;
    var $Function = Function;
    var FunctionPrototype = $Function.prototype;
    var $String = String;
    var StringPrototype = $String.prototype;
    var $Number = Number;
    var NumberPrototype = $Number.prototype;
    var array_slice = ArrayPrototype.slice;
    var array_splice = ArrayPrototype.splice;
    var array_push = ArrayPrototype.push;
    var array_unshift = ArrayPrototype.unshift;
    var array_concat = ArrayPrototype.concat;
    var array_join = ArrayPrototype.join;
    var call = FunctionPrototype.call;
    var apply = FunctionPrototype.apply;
    var max = Math.max;
    var min = Math.min;

    // Having a toString local variable name breaks in Opera so use to_string.
    var to_string = ObjectPrototype.toString;

    /* global Symbol */
    /* eslint-disable one-var-declaration-per-line, no-redeclare, max-statements-per-line */
    var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';
    var isCallable;
    /* inlined from https://npmjs.com/is-callable */
    var fnToStr = Function.prototype.toString, constructorRegex = /^\s*class /, isES6ClassFn = function isES6ClassFn(value) {
        try {
            var fnStr = fnToStr.call(value);
            var singleStripped = fnStr.replace(/\/\/.*\n/g, '');
            var multiStripped = singleStripped.replace(/\/\*[.\s\S]*\*\//g, '');
            var spaceStripped = multiStripped.replace(/\n/mg, ' ').replace(/ {2}/g, ' ');
            return constructorRegex.test(spaceStripped);
        } catch (e) {
            return false;
            /* not a function */
        }
    }, tryFunctionObject = function tryFunctionObject(value) {
        try {
            if (isES6ClassFn(value)) {
                return false;
            }
            fnToStr.call(value);
            return true;
        } catch (e) {
            return false;
        }
    }, fnClass = '[object Function]', genClass = '[object GeneratorFunction]', isCallable = function isCallable(value) {
        if (!value) {
            return false;
        }
        if (typeof value !== 'function' && typeof value !== 'object') {
            return false;
        }
        if (hasToStringTag) {
            return tryFunctionObject(value);
        }
        if (isES6ClassFn(value)) {
            return false;
        }
        var strClass = to_string.call(value);
        return strClass === fnClass || strClass === genClass;
    };

    var isRegex;
    /* inlined from https://npmjs.com/is-regex */
    var regexExec = RegExp.prototype.exec, tryRegexExec = function tryRegexExec(value) {
        try {
            regexExec.call(value);
            return true;
        } catch (e) {
            return false;
        }
    }, regexClass = '[object RegExp]';
    isRegex = function isRegex(value) {
        if (typeof value !== 'object') {
            return false;
        }
        return hasToStringTag ? tryRegexExec(value) : to_string.call(value) === regexClass;
    };
    var isString;
    /* inlined from https://npmjs.com/is-string */
    var strValue = String.prototype.valueOf, tryStringObject = function tryStringObject(value) {
        try {
            strValue.call(value);
            return true;
        } catch (e) {
            return false;
        }
    }, stringClass = '[object String]';
    isString = function isString(value) {
        if (typeof value === 'string') {
            return true;
        }
        if (typeof value !== 'object') {
            return false;
        }
        return hasToStringTag ? tryStringObject(value) : to_string.call(value) === stringClass;
    };
    /* eslint-enable one-var-declaration-per-line, no-redeclare, max-statements-per-line */

    /* inlined from http://npmjs.com/define-properties */
    var supportsDescriptors = $Object.defineProperty && (function () {
            try {
                var obj = {};
                $Object.defineProperty(obj, 'x', {enumerable: false, value: obj});
                for (var _ in obj) { // jscs:ignore disallowUnusedVariables
                    return false;
                }
                return obj.x === obj;
            } catch (e) { /* this is ES3 */
                return false;
            }
        }());
    var defineProperties = (function (has) {
        // Define configurable, writable, and non-enumerable props
        // if they don't exist.
        var defineProperty;
        if (supportsDescriptors) {
            defineProperty = function (object, name, method, forceAssign) {
                if (!forceAssign && (name in object)) {
                    return;
                }
                $Object.defineProperty(object, name, {
                    configurable: true,
                    enumerable: false,
                    writable: true,
                    value: method
                });
            };
        } else {
            defineProperty = function (object, name, method, forceAssign) {
                if (!forceAssign && (name in object)) {
                    return;
                }
                object[name] = method;
            };
        }
        return function defineProperties(object, map, forceAssign) {
            for (var name in map) {
                if (has.call(map, name)) {
                    defineProperty(object, name, map[name], forceAssign);
                }
            }
        };
    }(ObjectPrototype.hasOwnProperty));

    //
    // Util
    // ======
    //

    /* replaceable with https://npmjs.com/package/es-abstract /helpers/isPrimitive */
    var isPrimitive = function isPrimitive(input) {
        var type = typeof input;
        return input === null || (type !== 'object' && type !== 'function');
    };

    var isActualNaN = $Number.isNaN || function isActualNaN(x) {
            return x !== x;
        };

    var ES = {
        // ES5 9.4
        // http://es5.github.com/#x9.4
        // http://jsperf.com/to-integer
        /* replaceable with https://npmjs.com/package/es-abstract ES5.ToInteger */
        ToInteger: function ToInteger(num) {
            var n = +num;
            if (isActualNaN(n)) {
                n = 0;
            } else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0)) {
                n = (n > 0 || -1) * Math.floor(Math.abs(n));
            }
            return n;
        },

        /* replaceable with https://npmjs.com/package/es-abstract ES5.ToPrimitive */
        ToPrimitive: function ToPrimitive(input) {
            var val, valueOf, toStr;
            if (isPrimitive(input)) {
                return input;
            }
            valueOf = input.valueOf;
            if (isCallable(valueOf)) {
                val = valueOf.call(input);
                if (isPrimitive(val)) {
                    return val;
                }
            }
            toStr = input.toString;
            if (isCallable(toStr)) {
                val = toStr.call(input);
                if (isPrimitive(val)) {
                    return val;
                }
            }
            throw new TypeError();
        },

        // ES5 9.9
        // http://es5.github.com/#x9.9
        /* replaceable with https://npmjs.com/package/es-abstract ES5.ToObject */
        ToObject: function (o) {
            if (o == null) { // this matches both null and undefined
                throw new TypeError("can't convert " + o + ' to object');
            }
            return $Object(o);
        },

        /* replaceable with https://npmjs.com/package/es-abstract ES5.ToUint32 */
        ToUint32: function ToUint32(x) {
            return x >>> 0;
        }
    };

    //
    // Function
    // ========
    //

    // ES-5 15.3.4.5
    // http://es5.github.com/#x15.3.4.5

    var Empty = function Empty() {
    };

    defineProperties(FunctionPrototype, {
        bind: function bind(that) { // .length is 1
            // 1. Let Target be the this value.
            var target = this;
            // 2. If IsCallable(Target) is false, throw a TypeError exception.
            if (!isCallable(target)) {
                throw new TypeError('Function.prototype.bind called on incompatible ' + target);
            }
            // 3. Let A be a new (possibly empty) internal list of all of the
            //   argument values provided after thisArg (arg1, arg2 etc), in order.
            // XXX slicedArgs will stand in for "A" if used
            var args = array_slice.call(arguments, 1); // for normal call
            // 4. Let F be a new native ECMAScript object.
            // 11. Set the [[Prototype]] internal property of F to the standard
            //   built-in Function prototype object as specified in 15.3.3.1.
            // 12. Set the [[Call]] internal property of F as described in
            //   15.3.4.5.1.
            // 13. Set the [[Construct]] internal property of F as described in
            //   15.3.4.5.2.
            // 14. Set the [[HasInstance]] internal property of F as described in
            //   15.3.4.5.3.
            var bound;
            var binder = function () {

                if (this instanceof bound) {
                    // 15.3.4.5.2 [[Construct]]
                    // When the [[Construct]] internal method of a function object,
                    // F that was created using the bind function is called with a
                    // list of arguments ExtraArgs, the following steps are taken:
                    // 1. Let target be the value of F's [[TargetFunction]]
                    //   internal property.
                    // 2. If target has no [[Construct]] internal method, a
                    //   TypeError exception is thrown.
                    // 3. Let boundArgs be the value of F's [[BoundArgs]] internal
                    //   property.
                    // 4. Let args be a new list containing the same values as the
                    //   list boundArgs in the same order followed by the same
                    //   values as the list ExtraArgs in the same order.
                    // 5. Return the result of calling the [[Construct]] internal
                    //   method of target providing args as the arguments.

                    var result = apply.call(
                        target,
                        this,
                        array_concat.call(args, array_slice.call(arguments))
                    );
                    if ($Object(result) === result) {
                        return result;
                    }
                    return this;

                } else {
                    // 15.3.4.5.1 [[Call]]
                    // When the [[Call]] internal method of a function object, F,
                    // which was created using the bind function is called with a
                    // this value and a list of arguments ExtraArgs, the following
                    // steps are taken:
                    // 1. Let boundArgs be the value of F's [[BoundArgs]] internal
                    //   property.
                    // 2. Let boundThis be the value of F's [[BoundThis]] internal
                    //   property.
                    // 3. Let target be the value of F's [[TargetFunction]] internal
                    //   property.
                    // 4. Let args be a new list containing the same values as the
                    //   list boundArgs in the same order followed by the same
                    //   values as the list ExtraArgs in the same order.
                    // 5. Return the result of calling the [[Call]] internal method
                    //   of target providing boundThis as the this value and
                    //   providing args as the arguments.

                    // equiv: target.call(this, ...boundArgs, ...args)
                    return apply.call(
                        target,
                        that,
                        array_concat.call(args, array_slice.call(arguments))
                    );

                }

            };

            // 15. If the [[Class]] internal property of Target is "Function", then
            //     a. Let L be the length property of Target minus the length of A.
            //     b. Set the length own property of F to either 0 or L, whichever is
            //       larger.
            // 16. Else set the length own property of F to 0.

            var boundLength = max(0, target.length - args.length);

            // 17. Set the attributes of the length own property of F to the values
            //   specified in 15.3.5.1.
            var boundArgs = [];
            for (var i = 0; i < boundLength; i++) {
                array_push.call(boundArgs, '$' + i);
            }

            // XXX Build a dynamic function with desired amount of arguments is the only
            // way to set the length property of a function.
            // In environments where Content Security Policies enabled (Chrome extensions,
            // for ex.) all use of eval or Function costructor throws an exception.
            // However in all of these environments Function.prototype.bind exists
            // and so this code will never be executed.
            bound = $Function('binder', 'return function (' + array_join.call(boundArgs, ',') + '){ return binder.apply(this, arguments); }')(binder);

            if (target.prototype) {
                Empty.prototype = target.prototype;
                bound.prototype = new Empty();
                // Clean up dangling references.
                Empty.prototype = null;
            }

            // TODO
            // 18. Set the [[Extensible]] internal property of F to true.

            // TODO
            // 19. Let thrower be the [[ThrowTypeError]] function Object (13.2.3).
            // 20. Call the [[DefineOwnProperty]] internal method of F with
            //   arguments "caller", PropertyDescriptor {[[Get]]: thrower, [[Set]]:
            //   thrower, [[Enumerable]]: false, [[Configurable]]: false}, and
            //   false.
            // 21. Call the [[DefineOwnProperty]] internal method of F with
            //   arguments "arguments", PropertyDescriptor {[[Get]]: thrower,
            //   [[Set]]: thrower, [[Enumerable]]: false, [[Configurable]]: false},
            //   and false.

            // TODO
            // NOTE Function objects created using Function.prototype.bind do not
            // have a prototype property or the [[Code]], [[FormalParameters]], and
            // [[Scope]] internal properties.
            // XXX can't delete prototype in pure-js.

            // 22. Return F.
            return bound;
        }
    });

    // _Please note: Shortcuts are defined after `Function.prototype.bind` as we
    // use it in defining shortcuts.
    var owns = call.bind(ObjectPrototype.hasOwnProperty);
    var toStr = call.bind(ObjectPrototype.toString);
    var arraySlice = call.bind(array_slice);
    var arraySliceApply = apply.bind(array_slice);
    var strSlice = call.bind(StringPrototype.slice);
    var strSplit = call.bind(StringPrototype.split);
    var strIndexOf = call.bind(StringPrototype.indexOf);
    var pushCall = call.bind(array_push);
    var isEnum = call.bind(ObjectPrototype.propertyIsEnumerable);
    var arraySort = call.bind(ArrayPrototype.sort);

    //
    // Array
    // =====
    //

    var isArray = $Array.isArray || function isArray(obj) {
            return toStr(obj) === '[object Array]';
        };

    // ES5 15.4.4.12
    // http://es5.github.com/#x15.4.4.13
    // Return len+argCount.
    // [bugfix, ielt8]
    // IE < 8 bug: [].unshift(0) === undefined but should be "1"
    var hasUnshiftReturnValueBug = [].unshift(0) !== 1;
    defineProperties(ArrayPrototype, {
        unshift: function () {
            array_unshift.apply(this, arguments);
            return this.length;
        }
    }, hasUnshiftReturnValueBug);

    // ES5 15.4.3.2
    // http://es5.github.com/#x15.4.3.2
    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/isArray
    defineProperties($Array, {isArray: isArray});

    // The IsCallable() check in the Array functions
    // has been replaced with a strict check on the
    // internal class of the object to trap cases where
    // the provided function was actually a regular
    // expression literal, which in V8 and
    // JavaScriptCore is a typeof "function".  Only in
    // V8 are regular expression literals permitted as
    // reduce parameters, so it is desirable in the
    // general case for the shim to match the more
    // strict and common behavior of rejecting regular
    // expressions.

    // ES5 15.4.4.18
    // http://es5.github.com/#x15.4.4.18
    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/array/forEach

    // Check failure of by-index access of string characters (IE < 9)
    // and failure of `0 in boxedString` (Rhino)
    var boxedString = $Object('a');
    var splitString = boxedString[0] !== 'a' || !(0 in boxedString);

    var properlyBoxesContext = function properlyBoxed(method) {
        // Check node 0.6.21 bug where third parameter is not boxed
        var properlyBoxesNonStrict = true;
        var properlyBoxesStrict = true;
        var threwException = false;
        if (method) {
            try {
                method.call('foo', function (_, __, context) {
                    if (typeof context !== 'object') {
                        properlyBoxesNonStrict = false;
                    }
                });

                method.call([1], function () {
                    'use strict';

                    properlyBoxesStrict = typeof this === 'string';
                }, 'x');
            } catch (e) {
                threwException = true;
            }
        }
        return !!method && !threwException && properlyBoxesNonStrict && properlyBoxesStrict;
    };

    defineProperties(ArrayPrototype, {
        forEach: function forEach(callbackfn/*, thisArg*/) {
            var object = ES.ToObject(this);
            var self = splitString && isString(this) ? strSplit(this, '') : object;
            var i = -1;
            var length = ES.ToUint32(self.length);
            var T;
            if (arguments.length > 1) {
                T = arguments[1];
            }

            // If no callback function or if callback is not a callable function
            if (!isCallable(callbackfn)) {
                throw new TypeError('Array.prototype.forEach callback must be a function');
            }

            while (++i < length) {
                if (i in self) {
                    // Invoke the callback function with call, passing arguments:
                    // context, property value, property key, thisArg object
                    if (typeof T === 'undefined') {
                        callbackfn(self[i], i, object);
                    } else {
                        callbackfn.call(T, self[i], i, object);
                    }
                }
            }
        }
    }, !properlyBoxesContext(ArrayPrototype.forEach));

    // ES5 15.4.4.19
    // http://es5.github.com/#x15.4.4.19
    // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/map
    defineProperties(ArrayPrototype, {
        map: function map(callbackfn/*, thisArg*/) {
            var object = ES.ToObject(this);
            var self = splitString && isString(this) ? strSplit(this, '') : object;
            var length = ES.ToUint32(self.length);
            var result = $Array(length);
            var T;
            if (arguments.length > 1) {
                T = arguments[1];
            }

            // If no callback function or if callback is not a callable function
            if (!isCallable(callbackfn)) {
                throw new TypeError('Array.prototype.map callback must be a function');
            }

            for (var i = 0; i < length; i++) {
                if (i in self) {
                    if (typeof T === 'undefined') {
                        result[i] = callbackfn(self[i], i, object);
                    } else {
                        result[i] = callbackfn.call(T, self[i], i, object);
                    }
                }
            }
            return result;
        }
    }, !properlyBoxesContext(ArrayPrototype.map));

    // ES5 15.4.4.20
    // http://es5.github.com/#x15.4.4.20
    // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/filter
    defineProperties(ArrayPrototype, {
        filter: function filter(callbackfn/*, thisArg*/) {
            var object = ES.ToObject(this);
            var self = splitString && isString(this) ? strSplit(this, '') : object;
            var length = ES.ToUint32(self.length);
            var result = [];
            var value;
            var T;
            if (arguments.length > 1) {
                T = arguments[1];
            }

            // If no callback function or if callback is not a callable function
            if (!isCallable(callbackfn)) {
                throw new TypeError('Array.prototype.filter callback must be a function');
            }

            for (var i = 0; i < length; i++) {
                if (i in self) {
                    value = self[i];
                    if (typeof T === 'undefined' ? callbackfn(value, i, object) : callbackfn.call(T, value, i, object)) {
                        pushCall(result, value);
                    }
                }
            }
            return result;
        }
    }, !properlyBoxesContext(ArrayPrototype.filter));

    // ES5 15.4.4.16
    // http://es5.github.com/#x15.4.4.16
    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/every
    defineProperties(ArrayPrototype, {
        every: function every(callbackfn/*, thisArg*/) {
            var object = ES.ToObject(this);
            var self = splitString && isString(this) ? strSplit(this, '') : object;
            var length = ES.ToUint32(self.length);
            var T;
            if (arguments.length > 1) {
                T = arguments[1];
            }

            // If no callback function or if callback is not a callable function
            if (!isCallable(callbackfn)) {
                throw new TypeError('Array.prototype.every callback must be a function');
            }

            for (var i = 0; i < length; i++) {
                if (i in self && !(typeof T === 'undefined' ? callbackfn(self[i], i, object) : callbackfn.call(T, self[i], i, object))) {
                    return false;
                }
            }
            return true;
        }
    }, !properlyBoxesContext(ArrayPrototype.every));

    // ES5 15.4.4.17
    // http://es5.github.com/#x15.4.4.17
    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/some
    defineProperties(ArrayPrototype, {
        some: function some(callbackfn/*, thisArg */) {
            var object = ES.ToObject(this);
            var self = splitString && isString(this) ? strSplit(this, '') : object;
            var length = ES.ToUint32(self.length);
            var T;
            if (arguments.length > 1) {
                T = arguments[1];
            }

            // If no callback function or if callback is not a callable function
            if (!isCallable(callbackfn)) {
                throw new TypeError('Array.prototype.some callback must be a function');
            }

            for (var i = 0; i < length; i++) {
                if (i in self && (typeof T === 'undefined' ? callbackfn(self[i], i, object) : callbackfn.call(T, self[i], i, object))) {
                    return true;
                }
            }
            return false;
        }
    }, !properlyBoxesContext(ArrayPrototype.some));

    // ES5 15.4.4.21
    // http://es5.github.com/#x15.4.4.21
    // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduce
    var reduceCoercesToObject = false;
    if (ArrayPrototype.reduce) {
        reduceCoercesToObject = typeof ArrayPrototype.reduce.call('es5', function (_, __, ___, list) {
                return list;
            }) === 'object';
    }
    defineProperties(ArrayPrototype, {
        reduce: function reduce(callbackfn/*, initialValue*/) {
            var object = ES.ToObject(this);
            var self = splitString && isString(this) ? strSplit(this, '') : object;
            var length = ES.ToUint32(self.length);

            // If no callback function or if callback is not a callable function
            if (!isCallable(callbackfn)) {
                throw new TypeError('Array.prototype.reduce callback must be a function');
            }

            // no value to return if no initial value and an empty array
            if (length === 0 && arguments.length === 1) {
                throw new TypeError('reduce of empty array with no initial value');
            }

            var i = 0;
            var result;
            if (arguments.length >= 2) {
                result = arguments[1];
            } else {
                do {
                    if (i in self) {
                        result = self[i++];
                        break;
                    }

                    // if array contains no values, no initial value to return
                    if (++i >= length) {
                        throw new TypeError('reduce of empty array with no initial value');
                    }
                } while (true);
            }

            for (; i < length; i++) {
                if (i in self) {
                    result = callbackfn(result, self[i], i, object);
                }
            }

            return result;
        }
    }, !reduceCoercesToObject);

    // ES5 15.4.4.22
    // http://es5.github.com/#x15.4.4.22
    // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduceRight
    var reduceRightCoercesToObject = false;
    if (ArrayPrototype.reduceRight) {
        reduceRightCoercesToObject = typeof ArrayPrototype.reduceRight.call('es5', function (_, __, ___, list) {
                return list;
            }) === 'object';
    }
    defineProperties(ArrayPrototype, {
        reduceRight: function reduceRight(callbackfn/*, initial*/) {
            var object = ES.ToObject(this);
            var self = splitString && isString(this) ? strSplit(this, '') : object;
            var length = ES.ToUint32(self.length);

            // If no callback function or if callback is not a callable function
            if (!isCallable(callbackfn)) {
                throw new TypeError('Array.prototype.reduceRight callback must be a function');
            }

            // no value to return if no initial value, empty array
            if (length === 0 && arguments.length === 1) {
                throw new TypeError('reduceRight of empty array with no initial value');
            }

            var result;
            var i = length - 1;
            if (arguments.length >= 2) {
                result = arguments[1];
            } else {
                do {
                    if (i in self) {
                        result = self[i--];
                        break;
                    }

                    // if array contains no values, no initial value to return
                    if (--i < 0) {
                        throw new TypeError('reduceRight of empty array with no initial value');
                    }
                } while (true);
            }

            if (i < 0) {
                return result;
            }

            do {
                if (i in self) {
                    result = callbackfn(result, self[i], i, object);
                }
            } while (i--);

            return result;
        }
    }, !reduceRightCoercesToObject);

    // ES5 15.4.4.14
    // http://es5.github.com/#x15.4.4.14
    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
    var hasFirefox2IndexOfBug = ArrayPrototype.indexOf && [0, 1].indexOf(1, 2) !== -1;
    defineProperties(ArrayPrototype, {
        indexOf: function indexOf(searchElement/*, fromIndex */) {
            var self = splitString && isString(this) ? strSplit(this, '') : ES.ToObject(this);
            var length = ES.ToUint32(self.length);

            if (length === 0) {
                return -1;
            }

            var i = 0;
            if (arguments.length > 1) {
                i = ES.ToInteger(arguments[1]);
            }

            // handle negative indices
            i = i >= 0 ? i : max(0, length + i);
            for (; i < length; i++) {
                if (i in self && self[i] === searchElement) {
                    return i;
                }
            }
            return -1;
        }
    }, hasFirefox2IndexOfBug);

    // ES5 15.4.4.15
    // http://es5.github.com/#x15.4.4.15
    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/lastIndexOf
    var hasFirefox2LastIndexOfBug = ArrayPrototype.lastIndexOf && [0, 1].lastIndexOf(0, -3) !== -1;
    defineProperties(ArrayPrototype, {
        lastIndexOf: function lastIndexOf(searchElement/*, fromIndex */) {
            var self = splitString && isString(this) ? strSplit(this, '') : ES.ToObject(this);
            var length = ES.ToUint32(self.length);

            if (length === 0) {
                return -1;
            }
            var i = length - 1;
            if (arguments.length > 1) {
                i = min(i, ES.ToInteger(arguments[1]));
            }
            // handle negative indices
            i = i >= 0 ? i : length - Math.abs(i);
            for (; i >= 0; i--) {
                if (i in self && searchElement === self[i]) {
                    return i;
                }
            }
            return -1;
        }
    }, hasFirefox2LastIndexOfBug);

    // ES5 15.4.4.12
    // http://es5.github.com/#x15.4.4.12
    var spliceNoopReturnsEmptyArray = (function () {
        var a = [1, 2];
        var result = a.splice();
        return a.length === 2 && isArray(result) && result.length === 0;
    }());
    defineProperties(ArrayPrototype, {
        // Safari 5.0 bug where .splice() returns undefined
        splice: function splice(start, deleteCount) {
            if (arguments.length === 0) {
                return [];
            } else {
                return array_splice.apply(this, arguments);
            }
        }
    }, !spliceNoopReturnsEmptyArray);

    var spliceWorksWithEmptyObject = (function () {
        var obj = {};
        ArrayPrototype.splice.call(obj, 0, 0, 1);
        return obj.length === 1;
    }());
    defineProperties(ArrayPrototype, {
        splice: function splice(start, deleteCount) {
            if (arguments.length === 0) {
                return [];
            }
            var args = arguments;
            this.length = max(ES.ToInteger(this.length), 0);
            if (arguments.length > 0 && typeof deleteCount !== 'number') {
                args = arraySlice(arguments);
                if (args.length < 2) {
                    pushCall(args, this.length - start);
                } else {
                    args[1] = ES.ToInteger(deleteCount);
                }
            }
            return array_splice.apply(this, args);
        }
    }, !spliceWorksWithEmptyObject);
    var spliceWorksWithLargeSparseArrays = (function () {
        // Per https://github.com/es-shims/es5-shim/issues/295
        // Safari 7/8 breaks with sparse arrays of size 1e5 or greater
        var arr = new $Array(1e5);
        // note: the index MUST be 8 or larger or the test will false pass
        arr[8] = 'x';
        arr.splice(1, 1);
        // note: this test must be defined *after* the indexOf shim
        // per https://github.com/es-shims/es5-shim/issues/313
        return arr.indexOf('x') === 7;
    }());
    var spliceWorksWithSmallSparseArrays = (function () {
        // Per https://github.com/es-shims/es5-shim/issues/295
        // Opera 12.15 breaks on this, no idea why.
        var n = 256;
        var arr = [];
        arr[n] = 'a';
        arr.splice(n + 1, 0, 'b');
        return arr[n] === 'a';
    }());
    defineProperties(ArrayPrototype, {
        splice: function splice(start, deleteCount) {
            var O = ES.ToObject(this);
            var A = [];
            var len = ES.ToUint32(O.length);
            var relativeStart = ES.ToInteger(start);
            var actualStart = relativeStart < 0 ? max((len + relativeStart), 0) : min(relativeStart, len);
            var actualDeleteCount = min(max(ES.ToInteger(deleteCount), 0), len - actualStart);

            var k = 0;
            var from;
            while (k < actualDeleteCount) {
                from = $String(actualStart + k);
                if (owns(O, from)) {
                    A[k] = O[from];
                }
                k += 1;
            }

            var items = arraySlice(arguments, 2);
            var itemCount = items.length;
            var to;
            if (itemCount < actualDeleteCount) {
                k = actualStart;
                var maxK = len - actualDeleteCount;
                while (k < maxK) {
                    from = $String(k + actualDeleteCount);
                    to = $String(k + itemCount);
                    if (owns(O, from)) {
                        O[to] = O[from];
                    } else {
                        delete O[to];
                    }
                    k += 1;
                }
                k = len;
                var minK = len - actualDeleteCount + itemCount;
                while (k > minK) {
                    delete O[k - 1];
                    k -= 1;
                }
            } else if (itemCount > actualDeleteCount) {
                k = len - actualDeleteCount;
                while (k > actualStart) {
                    from = $String(k + actualDeleteCount - 1);
                    to = $String(k + itemCount - 1);
                    if (owns(O, from)) {
                        O[to] = O[from];
                    } else {
                        delete O[to];
                    }
                    k -= 1;
                }
            }
            k = actualStart;
            for (var i = 0; i < items.length; ++i) {
                O[k] = items[i];
                k += 1;
            }
            O.length = len - actualDeleteCount + itemCount;

            return A;
        }
    }, !spliceWorksWithLargeSparseArrays || !spliceWorksWithSmallSparseArrays);

    var originalJoin = ArrayPrototype.join;
    var hasStringJoinBug;
    try {
        hasStringJoinBug = Array.prototype.join.call('123', ',') !== '1,2,3';
    } catch (e) {
        hasStringJoinBug = true;
    }
    if (hasStringJoinBug) {
        defineProperties(ArrayPrototype, {
            join: function join(separator) {
                var sep = typeof separator === 'undefined' ? ',' : separator;
                return originalJoin.call(isString(this) ? strSplit(this, '') : this, sep);
            }
        }, hasStringJoinBug);
    }

    var hasJoinUndefinedBug = [1, 2].join(undefined) !== '1,2';
    if (hasJoinUndefinedBug) {
        defineProperties(ArrayPrototype, {
            join: function join(separator) {
                var sep = typeof separator === 'undefined' ? ',' : separator;
                return originalJoin.call(this, sep);
            }
        }, hasJoinUndefinedBug);
    }

    var pushShim = function push(item) {
        var O = ES.ToObject(this);
        var n = ES.ToUint32(O.length);
        var i = 0;
        while (i < arguments.length) {
            O[n + i] = arguments[i];
            i += 1;
        }
        O.length = n + i;
        return n + i;
    };

    var pushIsNotGeneric = (function () {
        var obj = {};
        var result = Array.prototype.push.call(obj, undefined);
        return result !== 1 || obj.length !== 1 || typeof obj[0] !== 'undefined' || !owns(obj, 0);
    }());
    defineProperties(ArrayPrototype, {
        push: function push(item) {
            if (isArray(this)) {
                return array_push.apply(this, arguments);
            }
            return pushShim.apply(this, arguments);
        }
    }, pushIsNotGeneric);

    // This fixes a very weird bug in Opera 10.6 when pushing `undefined
    var pushUndefinedIsWeird = (function () {
        var arr = [];
        var result = arr.push(undefined);
        return result !== 1 || arr.length !== 1 || typeof arr[0] !== 'undefined' || !owns(arr, 0);
    }());
    defineProperties(ArrayPrototype, {push: pushShim}, pushUndefinedIsWeird);

    // ES5 15.2.3.14
    // http://es5.github.io/#x15.4.4.10
    // Fix boxed string bug
    defineProperties(ArrayPrototype, {
        slice: function (start, end) {
            var arr = isString(this) ? strSplit(this, '') : this;
            return arraySliceApply(arr, arguments);
        }
    }, splitString);

    var sortIgnoresNonFunctions = (function () {
        try {
            [1, 2].sort(null);
            [1, 2].sort({});
            return true;
        } catch (e) {
        }
        return false;
    }());
    var sortThrowsOnRegex = (function () {
        // this is a problem in Firefox 4, in which `typeof /a/ === 'function'`
        try {
            [1, 2].sort(/a/);
            return false;
        } catch (e) {
        }
        return true;
    }());
    var sortIgnoresUndefined = (function () {
        // applies in IE 8, for one.
        try {
            [1, 2].sort(undefined);
            return true;
        } catch (e) {
        }
        return false;
    }());
    defineProperties(ArrayPrototype, {
        sort: function sort(compareFn) {
            if (typeof compareFn === 'undefined') {
                return arraySort(this);
            }
            if (!isCallable(compareFn)) {
                throw new TypeError('Array.prototype.sort callback must be a function');
            }
            return arraySort(this, compareFn);
        }
    }, sortIgnoresNonFunctions || !sortIgnoresUndefined || !sortThrowsOnRegex);

    //
    // Object
    // ======
    //

    // ES5 15.2.3.14
    // http://es5.github.com/#x15.2.3.14

    // http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation
    var hasDontEnumBug = !isEnum({'toString': null}, 'toString');
    var hasProtoEnumBug = isEnum(function () {
    }, 'prototype');
    var hasStringEnumBug = !owns('x', '0');
    var equalsConstructorPrototype = function (o) {
        var ctor = o.constructor;
        return ctor && ctor.prototype === o;
    };
    var blacklistedKeys = {
        $window: true,
        $console: true,
        $parent: true,
        $self: true,
        $frame: true,
        $frames: true,
        $frameElement: true,
        $webkitIndexedDB: true,
        $webkitStorageInfo: true,
        $external: true
    };
    var hasAutomationEqualityBug = (function () {
        /* globals window */
        if (typeof window === 'undefined') {
            return false;
        }
        for (var k in window) {
            try {
                if (!blacklistedKeys['$' + k] && owns(window, k) && window[k] !== null && typeof window[k] === 'object') {
                    equalsConstructorPrototype(window[k]);
                }
            } catch (e) {
                return true;
            }
        }
        return false;
    }());
    var equalsConstructorPrototypeIfNotBuggy = function (object) {
        if (typeof window === 'undefined' || !hasAutomationEqualityBug) {
            return equalsConstructorPrototype(object);
        }
        try {
            return equalsConstructorPrototype(object);
        } catch (e) {
            return false;
        }
    };
    var dontEnums = [
        'toString',
        'toLocaleString',
        'valueOf',
        'hasOwnProperty',
        'isPrototypeOf',
        'propertyIsEnumerable',
        'constructor'
    ];
    var dontEnumsLength = dontEnums.length;

    // taken directly from https://github.com/ljharb/is-arguments/blob/master/index.js
    // can be replaced with require('is-arguments') if we ever use a build process instead
    var isStandardArguments = function isArguments(value) {
        return toStr(value) === '[object Arguments]';
    };
    var isLegacyArguments = function isArguments(value) {
        return value !== null &&
            typeof value === 'object' &&
            typeof value.length === 'number' &&
            value.length >= 0 && !isArray(value) &&
            isCallable(value.callee);
    };
    var isArguments = isStandardArguments(arguments) ? isStandardArguments : isLegacyArguments;

    defineProperties($Object, {
        keys: function keys(object) {
            var isFn = isCallable(object);
            var isArgs = isArguments(object);
            var isObject = object !== null && typeof object === 'object';
            var isStr = isObject && isString(object);

            if (!isObject && !isFn && !isArgs) {
                throw new TypeError('Object.keys called on a non-object');
            }

            var theKeys = [];
            var skipProto = hasProtoEnumBug && isFn;
            if ((isStr && hasStringEnumBug) || isArgs) {
                for (var i = 0; i < object.length; ++i) {
                    pushCall(theKeys, $String(i));
                }
            }

            if (!isArgs) {
                for (var name in object) {
                    if (!(skipProto && name === 'prototype') && owns(object, name)) {
                        pushCall(theKeys, $String(name));
                    }
                }
            }

            if (hasDontEnumBug) {
                var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);
                for (var j = 0; j < dontEnumsLength; j++) {
                    var dontEnum = dontEnums[j];
                    if (!(skipConstructor && dontEnum === 'constructor') && owns(object, dontEnum)) {
                        pushCall(theKeys, dontEnum);
                    }
                }
            }
            return theKeys;
        }
    });

    var keysWorksWithArguments = $Object.keys && (function () {
            // Safari 5.0 bug
            return $Object.keys(arguments).length === 2;
        }(1, 2));
    var keysHasArgumentsLengthBug = $Object.keys && (function () {
            var argKeys = $Object.keys(arguments);
            return arguments.length !== 1 || argKeys.length !== 1 || argKeys[0] !== 1;
        }(1));
    var originalKeys = $Object.keys;
    defineProperties($Object, {
        keys: function keys(object) {
            if (isArguments(object)) {
                return originalKeys(arraySlice(object));
            } else {
                return originalKeys(object);
            }
        }
    }, !keysWorksWithArguments || keysHasArgumentsLengthBug);

    //
    // Date
    // ====
    //

    var hasNegativeMonthYearBug = new Date(-3509827329600292).getUTCMonth() !== 0;
    var aNegativeTestDate = new Date(-1509842289600292);
    var aPositiveTestDate = new Date(1449662400000);
    var hasToUTCStringFormatBug = aNegativeTestDate.toUTCString() !== 'Mon, 01 Jan -45875 11:59:59 GMT';
    var hasToDateStringFormatBug;
    var hasToStringFormatBug;
    var timeZoneOffset = aNegativeTestDate.getTimezoneOffset();
    if (timeZoneOffset < -720) {
        hasToDateStringFormatBug = aNegativeTestDate.toDateString() !== 'Tue Jan 02 -45875';
        hasToStringFormatBug = !(/^Thu Dec 10 2015 \d\d:\d\d:\d\d GMT[-\+]\d\d\d\d(?: |$)/).test(aPositiveTestDate.toString());
    } else {
        hasToDateStringFormatBug = aNegativeTestDate.toDateString() !== 'Mon Jan 01 -45875';
        hasToStringFormatBug = !(/^Wed Dec 09 2015 \d\d:\d\d:\d\d GMT[-\+]\d\d\d\d(?: |$)/).test(aPositiveTestDate.toString());
    }

    var originalGetFullYear = call.bind(Date.prototype.getFullYear);
    var originalGetMonth = call.bind(Date.prototype.getMonth);
    var originalGetDate = call.bind(Date.prototype.getDate);
    var originalGetUTCFullYear = call.bind(Date.prototype.getUTCFullYear);
    var originalGetUTCMonth = call.bind(Date.prototype.getUTCMonth);
    var originalGetUTCDate = call.bind(Date.prototype.getUTCDate);
    var originalGetUTCDay = call.bind(Date.prototype.getUTCDay);
    var originalGetUTCHours = call.bind(Date.prototype.getUTCHours);
    var originalGetUTCMinutes = call.bind(Date.prototype.getUTCMinutes);
    var originalGetUTCSeconds = call.bind(Date.prototype.getUTCSeconds);
    var originalGetUTCMilliseconds = call.bind(Date.prototype.getUTCMilliseconds);
    var dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var daysInMonth = function daysInMonth(month, year) {
        return originalGetDate(new Date(year, month, 0));
    };

    defineProperties(Date.prototype, {
        getFullYear: function getFullYear() {
            if (!this || !(this instanceof Date)) {
                throw new TypeError('this is not a Date object.');
            }
            var year = originalGetFullYear(this);
            if (year < 0 && originalGetMonth(this) > 11) {
                return year + 1;
            }
            return year;
        },
        getMonth: function getMonth() {
            if (!this || !(this instanceof Date)) {
                throw new TypeError('this is not a Date object.');
            }
            var year = originalGetFullYear(this);
            var month = originalGetMonth(this);
            if (year < 0 && month > 11) {
                return 0;
            }
            return month;
        },
        getDate: function getDate() {
            if (!this || !(this instanceof Date)) {
                throw new TypeError('this is not a Date object.');
            }
            var year = originalGetFullYear(this);
            var month = originalGetMonth(this);
            var date = originalGetDate(this);
            if (year < 0 && month > 11) {
                if (month === 12) {
                    return date;
                }
                var days = daysInMonth(0, year + 1);
                return (days - date) + 1;
            }
            return date;
        },
        getUTCFullYear: function getUTCFullYear() {
            if (!this || !(this instanceof Date)) {
                throw new TypeError('this is not a Date object.');
            }
            var year = originalGetUTCFullYear(this);
            if (year < 0 && originalGetUTCMonth(this) > 11) {
                return year + 1;
            }
            return year;
        },
        getUTCMonth: function getUTCMonth() {
            if (!this || !(this instanceof Date)) {
                throw new TypeError('this is not a Date object.');
            }
            var year = originalGetUTCFullYear(this);
            var month = originalGetUTCMonth(this);
            if (year < 0 && month > 11) {
                return 0;
            }
            return month;
        },
        getUTCDate: function getUTCDate() {
            if (!this || !(this instanceof Date)) {
                throw new TypeError('this is not a Date object.');
            }
            var year = originalGetUTCFullYear(this);
            var month = originalGetUTCMonth(this);
            var date = originalGetUTCDate(this);
            if (year < 0 && month > 11) {
                if (month === 12) {
                    return date;
                }
                var days = daysInMonth(0, year + 1);
                return (days - date) + 1;
            }
            return date;
        }
    }, hasNegativeMonthYearBug);

    defineProperties(Date.prototype, {
        toUTCString: function toUTCString() {
            if (!this || !(this instanceof Date)) {
                throw new TypeError('this is not a Date object.');
            }
            var day = originalGetUTCDay(this);
            var date = originalGetUTCDate(this);
            var month = originalGetUTCMonth(this);
            var year = originalGetUTCFullYear(this);
            var hour = originalGetUTCHours(this);
            var minute = originalGetUTCMinutes(this);
            var second = originalGetUTCSeconds(this);
            return dayName[day] + ', ' +
                (date < 10 ? '0' + date : date) + ' ' +
                monthName[month] + ' ' +
                year + ' ' +
                (hour < 10 ? '0' + hour : hour) + ':' +
                (minute < 10 ? '0' + minute : minute) + ':' +
                (second < 10 ? '0' + second : second) + ' GMT';
        }
    }, hasNegativeMonthYearBug || hasToUTCStringFormatBug);

    // Opera 12 has `,`
    defineProperties(Date.prototype, {
        toDateString: function toDateString() {
            if (!this || !(this instanceof Date)) {
                throw new TypeError('this is not a Date object.');
            }
            var day = this.getDay();
            var date = this.getDate();
            var month = this.getMonth();
            var year = this.getFullYear();
            return dayName[day] + ' ' +
                monthName[month] + ' ' +
                (date < 10 ? '0' + date : date) + ' ' +
                year;
        }
    }, hasNegativeMonthYearBug || hasToDateStringFormatBug);

    // can't use defineProperties here because of toString enumeration issue in IE <= 8
    if (hasNegativeMonthYearBug || hasToStringFormatBug) {
        Date.prototype.toString = function toString() {
            if (!this || !(this instanceof Date)) {
                throw new TypeError('this is not a Date object.');
            }
            var day = this.getDay();
            var date = this.getDate();
            var month = this.getMonth();
            var year = this.getFullYear();
            var hour = this.getHours();
            var minute = this.getMinutes();
            var second = this.getSeconds();
            var timezoneOffset = this.getTimezoneOffset();
            var hoursOffset = Math.floor(Math.abs(timezoneOffset) / 60);
            var minutesOffset = Math.floor(Math.abs(timezoneOffset) % 60);
            return dayName[day] + ' ' +
                monthName[month] + ' ' +
                (date < 10 ? '0' + date : date) + ' ' +
                year + ' ' +
                (hour < 10 ? '0' + hour : hour) + ':' +
                (minute < 10 ? '0' + minute : minute) + ':' +
                (second < 10 ? '0' + second : second) + ' GMT' +
                (timezoneOffset > 0 ? '-' : '+') +
                (hoursOffset < 10 ? '0' + hoursOffset : hoursOffset) +
                (minutesOffset < 10 ? '0' + minutesOffset : minutesOffset);
        };
        if (supportsDescriptors) {
            $Object.defineProperty(Date.prototype, 'toString', {
                configurable: true,
                enumerable: false,
                writable: true
            });
        }
    }

    // ES5 15.9.5.43
    // http://es5.github.com/#x15.9.5.43
    // This function returns a String value represent the instance in time
    // represented by this Date object. The format of the String is the Date Time
    // string format defined in 15.9.1.15. All fields are present in the String.
    // The time zone is always UTC, denoted by the suffix Z. If the time value of
    // this object is not a finite Number a RangeError exception is thrown.
    var negativeDate = -62198755200000;
    var negativeYearString = '-000001';
    var hasNegativeDateBug = Date.prototype.toISOString && new Date(negativeDate).toISOString().indexOf(negativeYearString) === -1;
    var hasSafari51DateBug = Date.prototype.toISOString && new Date(-1).toISOString() !== '1969-12-31T23:59:59.999Z';

    var getTime = call.bind(Date.prototype.getTime);

    defineProperties(Date.prototype, {
        toISOString: function toISOString() {
            if (!isFinite(this) || !isFinite(getTime(this))) {
                // Adope Photoshop requires the second check.
                throw new RangeError('Date.prototype.toISOString called on non-finite value.');
            }

            var year = originalGetUTCFullYear(this);

            var month = originalGetUTCMonth(this);
            // see https://github.com/es-shims/es5-shim/issues/111
            year += Math.floor(month / 12);
            month = (month % 12 + 12) % 12;

            // the date time string format is specified in 15.9.1.15.
            var result = [month + 1, originalGetUTCDate(this), originalGetUTCHours(this), originalGetUTCMinutes(this), originalGetUTCSeconds(this)];
            year = (
                (year < 0 ? '-' : (year > 9999 ? '+' : '')) +
                strSlice('00000' + Math.abs(year), (0 <= year && year <= 9999) ? -4 : -6)
            );

            for (var i = 0; i < result.length; ++i) {
                // pad months, days, hours, minutes, and seconds to have two digits.
                result[i] = strSlice('00' + result[i], -2);
            }
            // pad milliseconds to have three digits.
            return (
                year + '-' + arraySlice(result, 0, 2).join('-') +
                'T' + arraySlice(result, 2).join(':') + '.' +
                strSlice('000' + originalGetUTCMilliseconds(this), -3) + 'Z'
            );
        }
    }, hasNegativeDateBug || hasSafari51DateBug);

    // ES5 15.9.5.44
    // http://es5.github.com/#x15.9.5.44
    // This function provides a String representation of a Date object for use by
    // JSON.stringify (15.12.3).
    var dateToJSONIsSupported = (function () {
        try {
            return Date.prototype.toJSON &&
                new Date(NaN).toJSON() === null &&
                new Date(negativeDate).toJSON().indexOf(negativeYearString) !== -1 &&
                Date.prototype.toJSON.call({ // generic
                    toISOString: function () {
                        return true;
                    }
                });
        } catch (e) {
            return false;
        }
    }());
    if (!dateToJSONIsSupported) {
        Date.prototype.toJSON = function toJSON(key) {
            // When the toJSON method is called with argument key, the following
            // steps are taken:

            // 1.  Let O be the result of calling ToObject, giving it the this
            // value as its argument.
            // 2. Let tv be ES.ToPrimitive(O, hint Number).
            var O = $Object(this);
            var tv = ES.ToPrimitive(O);
            // 3. If tv is a Number and is not finite, return null.
            if (typeof tv === 'number' && !isFinite(tv)) {
                return null;
            }
            // 4. Let toISO be the result of calling the [[Get]] internal method of
            // O with argument "toISOString".
            var toISO = O.toISOString;
            // 5. If IsCallable(toISO) is false, throw a TypeError exception.
            if (!isCallable(toISO)) {
                throw new TypeError('toISOString property is not callable');
            }
            // 6. Return the result of calling the [[Call]] internal method of
            //  toISO with O as the this value and an empty argument list.
            return toISO.call(O);

            // NOTE 1 The argument is ignored.

            // NOTE 2 The toJSON function is intentionally generic; it does not
            // require that its this value be a Date object. Therefore, it can be
            // transferred to other kinds of objects for use as a method. However,
            // it does require that any such object have a toISOString method. An
            // object is free to use the argument key to filter its
            // stringification.
        };
    }

    // ES5 15.9.4.2
    // http://es5.github.com/#x15.9.4.2
    // based on work shared by Daniel Friesen (dantman)
    // http://gist.github.com/303249
    var supportsExtendedYears = Date.parse('+033658-09-27T01:46:40.000Z') === 1e15;
    var acceptsInvalidDates = !isNaN(Date.parse('2012-04-04T24:00:00.500Z')) || !isNaN(Date.parse('2012-11-31T23:59:59.000Z')) || !isNaN(Date.parse('2012-12-31T23:59:60.000Z'));
    var doesNotParseY2KNewYear = isNaN(Date.parse('2000-01-01T00:00:00.000Z'));
    if (doesNotParseY2KNewYear || acceptsInvalidDates || !supportsExtendedYears) {
        // XXX global assignment won't work in embeddings that use
        // an alternate object for the context.
        /* global Date: true */
        /* eslint-disable no-undef */
        var maxSafeUnsigned32Bit = Math.pow(2, 31) - 1;
        var hasSafariSignedIntBug = isActualNaN(new Date(1970, 0, 1, 0, 0, 0, maxSafeUnsigned32Bit + 1).getTime());
        /* eslint-disable no-implicit-globals */
        Date = (function (NativeDate) {
            /* eslint-enable no-implicit-globals */
            /* eslint-enable no-undef */
            // Date.length === 7
            var DateShim = function Date(Y, M, D, h, m, s, ms) {
                var length = arguments.length;
                var date;
                if (this instanceof NativeDate) {
                    var seconds = s;
                    var millis = ms;
                    if (hasSafariSignedIntBug && length >= 7 && ms > maxSafeUnsigned32Bit) {
                        // work around a Safari 8/9 bug where it treats the seconds as signed
                        var msToShift = Math.floor(ms / maxSafeUnsigned32Bit) * maxSafeUnsigned32Bit;
                        var sToShift = Math.floor(msToShift / 1e3);
                        seconds += sToShift;
                        millis -= sToShift * 1e3;
                    }
                    date = length === 1 && $String(Y) === Y ? // isString(Y)
                        // We explicitly pass it through parse:
                        new NativeDate(DateShim.parse(Y)) :
                        // We have to manually make calls depending on argument
                        // length here
                        length >= 7 ? new NativeDate(Y, M, D, h, m, seconds, millis) :
                            length >= 6 ? new NativeDate(Y, M, D, h, m, seconds) :
                                length >= 5 ? new NativeDate(Y, M, D, h, m) :
                                    length >= 4 ? new NativeDate(Y, M, D, h) :
                                        length >= 3 ? new NativeDate(Y, M, D) :
                                            length >= 2 ? new NativeDate(Y, M) :
                                                length >= 1 ? new NativeDate(Y instanceof NativeDate ? +Y : Y) :
                                                    new NativeDate();
                } else {
                    date = NativeDate.apply(this, arguments);
                }
                if (!isPrimitive(date)) {
                    // Prevent mixups with unfixed Date object
                    defineProperties(date, {constructor: DateShim}, true);
                }
                return date;
            };

            // 15.9.1.15 Date Time String Format.
            var isoDateExpression = new RegExp('^' +
                '(\\d{4}|[+-]\\d{6})' + // four-digit year capture or sign +
                // 6-digit extended year
                '(?:-(\\d{2})' + // optional month capture
                '(?:-(\\d{2})' + // optional day capture
                '(?:' + // capture hours:minutes:seconds.milliseconds
                'T(\\d{2})' + // hours capture
                ':(\\d{2})' + // minutes capture
                '(?:' + // optional :seconds.milliseconds
                ':(\\d{2})' + // seconds capture
                '(?:(\\.\\d{1,}))?' + // milliseconds capture
                ')?' +
                '(' + // capture UTC offset component
                'Z|' + // UTC capture
                '(?:' + // offset specifier +/-hours:minutes
                '([-+])' + // sign capture
                '(\\d{2})' + // hours offset capture
                ':(\\d{2})' + // minutes offset capture
                ')' +
                ')?)?)?)?' +
                '$');

            var months = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365];

            var dayFromMonth = function dayFromMonth(year, month) {
                var t = month > 1 ? 1 : 0;
                return (
                    months[month] +
                    Math.floor((year - 1969 + t) / 4) -
                    Math.floor((year - 1901 + t) / 100) +
                    Math.floor((year - 1601 + t) / 400) +
                    365 * (year - 1970)
                );
            };

            var toUTC = function toUTC(t) {
                var s = 0;
                var ms = t;
                if (hasSafariSignedIntBug && ms > maxSafeUnsigned32Bit) {
                    // work around a Safari 8/9 bug where it treats the seconds as signed
                    var msToShift = Math.floor(ms / maxSafeUnsigned32Bit) * maxSafeUnsigned32Bit;
                    var sToShift = Math.floor(msToShift / 1e3);
                    s += sToShift;
                    ms -= sToShift * 1e3;
                }
                return $Number(new NativeDate(1970, 0, 1, 0, 0, s, ms));
            };

            // Copy any custom methods a 3rd party library may have added
            for (var key in NativeDate) {
                if (owns(NativeDate, key)) {
                    DateShim[key] = NativeDate[key];
                }
            }

            // Copy "native" methods explicitly; they may be non-enumerable
            defineProperties(DateShim, {
                now: NativeDate.now,
                UTC: NativeDate.UTC
            }, true);
            DateShim.prototype = NativeDate.prototype;
            defineProperties(DateShim.prototype, {
                constructor: DateShim
            }, true);

            // Upgrade Date.parse to handle simplified ISO 8601 strings
            var parseShim = function parse(string) {
                var match = isoDateExpression.exec(string);
                if (match) {
                    // parse months, days, hours, minutes, seconds, and milliseconds
                    // provide default values if necessary
                    // parse the UTC offset component
                    var year = $Number(match[1]),
                        month = $Number(match[2] || 1) - 1,
                        day = $Number(match[3] || 1) - 1,
                        hour = $Number(match[4] || 0),
                        minute = $Number(match[5] || 0),
                        second = $Number(match[6] || 0),
                        millisecond = Math.floor($Number(match[7] || 0) * 1000),
                        // When time zone is missed, local offset should be used
                        // (ES 5.1 bug)
                        // see https://bugs.ecmascript.org/show_bug.cgi?id=112
                        isLocalTime = Boolean(match[4] && !match[8]),
                        signOffset = match[9] === '-' ? 1 : -1,
                        hourOffset = $Number(match[10] || 0),
                        minuteOffset = $Number(match[11] || 0),
                        result;
                    var hasMinutesOrSecondsOrMilliseconds = minute > 0 || second > 0 || millisecond > 0;
                    if (
                        hour < (hasMinutesOrSecondsOrMilliseconds ? 24 : 25) &&
                        minute < 60 && second < 60 && millisecond < 1000 &&
                        month > -1 && month < 12 && hourOffset < 24 &&
                        minuteOffset < 60 && // detect invalid offsets
                        day > -1 &&
                        day < (dayFromMonth(year, month + 1) - dayFromMonth(year, month))
                    ) {
                        result = (
                                (dayFromMonth(year, month) + day) * 24 +
                                hour +
                                hourOffset * signOffset
                            ) * 60;
                        result = (
                                (result + minute + minuteOffset * signOffset) * 60 +
                                second
                            ) * 1000 + millisecond;
                        if (isLocalTime) {
                            result = toUTC(result);
                        }
                        if (-8.64e15 <= result && result <= 8.64e15) {
                            return result;
                        }
                    }
                    return NaN;
                }
                return NativeDate.parse.apply(this, arguments);
            };
            defineProperties(DateShim, {parse: parseShim});

            return DateShim;
        }(Date));
        /* global Date: false */
    }

    // ES5 15.9.4.4
    // http://es5.github.com/#x15.9.4.4
    if (!Date.now) {
        Date.now = function now() {
            return new Date().getTime();
        };
    }

    //
    // Number
    // ======
    //

    // ES5.1 15.7.4.5
    // http://es5.github.com/#x15.7.4.5
    var hasToFixedBugs = NumberPrototype.toFixed && (
            (0.00008).toFixed(3) !== '0.000' ||
            (0.9).toFixed(0) !== '1' ||
            (1.255).toFixed(2) !== '1.25' ||
            (1000000000000000128).toFixed(0) !== '1000000000000000128'
        );

    var toFixedHelpers = {
        base: 1e7,
        size: 6,
        data: [0, 0, 0, 0, 0, 0],
        multiply: function multiply(n, c) {
            var i = -1;
            var c2 = c;
            while (++i < toFixedHelpers.size) {
                c2 += n * toFixedHelpers.data[i];
                toFixedHelpers.data[i] = c2 % toFixedHelpers.base;
                c2 = Math.floor(c2 / toFixedHelpers.base);
            }
        },
        divide: function divide(n) {
            var i = toFixedHelpers.size;
            var c = 0;
            while (--i >= 0) {
                c += toFixedHelpers.data[i];
                toFixedHelpers.data[i] = Math.floor(c / n);
                c = (c % n) * toFixedHelpers.base;
            }
        },
        numToString: function numToString() {
            var i = toFixedHelpers.size;
            var s = '';
            while (--i >= 0) {
                if (s !== '' || i === 0 || toFixedHelpers.data[i] !== 0) {
                    var t = $String(toFixedHelpers.data[i]);
                    if (s === '') {
                        s = t;
                    } else {
                        s += strSlice('0000000', 0, 7 - t.length) + t;
                    }
                }
            }
            return s;
        },
        pow: function pow(x, n, acc) {
            return (n === 0 ? acc : (n % 2 === 1 ? pow(x, n - 1, acc * x) : pow(x * x, n / 2, acc)));
        },
        log: function log(x) {
            var n = 0;
            var x2 = x;
            while (x2 >= 4096) {
                n += 12;
                x2 /= 4096;
            }
            while (x2 >= 2) {
                n += 1;
                x2 /= 2;
            }
            return n;
        }
    };

    var toFixedShim = function toFixed(fractionDigits) {
        var f, x, s, m, e, z, j, k;

        // Test for NaN and round fractionDigits down
        f = $Number(fractionDigits);
        f = isActualNaN(f) ? 0 : Math.floor(f);

        if (f < 0 || f > 20) {
            throw new RangeError('Number.toFixed called with invalid number of decimals');
        }

        x = $Number(this);

        if (isActualNaN(x)) {
            return 'NaN';
        }

        // If it is too big or small, return the string value of the number
        if (x <= -1e21 || x >= 1e21) {
            return $String(x);
        }

        s = '';

        if (x < 0) {
            s = '-';
            x = -x;
        }

        m = '0';

        if (x > 1e-21) {
            // 1e-21 < x < 1e21
            // -70 < log2(x) < 70
            e = toFixedHelpers.log(x * toFixedHelpers.pow(2, 69, 1)) - 69;
            z = (e < 0 ? x * toFixedHelpers.pow(2, -e, 1) : x / toFixedHelpers.pow(2, e, 1));
            z *= 0x10000000000000; // Math.pow(2, 52);
            e = 52 - e;

            // -18 < e < 122
            // x = z / 2 ^ e
            if (e > 0) {
                toFixedHelpers.multiply(0, z);
                j = f;

                while (j >= 7) {
                    toFixedHelpers.multiply(1e7, 0);
                    j -= 7;
                }

                toFixedHelpers.multiply(toFixedHelpers.pow(10, j, 1), 0);
                j = e - 1;

                while (j >= 23) {
                    toFixedHelpers.divide(1 << 23);
                    j -= 23;
                }

                toFixedHelpers.divide(1 << j);
                toFixedHelpers.multiply(1, 1);
                toFixedHelpers.divide(2);
                m = toFixedHelpers.numToString();
            } else {
                toFixedHelpers.multiply(0, z);
                toFixedHelpers.multiply(1 << (-e), 0);
                m = toFixedHelpers.numToString() + strSlice('0.00000000000000000000', 2, 2 + f);
            }
        }

        if (f > 0) {
            k = m.length;

            if (k <= f) {
                m = s + strSlice('0.0000000000000000000', 0, f - k + 2) + m;
            } else {
                m = s + strSlice(m, 0, k - f) + '.' + strSlice(m, k - f);
            }
        } else {
            m = s + m;
        }

        return m;
    };
    defineProperties(NumberPrototype, {toFixed: toFixedShim}, hasToFixedBugs);

    var hasToPrecisionUndefinedBug = (function () {
        try {
            return 1.0.toPrecision(undefined) === '1';
        } catch (e) {
            return true;
        }
    }());
    var originalToPrecision = NumberPrototype.toPrecision;
    defineProperties(NumberPrototype, {
        toPrecision: function toPrecision(precision) {
            return typeof precision === 'undefined' ? originalToPrecision.call(this) : originalToPrecision.call(this, precision);
        }
    }, hasToPrecisionUndefinedBug);

    //
    // String
    // ======
    //

    // ES5 15.5.4.14
    // http://es5.github.com/#x15.5.4.14

    // [bugfix, IE lt 9, firefox 4, Konqueror, Opera, obscure browsers]
    // Many browsers do not split properly with regular expressions or they
    // do not perform the split correctly under obscure conditions.
    // See http://blog.stevenlevithan.com/archives/cross-browser-split
    // I've tested in many browsers and this seems to cover the deviant ones:
    //    'ab'.split(/(?:ab)*/) should be ["", ""], not [""]
    //    '.'.split(/(.?)(.?)/) should be ["", ".", "", ""], not ["", ""]
    //    'tesst'.split(/(s)*/) should be ["t", undefined, "e", "s", "t"], not
    //       [undefined, "t", undefined, "e", ...]
    //    ''.split(/.?/) should be [], not [""]
    //    '.'.split(/()()/) should be ["."], not ["", "", "."]

    if (
        'ab'.split(/(?:ab)*/).length !== 2 ||
        '.'.split(/(.?)(.?)/).length !== 4 ||
        'tesst'.split(/(s)*/)[1] === 't' ||
        'test'.split(/(?:)/, -1).length !== 4 ||
        ''.split(/.?/).length ||
        '.'.split(/()()/).length > 1
    ) {
        (function () {
            var compliantExecNpcg = typeof (/()??/).exec('')[1] === 'undefined'; // NPCG: nonparticipating capturing group
            var maxSafe32BitInt = Math.pow(2, 32) - 1;

            StringPrototype.split = function (separator, limit) {
                var string = String(this);
                if (typeof separator === 'undefined' && limit === 0) {
                    return [];
                }

                // If `separator` is not a regex, use native split
                if (!isRegex(separator)) {
                    return strSplit(this, separator, limit);
                }

                var output = [];
                var flags = (separator.ignoreCase ? 'i' : '') +
                        (separator.multiline ? 'm' : '') +
                        (separator.unicode ? 'u' : '') + // in ES6
                        (separator.sticky ? 'y' : ''), // Firefox 3+ and ES6
                    lastLastIndex = 0,
                    // Make `global` and avoid `lastIndex` issues by working with a copy
                    separator2, match, lastIndex, lastLength;
                var separatorCopy = new RegExp(separator.source, flags + 'g');
                if (!compliantExecNpcg) {
                    // Doesn't need flags gy, but they don't hurt
                    separator2 = new RegExp('^' + separatorCopy.source + '$(?!\\s)', flags);
                }
                /* Values for `limit`, per the spec:
                 * If undefined: 4294967295 // maxSafe32BitInt
                 * If 0, Infinity, or NaN: 0
                 * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
                 * If negative number: 4294967296 - Math.floor(Math.abs(limit))
                 * If other: Type-convert, then use the above rules
                 */
                var splitLimit = typeof limit === 'undefined' ? maxSafe32BitInt : ES.ToUint32(limit);
                match = separatorCopy.exec(string);
                while (match) {
                    // `separatorCopy.lastIndex` is not reliable cross-browser
                    lastIndex = match.index + match[0].length;
                    if (lastIndex > lastLastIndex) {
                        pushCall(output, strSlice(string, lastLastIndex, match.index));
                        // Fix browsers whose `exec` methods don't consistently return `undefined` for
                        // nonparticipating capturing groups
                        if (!compliantExecNpcg && match.length > 1) {
                            /* eslint-disable no-loop-func */
                            match[0].replace(separator2, function () {
                                for (var i = 1; i < arguments.length - 2; i++) {
                                    if (typeof arguments[i] === 'undefined') {
                                        match[i] = void 0;
                                    }
                                }
                            });
                            /* eslint-enable no-loop-func */
                        }
                        if (match.length > 1 && match.index < string.length) {
                            array_push.apply(output, arraySlice(match, 1));
                        }
                        lastLength = match[0].length;
                        lastLastIndex = lastIndex;
                        if (output.length >= splitLimit) {
                            break;
                        }
                    }
                    if (separatorCopy.lastIndex === match.index) {
                        separatorCopy.lastIndex++; // Avoid an infinite loop
                    }
                    match = separatorCopy.exec(string);
                }
                if (lastLastIndex === string.length) {
                    if (lastLength || !separatorCopy.test('')) {
                        pushCall(output, '');
                    }
                } else {
                    pushCall(output, strSlice(string, lastLastIndex));
                }
                return output.length > splitLimit ? arraySlice(output, 0, splitLimit) : output;
            };
        }());

        // [bugfix, chrome]
        // If separator is undefined, then the result array contains just one String,
        // which is the this value (converted to a String). If limit is not undefined,
        // then the output array is truncated so that it contains no more than limit
        // elements.
        // "0".split(undefined, 0) -> []
    } else if ('0'.split(void 0, 0).length) {
        StringPrototype.split = function split(separator, limit) {
            if (typeof separator === 'undefined' && limit === 0) {
                return [];
            }
            return strSplit(this, separator, limit);
        };
    }

    var str_replace = StringPrototype.replace;
    var replaceReportsGroupsCorrectly = (function () {
        var groups = [];
        'x'.replace(/x(.)?/g, function (match, group) {
            pushCall(groups, group);
        });
        return groups.length === 1 && typeof groups[0] === 'undefined';
    }());

    if (!replaceReportsGroupsCorrectly) {
        StringPrototype.replace = function replace(searchValue, replaceValue) {
            var isFn = isCallable(replaceValue);
            var hasCapturingGroups = isRegex(searchValue) && (/\)[*?]/).test(searchValue.source);
            if (!isFn || !hasCapturingGroups) {
                return str_replace.call(this, searchValue, replaceValue);
            } else {
                var wrappedReplaceValue = function (match) {
                    var length = arguments.length;
                    var originalLastIndex = searchValue.lastIndex;
                    searchValue.lastIndex = 0;
                    var args = searchValue.exec(match) || [];
                    searchValue.lastIndex = originalLastIndex;
                    pushCall(args, arguments[length - 2], arguments[length - 1]);
                    return replaceValue.apply(this, args);
                };
                return str_replace.call(this, searchValue, wrappedReplaceValue);
            }
        };
    }

    // ECMA-262, 3rd B.2.3
    // Not an ECMAScript standard, although ECMAScript 3rd Edition has a
    // non-normative section suggesting uniform semantics and it should be
    // normalized across all browsers
    // [bugfix, IE lt 9] IE < 9 substr() with negative value not working in IE
    var string_substr = StringPrototype.substr;
    var hasNegativeSubstrBug = ''.substr && '0b'.substr(-1) !== 'b';
    defineProperties(StringPrototype, {
        substr: function substr(start, length) {
            var normalizedStart = start;
            if (start < 0) {
                normalizedStart = max(this.length + start, 0);
            }
            return string_substr.call(this, normalizedStart, length);
        }
    }, hasNegativeSubstrBug);

    // ES5 15.5.4.20
    // whitespace from: http://es5.github.io/#x15.5.4.20
    var ws = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
        '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028' +
        '\u2029\uFEFF';
    var zeroWidth = '\u200b';
    var wsRegexChars = '[' + ws + ']';
    var trimBeginRegexp = new RegExp('^' + wsRegexChars + wsRegexChars + '*');
    var trimEndRegexp = new RegExp(wsRegexChars + wsRegexChars + '*$');
    var hasTrimWhitespaceBug = StringPrototype.trim && (ws.trim() || !zeroWidth.trim());
    defineProperties(StringPrototype, {
        // http://blog.stevenlevithan.com/archives/faster-trim-javascript
        // http://perfectionkills.com/whitespace-deviations/
        trim: function trim() {
            if (typeof this === 'undefined' || this === null) {
                throw new TypeError("can't convert " + this + ' to object');
            }
            return $String(this).replace(trimBeginRegexp, '').replace(trimEndRegexp, '');
        }
    }, hasTrimWhitespaceBug);
    var trim = call.bind(String.prototype.trim);

    var hasLastIndexBug = StringPrototype.lastIndexOf && 'abc銇傘亜'.lastIndexOf('銇傘亜', 2) !== -1;
    defineProperties(StringPrototype, {
        lastIndexOf: function lastIndexOf(searchString) {
            if (typeof this === 'undefined' || this === null) {
                throw new TypeError("can't convert " + this + ' to object');
            }
            var S = $String(this);
            var searchStr = $String(searchString);
            var numPos = arguments.length > 1 ? $Number(arguments[1]) : NaN;
            var pos = isActualNaN(numPos) ? Infinity : ES.ToInteger(numPos);
            var start = min(max(pos, 0), S.length);
            var searchLen = searchStr.length;
            var k = start + searchLen;
            while (k > 0) {
                k = max(0, k - searchLen);
                var index = strIndexOf(strSlice(S, k, start + searchLen), searchStr);
                if (index !== -1) {
                    return k + index;
                }
            }
            return -1;
        }
    }, hasLastIndexBug);

    var originalLastIndexOf = StringPrototype.lastIndexOf;
    defineProperties(StringPrototype, {
        lastIndexOf: function lastIndexOf(searchString) {
            return originalLastIndexOf.apply(this, arguments);
        }
    }, StringPrototype.lastIndexOf.length !== 1);

    // ES-5 15.1.2.2
    /* eslint-disable radix */
    if (parseInt(ws + '08') !== 8 || parseInt(ws + '0x16') !== 22) {
        /* eslint-enable radix */
        /* global parseInt: true */
        parseInt = (function (origParseInt) {
            var hexRegex = /^[\-+]?0[xX]/;
            return function parseInt(str, radix) {
                var string = trim(String(str));
                var defaultedRadix = $Number(radix) || (hexRegex.test(string) ? 16 : 10);
                return origParseInt(string, defaultedRadix);
            };
        }(parseInt));
    }

    // https://es5.github.io/#x15.1.2.3
    if (1 / parseFloat('-0') !== -Infinity) {
        /* global parseFloat: true */
        parseFloat = (function (origParseFloat) {
            return function parseFloat(string) {
                var inputString = trim(String(string));
                var result = origParseFloat(inputString);
                return result === 0 && strSlice(inputString, 0, 1) === '-' ? -0 : result;
            };
        }(parseFloat));
    }

    if (String(new RangeError('test')) !== 'RangeError: test') {
        var errorToStringShim = function toString() {
            if (typeof this === 'undefined' || this === null) {
                throw new TypeError("can't convert " + this + ' to object');
            }
            var name = this.name;
            if (typeof name === 'undefined') {
                name = 'Error';
            } else if (typeof name !== 'string') {
                name = $String(name);
            }
            var msg = this.message;
            if (typeof msg === 'undefined') {
                msg = '';
            } else if (typeof msg !== 'string') {
                msg = $String(msg);
            }
            if (!name) {
                return msg;
            }
            if (!msg) {
                return name;
            }
            return name + ': ' + msg;
        };
        // can't use defineProperties here because of toString enumeration issue in IE <= 8
        Error.prototype.toString = errorToStringShim;
    }

    if (supportsDescriptors) {
        var ensureNonEnumerable = function (obj, prop) {
            if (isEnum(obj, prop)) {
                var desc = Object.getOwnPropertyDescriptor(obj, prop);
                if (desc.configurable) {
                    desc.enumerable = false;
                    Object.defineProperty(obj, prop, desc);
                }
            }
        };
        ensureNonEnumerable(Error.prototype, 'message');
        if (Error.prototype.message !== '') {
            Error.prototype.message = '';
        }
        ensureNonEnumerable(Error.prototype, 'name');
    }

    if (String(/a/mig) !== '/a/gim') {
        var regexToString = function toString() {
            var str = '/' + this.source + '/';
            if (this.global) {
                str += 'g';
            }
            if (this.ignoreCase) {
                str += 'i';
            }
            if (this.multiline) {
                str += 'm';
            }
            return str;
        };
        // can't use defineProperties here because of toString enumeration issue in IE <= 8
        RegExp.prototype.toString = regexToString;
    }
}));
//endregion
/** es5-shim END */

/** es5-sham */
//region es5-sham
/*!
 * https://github.com/es-shims/es5-shim
 * @license es5-shim Copyright 2009-2015 by contributors, MIT License
 * see https://github.com/es-shims/es5-shim/blob/master/LICENSE
 */

// vim: ts=4 sts=4 sw=4 expandtab

// Add semicolon to prevent IIFE from being passed as argument to concatenated code.
;

// UMD (Universal Module Definition)
// see https://github.com/umdjs/umd/blob/master/templates/returnExports.js
(function (root, factory) {
    'use strict';

    /* global define, exports, module */
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.returnExports = factory();
    }
}(this, function () {

    var call = Function.call;
    var prototypeOfObject = Object.prototype;
    var owns = call.bind(prototypeOfObject.hasOwnProperty);
    var isEnumerable = call.bind(prototypeOfObject.propertyIsEnumerable);
    var toStr = call.bind(prototypeOfObject.toString);

    // If JS engine supports accessors creating shortcuts.
    var defineGetter;
    var defineSetter;
    var lookupGetter;
    var lookupSetter;
    var supportsAccessors = owns(prototypeOfObject, '__defineGetter__');
    if (supportsAccessors) {
        /* eslint-disable no-underscore-dangle */
        defineGetter = call.bind(prototypeOfObject.__defineGetter__);
        defineSetter = call.bind(prototypeOfObject.__defineSetter__);
        lookupGetter = call.bind(prototypeOfObject.__lookupGetter__);
        lookupSetter = call.bind(prototypeOfObject.__lookupSetter__);
        /* eslint-enable no-underscore-dangle */
    }

    var isPrimitive = function isPrimitive(o) {
        return o == null || (typeof o !== 'object' && typeof o !== 'function');
    };

    // ES5 15.2.3.2
    // http://es5.github.com/#x15.2.3.2
    if (!Object.getPrototypeOf) {
        // https://github.com/es-shims/es5-shim/issues#issue/2
        // http://ejohn.org/blog/objectgetprototypeof/
        // recommended by fschaefer on github
        //
        // sure, and webreflection says ^_^
        // ... this will nerever possibly return null
        // ... Opera Mini breaks here with infinite loops
        Object.getPrototypeOf = function getPrototypeOf(object) {
            /* eslint-disable no-proto */
            var proto = object.__proto__;
            /* eslint-enable no-proto */
            if (proto || proto === null) {
                return proto;
            } else if (toStr(object.constructor) === '[object Function]') {
                return object.constructor.prototype;
            } else if (object instanceof Object) {
                return prototypeOfObject;
            } else {
                // Correctly return null for Objects created with `Object.create(null)`
                // (shammed or native) or `{ __proto__: null}`.  Also returns null for
                // cross-realm objects on browsers that lack `__proto__` support (like
                // IE <11), but that's the best we can do.
                return null;
            }
        };
    }

    // ES5 15.2.3.3
    // http://es5.github.com/#x15.2.3.3

    var doesGetOwnPropertyDescriptorWork = function doesGetOwnPropertyDescriptorWork(object) {
        try {
            object.sentinel = 0;
            return Object.getOwnPropertyDescriptor(object, 'sentinel').value === 0;
        } catch (exception) {
            return false;
        }
    };

    // check whether getOwnPropertyDescriptor works if it's given. Otherwise, shim partially.
    if (Object.defineProperty) {
        var getOwnPropertyDescriptorWorksOnObject = doesGetOwnPropertyDescriptorWork({});
        var getOwnPropertyDescriptorWorksOnDom = typeof document === 'undefined' ||
            doesGetOwnPropertyDescriptorWork(document.createElement('div'));
        if (!getOwnPropertyDescriptorWorksOnDom || !getOwnPropertyDescriptorWorksOnObject) {
            var getOwnPropertyDescriptorFallback = Object.getOwnPropertyDescriptor;
        }
    }

    if (!Object.getOwnPropertyDescriptor || getOwnPropertyDescriptorFallback) {
        var ERR_NON_OBJECT = 'Object.getOwnPropertyDescriptor called on a non-object: ';

        /* eslint-disable no-proto */
        Object.getOwnPropertyDescriptor = function getOwnPropertyDescriptor(object, property) {
            if (isPrimitive(object)) {
                throw new TypeError(ERR_NON_OBJECT + object);
            }

            // make a valiant attempt to use the real getOwnPropertyDescriptor
            // for I8's DOM elements.
            if (getOwnPropertyDescriptorFallback) {
                try {
                    return getOwnPropertyDescriptorFallback.call(Object, object, property);
                } catch (exception) {
                    // try the shim if the real one doesn't work
                }
            }

            var descriptor;

            // If object does not owns property return undefined immediately.
            if (!owns(object, property)) {
                return descriptor;
            }

            // If object has a property then it's for sure `configurable`, and
            // probably `enumerable`. Detect enumerability though.
            descriptor = {
                enumerable: isEnumerable(object, property),
                configurable: true
            };

            // If JS engine supports accessor properties then property may be a
            // getter or setter.
            if (supportsAccessors) {
                // Unfortunately `__lookupGetter__` will return a getter even
                // if object has own non getter property along with a same named
                // inherited getter. To avoid misbehavior we temporary remove
                // `__proto__` so that `__lookupGetter__` will return getter only
                // if it's owned by an object.
                var prototype = object.__proto__;
                var notPrototypeOfObject = object !== prototypeOfObject;
                // avoid recursion problem, breaking in Opera Mini when
                // Object.getOwnPropertyDescriptor(Object.prototype, 'toString')
                // or any other Object.prototype accessor
                if (notPrototypeOfObject) {
                    object.__proto__ = prototypeOfObject;
                }

                var getter = lookupGetter(object, property);
                var setter = lookupSetter(object, property);

                if (notPrototypeOfObject) {
                    // Once we have getter and setter we can put values back.
                    object.__proto__ = prototype;
                }

                if (getter || setter) {
                    if (getter) {
                        descriptor.get = getter;
                    }
                    if (setter) {
                        descriptor.set = setter;
                    }
                    // If it was accessor property we're done and return here
                    // in order to avoid adding `value` to the descriptor.
                    return descriptor;
                }
            }

            // If we got this far we know that object has an own property that is
            // not an accessor so we set it as a value and return descriptor.
            descriptor.value = object[property];
            descriptor.writable = true;
            return descriptor;
        };
        /* eslint-enable no-proto */
    }

    // ES5 15.2.3.4
    // http://es5.github.com/#x15.2.3.4
    if (!Object.getOwnPropertyNames) {
        Object.getOwnPropertyNames = function getOwnPropertyNames(object) {
            return Object.keys(object);
        };
    }

    // ES5 15.2.3.5
    // http://es5.github.com/#x15.2.3.5
    if (!Object.create) {

        // Contributed by Brandon Benvie, October, 2012
        var createEmpty;
        var supportsProto = !({__proto__: null} instanceof Object);
        // the following produces false positives
        // in Opera Mini => not a reliable check
        // Object.prototype.__proto__ === null

        // Check for document.domain and active x support
        // No need to use active x approach when document.domain is not set
        // see https://github.com/es-shims/es5-shim/issues/150
        // variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
        /* global ActiveXObject */
        var shouldUseActiveX = function shouldUseActiveX() {
            // return early if document.domain not set
            if (!document.domain) {
                return false;
            }

            try {
                return !!new ActiveXObject('htmlfile');
            } catch (exception) {
                return false;
            }
        };

        // This supports IE8 when document.domain is used
        // see https://github.com/es-shims/es5-shim/issues/150
        // variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
        var getEmptyViaActiveX = function getEmptyViaActiveX() {
            var empty;
            var xDoc;

            xDoc = new ActiveXObject('htmlfile');

            var script = 'script';
            xDoc.write('<' + script + '></' + script + '>');
            xDoc.close();

            empty = xDoc.parentWindow.Object.prototype;
            xDoc = null;

            return empty;
        };

        // The original implementation using an iframe
        // before the activex approach was added
        // see https://github.com/es-shims/es5-shim/issues/150
        var getEmptyViaIFrame = function getEmptyViaIFrame() {
            var iframe = document.createElement('iframe');
            var parent = document.body || document.documentElement;
            var empty;

            iframe.style.display = 'none';
            parent.appendChild(iframe);
            /* eslint-disable no-script-url */
            iframe.src = 'javascript:';
            /* eslint-enable no-script-url */

            empty = iframe.contentWindow.Object.prototype;
            parent.removeChild(iframe);
            iframe = null;

            return empty;
        };

        /* global document */
        if (supportsProto || typeof document === 'undefined') {
            createEmpty = function () {
                return {__proto__: null};
            };
        } else {
            // In old IE __proto__ can't be used to manually set `null`, nor does
            // any other method exist to make an object that inherits from nothing,
            // aside from Object.prototype itself. Instead, create a new global
            // object and *steal* its Object.prototype and strip it bare. This is
            // used as the prototype to create nullary objects.
            createEmpty = function () {
                // Determine which approach to use
                // see https://github.com/es-shims/es5-shim/issues/150
                var empty = shouldUseActiveX() ? getEmptyViaActiveX() : getEmptyViaIFrame();

                delete empty.constructor;
                delete empty.hasOwnProperty;
                delete empty.propertyIsEnumerable;
                delete empty.isPrototypeOf;
                delete empty.toLocaleString;
                delete empty.toString;
                delete empty.valueOf;

                var Empty = function Empty() {
                };
                Empty.prototype = empty;
                // short-circuit future calls
                createEmpty = function () {
                    return new Empty();
                };
                return new Empty();
            };
        }

        Object.create = function create(prototype, properties) {

            var object;
            var Type = function Type() {
            }; // An empty constructor.

            if (prototype === null) {
                object = createEmpty();
            } else {
                if (prototype !== null && isPrimitive(prototype)) {
                    // In the native implementation `parent` can be `null`
                    // OR *any* `instanceof Object`  (Object|Function|Array|RegExp|etc)
                    // Use `typeof` tho, b/c in old IE, DOM elements are not `instanceof Object`
                    // like they are in modern browsers. Using `Object.create` on DOM elements
                    // is...err...probably inappropriate, but the native version allows for it.
                    throw new TypeError('Object prototype may only be an Object or null'); // same msg as Chrome
                }
                Type.prototype = prototype;
                object = new Type();
                // IE has no built-in implementation of `Object.getPrototypeOf`
                // neither `__proto__`, but this manually setting `__proto__` will
                // guarantee that `Object.getPrototypeOf` will work as expected with
                // objects created using `Object.create`
                /* eslint-disable no-proto */
                object.__proto__ = prototype;
                /* eslint-enable no-proto */
            }

            if (properties !== void 0) {
                Object.defineProperties(object, properties);
            }

            return object;
        };
    }

    // ES5 15.2.3.6
    // http://es5.github.com/#x15.2.3.6

    // Patch for WebKit and IE8 standard mode
    // Designed by hax <hax.github.com>
    // related issue: https://github.com/es-shims/es5-shim/issues#issue/5
    // IE8 Reference:
    //     http://msdn.microsoft.com/en-us/library/dd282900.aspx
    //     http://msdn.microsoft.com/en-us/library/dd229916.aspx
    // WebKit Bugs:
    //     https://bugs.webkit.org/show_bug.cgi?id=36423

    var doesDefinePropertyWork = function doesDefinePropertyWork(object) {
        try {
            Object.defineProperty(object, 'sentinel', {});
            return 'sentinel' in object;
        } catch (exception) {
            return false;
        }
    };

    // check whether defineProperty works if it's given. Otherwise,
    // shim partially.
    if (Object.defineProperty) {
        var definePropertyWorksOnObject = doesDefinePropertyWork({});
        var definePropertyWorksOnDom = typeof document === 'undefined' ||
            doesDefinePropertyWork(document.createElement('div'));
        if (!definePropertyWorksOnObject || !definePropertyWorksOnDom) {
            var definePropertyFallback = Object.defineProperty,
                definePropertiesFallback = Object.defineProperties;
        }
    }

    if (!Object.defineProperty || definePropertyFallback) {
        var ERR_NON_OBJECT_DESCRIPTOR = 'Property description must be an object: ';
        var ERR_NON_OBJECT_TARGET = 'Object.defineProperty called on non-object: ';
        var ERR_ACCESSORS_NOT_SUPPORTED = 'getters & setters can not be defined on this javascript engine';

        Object.defineProperty = function defineProperty(object, property, descriptor) {
            if (isPrimitive(object)) {
                throw new TypeError(ERR_NON_OBJECT_TARGET + object);
            }
            if (isPrimitive(descriptor)) {
                throw new TypeError(ERR_NON_OBJECT_DESCRIPTOR + descriptor);
            }
            // make a valiant attempt to use the real defineProperty
            // for I8's DOM elements.
            if (definePropertyFallback) {
                try {
                    return definePropertyFallback.call(Object, object, property, descriptor);
                } catch (exception) {
                    // try the shim if the real one doesn't work
                }
            }

            // If it's a data property.
            if ('value' in descriptor) {
                // fail silently if 'writable', 'enumerable', or 'configurable'
                // are requested but not supported
                /*
                 // alternate approach:
                 if ( // can't implement these features; allow false but not true
                 ('writable' in descriptor && !descriptor.writable) ||
                 ('enumerable' in descriptor && !descriptor.enumerable) ||
                 ('configurable' in descriptor && !descriptor.configurable)
                 ))
                 throw new RangeError(
                 'This implementation of Object.defineProperty does not support configurable, enumerable, or writable.'
                 );
                 */

                if (supportsAccessors && (lookupGetter(object, property) || lookupSetter(object, property))) {
                    // As accessors are supported only on engines implementing
                    // `__proto__` we can safely override `__proto__` while defining
                    // a property to make sure that we don't hit an inherited
                    // accessor.
                    /* eslint-disable no-proto */
                    var prototype = object.__proto__;
                    object.__proto__ = prototypeOfObject;
                    // Deleting a property anyway since getter / setter may be
                    // defined on object itself.
                    delete object[property];
                    object[property] = descriptor.value;
                    // Setting original `__proto__` back now.
                    object.__proto__ = prototype;
                    /* eslint-enable no-proto */
                } else {
                    object[property] = descriptor.value;
                }
            } else {
                var hasGetter = 'get' in descriptor;
                var hasSetter = 'set' in descriptor;
                if (!supportsAccessors && (hasGetter || hasSetter)) {
                    throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
                }
                // If we got that far then getters and setters can be defined !!
                if (hasGetter) {
                    defineGetter(object, property, descriptor.get);
                }
                if (hasSetter) {
                    defineSetter(object, property, descriptor.set);
                }
            }
            return object;
        };
    }

    // ES5 15.2.3.7
    // http://es5.github.com/#x15.2.3.7
    if (!Object.defineProperties || definePropertiesFallback) {
        Object.defineProperties = function defineProperties(object, properties) {
            // make a valiant attempt to use the real defineProperties
            if (definePropertiesFallback) {
                try {
                    return definePropertiesFallback.call(Object, object, properties);
                } catch (exception) {
                    // try the shim if the real one doesn't work
                }
            }

            Object.keys(properties).forEach(function (property) {
                if (property !== '__proto__') {
                    Object.defineProperty(object, property, properties[property]);
                }
            });
            return object;
        };
    }

    // ES5 15.2.3.8
    // http://es5.github.com/#x15.2.3.8
    if (!Object.seal) {
        Object.seal = function seal(object) {
            if (Object(object) !== object) {
                throw new TypeError('Object.seal can only be called on Objects.');
            }
            // this is misleading and breaks feature-detection, but
            // allows "securable" code to "gracefully" degrade to working
            // but insecure code.
            return object;
        };
    }

    // ES5 15.2.3.9
    // http://es5.github.com/#x15.2.3.9
    if (!Object.freeze) {
        Object.freeze = function freeze(object) {
            if (Object(object) !== object) {
                throw new TypeError('Object.freeze can only be called on Objects.');
            }
            // this is misleading and breaks feature-detection, but
            // allows "securable" code to "gracefully" degrade to working
            // but insecure code.
            return object;
        };
    }

    // detect a Rhino bug and patch it
    try {
        Object.freeze(function () {
        });
    } catch (exception) {
        Object.freeze = (function (freezeObject) {
            return function freeze(object) {
                if (typeof object === 'function') {
                    return object;
                } else {
                    return freezeObject(object);
                }
            };
        }(Object.freeze));
    }

    // ES5 15.2.3.10
    // http://es5.github.com/#x15.2.3.10
    if (!Object.preventExtensions) {
        Object.preventExtensions = function preventExtensions(object) {
            if (Object(object) !== object) {
                throw new TypeError('Object.preventExtensions can only be called on Objects.');
            }
            // this is misleading and breaks feature-detection, but
            // allows "securable" code to "gracefully" degrade to working
            // but insecure code.
            return object;
        };
    }

    // ES5 15.2.3.11
    // http://es5.github.com/#x15.2.3.11
    if (!Object.isSealed) {
        Object.isSealed = function isSealed(object) {
            if (Object(object) !== object) {
                throw new TypeError('Object.isSealed can only be called on Objects.');
            }
            return false;
        };
    }

    // ES5 15.2.3.12
    // http://es5.github.com/#x15.2.3.12
    if (!Object.isFrozen) {
        Object.isFrozen = function isFrozen(object) {
            if (Object(object) !== object) {
                throw new TypeError('Object.isFrozen can only be called on Objects.');
            }
            return false;
        };
    }

    // ES5 15.2.3.13
    // http://es5.github.com/#x15.2.3.13
    if (!Object.isExtensible) {
        Object.isExtensible = function isExtensible(object) {
            // 1. If Type(O) is not Object throw a TypeError exception.
            if (Object(object) !== object) {
                throw new TypeError('Object.isExtensible can only be called on Objects.');
            }
            // 2. Return the Boolean value of the [[Extensible]] internal property of O.
            var name = '';
            while (owns(object, name)) {
                name += '?';
            }
            object[name] = true;
            var returnValue = owns(object, name);
            delete object[name];
            return returnValue;
        };
    }

}));
//endregion
/** es5-sham END */

/** json3 垫片 */
//region json3
/*! JSON v3.3.2 | http://bestiejs.github.io/json3 | Copyright 2012-2014, Kit Cambridge | http://kit.mit-license.org */
;(function () {
    // Detect the `define` function exposed by asynchronous module loaders. The
    // strict `define` check is necessary for compatibility with `r.js`.
    var isLoader = typeof define === "function" && define.amd;

    // A set of types used to distinguish objects from primitives.
    var objectTypes = {
        "function": true,
        "object": true
    };

    // Detect the `exports` object exposed by CommonJS implementations.
    var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;

    // Use the `global` object exposed by Node (including Browserify via
    // `insert-module-globals`), Narwhal, and Ringo as the default context,
    // and the `window` object in browsers. Rhino exports a `global` function
    // instead.
    var root = objectTypes[typeof window] && window || this,
        freeGlobal = freeExports && objectTypes[typeof module] && module && !module.nodeType && typeof global == "object" && global;

    if (freeGlobal && (freeGlobal["global"] === freeGlobal || freeGlobal["window"] === freeGlobal || freeGlobal["self"] === freeGlobal)) {
        root = freeGlobal;
    }

    // Public: Initializes JSON 3 using the given `context` object, attaching the
    // `stringify` and `parse` functions to the specified `exports` object.
    function runInContext(context, exports) {
        context || (context = root["Object"]());
        exports || (exports = root["Object"]());

        // Native constructor aliases.
        var Number = context["Number"] || root["Number"],
            String = context["String"] || root["String"],
            Object = context["Object"] || root["Object"],
            Date = context["Date"] || root["Date"],
            SyntaxError = context["SyntaxError"] || root["SyntaxError"],
            TypeError = context["TypeError"] || root["TypeError"],
            Math = context["Math"] || root["Math"],
            nativeJSON = context["JSON"] || root["JSON"];

        // Delegate to the native `stringify` and `parse` implementations.
        if (typeof nativeJSON == "object" && nativeJSON) {
            exports.stringify = nativeJSON.stringify;
            exports.parse = nativeJSON.parse;
        }

        // Convenience aliases.
        var objectProto = Object.prototype,
            getClass = objectProto.toString,
            isProperty, forEach, undef;

        // Test the `Date#getUTC*` methods. Based on work by @Yaffle.
        var isExtended = new Date(-3509827334573292);
        try {
            // The `getUTCFullYear`, `Month`, and `Date` methods return nonsensical
            // results for certain dates in Opera >= 10.53.
            isExtended = isExtended.getUTCFullYear() == -109252 && isExtended.getUTCMonth() === 0 && isExtended.getUTCDate() === 1 &&
                // Safari < 2.0.2 stores the internal millisecond time value correctly,
                // but clips the values returned by the date methods to the range of
                // signed 32-bit integers ([-2 ** 31, 2 ** 31 - 1]).
                isExtended.getUTCHours() == 10 && isExtended.getUTCMinutes() == 37 && isExtended.getUTCSeconds() == 6 && isExtended.getUTCMilliseconds() == 708;
        } catch (exception) {
        }

        // Internal: Determines whether the native `JSON.stringify` and `parse`
        // implementations are spec-compliant. Based on work by Ken Snyder.
        function has(name) {
            if (has[name] !== undef) {
                // Return cached feature test result.
                return has[name];
            }
            var isSupported;
            if (name == "bug-string-char-index") {
                // IE <= 7 doesn't support accessing string characters using square
                // bracket notation. IE 8 only supports this for primitives.
                isSupported = "a"[0] != "a";
            } else if (name == "json") {
                // Indicates whether both `JSON.stringify` and `JSON.parse` are
                // supported.
                isSupported = has("json-stringify") && has("json-parse");
            } else {
                var value, serialized = '{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';
                // Test `JSON.stringify`.
                if (name == "json-stringify") {
                    var stringify = exports.stringify, stringifySupported = typeof stringify == "function" && isExtended;
                    if (stringifySupported) {
                        // A test function object with a custom `toJSON` method.
                        (value = function () {
                            return 1;
                        }).toJSON = value;
                        try {
                            stringifySupported =
                                // Firefox 3.1b1 and b2 serialize string, number, and boolean
                                // primitives as object literals.
                                stringify(0) === "0" &&
                                // FF 3.1b1, b2, and JSON 2 serialize wrapped primitives as object
                                // literals.
                                stringify(new Number()) === "0" &&
                                stringify(new String()) == '""' &&
                                // FF 3.1b1, 2 throw an error if the value is `null`, `undefined`, or
                                // does not define a canonical JSON representation (this applies to
                                // objects with `toJSON` properties as well, *unless* they are nested
                                // within an object or array).
                                stringify(getClass) === undef &&
                                // IE 8 serializes `undefined` as `"undefined"`. Safari <= 5.1.7 and
                                // FF 3.1b3 pass this test.
                                stringify(undef) === undef &&
                                // Safari <= 5.1.7 and FF 3.1b3 throw `Error`s and `TypeError`s,
                                // respectively, if the value is omitted entirely.
                                stringify() === undef &&
                                // FF 3.1b1, 2 throw an error if the given value is not a number,
                                // string, array, object, Boolean, or `null` literal. This applies to
                                // objects with custom `toJSON` methods as well, unless they are nested
                                // inside object or array literals. YUI 3.0.0b1 ignores custom `toJSON`
                                // methods entirely.
                                stringify(value) === "1" &&
                                stringify([value]) == "[1]" &&
                                // Prototype <= 1.6.1 serializes `[undefined]` as `"[]"` instead of
                                // `"[null]"`.
                                stringify([undef]) == "[null]" &&
                                // YUI 3.0.0b1 fails to serialize `null` literals.
                                stringify(null) == "null" &&
                                // FF 3.1b1, 2 halts serialization if an array contains a function:
                                // `[1, true, getClass, 1]` serializes as "[1,true,],". FF 3.1b3
                                // elides non-JSON values from objects and arrays, unless they
                                // define custom `toJSON` methods.
                                stringify([undef, getClass, null]) == "[null,null,null]" &&
                                // Simple serialization test. FF 3.1b1 uses Unicode escape sequences
                                // where character escape codes are expected (e.g., `\b` => `\u0008`).
                                stringify({"a": [value, true, false, null, "\x00\b\n\f\r\t"]}) == serialized &&
                                // FF 3.1b1 and b2 ignore the `filter` and `width` arguments.
                                stringify(null, value) === "1" &&
                                stringify([1, 2], null, 1) == "[\n 1,\n 2\n]" &&
                                // JSON 2, Prototype <= 1.7, and older WebKit builds incorrectly
                                // serialize extended years.
                                stringify(new Date(-8.64e15)) == '"-271821-04-20T00:00:00.000Z"' &&
                                // The milliseconds are optional in ES 5, but required in 5.1.
                                stringify(new Date(8.64e15)) == '"+275760-09-13T00:00:00.000Z"' &&
                                // Firefox <= 11.0 incorrectly serializes years prior to 0 as negative
                                // four-digit years instead of six-digit years. Credits: @Yaffle.
                                stringify(new Date(-621987552e5)) == '"-000001-01-01T00:00:00.000Z"' &&
                                // Safari <= 5.1.5 and Opera >= 10.53 incorrectly serialize millisecond
                                // values less than 1000. Credits: @Yaffle.
                                stringify(new Date(-1)) == '"1969-12-31T23:59:59.999Z"';
                        } catch (exception) {
                            stringifySupported = false;
                        }
                    }
                    isSupported = stringifySupported;
                }
                // Test `JSON.parse`.
                if (name == "json-parse") {
                    var parse = exports.parse;
                    if (typeof parse == "function") {
                        try {
                            // FF 3.1b1, b2 will throw an exception if a bare literal is provided.
                            // Conforming implementations should also coerce the initial argument to
                            // a string prior to parsing.
                            if (parse("0") === 0 && !parse(false)) {
                                // Simple parsing test.
                                value = parse(serialized);
                                var parseSupported = value["a"].length == 5 && value["a"][0] === 1;
                                if (parseSupported) {
                                    try {
                                        // Safari <= 5.1.2 and FF 3.1b1 allow unescaped tabs in strings.
                                        parseSupported = !parse('"\t"');
                                    } catch (exception) {
                                    }
                                    if (parseSupported) {
                                        try {
                                            // FF 4.0 and 4.0.1 allow leading `+` signs and leading
                                            // decimal points. FF 4.0, 4.0.1, and IE 9-10 also allow
                                            // certain octal literals.
                                            parseSupported = parse("01") !== 1;
                                        } catch (exception) {
                                        }
                                    }
                                    if (parseSupported) {
                                        try {
                                            // FF 4.0, 4.0.1, and Rhino 1.7R3-R4 allow trailing decimal
                                            // points. These environments, along with FF 3.1b1 and 2,
                                            // also allow trailing commas in JSON objects and arrays.
                                            parseSupported = parse("1.") !== 1;
                                        } catch (exception) {
                                        }
                                    }
                                }
                            }
                        } catch (exception) {
                            parseSupported = false;
                        }
                    }
                    isSupported = parseSupported;
                }
            }
            return has[name] = !!isSupported;
        }

        if (!has("json")) {
            // Common `[[Class]]` name aliases.
            var functionClass = "[object Function]",
                dateClass = "[object Date]",
                numberClass = "[object Number]",
                stringClass = "[object String]",
                arrayClass = "[object Array]",
                booleanClass = "[object Boolean]";

            // Detect incomplete support for accessing string characters by index.
            var charIndexBuggy = has("bug-string-char-index");

            // Define additional utility methods if the `Date` methods are buggy.
            if (!isExtended) {
                var floor = Math.floor;
                // A mapping between the months of the year and the number of days between
                // January 1st and the first of the respective month.
                var Months = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
                // Internal: Calculates the number of days between the Unix epoch and the
                // first day of the given month.
                var getDay = function (year, month) {
                    return Months[month] + 365 * (year - 1970) + floor((year - 1969 + (month = +(month > 1))) / 4) - floor((year - 1901 + month) / 100) + floor((year - 1601 + month) / 400);
                };
            }

            // Internal: Determines if a property is a direct property of the given
            // object. Delegates to the native `Object#hasOwnProperty` method.
            if (!(isProperty = objectProto.hasOwnProperty)) {
                isProperty = function (property) {
                    var members = {}, constructor;
                    if ((members.__proto__ = null, members.__proto__ = {
                            // The *proto* property cannot be set multiple times in recent
                            // versions of Firefox and SeaMonkey.
                            "toString": 1
                        }, members).toString != getClass) {
                        // Safari <= 2.0.3 doesn't implement `Object#hasOwnProperty`, but
                        // supports the mutable *proto* property.
                        isProperty = function (property) {
                            // Capture and break the object's prototype chain (see section 8.6.2
                            // of the ES 5.1 spec). The parenthesized expression prevents an
                            // unsafe transformation by the Closure Compiler.
                            var original = this.__proto__, result = property in (this.__proto__ = null, this);
                            // Restore the original prototype chain.
                            this.__proto__ = original;
                            return result;
                        };
                    } else {
                        // Capture a reference to the top-level `Object` constructor.
                        constructor = members.constructor;
                        // Use the `constructor` property to simulate `Object#hasOwnProperty` in
                        // other environments.
                        isProperty = function (property) {
                            var parent = (this.constructor || constructor).prototype;
                            return property in this && !(property in parent && this[property] === parent[property]);
                        };
                    }
                    members = null;
                    return isProperty.call(this, property);
                };
            }

            // Internal: Normalizes the `for...in` iteration algorithm across
            // environments. Each enumerated key is yielded to a `callback` function.
            forEach = function (object, callback) {
                var size = 0, Properties, members, property;

                // Tests for bugs in the current environment's `for...in` algorithm. The
                // `valueOf` property inherits the non-enumerable flag from
                // `Object.prototype` in older versions of IE, Netscape, and Mozilla.
                (Properties = function () {
                    this.valueOf = 0;
                }).prototype.valueOf = 0;

                // Iterate over a new instance of the `Properties` class.
                members = new Properties();
                for (property in members) {
                    // Ignore all properties inherited from `Object.prototype`.
                    if (isProperty.call(members, property)) {
                        size++;
                    }
                }
                Properties = members = null;

                // Normalize the iteration algorithm.
                if (!size) {
                    // A list of non-enumerable properties inherited from `Object.prototype`.
                    members = ["valueOf", "toString", "toLocaleString", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "constructor"];
                    // IE <= 8, Mozilla 1.0, and Netscape 6.2 ignore shadowed non-enumerable
                    // properties.
                    forEach = function (object, callback) {
                        var isFunction = getClass.call(object) == functionClass, property, length;
                        var hasProperty = !isFunction && typeof object.constructor != "function" && objectTypes[typeof object.hasOwnProperty] && object.hasOwnProperty || isProperty;
                        for (property in object) {
                            // Gecko <= 1.0 enumerates the `prototype` property of functions under
                            // certain conditions; IE does not.
                            if (!(isFunction && property == "prototype") && hasProperty.call(object, property)) {
                                callback(property);
                            }
                        }
                        // Manually invoke the callback for each non-enumerable property.
                        for (length = members.length; property = members[--length]; hasProperty.call(object, property) && callback(property));
                    };
                } else if (size == 2) {
                    // Safari <= 2.0.4 enumerates shadowed properties twice.
                    forEach = function (object, callback) {
                        // Create a set of iterated properties.
                        var members = {}, isFunction = getClass.call(object) == functionClass, property;
                        for (property in object) {
                            // Store each property name to prevent double enumeration. The
                            // `prototype` property of functions is not enumerated due to cross-
                            // environment inconsistencies.
                            if (!(isFunction && property == "prototype") && !isProperty.call(members, property) && (members[property] = 1) && isProperty.call(object, property)) {
                                callback(property);
                            }
                        }
                    };
                } else {
                    // No bugs detected; use the standard `for...in` algorithm.
                    forEach = function (object, callback) {
                        var isFunction = getClass.call(object) == functionClass, property, isConstructor;
                        for (property in object) {
                            if (!(isFunction && property == "prototype") && isProperty.call(object, property) && !(isConstructor = property === "constructor")) {
                                callback(property);
                            }
                        }
                        // Manually invoke the callback for the `constructor` property due to
                        // cross-environment inconsistencies.
                        if (isConstructor || isProperty.call(object, (property = "constructor"))) {
                            callback(property);
                        }
                    };
                }
                return forEach(object, callback);
            };

            // Public: Serializes a JavaScript `value` as a JSON string. The optional
            // `filter` argument may specify either a function that alters how object and
            // array members are serialized, or an array of strings and numbers that
            // indicates which properties should be serialized. The optional `width`
            // argument may be either a string or number that specifies the indentation
            // level of the output.
            if (!has("json-stringify")) {
                // Internal: A map of control characters and their escaped equivalents.
                var Escapes = {
                    92: "\\\\",
                    34: '\\"',
                    8: "\\b",
                    12: "\\f",
                    10: "\\n",
                    13: "\\r",
                    9: "\\t"
                };

                // Internal: Converts `value` into a zero-padded string such that its
                // length is at least equal to `width`. The `width` must be <= 6.
                var leadingZeroes = "000000";
                var toPaddedString = function (width, value) {
                    // The `|| 0` expression is necessary to work around a bug in
                    // Opera <= 7.54u2 where `0 == -0`, but `String(-0) !== "0"`.
                    return (leadingZeroes + (value || 0)).slice(-width);
                };

                // Internal: Double-quotes a string `value`, replacing all ASCII control
                // characters (characters with code unit values between 0 and 31) with
                // their escaped equivalents. This is an implementation of the
                // `Quote(value)` operation defined in ES 5.1 section 15.12.3.
                var unicodePrefix = "\\u00";
                var quote = function (value) {
                    var result = '"', index = 0, length = value.length, useCharIndex = !charIndexBuggy || length > 10;
                    var symbols = useCharIndex && (charIndexBuggy ? value.split("") : value);
                    for (; index < length; index++) {
                        var charCode = value.charCodeAt(index);
                        // If the character is a control character, append its Unicode or
                        // shorthand escape sequence; otherwise, append the character as-is.
                        switch (charCode) {
                            case 8:
                            case 9:
                            case 10:
                            case 12:
                            case 13:
                            case 34:
                            case 92:
                                result += Escapes[charCode];
                                break;
                            default:
                                if (charCode < 32) {
                                    result += unicodePrefix + toPaddedString(2, charCode.toString(16));
                                    break;
                                }
                                result += useCharIndex ? symbols[index] : value.charAt(index);
                        }
                    }
                    return result + '"';
                };

                // Internal: Recursively serializes an object. Implements the
                // `Str(key, holder)`, `JO(value)`, and `JA(value)` operations.
                var serialize = function (property, object, callback, properties, whitespace, indentation, stack) {
                    var value, className, year, month, date, time, hours, minutes, seconds, milliseconds, results, element, index, length, prefix, result;
                    try {
                        // Necessary for host object support.
                        value = object[property];
                    } catch (exception) {
                    }
                    if (typeof value == "object" && value) {
                        className = getClass.call(value);
                        if (className == dateClass && !isProperty.call(value, "toJSON")) {
                            if (value > -1 / 0 && value < 1 / 0) {
                                // Dates are serialized according to the `Date#toJSON` method
                                // specified in ES 5.1 section 15.9.5.44. See section 15.9.1.15
                                // for the ISO 8601 date time string format.
                                if (getDay) {
                                    // Manually compute the year, month, date, hours, minutes,
                                    // seconds, and milliseconds if the `getUTC*` methods are
                                    // buggy. Adapted from @Yaffle's `date-shim` project.
                                    date = floor(value / 864e5);
                                    for (year = floor(date / 365.2425) + 1970 - 1; getDay(year + 1, 0) <= date; year++);
                                    for (month = floor((date - getDay(year, 0)) / 30.42); getDay(year, month + 1) <= date; month++);
                                    date = 1 + date - getDay(year, month);
                                    // The `time` value specifies the time within the day (see ES
                                    // 5.1 section 15.9.1.2). The formula `(A % B + B) % B` is used
                                    // to compute `A modulo B`, as the `%` operator does not
                                    // correspond to the `modulo` operation for negative numbers.
                                    time = (value % 864e5 + 864e5) % 864e5;
                                    // The hours, minutes, seconds, and milliseconds are obtained by
                                    // decomposing the time within the day. See section 15.9.1.10.
                                    hours = floor(time / 36e5) % 24;
                                    minutes = floor(time / 6e4) % 60;
                                    seconds = floor(time / 1e3) % 60;
                                    milliseconds = time % 1e3;
                                } else {
                                    year = value.getUTCFullYear();
                                    month = value.getUTCMonth();
                                    date = value.getUTCDate();
                                    hours = value.getUTCHours();
                                    minutes = value.getUTCMinutes();
                                    seconds = value.getUTCSeconds();
                                    milliseconds = value.getUTCMilliseconds();
                                }
                                // Serialize extended years correctly.
                                value = (year <= 0 || year >= 1e4 ? (year < 0 ? "-" : "+") + toPaddedString(6, year < 0 ? -year : year) : toPaddedString(4, year)) +
                                    "-" + toPaddedString(2, month + 1) + "-" + toPaddedString(2, date) +
                                    // Months, dates, hours, minutes, and seconds should have two
                                    // digits; milliseconds should have three.
                                    "T" + toPaddedString(2, hours) + ":" + toPaddedString(2, minutes) + ":" + toPaddedString(2, seconds) +
                                    // Milliseconds are optional in ES 5.0, but required in 5.1.
                                    "." + toPaddedString(3, milliseconds) + "Z";
                            } else {
                                value = null;
                            }
                        } else if (typeof value.toJSON == "function" && ((className != numberClass && className != stringClass && className != arrayClass) || isProperty.call(value, "toJSON"))) {
                            // Prototype <= 1.6.1 adds non-standard `toJSON` methods to the
                            // `Number`, `String`, `Date`, and `Array` prototypes. JSON 3
                            // ignores all `toJSON` methods on these objects unless they are
                            // defined directly on an instance.
                            value = value.toJSON(property);
                        }
                    }
                    if (callback) {
                        // If a replacement function was provided, call it to obtain the value
                        // for serialization.
                        value = callback.call(object, property, value);
                    }
                    if (value === null) {
                        return "null";
                    }
                    className = getClass.call(value);
                    if (className == booleanClass) {
                        // Booleans are represented literally.
                        return "" + value;
                    } else if (className == numberClass) {
                        // JSON numbers must be finite. `Infinity` and `NaN` are serialized as
                        // `"null"`.
                        return value > -1 / 0 && value < 1 / 0 ? "" + value : "null";
                    } else if (className == stringClass) {
                        // Strings are double-quoted and escaped.
                        return quote("" + value);
                    }
                    // Recursively serialize objects and arrays.
                    if (typeof value == "object") {
                        // Check for cyclic structures. This is a linear search; performance
                        // is inversely proportional to the number of unique nested objects.
                        for (length = stack.length; length--;) {
                            if (stack[length] === value) {
                                // Cyclic structures cannot be serialized by `JSON.stringify`.
                                throw TypeError();
                            }
                        }
                        // Add the object to the stack of traversed objects.
                        stack.push(value);
                        results = [];
                        // Save the current indentation level and indent one additional level.
                        prefix = indentation;
                        indentation += whitespace;
                        if (className == arrayClass) {
                            // Recursively serialize array elements.
                            for (index = 0, length = value.length; index < length; index++) {
                                element = serialize(index, value, callback, properties, whitespace, indentation, stack);
                                results.push(element === undef ? "null" : element);
                            }
                            result = results.length ? (whitespace ? "[\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "]" : ("[" + results.join(",") + "]")) : "[]";
                        } else {
                            // Recursively serialize object members. Members are selected from
                            // either a user-specified list of property names, or the object
                            // itself.
                            forEach(properties || value, function (property) {
                                var element = serialize(property, value, callback, properties, whitespace, indentation, stack);
                                if (element !== undef) {
                                    // According to ES 5.1 section 15.12.3: "If `gap` {whitespace}
                                    // is not the empty string, let `member` {quote(property) + ":"}
                                    // be the concatenation of `member` and the `space` character."
                                    // The "`space` character" refers to the literal space
                                    // character, not the `space` {width} argument provided to
                                    // `JSON.stringify`.
                                    results.push(quote(property) + ":" + (whitespace ? " " : "") + element);
                                }
                            });
                            result = results.length ? (whitespace ? "{\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "}" : ("{" + results.join(",") + "}")) : "{}";
                        }
                        // Remove the object from the traversed object stack.
                        stack.pop();
                        return result;
                    }
                };

                // Public: `JSON.stringify`. See ES 5.1 section 15.12.3.
                exports.stringify = function (source, filter, width) {
                    var whitespace, callback, properties, className;
                    if (objectTypes[typeof filter] && filter) {
                        if ((className = getClass.call(filter)) == functionClass) {
                            callback = filter;
                        } else if (className == arrayClass) {
                            // Convert the property names array into a makeshift set.
                            properties = {};
                            for (var index = 0, length = filter.length, value; index < length; value = filter[index++], ((className = getClass.call(value)), className == stringClass || className == numberClass) && (properties[value] = 1));
                        }
                    }
                    if (width) {
                        if ((className = getClass.call(width)) == numberClass) {
                            // Convert the `width` to an integer and create a string containing
                            // `width` number of space characters.
                            if ((width -= width % 1) > 0) {
                                for (whitespace = "", width > 10 && (width = 10); whitespace.length < width; whitespace += " ");
                            }
                        } else if (className == stringClass) {
                            whitespace = width.length <= 10 ? width : width.slice(0, 10);
                        }
                    }
                    // Opera <= 7.54u2 discards the values associated with empty string keys
                    // (`""`) only if they are used directly within an object member list
                    // (e.g., `!("" in { "": 1})`).
                    return serialize("", (value = {}, value[""] = source, value), callback, properties, whitespace, "", []);
                };
            }

            // Public: Parses a JSON source string.
            if (!has("json-parse")) {
                var fromCharCode = String.fromCharCode;

                // Internal: A map of escaped control characters and their unescaped
                // equivalents.
                var Unescapes = {
                    92: "\\",
                    34: '"',
                    47: "/",
                    98: "\b",
                    116: "\t",
                    110: "\n",
                    102: "\f",
                    114: "\r"
                };

                // Internal: Stores the parser state.
                var Index, Source;

                // Internal: Resets the parser state and throws a `SyntaxError`.
                var abort = function () {
                    Index = Source = null;
                    throw SyntaxError();
                };

                // Internal: Returns the next token, or `"$"` if the parser has reached
                // the end of the source string. A token may be a string, number, `null`
                // literal, or Boolean literal.
                var lex = function () {
                    var source = Source, length = source.length, value, begin, position, isSigned, charCode;
                    while (Index < length) {
                        charCode = source.charCodeAt(Index);
                        switch (charCode) {
                            case 9:
                            case 10:
                            case 13:
                            case 32:
                                // Skip whitespace tokens, including tabs, carriage returns, line
                                // feeds, and space characters.
                                Index++;
                                break;
                            case 123:
                            case 125:
                            case 91:
                            case 93:
                            case 58:
                            case 44:
                                // Parse a punctuator token (`{`, `}`, `[`, `]`, `:`, or `,`) at
                                // the current position.
                                value = charIndexBuggy ? source.charAt(Index) : source[Index];
                                Index++;
                                return value;
                            case 34:
                                // `"` delimits a JSON string; advance to the next character and
                                // begin parsing the string. String tokens are prefixed with the
                                // sentinel `@` character to distinguish them from punctuators and
                                // end-of-string tokens.
                                for (value = "@", Index++; Index < length;) {
                                    charCode = source.charCodeAt(Index);
                                    if (charCode < 32) {
                                        // Unescaped ASCII control characters (those with a code unit
                                        // less than the space character) are not permitted.
                                        abort();
                                    } else if (charCode == 92) {
                                        // A reverse solidus (`\`) marks the beginning of an escaped
                                        // control character (including `"`, `\`, and `/`) or Unicode
                                        // escape sequence.
                                        charCode = source.charCodeAt(++Index);
                                        switch (charCode) {
                                            case 92:
                                            case 34:
                                            case 47:
                                            case 98:
                                            case 116:
                                            case 110:
                                            case 102:
                                            case 114:
                                                // Revive escaped control characters.
                                                value += Unescapes[charCode];
                                                Index++;
                                                break;
                                            case 117:
                                                // `\u` marks the beginning of a Unicode escape sequence.
                                                // Advance to the first character and validate the
                                                // four-digit code point.
                                                begin = ++Index;
                                                for (position = Index + 4; Index < position; Index++) {
                                                    charCode = source.charCodeAt(Index);
                                                    // A valid sequence comprises four hexdigits (case-
                                                    // insensitive) that form a single hexadecimal value.
                                                    if (!(charCode >= 48 && charCode <= 57 || charCode >= 97 && charCode <= 102 || charCode >= 65 && charCode <= 70)) {
                                                        // Invalid Unicode escape sequence.
                                                        abort();
                                                    }
                                                }
                                                // Revive the escaped character.
                                                value += fromCharCode("0x" + source.slice(begin, Index));
                                                break;
                                            default:
                                                // Invalid escape sequence.
                                                abort();
                                        }
                                    } else {
                                        if (charCode == 34) {
                                            // An unescaped double-quote character marks the end of the
                                            // string.
                                            break;
                                        }
                                        charCode = source.charCodeAt(Index);
                                        begin = Index;
                                        // Optimize for the common case where a string is valid.
                                        while (charCode >= 32 && charCode != 92 && charCode != 34) {
                                            charCode = source.charCodeAt(++Index);
                                        }
                                        // Append the string as-is.
                                        value += source.slice(begin, Index);
                                    }
                                }
                                if (source.charCodeAt(Index) == 34) {
                                    // Advance to the next character and return the revived string.
                                    Index++;
                                    return value;
                                }
                                // Unterminated string.
                                abort();
                            default:
                                // Parse numbers and literals.
                                begin = Index;
                                // Advance past the negative sign, if one is specified.
                                if (charCode == 45) {
                                    isSigned = true;
                                    charCode = source.charCodeAt(++Index);
                                }
                                // Parse an integer or floating-point value.
                                if (charCode >= 48 && charCode <= 57) {
                                    // Leading zeroes are interpreted as octal literals.
                                    if (charCode == 48 && ((charCode = source.charCodeAt(Index + 1)), charCode >= 48 && charCode <= 57)) {
                                        // Illegal octal literal.
                                        abort();
                                    }
                                    isSigned = false;
                                    // Parse the integer component.
                                    for (; Index < length && ((charCode = source.charCodeAt(Index)), charCode >= 48 && charCode <= 57); Index++);
                                    // Floats cannot contain a leading decimal point; however, this
                                    // case is already accounted for by the parser.
                                    if (source.charCodeAt(Index) == 46) {
                                        position = ++Index;
                                        // Parse the decimal component.
                                        for (; position < length && ((charCode = source.charCodeAt(position)), charCode >= 48 && charCode <= 57); position++);
                                        if (position == Index) {
                                            // Illegal trailing decimal.
                                            abort();
                                        }
                                        Index = position;
                                    }
                                    // Parse exponents. The `e` denoting the exponent is
                                    // case-insensitive.
                                    charCode = source.charCodeAt(Index);
                                    if (charCode == 101 || charCode == 69) {
                                        charCode = source.charCodeAt(++Index);
                                        // Skip past the sign following the exponent, if one is
                                        // specified.
                                        if (charCode == 43 || charCode == 45) {
                                            Index++;
                                        }
                                        // Parse the exponential component.
                                        for (position = Index; position < length && ((charCode = source.charCodeAt(position)), charCode >= 48 && charCode <= 57); position++);
                                        if (position == Index) {
                                            // Illegal empty exponent.
                                            abort();
                                        }
                                        Index = position;
                                    }
                                    // Coerce the parsed value to a JavaScript number.
                                    return +source.slice(begin, Index);
                                }
                                // A negative sign may only precede numbers.
                                if (isSigned) {
                                    abort();
                                }
                                // `true`, `false`, and `null` literals.
                                if (source.slice(Index, Index + 4) == "true") {
                                    Index += 4;
                                    return true;
                                } else if (source.slice(Index, Index + 5) == "false") {
                                    Index += 5;
                                    return false;
                                } else if (source.slice(Index, Index + 4) == "null") {
                                    Index += 4;
                                    return null;
                                }
                                // Unrecognized token.
                                abort();
                        }
                    }
                    // Return the sentinel `$` character if the parser has reached the end
                    // of the source string.
                    return "$";
                };

                // Internal: Parses a JSON `value` token.
                var get = function (value) {
                    var results, hasMembers;
                    if (value == "$") {
                        // Unexpected end of input.
                        abort();
                    }
                    if (typeof value == "string") {
                        if ((charIndexBuggy ? value.charAt(0) : value[0]) == "@") {
                            // Remove the sentinel `@` character.
                            return value.slice(1);
                        }
                        // Parse object and array literals.
                        if (value == "[") {
                            // Parses a JSON array, returning a new JavaScript array.
                            results = [];
                            for (; ; hasMembers || (hasMembers = true)) {
                                value = lex();
                                // A closing square bracket marks the end of the array literal.
                                if (value == "]") {
                                    break;
                                }
                                // If the array literal contains elements, the current token
                                // should be a comma separating the previous element from the
                                // next.
                                if (hasMembers) {
                                    if (value == ",") {
                                        value = lex();
                                        if (value == "]") {
                                            // Unexpected trailing `,` in array literal.
                                            abort();
                                        }
                                    } else {
                                        // A `,` must separate each array element.
                                        abort();
                                    }
                                }
                                // Elisions and leading commas are not permitted.
                                if (value == ",") {
                                    abort();
                                }
                                results.push(get(value));
                            }
                            return results;
                        } else if (value == "{") {
                            // Parses a JSON object, returning a new JavaScript object.
                            results = {};
                            for (; ; hasMembers || (hasMembers = true)) {
                                value = lex();
                                // A closing curly brace marks the end of the object literal.
                                if (value == "}") {
                                    break;
                                }
                                // If the object literal contains members, the current token
                                // should be a comma separator.
                                if (hasMembers) {
                                    if (value == ",") {
                                        value = lex();
                                        if (value == "}") {
                                            // Unexpected trailing `,` in object literal.
                                            abort();
                                        }
                                    } else {
                                        // A `,` must separate each object member.
                                        abort();
                                    }
                                }
                                // Leading commas are not permitted, object property names must be
                                // double-quoted strings, and a `:` must separate each property
                                // name and value.
                                if (value == "," || typeof value != "string" || (charIndexBuggy ? value.charAt(0) : value[0]) != "@" || lex() != ":") {
                                    abort();
                                }
                                results[value.slice(1)] = get(lex());
                            }
                            return results;
                        }
                        // Unexpected token encountered.
                        abort();
                    }
                    return value;
                };

                // Internal: Updates a traversed object member.
                var update = function (source, property, callback) {
                    var element = walk(source, property, callback);
                    if (element === undef) {
                        delete source[property];
                    } else {
                        source[property] = element;
                    }
                };

                // Internal: Recursively traverses a parsed JSON object, invoking the
                // `callback` function for each value. This is an implementation of the
                // `Walk(holder, name)` operation defined in ES 5.1 section 15.12.2.
                var walk = function (source, property, callback) {
                    var value = source[property], length;
                    if (typeof value == "object" && value) {
                        // `forEach` can't be used to traverse an array in Opera <= 8.54
                        // because its `Object#hasOwnProperty` implementation returns `false`
                        // for array indices (e.g., `![1, 2, 3].hasOwnProperty("0")`).
                        if (getClass.call(value) == arrayClass) {
                            for (length = value.length; length--;) {
                                update(value, length, callback);
                            }
                        } else {
                            forEach(value, function (property) {
                                update(value, property, callback);
                            });
                        }
                    }
                    return callback.call(source, property, value);
                };

                // Public: `JSON.parse`. See ES 5.1 section 15.12.2.
                exports.parse = function (source, callback) {
                    var result, value;
                    Index = 0;
                    Source = "" + source;
                    result = get(lex());
                    // If a JSON string contains multiple tokens, it is invalid.
                    if (lex() != "$") {
                        abort();
                    }
                    // Reset the parser state.
                    Index = Source = null;
                    return callback && getClass.call(callback) == functionClass ? walk((value = {}, value[""] = result, value), "", callback) : result;
                };
            }
        }

        exports["runInContext"] = runInContext;
        return exports;
    }

    if (freeExports && !isLoader) {
        // Export for CommonJS environments.
        runInContext(root, freeExports);
    } else {
        // Export for web browsers and JavaScript engines.
        var nativeJSON = root.JSON,
            previousJSON = root["JSON3"],
            isRestored = false;

        var JSON3 = runInContext(root, (root["JSON3"] = {
            // Public: Restores the original value of the global `JSON` object and
            // returns a reference to the `JSON3` object.
            "noConflict": function () {
                if (!isRestored) {
                    isRestored = true;
                    root.JSON = nativeJSON;
                    root["JSON3"] = previousJSON;
                    nativeJSON = previousJSON = null;
                }
                return JSON3;
            }
        }));

        root.JSON = {
            "parse": JSON3.parse,
            "stringify": JSON3.stringify
        };
    }

    // Export for asynchronous module loaders.
    if (isLoader) {
        define(function () {
            return JSON3;
        });
    }
}).call(this);
//endregion
/** json3 垫片 END */

/** es6-shim */
//region es6-shim
/*!
 * https://github.com/paulmillr/es6-shim
 * @license es6-shim Copyright 2013-2016 by Paul Miller (http://paulmillr.com)
 *   and contributors,  MIT License
 * es6-shim: v0.35.1
 * see https://github.com/paulmillr/es6-shim/blob/0.35.1/LICENSE
 * Details and documentation:
 * https://github.com/paulmillr/es6-shim/
 */

// UMD (Universal Module Definition)
// see https://github.com/umdjs/umd/blob/master/returnExports.js
(function (root, factory) {
    /*global define, module, exports */
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.returnExports = factory();
    }
}(this, function () {
    'use strict';

    var _apply = Function.call.bind(Function.apply);
    var _call = Function.call.bind(Function.call);
    var isArray = Array.isArray;
    var keys = Object.keys;

    var not = function notThunker(func) {
        return function notThunk() {
            return !_apply(func, this, arguments);
        };
    };
    var throwsError = function (func) {
        try {
            func();
            return false;
        } catch (e) {
            return true;
        }
    };
    var valueOrFalseIfThrows = function valueOrFalseIfThrows(func) {
        try {
            return func();
        } catch (e) {
            return false;
        }
    };

    var isCallableWithoutNew = not(throwsError);
    var arePropertyDescriptorsSupported = function () {
        // if Object.defineProperty exists but throws, it's IE 8
        return !throwsError(function () {
            Object.defineProperty({}, 'x', { get: function () {} });
        });
    };
    var supportsDescriptors = !!Object.defineProperty && arePropertyDescriptorsSupported();
    var functionsHaveNames = (function foo() {}).name === 'foo'; // eslint-disable-line no-extra-parens

    var _forEach = Function.call.bind(Array.prototype.forEach);
    var _reduce = Function.call.bind(Array.prototype.reduce);
    var _filter = Function.call.bind(Array.prototype.filter);
    var _some = Function.call.bind(Array.prototype.some);

    var defineProperty = function (object, name, value, force) {
        if (!force && name in object) { return; }
        if (supportsDescriptors) {
            Object.defineProperty(object, name, {
                configurable: true,
                enumerable: false,
                writable: true,
                value: value
            });
        } else {
            object[name] = value;
        }
    };

    // Define configurable, writable and non-enumerable props
    // if they don鈥檛 exist.
    var defineProperties = function (object, map, forceOverride) {
        _forEach(keys(map), function (name) {
            var method = map[name];
            defineProperty(object, name, method, !!forceOverride);
        });
    };

    var _toString = Function.call.bind(Object.prototype.toString);
    var isCallable = typeof /abc/ === 'function' ? function IsCallableSlow(x) {
        // Some old browsers (IE, FF) say that typeof /abc/ === 'function'
        return typeof x === 'function' && _toString(x) === '[object Function]';
    } : function IsCallableFast(x) { return typeof x === 'function'; };

    var Value = {
        getter: function (object, name, getter) {
            if (!supportsDescriptors) {
                throw new TypeError('getters require true ES5 support');
            }
            Object.defineProperty(object, name, {
                configurable: true,
                enumerable: false,
                get: getter
            });
        },
        proxy: function (originalObject, key, targetObject) {
            if (!supportsDescriptors) {
                throw new TypeError('getters require true ES5 support');
            }
            var originalDescriptor = Object.getOwnPropertyDescriptor(originalObject, key);
            Object.defineProperty(targetObject, key, {
                configurable: originalDescriptor.configurable,
                enumerable: originalDescriptor.enumerable,
                get: function getKey() { return originalObject[key]; },
                set: function setKey(value) { originalObject[key] = value; }
            });
        },
        redefine: function (object, property, newValue) {
            if (supportsDescriptors) {
                var descriptor = Object.getOwnPropertyDescriptor(object, property);
                descriptor.value = newValue;
                Object.defineProperty(object, property, descriptor);
            } else {
                object[property] = newValue;
            }
        },
        defineByDescriptor: function (object, property, descriptor) {
            if (supportsDescriptors) {
                Object.defineProperty(object, property, descriptor);
            } else if ('value' in descriptor) {
                object[property] = descriptor.value;
            }
        },
        preserveToString: function (target, source) {
            if (source && isCallable(source.toString)) {
                defineProperty(target, 'toString', source.toString.bind(source), true);
            }
        }
    };

    // Simple shim for Object.create on ES3 browsers
    // (unlike real shim, no attempt to support `prototype === null`)
    var create = Object.create || function (prototype, properties) {
            var Prototype = function Prototype() {};
            Prototype.prototype = prototype;
            var object = new Prototype();
            if (typeof properties !== 'undefined') {
                keys(properties).forEach(function (key) {
                    Value.defineByDescriptor(object, key, properties[key]);
                });
            }
            return object;
        };

    var supportsSubclassing = function (C, f) {
        if (!Object.setPrototypeOf) { return false; /* skip test on IE < 11 */ }
        return valueOrFalseIfThrows(function () {
            var Sub = function Subclass(arg) {
                var o = new C(arg);
                Object.setPrototypeOf(o, Subclass.prototype);
                return o;
            };
            Object.setPrototypeOf(Sub, C);
            Sub.prototype = create(C.prototype, {
                constructor: { value: Sub }
            });
            return f(Sub);
        });
    };

    var getGlobal = function () {
        /* global self, window, global */
        // the only reliable means to get the global object is
        // `Function('return this')()`
        // However, this causes CSP violations in Chrome apps.
        if (typeof self !== 'undefined') { return self; }
        if (typeof window !== 'undefined') { return window; }
        if (typeof global !== 'undefined') { return global; }
        throw new Error('unable to locate global object');
    };

    var globals = getGlobal();
    var globalIsFinite = globals.isFinite;
    var _indexOf = Function.call.bind(String.prototype.indexOf);
    var _arrayIndexOfApply = Function.apply.bind(Array.prototype.indexOf);
    var _concat = Function.call.bind(Array.prototype.concat);
    // var _sort = Function.call.bind(Array.prototype.sort);
    var _strSlice = Function.call.bind(String.prototype.slice);
    var _push = Function.call.bind(Array.prototype.push);
    var _pushApply = Function.apply.bind(Array.prototype.push);
    var _shift = Function.call.bind(Array.prototype.shift);
    var _max = Math.max;
    var _min = Math.min;
    var _floor = Math.floor;
    var _abs = Math.abs;
    var _exp = Math.exp;
    var _log = Math.log;
    var _sqrt = Math.sqrt;
    var _hasOwnProperty = Function.call.bind(Object.prototype.hasOwnProperty);
    var ArrayIterator; // make our implementation private
    var noop = function () {};

    var Symbol = globals.Symbol || {};
    var symbolSpecies = Symbol.species || '@@species';

    var numberIsNaN = Number.isNaN || function isNaN(value) {
            // NaN !== NaN, but they are identical.
            // NaNs are the only non-reflexive value, i.e., if x !== x,
            // then x is NaN.
            // isNaN is broken: it converts its argument to number, so
            // isNaN('foo') => true
            return value !== value;
        };
    var numberIsFinite = Number.isFinite || function isFinite(value) {
            return typeof value === 'number' && globalIsFinite(value);
        };
    var _sign = isCallable(Math.sign) ? Math.sign : function sign(value) {
        var number = Number(value);
        if (number === 0) { return number; }
        if (numberIsNaN(number)) { return number; }
        return number < 0 ? -1 : 1;
    };

    // taken directly from https://github.com/ljharb/is-arguments/blob/master/index.js
    // can be replaced with require('is-arguments') if we ever use a build process instead
    var isStandardArguments = function isArguments(value) {
        return _toString(value) === '[object Arguments]';
    };
    var isLegacyArguments = function isArguments(value) {
        return value !== null &&
            typeof value === 'object' &&
            typeof value.length === 'number' &&
            value.length >= 0 &&
            _toString(value) !== '[object Array]' &&
            _toString(value.callee) === '[object Function]';
    };
    var isArguments = isStandardArguments(arguments) ? isStandardArguments : isLegacyArguments;

    var Type = {
        primitive: function (x) { return x === null || (typeof x !== 'function' && typeof x !== 'object'); },
        string: function (x) { return _toString(x) === '[object String]'; },
        regex: function (x) { return _toString(x) === '[object RegExp]'; },
        symbol: function (x) {
            return typeof globals.Symbol === 'function' && typeof x === 'symbol';
        }
    };

    var overrideNative = function overrideNative(object, property, replacement) {
        var original = object[property];
        defineProperty(object, property, replacement, true);
        Value.preserveToString(object[property], original);
    };

    var hasSymbols = typeof Symbol === 'function' && typeof Symbol['for'] === 'function' && Type.symbol(Symbol());

    // This is a private name in the es6 spec, equal to '[Symbol.iterator]'
    // we're going to use an arbitrary _-prefixed name to make our shims
    // work properly with each other, even though we don't have full Iterator
    // support.  That is, `Array.from(map.keys())` will work, but we don't
    // pretend to export a "real" Iterator interface.
    var $iterator$ = Type.symbol(Symbol.iterator) ? Symbol.iterator : '_es6-shim iterator_';
    // Firefox ships a partial implementation using the name @@iterator.
    // https://bugzilla.mozilla.org/show_bug.cgi?id=907077#c14
    // So use that name if we detect it.
    if (globals.Set && typeof new globals.Set()['@@iterator'] === 'function') {
        $iterator$ = '@@iterator';
    }

    // Reflect
    if (!globals.Reflect) {
        defineProperty(globals, 'Reflect', {}, true);
    }
    var Reflect = globals.Reflect;

    var $String = String;

    var ES = {
        // http://www.ecma-international.org/ecma-262/6.0/#sec-call
        Call: function Call(F, V) {
            var args = arguments.length > 2 ? arguments[2] : [];
            if (!ES.IsCallable(F)) {
                throw new TypeError(F + ' is not a function');
            }
            return _apply(F, V, args);
        },

        RequireObjectCoercible: function (x, optMessage) {
            /* jshint eqnull:true */
            if (x == null) {
                throw new TypeError(optMessage || 'Cannot call method on ' + x);
            }
            return x;
        },

        // This might miss the "(non-standard exotic and does not implement
        // [[Call]])" case from
        // http://www.ecma-international.org/ecma-262/6.0/#sec-typeof-operator-runtime-semantics-evaluation
        // but we can't find any evidence these objects exist in practice.
        // If we find some in the future, you could test `Object(x) === x`,
        // which is reliable according to
        // http://www.ecma-international.org/ecma-262/6.0/#sec-toobject
        // but is not well optimized by runtimes and creates an object
        // whenever it returns false, and thus is very slow.
        TypeIsObject: function (x) {
            if (x === void 0 || x === null || x === true || x === false) {
                return false;
            }
            return typeof x === 'function' || typeof x === 'object';
        },

        ToObject: function (o, optMessage) {
            return Object(ES.RequireObjectCoercible(o, optMessage));
        },

        IsCallable: isCallable,

        IsConstructor: function (x) {
            // We can't tell callables from constructors in ES5
            return ES.IsCallable(x);
        },

        ToInt32: function (x) {
            return ES.ToNumber(x) >> 0;
        },

        ToUint32: function (x) {
            return ES.ToNumber(x) >>> 0;
        },

        ToNumber: function (value) {
            if (_toString(value) === '[object Symbol]') {
                throw new TypeError('Cannot convert a Symbol value to a number');
            }
            return +value;
        },

        ToInteger: function (value) {
            var number = ES.ToNumber(value);
            if (numberIsNaN(number)) { return 0; }
            if (number === 0 || !numberIsFinite(number)) { return number; }
            return (number > 0 ? 1 : -1) * _floor(_abs(number));
        },

        ToLength: function (value) {
            var len = ES.ToInteger(value);
            if (len <= 0) { return 0; } // includes converting -0 to +0
            if (len > Number.MAX_SAFE_INTEGER) { return Number.MAX_SAFE_INTEGER; }
            return len;
        },

        SameValue: function (a, b) {
            if (a === b) {
                // 0 === -0, but they are not identical.
                if (a === 0) { return 1 / a === 1 / b; }
                return true;
            }
            return numberIsNaN(a) && numberIsNaN(b);
        },

        SameValueZero: function (a, b) {
            // same as SameValue except for SameValueZero(+0, -0) == true
            return (a === b) || (numberIsNaN(a) && numberIsNaN(b));
        },

        IsIterable: function (o) {
            return ES.TypeIsObject(o) && (typeof o[$iterator$] !== 'undefined' || isArguments(o));
        },

        GetIterator: function (o) {
            if (isArguments(o)) {
                // special case support for `arguments`
                return new ArrayIterator(o, 'value');
            }
            var itFn = ES.GetMethod(o, $iterator$);
            if (!ES.IsCallable(itFn)) {
                // Better diagnostics if itFn is null or undefined
                throw new TypeError('value is not an iterable');
            }
            var it = ES.Call(itFn, o);
            if (!ES.TypeIsObject(it)) {
                throw new TypeError('bad iterator');
            }
            return it;
        },

        GetMethod: function (o, p) {
            var func = ES.ToObject(o)[p];
            if (func === void 0 || func === null) {
                return void 0;
            }
            if (!ES.IsCallable(func)) {
                throw new TypeError('Method not callable: ' + p);
            }
            return func;
        },

        IteratorComplete: function (iterResult) {
            return !!iterResult.done;
        },

        IteratorClose: function (iterator, completionIsThrow) {
            var returnMethod = ES.GetMethod(iterator, 'return');
            if (returnMethod === void 0) {
                return;
            }
            var innerResult, innerException;
            try {
                innerResult = ES.Call(returnMethod, iterator);
            } catch (e) {
                innerException = e;
            }
            if (completionIsThrow) {
                return;
            }
            if (innerException) {
                throw innerException;
            }
            if (!ES.TypeIsObject(innerResult)) {
                throw new TypeError("Iterator's return method returned a non-object.");
            }
        },

        IteratorNext: function (it) {
            var result = arguments.length > 1 ? it.next(arguments[1]) : it.next();
            if (!ES.TypeIsObject(result)) {
                throw new TypeError('bad iterator');
            }
            return result;
        },

        IteratorStep: function (it) {
            var result = ES.IteratorNext(it);
            var done = ES.IteratorComplete(result);
            return done ? false : result;
        },

        Construct: function (C, args, newTarget, isES6internal) {
            var target = typeof newTarget === 'undefined' ? C : newTarget;

            if (!isES6internal && Reflect.construct) {
                // Try to use Reflect.construct if available
                return Reflect.construct(C, args, target);
            }
            // OK, we have to fake it.  This will only work if the
            // C.[[ConstructorKind]] == "base" -- but that's the only
            // kind we can make in ES5 code anyway.

            // OrdinaryCreateFromConstructor(target, "%ObjectPrototype%")
            var proto = target.prototype;
            if (!ES.TypeIsObject(proto)) {
                proto = Object.prototype;
            }
            var obj = create(proto);
            // Call the constructor.
            var result = ES.Call(C, obj, args);
            return ES.TypeIsObject(result) ? result : obj;
        },

        SpeciesConstructor: function (O, defaultConstructor) {
            var C = O.constructor;
            if (C === void 0) {
                return defaultConstructor;
            }
            if (!ES.TypeIsObject(C)) {
                throw new TypeError('Bad constructor');
            }
            var S = C[symbolSpecies];
            if (S === void 0 || S === null) {
                return defaultConstructor;
            }
            if (!ES.IsConstructor(S)) {
                throw new TypeError('Bad @@species');
            }
            return S;
        },

        CreateHTML: function (string, tag, attribute, value) {
            var S = ES.ToString(string);
            var p1 = '<' + tag;
            if (attribute !== '') {
                var V = ES.ToString(value);
                var escapedV = V.replace(/"/g, '&quot;');
                p1 += ' ' + attribute + '="' + escapedV + '"';
            }
            var p2 = p1 + '>';
            var p3 = p2 + S;
            return p3 + '</' + tag + '>';
        },

        IsRegExp: function IsRegExp(argument) {
            if (!ES.TypeIsObject(argument)) {
                return false;
            }
            var isRegExp = argument[Symbol.match];
            if (typeof isRegExp !== 'undefined') {
                return !!isRegExp;
            }
            return Type.regex(argument);
        },

        ToString: function ToString(string) {
            return $String(string);
        }
    };

    // Well-known Symbol shims
    if (supportsDescriptors && hasSymbols) {
        var defineWellKnownSymbol = function defineWellKnownSymbol(name) {
            if (Type.symbol(Symbol[name])) {
                return Symbol[name];
            }
            var sym = Symbol['for']('Symbol.' + name);
            Object.defineProperty(Symbol, name, {
                configurable: false,
                enumerable: false,
                writable: false,
                value: sym
            });
            return sym;
        };
        if (!Type.symbol(Symbol.search)) {
            var symbolSearch = defineWellKnownSymbol('search');
            var originalSearch = String.prototype.search;
            defineProperty(RegExp.prototype, symbolSearch, function search(string) {
                return ES.Call(originalSearch, string, [this]);
            });
            var searchShim = function search(regexp) {
                var O = ES.RequireObjectCoercible(this);
                if (regexp !== null && typeof regexp !== 'undefined') {
                    var searcher = ES.GetMethod(regexp, symbolSearch);
                    if (typeof searcher !== 'undefined') {
                        return ES.Call(searcher, regexp, [O]);
                    }
                }
                return ES.Call(originalSearch, O, [ES.ToString(regexp)]);
            };
            overrideNative(String.prototype, 'search', searchShim);
        }
        if (!Type.symbol(Symbol.replace)) {
            var symbolReplace = defineWellKnownSymbol('replace');
            var originalReplace = String.prototype.replace;
            defineProperty(RegExp.prototype, symbolReplace, function replace(string, replaceValue) {
                return ES.Call(originalReplace, string, [this, replaceValue]);
            });
            var replaceShim = function replace(searchValue, replaceValue) {
                var O = ES.RequireObjectCoercible(this);
                if (searchValue !== null && typeof searchValue !== 'undefined') {
                    var replacer = ES.GetMethod(searchValue, symbolReplace);
                    if (typeof replacer !== 'undefined') {
                        return ES.Call(replacer, searchValue, [O, replaceValue]);
                    }
                }
                return ES.Call(originalReplace, O, [ES.ToString(searchValue), replaceValue]);
            };
            overrideNative(String.prototype, 'replace', replaceShim);
        }
        if (!Type.symbol(Symbol.split)) {
            var symbolSplit = defineWellKnownSymbol('split');
            var originalSplit = String.prototype.split;
            defineProperty(RegExp.prototype, symbolSplit, function split(string, limit) {
                return ES.Call(originalSplit, string, [this, limit]);
            });
            var splitShim = function split(separator, limit) {
                var O = ES.RequireObjectCoercible(this);
                if (separator !== null && typeof separator !== 'undefined') {
                    var splitter = ES.GetMethod(separator, symbolSplit);
                    if (typeof splitter !== 'undefined') {
                        return ES.Call(splitter, separator, [O, limit]);
                    }
                }
                return ES.Call(originalSplit, O, [ES.ToString(separator), limit]);
            };
            overrideNative(String.prototype, 'split', splitShim);
        }
        var symbolMatchExists = Type.symbol(Symbol.match);
        var stringMatchIgnoresSymbolMatch = symbolMatchExists && (function () {
                // Firefox 41, through Nightly 45 has Symbol.match, but String#match ignores it.
                // Firefox 40 and below have Symbol.match but String#match works fine.
                var o = {};
                o[Symbol.match] = function () { return 42; };
                return 'a'.match(o) !== 42;
            }());
        if (!symbolMatchExists || stringMatchIgnoresSymbolMatch) {
            var symbolMatch = defineWellKnownSymbol('match');

            var originalMatch = String.prototype.match;
            defineProperty(RegExp.prototype, symbolMatch, function match(string) {
                return ES.Call(originalMatch, string, [this]);
            });

            var matchShim = function match(regexp) {
                var O = ES.RequireObjectCoercible(this);
                if (regexp !== null && typeof regexp !== 'undefined') {
                    var matcher = ES.GetMethod(regexp, symbolMatch);
                    if (typeof matcher !== 'undefined') {
                        return ES.Call(matcher, regexp, [O]);
                    }
                }
                return ES.Call(originalMatch, O, [ES.ToString(regexp)]);
            };
            overrideNative(String.prototype, 'match', matchShim);
        }
    }

    var wrapConstructor = function wrapConstructor(original, replacement, keysToSkip) {
        Value.preserveToString(replacement, original);
        if (Object.setPrototypeOf) {
            // sets up proper prototype chain where possible
            Object.setPrototypeOf(original, replacement);
        }
        if (supportsDescriptors) {
            _forEach(Object.getOwnPropertyNames(original), function (key) {
                if (key in noop || keysToSkip[key]) { return; }
                Value.proxy(original, key, replacement);
            });
        } else {
            _forEach(Object.keys(original), function (key) {
                if (key in noop || keysToSkip[key]) { return; }
                replacement[key] = original[key];
            });
        }
        replacement.prototype = original.prototype;
        Value.redefine(original.prototype, 'constructor', replacement);
    };

    var defaultSpeciesGetter = function () { return this; };
    var addDefaultSpecies = function (C) {
        if (supportsDescriptors && !_hasOwnProperty(C, symbolSpecies)) {
            Value.getter(C, symbolSpecies, defaultSpeciesGetter);
        }
    };

    var addIterator = function (prototype, impl) {
        var implementation = impl || function iterator() { return this; };
        defineProperty(prototype, $iterator$, implementation);
        if (!prototype[$iterator$] && Type.symbol($iterator$)) {
            // implementations are buggy when $iterator$ is a Symbol
            prototype[$iterator$] = implementation;
        }
    };

    var createDataProperty = function createDataProperty(object, name, value) {
        if (supportsDescriptors) {
            Object.defineProperty(object, name, {
                configurable: true,
                enumerable: true,
                writable: true,
                value: value
            });
        } else {
            object[name] = value;
        }
    };
    var createDataPropertyOrThrow = function createDataPropertyOrThrow(object, name, value) {
        createDataProperty(object, name, value);
        if (!ES.SameValue(object[name], value)) {
            throw new TypeError('property is nonconfigurable');
        }
    };

    var emulateES6construct = function (o, defaultNewTarget, defaultProto, slots) {
        // This is an es5 approximation to es6 construct semantics.  in es6,
        // 'new Foo' invokes Foo.[[Construct]] which (for almost all objects)
        // just sets the internal variable NewTarget (in es6 syntax `new.target`)
        // to Foo and then returns Foo().

        // Many ES6 object then have constructors of the form:
        // 1. If NewTarget is undefined, throw a TypeError exception
        // 2. Let xxx by OrdinaryCreateFromConstructor(NewTarget, yyy, zzz)

        // So we're going to emulate those first two steps.
        if (!ES.TypeIsObject(o)) {
            throw new TypeError('Constructor requires `new`: ' + defaultNewTarget.name);
        }
        var proto = defaultNewTarget.prototype;
        if (!ES.TypeIsObject(proto)) {
            proto = defaultProto;
        }
        var obj = create(proto);
        for (var name in slots) {
            if (_hasOwnProperty(slots, name)) {
                var value = slots[name];
                defineProperty(obj, name, value, true);
            }
        }
        return obj;
    };

    // Firefox 31 reports this function's length as 0
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1062484
    if (String.fromCodePoint && String.fromCodePoint.length !== 1) {
        var originalFromCodePoint = String.fromCodePoint;
        overrideNative(String, 'fromCodePoint', function fromCodePoint(codePoints) {
            return ES.Call(originalFromCodePoint, this, arguments);
        });
    }

    var StringShims = {
        fromCodePoint: function fromCodePoint(codePoints) {
            var result = [];
            var next;
            for (var i = 0, length = arguments.length; i < length; i++) {
                next = Number(arguments[i]);
                if (!ES.SameValue(next, ES.ToInteger(next)) || next < 0 || next > 0x10FFFF) {
                    throw new RangeError('Invalid code point ' + next);
                }

                if (next < 0x10000) {
                    _push(result, String.fromCharCode(next));
                } else {
                    next -= 0x10000;
                    _push(result, String.fromCharCode((next >> 10) + 0xD800));
                    _push(result, String.fromCharCode((next % 0x400) + 0xDC00));
                }
            }
            return result.join('');
        },

        raw: function raw(callSite) {
            var cooked = ES.ToObject(callSite, 'bad callSite');
            var rawString = ES.ToObject(cooked.raw, 'bad raw value');
            var len = rawString.length;
            var literalsegments = ES.ToLength(len);
            if (literalsegments <= 0) {
                return '';
            }

            var stringElements = [];
            var nextIndex = 0;
            var nextKey, next, nextSeg, nextSub;
            while (nextIndex < literalsegments) {
                nextKey = ES.ToString(nextIndex);
                nextSeg = ES.ToString(rawString[nextKey]);
                _push(stringElements, nextSeg);
                if (nextIndex + 1 >= literalsegments) {
                    break;
                }
                next = nextIndex + 1 < arguments.length ? arguments[nextIndex + 1] : '';
                nextSub = ES.ToString(next);
                _push(stringElements, nextSub);
                nextIndex += 1;
            }
            return stringElements.join('');
        }
    };
    if (String.raw && String.raw({ raw: { 0: 'x', 1: 'y', length: 2 } }) !== 'xy') {
        // IE 11 TP has a broken String.raw implementation
        overrideNative(String, 'raw', StringShims.raw);
    }
    defineProperties(String, StringShims);

    // Fast repeat, uses the `Exponentiation by squaring` algorithm.
    // Perf: http://jsperf.com/string-repeat2/2
    var stringRepeat = function repeat(s, times) {
        if (times < 1) { return ''; }
        if (times % 2) { return repeat(s, times - 1) + s; }
        var half = repeat(s, times / 2);
        return half + half;
    };
    var stringMaxLength = Infinity;

    var StringPrototypeShims = {
        repeat: function repeat(times) {
            var thisStr = ES.ToString(ES.RequireObjectCoercible(this));
            var numTimes = ES.ToInteger(times);
            if (numTimes < 0 || numTimes >= stringMaxLength) {
                throw new RangeError('repeat count must be less than infinity and not overflow maximum string size');
            }
            return stringRepeat(thisStr, numTimes);
        },

        startsWith: function startsWith(searchString) {
            var S = ES.ToString(ES.RequireObjectCoercible(this));
            if (ES.IsRegExp(searchString)) {
                throw new TypeError('Cannot call method "startsWith" with a regex');
            }
            var searchStr = ES.ToString(searchString);
            var position;
            if (arguments.length > 1) {
                position = arguments[1];
            }
            var start = _max(ES.ToInteger(position), 0);
            return _strSlice(S, start, start + searchStr.length) === searchStr;
        },

        endsWith: function endsWith(searchString) {
            var S = ES.ToString(ES.RequireObjectCoercible(this));
            if (ES.IsRegExp(searchString)) {
                throw new TypeError('Cannot call method "endsWith" with a regex');
            }
            var searchStr = ES.ToString(searchString);
            var len = S.length;
            var endPosition;
            if (arguments.length > 1) {
                endPosition = arguments[1];
            }
            var pos = typeof endPosition === 'undefined' ? len : ES.ToInteger(endPosition);
            var end = _min(_max(pos, 0), len);
            return _strSlice(S, end - searchStr.length, end) === searchStr;
        },

        includes: function includes(searchString) {
            if (ES.IsRegExp(searchString)) {
                throw new TypeError('"includes" does not accept a RegExp');
            }
            var searchStr = ES.ToString(searchString);
            var position;
            if (arguments.length > 1) {
                position = arguments[1];
            }
            // Somehow this trick makes method 100% compat with the spec.
            return _indexOf(this, searchStr, position) !== -1;
        },

        codePointAt: function codePointAt(pos) {
            var thisStr = ES.ToString(ES.RequireObjectCoercible(this));
            var position = ES.ToInteger(pos);
            var length = thisStr.length;
            if (position >= 0 && position < length) {
                var first = thisStr.charCodeAt(position);
                var isEnd = position + 1 === length;
                if (first < 0xD800 || first > 0xDBFF || isEnd) { return first; }
                var second = thisStr.charCodeAt(position + 1);
                if (second < 0xDC00 || second > 0xDFFF) { return first; }
                return ((first - 0xD800) * 1024) + (second - 0xDC00) + 0x10000;
            }
        }
    };
    if (String.prototype.includes && 'a'.includes('a', Infinity) !== false) {
        overrideNative(String.prototype, 'includes', StringPrototypeShims.includes);
    }

    if (String.prototype.startsWith && String.prototype.endsWith) {
        var startsWithRejectsRegex = throwsError(function () {
            /* throws if spec-compliant */
            '/a/'.startsWith(/a/);
        });
        var startsWithHandlesInfinity = valueOrFalseIfThrows(function () {
            return 'abc'.startsWith('a', Infinity) === false;
        });
        if (!startsWithRejectsRegex || !startsWithHandlesInfinity) {
            // Firefox (< 37?) and IE 11 TP have a noncompliant startsWith implementation
            overrideNative(String.prototype, 'startsWith', StringPrototypeShims.startsWith);
            overrideNative(String.prototype, 'endsWith', StringPrototypeShims.endsWith);
        }
    }
    if (hasSymbols) {
        var startsWithSupportsSymbolMatch = valueOrFalseIfThrows(function () {
            var re = /a/;
            re[Symbol.match] = false;
            return '/a/'.startsWith(re);
        });
        if (!startsWithSupportsSymbolMatch) {
            overrideNative(String.prototype, 'startsWith', StringPrototypeShims.startsWith);
        }
        var endsWithSupportsSymbolMatch = valueOrFalseIfThrows(function () {
            var re = /a/;
            re[Symbol.match] = false;
            return '/a/'.endsWith(re);
        });
        if (!endsWithSupportsSymbolMatch) {
            overrideNative(String.prototype, 'endsWith', StringPrototypeShims.endsWith);
        }
        var includesSupportsSymbolMatch = valueOrFalseIfThrows(function () {
            var re = /a/;
            re[Symbol.match] = false;
            return '/a/'.includes(re);
        });
        if (!includesSupportsSymbolMatch) {
            overrideNative(String.prototype, 'includes', StringPrototypeShims.includes);
        }
    }

    defineProperties(String.prototype, StringPrototypeShims);

    // whitespace from: http://es5.github.io/#x15.5.4.20
    // implementation from https://github.com/es-shims/es5-shim/blob/v3.4.0/es5-shim.js#L1304-L1324
    var ws = [
        '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003',
        '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028',
        '\u2029\uFEFF'
    ].join('');
    var trimRegexp = new RegExp('(^[' + ws + ']+)|([' + ws + ']+$)', 'g');
    var trimShim = function trim() {
        return ES.ToString(ES.RequireObjectCoercible(this)).replace(trimRegexp, '');
    };
    var nonWS = ['\u0085', '\u200b', '\ufffe'].join('');
    var nonWSregex = new RegExp('[' + nonWS + ']', 'g');
    var isBadHexRegex = /^[\-+]0x[0-9a-f]+$/i;
    var hasStringTrimBug = nonWS.trim().length !== nonWS.length;
    defineProperty(String.prototype, 'trim', trimShim, hasStringTrimBug);

    // Given an argument x, it will return an IteratorResult object,
    // with value set to x and done to false.
    // Given no arguments, it will return an iterator completion object.
    var iteratorResult = function (x) {
        return { value: x, done: arguments.length === 0 };
    };

    // see http://www.ecma-international.org/ecma-262/6.0/#sec-string.prototype-@@iterator
    var StringIterator = function (s) {
        ES.RequireObjectCoercible(s);
        this._s = ES.ToString(s);
        this._i = 0;
    };
    StringIterator.prototype.next = function () {
        var s = this._s;
        var i = this._i;
        if (typeof s === 'undefined' || i >= s.length) {
            this._s = void 0;
            return iteratorResult();
        }
        var first = s.charCodeAt(i);
        var second, len;
        if (first < 0xD800 || first > 0xDBFF || (i + 1) === s.length) {
            len = 1;
        } else {
            second = s.charCodeAt(i + 1);
            len = (second < 0xDC00 || second > 0xDFFF) ? 1 : 2;
        }
        this._i = i + len;
        return iteratorResult(s.substr(i, len));
    };
    addIterator(StringIterator.prototype);
    addIterator(String.prototype, function () {
        return new StringIterator(this);
    });

    var ArrayShims = {
        from: function from(items) {
            var C = this;
            var mapFn;
            if (arguments.length > 1) {
                mapFn = arguments[1];
            }
            var mapping, T;
            if (typeof mapFn === 'undefined') {
                mapping = false;
            } else {
                if (!ES.IsCallable(mapFn)) {
                    throw new TypeError('Array.from: when provided, the second argument must be a function');
                }
                if (arguments.length > 2) {
                    T = arguments[2];
                }
                mapping = true;
            }

            // Note that that Arrays will use ArrayIterator:
            // https://bugs.ecmascript.org/show_bug.cgi?id=2416
            var usingIterator = typeof (isArguments(items) || ES.GetMethod(items, $iterator$)) !== 'undefined';

            var length, result, i;
            if (usingIterator) {
                result = ES.IsConstructor(C) ? Object(new C()) : [];
                var iterator = ES.GetIterator(items);
                var next, nextValue;

                i = 0;
                while (true) {
                    next = ES.IteratorStep(iterator);
                    if (next === false) {
                        break;
                    }
                    nextValue = next.value;
                    try {
                        if (mapping) {
                            nextValue = typeof T === 'undefined' ? mapFn(nextValue, i) : _call(mapFn, T, nextValue, i);
                        }
                        result[i] = nextValue;
                    } catch (e) {
                        ES.IteratorClose(iterator, true);
                        throw e;
                    }
                    i += 1;
                }
                length = i;
            } else {
                var arrayLike = ES.ToObject(items);
                length = ES.ToLength(arrayLike.length);
                result = ES.IsConstructor(C) ? Object(new C(length)) : new Array(length);
                var value;
                for (i = 0; i < length; ++i) {
                    value = arrayLike[i];
                    if (mapping) {
                        value = typeof T === 'undefined' ? mapFn(value, i) : _call(mapFn, T, value, i);
                    }
                    createDataPropertyOrThrow(result, i, value);
                }
            }

            result.length = length;
            return result;
        },

        of: function of() {
            var len = arguments.length;
            var C = this;
            var A = isArray(C) || !ES.IsCallable(C) ? new Array(len) : ES.Construct(C, [len]);
            for (var k = 0; k < len; ++k) {
                createDataPropertyOrThrow(A, k, arguments[k]);
            }
            A.length = len;
            return A;
        }
    };
    defineProperties(Array, ArrayShims);
    addDefaultSpecies(Array);

    // Our ArrayIterator is private; see
    // https://github.com/paulmillr/es6-shim/issues/252
    ArrayIterator = function (array, kind) {
        this.i = 0;
        this.array = array;
        this.kind = kind;
    };

    defineProperties(ArrayIterator.prototype, {
        next: function () {
            var i = this.i;
            var array = this.array;
            if (!(this instanceof ArrayIterator)) {
                throw new TypeError('Not an ArrayIterator');
            }
            if (typeof array !== 'undefined') {
                var len = ES.ToLength(array.length);
                for (; i < len; i++) {
                    var kind = this.kind;
                    var retval;
                    if (kind === 'key') {
                        retval = i;
                    } else if (kind === 'value') {
                        retval = array[i];
                    } else if (kind === 'entry') {
                        retval = [i, array[i]];
                    }
                    this.i = i + 1;
                    return iteratorResult(retval);
                }
            }
            this.array = void 0;
            return iteratorResult();
        }
    });
    addIterator(ArrayIterator.prototype);

    /*
     var orderKeys = function orderKeys(a, b) {
     var aNumeric = String(ES.ToInteger(a)) === a;
     var bNumeric = String(ES.ToInteger(b)) === b;
     if (aNumeric && bNumeric) {
     return b - a;
     } else if (aNumeric && !bNumeric) {
     return -1;
     } else if (!aNumeric && bNumeric) {
     return 1;
     } else {
     return a.localeCompare(b);
     }
     };

     var getAllKeys = function getAllKeys(object) {
     var ownKeys = [];
     var keys = [];

     for (var key in object) {
     _push(_hasOwnProperty(object, key) ? ownKeys : keys, key);
     }
     _sort(ownKeys, orderKeys);
     _sort(keys, orderKeys);

     return _concat(ownKeys, keys);
     };
     */

    // note: this is positioned here because it depends on ArrayIterator
    var arrayOfSupportsSubclassing = Array.of === ArrayShims.of || (function () {
            // Detects a bug in Webkit nightly r181886
            var Foo = function Foo(len) { this.length = len; };
            Foo.prototype = [];
            var fooArr = Array.of.apply(Foo, [1, 2]);
            return fooArr instanceof Foo && fooArr.length === 2;
        }());
    if (!arrayOfSupportsSubclassing) {
        overrideNative(Array, 'of', ArrayShims.of);
    }

    var ArrayPrototypeShims = {
        copyWithin: function copyWithin(target, start) {
            var o = ES.ToObject(this);
            var len = ES.ToLength(o.length);
            var relativeTarget = ES.ToInteger(target);
            var relativeStart = ES.ToInteger(start);
            var to = relativeTarget < 0 ? _max(len + relativeTarget, 0) : _min(relativeTarget, len);
            var from = relativeStart < 0 ? _max(len + relativeStart, 0) : _min(relativeStart, len);
            var end;
            if (arguments.length > 2) {
                end = arguments[2];
            }
            var relativeEnd = typeof end === 'undefined' ? len : ES.ToInteger(end);
            var finalItem = relativeEnd < 0 ? _max(len + relativeEnd, 0) : _min(relativeEnd, len);
            var count = _min(finalItem - from, len - to);
            var direction = 1;
            if (from < to && to < (from + count)) {
                direction = -1;
                from += count - 1;
                to += count - 1;
            }
            while (count > 0) {
                if (from in o) {
                    o[to] = o[from];
                } else {
                    delete o[to];
                }
                from += direction;
                to += direction;
                count -= 1;
            }
            return o;
        },

        fill: function fill(value) {
            var start;
            if (arguments.length > 1) {
                start = arguments[1];
            }
            var end;
            if (arguments.length > 2) {
                end = arguments[2];
            }
            var O = ES.ToObject(this);
            var len = ES.ToLength(O.length);
            start = ES.ToInteger(typeof start === 'undefined' ? 0 : start);
            end = ES.ToInteger(typeof end === 'undefined' ? len : end);

            var relativeStart = start < 0 ? _max(len + start, 0) : _min(start, len);
            var relativeEnd = end < 0 ? len + end : end;

            for (var i = relativeStart; i < len && i < relativeEnd; ++i) {
                O[i] = value;
            }
            return O;
        },

        find: function find(predicate) {
            var list = ES.ToObject(this);
            var length = ES.ToLength(list.length);
            if (!ES.IsCallable(predicate)) {
                throw new TypeError('Array#find: predicate must be a function');
            }
            var thisArg = arguments.length > 1 ? arguments[1] : null;
            for (var i = 0, value; i < length; i++) {
                value = list[i];
                if (thisArg) {
                    if (_call(predicate, thisArg, value, i, list)) {
                        return value;
                    }
                } else if (predicate(value, i, list)) {
                    return value;
                }
            }
        },

        findIndex: function findIndex(predicate) {
            var list = ES.ToObject(this);
            var length = ES.ToLength(list.length);
            if (!ES.IsCallable(predicate)) {
                throw new TypeError('Array#findIndex: predicate must be a function');
            }
            var thisArg = arguments.length > 1 ? arguments[1] : null;
            for (var i = 0; i < length; i++) {
                if (thisArg) {
                    if (_call(predicate, thisArg, list[i], i, list)) {
                        return i;
                    }
                } else if (predicate(list[i], i, list)) {
                    return i;
                }
            }
            return -1;
        },

        keys: function keys() {
            return new ArrayIterator(this, 'key');
        },

        values: function values() {
            return new ArrayIterator(this, 'value');
        },

        entries: function entries() {
            return new ArrayIterator(this, 'entry');
        }
    };
    // Safari 7.1 defines Array#keys and Array#entries natively,
    // but the resulting ArrayIterator objects don't have a "next" method.
    if (Array.prototype.keys && !ES.IsCallable([1].keys().next)) {
        delete Array.prototype.keys;
    }
    if (Array.prototype.entries && !ES.IsCallable([1].entries().next)) {
        delete Array.prototype.entries;
    }

    // Chrome 38 defines Array#keys and Array#entries, and Array#@@iterator, but not Array#values
    if (Array.prototype.keys && Array.prototype.entries && !Array.prototype.values && Array.prototype[$iterator$]) {
        defineProperties(Array.prototype, {
            values: Array.prototype[$iterator$]
        });
        if (Type.symbol(Symbol.unscopables)) {
            Array.prototype[Symbol.unscopables].values = true;
        }
    }
    // Chrome 40 defines Array#values with the incorrect name, although Array#{keys,entries} have the correct name
    if (functionsHaveNames && Array.prototype.values && Array.prototype.values.name !== 'values') {
        var originalArrayPrototypeValues = Array.prototype.values;
        overrideNative(Array.prototype, 'values', function values() { return ES.Call(originalArrayPrototypeValues, this, arguments); });
        defineProperty(Array.prototype, $iterator$, Array.prototype.values, true);
    }
    defineProperties(Array.prototype, ArrayPrototypeShims);

    if (1 / [true].indexOf(true, -0) < 0) {
        // indexOf when given a position arg of -0 should return +0.
        // https://github.com/tc39/ecma262/pull/316
        defineProperty(Array.prototype, 'indexOf', function indexOf(searchElement) {
            var value = _arrayIndexOfApply(this, arguments);
            if (value === 0 && (1 / value) < 0) {
                return 0;
            }
            return value;
        }, true);
    }

    addIterator(Array.prototype, function () { return this.values(); });
    // Chrome defines keys/values/entries on Array, but doesn't give us
    // any way to identify its iterator.  So add our own shimmed field.
    if (Object.getPrototypeOf) {
        addIterator(Object.getPrototypeOf([].values()));
    }

    // note: this is positioned here because it relies on Array#entries
    var arrayFromSwallowsNegativeLengths = (function () {
        // Detects a Firefox bug in v32
        // https://bugzilla.mozilla.org/show_bug.cgi?id=1063993
        return valueOrFalseIfThrows(function () {
            return Array.from({ length: -1 }).length === 0;
        });
    }());
    var arrayFromHandlesIterables = (function () {
        // Detects a bug in Webkit nightly r181886
        var arr = Array.from([0].entries());
        return arr.length === 1 && isArray(arr[0]) && arr[0][0] === 0 && arr[0][1] === 0;
    }());
    if (!arrayFromSwallowsNegativeLengths || !arrayFromHandlesIterables) {
        overrideNative(Array, 'from', ArrayShims.from);
    }
    var arrayFromHandlesUndefinedMapFunction = (function () {
        // Microsoft Edge v0.11 throws if the mapFn argument is *provided* but undefined,
        // but the spec doesn't care if it's provided or not - undefined doesn't throw.
        return valueOrFalseIfThrows(function () {
            return Array.from([0], void 0);
        });
    }());
    if (!arrayFromHandlesUndefinedMapFunction) {
        var origArrayFrom = Array.from;
        overrideNative(Array, 'from', function from(items) {
            if (arguments.length > 1 && typeof arguments[1] !== 'undefined') {
                return ES.Call(origArrayFrom, this, arguments);
            } else {
                return _call(origArrayFrom, this, items);
            }
        });
    }

    var int32sAsOne = -(Math.pow(2, 32) - 1);
    var toLengthsCorrectly = function (method, reversed) {
        var obj = { length: int32sAsOne };
        obj[reversed ? (obj.length >>> 0) - 1 : 0] = true;
        return valueOrFalseIfThrows(function () {
            _call(method, obj, function () {
                // note: in nonconforming browsers, this will be called
                // -1 >>> 0 times, which is 4294967295, so the throw matters.
                throw new RangeError('should not reach here');
            }, []);
            return true;
        });
    };
    if (!toLengthsCorrectly(Array.prototype.forEach)) {
        var originalForEach = Array.prototype.forEach;
        overrideNative(Array.prototype, 'forEach', function forEach(callbackFn) {
            return ES.Call(originalForEach, this.length >= 0 ? this : [], arguments);
        }, true);
    }
    if (!toLengthsCorrectly(Array.prototype.map)) {
        var originalMap = Array.prototype.map;
        overrideNative(Array.prototype, 'map', function map(callbackFn) {
            return ES.Call(originalMap, this.length >= 0 ? this : [], arguments);
        }, true);
    }
    if (!toLengthsCorrectly(Array.prototype.filter)) {
        var originalFilter = Array.prototype.filter;
        overrideNative(Array.prototype, 'filter', function filter(callbackFn) {
            return ES.Call(originalFilter, this.length >= 0 ? this : [], arguments);
        }, true);
    }
    if (!toLengthsCorrectly(Array.prototype.some)) {
        var originalSome = Array.prototype.some;
        overrideNative(Array.prototype, 'some', function some(callbackFn) {
            return ES.Call(originalSome, this.length >= 0 ? this : [], arguments);
        }, true);
    }
    if (!toLengthsCorrectly(Array.prototype.every)) {
        var originalEvery = Array.prototype.every;
        overrideNative(Array.prototype, 'every', function every(callbackFn) {
            return ES.Call(originalEvery, this.length >= 0 ? this : [], arguments);
        }, true);
    }
    if (!toLengthsCorrectly(Array.prototype.reduce)) {
        var originalReduce = Array.prototype.reduce;
        overrideNative(Array.prototype, 'reduce', function reduce(callbackFn) {
            return ES.Call(originalReduce, this.length >= 0 ? this : [], arguments);
        }, true);
    }
    if (!toLengthsCorrectly(Array.prototype.reduceRight, true)) {
        var originalReduceRight = Array.prototype.reduceRight;
        overrideNative(Array.prototype, 'reduceRight', function reduceRight(callbackFn) {
            return ES.Call(originalReduceRight, this.length >= 0 ? this : [], arguments);
        }, true);
    }

    var lacksOctalSupport = Number('0o10') !== 8;
    var lacksBinarySupport = Number('0b10') !== 2;
    var trimsNonWhitespace = _some(nonWS, function (c) {
        return Number(c + 0 + c) === 0;
    });
    if (lacksOctalSupport || lacksBinarySupport || trimsNonWhitespace) {
        var OrigNumber = Number;
        var binaryRegex = /^0b[01]+$/i;
        var octalRegex = /^0o[0-7]+$/i;
        // Note that in IE 8, RegExp.prototype.test doesn't seem to exist: ie, "test" is an own property of regexes. wtf.
        var isBinary = binaryRegex.test.bind(binaryRegex);
        var isOctal = octalRegex.test.bind(octalRegex);
        var toPrimitive = function (O) { // need to replace this with `es-to-primitive/es6`
            var result;
            if (typeof O.valueOf === 'function') {
                result = O.valueOf();
                if (Type.primitive(result)) {
                    return result;
                }
            }
            if (typeof O.toString === 'function') {
                result = O.toString();
                if (Type.primitive(result)) {
                    return result;
                }
            }
            throw new TypeError('No default value');
        };
        var hasNonWS = nonWSregex.test.bind(nonWSregex);
        var isBadHex = isBadHexRegex.test.bind(isBadHexRegex);
        var NumberShim = (function () {
            // this is wrapped in an IIFE because of IE 6-8's wacky scoping issues with named function expressions.
            var NumberShim = function Number(value) {
                var primValue;
                if (arguments.length > 0) {
                    primValue = Type.primitive(value) ? value : toPrimitive(value, 'number');
                } else {
                    primValue = 0;
                }
                if (typeof primValue === 'string') {
                    primValue = ES.Call(trimShim, primValue);
                    if (isBinary(primValue)) {
                        primValue = parseInt(_strSlice(primValue, 2), 2);
                    } else if (isOctal(primValue)) {
                        primValue = parseInt(_strSlice(primValue, 2), 8);
                    } else if (hasNonWS(primValue) || isBadHex(primValue)) {
                        primValue = NaN;
                    }
                }
                var receiver = this;
                var valueOfSucceeds = valueOrFalseIfThrows(function () {
                    OrigNumber.prototype.valueOf.call(receiver);
                    return true;
                });
                if (receiver instanceof NumberShim && !valueOfSucceeds) {
                    return new OrigNumber(primValue);
                }
                /* jshint newcap: false */
                return OrigNumber(primValue);
                /* jshint newcap: true */
            };
            return NumberShim;
        }());
        wrapConstructor(OrigNumber, NumberShim, {});
        // this is necessary for ES3 browsers, where these properties are non-enumerable.
        defineProperties(NumberShim, {
            NaN: OrigNumber.NaN,
            MAX_VALUE: OrigNumber.MAX_VALUE,
            MIN_VALUE: OrigNumber.MIN_VALUE,
            NEGATIVE_INFINITY: OrigNumber.NEGATIVE_INFINITY,
            POSITIVE_INFINITY: OrigNumber.POSITIVE_INFINITY
        });
        /* globals Number: true */
        /* eslint-disable no-undef */
        /* jshint -W020 */
        Number = NumberShim;
        Value.redefine(globals, 'Number', NumberShim);
        /* jshint +W020 */
        /* eslint-enable no-undef */
        /* globals Number: false */
    }

    var maxSafeInteger = Math.pow(2, 53) - 1;
    defineProperties(Number, {
        MAX_SAFE_INTEGER: maxSafeInteger,
        MIN_SAFE_INTEGER: -maxSafeInteger,
        EPSILON: 2.220446049250313e-16,

        parseInt: globals.parseInt,
        parseFloat: globals.parseFloat,

        isFinite: numberIsFinite,

        isInteger: function isInteger(value) {
            return numberIsFinite(value) && ES.ToInteger(value) === value;
        },

        isSafeInteger: function isSafeInteger(value) {
            return Number.isInteger(value) && _abs(value) <= Number.MAX_SAFE_INTEGER;
        },

        isNaN: numberIsNaN
    });
    // Firefox 37 has a conforming Number.parseInt, but it's not === to the global parseInt (fixed in v40)
    defineProperty(Number, 'parseInt', globals.parseInt, Number.parseInt !== globals.parseInt);

    // Work around bugs in Array#find and Array#findIndex -- early
    // implementations skipped holes in sparse arrays. (Note that the
    // implementations of find/findIndex indirectly use shimmed
    // methods of Number, so this test has to happen down here.)
    /*jshint elision: true */
    /* eslint-disable no-sparse-arrays */
    if (![, 1].find(function (item, idx) { return idx === 0; })) {
        overrideNative(Array.prototype, 'find', ArrayPrototypeShims.find);
    }
    if ([, 1].findIndex(function (item, idx) { return idx === 0; }) !== 0) {
        overrideNative(Array.prototype, 'findIndex', ArrayPrototypeShims.findIndex);
    }
    /* eslint-enable no-sparse-arrays */
    /*jshint elision: false */

    var isEnumerableOn = Function.bind.call(Function.bind, Object.prototype.propertyIsEnumerable);
    var ensureEnumerable = function ensureEnumerable(obj, prop) {
        if (supportsDescriptors && isEnumerableOn(obj, prop)) {
            Object.defineProperty(obj, prop, { enumerable: false });
        }
    };
    var sliceArgs = function sliceArgs() {
        // per https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#32-leaking-arguments
        // and https://gist.github.com/WebReflection/4327762cb87a8c634a29
        var initial = Number(this);
        var len = arguments.length;
        var desiredArgCount = len - initial;
        var args = new Array(desiredArgCount < 0 ? 0 : desiredArgCount);
        for (var i = initial; i < len; ++i) {
            args[i - initial] = arguments[i];
        }
        return args;
    };
    var assignTo = function assignTo(source) {
        return function assignToSource(target, key) {
            target[key] = source[key];
            return target;
        };
    };
    var assignReducer = function (target, source) {
        var sourceKeys = keys(Object(source));
        var symbols;
        if (ES.IsCallable(Object.getOwnPropertySymbols)) {
            symbols = _filter(Object.getOwnPropertySymbols(Object(source)), isEnumerableOn(source));
        }
        return _reduce(_concat(sourceKeys, symbols || []), assignTo(source), target);
    };

    var ObjectShims = {
        // 19.1.3.1
        assign: function (target, source) {
            var to = ES.ToObject(target, 'Cannot convert undefined or null to object');
            return _reduce(ES.Call(sliceArgs, 1, arguments), assignReducer, to);
        },

        // Added in WebKit in https://bugs.webkit.org/show_bug.cgi?id=143865
        is: function is(a, b) {
            return ES.SameValue(a, b);
        }
    };
    var assignHasPendingExceptions = Object.assign && Object.preventExtensions && (function () {
            // Firefox 37 still has "pending exception" logic in its Object.assign implementation,
            // which is 72% slower than our shim, and Firefox 40's native implementation.
            var thrower = Object.preventExtensions({ 1: 2 });
            try {
                Object.assign(thrower, 'xy');
            } catch (e) {
                return thrower[1] === 'y';
            }
        }());
    if (assignHasPendingExceptions) {
        overrideNative(Object, 'assign', ObjectShims.assign);
    }
    defineProperties(Object, ObjectShims);

    if (supportsDescriptors) {
        var ES5ObjectShims = {
            // 19.1.3.9
            // shim from https://gist.github.com/WebReflection/5593554
            setPrototypeOf: (function (Object, magic) {
                var set;

                var checkArgs = function (O, proto) {
                    if (!ES.TypeIsObject(O)) {
                        throw new TypeError('cannot set prototype on a non-object');
                    }
                    if (!(proto === null || ES.TypeIsObject(proto))) {
                        throw new TypeError('can only set prototype to an object or null' + proto);
                    }
                };

                var setPrototypeOf = function (O, proto) {
                    checkArgs(O, proto);
                    _call(set, O, proto);
                    return O;
                };

                try {
                    // this works already in Firefox and Safari
                    set = Object.getOwnPropertyDescriptor(Object.prototype, magic).set;
                    _call(set, {}, null);
                } catch (e) {
                    if (Object.prototype !== {}[magic]) {
                        // IE < 11 cannot be shimmed
                        return;
                    }
                    // probably Chrome or some old Mobile stock browser
                    set = function (proto) {
                        this[magic] = proto;
                    };
                    // please note that this will **not** work
                    // in those browsers that do not inherit
                    // __proto__ by mistake from Object.prototype
                    // in these cases we should probably throw an error
                    // or at least be informed about the issue
                    setPrototypeOf.polyfill = setPrototypeOf(
                            setPrototypeOf({}, null),
                            Object.prototype
                        ) instanceof Object;
                    // setPrototypeOf.polyfill === true means it works as meant
                    // setPrototypeOf.polyfill === false means it's not 100% reliable
                    // setPrototypeOf.polyfill === undefined
                    // or
                    // setPrototypeOf.polyfill ==  null means it's not a polyfill
                    // which means it works as expected
                    // we can even delete Object.prototype.__proto__;
                }
                return setPrototypeOf;
            }(Object, '__proto__'))
        };

        defineProperties(Object, ES5ObjectShims);
    }

    // Workaround bug in Opera 12 where setPrototypeOf(x, null) doesn't work,
    // but Object.create(null) does.
    if (Object.setPrototypeOf && Object.getPrototypeOf &&
        Object.getPrototypeOf(Object.setPrototypeOf({}, null)) !== null &&
        Object.getPrototypeOf(Object.create(null)) === null) {
        (function () {
            var FAKENULL = Object.create(null);
            var gpo = Object.getPrototypeOf;
            var spo = Object.setPrototypeOf;
            Object.getPrototypeOf = function (o) {
                var result = gpo(o);
                return result === FAKENULL ? null : result;
            };
            Object.setPrototypeOf = function (o, p) {
                var proto = p === null ? FAKENULL : p;
                return spo(o, proto);
            };
            Object.setPrototypeOf.polyfill = false;
        }());
    }

    var objectKeysAcceptsPrimitives = !throwsError(function () { Object.keys('foo'); });
    if (!objectKeysAcceptsPrimitives) {
        var originalObjectKeys = Object.keys;
        overrideNative(Object, 'keys', function keys(value) {
            return originalObjectKeys(ES.ToObject(value));
        });
        keys = Object.keys;
    }
    var objectKeysRejectsRegex = throwsError(function () { Object.keys(/a/g); });
    if (objectKeysRejectsRegex) {
        var regexRejectingObjectKeys = Object.keys;
        overrideNative(Object, 'keys', function keys(value) {
            if (Type.regex(value)) {
                var regexKeys = [];
                for (var k in value) {
                    if (_hasOwnProperty(value, k)) {
                        _push(regexKeys, k);
                    }
                }
                return regexKeys;
            }
            return regexRejectingObjectKeys(value);
        });
        keys = Object.keys;
    }

    if (Object.getOwnPropertyNames) {
        var objectGOPNAcceptsPrimitives = !throwsError(function () { Object.getOwnPropertyNames('foo'); });
        if (!objectGOPNAcceptsPrimitives) {
            var cachedWindowNames = typeof window === 'object' ? Object.getOwnPropertyNames(window) : [];
            var originalObjectGetOwnPropertyNames = Object.getOwnPropertyNames;
            overrideNative(Object, 'getOwnPropertyNames', function getOwnPropertyNames(value) {
                var val = ES.ToObject(value);
                if (_toString(val) === '[object Window]') {
                    try {
                        return originalObjectGetOwnPropertyNames(val);
                    } catch (e) {
                        // IE bug where layout engine calls userland gOPN for cross-domain `window` objects
                        return _concat([], cachedWindowNames);
                    }
                }
                return originalObjectGetOwnPropertyNames(val);
            });
        }
    }
    if (Object.getOwnPropertyDescriptor) {
        var objectGOPDAcceptsPrimitives = !throwsError(function () { Object.getOwnPropertyDescriptor('foo', 'bar'); });
        if (!objectGOPDAcceptsPrimitives) {
            var originalObjectGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
            overrideNative(Object, 'getOwnPropertyDescriptor', function getOwnPropertyDescriptor(value, property) {
                return originalObjectGetOwnPropertyDescriptor(ES.ToObject(value), property);
            });
        }
    }
    if (Object.seal) {
        var objectSealAcceptsPrimitives = !throwsError(function () { Object.seal('foo'); });
        if (!objectSealAcceptsPrimitives) {
            var originalObjectSeal = Object.seal;
            overrideNative(Object, 'seal', function seal(value) {
                if (!ES.TypeIsObject(value)) { return value; }
                return originalObjectSeal(value);
            });
        }
    }
    if (Object.isSealed) {
        var objectIsSealedAcceptsPrimitives = !throwsError(function () { Object.isSealed('foo'); });
        if (!objectIsSealedAcceptsPrimitives) {
            var originalObjectIsSealed = Object.isSealed;
            overrideNative(Object, 'isSealed', function isSealed(value) {
                if (!ES.TypeIsObject(value)) { return true; }
                return originalObjectIsSealed(value);
            });
        }
    }
    if (Object.freeze) {
        var objectFreezeAcceptsPrimitives = !throwsError(function () { Object.freeze('foo'); });
        if (!objectFreezeAcceptsPrimitives) {
            var originalObjectFreeze = Object.freeze;
            overrideNative(Object, 'freeze', function freeze(value) {
                if (!ES.TypeIsObject(value)) { return value; }
                return originalObjectFreeze(value);
            });
        }
    }
    if (Object.isFrozen) {
        var objectIsFrozenAcceptsPrimitives = !throwsError(function () { Object.isFrozen('foo'); });
        if (!objectIsFrozenAcceptsPrimitives) {
            var originalObjectIsFrozen = Object.isFrozen;
            overrideNative(Object, 'isFrozen', function isFrozen(value) {
                if (!ES.TypeIsObject(value)) { return true; }
                return originalObjectIsFrozen(value);
            });
        }
    }
    if (Object.preventExtensions) {
        var objectPreventExtensionsAcceptsPrimitives = !throwsError(function () { Object.preventExtensions('foo'); });
        if (!objectPreventExtensionsAcceptsPrimitives) {
            var originalObjectPreventExtensions = Object.preventExtensions;
            overrideNative(Object, 'preventExtensions', function preventExtensions(value) {
                if (!ES.TypeIsObject(value)) { return value; }
                return originalObjectPreventExtensions(value);
            });
        }
    }
    if (Object.isExtensible) {
        var objectIsExtensibleAcceptsPrimitives = !throwsError(function () { Object.isExtensible('foo'); });
        if (!objectIsExtensibleAcceptsPrimitives) {
            var originalObjectIsExtensible = Object.isExtensible;
            overrideNative(Object, 'isExtensible', function isExtensible(value) {
                if (!ES.TypeIsObject(value)) { return false; }
                return originalObjectIsExtensible(value);
            });
        }
    }
    if (Object.getPrototypeOf) {
        var objectGetProtoAcceptsPrimitives = !throwsError(function () { Object.getPrototypeOf('foo'); });
        if (!objectGetProtoAcceptsPrimitives) {
            var originalGetProto = Object.getPrototypeOf;
            overrideNative(Object, 'getPrototypeOf', function getPrototypeOf(value) {
                return originalGetProto(ES.ToObject(value));
            });
        }
    }

    var hasFlags = supportsDescriptors && (function () {
            var desc = Object.getOwnPropertyDescriptor(RegExp.prototype, 'flags');
            return desc && ES.IsCallable(desc.get);
        }());
    if (supportsDescriptors && !hasFlags) {
        var regExpFlagsGetter = function flags() {
            if (!ES.TypeIsObject(this)) {
                throw new TypeError('Method called on incompatible type: must be an object.');
            }
            var result = '';
            if (this.global) {
                result += 'g';
            }
            if (this.ignoreCase) {
                result += 'i';
            }
            if (this.multiline) {
                result += 'm';
            }
            if (this.unicode) {
                result += 'u';
            }
            if (this.sticky) {
                result += 'y';
            }
            return result;
        };

        Value.getter(RegExp.prototype, 'flags', regExpFlagsGetter);
    }

    var regExpSupportsFlagsWithRegex = supportsDescriptors && valueOrFalseIfThrows(function () {
            return String(new RegExp(/a/g, 'i')) === '/a/i';
        });
    var regExpNeedsToSupportSymbolMatch = hasSymbols && supportsDescriptors && (function () {
            // Edge 0.12 supports flags fully, but does not support Symbol.match
            var regex = /./;
            regex[Symbol.match] = false;
            return RegExp(regex) === regex;
        }());

    var regexToStringIsGeneric = valueOrFalseIfThrows(function () {
        return RegExp.prototype.toString.call({ source: 'abc' }) === '/abc/';
    });
    var regexToStringSupportsGenericFlags = regexToStringIsGeneric && valueOrFalseIfThrows(function () {
            return RegExp.prototype.toString.call({ source: 'a', flags: 'b' }) === '/a/b';
        });
    if (!regexToStringIsGeneric || !regexToStringSupportsGenericFlags) {
        var origRegExpToString = RegExp.prototype.toString;
        defineProperty(RegExp.prototype, 'toString', function toString() {
            var R = ES.RequireObjectCoercible(this);
            if (Type.regex(R)) {
                return _call(origRegExpToString, R);
            }
            var pattern = $String(R.source);
            var flags = $String(R.flags);
            return '/' + pattern + '/' + flags;
        }, true);
        Value.preserveToString(RegExp.prototype.toString, origRegExpToString);
    }

    if (supportsDescriptors && (!regExpSupportsFlagsWithRegex || regExpNeedsToSupportSymbolMatch)) {
        var flagsGetter = Object.getOwnPropertyDescriptor(RegExp.prototype, 'flags').get;
        var sourceDesc = Object.getOwnPropertyDescriptor(RegExp.prototype, 'source') || {};
        var legacySourceGetter = function () { return this.source; }; // prior to it being a getter, it's own + nonconfigurable
        var sourceGetter = ES.IsCallable(sourceDesc.get) ? sourceDesc.get : legacySourceGetter;

        var OrigRegExp = RegExp;
        var RegExpShim = (function () {
            return function RegExp(pattern, flags) {
                var patternIsRegExp = ES.IsRegExp(pattern);
                var calledWithNew = this instanceof RegExp;
                if (!calledWithNew && patternIsRegExp && typeof flags === 'undefined' && pattern.constructor === RegExp) {
                    return pattern;
                }

                var P = pattern;
                var F = flags;
                if (Type.regex(pattern)) {
                    P = ES.Call(sourceGetter, pattern);
                    F = typeof flags === 'undefined' ? ES.Call(flagsGetter, pattern) : flags;
                    return new RegExp(P, F);
                } else if (patternIsRegExp) {
                    P = pattern.source;
                    F = typeof flags === 'undefined' ? pattern.flags : flags;
                }
                return new OrigRegExp(pattern, flags);
            };
        }());
        wrapConstructor(OrigRegExp, RegExpShim, {
            $input: true // Chrome < v39 & Opera < 26 have a nonstandard "$input" property
        });
        /* globals RegExp: true */
        /* eslint-disable no-undef */
        /* jshint -W020 */
        RegExp = RegExpShim;
        Value.redefine(globals, 'RegExp', RegExpShim);
        /* jshint +W020 */
        /* eslint-enable no-undef */
        /* globals RegExp: false */
    }

    if (supportsDescriptors) {
        var regexGlobals = {
            input: '$_',
            lastMatch: '$&',
            lastParen: '$+',
            leftContext: '$`',
            rightContext: '$\''
        };
        _forEach(keys(regexGlobals), function (prop) {
            if (prop in RegExp && !(regexGlobals[prop] in RegExp)) {
                Value.getter(RegExp, regexGlobals[prop], function get() {
                    return RegExp[prop];
                });
            }
        });
    }
    addDefaultSpecies(RegExp);

    var inverseEpsilon = 1 / Number.EPSILON;
    var roundTiesToEven = function roundTiesToEven(n) {
        // Even though this reduces down to `return n`, it takes advantage of built-in rounding.
        return (n + inverseEpsilon) - inverseEpsilon;
    };
    var BINARY_32_EPSILON = Math.pow(2, -23);
    var BINARY_32_MAX_VALUE = Math.pow(2, 127) * (2 - BINARY_32_EPSILON);
    var BINARY_32_MIN_VALUE = Math.pow(2, -126);
    var E = Math.E;
    var LOG2E = Math.LOG2E;
    var LOG10E = Math.LOG10E;
    var numberCLZ = Number.prototype.clz;
    delete Number.prototype.clz; // Safari 8 has Number#clz

    var MathShims = {
        acosh: function acosh(value) {
            var x = Number(value);
            if (numberIsNaN(x) || value < 1) { return NaN; }
            if (x === 1) { return 0; }
            if (x === Infinity) { return x; }
            return _log(x / E + _sqrt(x + 1) * _sqrt(x - 1) / E) + 1;
        },

        asinh: function asinh(value) {
            var x = Number(value);
            if (x === 0 || !globalIsFinite(x)) {
                return x;
            }
            return x < 0 ? -asinh(-x) : _log(x + _sqrt(x * x + 1));
        },

        atanh: function atanh(value) {
            var x = Number(value);
            if (numberIsNaN(x) || x < -1 || x > 1) {
                return NaN;
            }
            if (x === -1) { return -Infinity; }
            if (x === 1) { return Infinity; }
            if (x === 0) { return x; }
            return 0.5 * _log((1 + x) / (1 - x));
        },

        cbrt: function cbrt(value) {
            var x = Number(value);
            if (x === 0) { return x; }
            var negate = x < 0;
            var result;
            if (negate) { x = -x; }
            if (x === Infinity) {
                result = Infinity;
            } else {
                result = _exp(_log(x) / 3);
                // from http://en.wikipedia.org/wiki/Cube_root#Numerical_methods
                result = (x / (result * result) + (2 * result)) / 3;
            }
            return negate ? -result : result;
        },

        clz32: function clz32(value) {
            // See https://bugs.ecmascript.org/show_bug.cgi?id=2465
            var x = Number(value);
            var number = ES.ToUint32(x);
            if (number === 0) {
                return 32;
            }
            return numberCLZ ? ES.Call(numberCLZ, number) : 31 - _floor(_log(number + 0.5) * LOG2E);
        },

        cosh: function cosh(value) {
            var x = Number(value);
            if (x === 0) { return 1; } // +0 or -0
            if (numberIsNaN(x)) { return NaN; }
            if (!globalIsFinite(x)) { return Infinity; }
            if (x < 0) { x = -x; }
            if (x > 21) { return _exp(x) / 2; }
            return (_exp(x) + _exp(-x)) / 2;
        },

        expm1: function expm1(value) {
            var x = Number(value);
            if (x === -Infinity) { return -1; }
            if (!globalIsFinite(x) || x === 0) { return x; }
            if (_abs(x) > 0.5) {
                return _exp(x) - 1;
            }
            // A more precise approximation using Taylor series expansion
            // from https://github.com/paulmillr/es6-shim/issues/314#issuecomment-70293986
            var t = x;
            var sum = 0;
            var n = 1;
            while (sum + t !== sum) {
                sum += t;
                n += 1;
                t *= x / n;
            }
            return sum;
        },

        hypot: function hypot(x, y) {
            var result = 0;
            var largest = 0;
            for (var i = 0; i < arguments.length; ++i) {
                var value = _abs(Number(arguments[i]));
                if (largest < value) {
                    result *= (largest / value) * (largest / value);
                    result += 1;
                    largest = value;
                } else {
                    result += value > 0 ? (value / largest) * (value / largest) : value;
                }
            }
            return largest === Infinity ? Infinity : largest * _sqrt(result);
        },

        log2: function log2(value) {
            return _log(value) * LOG2E;
        },

        log10: function log10(value) {
            return _log(value) * LOG10E;
        },

        log1p: function log1p(value) {
            var x = Number(value);
            if (x < -1 || numberIsNaN(x)) { return NaN; }
            if (x === 0 || x === Infinity) { return x; }
            if (x === -1) { return -Infinity; }

            return (1 + x) - 1 === 0 ? x : x * (_log(1 + x) / ((1 + x) - 1));
        },

        sign: _sign,

        sinh: function sinh(value) {
            var x = Number(value);
            if (!globalIsFinite(x) || x === 0) { return x; }

            if (_abs(x) < 1) {
                return (Math.expm1(x) - Math.expm1(-x)) / 2;
            }
            return (_exp(x - 1) - _exp(-x - 1)) * E / 2;
        },

        tanh: function tanh(value) {
            var x = Number(value);
            if (numberIsNaN(x) || x === 0) { return x; }
            // can exit early at +-20 as JS loses precision for true value at this integer
            if (x >= 20) { return 1; }
            if (x <= -20) { return -1; }

            return (Math.expm1(x) - Math.expm1(-x)) / (_exp(x) + _exp(-x));
        },

        trunc: function trunc(value) {
            var x = Number(value);
            return x < 0 ? -_floor(-x) : _floor(x);
        },

        imul: function imul(x, y) {
            // taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/imul
            var a = ES.ToUint32(x);
            var b = ES.ToUint32(y);
            var ah = (a >>> 16) & 0xffff;
            var al = a & 0xffff;
            var bh = (b >>> 16) & 0xffff;
            var bl = b & 0xffff;
            // the shift by 0 fixes the sign on the high part
            // the final |0 converts the unsigned value into a signed value
            return (al * bl) + (((ah * bl + al * bh) << 16) >>> 0) | 0;
        },

        fround: function fround(x) {
            var v = Number(x);
            if (v === 0 || v === Infinity || v === -Infinity || numberIsNaN(v)) {
                return v;
            }
            var sign = _sign(v);
            var abs = _abs(v);
            if (abs < BINARY_32_MIN_VALUE) {
                return sign * roundTiesToEven(abs / BINARY_32_MIN_VALUE / BINARY_32_EPSILON) * BINARY_32_MIN_VALUE * BINARY_32_EPSILON;
            }
            // Veltkamp's splitting (?)
            var a = (1 + BINARY_32_EPSILON / Number.EPSILON) * abs;
            var result = a - (a - abs);
            if (result > BINARY_32_MAX_VALUE || numberIsNaN(result)) {
                return sign * Infinity;
            }
            return sign * result;
        }
    };
    defineProperties(Math, MathShims);
    // IE 11 TP has an imprecise log1p: reports Math.log1p(-1e-17) as 0
    defineProperty(Math, 'log1p', MathShims.log1p, Math.log1p(-1e-17) !== -1e-17);
    // IE 11 TP has an imprecise asinh: reports Math.asinh(-1e7) as not exactly equal to -Math.asinh(1e7)
    defineProperty(Math, 'asinh', MathShims.asinh, Math.asinh(-1e7) !== -Math.asinh(1e7));
    // Chrome 40 has an imprecise Math.tanh with very small numbers
    defineProperty(Math, 'tanh', MathShims.tanh, Math.tanh(-2e-17) !== -2e-17);
    // Chrome 40 loses Math.acosh precision with high numbers
    defineProperty(Math, 'acosh', MathShims.acosh, Math.acosh(Number.MAX_VALUE) === Infinity);
    // Firefox 38 on Windows
    defineProperty(Math, 'cbrt', MathShims.cbrt, Math.abs(1 - Math.cbrt(1e-300) / 1e-100) / Number.EPSILON > 8);
    // node 0.11 has an imprecise Math.sinh with very small numbers
    defineProperty(Math, 'sinh', MathShims.sinh, Math.sinh(-2e-17) !== -2e-17);
    // FF 35 on Linux reports 22025.465794806725 for Math.expm1(10)
    var expm1OfTen = Math.expm1(10);
    defineProperty(Math, 'expm1', MathShims.expm1, expm1OfTen > 22025.465794806719 || expm1OfTen < 22025.4657948067165168);

    var origMathRound = Math.round;
    // breaks in e.g. Safari 8, Internet Explorer 11, Opera 12
    var roundHandlesBoundaryConditions = Math.round(0.5 - Number.EPSILON / 4) === 0 && Math.round(-0.5 + Number.EPSILON / 3.99) === 1;

    // When engines use Math.floor(x + 0.5) internally, Math.round can be buggy for large integers.
    // This behavior should be governed by "round to nearest, ties to even mode"
    // see http://www.ecma-international.org/ecma-262/6.0/#sec-terms-and-definitions-number-type
    // These are the boundary cases where it breaks.
    var smallestPositiveNumberWhereRoundBreaks = inverseEpsilon + 1;
    var largestPositiveNumberWhereRoundBreaks = 2 * inverseEpsilon - 1;
    var roundDoesNotIncreaseIntegers = [smallestPositiveNumberWhereRoundBreaks, largestPositiveNumberWhereRoundBreaks].every(function (num) {
        return Math.round(num) === num;
    });
    defineProperty(Math, 'round', function round(x) {
        var floor = _floor(x);
        var ceil = floor === -1 ? -0 : floor + 1;
        return x - floor < 0.5 ? floor : ceil;
    }, !roundHandlesBoundaryConditions || !roundDoesNotIncreaseIntegers);
    Value.preserveToString(Math.round, origMathRound);

    var origImul = Math.imul;
    if (Math.imul(0xffffffff, 5) !== -5) {
        // Safari 6.1, at least, reports "0" for this value
        Math.imul = MathShims.imul;
        Value.preserveToString(Math.imul, origImul);
    }
    if (Math.imul.length !== 2) {
        // Safari 8.0.4 has a length of 1
        // fixed in https://bugs.webkit.org/show_bug.cgi?id=143658
        overrideNative(Math, 'imul', function imul(x, y) {
            return ES.Call(origImul, Math, arguments);
        });
    }

    // Promises
    // Simplest possible implementation; use a 3rd-party library if you
    // want the best possible speed and/or long stack traces.
    var PromiseShim = (function () {
        var setTimeout = globals.setTimeout;
        // some environments don't have setTimeout - no way to shim here.
        if (typeof setTimeout !== 'function' && typeof setTimeout !== 'object') { return; }

        ES.IsPromise = function (promise) {
            if (!ES.TypeIsObject(promise)) {
                return false;
            }
            if (typeof promise._promise === 'undefined') {
                return false; // uninitialized, or missing our hidden field.
            }
            return true;
        };

        // "PromiseCapability" in the spec is what most promise implementations
        // call a "deferred".
        var PromiseCapability = function (C) {
            if (!ES.IsConstructor(C)) {
                throw new TypeError('Bad promise constructor');
            }
            var capability = this;
            var resolver = function (resolve, reject) {
                if (capability.resolve !== void 0 || capability.reject !== void 0) {
                    throw new TypeError('Bad Promise implementation!');
                }
                capability.resolve = resolve;
                capability.reject = reject;
            };
            // Initialize fields to inform optimizers about the object shape.
            capability.resolve = void 0;
            capability.reject = void 0;
            capability.promise = new C(resolver);
            if (!(ES.IsCallable(capability.resolve) && ES.IsCallable(capability.reject))) {
                throw new TypeError('Bad promise constructor');
            }
        };

        // find an appropriate setImmediate-alike
        var makeZeroTimeout;
        /*global window */
        if (typeof window !== 'undefined' && ES.IsCallable(window.postMessage)) {
            makeZeroTimeout = function () {
                // from http://dbaron.org/log/20100309-faster-timeouts
                var timeouts = [];
                var messageName = 'zero-timeout-message';
                var setZeroTimeout = function (fn) {
                    _push(timeouts, fn);
                    window.postMessage(messageName, '*');
                };
                var handleMessage = function (event) {
                    if (event.source === window && event.data === messageName) {
                        event.stopPropagation();
                        if (timeouts.length === 0) { return; }
                        var fn = _shift(timeouts);
                        fn();
                    }
                };
                window.addEventListener('message', handleMessage, true);
                return setZeroTimeout;
            };
        }
        var makePromiseAsap = function () {
            // An efficient task-scheduler based on a pre-existing Promise
            // implementation, which we can use even if we override the
            // global Promise below (in order to workaround bugs)
            // https://github.com/Raynos/observ-hash/issues/2#issuecomment-35857671
            var P = globals.Promise;
            var pr = P && P.resolve && P.resolve();
            return pr && function (task) {
                    return pr.then(task);
                };
        };
        /*global process */
        /* jscs:disable disallowMultiLineTernary */
        var enqueue = ES.IsCallable(globals.setImmediate) ?
            globals.setImmediate :
            typeof process === 'object' && process.nextTick ? process.nextTick :
            makePromiseAsap() ||
            (ES.IsCallable(makeZeroTimeout) ? makeZeroTimeout() :
                function (task) { setTimeout(task, 0); }); // fallback
        /* jscs:enable disallowMultiLineTernary */

        // Constants for Promise implementation
        var PROMISE_IDENTITY = function (x) { return x; };
        var PROMISE_THROWER = function (e) { throw e; };
        var PROMISE_PENDING = 0;
        var PROMISE_FULFILLED = 1;
        var PROMISE_REJECTED = 2;
        // We store fulfill/reject handlers and capabilities in a single array.
        var PROMISE_FULFILL_OFFSET = 0;
        var PROMISE_REJECT_OFFSET = 1;
        var PROMISE_CAPABILITY_OFFSET = 2;
        // This is used in an optimization for chaining promises via then.
        var PROMISE_FAKE_CAPABILITY = {};

        var enqueuePromiseReactionJob = function (handler, capability, argument) {
            enqueue(function () {
                promiseReactionJob(handler, capability, argument);
            });
        };

        var promiseReactionJob = function (handler, promiseCapability, argument) {
            var handlerResult, f;
            if (promiseCapability === PROMISE_FAKE_CAPABILITY) {
                // Fast case, when we don't actually need to chain through to a
                // (real) promiseCapability.
                return handler(argument);
            }
            try {
                handlerResult = handler(argument);
                f = promiseCapability.resolve;
            } catch (e) {
                handlerResult = e;
                f = promiseCapability.reject;
            }
            f(handlerResult);
        };

        var fulfillPromise = function (promise, value) {
            var _promise = promise._promise;
            var length = _promise.reactionLength;
            if (length > 0) {
                enqueuePromiseReactionJob(
                    _promise.fulfillReactionHandler0,
                    _promise.reactionCapability0,
                    value
                );
                _promise.fulfillReactionHandler0 = void 0;
                _promise.rejectReactions0 = void 0;
                _promise.reactionCapability0 = void 0;
                if (length > 1) {
                    for (var i = 1, idx = 0; i < length; i++, idx += 3) {
                        enqueuePromiseReactionJob(
                            _promise[idx + PROMISE_FULFILL_OFFSET],
                            _promise[idx + PROMISE_CAPABILITY_OFFSET],
                            value
                        );
                        promise[idx + PROMISE_FULFILL_OFFSET] = void 0;
                        promise[idx + PROMISE_REJECT_OFFSET] = void 0;
                        promise[idx + PROMISE_CAPABILITY_OFFSET] = void 0;
                    }
                }
            }
            _promise.result = value;
            _promise.state = PROMISE_FULFILLED;
            _promise.reactionLength = 0;
        };

        var rejectPromise = function (promise, reason) {
            var _promise = promise._promise;
            var length = _promise.reactionLength;
            if (length > 0) {
                enqueuePromiseReactionJob(
                    _promise.rejectReactionHandler0,
                    _promise.reactionCapability0,
                    reason
                );
                _promise.fulfillReactionHandler0 = void 0;
                _promise.rejectReactions0 = void 0;
                _promise.reactionCapability0 = void 0;
                if (length > 1) {
                    for (var i = 1, idx = 0; i < length; i++, idx += 3) {
                        enqueuePromiseReactionJob(
                            _promise[idx + PROMISE_REJECT_OFFSET],
                            _promise[idx + PROMISE_CAPABILITY_OFFSET],
                            reason
                        );
                        promise[idx + PROMISE_FULFILL_OFFSET] = void 0;
                        promise[idx + PROMISE_REJECT_OFFSET] = void 0;
                        promise[idx + PROMISE_CAPABILITY_OFFSET] = void 0;
                    }
                }
            }
            _promise.result = reason;
            _promise.state = PROMISE_REJECTED;
            _promise.reactionLength = 0;
        };

        var createResolvingFunctions = function (promise) {
            var alreadyResolved = false;
            var resolve = function (resolution) {
                var then;
                if (alreadyResolved) { return; }
                alreadyResolved = true;
                if (resolution === promise) {
                    return rejectPromise(promise, new TypeError('Self resolution'));
                }
                if (!ES.TypeIsObject(resolution)) {
                    return fulfillPromise(promise, resolution);
                }
                try {
                    then = resolution.then;
                } catch (e) {
                    return rejectPromise(promise, e);
                }
                if (!ES.IsCallable(then)) {
                    return fulfillPromise(promise, resolution);
                }
                enqueue(function () {
                    promiseResolveThenableJob(promise, resolution, then);
                });
            };
            var reject = function (reason) {
                if (alreadyResolved) { return; }
                alreadyResolved = true;
                return rejectPromise(promise, reason);
            };
            return { resolve: resolve, reject: reject };
        };

        var optimizedThen = function (then, thenable, resolve, reject) {
            // Optimization: since we discard the result, we can pass our
            // own then implementation a special hint to let it know it
            // doesn't have to create it.  (The PROMISE_FAKE_CAPABILITY
            // object is local to this implementation and unforgeable outside.)
            if (then === Promise$prototype$then) {
                _call(then, thenable, resolve, reject, PROMISE_FAKE_CAPABILITY);
            } else {
                _call(then, thenable, resolve, reject);
            }
        };
        var promiseResolveThenableJob = function (promise, thenable, then) {
            var resolvingFunctions = createResolvingFunctions(promise);
            var resolve = resolvingFunctions.resolve;
            var reject = resolvingFunctions.reject;
            try {
                optimizedThen(then, thenable, resolve, reject);
            } catch (e) {
                reject(e);
            }
        };

        var Promise$prototype, Promise$prototype$then;
        var Promise = (function () {
            var PromiseShim = function Promise(resolver) {
                if (!(this instanceof PromiseShim)) {
                    throw new TypeError('Constructor Promise requires "new"');
                }
                if (this && this._promise) {
                    throw new TypeError('Bad construction');
                }
                // see https://bugs.ecmascript.org/show_bug.cgi?id=2482
                if (!ES.IsCallable(resolver)) {
                    throw new TypeError('not a valid resolver');
                }
                var promise = emulateES6construct(this, PromiseShim, Promise$prototype, {
                    _promise: {
                        result: void 0,
                        state: PROMISE_PENDING,
                        // The first member of the "reactions" array is inlined here,
                        // since most promises only have one reaction.
                        // We've also exploded the 'reaction' object to inline the
                        // "handler" and "capability" fields, since both fulfill and
                        // reject reactions share the same capability.
                        reactionLength: 0,
                        fulfillReactionHandler0: void 0,
                        rejectReactionHandler0: void 0,
                        reactionCapability0: void 0
                    }
                });
                var resolvingFunctions = createResolvingFunctions(promise);
                var reject = resolvingFunctions.reject;
                try {
                    resolver(resolvingFunctions.resolve, reject);
                } catch (e) {
                    reject(e);
                }
                return promise;
            };
            return PromiseShim;
        }());
        Promise$prototype = Promise.prototype;

        var _promiseAllResolver = function (index, values, capability, remaining) {
            var alreadyCalled = false;
            return function (x) {
                if (alreadyCalled) { return; }
                alreadyCalled = true;
                values[index] = x;
                if ((--remaining.count) === 0) {
                    var resolve = capability.resolve;
                    resolve(values); // call w/ this===undefined
                }
            };
        };

        var performPromiseAll = function (iteratorRecord, C, resultCapability) {
            var it = iteratorRecord.iterator;
            var values = [];
            var remaining = { count: 1 };
            var next, nextValue;
            var index = 0;
            while (true) {
                try {
                    next = ES.IteratorStep(it);
                    if (next === false) {
                        iteratorRecord.done = true;
                        break;
                    }
                    nextValue = next.value;
                } catch (e) {
                    iteratorRecord.done = true;
                    throw e;
                }
                values[index] = void 0;
                var nextPromise = C.resolve(nextValue);
                var resolveElement = _promiseAllResolver(
                    index, values, resultCapability, remaining
                );
                remaining.count += 1;
                optimizedThen(nextPromise.then, nextPromise, resolveElement, resultCapability.reject);
                index += 1;
            }
            if ((--remaining.count) === 0) {
                var resolve = resultCapability.resolve;
                resolve(values); // call w/ this===undefined
            }
            return resultCapability.promise;
        };

        var performPromiseRace = function (iteratorRecord, C, resultCapability) {
            var it = iteratorRecord.iterator;
            var next, nextValue, nextPromise;
            while (true) {
                try {
                    next = ES.IteratorStep(it);
                    if (next === false) {
                        // NOTE: If iterable has no items, resulting promise will never
                        // resolve; see:
                        // https://github.com/domenic/promises-unwrapping/issues/75
                        // https://bugs.ecmascript.org/show_bug.cgi?id=2515
                        iteratorRecord.done = true;
                        break;
                    }
                    nextValue = next.value;
                } catch (e) {
                    iteratorRecord.done = true;
                    throw e;
                }
                nextPromise = C.resolve(nextValue);
                optimizedThen(nextPromise.then, nextPromise, resultCapability.resolve, resultCapability.reject);
            }
            return resultCapability.promise;
        };

        defineProperties(Promise, {
            all: function all(iterable) {
                var C = this;
                if (!ES.TypeIsObject(C)) {
                    throw new TypeError('Promise is not object');
                }
                var capability = new PromiseCapability(C);
                var iterator, iteratorRecord;
                try {
                    iterator = ES.GetIterator(iterable);
                    iteratorRecord = { iterator: iterator, done: false };
                    return performPromiseAll(iteratorRecord, C, capability);
                } catch (e) {
                    var exception = e;
                    if (iteratorRecord && !iteratorRecord.done) {
                        try {
                            ES.IteratorClose(iterator, true);
                        } catch (ee) {
                            exception = ee;
                        }
                    }
                    var reject = capability.reject;
                    reject(exception);
                    return capability.promise;
                }
            },

            race: function race(iterable) {
                var C = this;
                if (!ES.TypeIsObject(C)) {
                    throw new TypeError('Promise is not object');
                }
                var capability = new PromiseCapability(C);
                var iterator, iteratorRecord;
                try {
                    iterator = ES.GetIterator(iterable);
                    iteratorRecord = { iterator: iterator, done: false };
                    return performPromiseRace(iteratorRecord, C, capability);
                } catch (e) {
                    var exception = e;
                    if (iteratorRecord && !iteratorRecord.done) {
                        try {
                            ES.IteratorClose(iterator, true);
                        } catch (ee) {
                            exception = ee;
                        }
                    }
                    var reject = capability.reject;
                    reject(exception);
                    return capability.promise;
                }
            },

            reject: function reject(reason) {
                var C = this;
                if (!ES.TypeIsObject(C)) {
                    throw new TypeError('Bad promise constructor');
                }
                var capability = new PromiseCapability(C);
                var rejectFunc = capability.reject;
                rejectFunc(reason); // call with this===undefined
                return capability.promise;
            },

            resolve: function resolve(v) {
                // See https://esdiscuss.org/topic/fixing-promise-resolve for spec
                var C = this;
                if (!ES.TypeIsObject(C)) {
                    throw new TypeError('Bad promise constructor');
                }
                if (ES.IsPromise(v)) {
                    var constructor = v.constructor;
                    if (constructor === C) {
                        return v;
                    }
                }
                var capability = new PromiseCapability(C);
                var resolveFunc = capability.resolve;
                resolveFunc(v); // call with this===undefined
                return capability.promise;
            }
        });

        defineProperties(Promise$prototype, {
            'catch': function (onRejected) {
                return this.then(null, onRejected);
            },

            then: function then(onFulfilled, onRejected) {
                var promise = this;
                if (!ES.IsPromise(promise)) { throw new TypeError('not a promise'); }
                var C = ES.SpeciesConstructor(promise, Promise);
                var resultCapability;
                var returnValueIsIgnored = arguments.length > 2 && arguments[2] === PROMISE_FAKE_CAPABILITY;
                if (returnValueIsIgnored && C === Promise) {
                    resultCapability = PROMISE_FAKE_CAPABILITY;
                } else {
                    resultCapability = new PromiseCapability(C);
                }
                // PerformPromiseThen(promise, onFulfilled, onRejected, resultCapability)
                // Note that we've split the 'reaction' object into its two
                // components, "capabilities" and "handler"
                // "capabilities" is always equal to `resultCapability`
                var fulfillReactionHandler = ES.IsCallable(onFulfilled) ? onFulfilled : PROMISE_IDENTITY;
                var rejectReactionHandler = ES.IsCallable(onRejected) ? onRejected : PROMISE_THROWER;
                var _promise = promise._promise;
                var value;
                if (_promise.state === PROMISE_PENDING) {
                    if (_promise.reactionLength === 0) {
                        _promise.fulfillReactionHandler0 = fulfillReactionHandler;
                        _promise.rejectReactionHandler0 = rejectReactionHandler;
                        _promise.reactionCapability0 = resultCapability;
                    } else {
                        var idx = 3 * (_promise.reactionLength - 1);
                        _promise[idx + PROMISE_FULFILL_OFFSET] = fulfillReactionHandler;
                        _promise[idx + PROMISE_REJECT_OFFSET] = rejectReactionHandler;
                        _promise[idx + PROMISE_CAPABILITY_OFFSET] = resultCapability;
                    }
                    _promise.reactionLength += 1;
                } else if (_promise.state === PROMISE_FULFILLED) {
                    value = _promise.result;
                    enqueuePromiseReactionJob(
                        fulfillReactionHandler, resultCapability, value
                    );
                } else if (_promise.state === PROMISE_REJECTED) {
                    value = _promise.result;
                    enqueuePromiseReactionJob(
                        rejectReactionHandler, resultCapability, value
                    );
                } else {
                    throw new TypeError('unexpected Promise state');
                }
                return resultCapability.promise;
            }
        });
        // This helps the optimizer by ensuring that methods which take
        // capabilities aren't polymorphic.
        PROMISE_FAKE_CAPABILITY = new PromiseCapability(Promise);
        Promise$prototype$then = Promise$prototype.then;

        return Promise;
    }());

    // Chrome's native Promise has extra methods that it shouldn't have. Let's remove them.
    if (globals.Promise) {
        delete globals.Promise.accept;
        delete globals.Promise.defer;
        delete globals.Promise.prototype.chain;
    }

    if (typeof PromiseShim === 'function') {
        // export the Promise constructor.
        defineProperties(globals, { Promise: PromiseShim });
        // In Chrome 33 (and thereabouts) Promise is defined, but the
        // implementation is buggy in a number of ways.  Let's check subclassing
        // support to see if we have a buggy implementation.
        var promiseSupportsSubclassing = supportsSubclassing(globals.Promise, function (S) {
            return S.resolve(42).then(function () {}) instanceof S;
        });
        var promiseIgnoresNonFunctionThenCallbacks = !throwsError(function () { globals.Promise.reject(42).then(null, 5).then(null, noop); });
        var promiseRequiresObjectContext = throwsError(function () { globals.Promise.call(3, noop); });
        // Promise.resolve() was errata'ed late in the ES6 process.
        // See: https://bugzilla.mozilla.org/show_bug.cgi?id=1170742
        //      https://code.google.com/p/v8/issues/detail?id=4161
        // It serves as a proxy for a number of other bugs in early Promise
        // implementations.
        var promiseResolveBroken = (function (Promise) {
            var p = Promise.resolve(5);
            p.constructor = {};
            var p2 = Promise.resolve(p);
            try {
                p2.then(null, noop).then(null, noop); // avoid "uncaught rejection" warnings in console
            } catch (e) {
                return true; // v8 native Promises break here https://code.google.com/p/chromium/issues/detail?id=575314
            }
            return p === p2; // This *should* be false!
        }(globals.Promise));

        // Chrome 46 (probably older too) does not retrieve a thenable's .then synchronously
        var getsThenSynchronously = supportsDescriptors && (function () {
                var count = 0;
                var thenable = Object.defineProperty({}, 'then', { get: function () { count += 1; } });
                Promise.resolve(thenable);
                return count === 1;
            }());

        var BadResolverPromise = function BadResolverPromise(executor) {
            var p = new Promise(executor);
            executor(3, function () {});
            this.then = p.then;
            this.constructor = BadResolverPromise;
        };
        BadResolverPromise.prototype = Promise.prototype;
        BadResolverPromise.all = Promise.all;
        // Chrome Canary 49 (probably older too) has some implementation bugs
        var hasBadResolverPromise = valueOrFalseIfThrows(function () {
            return !!BadResolverPromise.all([1, 2]);
        });

        if (!promiseSupportsSubclassing || !promiseIgnoresNonFunctionThenCallbacks ||
            !promiseRequiresObjectContext || promiseResolveBroken ||
            !getsThenSynchronously || hasBadResolverPromise) {
            /* globals Promise: true */
            /* eslint-disable no-undef */
            /* jshint -W020 */
            Promise = PromiseShim;
            /* jshint +W020 */
            /* eslint-enable no-undef */
            /* globals Promise: false */
            overrideNative(globals, 'Promise', PromiseShim);
        }
        if (Promise.all.length !== 1) {
            var origAll = Promise.all;
            overrideNative(Promise, 'all', function all(iterable) {
                return ES.Call(origAll, this, arguments);
            });
        }
        if (Promise.race.length !== 1) {
            var origRace = Promise.race;
            overrideNative(Promise, 'race', function race(iterable) {
                return ES.Call(origRace, this, arguments);
            });
        }
        if (Promise.resolve.length !== 1) {
            var origResolve = Promise.resolve;
            overrideNative(Promise, 'resolve', function resolve(x) {
                return ES.Call(origResolve, this, arguments);
            });
        }
        if (Promise.reject.length !== 1) {
            var origReject = Promise.reject;
            overrideNative(Promise, 'reject', function reject(r) {
                return ES.Call(origReject, this, arguments);
            });
        }
        ensureEnumerable(Promise, 'all');
        ensureEnumerable(Promise, 'race');
        ensureEnumerable(Promise, 'resolve');
        ensureEnumerable(Promise, 'reject');
        addDefaultSpecies(Promise);
    }

    // Map and Set require a true ES5 environment
    // Their fast path also requires that the environment preserve
    // property insertion order, which is not guaranteed by the spec.
    var testOrder = function (a) {
        var b = keys(_reduce(a, function (o, k) {
            o[k] = true;
            return o;
        }, {}));
        return a.join(':') === b.join(':');
    };
    var preservesInsertionOrder = testOrder(['z', 'a', 'bb']);
    // some engines (eg, Chrome) only preserve insertion order for string keys
    var preservesNumericInsertionOrder = testOrder(['z', 1, 'a', '3', 2]);

    if (supportsDescriptors) {

        var fastkey = function fastkey(key) {
            if (!preservesInsertionOrder) {
                return null;
            }
            if (typeof key === 'undefined' || key === null) {
                return '^' + ES.ToString(key);
            } else if (typeof key === 'string') {
                return '$' + key;
            } else if (typeof key === 'number') {
                // note that -0 will get coerced to "0" when used as a property key
                if (!preservesNumericInsertionOrder) {
                    return 'n' + key;
                }
                return key;
            } else if (typeof key === 'boolean') {
                return 'b' + key;
            }
            return null;
        };

        var emptyObject = function emptyObject() {
            // accomodate some older not-quite-ES5 browsers
            return Object.create ? Object.create(null) : {};
        };

        var addIterableToMap = function addIterableToMap(MapConstructor, map, iterable) {
            if (isArray(iterable) || Type.string(iterable)) {
                _forEach(iterable, function (entry) {
                    if (!ES.TypeIsObject(entry)) {
                        throw new TypeError('Iterator value ' + entry + ' is not an entry object');
                    }
                    map.set(entry[0], entry[1]);
                });
            } else if (iterable instanceof MapConstructor) {
                _call(MapConstructor.prototype.forEach, iterable, function (value, key) {
                    map.set(key, value);
                });
            } else {
                var iter, adder;
                if (iterable !== null && typeof iterable !== 'undefined') {
                    adder = map.set;
                    if (!ES.IsCallable(adder)) { throw new TypeError('bad map'); }
                    iter = ES.GetIterator(iterable);
                }
                if (typeof iter !== 'undefined') {
                    while (true) {
                        var next = ES.IteratorStep(iter);
                        if (next === false) { break; }
                        var nextItem = next.value;
                        try {
                            if (!ES.TypeIsObject(nextItem)) {
                                throw new TypeError('Iterator value ' + nextItem + ' is not an entry object');
                            }
                            _call(adder, map, nextItem[0], nextItem[1]);
                        } catch (e) {
                            ES.IteratorClose(iter, true);
                            throw e;
                        }
                    }
                }
            }
        };
        var addIterableToSet = function addIterableToSet(SetConstructor, set, iterable) {
            if (isArray(iterable) || Type.string(iterable)) {
                _forEach(iterable, function (value) {
                    set.add(value);
                });
            } else if (iterable instanceof SetConstructor) {
                _call(SetConstructor.prototype.forEach, iterable, function (value) {
                    set.add(value);
                });
            } else {
                var iter, adder;
                if (iterable !== null && typeof iterable !== 'undefined') {
                    adder = set.add;
                    if (!ES.IsCallable(adder)) { throw new TypeError('bad set'); }
                    iter = ES.GetIterator(iterable);
                }
                if (typeof iter !== 'undefined') {
                    while (true) {
                        var next = ES.IteratorStep(iter);
                        if (next === false) { break; }
                        var nextValue = next.value;
                        try {
                            _call(adder, set, nextValue);
                        } catch (e) {
                            ES.IteratorClose(iter, true);
                            throw e;
                        }
                    }
                }
            }
        };

        var collectionShims = {
            Map: (function () {

                var empty = {};

                var MapEntry = function MapEntry(key, value) {
                    this.key = key;
                    this.value = value;
                    this.next = null;
                    this.prev = null;
                };

                MapEntry.prototype.isRemoved = function isRemoved() {
                    return this.key === empty;
                };

                var isMap = function isMap(map) {
                    return !!map._es6map;
                };

                var requireMapSlot = function requireMapSlot(map, method) {
                    if (!ES.TypeIsObject(map) || !isMap(map)) {
                        throw new TypeError('Method Map.prototype.' + method + ' called on incompatible receiver ' + ES.ToString(map));
                    }
                };

                var MapIterator = function MapIterator(map, kind) {
                    requireMapSlot(map, '[[MapIterator]]');
                    this.head = map._head;
                    this.i = this.head;
                    this.kind = kind;
                };

                MapIterator.prototype = {
                    next: function next() {
                        var i = this.i;
                        var kind = this.kind;
                        var head = this.head;
                        if (typeof this.i === 'undefined') {
                            return iteratorResult();
                        }
                        while (i.isRemoved() && i !== head) {
                            // back up off of removed entries
                            i = i.prev;
                        }
                        // advance to next unreturned element.
                        var result;
                        while (i.next !== head) {
                            i = i.next;
                            if (!i.isRemoved()) {
                                if (kind === 'key') {
                                    result = i.key;
                                } else if (kind === 'value') {
                                    result = i.value;
                                } else {
                                    result = [i.key, i.value];
                                }
                                this.i = i;
                                return iteratorResult(result);
                            }
                        }
                        // once the iterator is done, it is done forever.
                        this.i = void 0;
                        return iteratorResult();
                    }
                };
                addIterator(MapIterator.prototype);

                var Map$prototype;
                var MapShim = function Map() {
                    if (!(this instanceof Map)) {
                        throw new TypeError('Constructor Map requires "new"');
                    }
                    if (this && this._es6map) {
                        throw new TypeError('Bad construction');
                    }
                    var map = emulateES6construct(this, Map, Map$prototype, {
                        _es6map: true,
                        _head: null,
                        _storage: emptyObject(),
                        _size: 0
                    });

                    var head = new MapEntry(null, null);
                    // circular doubly-linked list.
                    head.next = head.prev = head;
                    map._head = head;

                    // Optionally initialize map from iterable
                    if (arguments.length > 0) {
                        addIterableToMap(Map, map, arguments[0]);
                    }
                    return map;
                };
                Map$prototype = MapShim.prototype;

                Value.getter(Map$prototype, 'size', function () {
                    if (typeof this._size === 'undefined') {
                        throw new TypeError('size method called on incompatible Map');
                    }
                    return this._size;
                });

                defineProperties(Map$prototype, {
                    get: function get(key) {
                        requireMapSlot(this, 'get');
                        var fkey = fastkey(key);
                        if (fkey !== null) {
                            // fast O(1) path
                            var entry = this._storage[fkey];
                            if (entry) {
                                return entry.value;
                            } else {
                                return;
                            }
                        }
                        var head = this._head;
                        var i = head;
                        while ((i = i.next) !== head) {
                            if (ES.SameValueZero(i.key, key)) {
                                return i.value;
                            }
                        }
                    },

                    has: function has(key) {
                        requireMapSlot(this, 'has');
                        var fkey = fastkey(key);
                        if (fkey !== null) {
                            // fast O(1) path
                            return typeof this._storage[fkey] !== 'undefined';
                        }
                        var head = this._head;
                        var i = head;
                        while ((i = i.next) !== head) {
                            if (ES.SameValueZero(i.key, key)) {
                                return true;
                            }
                        }
                        return false;
                    },

                    set: function set(key, value) {
                        requireMapSlot(this, 'set');
                        var head = this._head;
                        var i = head;
                        var entry;
                        var fkey = fastkey(key);
                        if (fkey !== null) {
                            // fast O(1) path
                            if (typeof this._storage[fkey] !== 'undefined') {
                                this._storage[fkey].value = value;
                                return this;
                            } else {
                                entry = this._storage[fkey] = new MapEntry(key, value);
                                i = head.prev;
                                // fall through
                            }
                        }
                        while ((i = i.next) !== head) {
                            if (ES.SameValueZero(i.key, key)) {
                                i.value = value;
                                return this;
                            }
                        }
                        entry = entry || new MapEntry(key, value);
                        if (ES.SameValue(-0, key)) {
                            entry.key = +0; // coerce -0 to +0 in entry
                        }
                        entry.next = this._head;
                        entry.prev = this._head.prev;
                        entry.prev.next = entry;
                        entry.next.prev = entry;
                        this._size += 1;
                        return this;
                    },

                    'delete': function (key) {
                        requireMapSlot(this, 'delete');
                        var head = this._head;
                        var i = head;
                        var fkey = fastkey(key);
                        if (fkey !== null) {
                            // fast O(1) path
                            if (typeof this._storage[fkey] === 'undefined') {
                                return false;
                            }
                            i = this._storage[fkey].prev;
                            delete this._storage[fkey];
                            // fall through
                        }
                        while ((i = i.next) !== head) {
                            if (ES.SameValueZero(i.key, key)) {
                                i.key = i.value = empty;
                                i.prev.next = i.next;
                                i.next.prev = i.prev;
                                this._size -= 1;
                                return true;
                            }
                        }
                        return false;
                    },

                    clear: function clear() {
                        requireMapSlot(this, 'clear');
                        this._size = 0;
                        this._storage = emptyObject();
                        var head = this._head;
                        var i = head;
                        var p = i.next;
                        while ((i = p) !== head) {
                            i.key = i.value = empty;
                            p = i.next;
                            i.next = i.prev = head;
                        }
                        head.next = head.prev = head;
                    },

                    keys: function keys() {
                        requireMapSlot(this, 'keys');
                        return new MapIterator(this, 'key');
                    },

                    values: function values() {
                        requireMapSlot(this, 'values');
                        return new MapIterator(this, 'value');
                    },

                    entries: function entries() {
                        requireMapSlot(this, 'entries');
                        return new MapIterator(this, 'key+value');
                    },

                    forEach: function forEach(callback) {
                        requireMapSlot(this, 'forEach');
                        var context = arguments.length > 1 ? arguments[1] : null;
                        var it = this.entries();
                        for (var entry = it.next(); !entry.done; entry = it.next()) {
                            if (context) {
                                _call(callback, context, entry.value[1], entry.value[0], this);
                            } else {
                                callback(entry.value[1], entry.value[0], this);
                            }
                        }
                    }
                });
                addIterator(Map$prototype, Map$prototype.entries);

                return MapShim;
            }()),

            Set: (function () {
                var isSet = function isSet(set) {
                    return set._es6set && typeof set._storage !== 'undefined';
                };
                var requireSetSlot = function requireSetSlot(set, method) {
                    if (!ES.TypeIsObject(set) || !isSet(set)) {
                        // https://github.com/paulmillr/es6-shim/issues/176
                        throw new TypeError('Set.prototype.' + method + ' called on incompatible receiver ' + ES.ToString(set));
                    }
                };

                // Creating a Map is expensive.  To speed up the common case of
                // Sets containing only string or numeric keys, we use an object
                // as backing storage and lazily create a full Map only when
                // required.
                var Set$prototype;
                var SetShim = function Set() {
                    if (!(this instanceof Set)) {
                        throw new TypeError('Constructor Set requires "new"');
                    }
                    if (this && this._es6set) {
                        throw new TypeError('Bad construction');
                    }
                    var set = emulateES6construct(this, Set, Set$prototype, {
                        _es6set: true,
                        '[[SetData]]': null,
                        _storage: emptyObject()
                    });
                    if (!set._es6set) {
                        throw new TypeError('bad set');
                    }

                    // Optionally initialize Set from iterable
                    if (arguments.length > 0) {
                        addIterableToSet(Set, set, arguments[0]);
                    }
                    return set;
                };
                Set$prototype = SetShim.prototype;

                var decodeKey = function (key) {
                    var k = key;
                    if (k === '^null') {
                        return null;
                    } else if (k === '^undefined') {
                        return void 0;
                    } else {
                        var first = k.charAt(0);
                        if (first === '$') {
                            return _strSlice(k, 1);
                        } else if (first === 'n') {
                            return +_strSlice(k, 1);
                        } else if (first === 'b') {
                            return k === 'btrue';
                        }
                    }
                    return +k;
                };
                // Switch from the object backing storage to a full Map.
                var ensureMap = function ensureMap(set) {
                    if (!set['[[SetData]]']) {
                        var m = set['[[SetData]]'] = new collectionShims.Map();
                        _forEach(keys(set._storage), function (key) {
                            var k = decodeKey(key);
                            m.set(k, k);
                        });
                        set['[[SetData]]'] = m;
                    }
                    set._storage = null; // free old backing storage
                };

                Value.getter(SetShim.prototype, 'size', function () {
                    requireSetSlot(this, 'size');
                    if (this._storage) {
                        return keys(this._storage).length;
                    }
                    ensureMap(this);
                    return this['[[SetData]]'].size;
                });

                defineProperties(SetShim.prototype, {
                    has: function has(key) {
                        requireSetSlot(this, 'has');
                        var fkey;
                        if (this._storage && (fkey = fastkey(key)) !== null) {
                            return !!this._storage[fkey];
                        }
                        ensureMap(this);
                        return this['[[SetData]]'].has(key);
                    },

                    add: function add(key) {
                        requireSetSlot(this, 'add');
                        var fkey;
                        if (this._storage && (fkey = fastkey(key)) !== null) {
                            this._storage[fkey] = true;
                            return this;
                        }
                        ensureMap(this);
                        this['[[SetData]]'].set(key, key);
                        return this;
                    },

                    'delete': function (key) {
                        requireSetSlot(this, 'delete');
                        var fkey;
                        if (this._storage && (fkey = fastkey(key)) !== null) {
                            var hasFKey = _hasOwnProperty(this._storage, fkey);
                            return (delete this._storage[fkey]) && hasFKey;
                        }
                        ensureMap(this);
                        return this['[[SetData]]']['delete'](key);
                    },

                    clear: function clear() {
                        requireSetSlot(this, 'clear');
                        if (this._storage) {
                            this._storage = emptyObject();
                        }
                        if (this['[[SetData]]']) {
                            this['[[SetData]]'].clear();
                        }
                    },

                    values: function values() {
                        requireSetSlot(this, 'values');
                        ensureMap(this);
                        return this['[[SetData]]'].values();
                    },

                    entries: function entries() {
                        requireSetSlot(this, 'entries');
                        ensureMap(this);
                        return this['[[SetData]]'].entries();
                    },

                    forEach: function forEach(callback) {
                        requireSetSlot(this, 'forEach');
                        var context = arguments.length > 1 ? arguments[1] : null;
                        var entireSet = this;
                        ensureMap(entireSet);
                        this['[[SetData]]'].forEach(function (value, key) {
                            if (context) {
                                _call(callback, context, key, key, entireSet);
                            } else {
                                callback(key, key, entireSet);
                            }
                        });
                    }
                });
                defineProperty(SetShim.prototype, 'keys', SetShim.prototype.values, true);
                addIterator(SetShim.prototype, SetShim.prototype.values);

                return SetShim;
            }())
        };

        if (globals.Map || globals.Set) {
            // Safari 8, for example, doesn't accept an iterable.
            var mapAcceptsArguments = valueOrFalseIfThrows(function () { return new Map([[1, 2]]).get(1) === 2; });
            if (!mapAcceptsArguments) {
                var OrigMapNoArgs = globals.Map;
                globals.Map = function Map() {
                    if (!(this instanceof Map)) {
                        throw new TypeError('Constructor Map requires "new"');
                    }
                    var m = new OrigMapNoArgs();
                    if (arguments.length > 0) {
                        addIterableToMap(Map, m, arguments[0]);
                    }
                    delete m.constructor;
                    Object.setPrototypeOf(m, globals.Map.prototype);
                    return m;
                };
                globals.Map.prototype = create(OrigMapNoArgs.prototype);
                defineProperty(globals.Map.prototype, 'constructor', globals.Map, true);
                Value.preserveToString(globals.Map, OrigMapNoArgs);
            }
            var testMap = new Map();
            var mapUsesSameValueZero = (function () {
                // Chrome 38-42, node 0.11/0.12, iojs 1/2 also have a bug when the Map has a size > 4
                var m = new Map([[1, 0], [2, 0], [3, 0], [4, 0]]);
                m.set(-0, m);
                return m.get(0) === m && m.get(-0) === m && m.has(0) && m.has(-0);
            }());
            var mapSupportsChaining = testMap.set(1, 2) === testMap;
            if (!mapUsesSameValueZero || !mapSupportsChaining) {
                var origMapSet = Map.prototype.set;
                overrideNative(Map.prototype, 'set', function set(k, v) {
                    _call(origMapSet, this, k === 0 ? 0 : k, v);
                    return this;
                });
            }
            if (!mapUsesSameValueZero) {
                var origMapGet = Map.prototype.get;
                var origMapHas = Map.prototype.has;
                defineProperties(Map.prototype, {
                    get: function get(k) {
                        return _call(origMapGet, this, k === 0 ? 0 : k);
                    },
                    has: function has(k) {
                        return _call(origMapHas, this, k === 0 ? 0 : k);
                    }
                }, true);
                Value.preserveToString(Map.prototype.get, origMapGet);
                Value.preserveToString(Map.prototype.has, origMapHas);
            }
            var testSet = new Set();
            var setUsesSameValueZero = (function (s) {
                s['delete'](0);
                s.add(-0);
                return !s.has(0);
            }(testSet));
            var setSupportsChaining = testSet.add(1) === testSet;
            if (!setUsesSameValueZero || !setSupportsChaining) {
                var origSetAdd = Set.prototype.add;
                Set.prototype.add = function add(v) {
                    _call(origSetAdd, this, v === 0 ? 0 : v);
                    return this;
                };
                Value.preserveToString(Set.prototype.add, origSetAdd);
            }
            if (!setUsesSameValueZero) {
                var origSetHas = Set.prototype.has;
                Set.prototype.has = function has(v) {
                    return _call(origSetHas, this, v === 0 ? 0 : v);
                };
                Value.preserveToString(Set.prototype.has, origSetHas);
                var origSetDel = Set.prototype['delete'];
                Set.prototype['delete'] = function SetDelete(v) {
                    return _call(origSetDel, this, v === 0 ? 0 : v);
                };
                Value.preserveToString(Set.prototype['delete'], origSetDel);
            }
            var mapSupportsSubclassing = supportsSubclassing(globals.Map, function (M) {
                var m = new M([]);
                // Firefox 32 is ok with the instantiating the subclass but will
                // throw when the map is used.
                m.set(42, 42);
                return m instanceof M;
            });
            var mapFailsToSupportSubclassing = Object.setPrototypeOf && !mapSupportsSubclassing; // without Object.setPrototypeOf, subclassing is not possible
            var mapRequiresNew = (function () {
                try {
                    return !(globals.Map() instanceof globals.Map);
                } catch (e) {
                    return e instanceof TypeError;
                }
            }());
            if (globals.Map.length !== 0 || mapFailsToSupportSubclassing || !mapRequiresNew) {
                var OrigMap = globals.Map;
                globals.Map = function Map() {
                    if (!(this instanceof Map)) {
                        throw new TypeError('Constructor Map requires "new"');
                    }
                    var m = new OrigMap();
                    if (arguments.length > 0) {
                        addIterableToMap(Map, m, arguments[0]);
                    }
                    delete m.constructor;
                    Object.setPrototypeOf(m, Map.prototype);
                    return m;
                };
                globals.Map.prototype = OrigMap.prototype;
                defineProperty(globals.Map.prototype, 'constructor', globals.Map, true);
                Value.preserveToString(globals.Map, OrigMap);
            }
            var setSupportsSubclassing = supportsSubclassing(globals.Set, function (S) {
                var s = new S([]);
                s.add(42, 42);
                return s instanceof S;
            });
            var setFailsToSupportSubclassing = Object.setPrototypeOf && !setSupportsSubclassing; // without Object.setPrototypeOf, subclassing is not possible
            var setRequiresNew = (function () {
                try {
                    return !(globals.Set() instanceof globals.Set);
                } catch (e) {
                    return e instanceof TypeError;
                }
            }());
            if (globals.Set.length !== 0 || setFailsToSupportSubclassing || !setRequiresNew) {
                var OrigSet = globals.Set;
                globals.Set = function Set() {
                    if (!(this instanceof Set)) {
                        throw new TypeError('Constructor Set requires "new"');
                    }
                    var s = new OrigSet();
                    if (arguments.length > 0) {
                        addIterableToSet(Set, s, arguments[0]);
                    }
                    delete s.constructor;
                    Object.setPrototypeOf(s, Set.prototype);
                    return s;
                };
                globals.Set.prototype = OrigSet.prototype;
                defineProperty(globals.Set.prototype, 'constructor', globals.Set, true);
                Value.preserveToString(globals.Set, OrigSet);
            }
            var newMap = new globals.Map();
            var mapIterationThrowsStopIterator = !valueOrFalseIfThrows(function () {
                return newMap.keys().next().done;
            });
            /*
             - In Firefox < 23, Map#size is a function.
             - In all current Firefox, Set#entries/keys/values & Map#clear do not exist
             - https://bugzilla.mozilla.org/show_bug.cgi?id=869996
             - In Firefox 24, Map and Set do not implement forEach
             - In Firefox 25 at least, Map and Set are callable without "new"
             */
            if (
                typeof globals.Map.prototype.clear !== 'function' ||
                new globals.Set().size !== 0 ||
                newMap.size !== 0 ||
                typeof globals.Map.prototype.keys !== 'function' ||
                typeof globals.Set.prototype.keys !== 'function' ||
                typeof globals.Map.prototype.forEach !== 'function' ||
                typeof globals.Set.prototype.forEach !== 'function' ||
                isCallableWithoutNew(globals.Map) ||
                isCallableWithoutNew(globals.Set) ||
                typeof newMap.keys().next !== 'function' || // Safari 8
                mapIterationThrowsStopIterator || // Firefox 25
                !mapSupportsSubclassing
            ) {
                defineProperties(globals, {
                    Map: collectionShims.Map,
                    Set: collectionShims.Set
                }, true);
            }

            if (globals.Set.prototype.keys !== globals.Set.prototype.values) {
                // Fixed in WebKit with https://bugs.webkit.org/show_bug.cgi?id=144190
                defineProperty(globals.Set.prototype, 'keys', globals.Set.prototype.values, true);
            }

            // Shim incomplete iterator implementations.
            addIterator(Object.getPrototypeOf((new globals.Map()).keys()));
            addIterator(Object.getPrototypeOf((new globals.Set()).keys()));

            if (functionsHaveNames && globals.Set.prototype.has.name !== 'has') {
                // Microsoft Edge v0.11.10074.0 is missing a name on Set#has
                var anonymousSetHas = globals.Set.prototype.has;
                overrideNative(globals.Set.prototype, 'has', function has(key) {
                    return _call(anonymousSetHas, this, key);
                });
            }
        }
        defineProperties(globals, collectionShims);
        addDefaultSpecies(globals.Map);
        addDefaultSpecies(globals.Set);
    }

    var throwUnlessTargetIsObject = function throwUnlessTargetIsObject(target) {
        if (!ES.TypeIsObject(target)) {
            throw new TypeError('target must be an object');
        }
    };

    // Some Reflect methods are basically the same as
    // those on the Object global, except that a TypeError is thrown if
    // target isn't an object. As well as returning a boolean indicating
    // the success of the operation.
    var ReflectShims = {
        // Apply method in a functional form.
        apply: function apply() {
            return ES.Call(ES.Call, null, arguments);
        },

        // New operator in a functional form.
        construct: function construct(constructor, args) {
            if (!ES.IsConstructor(constructor)) {
                throw new TypeError('First argument must be a constructor.');
            }
            var newTarget = arguments.length > 2 ? arguments[2] : constructor;
            if (!ES.IsConstructor(newTarget)) {
                throw new TypeError('new.target must be a constructor.');
            }
            return ES.Construct(constructor, args, newTarget, 'internal');
        },

        // When deleting a non-existent or configurable property,
        // true is returned.
        // When attempting to delete a non-configurable property,
        // it will return false.
        deleteProperty: function deleteProperty(target, key) {
            throwUnlessTargetIsObject(target);
            if (supportsDescriptors) {
                var desc = Object.getOwnPropertyDescriptor(target, key);

                if (desc && !desc.configurable) {
                    return false;
                }
            }

            // Will return true.
            return delete target[key];
        },

        has: function has(target, key) {
            throwUnlessTargetIsObject(target);
            return key in target;
        }
    };

    if (Object.getOwnPropertyNames) {
        Object.assign(ReflectShims, {
            // Basically the result of calling the internal [[OwnPropertyKeys]].
            // Concatenating propertyNames and propertySymbols should do the trick.
            // This should continue to work together with a Symbol shim
            // which overrides Object.getOwnPropertyNames and implements
            // Object.getOwnPropertySymbols.
            ownKeys: function ownKeys(target) {
                throwUnlessTargetIsObject(target);
                var keys = Object.getOwnPropertyNames(target);

                if (ES.IsCallable(Object.getOwnPropertySymbols)) {
                    _pushApply(keys, Object.getOwnPropertySymbols(target));
                }

                return keys;
            }
        });
    }

    var callAndCatchException = function ConvertExceptionToBoolean(func) {
        return !throwsError(func);
    };

    if (Object.preventExtensions) {
        Object.assign(ReflectShims, {
            isExtensible: function isExtensible(target) {
                throwUnlessTargetIsObject(target);
                return Object.isExtensible(target);
            },
            preventExtensions: function preventExtensions(target) {
                throwUnlessTargetIsObject(target);
                return callAndCatchException(function () {
                    Object.preventExtensions(target);
                });
            }
        });
    }

    if (supportsDescriptors) {
        var internalGet = function get(target, key, receiver) {
            var desc = Object.getOwnPropertyDescriptor(target, key);

            if (!desc) {
                var parent = Object.getPrototypeOf(target);

                if (parent === null) {
                    return void 0;
                }

                return internalGet(parent, key, receiver);
            }

            if ('value' in desc) {
                return desc.value;
            }

            if (desc.get) {
                return ES.Call(desc.get, receiver);
            }

            return void 0;
        };

        var internalSet = function set(target, key, value, receiver) {
            var desc = Object.getOwnPropertyDescriptor(target, key);

            if (!desc) {
                var parent = Object.getPrototypeOf(target);

                if (parent !== null) {
                    return internalSet(parent, key, value, receiver);
                }

                desc = {
                    value: void 0,
                    writable: true,
                    enumerable: true,
                    configurable: true
                };
            }

            if ('value' in desc) {
                if (!desc.writable) {
                    return false;
                }

                if (!ES.TypeIsObject(receiver)) {
                    return false;
                }

                var existingDesc = Object.getOwnPropertyDescriptor(receiver, key);

                if (existingDesc) {
                    return Reflect.defineProperty(receiver, key, {
                        value: value
                    });
                } else {
                    return Reflect.defineProperty(receiver, key, {
                        value: value,
                        writable: true,
                        enumerable: true,
                        configurable: true
                    });
                }
            }

            if (desc.set) {
                _call(desc.set, receiver, value);
                return true;
            }

            return false;
        };

        Object.assign(ReflectShims, {
            defineProperty: function defineProperty(target, propertyKey, attributes) {
                throwUnlessTargetIsObject(target);
                return callAndCatchException(function () {
                    Object.defineProperty(target, propertyKey, attributes);
                });
            },

            getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, propertyKey) {
                throwUnlessTargetIsObject(target);
                return Object.getOwnPropertyDescriptor(target, propertyKey);
            },

            // Syntax in a functional form.
            get: function get(target, key) {
                throwUnlessTargetIsObject(target);
                var receiver = arguments.length > 2 ? arguments[2] : target;

                return internalGet(target, key, receiver);
            },

            set: function set(target, key, value) {
                throwUnlessTargetIsObject(target);
                var receiver = arguments.length > 3 ? arguments[3] : target;

                return internalSet(target, key, value, receiver);
            }
        });
    }

    if (Object.getPrototypeOf) {
        var objectDotGetPrototypeOf = Object.getPrototypeOf;
        ReflectShims.getPrototypeOf = function getPrototypeOf(target) {
            throwUnlessTargetIsObject(target);
            return objectDotGetPrototypeOf(target);
        };
    }

    if (Object.setPrototypeOf && ReflectShims.getPrototypeOf) {
        var willCreateCircularPrototype = function (object, lastProto) {
            var proto = lastProto;
            while (proto) {
                if (object === proto) {
                    return true;
                }
                proto = ReflectShims.getPrototypeOf(proto);
            }
            return false;
        };

        Object.assign(ReflectShims, {
            // Sets the prototype of the given object.
            // Returns true on success, otherwise false.
            setPrototypeOf: function setPrototypeOf(object, proto) {
                throwUnlessTargetIsObject(object);
                if (proto !== null && !ES.TypeIsObject(proto)) {
                    throw new TypeError('proto must be an object or null');
                }

                // If they already are the same, we're done.
                if (proto === Reflect.getPrototypeOf(object)) {
                    return true;
                }

                // Cannot alter prototype if object not extensible.
                if (Reflect.isExtensible && !Reflect.isExtensible(object)) {
                    return false;
                }

                // Ensure that we do not create a circular prototype chain.
                if (willCreateCircularPrototype(object, proto)) {
                    return false;
                }

                Object.setPrototypeOf(object, proto);

                return true;
            }
        });
    }
    var defineOrOverrideReflectProperty = function (key, shim) {
        if (!ES.IsCallable(globals.Reflect[key])) {
            defineProperty(globals.Reflect, key, shim);
        } else {
            var acceptsPrimitives = valueOrFalseIfThrows(function () {
                globals.Reflect[key](1);
                globals.Reflect[key](NaN);
                globals.Reflect[key](true);
                return true;
            });
            if (acceptsPrimitives) {
                overrideNative(globals.Reflect, key, shim);
            }
        }
    };
    Object.keys(ReflectShims).forEach(function (key) {
        defineOrOverrideReflectProperty(key, ReflectShims[key]);
    });
    var originalReflectGetProto = globals.Reflect.getPrototypeOf;
    if (functionsHaveNames && originalReflectGetProto && originalReflectGetProto.name !== 'getPrototypeOf') {
        overrideNative(globals.Reflect, 'getPrototypeOf', function getPrototypeOf(target) {
            return _call(originalReflectGetProto, globals.Reflect, target);
        });
    }
    if (globals.Reflect.setPrototypeOf) {
        if (valueOrFalseIfThrows(function () {
                globals.Reflect.setPrototypeOf(1, {});
                return true;
            })) {
            overrideNative(globals.Reflect, 'setPrototypeOf', ReflectShims.setPrototypeOf);
        }
    }
    if (globals.Reflect.defineProperty) {
        if (!valueOrFalseIfThrows(function () {
                var basic = !globals.Reflect.defineProperty(1, 'test', { value: 1 });
                // "extensible" fails on Edge 0.12
                var extensible = typeof Object.preventExtensions !== 'function' || !globals.Reflect.defineProperty(Object.preventExtensions({}), 'test', {});
                return basic && extensible;
            })) {
            overrideNative(globals.Reflect, 'defineProperty', ReflectShims.defineProperty);
        }
    }
    if (globals.Reflect.construct) {
        if (!valueOrFalseIfThrows(function () {
                var F = function F() {};
                return globals.Reflect.construct(function () {}, [], F) instanceof F;
            })) {
            overrideNative(globals.Reflect, 'construct', ReflectShims.construct);
        }
    }

    if (String(new Date(NaN)) !== 'Invalid Date') {
        var dateToString = Date.prototype.toString;
        var shimmedDateToString = function toString() {
            var valueOf = +this;
            if (valueOf !== valueOf) {
                return 'Invalid Date';
            }
            return ES.Call(dateToString, this);
        };
        overrideNative(Date.prototype, 'toString', shimmedDateToString);
    }

    // Annex B HTML methods
    // http://www.ecma-international.org/ecma-262/6.0/#sec-additional-properties-of-the-string.prototype-object
    var stringHTMLshims = {
        anchor: function anchor(name) { return ES.CreateHTML(this, 'a', 'name', name); },
        big: function big() { return ES.CreateHTML(this, 'big', '', ''); },
        blink: function blink() { return ES.CreateHTML(this, 'blink', '', ''); },
        bold: function bold() { return ES.CreateHTML(this, 'b', '', ''); },
        fixed: function fixed() { return ES.CreateHTML(this, 'tt', '', ''); },
        fontcolor: function fontcolor(color) { return ES.CreateHTML(this, 'font', 'color', color); },
        fontsize: function fontsize(size) { return ES.CreateHTML(this, 'font', 'size', size); },
        italics: function italics() { return ES.CreateHTML(this, 'i', '', ''); },
        link: function link(url) { return ES.CreateHTML(this, 'a', 'href', url); },
        small: function small() { return ES.CreateHTML(this, 'small', '', ''); },
        strike: function strike() { return ES.CreateHTML(this, 'strike', '', ''); },
        sub: function sub() { return ES.CreateHTML(this, 'sub', '', ''); },
        sup: function sub() { return ES.CreateHTML(this, 'sup', '', ''); }
    };
    _forEach(Object.keys(stringHTMLshims), function (key) {
        var method = String.prototype[key];
        var shouldOverwrite = false;
        if (ES.IsCallable(method)) {
            var output = _call(method, '', ' " ');
            var quotesCount = _concat([], output.match(/"/g)).length;
            shouldOverwrite = output !== output.toLowerCase() || quotesCount > 2;
        } else {
            shouldOverwrite = true;
        }
        if (shouldOverwrite) {
            overrideNative(String.prototype, key, stringHTMLshims[key]);
        }
    });

    var JSONstringifiesSymbols = (function () {
        // Microsoft Edge v0.12 stringifies Symbols incorrectly
        if (!hasSymbols) { return false; } // Symbols are not supported
        var stringify = typeof JSON === 'object' && typeof JSON.stringify === 'function' ? JSON.stringify : null;
        if (!stringify) { return false; } // JSON.stringify is not supported
        if (typeof stringify(Symbol()) !== 'undefined') { return true; } // Symbols should become `undefined`
        if (stringify([Symbol()]) !== '[null]') { return true; } // Symbols in arrays should become `null`
        var obj = { a: Symbol() };
        obj[Symbol()] = true;
        if (stringify(obj) !== '{}') { return true; } // Symbol-valued keys *and* Symbol-valued properties should be omitted
        return false;
    }());
    var JSONstringifyAcceptsObjectSymbol = valueOrFalseIfThrows(function () {
        // Chrome 45 throws on stringifying object symbols
        if (!hasSymbols) { return true; } // Symbols are not supported
        return JSON.stringify(Object(Symbol())) === '{}' && JSON.stringify([Object(Symbol())]) === '[{}]';
    });
    if (JSONstringifiesSymbols || !JSONstringifyAcceptsObjectSymbol) {
        var origStringify = JSON.stringify;
        overrideNative(JSON, 'stringify', function stringify(value) {
            if (typeof value === 'symbol') { return; }
            var replacer;
            if (arguments.length > 1) {
                replacer = arguments[1];
            }
            var args = [value];
            if (!isArray(replacer)) {
                var replaceFn = ES.IsCallable(replacer) ? replacer : null;
                var wrappedReplacer = function (key, val) {
                    var parsedValue = replaceFn ? _call(replaceFn, this, key, val) : val;
                    if (typeof parsedValue !== 'symbol') {
                        if (Type.symbol(parsedValue)) {
                            return assignTo({})(parsedValue);
                        } else {
                            return parsedValue;
                        }
                    }
                };
                args.push(wrappedReplacer);
            } else {
                // create wrapped replacer that handles an array replacer?
                args.push(replacer);
            }
            if (arguments.length > 2) {
                args.push(arguments[2]);
            }
            return origStringify.apply(this, args);
        });
    }

    return globals;
}));
//endregion
/** es6-shim END */

/** es6-sham */
//region es6-sham
/*!
 * https://github.com/paulmillr/es6-shim
 * @license es6-shim Copyright 2013-2016 by Paul Miller (http://paulmillr.com)
 *   and contributors,  MIT License
 * es6-sham: v0.35.1
 * see https://github.com/paulmillr/es6-shim/blob/0.35.1/LICENSE
 * Details and documentation:
 * https://github.com/paulmillr/es6-shim/
 */

// UMD (Universal Module Definition)
// see https://github.com/umdjs/umd/blob/master/returnExports.js
(function (root, factory) {
    /*global define, exports, module */
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.returnExports = factory();
    }
}(this, function () {
    'use strict';

    /*jshint evil: true */
    /* eslint-disable no-new-func */
    var getGlobal = new Function('return this;');
    /* eslint-enable no-new-func */
    /*jshint evil: false */

    var globals = getGlobal();
    var Object = globals.Object;
    var _call = Function.call.bind(Function.call);
    var functionToString = Function.toString;
    var _strMatch = String.prototype.match;

    var throwsError = function (func) {
        try {
            func();
            return false;
        } catch (e) {
            return true;
        }
    };
    var arePropertyDescriptorsSupported = function () {
        // if Object.defineProperty exists but throws, it's IE 8
        return !throwsError(function () {
            Object.defineProperty({}, 'x', { get: function () {} });
        });
    };
    var supportsDescriptors = !!Object.defineProperty && arePropertyDescriptorsSupported();

    // NOTE:  This versions needs object ownership
    //        because every promoted object needs to be reassigned
    //        otherwise uncompatible browsers cannot work as expected
    //
    // NOTE:  This might need es5-shim or polyfills upfront
    //        because it's based on ES5 API.
    //        (probably just an IE <= 8 problem)
    //
    // NOTE:  nodejs is fine in version 0.8, 0.10, and future versions.
    (function () {
        if (Object.setPrototypeOf) { return; }

        /*jshint proto: true */
        // @author    Andrea Giammarchi - @WebReflection

        var getOwnPropertyNames = Object.getOwnPropertyNames;
        var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
        var create = Object.create;
        var defineProperty = Object.defineProperty;
        var getPrototypeOf = Object.getPrototypeOf;
        var objProto = Object.prototype;

        var copyDescriptors = function (target, source) {
            // define into target descriptors from source
            getOwnPropertyNames(source).forEach(function (key) {
                defineProperty(
                    target,
                    key,
                    getOwnPropertyDescriptor(source, key)
                );
            });
            return target;
        };
        // used as fallback when no promotion is possible
        var createAndCopy = function (origin, proto) {
            return copyDescriptors(create(proto), origin);
        };
        var set, setPrototypeOf;
        try {
            // this might fail for various reasons
            // ignore if Chrome cought it at runtime
            set = getOwnPropertyDescriptor(objProto, '__proto__').set;
            set.call({}, null);
            // setter not poisoned, it can promote
            // Firefox, Chrome
            setPrototypeOf = function (origin, proto) {
                set.call(origin, proto);
                return origin;
            };
        } catch (e) {
            // do one or more feature detections
            set = { __proto__: null };
            // if proto does not work, needs to fallback
            // some Opera, Rhino, ducktape
            if (set instanceof Object) {
                setPrototypeOf = createAndCopy;
            } else {
                // verify if null objects are buggy
                /* eslint-disable no-proto */
                set.__proto__ = objProto;
                /* eslint-enable no-proto */
                // if null objects are buggy
                // nodejs 0.8 to 0.10
                if (set instanceof Object) {
                    setPrototypeOf = function (origin, proto) {
                        // use such bug to promote
                        /* eslint-disable no-proto */
                        origin.__proto__ = proto;
                        /* eslint-enable no-proto */
                        return origin;
                    };
                } else {
                    // try to use proto or fallback
                    // Safari, old Firefox, many others
                    setPrototypeOf = function (origin, proto) {
                        // if proto is not null
                        if (getPrototypeOf(origin)) {
                            // use __proto__ to promote
                            /* eslint-disable no-proto */
                            origin.__proto__ = proto;
                            /* eslint-enable no-proto */
                            return origin;
                        } else {
                            // otherwise unable to promote: fallback
                            return createAndCopy(origin, proto);
                        }
                    };
                }
            }
        }
        Object.setPrototypeOf = setPrototypeOf;
    }());

    if (supportsDescriptors && function foo() {}.name !== 'foo') {
        /* eslint no-extend-native: 1 */
        Object.defineProperty(Function.prototype, 'name', {
            configurable: true,
            enumerable: false,
            get: function () {
                var str = _call(functionToString, this);
                var match = _call(_strMatch, str, /\s*function\s+([^\(\s]*)\s*/);
                var name = match && match[1];
                Object.defineProperty(this, 'name', {
                    configurable: true,
                    enumerable: false,
                    writable: false,
                    value: name
                });
                return name;
            }
        });
    }
}));
//endregion
/** es6-sham END */

/** IE 8 or older addEventListener 垫片 */
//region addEventListener 垫片
if (document.all && !document.addEventListener) {

    Element.prototype.addEventListener = function (event, func) {
        // ie8统一标准事件
        var ie8eventName = event;
        var ie8EventsMap = {
            input: 'propertychange'
        };

        if (ie8EventsMap[event] != null) {
            ie8eventName = ie8EventsMap[event];
        }

        // 直接绑定到属性上
        var element = this;
        element.attachEvent('on' + ie8eventName,
            function (e) {
                e.currentTarget = element;
                e.target = e.srcElement;
                func.call(element, e);
            });
    };
}
//endregion
/** IE 8 or older END */