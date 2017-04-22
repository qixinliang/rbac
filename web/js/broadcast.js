/**
 * liuhuisong@hotmail.com
 */

const TASK_STATUS_WAIT = 0;
const TASK_STATUS_FMS_NOTIFIED = 1;
const TASK_STATUS_FMS_READY = 2;
const TASK_STATUS_PLAYING = 3;
const TASK_STATUS_STOPPED = 4;
const TASK_STATUS_CANCELED = 5;

function menu_media(id, page) {

	$.ajax({
		url: '/mediatype/list',
		type: 'get',	
		dataType: 'json',
		data:{},
		success: function(result){
        	if (result.error != "OK" || !(result.value instanceof Array)) {
            	Frame.titleWarning("no media type");
            	return;
        	}
        	var lis = [Frame.titleItem('所有类别', "mediaView", -1),
            	Frame.titleItem('---')];
        	var items = result.value;
        	for (var i = 0; i < items.length; i++) {
            	var s = '<span mtid="' + items[i].mtid + '">' + items[i].name + '</span>' +
                	'<span class="glyphicon glyphicon-edit inline-edit pull-right"></span>';

            	lis.push(Frame.titleItem(s, "mediaView", items[i].mtid));
        	}
        	var ul = Frame.titleInitialize(lis);

        	if (acCheckAcl('media')) {
            	Frame.Tools.inlineEdit($(ul).find('span.inline-edit'), function (prev, t) {
					//TODO 媒体名称更新
                	$.getJSON('jsonApi.php', {
                    	api: 'mediaTypeNameUpdate',
                    	mtid: $(prev).attr('mtid'),
                    	text: t
                	}, function (r) {
                    	if (r.error == 'OK') {
                        	$(prev).text(t);
                    	}
                	});
            	});
        	} else {
            	$(ul).find('span.inline-edit').remove();
        	}
		}
	});
}

function menu_video_session(mtid, page) {

    if (!page) {
        page = 1;
    }

    $.getJSON('jsonApi.php', {
        api: 'videoSessionList',
        user: _user,
        page: page - 1
    }, function (r) {
        if (r.error == 'OK') {

            var lis = [];
            $(r.value).each(function (i, it) {
                var tm = it.created.substr(11);//get time
                var t = $('<div>' + tm + ' ' + it.sname + '/' + it.cname + '</div>');
                lis.push(Frame.titleItem(t, videoSessionView, it.mid));
            });

            var pageind = r.value2;
            pageind.fun = menu_video_session;
            pageind.param = 0;

            Frame.titleInitialize(lis, pageind);

        } else {
            Frame.titleWarning('目前无任何视频');
        }
    });
}

function videoSessionView(mid) {

    var lis = [Frame.containerItem("glyphicon glyphicon-info-sign", "常规", videoSessionInfo, mid)];

    if (acCheckAcl('media')) {
        lis.push(Frame.containerItem('glyphicon glyphicon-plus', '视频推送', videoTask, mid, true));
    }

    Frame.containerInitialize(lis);
}

function videoSessionInfo(mid, qobj) {
    if ($(qobj).html() == '') {

        var div = Frame.Tools.createNode("div", "panel panel-default panel-line-height margin-2 padding-2");
        $(qobj).append(div);

        $.getJSON('jsonApi.php', {
            api: 'videoSessionInfo',
            mid: mid
        }, function (r) {
            if (r.error != "OK") {
                $(qobj).append('<div class="alert alert-info">没有获取到数据:' + r.value + '</div>');
                return;
            }

            var div2 = Frame.Tools.createNode("div", "row");
            var left = Frame.Tools.createNode("div", "col-sm-5");
            var right = Frame.Tools.createNode("div", "col-sm-7");
            $(div2).append(left).append(right).appendTo(div);

            $(left).append(col("主叫:", r.value.cname));
            $(left).append(col("时间:", r.value.created));
            $(left).append(col("URL:", r.value.url));

            var fms_view = Frame.Tools.createNode("div", "panel");
            $(right).append(fms_view);

            var s = fmsView(r.value.url, false);
            $(fms_view).append(s);
        });
    }
}

function videoTask(mid, qobj) {

    if ($(qobj).html() == '') {

        var div = Frame.Tools.createNode("div");
        $(qobj).append(div);

        $.getJSON('jsonApi.php', {
            api: 'videoSessionInfo',
            mid: mid
        }, function (r) {
            if (r.error == 'OK') {
                var s = r.value.mid + ',' + 'video:' + r.value.created;
                taskCreate(s, div);
            }
        });
    }
}

function mediaView(mtid) {

    var lis = [Frame.containerItem("glyphicon glyphicon-film", "媒体资源", mediaList, mtid)];

    if (acCheckAcl('media')) {
        if (mtid != -1) {
            //lis.push(Frame.containerItem("glyphicon glyphicon-edit", "编辑类别", mediaTypeEdit, mtid));
        }
        lis.push(Frame.containerItem("glyphicon glyphicon-plus", "增加媒体", mediaAdd, mtid, true));
        lis.push(Frame.containerItem("glyphicon glyphicon-plus", "增加类别", mediaTypeAdd, mtid, true));
    }

    Frame.containerInitialize(lis);
}

