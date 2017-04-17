/**
 *
 */
"use strict";

function setDirty(div, hint) {
    $(div).prop('dirty', true);
    console.log('Dirty set:' + hint);
}

function checkDirty(div, hint) {
    if ($(div).prop('dirty') === true) {
        $(div).prop('dirty', false);
        console.log('Dirty unset:' + hint);
        return false;
    }
    return true;
}

function StatusTimer(sid2) {

    var sid = sid2;
    var timer = false;

    this.start = function () {
        if (!timer) {
            timer = window.setInterval(this.timerProc, 2000);
            console.log('StatusTimer started');
        }
    };

    this.runAtOnce = function (cid) {
        $.get("jsonApi.php", {
            api: "classStatusByCid",
            cid: cid
        }, function (r) {
            if (r.error == "OK") {
                var status = r.value[0].status;
                controlForm(cid, status);
                dnameForm(cid, status, r.value2);
            }
        });
    };

    this.stop = function () {
        if (timer) {
            window.clearInterval(timer);
            timer = null;
            console.log('StatusTimer stopped');
            return;
        }
    };

    this.timerProc = function () {
        var cid = $('input.SWITCH[name="dev-control"]').attr('cid');
        $.get("jsonApi.php", {
            api: "classStatusBySid",
            sid: sid,
            cid: cid
        }, function (r) {
            if (r.error == "OK") {
                var status = null;
                $(r.value).each(function (i, it) {
                    $('div.STATUS[cid="' + it.cid + '"]').empty()
                        .append(it.uuid?statusContent(it.status):'(无)')
                        .removeClass('status-active status-standby status-offline')
                        .addClass('status-' + it.status);

                    $('span.uuid[cid="'+it.cid+'"]').text(it.uuid);

                    if (cid == it.cid) {
                        status = it.status;
                        controlForm(cid, status);
                    }
                });

                dnameForm(cid, status, r.value2);
            }
        });
    };

    function controlForm(cid, status) {
        var t = $('input.SWITCH[cid="' + cid + '"][name="dev-control"]');
        if (checkDirty(t, 'control')) {
            if (status == 'active') {
                t.bootstrapSwitch('disabled', false);
                t.prop('state', true);
                t.bootstrapSwitch('state', true);
            } else if (status == 'standby') {
                t.bootstrapSwitch('disabled', false);
                t.prop('state', false);
                t.bootstrapSwitch('state', false);
            } else {
                t.bootstrapSwitch('disabled', true);
                t.prop('state', false);
                t.bootstrapSwitch('state', false);
            }
        }
    }

    function dnameForm(cid, status, value2) {
        if (status == 'active') {
            $('#dev-detail-view').show();
            $(value2).each(function (i, it) {
                var b = (it.status == 'on');//on/off

                if (it.dname == 'ops') {
                    var t = $('input.SWITCH[cid="' + cid + '"][name="dev-ops"]');
                    if (checkDirty(t, 'ops')) {
                        $(t).prop('state', b).bootstrapSwitch('state', b);
                        opsStatus(cid, b);
                        if (it.status2 == 'switched') {
                            inputChoose(cid, 'ops');
                            if (it.status2 == 'switched') {
                                inputChoose(cid, 'ops');
                            }
                        }
                    }
                } else if (it.dname == 'vga-in') {
                    if (it.status2 == 'switched') {
                        inputChoose(cid, 'vga-in');
                    }
                } else if (it.dname == 'hdmi-in') {
                    if (it.status2 == 'switched') {
                        inputChoose(cid, 'hdmi-in');
                    }
                } else if (it.dname == 'hdmi-out') {
                    var t = $('input.SWITCH[cid="' + cid + '"][name="dev-hdmi-out"]');
                    if (checkDirty(t, 'hdmi-out')) {
                        $(t).prop('state', b).bootstrapSwitch('state', b);
                    }
                } else if (it.dname == 'speaker') {
                    inputMute(cid, b);
                    var t = $('div.speaker-volume-slider[cid="' + cid + '"]');
                    if (checkDirty(t, 'volume')) {
                        $(t).prop('volume', it.status2).slider("option", "value", it.status2);
                    }
                }
            });
        } else if (status == 'standby') {
            $('#dev-detail-view').hide();
        } else {
            $('#dev-detail-view').hide();
        }
    }
}

function menu_init(ul) {

    var div = $('<ul class="nav nav-pills nav-stacked"></ul>');
    $(ul).append(div);

    $.getJSON("jsonApi.php", {
        api: "schoolList",
        user: _user
    }, function (result) {

        function addLi(name, sid) {
            var li = $('<li><a href="#"><span class="glyphicon glyphicon-home"></span>' +
                name + '</a></li>');
            $(li).find('a').prop('param', sid).prop('fun', 'menu_school');
            $(div).append(li);
        }

        if (result.error == 'OK') {
            var items = result.value;
            if ($(ul).css('overflow-y') == 'visible') {
                $(items).each(function (i, it) {
                    addLi(it.name, it.sid);
                });
                Frame.menuInitFinished();
            } else {
                Frame.Tools.createPageView(div, items, function (view, args, from, to) {
                    for (var i = from; i < to; i++) {
                        addLi(items[i].name, items[i].sid);
                    }
                    Frame.menuInitFinished();
                }, 10);
            }
        } else {
            Frame.menuInitFinished();
        }
    });
}

/**
 * all school
 * @param p
 * @param page
 */
function menu_schools(p, page) {
    Frame.titleShow(0);

    var lis = [Frame.containerItem("glyphicon glyphicon-globe", "校区分布", schoolMap, 1),
        Frame.containerItem("glyphicon glyphicon-list-alt", "学校详情", schoolList, 1)];

    // only admin can add school
    if (acCheckAcl('school')) {
        lis.push(Frame.containerItem("glyphicon glyphicon-plus", "增加学校", schoolAdd, 0, true));

        if (_user == 'admin') {
            lis.push(Frame.containerItem('glyphicon glyphicon-cloud-download',
                '设备批量升级管理', versionConfig, 0, true));
        }
    }

    Frame.containerInitialize(lis);
}

function classToolbar() {
    var toolbar = $('<div class="row"></div>');
    var c1 = Frame.Tools.createNode('div', 'col-sm-7');
    var c2 = Frame.Tools.createNode('div', 'col-sm-5');
    $(toolbar).append(c1).append(c2);

    var checkbox = Frame.Tools.createCheckBox('批量操作');
    $(checkbox).addClass('checkbox-inline');
    $(c1).append(checkbox);

    var all = $('<a href="#" class="class-toolbar-a">全选</a>');
    $(c1).append(all);
    $(all).hide();

    var reve = $('<a href="#" class="class-toolbar-a">反选</a>');

    $(checkbox).change(function () {
        var checked = $(this).find('input').prop('checked');

        if (checked) {
            $(all).show();
            $(reve).show();
        } else {
            $(all).hide();
            $(reve).hide();
        }

        Frame.titleSelectEvent(checked ? "mutiple" : "single");
    });

    $(all).click(function () {
        Frame.titleSelectEvent("all");
    });

    $(reve).click(function () {
        Frame.titleSelectEvent("reverse");
    });
    $(c1).append(reve);
    $(reve).hide();

    function sortByStatus1(a, b) {
        var ca = $(a).find('div.STATUS')[0];
        var cv1 = 1;
        if ($(ca).hasClass('status-active')) {
            cv1 = 3;
        } else if ($(ca).hasClass('status-standby')) {
            cv1 = 2;
        }

        var cb = $(b).find('div.STATUS')[0];
        var cv2 = 1;
        if ($(cb).hasClass('status-active')) {
            cv2 = 3;
        } else if ($(cb).hasClass('status-standby')) {
            cv2 = 2;
        }
        return cv1 - cv2;
    }

    function sortByStatus2(a, b) {
        return sortByStatus1(b, a);
    }

    function sortByCid1(a, b) {
        var ca = $(a).find('div.STATUS').attr('cid')[0];
        var cb = $(b).find('div.STATUS').attr('cid')[0];

        return ca - cb;
    }

    function sortByCname1(a, b) {
        var ca = $(a).find('[cname]').attr('cname');
        var cb = $(b).find('[cname]').attr('cname');

        if (ca == cb) {
            return 0;
        }

        if (ca > cb) {
            return 1;
        }

        return -1;

    }

    function sortByCname2(a, b) {
        return sortByCname1(b, a);
    }

    var al = [{
        name: '离线优先',
        value: 'status1'
    }, {
        name: '在线优先',
        value: 'status2'
    }, {
        name: '---'
    }, {
        name: '默认顺序',
        value: 'cid1'
    }, {
        name: '---'
    }, {
        name: '教室升序',
        value: 'cname1'
    }, {
        name: '教室降序',
        value: 'cname2'
    }, {
        name: '---'
    }, {
        name: '内容格式',
        value: 'line2'
    }];

    var sort = Frame.Tools.createDropDown(al, al[3].name, function (val) {
        var ul2 = $(toolbar).next('ul');

        var lis=null;

        if (val == 'status1') {
            lis = $(ul2).find('li').sort(sortByStatus1);
        } else if (val == 'status2') {
            lis = $(ul2).find('li').sort(sortByStatus2);
        } else if (val == 'cid1') {
            lis = $(ul2).find('li').sort(sortByCid1);
        } else if (val == 'cname1') {
            lis = $(ul2).find('li').sort(sortByCname1);
        } else if (val == 'cname2') {
            lis = $(ul2).find('li').sort(sortByCname2);
        } else if (val == 'line2') {
            $(ul2).find('.class-list-title2').toggleClass('HIDE');
            return;
        } else {
            return;
        }

        lis.detach().appendTo(ul2);
    });
    //$(sort).find('button').removeClass('btn-default');
    $(c2).append(sort);

    return toolbar;
}

/**
 * the school
 * @param sid
 * @param page
 */
