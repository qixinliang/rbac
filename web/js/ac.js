/**
 *
 */

function menu_ac_me(menu_id, page) {
    Frame.titleShow(0);

    var lis = [Frame.containerItem("glyphicon glyphicon-edit", "基本信息", acUserInfo, _user),
        Frame.containerItem("glyphicon glyphicon-lock", "密码", acPassword, _user),
        Frame.containerItem("glyphicon glyphicon-lock", "权限", acMyAc, _user),
        Frame.containerItem("glyphicon glyphicon-globe", "管理对象", acClassesView, _user),
        Frame.containerItem("glyphicon glyphicon-info-sign", "用户事件", acUserEvent, _user)];

    if (_user == 'admin') {
        lis.push(Frame.containerItem("glyphicon glyphicon-credit-card", "用户发卡", acMifare, _user));
    }

    Frame.containerInitialize(lis);
}

function menu_ac_users(menu_id, page) {
    Frame.titleShow(2);

    $.getJSON("jsonApi.php", {
        api: "acUsers",
        user: _user
    }, function (r) {
        if (r.error == "OK") {
            Frame.titleShow(2);
            var lis = [];

            $(r.value).each(function (i, it) {
                lis.push({
                    name: it.username + "(" + it.uname + ")",
                    fun: "acUser",
                    param: it
                });
            });
            Frame.titleInitialize(lis);
        } else if (r.error == "ACLIST") {

            if (acCheckAcl('user')) {

                Frame.titleShow(0);

                acMaskAcl(r.value, r.value);// mask with itself

                // no checkacl need
                Frame.containerInitialize([{
                    glyphicon: "glyphicon glyphicon-plus",
                    name: "新建用户",
                    fun: acUserAdd,
                    param: r.value
                }]);
            } else {
                Frame.titleWarning('无创建用户权限');
            }

        }
    });
}

function acClassesView(uname, qobj) {
    if ($(qobj).html() == "") {

        var div = Frame.Tools.createNode("div", "margin-2 padding-2");
        $(qobj).append(div);

        $(div).append("<label>范围:</label><br/>");

        if (_user == uname) {
            // myself
            $(div).append(acInfoView(uname, "none"));
        } else {

            // view myself with class,then, mask with uname valus
            $.getJSON("jsonApi.php", {
                api: "getUser",
                user: uname
            }, function (r) {
                if (r.error == "OK") {
                    var ac_div = acInfoView(_user, r.value.flag);
                    $(div).append(ac_div);

                    var flag = r.value.flag;

                    $.getJSON("jsonApi.php", {
                        api: "acInfo",
                        user: uname
                    }, function (r2) {
                        $(r2.value).each(function (i, it) {
                            if (flag == "class") {
                                $(ac_div).find("[cid=" + it.cid + "]").prop("checked", true);
                            } else {
                                $(ac_div).find("[sid=" + it.sid + "]").prop("checked", true);
                            }
                        });

                        var button = Frame.Tools.createNodeWithGlyph("glyphicon glyphicon-ok", "button",
                            "btn btn-default disabled my-button my-button-right", "修改");

                        $(div).append("<hr/>").append(button);
                        $(ac_div).find("input").change(function () {
                            Frame.Tools.activeButton(button);
                        });

                        $(button).click(function () {
                            var si = new Frame.ButtonInfo(this);
                            if (si.isDisabled()) {
                                return;
                            }

                            var a = [];
                            $(ac_div).find(":checked").each(function (i, it) {
                                if (flag == "class") {
                                    a.push($(it).attr("cid"));
                                } else {
                                    a.push($(it).attr("sid"));
                                }
                            });

                            $.getJSON("jsonApi.php", {
                                api: "acInfoEdit",
                                user: uname,
                                obj: a
                            }, function (r3) {
                                if (r3.error == "OK") {
                                    si.ok();
                                    si.active(false);
                                } else {
                                    si.failed(r3.value);
                                }
                            })

                        });
                    });
                }
            });
        }
    }
}