function mediaList(mtid, qobj) {

    if ($(qobj).html() == "") {
        var div = Frame.Tools.createNode('div', 'row');
        $(qobj).append(div);

        var c1 = Frame.Tools.createNode('div', 'col-sm-7');
        var c2 = Frame.Tools.createNode('div', 'col-sm-5');

        $(div).append(c1).append(c2);

        var div2 = Frame.Tools.createNode('div');
        $(c1).append(div2);

        var fms_view_div = Frame.Tools.createNode('div');
        $(c2).append('<br/>').append(fms_view_div);

        fmsViewChanged(fms_view_div, null);

        $(div2).prop('mtid', mtid);
        $(div2).prop('fms-view', fms_view_div);
        mediaListPage(div2, 1);
    }
}

function mediaListPage(qobj, page) {

    var mtid = $(qobj).prop('mtid');
    $(qobj).empty();

    var fms_div = $(qobj).prop('fms-view');

    $.getJSON("jsonApi.php", {
        api: "mediaList",
        type: mtid,
        user: _user,
        page: -1//page - 1
    }, function (result) {
        if (result.error != "OK") {

            var div = Frame.Tools.createNode("div", "padding-tab info", "没有数据");
            $(qobj).append(div);
            return;
        }

        var div = Frame.Tools.createNode("div",'title-area-view2 scroll-vertical');
        $(qobj).append('<br/>').append(div).append('<br/>');

        var tab = Frame.Tools.createNode("table", "table table-condensed");
        $(div).append(tab);

        var s = ["名称", "次数", "最后播放时间"];
        if (acCheckAcl('media')) {
            s.push('删除');
        }
        s.push(' ');

        var row = Frame.Tools.createTableRow(null, s);
        var thead = Frame.Tools.createNode('thead');
        $(thead).append(row).appendTo(tab);

        var tbody = Frame.Tools.createNode('tbody');
        $(tab).append(tbody);

        $(result.value).each(function (i, it) {

            var s2 = [it.name, it.played, it.last_play ? it.last_play : " "];
            if (acCheckAcl('media')) {
                if (it.user == _user) {
                    var del = $("<span class=\"glyphicon glyphicon-remove my-remove\"></span>");
                    $(del).prop("data", it.mid);
                    s2.push(del);
                } else {
                    s2.push(' ');
                }
            }

            var nc = $('<a href="#"><span class="glyphicon glyphicon-play"></span></a>');
            $(nc).prop('url', it.url);
            $(nc).attr('title', it.url);

            $(nc).click(function () {
                var url = $(this).prop('url');
                fmsViewChanged(fms_div, url, $(nc).text());
            });
            s2.push(nc);

            var row = Frame.Tools.createTableRow(null, s2);
            $(tbody).append(row);
        });

        $(tab).find('span.my-remove').click(function () {
            var mid = $(this).prop("data");
            var tr = $(this).parentsUntil("tr").parent();
            var span = this;

            $.getJSON("jsonApi.php", {
                api: "mediaDelete",
                mid: mid
            }, function (r) {
                if (r.error == "OK") {
                    if (r.value == 'deleted') {
                        $(tr).addClass('my-deleted');
                        $(span).removeClass('glyphicon-remove').addClass('glyphicon-repeat');
                    } else {
                        $(tr).removeClass('my-deleted');
                        $(span).removeClass('glyphicon-repeat').addClass('glyphicon-remove');
                    }
                }
            });
        });

        /*
        var pageind = result.value2;
        pageind.fun = mediaListPage;
        pageind.param = qobj;

        $(div).append(Frame.Tools.createPageInd(pageind)).append('<br/>');
        */
    });
}

function mediaTypeEdit(mtid, qobj) {

    if ($(qobj).html() == "") {

        if (!acCheckAcl('media')) {
            Frame.Tools.accessDenied(qobj);
            return;
        }

        var div = Frame.Tools.createNode('div');
        $(qobj).append(div);

        $.getJSON("jsonApi.php", {
            api: "mediaTypeInfo",
            mtid: mtid
        }, function (result) {
            if (result.error == "OK") {
                mediaType(div, result.value);
            }
        });
    }
}

