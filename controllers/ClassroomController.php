<?php
namespace app\controllers;
use yii\web\Controller;
use Yii;
use app\models\Classroom;
class ClassroomController extends Controller{
	public $enableCsrfValidation = false;
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

	//添加教室
	public function actionAdd(){
		$request = Yii::$app->request;
		if($request->isAjax){
			$sid = $request->post('sid',1);
			$classes = $request->post('classes',[]);
			$tmpData = array();
			$data = array();
			foreach($classes as $k => $v){
				$tmpData['sid'] 		= $sid;
				$tmpData['name'] 		= $v['name'];
				$tmpData['class_name'] 	= $v['code'];
				$data[] = array($sid,$v['name'],$v['code']);
				//$data[] = $tmpData;
			}

			//往班级数据库里增加数据
			$cModel = new Classroom();
			$ret = $cModel->add($data);
			if($ret > 0){
				return json_encode([
					'error' => 'OK',
					'value' => $ret
				]);
			}
		}
		return json_encode([
			'error'	=> 'ERROR',
			'value' => ''
		]);
	}
}
