<?php
namespace app\models;
use \yii\db\ActiveRecord;

class Media extends ActiveRecord{
	public static function tableName(){
		return 'media';
	}
	
	//获取特定的媒体
	public function getMedia($type,$user){
		return self::find()->where(['type' => $type,'user' => $user])->asArray()->all();
	}
}
