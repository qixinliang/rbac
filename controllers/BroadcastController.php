<?php
namespace app\controllers;
use yii\web\Controller;

class BroadcastController extends  Controller {
	public $layout = false;
	public function actionIndex(){
		return $this->render("index");
	}
}
