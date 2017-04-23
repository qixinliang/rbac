<?php
namespace app\controllers;
use \yii\web\Controller;
use Yii;
use app\models\Media;

class MediaController extends Controller{
	//根据媒体类型获取对应下的所有媒体
	public function actionList(){
		$mModel = new Media(); 
		$request = Yii::$app->request;
		if($request->isAjax){
			$type = $request->get('type',1);
			$user = $request->get('user','admin');
			$ret = $mModel->getMedia($type,$user);
			if(isset($ret) && !empty($ret)){
				return json_encode([
					'error' => 'OK',
					'value' => $ret
				]);
			}
		}
		return json_encode([
			'error' => 'ERROR',
			'value' => ''
		]);
	}
} 