function mediaAdd(mtid, qobj) {
    $(qobj).empty();

    if (!acCheckAcl('media')) {
        Frame.Tools.accessDenied(qobj);
        return;
    }

    $.getJSON("jsonApi.php", {
        api: "mediaTypeList"
    }, function (result) {

        if (result.error != "OK") {
            return;
        }

        var div = Frame.Tools.createNode("div", "padding-2");
        $(qobj).append(div);

        var upd_div = Frame.Tools.createInputWithLabel('file', '媒体文件', null, null, 400);
        $(upd_div).find('input').attr('accept', 'video/mp4,audio/mp3');//type list
        $(div).append(upd_div).append("<br/>");

        var name_div = Frame.Tools.createInputWithLabel("text", "名称", "张宁的公开课3", null, 200);
        $(div).append(name_div).append("<br/>");

        $(div).append('<label>分类:</label><hr class="hr-up"/>');
        var type_div = Frame.Tools.createNode("div", "my-table");
        $(div).append(type_div);

        var items = result.value;
        for (var i = 0; i < items.length; i++) {
            var chk = Frame.Tools.createCheckBox(items[i].name, items[i].mtid == mtid);
            $(chk).find("input").prop("mtid", items[i].mtid);

            if (i % 4 == 0) {
                var row = Frame.Tools.createNode('div', 'row');
                $(type_div).append(row);
            }

            var col = Frame.Tools.createNode("div", "col-sm-3", chk);
            $(col).append(chk).appendTo(row);
        }

        var button = Frame.Tools.createNodeWithGlyph("glyphicon glyphicon-ok", "button",
            "btn btn-default disabled my-button my-button-right", "增加");

        $(div).append('<hr class="hr-up"/>').append(button);
        /* $(div).append("<br/><br/>"); */

        $(div).find("input").change(function () {
            Frame.Tools.activeButton(button);
        });

        $(button).click(function () {
            var si = new Frame.ButtonInfo(this);
            if (si.isDisabled()) {
                return;
            }

            var filename = $(upd_div).find("input").val();
            if (!filename) {
                si.validFailed('没有媒体文件', upd_div);
            } else {
                var ext = filename.substr(filename.length - 3).toLowerCase();
                if (ext != 'mp4' && ext!='mp3') {
                    si.validFailed('只能是mp4,mp3媒体文件', upd_div);
                } else {
                    si.validOk(upd_div);
                }
            }

            var name = $(name_div).find("input").val();
            if (!name) {
                si.validFailed('名称为空', name_div);
            } else {
                si.validOk(name_div);
            }

            var t = 0;
            $(type_div).find(":checked").each(function (i, it) {
                t += Number($(it).prop("mtid"));
            });

            if (t == 0) {
                si.validFailed("没有指定类别");
            }

            if (si.count()) {
                return;
            }

            var data = $(upd_div).find('input').get(0).files[0];

            var formdata = new FormData();
            formdata.append("file1", data);
            formdata.append("name", name);
            formdata.append("user", _user);
            formdata.append("type", t);

            if (formdata.length > 1024 * 1024 * 1024 * 3) {
                si.validFailed("文件不能大于3G");
                return;
            }

            $.ajax({
                type: "POST",
                url: "jsonApi.php?api=mediaAdd",
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
                        si.active(false);
                    } else {
                        si.failed(r2.value);
                    }
                }
            });
        });
    });
}

function mediaTypeAdd(mtid, qobj) {

    if ($(qobj).html() == "") {

        if (!acCheckAcl('media')) {
            Frame.Tools.accessDenied(qobj);
            return;
        }

        mediaType(qobj);
    }
}

function mediaType(qobj, edit) {

    var div = Frame.Tools.createNode("div", "padding-tab");
    $(qobj).append(div);

    var name = null;
    if (edit) {
        name = edit.name;
    }

    var name_div = Frame.Tools.createInputWithLabel("text", "类别名称", "类别", name, 200);
    $(div).append(name_div);
    $(div).append("<br/>");

    /*
     var note = null;
     if (edit) {
     note = edit.note;
     }
     var note_div = Frame.Tools.createInputWithLabel("text", "备注 ", "有趣的视频", note, 400);
     $(div).append(note_div);
     $(div).append("<br/>");
     */

    var button = Frame.Tools.createNodeWithGlyph("glyphicon glyphicon-ok", "button",
        "btn btn-default disabled my-button my-button-right", edit ? "修改" : "增加");

    $(div).append("<hr/>");
    $(div).append(button);
    /* $(div).append("<br/><br/>"); */

    $(div).find("input").change(function () {
        Frame.Tools.activeButton(button);
    });

    $(button).click(function () {
        var si = new Frame.ButtonInfo(this);
        if (si.isDisabled()) {
            return;
        }

        var name = $(name_div).find("input").val();
        if (!name) {
            si.validFailed("没有名称");
            return;
        }

        /*
         var note = $(note_div).find("input").val();
         if (!note) {
         si.validFailed("没有备注");
         return;
         }*/
        var note = name;

        var mtid = 0;
        if (edit) {
            mtid = edit.mtid;
        }

		//xl added
		var url = '';
		var data = {};
		if(edit){
			url = '/mediatype/edit';
			data = {name: name,note: note,mtid: mtid};
		}else{
			url = '/mediatype/add';
			data = {name: name,note: note};
		}

		$.ajax({
			url : url,
			type: 'post',
			dataType: 'json',
			data: data,
			success: function(r){
            	if (r.error == "OK") {
                	si.ok();
                	if (!edit) {
                    	// add
                    	Frame.titleAdd(name, mediaView, r.value);
                	}
            	} else {
                	si.failed(r.value);
            	}
			}
		});

/*
        $.getJSON("jsonApi.php", {
            api: edit ? "mediaTypeEdit" : "mediaTypeAdd",
            name: name,
            note: note,
            mtid: mtid
        }, function (r) {
            if (r.error == "OK") {
                si.ok();
                if (!edit) {
                    // add
                    Frame.titleAdd(name, mediaView, r.value);
                }
            } else {
                si.failed(r.value);
            }
        });*/

    });
}

