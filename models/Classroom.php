<?php
namespace app\models;
use Yii;
//教室模型
class Classroom extends \yii\db\ActiveRecord{
	public static function tableName(){
		return 'classroom';
	}

	//根据学校ID获取下面所有的教室
	public function getClassroomBySid($sid){
		$ret = self::find()->where(['sid' => $sid])->asArray()->all();
		return $ret;
	}
}