function menu_school(sid, page) {
    Frame.titleShow(3);

    $.getJSON("jsonApi.php", {
        api: "getClasses",
        sid: sid,
        page: -1,//page - 1,
        user: _user
    }, function (result) {

        var lis = [{
            name: "校级管理中心",
            fun: schoolAll,
            param: sid
        }];

        if (result.error != "OK") {
            Frame.titleInitialize(lis);
        } else {
            var items = result.value;

            lis.push({
                name: "---"
            });


            var toolbar = classToolbar();
            lis.push({name: '---toolbar', param: toolbar});

            for (var i = 0; i < items.length; i++) {
                var s = '<div class="small row" cname="' + items[i].class_name + '">' +
                    '<div class="col-sm-2">' + statusDiv(items[i].status, items[i].cid, sid) + '</div>' +
                    '<div class="col-sm-10">' +

                    '<div class="row class-list-title-view-1">' +
                    '<div class="col-sm-8"><img class="img" src="icon/school-label.png"/>' + items[i].name + '</div>' +
                    '<div class="col-sm-4"><div class="pull-right disabled">' + items[i].class_name + '教室</div></div>' +
                    '</div>' +

                    '<div class="row class-list-title-view-2 class-list-title2">' +
                    '<div class="col-sm-12"><img src="icon/model-label.png"/>' +
                    '<span class="uuid" cid="'+items[i].cid+'">' + items[i].uuid + '</span></div>' +
                    /*'<div class="col-sm-8"><div class="pull-right"><img src="icon/uuid-label.png"/>' +
                     items[i].uuid.substr(0, 16) + '</div></div>' +*/
                    '</div>' +
                    '</div>' +
                    '</div>';

                /*
                 var s1 = runStatusString(items[i]) +
                 '<span title="' + items[i].class_name + '" cid="' + items[i].cid + '">' + items[i].name + '</span>'
                 remove inlineedit+'<span class="glyphicon glyphicon-edit inline-edit pull-right"></span>'*/

                lis.push({
                    name: s,
                    fun: classView,
                    param: items[i].cid
                });
            }

            /*
             var pageind = result.value2;
             pageind.fun = menu_school;
             pageind.param = sid;
             */

            var ul = Frame.titleInitialize(lis/*, pageind*/);

            /* remove inlineedit
             if(acCheckAcl('device')) {
             Frame.Tools.inlineEdit($(ul).find('span.inline-edit'), function (prev, t) {
             $.getJSON('jsonApi.php', {
             api: 'classNameUpdate',
             cid: $(prev).attr('cid'),
             text: t
             }, function (r) {
             if (r.error == 'OK') {
             $(prev).text(t);
             }
             })
             });
             }else{
             $(ul).find('span.inline-edit').remove();
             }
             */
        }

        var statusTimer = new StatusTimer(sid);
        statusTimer.start();
        Frame.titleUnload(function () {
            statusTimer.stop();
        });
    });
}

function schoolMap(param, qobj) {

    if ($(qobj).html() == "") {

        var id = "school-map-tab";
        var div = Frame.Tools.createNode("div", id, null, id);
        $(qobj).append(div);

        var mapSchool = new Frame.GaoDeMap();
        mapSchool.createById(id);

        $.getJSON("jsonApi.php", {
            api: "schoolList",
            user: _user
        }, function (result) {

            if (result.error != "OK") {

            } else {
                if (result.value.length > 0) {
                    mapSchool.addMarker(result.value, true, true);
                }
            }
        });
    }
}

function schoolMapIt(sid, qobj) {

    if ($(qobj).html() == "") {
        $(qobj).css('padding', '0px');
        var div = Frame.Tools.createNode("div", "school-map-tab", null, "school-it-" + sid);
        $(qobj).append(div);

        $.getJSON("jsonApi.php", {
            api: "schoolIt",
            sid: sid
        }, function (r) {
            if (r.error == "OK") {
                var map = new Frame.GaoDeMap();
                map.createById("school-it-" + sid);

                map.addMarker([{
                    longitude: r.value.longitude,
                    latitude: r.value.latitude
                }], true, true);
            }
        });

    }
}

function schoolList(param, qobj) {

    $(qobj).empty();

    $.getJSON("jsonApi.php", {
        api: "schoolList",
        user: _user
    }, function (result) {

        var div=null;
        if (result.error != "OK") {
            div = Frame.Tools.createNode("div", "padding-2 info", "没有数据");
            $(qobj).append(div);

        } else {

            div = Frame.Tools.createNode("div", "margin-2 padding-2");
            $(qobj).append(div);

            var div2 = Frame.Tools.createNode("div", "menu-list-view scroll-vertical");
            $(div).append(div2);

            var items = result.value;

            var tab = Frame.Tools.createNode("table", "table my-table-no-borader");
            $(div2).append(tab);

            var th = Frame.Tools.createNode("thead");
            $(tab).append(th);

            var row = Frame.Tools.createTableRow(null, ["", "名称", "类型", "地址", "教室"]);
            $(th).append(row);

            var ars=result.value;
            var n=0;
            for (var i = 0; i < ars.length; i++) {
                var del = null;
                if (Number(ars[i].classes) == 0) {
                    if (_user == 'admin' && false) {
                        //TODO:check it later
                        del = $("<span class=\"glyphicon glyphicon-remove my-remove\"></span>");
                        $(del).prop("data", ars[i].sid);

                        $(del).click(function () {
                            var sid = $(this).prop("data");
                            var tr = $(this).parentsUntil("tr").parent();
                            $.getJSON("jsonApi.php", {
                                api: "removeSchool",
                                sid: sid
                            }, function (r) {
                                if (r.error == "OK") {
                                    //menuRemoveSchool(sid);
                                    //$(tr).remove();
                                }
                            });
                        });
                    } else {
                        del = $("<span>0</span>");
                    }
                } else {
                    del = ars[i].classes;
                    n+=parseInt(del);
                }

                row = Frame.Tools.createTableRow(null, [i + 1, ars[i].name,
                    ars[i].level, ars[i].address, del]);
                $(row).attr("sid", ars[i].sid);
                $(tab).append(row);
            }

            $(div).append('<br/><div>班级总数:'+(n?n:0)+
                '，一体机数：'+(result.value2?result.value2:0)+'</div>');

            var export_div=$('<a href="jsonApi.php?api=exportSchoolList&user='+_user+'">下载数据</a>');
            $(div).append(',').append(export_div);
        }
    });
}

function schoolEdit(sid, qobj) {

    if ($(qobj).html() == "") {

        var div = Frame.Tools.createNode("div");
        $(qobj).append(div);

        $.getJSON("jsonApi.php", {
            api: "schoolIt",
            sid: sid
        }, function (result) {

            if (result.error == "OK") {
                schoolForm(div, result.value);
            }
        });
    }
}

function schoolAdd(param, qobj) {

    if ($(qobj).html() == "") {
        schoolForm(qobj, false);
    }
}

function schoolForm(qobj, edit_result) {

    $.getJSON("jsonApi.php", {
        api: "levelList"
    }, function (level) {

        var map = null;
        var lng, lat, prov, city, dist, street;

        var div = Frame.Tools.createNode("div", 'margin-2');
        $(qobj).append(div);

        // ///////////////////////////////
        var row = Frame.Tools.createNode("div", "row");
        $(div).append(row);

        var b1 = Frame.Tools.createNode("div", "col-sm-5");
        $(row).append(b1);

        var b2 = Frame.Tools.createNode("div", "col-sm-7");
        $(row).append(b2);

        var g = Frame.Tools.createNode("div", "form-group");
        // var mapTitle = Frame.Tools.createNode("label", null, "标识准确位置:");
        // $(g).append(mapTitle);
        var idMap = edit_result ? "school-map-edit" : "school-map-add";

        var map_root = Frame.Tools.createNode("div", idMap + ' shadow', null, idMap);
        $(g).append(map_root);
        $(b2).append(g);

        // ////////////////////////
        // B1
        var b3 = Frame.Tools.createNode("div", "padding-1");
        $(b1).append(b3);

        var name_div = Frame.Tools.createInputWithLabel("text", "学校名称", "4-16个字符以内");
        $(b3).append(name_div);
        if (edit_result) {
            $(name_div).find("input").val(edit_result.name);
        }

        $(b3).append("<br/>");
        var level_val = 3;// zhongxue
        if (edit_result) {
            level_val = edit_result.lid;
        }
        var lt = level.value[level_val].name;


        var level_div = Frame.Tools.createDropDown(level.value, lt, function (v) {
            level_val = v;
            Frame.Tools.activeButton(button, true);
        }, {label:"学校类型"});
        $(b3).append(level_div);

        var s = edit_result ?
            (edit_result.province + edit_result.city + edit_result.dist + edit_result.street) : null;
        var addr_div = Frame.Tools.createInputWithLabel('text', '地址',
            '(输入地址，或拖动地图标识)', s);
        $(b3).append("<br/>").append(addr_div);

        var button = Frame.Tools.createNodeWithGlyph("glyphicon glyphicon-ok", "button",
            "btn btn-default my-button my-button-right", edit_result ? "修改" : "增加");
        Frame.Tools.activeButton(button, false);

        $(b3).append("<hr/>").append(button);

        $(name_div).find("input").change(function () {
            Frame.Tools.activeButton(button, true);
        });

        $(button).click(function () {

            var si = new Frame.ButtonInfo(this);
            if (si.isDisabled()) {
                return;
            }

            if (level_val == -1) {
                si.validFailed("学校类型没有选择", level_div);
            } else {
                si.validOk(level_div);
            }

            var sname = $(name_div).find("input").val();
            if (sname == "" || sname.length > 16) {
                si.validFailed("学校名称大于16个字符", name_div);
            } else {
                si.validOk(name_div);
            }

            if (!lng || !lat || (!edit_result && (!prov || !city || !dist || !street))) {
                si.validFailed("地址必须指定省市区街道");
            }

            if (si.count() > 0) {
                return;
            }

            si.wait();
            $.getJSON("jsonApi.php", {
                api: "schoolAdd",
                name: sname,
                lid: level_val,
                lng: lng,
                lat: lat,
                prov: prov,
                city: city,
                dist: dist,
                street: street,
                sid: (edit_result ? edit_result.sid : null),
                group: true
            }, function (r) {
                if (r == undefined || r.error != "OK") {
                    si.failed();
                } else {
                    si.ok();
                    if (!edit_result) {
                        $(name_div).find("input").val("");
                        Frame.menuAddItem('glyphicon glyphicon-unchecked', sname, 'menu_school', r.value);
                    }
                }
            })
        });

        // call after mount this node
        map = new Frame.GaoDeMap();
        map.createById(idMap);

        window.navigator.geolocation.getCurrentPosition(function (position) {
            var lng = position.coords.longitude;
            var lat = position.coords.latitude;

            map.locationByLngLat(lng,lat);
        });

        var old = null;
        if (edit_result) {
            lng = edit_result.longitude;
            lat = edit_result.latitude;
            old = [lng, lat];
        }

        $(addr_div).find('input').keypress(function(event){
            if(event.keyCode==0x0d){
                var s=$(this).val();
                if(s){
                    $(this).focusout();
                }
            }
        });

        $(addr_div).find('input').change(function () {
            var s = $(this).val();

            if (!s) {
                return;
            }

            var index = s.indexOf('省');
            if (index == -1) {
                prov = '湖北省';
            } else {
                prov = s.substr(0, index);
                s=s.substr(index+1);
            }


            index = s.indexOf('市');
            if (index == -1) {
                city = '武汉市';
            } else {
                city = s.substr(0, index);
                s=s.substr(index+1);
            }


            index = s.indexOf('区');
            if (index == -1) {
                dist = '蔡甸区';
            } else {
                dist = s.substr(0, index);
                s=s.substr(index+1);
            }

            street = s;
            if(street) {

                $(this).prop('no-change', true);

                map.locationAddress(prov+city+dist+street, true, function (lnglat) {
                    lng = lnglat.getLng();
                    lat = lnglat.getLat();
                });

                return;
            }

            map.locationAddress(s, true);
        });

        map.edit(old, 15, function addressSave(x, y, p, c, d, s) {
            lng = x;
            lat = y;
            prov = p;
            city = c;
            dist = d;
            street = s;
            if ($(addr_div).find('input').prop('no-change')) {
                $(addr_div).find('input').prop('no-change', false);
            } else {
                $(addr_div).find('input').val(p + c + d + s);
            }

            Frame.Tools.activeButton(button, true);
        });
    });
}

