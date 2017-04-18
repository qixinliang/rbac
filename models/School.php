<?php

namespace app\models;
use Yii;
class School extends \yii\db\ActiveRecord{
	public static function tableName(){
		return 'school';
	}
	
	public function getAllSchool(){
		return self::find()->asArray()->all();	
	}
}