function acUser(item) {
    var lis = [Frame.containerItem("glyphicon glyphicon-info-sign", "用户信息", acUserInfo, item.uname),
        Frame.containerItem("glyphicon glyphicon-lock", "权限", acUserAcEdit, item.uname),
        Frame.containerItem("glyphicon glyphicon-globe", "管理对象", acClassesView, item.uname),
        Frame.containerItem("glyphicon glyphicon-info-sign", "用户事件", acUserEvent, item.uname)];

    if (acCheckAcl('user')) {

        $.getJSON('jsonApi.php', {
            api: 'acList',
            user: _user
        }, function (r) {

            if (r.error == 'OK') {
                lis.push(Frame.containerItem("glyphicon glyphicon-plus", "新建用户", acUserAdd, r.value, true));
            }

            Frame.containerInitialize(lis);
        });
    } else {
        Frame.containerInitialize(lis);
    }
}

function acUserInfo(uname, qobj) {

    var edit = (uname == _user);

    if ($(qobj).html() == "") {
        $.getJSON("jsonApi.php", {
            api: "getUser",
            user: uname
        }, function (r) {
            if (r.error == "OK") {
                acUserInfoForm(r.value, qobj, edit);
            }
        });
    }
}

function acMifare(uname, qobj) {

    if ($(qobj).html() == "") {
        var div = Frame.Tools.createNode("div", "margin-2 pading2");
        $(qobj).append(div);

        $(div).append("<label>用户列表：</label><hr class='hr-up'/>");

        var div1 = Frame.Tools.createNode("div", 'row');
        $(div).append(div1);

        var c1 = Frame.Tools.createNode("div", "col-sm-6");
        var c2 = Frame.Tools.createNode("div", "col-sm-6");

        var s = '<div class="row">' +
            '<div class="col-sm-3">用户</div>' +
            '<div class="col-sm-3">姓名</div>' +
            '<div class="col-sm-6">卡号</div></div>';
        $(c1).append(s).appendTo(div1);
        $(c2).append(s).appendTo(div1);

        $.getJSON("jsonApi.php", {
            api: "mifare"
        }, function (r) {
            if (r.error == "OK") {

                $(r.value).each(function (i, it) {

                    if (it.etag && it.etag.length == 8) {
                        var t1 = '<span class="glyphicon glyphicon-check"></span>';
                        var t2 = '<div class="green">' + it.etag + ',</div>';
                        var t3 = '<a href="#" uid="' + it.uid + '">' +
                            '补卡</a>';
                    } else {
                        var t1 = '<span class="glyphicon glyphicon-unchecked"></span>';
                        var t2 = '<div class="green"></div>';
                        var t3 = '<a href="#" uid="' + it.uid + '">' +
                            '发卡</a>';
                    }

                    var s = '<div class="row">' +
                        '<div class="col-sm-3">' + it.uname + '</div>' +
                        '<div class="col-sm-3">' + it.username + '</div>' +
                        '<div class="col-sm-6">' + t2 + t3 + '</div></div>';

                    if (i > r.value / 2) {
                        $(c2).append(s);
                    } else {
                        $(c1).append(s);
                    }
                });

                $(div1).find("a[uid]").click(function () {

                    var si = new Frame.ButtonInfo(this);
                    if (si.isDisabled()) {
                        return;
                    }

                    si.clear("...");

                    var uid = $(this).attr('uid');
                    var s = "http://localhost:4050/mifare";

                    var tag=$(this).prev();

                    $.getJSON(s, {
                        uid: uid,
                        utype: 10
                    }, function (r) {
                        if (r.error == 'OK') {
                            si.ok('成功');
                            tag.text(r.value);
                        } else {
                            if(r.value==1) {
                                si.failed('失败');
                            }else if(r.value==3){
                                si.failed(('读卡器或卡错误'))
                            }else if(r.value==4){
                                si.failed('无法读卡数据');
                            }else if(r.value==5){
                                si.failed('写卡错误');
                            }else{
                                si.failed('错误:'+r.value);
                            }
                        }
                    });
                });
            }
        });

        $(div).append("<hr/>");
        $(div).append('<div class="small">' +
            '写卡要求预安装<a href="mifare/mifare.exe">写卡软件</a>和写卡设备</div>');
    }
}