function versionConfig(dummy1, qobj) {
    if ($(qobj).html() == '') {
        var div = Frame.Tools.createNode('div', 'margin-2 padding-2');
        $(qobj).append(div);

        $.getJSON('jsonApi.php', {
            api: 'devVersionConfig'
        }, function (r) {
            if (r.error = 'OK') {

                var tab = Frame.Tools.createNode('table', 'table');
                $(div).append(tab);

                var row = Frame.Tools.createTableRow(null, ['硬件名称', '分支名称', '版本', 'build',
                    'MD5', '发布', '升级时段', '升级']);
                var thead = Frame.Tools.createNode('thead');
                $(thead).append(row).appendTo(tab);

                var tbody = Frame.Tools.createNode('tbody');
                $(tab).append(tbody);

                $(r.value).each(function (i, it) {

                    var st;
                    if (it.allow == 'enable') {
                        st = $('<span class="glyphicon glyphicon-ok green"></span>');
                    } else if (it.allow == 'disabled') {
                        st = $('<span class="glyphicon glyphicon-remove warning"></span>');
                    } else {
                        st = it.allow;
                    }

                    var ver = '<a href="' + it.url + '" title="' + it.url + '">' + it.version + '</a>';
                    var md5 = '<div class="' + (it.md5auth ? 'green' : 'version-error') + '">' + it.md5 + '</div>';
                    var be = it.begin + ' ~ ' + it.end;

                    row = Frame.Tools.createTableRow(null, [it.dev, it.branch, ver, it.build,
                        md5, it.release, be, st]);
                    $(tbody).append(row);
                });

                if(r.value2){
                    $(div).append('<hr/><div>允许升级学校：'+r.value2+'</div>');
                }
            }
        });
    }
}

function schoolAll(sid, qobj) {
    var lis = [];

    lis.push(Frame.containerItem("glyphicon glyphicon-globe", "地图", schoolMapIt, sid))
    lis.push(Frame.containerItem("glyphicon glyphicon-alert", "告警", schoolAlert, sid));

    if (acCheckAcl('school')) {
        lis.push(Frame.containerItem("glyphicon glyphicon-phone", "短信通知", alertSmList, sid));

        lis.push(Frame.containerItem("glyphicon glyphicon-plus-sign", "增加班级", classAdd, sid, true));
        lis.push(Frame.containerItem("glyphicon glyphicon-edit", "修改信息", schoolEdit, sid, true));
    }

    Frame.containerInitialize(lis);
}

function ccidButtonClicked() {
    if ($(this).hasClass("disabled")) {
        return;
    }

    var ccid = $(this).prop('ccid');//maybe array
    if (!ccid) {
        return;
    }

    var act = 'on';
    if ($(this).find("i").hasClass('fa-toggle-on')) {
        var act = 'off';
    }

    Frame.Tools.activeButton(this, false);

    $.getJSON("jsonApi.php", {
        api: "deviceControlPower",
        cid: ccid,
        power: act
    }, function (r) {
        if (r.error == "OK") {

        }
    });
}


function schoolAlert(sid, qobj) {

    if ($(qobj).html() == "") {
        var div = Frame.Tools.createNode("div", 'margin-2 padding-2');
        $(qobj).append(div);

        var al = [{
            name: "未处理告警",
            value: "uncheck"
        }, {
            name: "已处理告警",
            value: "checked"
        }, {
            name: "所有告警",
            value: "all"
        }];

        var dn = Frame.Tools.createDropDown(al, al[0].name, function (v) {
            $(div2).prop('check', v);
            alertView(sid, 1);
        });
        $(div).append(dn).append('<br/>');

        var div2 = Frame.Tools.createNode("div", null, null, "alert-view-" + sid);
        $(div2).prop('check', al[0].value);

        $(div).append(div2);
        alertView(sid, 1)
    }
}

function alertSmList(sid, qobj) {

    if ($(qobj).html() == "") {
        var div = Frame.Tools.createNode("div", 'margin-2 padding-2');
        $(qobj).append(div);

        var alertDest = Frame.Tools.createNode('div', 'form-group');
        var alert_input = Frame.Tools.createInputWithLabel('text', '短信通知', '逗号分隔的手机号码', null, 'form-control');
        var alert_btn = Frame.Tools.createNodeWithGlyph('glyphicon glyphicon-floppy-disk', 'button',
            "btn btn-default my-button my-button-right form-control", "保存");
        $(alertDest).append(alert_input).append(alert_btn);
        Frame.Tools.activeButton(alert_btn, false);

        $(div).append(alertDest);

        $.get('jsonApi.php', {
            api: 'getSchoolSm',
            sid: sid
        }, function (r) {
            if (r.error == 'OK') {
                $(alert_input).find('input').val(r.value.mobile);
            }
        });

        $(alert_input).find('input').keypress(function () {
            Frame.Tools.activeButton(alert_btn);
        });
        $(alert_input).find('input').change(function () {
            Frame.Tools.activeButton(alert_btn);
        });

        $(alert_btn).click(function () {
            var si = new Frame.ButtonInfo(this);

            var val = $(alert_input).find('input').val();
            var pat = /^(13|15|18)\d{9}$/;
            var val2 = val.split(/[,\s]/);
            var e = '';
            var val3 = [];
            $(val2).each(function (i, it) {
                if (!pat.test(it)) {
                    if (e) {
                        e += ',';
                    }
                    e += it;
                } else {
                    val3.push(it);
                }
            });
            if (e) {
                si.validFailed('手机号码错误:' + e);
            }

            if (si.count()) {
                return;
            }

            $.post('jsonApi.php', {
                api: 'setSchoolSm',
                sid: sid,
                mobile: val3
            }, function (r) {
                if (r.error == 'OK') {
                    si.ok();
                    Frame.Tools.activeButton(alert_btn, false);
                } else {
                    si.failed(r.value);
                }
            })
        });
    }
}

function alertView(sid, page) {
    var id = "alert-view-" + sid;

    var div = $("#" + id);
    var check = $(div).prop('check');

    function checkEvent(did, tr) {
        var td = $('<td colspan="3" class="form-inline"></td>');
        var input = Frame.Tools.createInputWithLabel("text", null, "处理意见");
        // $(input).find("input").addClass("alert-text-input");
        var button = Frame.Tools.createNodeWithGlyph("glyphicon glyphicon-ok", "button", "btn btn-link");
        $(td).append(input).append(button).appendTo(tr);

        $(td).prop('did', did);
        $(td).prop('input', input);

        $(td).find("button").click(function () {
            var val = $(input).find("input").val();
            if (val && did) {
                $.getJSON("jsonApi.php", {
                    api: "checkAlert",
                    note: val,
                    did: did,
                    user: _user
                }, function (r) {
                    if (r.error == 'OK') {
                        $(td).empty().append(val).attr("colspan", "1");
                        $(tr).append("<td>刚才</td><td>" + _user + "</td>");
                        $(tr).find('td').removeClass('warning').addClass('green');
                    }
                });

            }
        });
    }

    $.getJSON("jsonApi.php", {
        api: "alertList",
        sid: sid,
        check: check,
        user: _user,
        page: page - 1
    }, function (r) {
        $(div).empty();

        if (r.error == 'OK') {

            var tab = Frame.Tools.createNode("table", "table");
            $(div).append(tab).append('<br/>');

            var tr = Frame.Tools.createTableRow(null,
                ['ID', '教室名称', '时间', '设备/端口', '事件', '处理', '处理时间', '责任人']);
            $(tab).append(tr);

            $(r.value).each(
                function (i, it) {

                    if (it.dname == 'main' || it.dname == 'controller') {
                        var dname = "中控";
                    } else {
                        dname = it.dname;
                    }

                    var ename = it.event;
                    if (it.event == 'disconnected' || it.event == 'offline') {
                        ename = '断线';
                    } else if (it.event == 'post' || it.event == 'post-error') {
                        ename = '自检出错';
                    } else if (it.event == 'error') {
                        ename = '未知错误';
                    }

                    if (it.checked) {
                        // var chk = $("<span class=\"glyphicon
                        // glyphicon-check\"></span>");
                        tr = Frame.Tools.createTableRow("green",
                            [it.did, it.cname, it.created, dname, ename, it.note,
                                it.checked, it.uname]);
                    } else {
                        // var chk = $("<span class=\"glyphicon
                        // glyphicon-unchecked\"></span>");
                        tr = Frame.Tools.createTableRow("warning",
                            [it.did, it.cname, it.created, dname, ename]);
                        if (acCheckAcl('alert')) {
                            checkEvent(it.did, tr);
                        }
                    }

                    $(tab).append(tr);
                });

            var pageind = r.value2;
            pageind.fun = alertView;
            pageind.param = sid;

            var div2 = Frame.Tools.createPageInd(pageind);
            $(div).append(div2);

        } else {
            $(div).append('<div class="alert alert-warning">无数据</div>');
        }
    });
}

