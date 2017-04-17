<?php

use yii\bootstrap\ActiveForm;
use yii\helpers\Html;
use yii\helpers\Url;

?>
<!DOCTYPE html>
<html>
<head>

<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="viewport" content="width=device-width, initial-scale=1" />

<link rel="stylesheet" href="/bootstrap/css/bootstrap.min.css" />
<link rel="stylesheet" href="/bootstrap/css/bootstrap-theme.min.css" />
<link rel="stylesheet" href="/bootstrap-switch/css/bootstrap3/bootstrap-switch.css"/>
<link rel="stylesheet" href="/jquery-ui/jquery-ui.css" />
<link rel="stylesheet" href="/css/font-awesome.min.css">

<script src="/jquery/jquery.min.js"></script>
<script src="/jquery-ui/jquery-ui.js"></script>
<script src="/bootstrap/js/bootstrap.min.js"></script>
<script src="/bootstrap-switch/js/bootstrap-switch.js"></script>

<link rel="stylesheet" href="/css/myClassroom.css" />
<link rel="stylesheet" href="/css/frame.css" />
<link rel="stylesheet" href="/css/video-js.css">

<script src="http://webapi.amap.com/maps?v=1.3&key=7d0d504f04355d38c302b6904745e823"></script>    
<script>
	window.HELP_IMPROVE_VIDEOJS = false;
</script>
<script src="/js/video.js"></script>
<script src="/js/classroom.js"></script>
<script src="/js/frame.js"></script>
<script src="/js/group.js"></script>

<title>智慧教室</title>
</head>
<body>
	<div class="container-fluid">
		
<div>
	<div class="text-center">
		<h2>智慧教室管理平台</h2>
	</div>

	<nav class="navbar navbar-default">
		<div class="container-fluid">
			<!-- div class="navbar-header">
				<a class="navbar-brand" href="#">智慧教室</a>
			</div -->
			<ul class="nav navbar-nav">
		
<li class="active"><a><span class="glyphicon glyphicon-th"></span>教室管控</a></li><li><a href="myclassroom.php?menu=broadcast"><span class="glyphicon glyphicon-volume-up"></span>媒体与广播</a></li><li><a href="myclassroom.php?menu=ac"><span class="glyphicon glyphicon-user"></span>安全与权限</a></li>			</ul>
			<ul class="nav navbar-nav pull-right">
<li><a><span class="glyphicon glyphicon-user"></span>管理员(admin)</a></li><li><a href="login.php"><span class="glyphicon glyphicon-log-out"></span>退出</a></li>			</ul>
		</div>
	</nav>
</div>
		<div>
			<div class="row">
				<div id="menu-area" class="col-sm-2 col-menu">
					<nav>
						<ul class="nav nav-pills nav-stacked">
<script type="text/javascript">
var _user="admin";
var _user_flag="school";
var _acl=65535;
</script>        <li><a id="menu_schools" href="#">
            <span class="glyphicon glyphicon-th"></span>区管理中心-蔡甸区
            <span class="badge"></span></a></li>

        					</ul>
					</nav>
					<hr />
					<div class="myclassroom-copyright">
						<p><a href="changed.html">v1.6.5 build 2</a></p>
						<p>Dec,2016</p>
                        <br/>
                        <div class="small">建议分辨率：1600*900</div>
					</div>
				</div>

				<div class="col-sm-2 col-title">
					<div id="title-tools"></div>
					<div id="title-area"></div>
				</div>

				<div id="container-area" class="col-sm-8 col-container"></div>
			</div>
		</div>
	</div>
</body>
</html>
