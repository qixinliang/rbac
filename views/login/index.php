<div class="container">
	<div class="text-center">
		<h2>欢迎进入业务管理系统</h2>
	</div>

<div class="well well-bg login-win shadow">

    <ul class="nav nav-tabs">
        <li><a href="#" id="menu-user-login"><span
                class="glyphicon glyphicon-user"></span>&nbsp;用户名</a></li>
        <li class="active"><a href="#" id="menu-qrcode-login"><span
                class="glyphicon glyphicon-qrcode"></span>&nbsp;二维码</a></li>

    </ul>

    <div class="login-container">

        <div id="user-login-view">
            <br />
            <form class="form-horizontal" role="form">
                <div class="form-group">
                    <label class="control-label col-sm-3" for="login-name">用户名:</label>
                    <div class="col-sm-8">
                        <input type="text" class="form-control" id="login-name"
                               placeholder="邮箱名称或手机号码">
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label col-sm-3" for="password">密码:</label>
                    <div class="col-sm-8">
                        <input type="password" class="form-control" id="password"
                               placeholder="密码">
                        <div class="text-right">
                            <a class="small" href="forget.php">忘记密码?</a>
                        </div>
                    </div>
                </div>

                <!--removed div class="form-group">
                    <div class="col-sm-offset-3 col-sm-10">
                        <div class="checkbox">
                            <label><input type="checkbox"> 保存用户名</label>
                        </div>
                    </div>
                </div -->

                <div class="form-group">
                    <div class="col-sm-offset-3 col-sm-10">
                        <button id="login-btn" type="button"
                                class="btn btn-default my-button">
                            <span class="glyphicon glyphicon-ok"></span> 登录
                        </button>
                    </div>
                </div>
            </form>
        </div>

        <div id="qrcode-login-view">
            <div class="row">
                <br />
                <div class="col-sm-offset-1 col-sm-4">
                    <img alt="" id="qrcode-id" src="" />
                </div>
                <div class="col-sm-6">
                    <br />
                    <br />
                    <p id="qrcode-hint">请扫描左边二维码</p>
                    <div id="qrcode-count" class="green">01:00</div>
                </div>
            </div>
        </div>

    </div>

</div>
<!-- login window end -->
</div>