function classAdd(sid, qobj) {

    if ($(qobj).html() != '') {
        return;
    }

    var div = Frame.Tools.createNode('div', 'margin-2 padding-2 form-group');
    $(qobj).append(div);

    var row = $('<div class="row"></div>');
    var c1 = $('<div class="col-sm-5"></div>');
    var cm = $('<div class="col-sm-1">' +
        '<br/><br/><br/><br/><br/><br/><div class="glyphicon glyphicon-arrow-right"></div>' +
        '</div>');
    var c2 = $('<div class="col-sm-6"></div>');
    $(row).append(c1).append(cm).append(c2).appendTo(div);

    $(c1).append('<label>班级信息：</label>');
    var input = $('<textarea class="form-control" rows="16"></textarea>');

    var s = '<div class="small">每一行格式为：\"教室名称 教室编号\"，空格分隔</div>';
    $(c1).append(input).append(s);

    $(c2).append('<div class="col-sm-1"></div>' +
        '<div class="col-sm-3">教室名称</div>' +
        '<div class="col-sm-5">教室编号</div>' +
        '<div class="col-sm-3"></div>');

    var rzt = $('<div class="col-sm-12 class-add-view scroll-vertical"></div>');
    $(c2).append(rzt);

    var button = Frame.Tools.createNodeWithGlyph("glyphicon glyphicon-ok", "button",
        "btn btn-default my-button my-button-right", "确定");
    $(div).append('<hr/>').append(button);
    Frame.Tools.activeButton(button, false);

    var classes = [];
    var error = 0;

    function onRzt() {

        var s = $(input).val().replace(/[<>]/g, '');
        if (s == '') {
            Frame.Tools.activeButton(button, false);
            return;
        }

        var lines = s.split('\n', 300);

        $(rzt).empty();
        classes = [];

        error = 0;
        $(lines).each(function (i, it) {
            var nt = it.trim();
            if (nt == '') {
                $(rzt).append('<div class="row">' +
                    '<div class="col-sm-offset-2 col-sm-10 green">(空行)</div>' +
                    '</div>');
            } else {
                var t = nt.split(/[,\s\<\>]+/);

                var va='';
                if(t.length==2) {
                    for (var j = 0; j < t[1].length; j++) {
                        if (t[1][j] >= 'a' && t[1][j] <= 'z' ||
                            t[1][j] >= 'A' && t[1][j] <= 'Z' ||
                            t[1][j] >= '0' && t[1][j] <= '9' ||
                            t[1][j] == '-' ||t[1][j] == '_' ||t[1][j] == '/') {

                        } else {
                            va = '非法字符:'+t[1][j];
                            break;
                        }
                    }
                }else{
                    va='格式错误';
                }

                if (va=='') {
                    classes.push({code: t[1], name: t[0]});

                    $(rzt).append('<div class="row">' +
                        '<div class="col-sm-1">' + classes.length + '</div>' +
                        '<div class="col-sm-3 green">' + (t[0]) + '</div>' +
                        '<div class="col-sm-5 green">' + (t[1]) + '</div>' +
                        '<div class="col-sm-2 green">OK</div>'+
                        '</div>');
                } else {
                    $(rzt).append('<div class="row">' +
                        '<div class="col-sm-offset-1 col-sm-8">' + it + '</div>' +
                        '<div class="col-sm-2 warning">' + va + '</div>' +
                        '</div>');
                    error++;
                }
            }
        });

        if (classes.length > 0 && error == 0) {
            Frame.Tools.activeButton(button);

        } else {
            Frame.Tools.activeButton(button, false);
        }
    }

    $(button).click(function () {
        var si = new Frame.ButtonInfo(this);

        onRzt();

        if (classes.length == 0) {
            si.validFailed('没有班级信息');
            return;
        }

        if (error > 0) {
            si.validFailed('班级信息有误');
            return;
        }

        $.post('jsonApi.php', {
            api: 'classAdd',
            sid: sid,
            classes: classes
        }, function (r) {
            if (r.error == 'OK') {
                Frame.Tools.activeButton(button, false);
                $(input).val('');
                si.ok('已经增加了' + r.value + '个班级');
            } else {
                si.failed(r.value);
            }
        });
    });

    $(input).keyup(onRzt);
}

function classView(cid) {

    if ($.isArray(cid)) {
        return classViewMutiple(cid);
    }

    var lis = [
        Frame.containerItem("glyphicon glyphicon-wrench", "控制", classControl, cid),
        Frame.containerItem("glyphicon glyphicon-comment", "大屏推送", deviceMessage, cid),
        Frame.containerItem("glyphicon glyphicon-stats", "统计", classTimeStat, cid),
        Frame.containerItem("glyphicon glyphicon-stats", "能耗", powerOnStat, cid)];

    if (acCheckAcl('device')) {
        lis.push(Frame.containerItem("glyphicon glyphicon-off", "关机", devicePoweroff, cid));
        lis.push(Frame.containerItem("glyphicon glyphicon-cog", "配置", deviceConfig, cid, true));
        lis.push(Frame.containerItem("glyphicon glyphicon-wrench", "硬件", deviceVersion, cid, true));
    }

    Frame.containerInitialize(lis);
}

function classViewMutiple(cids) {
    var lis = [Frame.containerItem("glyphicon glyphicon-wrench", "控制", classControlMutile, cids),
        Frame.containerItem("glyphicon glyphicon-comment", "消息推送", deviceMessage, cids),
        Frame.containerItem("glyphicon glyphicon-stats", "时长统计", schoolTimeStat, cids)];

    if (acCheckAcl('device')) {
        lis.push(Frame.containerItem("glyphicon glyphicon-off", "关机", devicePoweroff, cids));
    }

    Frame.containerInitialize(lis);
}


function powerOnStat(cid, qobj) {

    if ($(qobj).html() == '') {

        var div = Frame.Tools.createNode('div', 'margin-2 padding-2');
        $(qobj).append(div);

        $.getJSON('jsonApi.php', {
            api: 'powerOnStat',
            cid: cid
        }, function (result) {
            if (result.error == 'OK') {

                var ui = Frame.Tools.createNode('div', 'panel panel-default padding-1');
                $(div).append(ui);

                var s = $('<div class="row">' +
                    '<div class="col-sm-4"><label>开机总时长: </label>' +
                    Frame.Tools.timeString(result.value.sec) + '</div>' +
                    '<div class="col-sm-4"><label>能耗: </label>' +
                    Math.round((result.value.sec * result.value.wat) / 3600) + ' (千瓦时)</div>' +
                    '<div class="col-sm-4"><label>开机次数: </label>' +
                    result.value.count + ' 次</div></div>');

                $(ui).append(s);

                if (result.value2 && result.value2.length > 0) {

                    var tab = Frame.Tools.createNode('table', 'table');
                    $(div).append('<br/>').append(tab);

                    var th = Frame.Tools.createNode('thead');
                    var row = Frame.Tools.createTableRow(null, ['开机日期', '周次', '开机时间', '时长']);
                    $(th).append(row).appendTo(tab);

                    var tb = Frame.Tools.createNode('tbody');
                    $(tab).append(tb);

                    var wd = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

                    $(result.value2).each(function (i, it) {
                        var row = Frame.Tools.createTableRow(null,
                            [it.first.substr(0, 10), wd[it.weekday % 7], it.first.substr(11), it.timelen]);

                        $(tb).append(row);
                    });

                    $(div).append('<div class="small">(最后' + result.value2.length + '次开机信息)</div>');
                }
            }
        });
    }
}

function classSwitched(e, st) {
    if ($(this).prop('state') === st) {
        return;
    }

    $(this).prop('state', st);
    var name = $(this).attr('name');
    if (name.substr(0, 4) == 'dev-') {
        name = name.substr(4);
    }

    setDirty(this, name);

    var cid = $(this).attr('cid');
    if (name == 'ops') {
        opsStatus(cid, st);
    }

    $.getJSON('jsonApi.php', {
        api: 'classSwitch',
        cid: cid,
        name: name,
        status: st ? 'on' : 'off'
    }, function (r) {
        if (r.error != 'OK') {
            console.warn('classSwitch failed');
        }
    });
}