function menu_broadcast_task(id, page) {
    $.getJSON("jsonApi.php", {
        api: "taskList",
        page: -1//page - 1
    }, function (r) {
        if (r.error != "OK" || r.value.length == 0) {
            if (acCheckAcl('task')) {
                Frame.containerInitialize(
                    [Frame.containerItem("glyphicon glyphicon-plus", "广播", taskCreate, 0, true)/*,
                     Frame.containerItem("glyphicon glyphicon-plus", "媒体", mediaAdd, 0, true),
                     Frame.containerItem("glyphicon glyphicon-plus", "类别", mediaTypeAdd, 0, true)*/]);
            } else {
                Frame.titleWarning('无任何广播数据');
            }
        } else {
            var lis = [];
            var items = r.value;

            for (var i = 0; i < items.length; i++) {
                var t = Frame.Tools.createNode("div", 'row');
                var c1 = Frame.Tools.createNode('div', 'col-sm-2');
                if (items[i].status == TASK_STATUS_WAIT) {
                    $(c1).append($('<span class="glyphicon glyphicon-time"></span>'));
                } else if (items[i].status == TASK_STATUS_FMS_NOTIFIED || items[i].status == TASK_STATUS_FMS_READY) {
                    $(c1).append($('<span class="glyphicon glyphicon-hourglass"></span>'));
                } else if (items[i].status == TASK_STATUS_PLAYING) {
                    $(c1).append($('<span class="glyphicon glyphicon-play"></span>'));
                } else if (items[i].status == TASK_STATUS_STOPPED) {
                    $(c1).append($('<span class="glyphicon glyphicon-stop"></span>'));
                } else {
                    $(c1).append($('<span class="glyphicon glyphicon-remove"></span>'));
                }
                $(t).append(c1);

                var c2 = Frame.Tools.createNode('div', 'col-sm-10');
                $(c2).append('<div class="small">' + items[i].at + '<br/>' + items[i].name + '</div>');
                $(t).append(c2);

                lis.push(Frame.titleItem(t, "taskViewAll", items[i]));
            }

            /*
             r.value2.fun = menu_broadcast_task;
             r.value2.param = 0;*/

            Frame.titleInitialize(lis/*, r.value2*/);
        }
    });
}

function taskDetail(tid, qobj) {

    if ($(qobj).html() == '') {
        var div = Frame.Tools.createNode('div', 'padding-2');
        $(qobj).append(div);

        taskDevicePage({div: div, tid: tid}, 1);
    }

}

function taskDevicePage(param, page) {

    var div = param.div;
    $(div).empty();

    $.getJSON('jsonApi.php', {
        api: 'taskDevice',
        tid: param.tid,
        page: page - 1
    }, function (r) {
        if (r.error == 'OK') {
            var tab = Frame.Tools.createNode('table', 'table');
            $(div).append(tab);

            var row = Frame.Tools.createTableRow(null,
                ['教室', '广播名称', '计划播放', '推送', '开始', '结束', '播放时长']);
            var thead = Frame.Tools.createNode('thead');
            $(row).append(thead).appendTo(tab);

            var tbody = Frame.Tools.createNode('tbody');
            $(tab).append(tbody);

            $(r.value).each(function (i, it) {
                var tl = null;
                if (it.playing && it.stopped) {
                    var secs = (Date.parse(it.stopped) - Date.parse(it.playing)) / 1000;
                    var mins = Math.floor(secs / 60);
                    var sec = secs % 60;
                    if (sec == 0) {
                        tl = mins + ':00';
                    } else if (sec < 10) {
                        tl = mins + ':0' + sec;
                    } else {
                        tl = mins + ':' + sec;
                    }
                }

                var notified = '';
                if (it.notified) {
                    notified = it.notified.substr(11);
                }

                var playing = '';
                if (it.playing) {
                    playing = it.playing.substr(11);
                }
                var stopped = '';
                if (it.stopped) {
                    stopped = it.stopped.substr(11);
                }
                row = Frame.Tools.createTableRow(null, [it.cname, it.tname, it.at,
                    notified, playing, stopped, tl]);

                $(tbody).append(row);
            });

            var pageind = r.value2;
            pageind.fun = taskDevicePage;
            pageind.param = param;

            $(div).append(Frame.Tools.createPageInd(pageind));
        } else {
            $(div).append('<div class="panel panel-default padding-2 warning">广播尚未开始</div>');
        }
    });
}

function fmsViewChanged(fms_div, mid, name) {
    $(fms_div).empty();

    if (!mid) {
        var fms_view = fmsView(null);
        $(fms_div).append(fms_view);
        return;
    }

    if ($.isNumeric(mid)) {
        $.getJSON('jsonApi.php', {
            api: 'mediaInfoByMid',
            mid: mid
        }, function (r3) {
            if (r3.error = 'OK') {
                var fms_view = fmsView(r3.value.url);
                $(fms_view).attr('title', r3.name);
                $(fms_div).append(fms_view);
            }
        });
        return;
    }

    var fms_view = fmsView(mid, true);
    $(fms_view).attr('title', name);
    $(fms_div).append(fms_view);

    return;
}

