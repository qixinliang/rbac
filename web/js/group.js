/**
 *
 */

function menu_group(menu_id, page) {
    Frame.titleShow(2);

    $.getJSON("jsonApi.php", {
        api: "groupList",
        user: _user
    }, function (result) {

        if (result.error != "OK") {
            Frame.containerInitialize([{
                glyphicon: "glyphicon glyphicon-plus",
                name: "增加分组",
                right: true,
                fun: groupAdd,
                param: 0
            }]);
            return;
        }

        var lis = [];
        var items = result.value;
        for (var i = 0; i < items.length; i++) {
            var row = Frame.Tools.createNode("div", "row");
            var c1 = Frame.Tools.createNode("div", "col-sm-2", i + 1);
            var s='<span gid="'+items[i].gid+'">'+items[i].name+'</span>'+
                '<span class="glyphicon glyphicon-edit inline-edit pull-right"></span> ';
            var c2 = Frame.Tools.createNode("div", "col-sm-10", s);

            if(acCheckAcl('group')) {
                Frame.Tools.inlineEdit($(c2).find('span.inline-edit'), function (prev, t) {
                    $.getJSON('jsonApi.php', {
                        api: 'groupNameUpdate',
                        gid: $(prev).attr('gid'),
                        text: t
                    }, function (r) {
                        if (r.error == 'OK') {
                            $(prev).text(t);
                        } else {
                            console.warn('groupNameUpdate Error');
                        }
                    });
                });
            }else{
                $(c2).find('span.inline-edit').remove();
            }
            $(row).append(c1);
            $(row).append(c2);
            $(row).attr("title", items[i].gid);
            lis.push({
                name: row,
                fun: "groupFun",
                param: items[i]
            });
        }

        Frame.titleInitialize(lis);
    });
}

function groupFun(groupItem) {

    var lis = [{
        glyphicon: "glyphicon glyphicon-check",
        name: "常规",
        fun: groupView,
        param: groupItem
    }];

    if (acCheckAcl('group')) {
        lis.push({
            glyphicon: "glyphicon glyphicon-edit",
            name: "编辑",
            fun: groupEdit,
            param: groupItem
        });

        lis.push({
            glyphicon: "glyphicon glyphicon-plus",
            name: "增加分组",
            right: true,
            fun: groupAdd,
            param: 0
        });
    }

    Frame.containerInitialize(lis);
}

function groupView(gitem, qobj) {

    if ($(qobj).html() == "") {

        var div = Frame.Tools.createNode("div",'margin-2');
        $(qobj).append(div);

        $.getJSON("jsonApi.php", {
            api: "getClassListByGid",
            gid: gitem.gid,
            flag: gitem.flag
        }, function (r) {
            if (r.error == "OK") {
                $(div).append('<label>包含' +
                    (gitem.flag == 'school' ? '学校' : '班级') +
                    '：</label><hr class="hr-up"/>');

                var data_div = Frame.Tools.createNode('div');
                $(div).append(data_div);

                var sid2 = 0;
                var col = null;

                $(r.value).each(function (i, it) {

                    if (sid2 != it.sid) {
                        sid2 = it.sid;

                        //new row
                        var row = Frame.Tools.createNode("div", "row");
                        $(data_div).append(row);

                        var school_col = Frame.Tools.createNode("div", "col-sm-2");
                        $(row).append(school_col);

                        var t = Frame.Tools.createNode("div", 'gitem gitem-school', it.sname);
                        $(school_col).append(t).appendTo(row);

                        col = Frame.Tools.createNode("div", "col-sm-10 small");
                        $(row).append(col);

                        var t = Frame.Tools.createNode("div", 'gitem gitem-class', it.cname);
                        $(col).append(t);
                    } else {
                        var t = Frame.Tools.createNode("div", 'gitem gitem-class', it.cname);
                        $(col).append(t);
                    }
                });

                var s = '在' + gitem.created + '由' + gitem.user + '创建，被使用' +
                    (r.value2 ? r.value2 : '0') + '次。';
                var t = $('<div class="text-right small hr-up">' + s + '</div>');
                $(div).append('<hr/>').append(t);
            } else {
                $(div).append('<div class="panel panel-default padding-2">无数据</div>');
            }

        });
    }
}

function gitem_view(data_div, flag) {
    if (flag == 'school') {
        $(data_div).find('.gitem-class').hide();
        $(data_div).find('.gitem-school').show();
        $(data_div).find('.gitem-school-title').hide();
    } else {
        $(data_div).find('.gitem-class').show();
        $(data_div).find('.gitem-school').hide();
        $(data_div).find('.gitem-school-title').show();
    }
}