function classControlMutile(cids, qobj) {
    if ($(qobj).html() == "") {

        var div = Frame.Tools.createNode("div", 'margin-2 padding-2');
        $(qobj).append(div);

        if (!acCheckAcl('device')) {
            $(div).append('<div class="panel panel-default padding-2 warning">本用户无控制权限</div>');
            return;
        }

        if (cids.length == 0) {
            $(div).append('<div class="panel panel-default padding-2 warning">未选中任何教室</div>');
            return;
        }

        $(div).append('<div>已选中' + cids.length + '教室</div>');
        $(div).append('<hr/>');

        var bg = $('<div class="btn-group"></div>');

        var al = [{
            name: '开机',
            value: 'on'
        }, {
            name: '关机',
            value: 'off'
        }];
        var val_control = al[0].value;
        var t2 = Frame.Tools.createDropDown(al, al[0].name, function (v) {
            val_control = v;
        },{classname:'btn-group'});

        var button_power = Frame.Tools.createNodeWithGlyph("glyphicon glyphicon-ok", "button",
            "btn btn-default my-button my-button-right", "确定");
        $(bg).append(t2).append(button_power);
        $(button_power).click(function () {
            $.getJSON('jsonApi.php', {
                api: 'classSwitch',
                cid: cids,
                name: 'control',
                status: val_control
            }, function (r) {
                if (r.error != 'OK') {
                    console.warn('classSwitch failed');
                }
            });
        });

        $(div).append(bg).append('<hr/><label>视频输入切换:</label>');

        var dev_input = $('<div class="row">' +
            '<div class="col-sm-3 dev-input-view" cid="0">' +
            '<img class="img" name="hdmi-in" src="icon/dev-hdmi-in.png"/>' +
            '<div class="text-center">HDMI</div></div>' +
            '<div class="col-sm-3 dev-input-view" cid="0">' +
            '<img class="img" name="vga-in" src="icon/dev-vga-in.png"/>' +
            '<div class="text-center">VGA</div></div>' +
            '<div class="col-sm-3 dev-input-view" cid="0">' +
            '<img  class="img" name="ops" src="icon/dev-ops.png"/>' +
            '<div class="text-center">内置电脑</div></div>' +
            '</div>');
        $(div).append(dev_input).append('<hr/>');

        $(dev_input).find('.dev-input-view').click(function () {
            var name = $(this).find('img').attr('name');
            if (inputChoose(0, name)) {
                $.getJSON("jsonApi.php", {
                    api: "deviceDnameSwitch",
                    cid: cids,
                    dname: name
                }, function (r) {
                    if (r.error != 'OK') {
                        console.error('error:' + r.value);
                    }
                });
            }
        });

        var vol_div = $('<div class="row">' +
            '<div class="col-sm-12"><img class="img img-device-label" src="icon/dev-vol-label.png"/>' +
            '<label>主音量:</label>' +
            '<div class="speaker-volume-slider"  cid="0"></div>' +
            '<div class="speaker-mute"  cid="0"><img src="icon/dev-mute.png"/></div>' +
            '</div></div>');
        $(div).append(vol_div);

        var vol_slider = $(vol_div).find('div.speaker-volume-slider');
        $(vol_slider).slider({
            min: 0,
            max: 100,
            value: 70,
            slide: function (event, ui) {
                var old = $(this).prop('volume');
                if (old == ui.value) {
                    return;
                }
                $(this).prop('volume', ui.value);

                $.getJSON("jsonApi.php", {
                    api: "deviceSpeakerVolume",
                    cid: cids,
                    volume: ui.value
                }, function (r) {
                    if (r.error != 'OK') {
                        console.warn('deviceSpeakerVolume failed');
                    }
                });
            }
        });

        var vol_mute = $(vol_div).find('div.speaker-mute');
        $(vol_mute).click(function () {
            inputMute(0, !$(this).hasClass('active'));
            var on_off = $(this).hasClass('active') ? 'on' : 'off';

            $.getJSON("jsonApi.php", {
                api: "deviceSpeakerMute",
                cid: cids,
                mute: on_off
            }, function (r) {
                if (r.error != 'OK') {
                    console.warn('deviceSpeakerVolume failed');
                }
            });
        });
    }
}

function classControl(cid, qobj) {
    if ($(qobj).html() == "") {

        var div = Frame.Tools.createNode("div", 'margin-2 padding-2');
        $(qobj).append(div);

        var t = $('<div><img class="img img-device-label" src="icon/dev-control-label.png"/>' +
            '<label>系统开关:</label>' +
            '<input class="SWITCH" cid="' + cid + '" name="dev-control" type="checkbox" />' +
            '</div>');

        $(div).append(t).append('<hr>');
        var sw_control = $(t).find('input');
        var opts = {
            size: 'normal',
            onText: '开',
            offText: '关',
            onColor: 'default',
            offColor: 'default'/*,
             labelText: '<i class="fa fa-circle fa-dot"></i>'*/
        };

        sw_control.bootstrapSwitch(opts);
        $(sw_control).on('switchChange.bootstrapSwitch', classSwitched);

        var div2 = Frame.Tools.createNode('div', null, null, 'dev-detail-view');
        $(div).append(div2);
        $(div2).hide();

        var row = $('<div class="row"></div>');
        var c1 = $('<div class="col-sm-4">' +
            '<img class="img img-device-label" src="icon/dev-ops-label.png"/>' +
            '<label>内置电脑:</label>' +
            '<input class="SWITCH" cid="' + cid + '" name="dev-ops" type="checkbox" />' +
            '</div>');
        var sw_ops = $(c1).find('input');

        var c2 = $('<div class="col-sm-8">' +
            '<img class="img img-device-label" src="icon/dev-led-label.png"/>' +
            '<label>液晶触摸一体机:</label>' +
            '<input class="SWITCH" cid="' + cid + '" name="dev-hdmi-out" type="checkbox" />' +
            '</div>');
        var sw_hdmi_out = $(c2).find('input');

        $(row).append(c1).append(c2).appendTo(div2);

        $(sw_ops).bootstrapSwitch(opts);
        $(sw_ops).on('switchChange.bootstrapSwitch', classSwitched);

        $(sw_hdmi_out).bootstrapSwitch(opts);
        $(sw_hdmi_out).on('switchChange.bootstrapSwitch', classSwitched);

        $(div2).append('<hr><label>视频输入切换:</label>');

        var dev_input = $('<div class="row">' +
            '<div class="col-sm-3 dev-input-view" cid="' + cid + '">' +
            '<img class="img" name="hdmi-in" src="icon/dev-hdmi-in.png"/>' +
            '<div class="text-center">HDMI</div></div>' +
            '<div class="col-sm-3 dev-input-view" cid="' + cid + '">' +
            '<img class="img" name="vga-in" src="icon/dev-vga-in.png"/>' +
            '<div class="text-center">VGA</div></div>' +
            '<div class="col-sm-3 dev-input-view" name="ops" cid="' + cid + '">' +
            '<img  class="img" name="ops" src="icon/dev-ops.png"/>' +
            '<div class="text-center">内置电脑</div></div>' +
            '</div>');
        $(div2).append(dev_input).append('<hr/>');

        $(dev_input).find('.dev-input-view').click(function () {
            var name = $(this).find('img').attr('name');

            if (inputChoose(cid, name)) {

                setDirty($(this).parent(), 'input source');

                $.getJSON("jsonApi.php", {
                    api: "deviceDnameSwitch",
                    cid: cid,
                    dname: name
                }, function (r) {
                    if (r.error != 'OK') {
                        console.error('error:' + r.value);
                    }
                });
            }
        });

        var vol_div = $('<div class="row">' +
            '<div class="col-sm-12"><img class="img img-device-label" src="icon/dev-vol-label.png"/>' +
            '<label>主音量:</label>' +
            '<div class="speaker-volume-slider" cid="' + cid + '"></div>' +
            '<div class="speaker-mute" cid="' + cid + '"><img src="icon/dev-mute.png"/></div>' +
            '</div></div>');
        $(div2).append(vol_div);

        var vol_slider = $(vol_div).find('div.speaker-volume-slider');
        $(vol_slider).slider({
            min: 0,
            max: 100,
            value: 80,
            slide: function (event, ui) {
                var old = $(this).prop('volume')
                if (old == ui.value) {
                    return;
                }
                $(this).prop('volume', ui.value);
                setDirty(this, 'volume');

                $.getJSON("jsonApi.php", {
                    api: "deviceSpeakerVolume",
                    cid: cid,
                    volume: ui.value
                }, function (r) {
                    if (r.error != 'OK') {
                        console.warn('deviceSpeakerVolume failed');
                    }
                });
            }
        });

        var vol_mute = $(vol_div).find('div.speaker-mute');
        $(vol_mute).click(function () {
            inputMute(cid, !$(this).hasClass('active'));
            setDirty(this, 'mute');

            var act = $(this).hasClass('active') ? 'on' : 'off';
            $.getJSON("jsonApi.php", {
                api: "deviceSpeakerMute",
                cid: cid,
                mute: act
            }, function (r) {
                if (r.error != 'OK') {
                    console.warn('deviceSpeakerVolume failed');
                }
            });
        });

        t = new StatusTimer(0);
        t.runAtOnce(cid);
    }
}

function opsStatus(cid, on) {
    var it = $('div.dev-input-view[name="ops"][cid="' + cid + '"]');
    if (on) {
        it.show();
    } else {
        it.hide();
    }
}

function inputChoose(cid, name) {

    var changed = false;
    $('div.dev-input-view[cid="' + cid + '"]').each(function (i, it) {
        if (!checkDirty($(this).parent(), 'input source')) {
            return false;//break each
        }

        var img_name = $(it).find('img').attr('name');
        if (name == img_name) {
            if (!$(it).hasClass('active')) {
                $(it).addClass('active');
                $(it).find('img').attr('src', "icon/dev-" + name + "-active.png");
                changed = true;
            }
        } else {
            if ($(it).hasClass('active')) {
                $(it).removeClass('active');
                var t = $(it).find('img').attr('name');
                $(it).find('img').attr('src', "icon/dev-" + t + ".png");
            }
        }
    });

    return changed;
}

function inputMute(cid, on) {
    var mute = $('div.speaker-mute[cid="' + cid + '"]');

    if (checkDirty(mute, 'mute')) {
        if (on) {
            if (!$(mute).hasClass('active')) {
                $(mute).addClass('active');
                $(mute).find('img').attr('src', 'icon/dev-mute-active.png');
            }
        } else {
            if ($(mute).hasClass('active')) {
                $(mute).removeClass('active');
                $(mute).find('img').attr('src', 'icon/dev-mute.png');
            }
        }
    }
}


