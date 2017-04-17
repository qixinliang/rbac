<?php
/**
 * Class DefaultController
 */

namespace app\controllers;

//use app\controllers\common\BaseController;
use yii\web\Controller;

//class DefaultController extends  BaseController {
class DefaultController extends  Controller {
	public $layout = false;
	public function actionIndex(){
		return $this->render("index");
	}
}
