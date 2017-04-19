<?php
namespace app\controllers;
use yii\web\Controller;
use Yii;
use app\models\Classroom;
class ClassroomController extends Controller{
	//获取教室信息
	public function actionInfo(){
		//学校ID
		$request = Yii::$app->request;
		$sid = $request->get('sid',1);
		$cModel = new Classroom();
		$ret = $cModel->getClassroomBySid($sid);
		if(!isset($ret) || empty($ret)){
			return json_encode(array(
				'code' => '400',
				'message' => 'get classes failed',
				'value' => '',
			));
		}else{
			return json_encode(array(
				'code' => 200,
				'message' => 'success',
				'value' => $ret,
			));
		}
	}

	public function actionStatus(){
		$request = Yii::$app->request;
		$sid = $request->get('sid',1);
		$cModel = new Classroom();
		$ret = $cModel->getRoomStatusBySid($sid);
		if(!isset($ret) || empty($ret)){
			return json_encode(array(
				'error' => 'error',
				'value' => '',
			));
		}else{
			return json_encode(array(
				'error' => 'OK',
				'value' => $ret,
			));
		}
	}
}
