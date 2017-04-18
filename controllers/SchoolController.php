<?php
namespace app\controllers;
use yii\web\Controller;
use Yii;
use app\models\School;
class SchoolController extends Controller{
	public $enableCsrfValidation = false;

	//学校列表数据
	public function actionList(){
		$sModel = new School();
		$ret = $sModel->getAllSchool();
		if(isset($ret) && !empty($ret)){
			return json_encode(array(
				'code' => 200,
				'message' => 'success',
				'data' => $ret
			));
		}else{
			return json_encode(array(
				'code' => '400',
				'message' => 'failure',
				'data' => ''
			));
		}
	}
}
