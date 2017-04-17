<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "user".
 *
 * @property integer $id
 * @property string $name
 * @property string $email
 * @property integer $is_admin
 * @property integer $status
 * @property string $updated_time
 * @property string $created_time
 */
class User extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'user';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['is_admin', 'status'], 'integer'],
            [['updated_time', 'created_time'], 'safe'],
            [['name'], 'string', 'max' => 20],
            [['email'], 'string', 'max' => 30],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'name' => 'Name',
            'email' => 'Email',
            'is_admin' => 'Is Admin',
            'status' => 'Status',
            'updated_time' => 'Updated Time',
            'created_time' => 'Created Time',
        ];
    }

	public function login($loginInfo){
		if(isset($loginInfo) && !empty($loginInfo)){
			$loginName 	= $loginInfo['user_name'];
			$password 	= $loginInfo['password'];
			//$password = md5($loginInfo['password']);

			$ret = self::findOne([
				'login_name' => $loginName,
				'password' 	 => $password
			]);
			//在数据库中找到该用户的登录信息,返回的是object
			if($ret){
				return true;
			}else{
				return false;
			}
		}else{
			return false;
		}
	}
}