function taskCreate(isVideoSession, qobj) {
    var t;
    if ($(qobj).html() != "") {
        return;
    }

    if (!acCheckAcl('task')) {
        Frame.Tools.accessDenied(qobj);
        return;
    }

    var div = Frame.Tools.createNode("div", "panel panel-default panel-line-height padding-2");
    $(qobj).append(div);

    var row = Frame.Tools.createNode('div', 'row');
    var left = Frame.Tools.createNode('div', 'col-sm-7');
    var right = Frame.Tools.createNode('div', 'col-sm-5');
    $(row).append(left).append(right).appendTo(div);

    var pname_div = Frame.Tools.createInputWithLabel("text", "广播名称", "1-16个字符");
    $(pname_div).find("input").addClass("my-left");
    $(left).append(pname_div);

    var fms_view_div = Frame.Tools.createNode('div');
    $(right).append('<br/>').append(fms_view_div);

    ///////////////////////////////////////////////////
    var left1 = Frame.Tools.createNode('div', 'my-left panel panel-default padding-1');
    $(left).append('<div>设置:</div>').append(left1);

    var row = Frame.Tools.createNode("div", "row");
    $(left1).append(row);

    var c1 = Frame.Tools.createNode('div', 'col-sm-4');
    var c2 = Frame.Tools.createNode('div', 'col-sm-3');
    var c3 = Frame.Tools.createNode("div", "col-sm-5");
    $(row).append(c1).append(c2).append(c3);

    // ////////////////////////////////////////////////
    var media_div = Frame.Tools.createNode('div');
    var mid_div = Frame.Tools.createNode('div', 'my-left hr-content');
    $(div).append(media_div).append('<hr class="hr-up"/>').append(mid_div);

    // /////////////////////////////////////////
    $(div).append('<br/><label>广播分组:</label><hr class="hr-up"/>');
    var group_div = Frame.Tools.createNode("div", "my-left hr-content");
    $(div).append(group_div);


    // ////////////////////////
    var play_at_div = Frame.Tools.createNode("div");
    var play_at_div2 = Frame.Tools.createNode("div", 'padding-1');
    $(c1).append(play_at_div).append(play_at_div2);

    var dt_div;
    var tm_div;

    function playKind(v) {

        $(play_at_div2).empty();
        if (v == 'now') {
            $(play_at_div2).append('<div>(立即播放)</div>');
        } else {
            var t = new Date();

            dt_div = Frame.Tools.createNode("input", null, t.toLocaleDateString());
            $(dt_div).attr("type", "text");
            $(dt_div).attr("size", "12");
            $(dt_div).datepicker({
                minDate: "0",
                maxDate: "+7D"
            });
            $(dt_div).on("change", function () {
                $(dt_div).datepicker("option", "dateFormat", "yy-mm-dd");
                Frame.Tools.activeButton(button);
            });
            $(play_at_div2).append(dt_div);

            tm_div = Frame.Tools.createNode("input");
            $(tm_div).attr("type", "time");
            $(tm_div).attr("size", "6");
            $(play_at_div2).append(tm_div);
        }
    }

    var sch = [{name: '即时播放', value: 'now'}, {name: '指定时间播放', value: 'datetime'}];
    var sch_choose_div = Frame.Tools.createDropDown(sch, null, function (v) {
        play_kind_val = v;
        playKind(v);
    });
    var play_kind_val = sch[0].value
    playKind(play_kind_val);
    $(play_at_div).append(sch_choose_div);

    // /////////////////////////////////////////////////////////


    var vs = [{
        name: "正常",
        value: 0
    }, {
        name: "中级",
        value: 1
    }, {
        name: "高级",
        value: 2
    }];
    var prior = vs[1].value;
    t = Frame.Tools.createDropDown(vs, vs[1].name, function (v) {
        prior = v;
    }, "播放优先级");
    $(c2).append(t);


    var volume = 50;
    var volume_div = $('<span>' + volume + '</span>');
    $(c3).append('<label>音量:</label>').append(volume_div);

    t = Frame.Tools.createNode("div", "margin-1");
    $(t).slider({
        min: 0,
        max: 100,
        value: volume,
        slide: function (event, ui) {
            volume = ui.value;
            $(volume_div).text(volume);
        }
    });
    $(c3).append(t);

    // //////////////////////////////////////
    var button = Frame.Tools.createNodeWithGlyph("glyphicon glyphicon-ok", "button",
        "btn btn-default disabled my-button my-button-right", "增加");

    $(div).append('<hr/>').append(button);
    Frame.Tools.activeButton(button, false);

    function groupListFun() {
        $.getJSON("jsonApi.php", {
            api: "groupList",
            user: _user
        }, function (r) {

            if (r.error == "OK") {

                Frame.Tools.createPageView(group_div, r.value, function (view, lis, from, to) {
                    $(view).empty();

                    var row = Frame.Tools.createNode('div', 'form-inline');
                    $(view).append(row);

                    for (var i = from; i < to; i++) {

                        var it = lis[i];

                        var radio = Frame.Tools.createCheckBox(it.name);
                        $(radio).find('input').prop('gid', it.gid);
                        $(row).append(radio);
                    }
                }, 90);
            }
            $(div).change(function () {
                Frame.Tools.activeButton(button);
            });
        });
    }

    function mediaTypeListFun() {
        fmsViewChanged(fms_view_div, null);

        function typeSelected(v) {
            $.getJSON("jsonApi.php", {
                api: "mediaList",
                type: v,
                user: _user
            }, function (r2) {
                if (r2.error == "OK") {

                    Frame.Tools.createPageView(mid_div, r2.value, function (view, lis, from, to) {
                        $(view).empty();

                        var row = Frame.Tools.createNode('div', 'form-inline');
                        $(view).append(row);

                        for (var i = from; i < to; i++) {

                            var it = lis[i];

                            var radio = Frame.Tools.createRadio(it.name, 'gid-radio', it.mid);
                            $(row).append(radio);
                        }

                        $(view).find(':radio').click(function () {
                            $(this).parent().parent().addClass('active').siblings().removeClass('active');
                            Frame.Tools.activeButton(button);

                            fmsViewChanged(fms_view_div, $(this).val());
                        });
                    }, 30);

                } else {
                    $(mid_div).append("<div class=\"warning\">没有资源</div>");
                }

                $(div).change(function () {
                    Frame.Tools.activeButton(button);
                });
            });
        }

        // ////////////////////////////
        $.getJSON("jsonApi.php", {
            api: "mediaTypeList",
        }, function (r) {
            if (r.error == "OK") {

                var items = r.value;
                for (var i = 0; i < items.length; i++) {
                    items[i].value = items[i].mtid;
                }

                var div1 = Frame.Tools.createDropDown(items, null, function (v) {

                    // must clear it
                    $(mid_div).empty();
                    typeSelected(v);
                });

                $(media_div).append(div1);
                typeSelected(items[0].value);
            }

            groupListFun();
        });
    }

    if (isVideoSession) {
        var midname = isVideoSession.split(",");
        if (midname.length != 2) {
            mediaTypeListFun();
        } else {
            $(media_div).append('<label>视频会议推送</label>');
            var t = Frame.Tools.createNode('div', null, midname[1]);
            $(mid_div).append(t).prop('mid', midname[0]);

            fmsViewChanged(fms_view_div, midname[0]);
            groupListFun();
        }
    } else {
        mediaTypeListFun();
    }

    $(button).click(function () {
        var si = new Frame.ButtonInfo(this);
        if (si.isDisabled()) {
            return;
        }

        var name = $(pname_div).find("input").val();
        if (!name) {
            si.validFailed("名字不能为空", pname_div);
        } else {
            si.validOk(pname_div);
        }

        var mid = $(mid_div).prop('mid');
        if (!mid) {
            mid = $(mid_div).find(':checked').val();
            if (!mid) {
                si.validFailed("没有选择媒体资源");
            }
        }

        var gid_value = [];
        $(group_div).find(':checked').each(function (i, it) {
            gid_value.push($(this).prop('gid'));
        });

        if (gid_value.length == 0) {
            si.validFailed("没有选择广播分组");
        }

        var tm;
        if (play_kind_val == 'now') {
            tm = 'now';
        } else {
            var dt = $(dt_div).val();

            if (!dt) {
                si.validFailed("没有输入日期", dt_div);
            } else {
                si.validOk(dt_div);
            }

            tm = $(tm_div).val();
            if (!tm) {
                si.validFailed("没有输入时间", tm_div);
            } else {
                si.validOk(tm_div);

                tm = dt + " " + tm;
                var m1 = Date.parse(tm);
                if (isNaN(m1) || m1 < (new Date()).getTime()) {
                    si.validFailed("时间输入有误");
                }
            }
        }

        if (prior == -1) {
            si.validFailed("没有设置优先级");
        }

        if (si.count() > 0) {
            return;
        }

        $.getJSON("jsonApi.php", {
            api: "taskAdd",
            name: name,
            gid: gid_value,
            date: tm,
            mid: mid,
            prior: prior,
            volume: volume,
            user: _user,
            videosession: isVideoSession ? true : false
        }, function (r) {
            if (r.error == "OK") {
                si.ok();
            } else {
                si.failed(r.value);
            }

        });
    });

    return;
}

