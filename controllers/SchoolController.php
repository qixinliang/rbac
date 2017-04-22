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

	//添加学校
	public function actionAdd(){
		$sModel = new School();
		$request = Yii::$app->request;				
		var_dump($request);
		if($request->isPost){
			if($sModel->load($request->post()) && $this->sModel->save()){
				return json_encode(array());
			}
		}
		return json_encode(array());
	}

	//具体学校的map接口
	public function actionInfo(){
		$sModel = new School();
		$request = Yii::$app->request;
		if($request->isAjax){
			$sid = $request->get('sid',1);
			$ret = $sModel->getSchoolInfoBySid($sid);
			if(isset($ret) && !empty($ret)){
				return json_encode(array(
					'error' => 'OK',
					'value' => $ret,
				));
			}
		}
		return json_encode(array(
			'error' => 'Err',
			'value' => '',
		));
	}
}