function devicePoweroff(cid, qobj) {

    if ($(qobj).html() == "") {

        if (!acCheckAcl('device')) {
            Frame.Tools.accessDenied(qobj);
            return;
        }

        $.getJSON("jsonApi.php", {
            api: "poweroff",
            cid: cid
        }, function (result) {
            if (result.error != "OK") {
                $(qobj).append("error");
                return;
            }

            var div = Frame.Tools.createNode('div', 'margin-2 padding-2');
            $(qobj).append(div);

            var row = Frame.Tools.createNode('div', 'row');
            var left = Frame.Tools.createNode('div', 'col-sm-4');
            var right = Frame.Tools.createNode('div', 'col-sm-8');
            $(row).append(left).append(right).appendTo(div);

            var r = result.value;

            var div_today_form = Frame.Tools.createNode("div");
            $(left).append(div_today_form);

            if (r.today == null) {
                var today_time = "18:00";
            } else {
                today_time = r.today.split(' ')[1];
            }

            var hr = '<div>今天关机</div><hr class="hr-up" />';
            $(div_today_form).append(hr);
            var div1 = Frame.Tools.createNode('div', 'padding-1');
            var today_div = $("<input type=\"time\" name=\"today\" value=\"" + today_time + "\" />");
            $(div1).append(today_div).appendTo(div_today_form);

            var today_save = Frame.Tools.createNodeWithGlyph("glyphicon glyphicon-floppy-disk", "button",
                "btn btn-default my-button my-button-right disabled", "保存");
            $(div_today_form).append(today_save);

            $(today_div).change(function () {
                Frame.Tools.activeButton(today_save);
            });

            $(today_save).click(function () {
                var si = new Frame.ButtonInfo(this);

                var today = $(today_div).val();
                $.getJSON("jsonApi.php", {
                    api: "poweroffToday",
                    cid: cid,
                    today: today
                }, function (result_today) {
                    if (result_today.error == "OK") {
                        si.ok();
                        Frame.Tools.activeButton(today_save, false);
                    } else {
                        si.failed(result_today.value);
                    }
                });

            });

            var div_week_form = Frame.Tools.createNode('div');
            $(right).append(div_week_form);

            hr = Frame.Tools.createNode("div", null, "自动关机");
            $(div_week_form).append(hr).append('<hr class="hr-up" />');

            div1 = Frame.Tools.createNode("div", "padding-1");
            $(div_week_form).append(div1);

            var week_input = Frame.Tools.createNode('div', 'row');
            $(div1).append(week_input);
            var c1 = Frame.Tools.createNode('div', 'col-sm-6');
            var c2 = Frame.Tools.createNode('div', 'col-sm-6');
            $(week_input).append(c1).append(c2);

            var tv = [r.mon, r.tue, r.wed, r.thu, r.fri, r.sat, r.sun];
            var ta = ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"];

            for (var i = 0; i < 7; i++) {
                var s = '<div class=""><label>' + ta[i] + ':</label> ' +
                    '<input type="time" value="' + tv[i] + '"></div>';
                if (i < 5) {
                    $(c1).append(s);
                } else {
                    $(c2).append(s);
                }
            }

            var week_save = Frame.Tools.createNodeWithGlyph("glyphicon glyphicon-floppy-disk", "button",
                "btn btn-default my-button my-button-right disabled", "保存");
            $(div_week_form).append('<br/>').append(week_save);

            $(week_input).find("input").change(function () {
                Frame.Tools.activeButton(week_save);
            });

            $(week_save).click(function () {

                var si = new Frame.ButtonInfo(this);
                var wi = $(week_input).find("input");
                var vals = [];
                $(wi).each(function (i, it) {
                    vals.push($(it).val());

                });

                $.getJSON("jsonApi.php", {
                    api: "poweroffWeek",
                    cid: cid,
                    week: vals
                }, function (result_week) {
                    if (result_week.error == "OK") {
                        Frame.Tools.activeButton(week_save);
                        si.ok();
                    } else {
                        si.failed(result_week.value);
                    }
                });

            });
        });
    }
}

function deviceVersion(cid, qobj) {
    if ($(qobj).html() == '') {
        var div = Frame.Tools.createNode('div', "margin-2 padding-2");
        $(qobj).append(div);

        $.getJSON('jsonApi.php', {
            api: 'deviceVersion',
            cid: cid
        }, function (r) {
            if (r.error == 'OK') {
                $(div).append('<div><label>型号:</label>' + r.value2.dev_type + ' (' + r.value2.uuid + ')</div>');


                var tab = Frame.Tools.createNode('table', 'table margin-2 padding-2');
                $(div).append(tab);


                var row = Frame.Tools.createTableRow(null, ['硬件名称', '分支名称', '当前版本', '新版本', '推送']);
                $(tab).append(row);

                $(r.value).each(function (i, it) {
                    var new_ver = '无';
                    if (it.new_ver) {
                        new_ver = it.new_ver.version + ', build=' + it.new_ver.build;
                    }

                    var sent = '';
                    if (it.sent > 0) {
                        sent = '<div class="green">是</div>';
                    }

                    row = Frame.Tools.createTableRow(null, [it.dev, it.branch,
                        it.version + ', build=' + it.build,
                        new_ver, sent]);
                    $(tab).append(row);
                });

                var tu = '<div class="warning">本设备禁止自动升级</div>';
                if (r.value2.upd_version) {
                    tu = '<div class="green">本设备允许自动升级</div>';
                }
                $(div).append('<br/>').append(tu);

            } else {
                $(div).append(Frame.Tools.createNode('div',
                    'panel panel-default padding-2 shadow warning', '无版本信息'));
            }
        });
    }

}

function deviceConfig(cid, qobj) {

    if ($(qobj).html() == "") {
        var div = Frame.Tools.createNode("div", 'margin-2 padding-2');
        $(qobj).append(div);

        $.getJSON("jsonApi.php", {
            api: "getDeviceConfig",
            cid: cid
        }, function (r) {
            if (r.error != "OK") {
                $(div).append(r.value);
                return;
            }

            // remove error existed
            $(div).empty();
            var div_row = Frame.Tools.createNode('div', 'row');
            var div_c1 = Frame.Tools.createNode('div', 'col-sm-6');
            var div_c2 = Frame.Tools.createNode('div', 'col-sm-6');
            $(div_row).append(div_c1).append(div_c2).appendTo(div);

            $(div_c1).append("<label>端口配置:</label><hr class=\"hr-up\" />");

            var button = Frame.Tools.createNodeWithGlyph("glyphicon glyphicon-floppy-disk", "button",
                "btn btn-default my-button my-button-right disabled", "保存");

            var dname = {};

            if (r.value2) {
                $(r.value).each(function (i, it) {
                    $(r.value2).each(function (j, it2) {
                        if (it.dname == it2['dname']) {
                            var row = Frame.Tools.createNode("div", "row");
                            var c1 = Frame.Tools.createNode("div", "col-sm-4 text-right");
                            $(c1).append(it.dname + ":").appendTo(row);

                            var c2 = Frame.Tools.createNode("div", "col-sm-8");
                            var al = [];
                            $(it2['options']).each(function (i, it3) {
                                al.push({name: it3, value: it3, dname: it2['dname']});
                            })
                            var dn = Frame.Tools.createDropDown(al, it.note, function (val, item) {
                                dname[item.dname] = val;
                                item.checked = true;
                                Frame.Tools.activeButton(button);
                            });
                            $(dn).find("button").attr('dname', it.dname);
                            $(dn).find("button").attr('note', it.note);

                            $(c2).append(dn).appendTo(row);

                            $(div_c1).append(row).append('<br/>');
                            return false;//break each
                        }
                    });
                });
            } else {
                $(div_c1).append('<div class="warning my-left">无设备信息</div>');
            }


            $.getJSON("jsonApi.php", {
                api: "getDeviceCapbility",
                cid: cid
            }, function (r2) {
                var recv_msg = null;
                var upd_ver = null;

                if (r2.error != 'OK') {
                    $(div_c2).append(r2.value);
                } else {
                    $(div_c2).append("<label>能力配置:</label><hr class=\"hr-up\" />");

                    recv_msg = Frame.Tools.createCheckBox('可推送文字图片消息',
                        r2.value.push_msg);
                    $(div_c2).append(recv_msg);

                    $(recv_msg).find('input').click(function () {
                        Frame.Tools.activeButton(button);
                    });

                    if (_user == 'admin') {
                        upd_ver = Frame.Tools.createCheckBox('允许自动升级',
                            r2.value.upd_version);
                        $(div_c2).append(upd_ver);

                        $(upd_ver).find('input').click(function () {
                            Frame.Tools.activeButton(button);
                        });
                    }

                    var t = Frame.Tools.createCheckBox('自动导入配置到平台', true);
                    $(div_c2).append(t);

                    t = Frame.Tools.createCheckBox('自动导出配置到设备', true);
                    $(div_c2).append(t);

                    $(div_c2).append('<br/>').append("<label>教室名称:</label>");
                    var cname_div = $('<input type="text" ' +
                        'class="my-left form-control" value="' + r2.value.name + '"/>');
                    $(cname_div).css('width', '200px');
                    $(div_c2).append(cname_div);

                    $(cname_div).change(function () {
                        Frame.Tools.activeButton(button);
                        $(cname_div).prop('changed', true);
                    });


                    $(div_c2).append('<br/>').append('<label>教室编号<a href="#" id="unlock-cls-name">:</a></label>');
                    var cls_name_div = $('<input type="text" ' +
                        'class="my-left form-control" value="' + r2.value.class_name + '" disabled/>');
                    $(cls_name_div).css('width', '200px');
                    $(div_c2).append(cls_name_div);

                    $(cls_name_div).change(function () {
                        Frame.Tools.activeButton(button);
                        $(cls_name_div).prop('changed', true);
                    });

                    $(div_c2).find('#unlock-cls-name').click(function () {
                        var t = $(cls_name_div).prop('data-click');
                        t = !t;
                        $(cls_name_div).prop('data-click', t);

                        if (t) {
                            $(cls_name_div).removeAttr('disabled');
                        } else {
                            $(cls_name_div).attr('disabled', 'disabled');
                        }
                    });

                    /// c2
                    $(div_c2).append('<br/><label>设备UUID:</label>');

                    var form = $('<div class="form form-inline"></div>');
                    $(div_c2).append(form);

                    var uuid = $('<input class="my-left form-control" disabled/>');
                    $(form).append(uuid);
                    $(uuid).css('width', '200px');
                    if (r2.value.uuid) {
                        $(uuid).val(r2.value.uuid);
                        var rmuuid = $('<a href="#" title="清除后无法控制此设备" class="warning">&nbsp;清除</a>');
                        $(form).append(rmuuid);

                        $(rmuuid).click(function () {

                            if ($(this).attr('title')) {
                                $(this).attr('title','');
                                $(this).text(' 确认?');
                                return;
                            }

                            $.getJSON('jsonApi.php', {
                                api: 'clearUuid',
                                cid: cid,
                                uuid: r2.value.uuid
                            }, function (r3) {
                                if (r3.error == 'OK') {
                                    $(uuid).val('(无)');
                                    $(rmuuid).empty();
                                }
                            });
                        });
                    } else {
                        $(uuid).val('(无)');
                    }
                }


                $(div).append("<hr/>").append(button);

                $(button).click(function () {
                    var si = new Frame.ButtonInfo(this);
                    if (!si.isActive()) {
                        return;
                    }

                    var recv = $(recv_msg).find('input').prop('checked');
                    var upd = $(upd_ver).find('input').prop('checked');

                    var name = $(cname_div).val();
                    if ($(cname_div).prop('changed') != true) {
                        name = null;
                    }

                    var cls_name = $(cls_name_div).val();
                    if ($(cls_name_div).prop('changed') != true) {
                        cls_name = null;
                    }

                    $.post("jsonApi.php", {
                        api: "setDeviceConfig",
                        cid: cid,
                        item: dname,
                        recv_msg: recv,
                        cname: name,
                        cls_name: cls_name,
                        upd_ver: (_user == 'admin' ? upd : '')
                    }, function (r) {
                        if (r.error == 'OK') {
                            si.ok('OK');
                            Frame.Tools.activeButton(this, false);
                        } else {
                            si.failed(r.value);
                        }
                    });
                });
            });
        });
    }
}