function groupEdit(gitem, qobj) {
    if ($(qobj).html() == '') {

        var div = Frame.Tools.createNode("div",'margin-2');
        $(qobj).append(div);

        var name_div = Frame.Tools.createInputWithLabel("text", "名称", "4-16个字符以内", gitem.name, 300);
        $(div).append(name_div);

        if (gitem.flag == 'school') {
            var s = '只包含学校';
        } else {
            var s = '只包含班级';
        }

        var dp = Frame.Tools.createNode('div', null, s);
        $(div).append('<br/>').append(dp).append('<hr class="hr-up"/>');

        var data_div = Frame.Tools.createNode('div');
        $(div).append(data_div);

        var button = Frame.Tools.createNodeWithGlyph("glyphicon glyphicon-ok", "button",
            "btn btn-default disabled my-button my-button-right", "增加");
        $(div).append('<br/>').append('<hr class="hr-up"/>').append(button);

        $.getJSON("jsonApi.php", {
            api: "groupInfoEdit",
            gid: gitem.gid,
        }, function (r) {
            if (r.error == "OK" || r.value.length > 0) {

                items = r.value;

                var sid2 = 0;
                var col = null;

                $(items).each(function (i, it) {
                    if (sid2 != it.sid) {
                        sid2 = it.sid;

                        //new row
                        var row = Frame.Tools.createNode("div", "row");
                        $(data_div).append(row);

                        var school_col = Frame.Tools.createNode("div", "col-sm-2");
                        $(row).append(school_col);

                        var sel = false;
                        if (gitem.flag == 'school') {
                            $(r.value2).each(function (j, it2) {
                                if (it2.sid == it.sid) {
                                    sel = true;
                                    return false;//break each
                                }
                            });
                        }

                        var t = Frame.Tools.createCheckBox(it.sname, sel, true);
                        $(t).find("input").attr('sid', it.sid);
                        $(t).addClass('gitem gitem-school');

                        var t2='<div class="gitem-school-title">'+it.sname+'</div>';
                        $(school_col).append(t).append(t2).appendTo(row);

                        col = Frame.Tools.createNode("div", "col-sm-10 small");
                        $(row).append(col);
                    }

                    var sel = false;
                    if (gitem.flag == 'class') {
                        $(r.value2).each(function (j, it2) {
                            if (it2.cid == it.cid) {
                                sel = true;
                                return false;//break each
                            }
                        });
                    }

                    var t = Frame.Tools.createCheckBox(it.cname, sel, true);
                    $(t).find("input").attr('cid', it.cid);
                    $(t).addClass('gitem gitem-class');

                    $(col).append(t);

                });

                $(div).find("input").change(function () {
                    Frame.Tools.activeButton(button);
                });

                gitem_view(data_div, gitem.flag);
            }
        });

        $(button).click(function () {
            var si = new Frame.ButtonInfo(this);
            if (si.isDisabled()) {
                return;
            }

            var ids = [];
            if (gitem.flag == 'school') {
                $(data_div).find("input[sid]:checked").each(function (i, it) {

                    ids.push($(it).attr('sid'));
                })
            } else {
                $(data_div).find("input[cid]:checked").each(function (i, it) {
                    ids.push($(it).attr('cid'));
                })
            }

            if (ids.length == 0) {
                si.validFailed("没有选择任何学校或者班级");
            }

            var name_val = $(name_div).find("input").val();
            if (!name_val || name_val.length < 4) {
                si.validFailed("没有名称,或者名称长度错误", name_div);
            } else {
                si.validOk(name_div);
            }

            if (si.count()) {
                return;
            }

            $.getJSON("jsonApi.php", {
                api: "groupEdit",
                ids: ids,
                name: name_val,
                user: _user,
                gid: gitem.gid
            }, function (r) {
                if (r.error == "OK") {
                    si.ok();
                } else {
                    si.failed(r.value);
                }
            });
        });
    }
}

