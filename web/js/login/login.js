/**
 * Created by qixinliang on 2017/4/19.
 */
var qrcode_timer = null;
var qrcode_stamp = 0;

$(document).ready(function() {
    $(".login-win").hide().fadeIn("slower");

    $("#menu-user-login").click(userLoginView);
    $("#menu-qrcode-login").click(qrcodeLoginView);
    $("#login-btn").click(onUserLogin);

    $("#login-name,#password").keypress(function (e) {
        if(e.keyCode==13){
            onUserLogin();
        }
    });

    $("#menu-user-login").click();

    QrcodeBegin();
});

function QrcodeBegin() {

    clearQrcodeTimer();

    var src = 'qrcode.php?content='
        + encodeURIComponent('http://www.shifting.com.cn/myclassroom-qrcode.php');


    $("#qrcode-id").attr("src", src);

    $("#qrcode-hint").html("请扫描左边二维码");
    $("#qrcode-hint").unbind('click');

    $("#qrcode-count").html('01:00');

    qrcode_stamp = (new Date()).getTime();
    qrcode_timer = window.setInterval(isQrcodeLogined, 1000);
}

function clearQrcodeTimer() {

    if (qrcode_timer) {
        window.clearInterval(qrcode_timer);
        qrcode_timer = undefined;

        // clear conter
        $("#qrcode-count").html('');

        $("#qrcode-hint").html("<button class=\"btn btn-link\">点击刷新</button>");
        $("#qrcode-id").attr("src", "icon/invalid-qrcode.png");

        $("#qrcode-hint").click(function() {
            QrcodeBegin();
        });
    }
}

function isQrcodeLogined() {

    var stamp = (new Date()).getTime();
    var secs = (stamp - qrcode_stamp) / 1000;

    if (secs > 60) {
        clearQrcodeTimer();
        return;
    }

    var sec = Math.round(60 - secs);

    if (sec < 10) {
        $("#qrcode-count").html("00:0" + sec);
    } else {
        $("#qrcode-count").html("00:" + sec);
    }
}

function onUserLogin() {

    var login = $("#login-name").val();
    var passwd = $("#password").val();

    var error = false;
    if (login == "") {
        error = true;
        $("#login-name").parent().addClass("has-error");
    }

    if (passwd == "") {
        error = true;
        $("#password").parent().addClass("has-error");
    }

    if (error) {
		alert('用户名或者密码未输入！');
        return;
    }

	//发送ajax请求到后台的login控制器中
	//后台可以封装个api接口，
	//返回JSON数据这样就比较利于前后端分离了
	/*
    $.getJSON("jsonApi.php", {
        api: "userAuth",
        user : login,
        password : passwd,
        utype : 0
    }, function(result) {
        if (result && result.error == "OK") {
            window.location.assign("myclassroom.php");
        } else {
            $("#login-name").parent().addClass("has-error");
            $("#password").parent().addClass("has-error");
            return;
        }
    });*/
	$.ajax({
		url: '/login/index',
		type: 'post',
		dataType: 'json',
		data:{user_name:login,password:passwd},
		success:function(data){
			if(data.code == 200){
				window.location.href='/default/index';
			}else{
				alert('登陆失败');
			}
		}
	});
}

function userLoginView() {

    $("#user-login-view").show();
    $("#qrcode-login-view").hide();

    $("#menu-user-login").parent().addClass("active");
    $("#menu-qrcode-login").parent().removeClass("active");
}

function qrcodeLoginView() {

    $("#user-login-view").hide();
    $("#qrcode-login-view").show();

    $("#menu-user-login").parent().removeClass("active");
    $("#menu-qrcode-login").parent().addClass("active");
}