function taskViewAll(item) {
    var lis = [Frame.containerItem("glyphicon glyphicon-wrench", "常规", taskControl, item),
        Frame.containerItem("glyphicon glyphicon-tasks", "广播详情", taskDetail, item.tid)];

    if (acCheckAcl('task')) {
        lis.push(Frame.containerItem("glyphicon glyphicon-plus", "广播", taskCreate, 0, true));
        //lis.push(Frame.containerItem("glyphicon glyphicon-plus", "媒体", mediaAdd, 0, true));
        //lis.push(Frame.containerItem("glyphicon glyphicon-plus", "类别", mediaTypeAdd, 0, true));
    }

    Frame.containerInitialize(lis);
}

function col(t1, t2, c1) {
    if (!c1) {
        c1 = 3;
    }

    c2 = 12 - c1;

    var r1 = Frame.Tools.createNode("div", "row");
    var c1 = Frame.Tools.createNode("div", "col-sm-" + c1 + " text-right", t1);
    var c2 = Frame.Tools.createNode("div", "col-sm-" + c2, t2);
    $(r1).append(c1).append(c2);

    return r1;
}

function taskControl(item, qobj) {
    //
    $(qobj).empty();

    var div = Frame.Tools.createNode("div", "panel panel-default panel-line-height padding-2");
    $(qobj).append(div);

    $.getJSON("jsonApi.php", {
        api: "taskInfo",
        tid: item.tid
    }, function (r) {
        if (r.error != "OK") {
            $(div).append('<div class="alert alert-info">没有获取到数据:' + r.value + '</div>');
            return;
        }

        var div2 = Frame.Tools.createNode("div", "row");
        var info_div = Frame.Tools.createNode("div", "col-sm-7");
        var fms_div = Frame.Tools.createNode("div", "col-sm-5");
        $(div2).append(fms_div).append(info_div).appendTo(div);

        var item = r.value;

        $(info_div).append(col("状态:", taskStatusString(item.status)));
        $(info_div).append(col("时间:", item.at));
        $(info_div).append(col("内容:", '<a href="#" title="' + item.url + '">' + item.mname + '</a>'));

        if (r.value2) {
            var s = '<div>';
            $(r.value2).each(function (i, it) {
                s += '<div>' + it.gname + '</div>';
            });
            s += '</div>';
            $(info_div).append(col('分组:', s));
        }

        if (item.rtmp) {
            $(info_div).append(col("时长:", item.timelen + '(s)'));
            //$(left).append(col("RTMP:", item.rtmp));
        } else {
            $(info_div).append(col("时长:", '...'));
        }

        var fms_view = Frame.Tools.createNode("div", "panel");
        $(fms_div).append(fms_view).append("<hr>");

        var s = fmsView(item.url);
        // var s =
        // fmsView(id,'rtmp://182.92.167.191/teach_app/172166586_ch0_h',
        // 'rtmp/flv');
        // var s =
        // fmsView(id,'rtmp://cp67126.edgefcs.net/ondemand/&mp4:mediapm/ovp/content/test/video/spacealonehd_sounas_640_300.mp4',
        // 'rtmp/mp4');
        $(fms_view).append(s);

        if (acCheckAcl('task')) {
            if (item.status != TASK_STATUS_CANCELED && item.status != TASK_STATUS_STOPPED) {
                var button = Frame.Tools.createNodeWithGlyph("glyphicon glyphicon-remove", "button",
                    "btn btn-default my-button my-button-right", "取消广播");
                $(div).append(button);

                $(button).click(function () {
                    var si = new Frame.ButtonInfo(this);
                    if (si.isDisabled()) {
                        return;
                    }

                    $.getJSON("jsonApi.php", {
                        api: "taskCancel",
                        tid: item.tid
                    }, function (r2) {
                        if (r2.error == "OK") {
                            si.ok();
                            si.active(false);
                        } else {
                            si.failed();
                        }

                    });
                })
            }
        }
    });
}