function acPassword(uname, qobj) {

    if ($(qobj).html() == "") {

        $.getJSON("jsonApi.php", {
            api: "getUser",
            user: uname
        }, function (r) {
            if (r.error == "OK") {

                var item = r.value;
                var div = Frame.Tools.createNode("div", "margin-2 padding-2");
                $(qobj).append(div);

                var pass1_div = Frame.Tools.createInputWithLabel("password", "原密码", null, null, 200);
                $(div).append(pass1_div).append("<br/>");

                var pass2_div = Frame.Tools.createInputWithLabel("password", "新密码", null, null, 200);
                $(div).append(pass2_div).append("<br/>");

                var pass3_div = Frame.Tools.createInputWithLabel("password", "重复密码", null, null, 200);
                $(div).append(pass3_div).append("<br/>");

                $(div).append("<hr/>");

                var button = Frame.Tools.createNodeWithGlyph("glyphicon glyphicon-ok", "button",
                    "btn btn-default disabled my-button my-button-right", "修改");

                $(div).append(button);
                $(div).find("input").change(function () {
                    Frame.Tools.activeButton(button);
                });

                $(button).click(function () {
                    var si = new Frame.ButtonInfo(this);
                    if (si.isDisabled()) {
                        return;
                    }

                    var pass1 = $(pass1_div).find("input").val();
                    var pass2 = $(pass2_div).find("input").val();
                    var pass3 = $(pass3_div).find("input").val();

                    if (pass1.length < 5 || pass2.length < 5 || pass2 != pass3) {
                        si.validFailed("请填写密码");
                        return;
                    }

                    $.getJSON("jsonApi.php", {
                        api: "changePass2",
                        pass1: pass1,
                        pass2: pass2,
                        uid: item.uid

                    }, function (r2) {
                        if (r2.error == "OK") {
                            si.ok();
                            Frame.Tools.activeButton(button, false);
                        } else {
                            si.failed(r2.value);
                        }
                    });

                });
            }
        });
    }
}

function acMyAc(uname, qobj) {
    if ($(qobj).html() == "") {
        $.getJSON("jsonApi.php", {
            api: "acList",
            user: uname
        }, function (r) {
            if (r.error == "OK") {
                var item = r.value;

                var div = Frame.Tools.createNode("div", "margin-2 padding-2");
                $(qobj).append(div);
                $(div).append("<br/>").append("<label>当前用户权限列表:</label><hr class=\"hr-up\" />");

                var div2 = createAcView(item, false);
                $(div).append(div2);

                $(div).append('<hr/><div class="text-right small green">无法修改自己的权限</div>');
            }
        });
    }
}

function acUserEvent(uname, qobj) {
    if ($(qobj).html() == "") {
        var div = Frame.Tools.createNode("div", "margin-2 padding-2", null, "userEvent-" + uname);
        $(qobj).append(div);
        userEvent(uname, 1);
    }
}

function userEvent(uname, page) {

    var div = $("#userEvent-" + uname);

    $.getJSON("jsonApi.php", {
        api: "userEvent",
        user: uname,
        page: page - 1
    }, function (r) {

        if (r.error == "OK") {

            $(div).empty();

            var div1 = Frame.Tools.createNode("table", "table");
            $(div).append(div1);

            var row = Frame.Tools.createNode("tr");
            var c1 = Frame.Tools.createNode("td", "text-center-", "序号");
            $(row).append(c1);

            var c2 = Frame.Tools.createNode("td", "text-center-", "时间");
            $(row).append(c2);

            var c3 = Frame.Tools.createNode("td", "text-center-", "用户");
            $(row).append(c3);

            var c4 = Frame.Tools.createNode("td", "text-center-", "事件描述");
            $(row).append(c4);
            $(div1).append(row);

            $(r.value).each(function (i, it) {
                if (it.lid == 1) {
                    var row = Frame.Tools.createNode("tr", "warning");
                } else {
                    var row = Frame.Tools.createNode("tr", "logger");
                }

                var no = (page - 1) * r.value2.pageSize + i + 1;
                var c1 = Frame.Tools.createNode("td", null, no);
                $(row).append(c1);

                var c2 = Frame.Tools.createNode("td", null, it.created);
                $(row).append(c2);

                var c3 = Frame.Tools.createNode("td", null, it.obj_id);
                $(row).append(c3);

                var c3 = Frame.Tools.createNode("td", null, it.event_desc);
                $(row).append(c3);

                $(div1).append(row);
            });

            var pageind = r.value2;
            pageind.fun = "userEvent";
            pageind.param = uname;

            var d = Frame.Tools.createPageInd(pageind);
            $(div).append(d);
        }
    });
}