function deviceMessage(param, qobj) {

    if ($(qobj).html() != '') {
        return;
    }

    var div = Frame.Tools.createNode("div", 'margin-2 padding-2');
    $(qobj).append(div).append('<br/>');

    if ($.isArray(param)) {
        $(div).append('<div>共有' + param.length + '班级接收信息</div>').append('<br/>');
    } else {
        $(div).append('<div>共有1个班级接收信息</div>').append('<br/>');
    }


    function contentView(div1, t) {
        $(div1).empty();

        if (t == 'text') {
            var input = Frame.Tools.createInputWithLabel('text', null, '请输入1-255个字符',
                null, 400, 'my-left');

            var val = Frame.Tools.data('pushmsg-text');
            if (val) {
                $(input).find('input').val(val);
            }
            $(input).find('input').change(function () {
                var val = $(this).val();
                Frame.Tools.data('pushmsg-text', val);
                Frame.Tools.activeButton(button);
            });
        } else {
            var input = Frame.Tools.createInputWithLabel('file', null, null, null, null, 'my-left');

            var val = Frame.Tools.data('pushmsg-file');
            if (val) {
                $(input).find('input').val(val);
            }
            $(input).find('input').change(function () {
                var val = $(this).val();
                Frame.Tools.data('pushmsg-file', val);
                Frame.Tools.activeButton(button);
            });

            $(input).find('input').attr('accept', 'image/jpeg,image/png,image/gif');
        }
        $(div1).append("<label>推送内容:</label>").append(input).append('<br/>');
        return t;
    }

    var al = [{
        name: '发送文字消息',
        value: 'text'
    }, {
        name: '发送图片',
        value: 'image'
    }];

    var mt;
    var div_type = Frame.Tools.createDropDown(al, al[0].name, function (v) {
        mt = contentView(div1, v);
    });
    $(div).append(div_type);

    var div1 = Frame.Tools.createNode('div', 'padding-1 my-left form-inline');
    $(div).append(div1);
    mt = contentView(div1, 'text');

    // ////////////////////////
    var div_date_time = Frame.Tools.createNode("div");
    $(div).append(div_date_time);

    $(div_date_time).append("<label class=\"padding-1 my-left\">推送时间:</label>");

    var cur = Frame.Tools.data('pushmsg-date');
    if (!cur) {
        var t = new Date();
        var cur = t.getFullYear() + '-' + t.getMonth() + '-' + t.getDate();
    }
    var dt_div = Frame.Tools.createNode("input");
    $(dt_div).attr("type", "text").attr("size", "12").val(cur);
    $(dt_div).datepicker({
        minDate: "0",
        maxDate: "+7D"
    });
    $(dt_div).on("change", function () {
        $(dt_div).datepicker("option", "dateFormat", "yy-mm-dd");
        Frame.Tools.data('pushmsg-date', $(this).val());
        Frame.Tools.activeButton(button);
    });
    $(div_date_time).append(dt_div);

    var tm_div = Frame.Tools.createNode("input");
    $(tm_div).attr("type", "time").attr("size", "6");
    var cur = Frame.Tools.data('pushmsg-time');
    if (cur) {
        $(tm_div).val(cur);
    }
    $(tm_div).change(function () {
        Frame.Tools.data('pushmsg-time', $(this).val());
        Frame.Tools.activeButton(button);
    });
    $(div_date_time).append(tm_div).append('<br/>');

    $(div_date_time).append("<label class=\"padding-1 my-left\">持续时长:</label>");
    var tm_div2 = Frame.Tools.createNode("input", '', "10:00");
    $(tm_div2).attr("type", "time");
    $(tm_div2).attr("size", "6");
    var cur = Frame.Tools.data('pushmsg-during');
    if (!cur) {
        cur = '10:10';
    }
    $(tm_div2).val(cur);
    $(tm_div2).change(function () {
        Frame.Tools.data('pushmsg-during', $(this).val());
        Frame.Tools.activeButton(button);
    })

    $(div_date_time).append(tm_div2).append(" (时:分)");
    // ///

    var button = Frame.Tools.createNodeWithGlyph("glyphicon glyphicon-floppy-disk", "button",
        "btn btn-default my-button my-button-right disabled", "发送");
    $(div).append('<hr/>').append(button).append('<br/>');

    var refresh = Frame.Tools.createNodeWithGlyph("glyphicon glyphicon-refresh",
        "button", "btn btn-link right", '推送历史');
    $(div).append('<br/><br/>').append(refresh);
    var his_div = Frame.Tools.createNode('div');
    $(div).append(his_div);

    var mh = {
        cid: param,
        div: his_div
    }
    $(refresh).click(function () {
        messageHistory(mh, 1);
    });
    messageHistory(mh, 1);

    if ((Frame.Tools.data('pushmsg-text') || Frame.Tools.data('pushmsg-file')) &&
        Frame.Tools.data('pushmsg-date') &&
        Frame.Tools.data('pushmsg-time') &&
        Frame.Tools.data('pushmsg-during')) {
        Frame.Tools.activeButton(button);
    }

    $(button).click(function () {
        var si = new Frame.ButtonInfo(button);

        var d1 = $(dt_div).val();
        var t1 = $(tm_div).val();
        var t2 = $(tm_div2).val();

        if (!d1) {
            si.validFailed('没有输入日期');
        }

        if (!t1) {
            si.validFailed('没有输入时间');
        }

        if (!t2 || t2 == '00:00') {
            si.validFailed('没有指定持续时长');
        }

        var s = $(div1).find('input').val();
        if (!s) {
            si.validFailed('没有输入信息或者文件名');
            return;
        }

        var cid = param;

        if (!cid || cid.length == 0) {
            si.validFailed('没有班级');
        }

        if (si.count()) {
            return;
        }

        $('html').data('msg-file', false).data('msg-text', false);

        if (mt == 'text') {

            // text
            $.post('jsonApi.php', {
                api: 'pushMessageText',
                user: _user,
                cid: cid,
                content: s,
                datetime: d1 + ' ' + t1,
                duration: t2
            }, function (r) {
                if (r.error == 'OK') {
                    si.ok();
                    si.active(false);

                    messageHistory(mh, 1);

                } else {
                    si.failed(r.value);
                }
            });
        } else {
            // image
            var data = $(div1).find('input').get(0).files[0];

            var formdata = new FormData();
            formdata.append("file1", data);
            formdata.append("cid", cid);
            formdata.append("user", _user);
            formdata.append('datetime', d1 + ' ' + t1);
            formdata.append('duration', t2);

            $.ajax({
                type: "POST",
                url: "jsonApi.php?api=pushMessageImage",
                xhr: function () {  // Custom XMLHttpRequest
                    var myXhr = $.ajaxSettings.xhr();
                    if (myXhr.upload) { // Check if upload property exists
                        myXhr.upload.addEventListener('progress', function (e) {
                            if (e.lengthComputable) {
                                si.process({value: e.loaded, max: e.total});
                            }
                        }, false); // For handling the progress of the upload
                    }
                    return myXhr;
                },
                mimeTypes: "multipart/form-data",
                contentType: false,
                cache: false,
                processData: false,
                data: formdata,
                success: function (r2) {
                    if (r2.error == 'OK') {
                        si.ok();
                        si.active(false);

                        messageHistory(mh, 1);

                    } else {
                        si.failed(r2.value);
                    }
                }
            });
        }
    });
}

