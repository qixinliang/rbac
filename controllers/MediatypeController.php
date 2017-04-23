<?php
namespace app\controllers;
use yii\web\Controller;
use Yii;
use app\models\Mediatype;

//媒资类型控制器
class MediatypeController extends Controller{
	public $enableCsrfValidation = false;
	//获取所有媒体类型
	public function actionList(){
		$mtModel = new Mediatype();
		$ret = $mtModel->getAllMediatype(); 
		if(isset($ret) && !empty($ret)){
			return json_encode(array(
				'error' => 'OK',
				'value' => $ret,
			));
		}
		return json_encode(array(
			'error'	=> 'ERROR',
			'value' => '',
		));
	}

	//添加媒资类型
	public function actionAdd(){
		$mtModel = new Mediatype();
		$request = Yii::$app->request;
		if($request->isAjax){
			$post = $request->post();
			$ret = $mtModel->add($post);
			if($ret){
				return json_encode([
					'error' => 'OK',
					'value' => $ret
				]);
			}
		}
		return json_encode([
			'error' => 'ERROR',
			'value' => '',
		]);
	}
}