function acUserAcEdit(uname, qobj) {

    if ($(qobj).html() == "") {

        var div = Frame.Tools.createNode("div", "margin-2 padding-2");
        $(qobj).append(div);

        $.getJSON("jsonApi.php", {
            api: "acList",
            user: _user
        }, function (r) {

            var mask = r.value;

            $.getJSON("jsonApi.php", {
                api: "acList",
                user: uname
            }, function (r) {
                if (r.error != "OK") {
                    return;
                }

                var div1 = Frame.Tools.createNode("div", "panel panel-default margin-1 padding-2");
                $(div).append(div1);

                var aclist = r.value;
                acMaskAcl(aclist, mask);

                var ac_div = createAcView(aclist, true);
                $(div1).append(ac_div);

                $(div).append("<br/>");

                var button = Frame.Tools.createNodeWithGlyph("glyphicon glyphicon-ok", "button",
                    "btn btn-default disabled my-button my-button-right", "修改");

                $(div).append(button);
                $(div).find("input").change(function () {
                    Frame.Tools.activeButton(button);
                });

                $(button).click(function () {
                    var si = new Frame.ButtonInfo(this);
                    if (si.isDisabled()) {
                        return;
                    }

                    var a1 = 0;
                    $(ac_div).find("input").each(function (i, chk) {
                        if ($(chk).prop("checked")) {
                            var t = $(chk).prop("acid");
                            a1 = a1 + Number(t);
                        }
                    });

                    $.getJSON("jsonApi.php", {
                        api: "setAcl",
                        user: uname,
                        acl: a1
                    }, function (r) {
                        if (r.error == "OK") {
                            si.ok();
                            si.active(false);
                        } else {
                            si.failed(r.value);
                        }
                    });

                });
            });
        });
    }
}

function acObjTitle(item) {
    var lis = [Frame.containerItem("glyphicon glyphicon-lock", "权限", acObjView, item),
        Frame.containerItem("glyphicon glyphicon-plus", "新建用户", acUserAdd, item, true)];

    Frame.containerInitialize(lis);
}

function createAcView(acList, canEdit) {
    var div2 = Frame.Tools.createNode("div", "my-table");

    function row(t1, t2, acid, enable) {
        var row = Frame.Tools.createNode("div", "col-sm-4");
        var chk = Frame.Tools.createCheckBox(t1, t2);
        $(chk).addClass('margin-1');

        if (!enable) {
            $(chk).addClass("disabled");
            $(chk).find("input").attr("disabled", "disabled");
        }
        $(chk).find("input").prop("acid", acid);
        $(row).append(chk);

        return row;
    }

    for (var i = 0; i < acList.length; i++) {
        var tr = Frame.Tools.createNode("div", "row");
        var c1 = row(acList[i].title, acList[i].checked, acList[i].acid, canEdit ? acList[i].mask : false);
        $(tr).append(c1);

        if (i + 1 < acList.length) {
            i++;
            var c2 = row(acList[i].title, acList[i].checked, acList[i].acid, canEdit ? acList[i].mask : false);
            $(tr).append(c2);

            if (i + 1 < acList.length) {
                i++;
                var c3 = row(acList[i].title, acList[i].checked, acList[i].acid, canEdit ? acList[i].mask : false);
                $(tr).append(c3);
            }
        }
        $(div2).append(tr);
    }

    return div2;
}

function acObjView(item, qobj) {
    if ($(qobj).html() == "") {

        $.getJSON("jsonApi.php", {
            api: "acList",
            uid: item.uid
        }, function (r) {
            if (r.error != "OK") {
                return;
            }

            var div = Frame.Tools.createNode("div", "margin-2 padding-2");
            $(qobj).append(div);
            $(div).append("<br/>").append("<label>当前用户权限列表:</label><hr class=\"hr-up\" />");

            var div2 = createAcView(r.value, false);
            $(div).append(div2);

        });
    }
}

