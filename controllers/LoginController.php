<?php
/*
 *@登陆控制器
 */
namespace app\controllers;
use app\models\User;
use yii\web\Controller;
use Yii;
class LoginController extends Controller{
	//设置使用的布局文件
	public $layout = 'main-login';
	public $enableCsrfValidation = false;

	/*
	 * 根据JS传递过来的用户名，密码去数据库
	 * 检索用户信息，判断是否存在，如果存在，则登陆成功，跳转到首页
     * 否则返回给JS一个错误的JSON信息，JS来抛错 
     */
	public function actionIndex(){
		$request = Yii::$app->request;	

		if($request->isAjax){
			$postData = $request->post();
			$userModel = new User();
			$ret = $userModel->login($postData);
			if($ret){
				$jsonRsp = json_encode(array(
					'code' => '200',
					'message' => '登陆成功',
				));
				
				return $jsonRsp;
			}else{
				$jsonRsp = json_encode(array(
					'code' => '400',
					'message' => '登陆失败',
				));
				return $jsonRsp;
			}
		}
		return $this->render('index');
	}
}
