<?php
/* @var $this \yii\web\View */
/* @var $content string */

use yii\helpers\Html;
use yii\widgets\Breadcrumbs;
use app\assets\AppAsset;
use \app\services\UrlService;
AppAsset::register($this);
?>

<?php $this->beginPage() ?>
<!DOCTYPE html>
<html lang="<?= Yii::$app->language ?>">
<head>
    <meta charset="<?= Yii::$app->charset ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
 	<?= Html::cssFile('@web/css/login/login.css')?>
 	<?= Html::jsFile('@web/jquery/jquery.min.js')?>
 	<?= Html::jsFile('@web/js/login/login.js')?>
    <?= Html::csrfMetaTags() ?>
    <title><?= Html::encode($this->title) ?></title>
    <?php $this->head() ?>
</head>

<body class="login-page">

<?php $this->beginBody() ?>
    <?= $content ?>
<?php $this->endBody() ?>

</body>
</html>
<?php $this->endPage() ?>