function acUserInfoForm(item, qobj, isEdit) {

    var div = Frame.Tools.createNode("div", "margin-2 padding-2");
    $(qobj).append(div);

    var uname_div = Frame.Tools.createInputWithLabel("text", "用户名称", null, item.uname, 200);
    $(uname_div).addClass("disabled");
    $(uname_div).find("input").attr("disabled", "disabled");
    $(div).append(uname_div);

    var username_div = Frame.Tools.createInputWithLabel("text", "用户姓名", null, item.username, 200);
    if (!isEdit) {
        $(username_div).addClass("disabled");
        $(username_div).find("input").attr("disabled", "disabled");
    }
    $(div).append(username_div);

    var mobile_div = Frame.Tools.createInputWithLabel("text", "手机号码", null, item.mobile, 200);
    if (!isEdit) {
        $(mobile_div).addClass("disabled");
        $(mobile_div).find("input").attr("disabled", "disabled");
    }
    $(div).append(mobile_div);

    var chk_div = Frame.Tools.createCheckBox('接收告警短信消息', (item.alert_notify == 1 && _user != 'admin'));
    $(div).append(chk_div).append('<br/>');
    if (!isEdit || _user == 'admin') {
        $(chk_div).addClass("disabled");
        $(chk_div).find("input").attr("disabled", "disabled");
    }

    if (item.last_login) {
        var s = "<div class=\"small\">已登录:" + item.login_count + "次，最后登录：" + item.last_login + "</div>";
        $(div).append(s);
    } else {
        var s = "<p>尚未登录过</div>";
        $(div).append(s);
    }

    if (!isEdit) {
        return;
    }

    $(div).append("<hr/>");
    var button = Frame.Tools.createNodeWithGlyph("glyphicon glyphicon-ok", "button",
        "btn btn-default disabled my-button my-button-right", "修改");

    $(div).append(button);
    $(div).find("input").change(function () {
        Frame.Tools.activeButton(button);
    });

    $(button).click(function () {
        var si = new Frame.ButtonInfo(this);
        if (si.isDisabled()) {
            return;
        }

        var username_val = $(username_div).find("input").val();
        if (!username_val) {
            si.validFailed("用户姓名错误");
        }

        var mobile_val = $(mobile_div).find("input").val();
        if (!mobile_val.match(/^1[3578]{1}[0-9]{9}/)) {
            si.validFailed("手机号码错误");
        }

        var chk = _user != 'admin' && $(chk_div).find("input").prop('checked');

        if (si.count()) {
            return;
        }

        $.getJSON("jsonApi.php", {
            api: "changeUserinfo",
            username: username_val,
            mobile: mobile_val,
            uid: item.uid,
            alert: chk
        }, function (r2) {
            if (r2.error == "OK") {
                si.ok();
                Frame.Tools.activeButton(button, false);
            } else {
                si.failed(r2.value);
            }
        });
    });
}