function messageHistory(param, page) {
    var div = param.div;
    var cid = param.cid;//maybe cid array

    $(div).empty();

    $.getJSON('jsonApi.php', {
        api: 'getPushMessage',
        page: page - 1,
        cid: cid
    }, function (r) {
        if (r.error == 'OK') {
            var tab = Frame.Tools.createNode('table', 'table table-condensed');
            $(div).append(tab);
            var thead = Frame.Tools.createNode('thead');
            $(tab).append(thead);
            var row = Frame.Tools.createTableRow(null, ['教室', '时间', '时长(分)', '送达', '内容', '操作']);
            $(thead).append(row);

            var tbody = Frame.Tools.createNode('tbody');
            $(tab).append(tbody);

            $(r.value).each(function (i, it) {
                /*
                 * 0=wait 1=pushed 2=push-cancel 3=cancel 4-error
                 */

                var dt1 = new Date(it.at);
                var sec1 = dt1.getTime() + it.timelen * 60;
                var sec2 = (new Date()).getTime();

                // only wait/sent can remove
                if ((it.status == 0 || it.status == 1) && sec1 < sec2) {
                    var rmp = Frame.Tools.createNode('div');
                    var rm = Frame.Tools.createNode('div', 'glyphicon glyphicon-remove my-remove');
                    $(rm).prop({
                        pid: it.pid,
                        status: it.status
                    });
                    $(rmp).append(rm);

                    $(rm).click(function () {
                        var rmt = $(this).parent();
                        var pid = $(this).prop('pid');
                        var status = $(this).prop('status');

                        $.getJSON('jsonApi.php', {
                            api: 'messageCancel',
                            pid: pid,
                            status: status
                        }, function (r2) {
                            if (r2.error == 'OK') {
                                $(rmt).html('...');
                            } else {
                                $(rmt).html(r2.value);
                            }
                        });
                    });
                } else if (it.status == 0) {
                    var rmp = '等待...';
                } else if (it.status == 1) {
                    var rmp = '完成';
                } else if (it.status == 2) {
                    var rmp = '...';
                } else if (it.status == 3) {
                    var rmp = '以及取消';
                } else {// 4，more
                    var rmp = '错误';
                }

                var cont = (it.type == 0 ? it.content : '<img class="img my-message-img" src="' + it.content + '" />');
                row = Frame.Tools.createTableRow(null, [it.cname, it.at, it.timelen, it.pushed, cont, rmp]);
                $(row).attr('title', it.uname);

                $(tbody).append(row);
            });

            var pageind = r.value2;
            pageind.fun = messageHistory;
            pageind.param = param;

            $(div).append('<br/>').append(Frame.Tools.createPageInd(pageind));
        }

    });
}

function statusDetect(it) {
    if (it.status == 'offline') {
        return 'offline';
    }

    if (it.status == 'standby' || isNaN(it.sec) || Number(it.sec) > 10) {
        return 'standby';
    }

    return 'active';
}

function powerStatusString(it, isclass) {

    var sd = statusDetect(it);

    if (sd == 'offline') {
        // offline
        var s = "fa fa-bg fa-toggle-off";
        if (isclass) {
            return s;
        }
        return "<i class=\"" + s + "\" ccid=\"" + it.cid + "\"></i>"
    }

    if (sd == 'standby') {
        // standby
        var s = "fa fa-toggle-off";
        if (isclass) {
            return s;
        }
        return "<i class=\"" + s + "\" ccid=\"" + it.cid + "\"></i>";
    }

    // active
    var s = "fa fa-bg fa-toggle-on";
    if (isclass) {
        return s;
    }
    return "<i class=\"" + s + "\" ccid=\"" + it.cid + "\"></i>";
}

function statusDiv(st, cid, sid) {

    var s = statusContent(st);

    if (st == 'offline') {
        return '<div class="STATUS status-offline" cid="' + cid + '">' + s + '</div>';
    } else if (st == 'active') {
        return '<div class="STATUS status-active" cid="' + cid + '">' + s + '</div>';
    }
    return '<div class="STATUS status-standby" cid="' + cid + '">' + s + '</div>';
}

function statusContent(st) {
    if (st == 'offline') {
        return '离线';
        /*
         return '<div class="class-list-title2"><span class="glyphicon glyphicon-record"></span>' +
         '<br/></div>离线';*/
    } else if (st == 'active') {
        return '在线';
        /*
         return '<div class="class-list-title2"><span class="glyphicon glyphicon-record"></span>' +
         '<br/></div>在线';*/
    }
    return '待机';
    /*
     return '<div class="class-list-title2"><span class="glyphicon glyphicon-record"></span>' +
     '<br/></div>待机';
     */
}

function schoolTimeStat(sid, qobj) {
    timeStat(sid, qobj, 'school');
}

function classTimeStat(sid, qobj) {
    timeStat(sid, qobj, 'class');
}

function timeStat(oid, qobj, tname) {
    if ($(qobj).html() != "") {
        return;
    }

    var div = Frame.Tools.createNode("div", 'margin-2');
    $(qobj).append(div);

    var grp = Frame.Tools.createNode("div", "btn-group");
    $(div).append(grp);

    var classids = [];

    var lv1 = [{
        name: "一周数据",
        value: 'week'
    }, {
        name: "一月数据",
        value: 'month'
    }, {
        name: "一年数据",
        value: 'year'
    }];

    var lv2 = [{
        name: "折线图",
        value: 'line',
        icon: "fa fa-line-chart"
    }];

    if (tname == 'school') {
        lv2.push({
            name: "饼图",
            value: 'pie',
            icon: "fa fa-pie-chart"
        });
        lv2.push({
            name: "柱状图",
            value: 'bar',
            icon: "fa fa-bar-chart"
        });
    }

    lv2.push({name: "---"});
    lv2.push({
        name: "数据表格",
        value: "table",
        icon: "fa fa-table"
    });

    var period = lv1[1].value;
    var dp1 = Frame.Tools.createDropDown(lv1, lv1[1].name, function (val) {
        period = val;
        //$('html').data('stat-time',period);

        if (val == 'week' || val == 'month') {
            $(unit).text('单位：小时/天');
        } else {
            $(unit).text('单位：小时/月');
        }
        refreshGraph();
    }, {classname: 'btn-group'});

    $(dp1).find('button').addClass('padding-1');
    $(grp).append(dp1);

    var type = lv2[0].value;
    var dp2 = Frame.Tools.createDropDown(lv2, lv2[0].name, function (val) {
        type = val;
        refreshGraph();
    }, {classname: 'btn-group'});

    $(dp2).find('button').addClass('padding-1');
    $(grp).append(dp2);

    var dp_div = Frame.Tools.createNode("div");
    $(div).append(dp_div);

    var rzt_div = Frame.Tools.createNode("div");
    $(dp_div).append(rzt_div);

    var unit = $('<div class="small text-right">单位：小时/天</div>');
    $(div).append(unit);

    function labelPro(t) {
        if (period == 'week') {
            if (t == 'Mon') {
                return '周一';
            } else if (t == 'Tue') {
                return '周二';
            } else if (t == 'Wed') {
                return '周三';
            } else if (t == 'Thu') {
                return '周四';
            } else if (t == 'Fri') {
                return '周五';
            } else if (t == 'Sat') {
                return '周六';
            } else {
                return '周日';
            }
        }

        if (period == 'month') {
            return t + '日';
        }

        if (period == 'year') {
            return t + '月';
        }

        return t;
    }

    function refreshGraph() {

        $(rzt_div).empty();

        if (classids.length == 0 || classids.length > 10) {
            $(rzt_div).append('<div class="padding-2 warning">没有选择班级</div>');
            return;
        }

        if (type == "table") {
            $.getJSON("image-api.php", {
                type: type,
                classids: classids.toString(),
                period: period
            }, function (r) {

                if (r.error == 'OK') {
                    var ht = Frame.Tools.createNode("h3", "text-center", r.value.title);
                    $(rzt_div).append(ht).append('<br/>');

                    var tab = Frame.Tools.createNode("table", "table table-striped");
                    $(rzt_div).append(tab);
                    var thead = Frame.Tools.createNode("thead");
                    $(thead).append(tr).appendTo(tab);

                    var tr = Frame.Tools.createNode("tr", "text-right");
                    $(tr).append('<td/>').appendTo(thead);



                    var twoTab = r.value.label.length > 12;
                    if (twoTab) {
                        var tab2 = $(tab).clone();
                        $(rzt_div).append('<br/><label class="small">续表:</label><br/>').append(tab2);

                        var tr2 = $(tab2).find('tr');
                    }

                    $(r.value.label).each(function (i, it) {
                        if (twoTab && i >= Math.floor(r.value.label.length / 2)) {
                            $(tr2).append("<td >" + labelPro(it) + "</td>");
                        } else {
                            $(tr).append("<td>" + labelPro(it) + "</td>");
                        }
                    });

                    var tbody = Frame.Tools.createNode("tbody");
                    $(tab).append(tbody);

                    if (twoTab) {
                        var tbody2 = Frame.Tools.createNode("tbody");
                        $(tab2).append(tbody2);
                    }


                    $(r.value.data).each(function (i, it) {
                        tr = Frame.Tools.createNode("tr", 'text-right');
                        $(tr).append('<td>' + it.name + '</td>');
                        $(tbody).append(tr);

                        if (twoTab) {
                            tr2 = Frame.Tools.createNode("tr", 'text-right');
                            $(tr2).append('<td>' + it.name + '</td>');
                            $(tbody2).append(tr2);
                        }

                        $(r.value.label).each(function (j, it2) {
                            if (twoTab && j >= Math.floor(r.value.label.length / 2)) {
                                $(tr2).append("<td>" + it.label[it2] + "</td>");
                            } else {
                                $(tr).append("<td>" + it.label[it2] + "</td>");
                            }
                        });
                    });
                } else {
                    $(rzt_div).append(
                        '<div class="panel pandel-default shadow my-error-view text-center">' + r.value
                        + '</div>');
                }
            });
        } else {
            var img = $('<image class="image my-graph" />');
            var url = 'image-api.php?type=' + type + '&classids=' + classids + '&period=' + period + '&dummy='
                + (new Date()).getTime();
            $(img).attr('src', url);
            $(img).error(function () {
                var s = '<div class="panel pandel-default shadow my-error-view text-center">no data</div>';
                $(rzt_div).empty().append(s);
            });
            $(rzt_div).append(img);
        }
    }

    classids = [oid];// one cid
    refreshGraph();
}