function taskNone(dummy, qobj) {

    if ($(qobj).html() == "") {
        var div = Frame.Tools.createNode("div", "panel padding-2 access-denied warning shadow", "没有任何广播数据");
        $(qobj).append(div);
    }
}

function taskStatusString(st) {
    var a = ["等待", "FMS预备", "广播预备", "开始广播", "完成", "被取消"];
    return a[st % 6];
}

function menu_ring(mid, page) {

    $.get('jsonApi.php', {
        api: 'ringDefList'
    }, function (r) {
        if (r.error == 'OK') {
            var lis = [];
            var a = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
            $(r.value).each(function (i, it) {
                var s = '<div class="row"><div class="col-sm-6">' + it.name + '</div>' +
                    '<div class="col-sm-6">' +
                    '<div class="pull-right">' + a[it.weekday] + ' ' + it.at.substr(0, 5) + '</div>' +
                    '</div></div>';
                lis.push(Frame.titleItem(s, ringActive, it.rid));
            });

            Frame.titleInitialize(lis);
        } else {
            var lis = [Frame.containerItem("glyphicon glyphicon-plus", "增加", ringAdd, 0)];
            Frame.containerInitialize(lis);
        }
    });
}

function ringActive(rid, qobj) {

    var lis = [Frame.containerItem("glyphicon glyphicon-list-alt", "铃声", ringControl, rid),
        Frame.containerItem("glyphicon glyphicon-plus", "增加", ringAdd, 0, true)];

    Frame.containerInitialize(lis);
}

function ringControl(rid, qobj) {

    if ($(qobj).html() == '') {
        var div = Frame.Tools.createNode('div','margin-2');
        $(qobj).append(div);

        var bg = Frame.Tools.createNode('div', 'btn-group');
        $(div).append(bg).append('<hr/>');

        $.get('jsonApi.php', {
            api: 'getRingDefInfo',
            rid: rid
        }, function (r) {
            if (r.error == 'OK') {
                var al = [{
                    name: '正常',
                    value: 0
                }, {
                    name: '取消',
                    value: 1
                }];

                var val = r.value.status;
                var t = Frame.Tools.createDropDown(al, al[val].name, function (v) {
                    val = v;
                });

                $(t).addClass('btn-group');
                var button = Frame.Tools.createNodeWithGlyph(null, "button",
                    "btn btn-default btn-group", "确定");

                $(bg).append(t).append(button);

                $(button).click(function () {
                    $.post('jsonApi.php', {
                        api: 'ringDefChange',
                        rid: rid,
                        status: val
                    }, function (r) {
                        if (r.error == 'OK') {

                        }
                    });
                })

                var tab = Frame.Tools.createNode('table', 'table scroll-vertical title-area_view');
                $(div).append(tab);

                var thead = Frame.Tools.createNode('thead');
                var row = Frame.Tools.createTableRow(null,
                    ['班级名称', '推送时间', '取消时间']);
                $(thead).append(row).appendTo(tab);

                var tbody = Frame.Tools.createNode('tbody');
                $(tab).append(tbody);

                $(r.value2).each(function (i, it) {
                    var row = Frame.Tools.createTableRow(null,
                        [it.cname, it.notified ? it.notified : '(无)',
                            it.canceled ? it.canceled : '(无)']);
                    $(tbody).append(row);
                });
            }
        });
    }
}