function groupAdd(param, qobj) {
    if ($(qobj).html() == '') {

        var div = Frame.Tools.createNode("div",'margin-2');
        $(qobj).append(div);

        var name_div = Frame.Tools.createInputWithLabel("text", "名称", "4-16个字符以内", null, 300);
        $(div).append(name_div);

        var al = [{
            name: '多个班级',
            value: 'class'
        }, {
            name: '多个学校',
            value: 'school'
        }];
        var flag = al[0].value;
        var dp = Frame.Tools.createDropDown(al, al[0].name, function (val) {
            flag = val;
            gitem_view(data_div, flag);
        });
        $(div).append('<br/>').append(dp).append('<hr class="hr-up"/>');

        var data_div = Frame.Tools.createNode('div');
        $(div).append(data_div);

        var button = Frame.Tools.createNodeWithGlyph("glyphicon glyphicon-ok", "button",
            "btn btn-default disabled my-button my-button-right", "增加");
        $(div).append('<br/>').append('<hr class="hr-up"/>').append(button);

        $.getJSON("jsonApi.php", {
            api: "groupClassesList"
        }, function (r) {
            if (r.error == "OK" || r.value.length > 0) {

                items = r.value;

                var sid2 = 0;
                var col = null;

                $(items).each(function (i, it) {
                    if (sid2 != it.sid) {
                        sid2 = it.sid;

                        //new row
                        var row = Frame.Tools.createNode("div", "row");
                        $(data_div).append(row);

                        var school_col = Frame.Tools.createNode("div", "col-sm-2");
                        $(row).append(school_col);

                        var t = Frame.Tools.createCheckBox(it.sname, null, true);
                        $(t).find("input").attr('sid', it.sid);
                        $(t).addClass('gitem gitem-school');

                        var t2='<div class="gitem-school-title">'+it.sname+'</div>';
                        $(school_col).append(t).append(t2).appendTo(row);

                        col = Frame.Tools.createNode("div", "col-sm-10 small");
                        $(row).append(col);
                    }

                    var t = Frame.Tools.createCheckBox(it.cname, null, true);
                    $(t).find("input").attr('cid', it.cid);
                    $(t).addClass('gitem gitem-class');

                    $(col).append(t);

                });

                $(div).find("input").change(function () {
                    Frame.Tools.activeButton(button);
                });

                gitem_view(data_div, flag);
            }
        });

        $(button).click(function () {
            var si = new Frame.ButtonInfo(this);
            if (si.isDisabled()) {
                return;
            }

            var ids = [];
            if (flag == 'school') {
                $(data_div).find("input[sid]:checked").each(function (i, it) {

                    ids.push($(it).attr('sid'));
                })
            } else {
                $(data_div).find("input[cid]:checked").each(function (i, it) {
                    ids.push($(it).attr('cid'));
                })
            }

            if (ids.length == 0) {
                si.validFailed("没有选择任何学校或者班级");
            }

            var name_val = $(name_div).find("input").val();
            if (!name_val || name_val.length < 4) {
                si.validFailed("没有名称,或者名称长度错误", name_div);
            } else {
                si.validOk(name_div);
            }

            if (si.count()) {
                return;
            }

            $.getJSON("jsonApi.php", {
                api: "groupAdd",
                ids: ids,
                name: name_val,
                user: _user,
                flag: flag
            }, function (r) {
                if (r.error == "OK") {
                    si.ok();
                } else {
                    si.failed(r.value);
                }
            });
        });
    }
}


/**
 *
 * @param url
 * @param mime
 *            video/mp4,rtmp/flv,rtmp/mp4
 * @returns
 * 'http://vjs.zencdn.net/v/oceans.mp4'
 */
function fmsView(url, autoplay) {

    if (!url) {
        return $('<div class="fms-view text-center"><img src="/icon/movie.png" class="fms-view"/></div>');
    }

    var mime = 'video/mp4';

    if (url.substr(0, 7) == 'http://') {
        mime = 'video/mp4';
    } else if (url.substr(0, 4) == 'rtmp') {
        if (url.substr(-1, 4) == '.mp4') {
            mime = 'rtmp/mp4';
        } else {
            mime = 'rtmp/flv';
        }
    }

    var id = Frame.Tools.randomId();

    var s = '<video id="' + id + '" class="video-js vjs-default-skin fms-view" controls preload="auto"';
    if (autoplay) {
        s += ' autoplay="true" ';
    }
    s += ' data-setup=\'{"techOrder": ["flash", "html5"]}\'>';

    s += '<source src="' + url + '" type="' + mime + '" />';
    s += '<p class="vjs-no-js">浏览器不支持HTML5</p></video>';
    var div = $(s);

    /*
     videojs(id).ready(function() {
     var player = this;
     // player.d.currentTime=function(a){
     // return a;
     // }
     player.play();
     });*/

    return div;
}

function acCheckAcl(name) {
    if(name=='class'){
        name='device';
    }
    var acids = ["user", "group", "media", "task", "ring", "device", "alert", "school"];

    for (var i = 0; i < acids.length; i++) {
        if (acids[i] == name) {
            var v = Number(_acl) & (1 << i);
            if (v) {
                return true;
            }

            return false;
        }
    }

    return false;
}
