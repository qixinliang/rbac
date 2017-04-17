/**
 * Frame javascript,
 * (C) liuhuisong@hotmail.com
 */
'use strict';

var Frame = (function () {

    const MENU_AREA_ID = "menu-area";
    const TITLE_AREA_ID = "title-area";
    const CONTAINER_AREA_ID = "container-area";

    const TITLE_SEPARATE = '---';
    const TITLE_TOOLBAR = '---toolbar';

    $(document).ready(function () {
        menuInitialize();
    });

    /**
     * initialize menu area
     * @param first
     */
    function menuInitialize() {

        if (typeof menu_init == 'function') {
            var ul = $("#" + MENU_AREA_ID).find("ul");
            menu_init(ul);
            $(ul).find('ul:first').addClass('menu-list-view').addClass('scroll-vertical');
        } else {
            menuInitFinished();
        }
    }

    function menuAddItem(glyphicon, name, fun, param) {
        var item = $('<li><a href="#"><span class="' + glyphicon + '"></span>' + name + '</a></li>');
        $(item).find('a').prop('fun', fun).prop('param', param);

        $("#" + MENU_AREA_ID).find('ul:last').append(item);
        $(item).find('a').click(menuActive);
    }

    function menuInitFinished() {
        var area = $("#" + MENU_AREA_ID);

        $(area).find('li>a').click(menuActive);
        if ($(area).find('li.active').length == 0) {
            $("#" + MENU_AREA_ID).find("li>a")[0].click();
        }
    }

    /**
     *
     */
    function menuActive() {

        var id = $(this).attr("id");
        if (id) {
            id.replace(/[^a-zA-Z]/, "_");
        }

        $("#" + MENU_AREA_ID).find('li').removeClass('active');
        $(this).parent().addClass("active");

        titleEmpty();

        var param = $(this).prop('param');
        var fun = $(this).prop('fun');
        if (fun) {
            if (typeof fun == 'function') {
                fun(param, 1);
            } else {
                eval(fun)(param, 1);
            }
        } else {
            if (typeof (eval(id)) === "function") {
                eval(id)(0, 1);
            } else {
                console.warn(id + " not found");
                titleWarning(id + " not found");
            }
        }

        return;
    }


    /**
     *
     * @param lis
     * @param pageind
     */
    function titleInitialize(lis, pageind) {

        if (!lis || !(lis instanceof Array)) {
            titleWarning("数据错误");
            return;
        }

        var cb = data('title-area-onload');
        if ($.isFunction(cb)) {
            cb();
            data('title-area-onload', undefined);
        }

        var idNew = titleAreaCreate();
        var ta = $("#" + idNew);

        var ul = createNode("ul", "list-group title-area-view scroll-vertical");
        $(ta).append(ul);

        var ul2 = ul;
        for (var i = 0; i < lis.length; i++) {
            ul2 = titleAppend(ul2, lis[i].name, lis[i].fun, lis[i].param);
        }

        if (pageind /* && pageind.total > pageind.pageSize */) {
            var d = createPageInd(pageind);
            $(ta).append(d);
        }

        //clear to 0
        containerCurSelect(0);

        $(ul).find("li:first").click();
        return ul;
    }


    function titleActive() {

        var li = $(this);

        /////test mutiple
        var toolbar = $("#" + TITLE_AREA_ID).find('.toolbar:first');
        var mutiple = $(li).hasClass('mutiple');

        var param;
        if (mutiple) {
            $(toolbar).prevAll('li').removeClass('active');

            param = [];

            $(li).toggleClass('active');

            $(toolbar).next('ul').find('li').each(function (i, it) {
                if ($(it).hasClass('active')) {
                    param.push($(it).prop('fun-param'));
                }
            });
        } else {
            $("#" + TITLE_AREA_ID).find('li.active').removeClass('active');

            $(li).addClass("active");
            param = $(this).prop('fun-param');
        }
        ///

        var fun = $(li).prop("fun");
        fun.replace(/[^a-zA-Z]/, "_");

        try {
            eval(fun)(param);
        } catch (err) {
            console.warn(err);
            containerError(err);
        }
    }

    function titleUnload(fun) {
        data('title-area-onload', fun ? fun : undefined);
    }

    /**
     *
     * @param titleWidth 0 hide, 1-9 show
     */
    function titleShow(titleWidth) {
        if (!titleWidth) {
            $("#" + TITLE_AREA_ID).parent().hide();

            if ($("#" + CONTAINER_AREA_ID).hasClass("col-sm-8")) {
                $("#" + CONTAINER_AREA_ID).removeClass("col-sm-8")
            }
            ;

            //clear
            var w = $("#" + CONTAINER_AREA_ID).prop('title-width');
            if (w != 10 && $("#" + CONTAINER_AREA_ID).hasClass('col-sm-' + w)) {
                $("#" + CONTAINER_AREA_ID).removeClass('col-sm-' + w);
            }

            //sure to 10
            $("#" + CONTAINER_AREA_ID).prop('title-width', 10);
            if (!$("#" + CONTAINER_AREA_ID).hasClass("col-sm-10")) {
                $("#" + CONTAINER_AREA_ID).addClass("col-sm-10")
            }
            ;
        } else {

            if (titleWidth != 2) {
                if ($("#" + TITLE_AREA_ID).parent().hasClass("col-sm-2")) {
                    $("#" + TITLE_AREA_ID).parent().removeClass("col-sm-2");
                }
            }

            if (!$("#" + TITLE_AREA_ID).parent().hasClass("col-sm-" + titleWidth)) {
                $("#" + TITLE_AREA_ID).parent().addClass("col-sm-" + titleWidth);
            }
            $("#" + TITLE_AREA_ID).parent().show();


            var w = $("#" + CONTAINER_AREA_ID).prop('title-width');
            if (w != 10 - titleWidth) {
                if ($("#" + CONTAINER_AREA_ID).hasClass('col-sm-' + w)) {
                    $("#" + CONTAINER_AREA_ID).removeClass('col-sm-' + w);
                }
            }

            $("#" + CONTAINER_AREA_ID).prop('title-width', 10 - titleWidth);
            if (!$("#" + CONTAINER_AREA_ID).hasClass('col-sm-' + (10 - titleWidth))) {
                $("#" + CONTAINER_AREA_ID).addClass('col-sm-' + (10 - titleWidth));
            }
        }
    }

    function titleAdd(name, fun, param) {
        var ul = $('#' + TITLE_AREA_ID).find('ul:last');
        titleAppend(ul, name, fun, param);
    }

    function titleAppend(ul, name, fun, param) {

        if (!name) {
            return;
        }

        if (name == TITLE_SEPARATE) {
            $(ul).append("<br/>");
        } else if (name == TITLE_TOOLBAR) {
            var t = $(param);
            $(t).addClass('toolbar');
            $(ul).append(t);
            var ul2 = $('<ul class="nav nav-pills nav-stacked title-area-view2 scroll-vertical"></ul>');
            $(ul).append(ul2);
            ul = ul2;
        } else {
            var li = createNode("li", "list-group-item");

            $(ul).append(li);
            $(li).append(name);
            var s = nameOfFunction(fun);
            $(li).prop("fun", s);
            $(li).prop("fun-param", param);
            $(li).click(titleActive);

            $(ul).append(li);
        }

        return ul;
    }

    function titleEmpty() {

        $("#" + TITLE_AREA_ID).empty();
        containerEmpty();
    }

    function titleAreaCreate() {

        titleEmpty();
        $("#" + TITLE_AREA_ID).empty();

        var id = randomId();

        $("#" + TITLE_AREA_ID).append(createNode("div", null, null, id));

        return id;
    }

    function titleWarning(msg) {
        titleEmpty();

        var div = document.createElement("div");
        div.className = "panel panel-danger";

        var div1 = document.createElement("div");
        div1.className = "panel-heading";
        div1.appendChild(document.createTextNode(msg));
        div.appendChild(div1);

        $("#" + TITLE_AREA_ID).append(div);

        return;
    }

    function titleSelectEvent(event) {

        var ul2 = $("#" + TITLE_AREA_ID).find('ul>ul');
        if (ul2.length == 0) {
            return;
        }

        ul2 = ul2[0];

        var param = [];
        var fun;

        if (event == "mutiple") {
            $(ul2).prevAll('li').removeClass('active');

            $(ul2).find('li').each(function (i, li) {
                if (!$(li).hasClass('mutiple')) {
                    $(li).addClass('mutiple');
                }

                if ($(li).hasClass('active')) {
                    param.push($(li).prop('fun-param'));
                }
                fun = $(li).prop('fun');
            });
            //go on
        } else if (event == "single") {
            $(ul2).find('li').removeClass('mutiple');

            var fli = $(ul2).find('li.active:first');
            if (fli.length > 0) {
                $(ul2).find('li.active').removeClass('active');
                $(fli).click();
            } else {
                $(ul2).find('li:first').click();
            }
            return;
        } else if (event == 'sort') {
            $(ul2).prevAll('li').removeClass('active');
            return ul2;
        }

        if (event == "all") {

            $(ul2).prevAll('li').removeClass('active');

            $(ul2).find('li').each(function (i, li) {
                if (!$(li).hasClass('active')) {
                    $(li).addClass('active');
                }

                param.push($(li).prop('fun-param'));
                fun = $(li).prop('fun');
            });
        }

        if (event == "reverse") {

            $(ul2).prevAll('li').removeClass('active');

            $(ul2).find('li').each(function (i, li) {
                if ($(li).toggleClass('active').hasClass('active')) {
                    param.push($(li).prop('fun-param'));
                    fun = $(li).prop('fun');
                }
            });
        }

        if (fun == null) {
            fun = $(ul2).find('li:first').prop('fun');
        }

        if (fun) {
            if (typeof fun == 'function') {
                fun(param, 1);
            } else {
                eval(fun)(param, 1);
            }
        }
    }


    function containerEmpty() {

        $("#" + CONTAINER_AREA_ID).empty();
    }

    function containerAreaCreate() {

        containerEmpty();

        var id = randomId();

        $("#" + CONTAINER_AREA_ID).append(createNode("div", null, null, id));

        return id;
    }

    function containerError(msg) {

        var div = document.createElement("div");
        div.className = "panel panel-warning";

        var div1 = document.createElement("div");
        div1.className = "panel-heading";
        div1.appendChild(document.createTextNode(msg));
        div.appendChild(div1);

        $("#" + CONTAINER_AREA_ID).append(div);

        return;
    }

    function containerMessageBox(qobj, msg) {

        if (!msg) {
            msg = "请选择左边菜单操作";
        }

        var div = createNode("div", "panel panel-info panel-heading messagebox shadow", msg)
        qobj.append(div);
    }

    function containerCurSelect(n) {
        if (n == undefined) {
            return $('#' + CONTAINER_AREA_ID).prop('cur-selected');
        }

        $('#' + CONTAINER_AREA_ID).prop('cur-selected', n);
    }

    /*******************************************************************************
     *
     * @menuList [{glyphicon,name]}]
     */
    function containerInitialize(menuList) {

        if (menuList == undefined || !(menuList instanceof Array)) {
            containerEmpty("菜单项为空，或者类型不正确");
            return;
        }

        var idAdd = containerAreaCreate();

        var ul = createNode("ul", "nav nav-tabs");
        for (var i = 0; i < menuList.length; i++) {
            var item = menuList[i];

            var li = createNode("li", null, null, item.id);
            var a1 = createNodeWithGlyph(item.glyphicon, "a", null, " " + item.name);
            $(a1).prop("data-toggle", "tab");
            $(a1).prop("href", "#");
            $(li).append(a1);

            $(li).prop("id-add", idAdd + "-" + i);

            var s = nameOfFunction(item.fun);

            $(li).prop("fun", s);
            $(li).prop("param", item.param);

            if (item.right) {
                $(li).addClass("navbar-right");
            }

            $(li).click(function () {

                containerTabletActive(this);

                var li_num = $(this).prevAll('li').length;
                $('#' + CONTAINER_AREA_ID).prop('cur-selected', li_num);
            });

            $(ul).append(li);
        }

        $("#" + idAdd).append(ul);

        var div = createNode("div", "pannel general-padding");
        $("#" + idAdd).append(div);

        for (var i = 0; i < menuList.length; i++) {
            var item = menuList[i];

            var div1 = createNode("div", "panel container-tab-view", null, idAdd + "-" + i);
            $(div).append(div1);
        }

        var n = containerCurSelect();
        var lis = $(ul).children();
        if (n > 0 && lis.length > n) {
            lis[n].click();
        } else {
            // fire it
            lis[0].click();
        }
    }

    function containerTabletActive(obj, idAdd) {

        var id = $(obj).prop("id-add");
        if (!$(obj).hasClass("active")) {
            $(obj).addClass("active");
        }

        $(obj).siblings().removeClass("active");

        $("div#" + id).siblings().hide();
        $("div#" + id).fadeIn();

        var fun = $(obj).prop("fun");
        if (typeof fun == 'string') {
            var param = $(obj).prop("param");
            try {
                eval(fun)(param, $("#" + id));
            } catch (err) {
                console.warn(err);
            }
        } else {
            console.warn("no function");
        }
    }

    /*Tools*/
    function randomId() {
        return "id" + Math.ceil(Math.random() * 1000000);
    }

    function createNode(name, classname, text, id) {

        if (name == null) {
            if (text) {
                return document.createTextNode(text);
            }
            return null;
        }

        var div = document.createElement(name);
        if (classname) {
            div.className = classname;
        }

        if (text) {
            if (name == "input" || name == "textarea") {
                $(div).prop("placeholder", text);
            } else {
                $(div).append(text);
            }
        }

        if (id) {
            div.id = id;
        }

        return div;
    }

    function createInputWithLabel(type, title, holder, value, width, cls) {

        var div = createNode("div", "form-group " + (cls ? cls : ''));

        if (title) {
            var label = createNode("label", null, title + ":");
            div.appendChild(label);
        }

        var input = createNode("input", "form-control");
        $(input).attr("type", type);
        if (holder) {
            $(input).attr("placeholder", holder);
        }
        if (value) {
            $(input).attr("value", value);
        }
        if (width) {
            $(input).css("width", width);
        }
        div.appendChild(input);

        return div;
    }


    function createNodeWithGlyph(glyph, name, classname, text, id) {

        if (name == null) {
            if (text) {
                return createNode(null, null, text);
            }
            return null;
        }

        var div = createNode(name, classname, null, id);

        if (glyph && glyph.substring(0, 2) == "fa") {
            var s = "i";
        } else {
            var s = "span";
        }
        var span = createNode(s, glyph);// maybe i
        $(div).append(span);

        if (text) {
            if (name == "input" || name == "textarea") {
                $(div).attr("placeholder", text);
            } else {
                $(div).append(text);
            }
        }

        return div;
    }

    /**
     *
     * @param al array [ array(name,value),...]
     * @param title
     * @param fun
     * @param label
     * @returns {*}
     */
    function createDropDown(al, title, fun, opt) {

        var onlyOneChecked = true;

        //var id = randomId();
        if (!al) {
            return undefined;
        }

        var div = createNode("div", "dropdown");
        if (opt && opt.classname) {
            $(div).addClass(opt.classname);
        }

        var button = createNode("button", "btn btn-default dropdown-toggle", null, null);
        button.type = "button";
        $(button).attr("data-toggle", "dropdown");
        if (!title) {
            title = al[0].name;
        }

        var btn_title = Frame.Tools.createNode('span', null, title);
        $(button).append(btn_title);
        var caret = createNode("span", "caret caret-right");
        $(button).append(caret).appendTo(div);

        var ul = createNode("ul", "dropdown-menu");
        //$(ul).attr("aria-labelledby", id)

        var checked = false;

        for (var i = 0; i < al.length; i++) {
            var li;

            var s = al[i].name;
            var v = al[i].value;

            if (s == "---") {
                li = createNode("li", "divider");
            } else {
                li = createNode("li");

                var a = createNode("a");
                $(a).attr("href", "#");


                if (title == al[i].name && checked == false) {
                    al[i].checked = true;
                }

                if (al[i].checked && checked == false) {
                    checked = true;
                    $(a).append('<span class="glyphicon glyphicon-ok menu-checked"></span>');
                }

                $(a).append(s);
                $(li).append(a);

                $(li).prop("data", al[i]);

                $(li).click(function (e) {
                    var t = $(this).prop("data");
                    $(btn_title).empty().append(t.name);

                    if (fun) {
                        fun(t.value, t);

                        //if (t.checked) {
                        if (onlyOneChecked) {
                            $(this).siblings().find('span.menu-checked').remove();
                        }

                        var chk = $(this).find('span.menu-checked');
                        if (chk.length == 0) {
                            $(this).find('a').prepend('<span class="glyphicon glyphicon-ok menu-checked"></span>');
                        }
                        //} else {
                        //    $(this).find('span.menu-checked').remove();
                        //}
                    }

                    $(div).removeClass('open');
                    //$(button).attr('aria-expanded', 'false');
                    return false;
                });
            }

            $(ul).append(li);
        }

        $(div).append(ul);

        if (opt && opt.label) {
            var g = createNode("div", "form-group");
            $(g).append(createNode("label", null, opt.label + ":"));
            $(g).append(div);

            return g;
        }

        return div;
    }

    function createPanel(cls, head, body) {
        var div = createNode("div", "panel " + cls);
        if (head != undefined) {
            $(div).append($(createNode("div", "panel-heading")).append(head));
        }
        if (body != undefined) {
            $(div).append($(createNode("div", "panel-body")).append(body));
        }

        return div;
    }


    function createTableRow(cls, ra) {

        var tr = createNode("tr");
        if (ra) {
            if (ra instanceof Array) {
                for (var i = 0; i < ra.length; i++) {
                    var td = createNode("td", cls, ra[i]);
                    tr.appendChild(td);
                }
            } else {
                var td = createNode("td", cls, ra);
                tr.appendChild(td);
            }
        }
        return tr;
    }

    function createPageInd(pageind) {


        if (!pageind || !pageind.fun) {
            return null;
        }

        var numOfPageBtn = 6;
        if (typeof pageind.numOfPageBtn == 'number' &&
            pageind.numOfPageBtn > 1 && pageind.numOfPageBtn < 20) {
            numOfPageBtn = pageind.numOfPageBtn;
        }


        var num = Number(pageind.total);
        var size = Number(pageind.pageSize);
        var page = Number(pageind.current) + 1;// 0-order

        var fun = nameOfFunction(pageind.fun);

        function onPage() {
            var pg = $(this).prop('page');
            if (typeof pageind.fun == 'function') {
                pageind.fun(pageind.param, pg)
            } else if (typeof pageind.fun == 'string') {
                eval(fun)(pageind.param, pg);
            } else {
                console.log('pageind fun type error');
            }
            //return onclk + "('" + param + "'," + t + ")";
        }

        if (num <= size) {
            return createNode("div");
        }

        var p1 = 1;
        var pn = Math.ceil(num / size);
        if (page > pn) {
            page = pn;
        }

        p1 = page - Math.ceil(numOfPageBtn / 2);
        if (p1 < 1) {
            p1 = 1;
        }

        var p2 = p1 + numOfPageBtn - 1;
        if (p2 > pn) {
            p2 = pn;
            if (p2 > numOfPageBtn - 1) {
                p1 = p2 - (numOfPageBtn - 1);
            } else {
                p1 = 1;
            }
        }

        var ul = createNode("ul");
        $(ul).addClass("pagination pagination-sm title-pageind");

        var pre = $("<li><a href=\"#\" aria-label=\"上一页\"><span aria-hidden=\"true\">&laquo;</span></a></li>");
        $(pre).prop("title", "共" + pn + "页," + num + "条记录");

        if (p1 == 1) {
            $(pre).addClass("disabled");
        } else {
            var t = page - numOfPageBtn;
            if (t < 1) {
                t = 1;
            }
            $(pre).prop('page', t).click(onPage);
        }

        $(ul).append(pre);

        for (var i = p1; i <= p2; i++) {
            var li = createNode("li");
            $(li).append('<a href="#">' + i + '</a>');

            if (i == page) {
                $(li).addClass("active");
            } else {
                $(li).prop('page', i).click(onPage);
            }

            $(ul).append(li);
        }

        var next = $("<li><a href=\"#\" aria-label=\"下一页\"><span aria-hidden=\"true\">&raquo;</span></a></li>");

        $(next).prop("title", "共" + pn + "页," + num + "条记录");
        $(ul).append(next);
        if (p2 == pn) {
            $(next).addClass("disabled");
        } else {
            var t = page + numOfPageBtn;
            if (t > pn) {
                t = pn;
            }
            $(next).prop('page', t).click(onPage);
        }

        return ul;
    }


    function createPageView(div, ars, pageFun, pageSize) {

        if (!div || !ars || typeof pageFun != 'function' || !pageSize) {
            return false;
        }

        function onPage(dummy, page) {

            $(div).empty();
            var n = pageFun(div, ars, (page - 1) * pageSize, Math.min(page * pageSize, ars.length));

            var pageind = {
                total: ars.length,
                pageSize: pageSize,
                current: page - 1,
                fun: onPage,
                param: 0
            };

            var pg = createPageInd(pageind);
            if ($(pg).html() != "") {
                $(div).append('<br/>').append(pg);
            }

            return n;
        }

        return onPage(0, 1);
    }


    function createCheckBox(title, selected, span) {

        var classname = "checkbox";

        if (span) {
            var div = createNode("span"/*,classname*/);
        } else {
            var div = createNode("div", classname);
        }

        var label = createNode("label");

        var input = createNode("input");
        $(input).prop("type", "checkbox");
        if (selected) {
            $(input).prop("checked", true);
        }
        $(label).append(input);
        if (title) {
            $(label).append(createNode(null, null, title));
        }

        $(div).append(label);

        return div;
    }

    function createRadio(title, name, value, selected) {
        var s = '<div class="radio"><label><input type="radio"';
        if (name) {
            s += ' name="' + name + '"';
        }

        if (value != undefined) {
            s += ' value="' + value + '"';
        }

        if (selected) {
            s + ' checked="checked"';
        }

        s += '>' + title + '</label></div>';
        return $(s);
    }

    function data(key, val) {
        if (val != undefined) {
            $('html:first').data(key, val);
            return;
        }

        return $('html:first').data(key);
    }

    function nameOfFunction(fun) {
        if (typeof fun == 'function') {
            var s = fun.name;
            if (s == undefined) {
                s = fun.toString();
                s = s.substr('function '.length);
                s = s.substr(0, s.indexOf('('));
            }
            return s;
        } else if (typeof fun == 'string') {
            return fun;
        }

        return false;
    }

    function activeButton(btn, active) {
        if (active || active == undefined) {
            // enable it
            if ($(btn).hasClass("disabled")) {
                $(btn).removeClass("disabled");
            }
        } else {
            // disable it
            if (!$(btn).hasClass("disabled")) {
                $(btn).addClass("disabled");
            }
        }
    }


    function accessDenied(qobj, info) {
        if ($(qobj).html() == "") {
            var div = createNode("div", "access-denied shadow");
            $(qobj).append(div);

            if (!info) {
                info = "用户无权限";
            }

            var html = "<div class=\"panel panel-default padding-2 warning text-center\">"
                + "<span class='glyphicon glyphicon-ban-circle warning'></span>" + info
                + "</div>";

            $(div).append(html);
        }
    }

    function inlineEdit(div, fun) {

        $(div).click(function (e) {

            e.stopPropagation();

            var elem = $(this);
            if (elem.prop('inline-editing') == true) {
                return;
            }
            elem.prop('inline-editing', true);

            var pull_right = $(elem).hasClass('pull-right');

            var prev = $(elem).prev();
            var textOld = $(prev).text();

            var input_div = $('<input text="text" class="inline"/>');
            if (pull_right) {
                $(input_div).val(textOld).addClass('form-control inline-edit');
                elem.siblings().hide();
                elem.hide();
            } else {
                $(input_div).val(textOld).width($(prev).width() + 20);
                prev.hide();
                elem.hide();
            }

            elem.after(input_div);

            $(input_div).keydown(function (e) {
                if (e.keyCode == 13) {
                    saveValue();
                }
            });
            input_div.focus();

            input_div.blur(function () {
                saveValue();
            });

            function saveValue() {
                var textNew = $(input_div).val();
                if (textNew != '' && textNew != textOld) {
                    if (typeof fun == 'function') {
                        fun(prev, textNew);
                    } else {
                        $(prev).text(textNew);
                    }
                }
                $(input_div).remove();

                if (pull_right) {
                    elem.siblings().show();
                    elem.show();
                } else {
                    elem.show();
                    prev.show();
                }

                elem.prop('inline-editing', false);
            }
        });
    }

    function ButtonInfo(button, classname) {

        this.button = button;
        this.div = null;
        this.error_html = "";
        this.error_count = 0;

        // find
        var nd = $(button).next();
        if ($(nd).get(0) && ($(nd).get(0).tagName == "span" || $(nd).get(0).tagName == "SPAN")) {
            this.div = nd;
            $(this.div).empty();
        } else {
            if (classname == undefined) {
                // classname = "my-button-right";
            }
            this.div = $('<span class="button-info ' + classname + '"></span>');
            $(button).after(this.div);
        }

        this.clear = function (t) {

            $(this.div).empty();

            if (t) {
                this.error_html = t;
                $(this.div).html(this.error_html);
            }
        }

        this.validOk = function (div) {

            if (div) {
                if ($(div).hasClass("has-error")) {
                    $(div).removeClass("has-error");
                }
            }
        }

        this.validFailed = function (s, div) {

            if (s) {
                if (this.error_html != "") {
                    this.error_html += "/";
                }

                if (this.error_html.length > 16) {
                    this.error_html += ".";
                } else {
                    this.error_html += s;
                }

                $(this.div).html(this.error_html);
                if (!$(this.div).hasClass("warning")) {
                    $(this.div).addClass("warning");
                }
            }

            if (div) {
                if (!$(div).hasClass("has-error")) {
                    $(div).addClass("has-error");
                }
            }

            this.error_count++;
        }

        function humanRead(val) {
            if (val > 1024 * 1024 * 1024) {
                return Math.floor(val * 10 / (1024 * 1024 * 1024)) / 10 + 'G';
            }

            if (val > 1024 * 1024) {
                return Math.floor(val * 10 / (1024 * 1024)) / 10 + 'M';
            }

            if (val > 1024) {
                return Math.floor(val * 10 / (1024)) / 10 + 'K';
            }

            return val;
        }

        this.process = function (e) {
            if (typeof e == 'object' && e.max > 0) {
                var s = humanRead(e.value) + '/' +
                    humanRead(e.max) + ', ' + Math.floor(e.value * 100 / e.max) + '%';

                if (e.value == e.max) {
                    s = "100%, OK";
                    this.active(false);
                }

                this.ok(s);
            }
        };

        this.ok = function (s) {

            if (s == undefined) {
                s = "成功";
            }

            this.error_html = s;
            $(this.div).html(s);

            if ($(this.div).hasClass("warning")) {
                $(this.div).removeClass("warning");
            }

            if (!$(this.div).hasClass("green")) {
                $(this.div).addClass("green");
            }

            this.active(false);
        }

        this.failed = function (s) {

            if (s == undefined) {
                s = "失败";
            }

            this.error_html = s;
            $(this.div).html(s);

            if ($(this.div).hasClass("green")) {
                $(this.div).removeClass("green");
            }

            if (!$(this.div).hasClass("warning")) {
                $(this.div).addClass("warning");
            }
        }

        this.count = function () {

            return this.error_count;
        }

        this.wait = function (s) {

            if ($(this.div).hasClass("green")) {
                $(this.div).removeClass("green");
            }

            if (!$(this.div).hasClass("warning")) {
                $(this.div).addClass("warning");
            }

            if (s) {
                $(this.div).html(s);
            } else {
                $(this.div).html("...");
            }
        }

        this.active = function (b) {
            activeButton(this.button, b);
        }

        this.isActive = function () {

            return !this.isDisabled();
        }

        this.isDisabled = function () {

            if ($(this.button).hasClass("disabled")) {
                return true;
            }

            return false;
        }
    }

    function timeString(value) {
        var theTime = parseInt(value);
        if (isNaN(theTime)) {
            return '00:00:00';
        }

        var result = '';

        var sec = theTime % 60;
        var min = Math.floor(theTime / 60) % 60;
        var hour = Math.floor(theTime / 60 / 60) % 24;
        var days = Math.floor(theTime / 60 / 60 / 24);

        if (days) {
            result = days + 'd ';
        }

        if (hour > 9) {
            result += hour;
        } else {
            result += ('0' + hour);
        }

        result += ':';
        if (min > 9) {
            result += min;
        } else {
            result += ('0' + min);
        }

        result += ':';
        if (sec > 9) {
            result += sec;
        } else {
            result += ('0' + sec);
        }

        return result;
    }

    /**
     *
     * @param al=[{name:,glyphicon:,value:v];
     */
    function Tablet(al, fun) {

        var div = $('<div></div>');
        var nav = $('<ul class="nav nav-tabs"></ul>');
        var cont = $('<div></div>');
        $(div).append(nav).append(cont);

        $(al).each(function (i, it) {

            if (it.glyphicon) {
                var li = $('<li><a href="#"><span class="' + it.glyphicon +
                    '"></span>' + it.name + '</a></li>');
            } else {
                var li = $('<li><a href="#">' + it.name + '</a></li>');
            }
            $(nav).append(li);

            var t = $('<div></div>');
            $(cont).append(t);

            $(li).prop('data-div', t).prop('data-param', it.value).click(function () {
                $(this).addClass('active').siblings().removeClass('active');
                $(t).show().siblings().hide();
                fun(it.value, t);
            })
        });

        this.onPage = function (n) {
            if (isNaN(n)) {
                n = 0;
            }

            var ls = $(nav).children();
            if (ls.length > n) {
                ls[n].click();
            }
        }

        this.attachTo =function(div2){
            $(div2).append(div);
        }

        return this;
    }

    /**
     *
     *
     * var ADDR_DECODE_KEY = "7ff38ae0664064b71e3cb8a87de03892";// gaode web api key
     */

    function GaoDeMap() {

        // private
        var mapObject = null;
        var marker = null;
        var moveEvent = null;
        var geocoder = null;

        var longitude = null;
        var latitude = null;

        this.createById = function (id) {

            mapObject = new AMap.Map(id, {
                doubleClickZoom: false,
                resizeEnable: false
            });

            AMap.plugin(['AMap.ToolBar', 'AMap.Scale'], function () {

                var toolBar = new AMap.ToolBar();
                var scale = new AMap.Scale();
                mapObject.addControl(toolBar);
                mapObject.addControl(scale);
            });
        }

        this.edit = function (lnglat, zoom, fun) {

            if (lnglat == null) {
                lnglat = mapObject.getCenter();

                longitude = lnglat.getLng();
                latitude = lnglat.getLat();
            }

            markPoint(lnglat, zoom, fun);
            return;
        }

        function clearMark() {
            if (marker) {
                AMap.event.removeListener(moveEvent);
                mapObject.remove([marker]);
                marker = null;
            }
        }

        // private
        function markPoint(lnglat, zoom, fun) {

            longitude = lnglat[0];
            latitude = lnglat[1];

            clearMark();

            marker = new AMap.Marker({
                position: lnglat,
                draggable: true,
                cursor: 'move',
                raiseOnDrag: false,
                map: mapObject
            });

            moveEvent = AMap.event.addListener(marker, "dragend", function (meo) {

                var t = meo.lnglat;
                longitude = t.getLng();
                latitude = t.getLat();

                if (fun) {
                    if (geocoder == null) {
                        AMap.service('AMap.Geocoder', function () {

                            geocoder = new AMap.Geocoder();
                            getAddressFun(t, fun);
                        });
                    } else {
                        getAddressFun(t, fun);
                    }
                }
            });

            mapObject.setZoomAndCenter(zoom, lnglat);
        }

        function getAddressFun(lnglat, fun) {
            geocoder.getAddress(lnglat, function (status, result) {
                if (status === 'complete' && result.info === 'OK') {
                    var a = result.regeocode.addressComponent;
                    fun(longitude, latitude, a.province, a.city, a.district,
                        a.street + a.streetNumber);
                } else {
                    fun(longitude, latitude);
                }
            });
        }

        this.locationAddress = function (s, fun) {
            if (geocoder == null) {
                AMap.service('AMap.Geocoder', function () {

                    geocoder = new AMap.Geocoder();
                    location2map(s, fun);
                });
            } else {
                location2map(s, fun);
            }
        };

        this.locationByLngLat =function(lng,lat,type,zoom){
            if (marker) {
                if(!type){
                    type='gps';
                }

                if(!zoom){
                    zoom=16;
                }

                var lnglat = new AMap.LngLat(lng,lat);
                AMap.convertFrom(lnglat,type,function (status,result) {
                    if(status=='complete') {
                        marker.setPosition(result.locations[0]);
                        mapObject.setZoomAndCenter(zoom, result.locations[0]);
                    }
                });
            }
        };

        // private
        function location2map(name, fun) {

            geocoder.getLocation(name, function (status, result) {

                if (status === 'complete' && result.info === 'OK') {
                    if (!zoom) {
                        if (name.endsWith("省")) {
                            var zoom = 9;
                        } else if (name.endsWith("市")) {
                            var zoom = 11;
                        } else if (name.endsWith("区")) {
                            var zoom = 14;
                        } else {
                            zoom = 16;
                        }
                    }

                    var lnglat = new AMap.LngLat(result.geocodes[0].location.getLng(),
                        result.geocodes[0].location.getLat());

                    if (fun && typeof fun == 'function') {
                        fun(lnglat);
                    }

                    if (marker) {
                        marker.setPosition(lnglat);
                        mapObject.setZoomAndCenter(zoom, lnglat);
                    }
                }
            });
        }

        this.getLng = function () {
            return longitude;
        }

        this.getLat = function () {

            return latitude;
        }

        var markerList = [];

        this.addMarker = function (result, clear, fitView) {

            if (!mapObject) {
                console.log('no create?');
                return -1;
            }

            if (clear) {
                mapObject.clearMap();
                markerList = [];
            }

            if (!result || result.length == 0) {
                return 0;
            }

            var index = markerList.length;

            for (var i = 0; i < result.length; i++) {

                /*
                 * var t = '<div><h4>' + result[i].name + '</h4><hr class="hr-compact" />' + '<div
                 * class="text-marker">' + result[i].ecode + '</div></div>';
                 */

                var marker = new AMap.Marker({
                    position: [result[i].longitude, result[i].latitude],
                    map: mapObject,
                    title: result[i].name,
                    animation: AMap.Marker.AMAP_ANIMATION_DROP
                });

                markerList.push(marker);
                index++;
            }

            // mapObject.setZoomAndCenter(16, [ result[i - 1].longitude,
            // result[i - 1].latitude ]);
            if (fitView) {
                mapObject.setFitView(markerList);
            }

            return i;
        }
    }

    function containerItem(glyphicon, name, fun, param, isRight) {
        return {
            glyphicon: glyphicon,
            name: name,
            fun: fun,
            param: param,
            right: isRight
        };
    }

    function titleItem(name, fun, param) {
        return {
            name: name,
            fun: fun,
            param: param
        };
    }

    return {
        //menu
        menuInitialize: menuInitialize,
        menuAddItem: menuAddItem,
        menuInitFinished: menuInitFinished,

        ///title
        titleInitialize: titleInitialize,
        titleShow: titleShow,
        titleWarning: titleWarning,
        titleItem: titleItem,
        titleAdd: titleAdd,
        titleSelectEvent: titleSelectEvent,
        titleUnload: titleUnload,

        //container
        containerEmpty: containerEmpty,
        containerError: containerError,
        containerInitialize: containerInitialize,
        containerItem: containerItem,
        containerCurSelect: containerCurSelect,

        //Tools
        Tools: {
            randomId: randomId,
            createInputWithLabel: createInputWithLabel,
            createNode: createNode,
            createNodeWithGlyph: createNodeWithGlyph,
            createDropDown: createDropDown,
            createPanel: createPanel,
            createTableRow: createTableRow,
            createPageInd: createPageInd,
            createPageView: createPageView,
            createCheckBox: createCheckBox,
            createRadio: createRadio,

            activeButton: activeButton,
            accessDenied: accessDenied,

            inlineEdit: inlineEdit,
            data: data,
            timeString: timeString
        },

        ButtonInfo: ButtonInfo,
        GaoDeMap: GaoDeMap,
        Tablet: Tablet
    };
})();