function ringAdd(dummy, qobj) {

    if ($(qobj).html() == '') {
        var div = Frame.Tools.createNode('div','margin-2');
        $(qobj).append(div);

        var nDiv = Frame.Tools.createInputWithLabel('text', '打铃名称', '1-16个字符', null, 270);
        $(div).append(nDiv).append('<br/>');

        var al = [
            {name: '周一', value: 0},
            {name: '周二', value: 1},
            {name: '周三', value: 2},
            {name: '周四', value: 3},
            {name: '周五', value: 4},
            {name: '周六', value: 5},
            {name: '周日', value: 6}
        ];

        var row = Frame.Tools.createNode('div', 'row');
        var c1 = Frame.Tools.createNode('div', 'col-sm-2');
        var c2 = Frame.Tools.createNode('div', 'col-sm-2');
        var c3 = Frame.Tools.createNode('div', 'col-sm-offset-1 col-sm-4');
        $(row).append(c1).append(c2).append(c3).appendTo(div);

        var wVal = 0;
        var wDiv = Frame.Tools.createDropDown(al, null, function (v) {
            wVal = v;
            Frame.Tools.activeButton(button);
        }, '每周次');
        $(c1).append(wDiv);

        var tm_div = Frame.Tools.createNode("input", 'input form-control');
        $(tm_div).attr("type", "time").attr("size", "6").val('12:00');
        $(c2).append('<label>时间(24小时制)</label><br/>').append(tm_div);

        var rDiv = Frame.Tools.createNode('div');
        $(c3).append(rDiv);

        // /////////////////////////////////////////
        $(div).append('<label>打铃对象:</label><hr class="hr-up"/>');
        var group_div = Frame.Tools.createNode("div", "my-left hr-content");
        $(div).append(group_div);

        var mid = 0;
        $.get('jsonApi.php', {
            api: 'ringMedia'
        }, function (r) {
            if (r.error == 'OK') {
                var al = [];

                $(r.value).each(function (i, it) {
                    al.push({name: it.name, value: it.mid});
                });

                var t = Frame.Tools.createDropDown(al, null, function (v) {
                    mid = v;
                    Frame.Tools.activeButton(button);
                }, '铃声');
                mid = al[0].value;

                $(rDiv).append(t).append('<br/>');
            }


            $.getJSON("jsonApi.php", {
                api: "groupList",
                user: _user
            }, function (r) {

                if (r.error == "OK") {

                    Frame.Tools.createPageView(group_div, r.value, function (view, lis, from, to) {
                        $(view).empty();

                        var row = Frame.Tools.createNode('div', 'form-inline');
                        $(view).append(row);

                        for (var i = from; i < to; i++) {

                            var it = lis[i];

                            var radio = Frame.Tools.createRadio(it.name, 'gid');
                            $(radio).find('input').prop('gid', it.gid);
                            $(row).append(radio);
                        }
                    }, 90);
                }
                $(div).change(function () {
                    Frame.Tools.activeButton(button);
                });
            });
        });

        var button = Frame.Tools.createNodeWithGlyph("glyphicon glyphicon-ok", "button",
            "btn btn-default disabled my-button my-button-right", "增加");

        $(div).append('<hr/>').append(button);
        Frame.Tools.activeButton(button, false);

        $(div).find('input').change(function () {
            Frame.Tools.activeButton(button);
        });

        $(button).click(function () {
            var si = new Frame.ButtonInfo(this);

            var vName = $(nDiv).find('input').val();
            if (!vName) {
                si.validFailed('必须填写名称', nDiv);
            } else {
                si.validOk(nDiv);
            }

            var time = $(tm_div).val();
            if (!time) {
                si.validFailed('填写时间', tm_div);
            } else {
                si.validOk(tm_div);
            }

            if (!mid) {
                si.validFailed('指定铃声');
            }

            var gid = $(group_div).find(':checked').prop('gid');
            if (!gid) {
                si.validFailed('请选择打铃对象');
            }

            if (si.count()) {
                return;
            }

            $.get('jsonApi.php', {
                api: 'ringDefAdd',
                name: vName,
                weekday: wVal,
                time: time,
                mid: mid,
                gid: gid
            }, function (r2) {
                if (r2.error == 'OK') {
                    si.ok();
                    Frame.Tools.activeButton(button, false);
                } else {
                    si.failed(r2.value);
                }
            });
        });
    }
}
