<?php
namespace app\models;
use Yii;

//level模型
class Level extends \yii\db\ActiveRecord{
	public static function tableName(){
		return 'level';
	}
	
	//全部列表
	public function getList(){
		return self::find()->asArray()->all();
	}
}
