<?php
namespace app\controllers;
use yii\web\Controller;
use Yii;
use app\models\Level;

//学校等级控制器
class LevelController extends Controller{
    public function actionList(){
        $lModel = new Level();
        $ret = $lModel->getList();
        if(isset($ret) && !empty($ret)){
            return json_encode(array(
                'error' => 'OK',
                'level' => $ret
            ));
        }else{
            return json_encode(array(
				'error' => 'Err',
                'level' => ''
            ));
        }
    }
}
