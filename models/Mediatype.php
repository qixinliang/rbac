<?php
namespace app\models;

class Mediatype extends \yii\db\ActiveRecord{
	public static function tableName(){
		return 'media_type';
	}
	//所有媒体类型
	public function getAllMediatype(){
		return self::find()->asArray()->all();
	}

	//增加媒体类型
	public function add($data){
		$this->name = isset($data['name'])? $data['name'] : '';
		$this->note = isset($data['note'])? $data['note'] : '';
		return $this->save();
	}
}