function acUserAdd(aclist, qobj) {
    if ($(qobj).html() == "") {

        if (!acCheckAcl('user')) {
            Frame.Tools.accessDenied(qobj);
            return;
        }

        var div = Frame.Tools.createNode("div", "margin-2 padding-2");
        $(qobj).append(div);

        var row = Frame.Tools.createNode("div", "row");
        var c1 = Frame.Tools.createNode("div", "col-sm-6");
        var uname_div = Frame.Tools.createInputWithLabel("text", "用户名", "不少于5个字母或数字", null, 200);
        $(c1).append(uname_div);
        $(row).append(c1);

        var c2 = Frame.Tools.createNode("div", "col-sm-6");
        var pass_div = Frame.Tools.createInputWithLabel("password", "密码", null, null, 200);
        $(c2).append(pass_div);
        $(row).append(c2);

        $(div).append(row);

        var username_div = Frame.Tools.createInputWithLabel("text", "姓名", "中文名字", null, 200);
        $(div).append(username_div);

        $(div).append("<label>权限:</label><hr class=\"hr-up\"/>");
        var ac1_div = createAcView(aclist, true);
        $(div).append(ac1_div).append("<br/>");

        if (_user_flag == 'class') {
            $(div).append("<label>范围:</label>");
        } else {
            var flags = [{
                name: "学校",
                value: "school"
            }, {
                name: "班级",
                value: "class"
            }];
            var flag_val = "class";
            var dp = Frame.Tools.createDropDown(flags, flags[1].name, function (val) {
                flag_val = val;
                $(ac2_div).empty().append(acInfoView(_user, flag_val));
                $(ac2_div).find("input").change(function () {
                    Frame.Tools.activeButton(button);
                });
            });
            $(div).append(dp);
        }
        var ac2_div = Frame.Tools.createNode("div");
        $(ac2_div).append(acInfoView(_user, "class"));
        $(div).append(ac2_div);

        $(div).append("<hr class=\"hr-up\" />");

        var button = Frame.Tools.createNodeWithGlyph("glyphicon glyphicon-ok", "button",
            "btn btn-default disabled my-button my-button-right", "确认");

        $(div).append(button);
        $(div).find("input").change(function () {
            Frame.Tools.activeButton(button);
        });

        $(button).click(function () {
            var si = new Frame.ButtonInfo(this);
            if (si.isDisabled()) {
                return;
            }

            var uname_val = $(uname_div).find("input").val();
            if (!uname_val || uname_val.length < 5) {
                si.validFailed("用户名不能少于5个字符", uname_div);
            } else {
                si.validOk(uname_div);
            }

            var pass_val = $(pass_div).find("input").val();
            if (!pass_val) {
                si.validFailed("请设置密码", pass_div);
            } else {
                si.validOk(pass_div);
            }

            var username_val = $(username_div).find("input").val();
            if (!username_val) {
                si.validFailed("姓名错误", username_div);
            } else {
                si.validOk(username_div);
            }

            var a1 = 0;
            $(ac1_div).find("input").each(function (i, chk) {
                if ($(chk).prop("checked")) {
                    a1 = a1 + Number($(chk).prop("acid"));
                }
            });

            var a2 = [];
            $(ac2_div).find("input").each(function (i, chk) {
                if ($(chk).prop("checked")) {
                    if (flag_val == "school") {
                        var t = $(chk).prop("sid");
                    } else {
                        var t = $(chk).prop("cid");
                    }

                    a2.push(t);
                }
            });
            if (a2.length == 0) {
                si.validFailed("学校班级错误");
            }

            if (si.count()) {
                return;
            }

            $.getJSON("jsonApi.php", {
                api: "userAdd",
                uname: uname_val,
                pass: pass_val,
                username: username_val,
                ac: a1,
                obj: a2,
                puser: _user,
                flag: flag_val
            }, function (r) {
                if (r.error == "OK") {
                    si.ok();
                    si.active(false);
                } else {
                    si.failed(r.value);
                }
            });

            Frame.Tools.activeButton(button, false);
        });
    }
}

function acMaskAcl(acList, mask) {
    for (var i = 0; i < acList.length; i++) {
        acList[i].mask = mask[i].checked;
    }
}

/**
 *
 * @param uname
 * @param flag
 *            =school/class/none
 * @returns
 */
function acInfoView(uname, flag) {

    var tab = Frame.Tools.createNode("table", "table my-table");

    $.getJSON("jsonApi.php", {
        api: "acInfo",
        user: uname
    }, function (r) {
        if (r.error != "OK" || r.value.length == 0) {
            return;
        }

        var items = r.value;

        var i = 0
        while (i < items.length) {

            var tr = Frame.Tools.createNode("tr");

            var sid2 = items[i].sid;

            var td1 = Frame.Tools.createNode("td", "col-sm-2");
            if (flag == "school") {
                var t = Frame.Tools.createCheckBox(items[i].sname);
                $(t).find("input").prop("sid", items[i].sid).attr("sid", items[i].sid);
                $(td1).append(t);
            } else {
                $(td1).append(Frame.Tools.createNode("div", null, items[i].sname));
            }
            $(tr).append(td1);

            var td3 = Frame.Tools.createNode("td");
            while (i < items.length) {
                if (items[i].sid != sid2) {
                    break;
                }

                if (flag == "class") {
                    var t = Frame.Tools.createCheckBox(" " + items[i].cname, false, true);
                    $(t).find("input").prop("cid", items[i].cid).attr("cid", items[i].cid);
                    $(td3).append(t);
                } else {
                    $(td3).append(Frame.Tools.createNode("span", null, items[i].cname));
                }
                $(td3).append("&emsp;");

                i++;
            }

            $(tr).append(td3);
            $(tab).append(tr);
        }
    });

    return tab;
}