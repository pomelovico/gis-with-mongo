<?php
/**
 * Created by PhpStorm.
 * User: Vico
 * Date: 2016.04.26
 * Time: 22:53
 */

$errorType = array(
    8000=>'上传成功！',
    8001=>'未上传文件',
    8002=>'GeoJSON文件格式错误',
    8003=>'未解析出Shapefile文件内容',
    8004=>'shp文件打开失败',
    8005=>'dbf文件打开失败',
    8006=>'shp文件读取失败',
    8007=>'dbf文件读取失败',
    8008=>'shapefile记录类型错误',
    8009=>'不支持的shape类型',
    8010=>'Polygon区域太小，无法转换文件',
    8011=>'未找到DBF文件',
    8012=>'上传的dbf文件不是标准DBF文件',
    71=>'连接数据库失败，请重试',
    1=>'数据库写入失败，键名长度不能为0',
    2=>'数据库写入失败，键名不能使用“.”',
    3=>'数据库写入失败，插入数据容量过大',
    5=>'数据库写入失败，插入数据大小MongoDB所能保存的大小',
    8=>'数据库写入失败，键名须为字符串类型'
);
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8' >
    <link  rel='stylesheet' type="text/css" href="../css/common.css">
    <title>Upload</title>
    <style>
        .wrapper{
            margin:0 auto;
            width: 80%;
            min-height: 280px;
            padding: 20px;
            margin-top:20px;
            box-sizing:border-box;
            background-color: #fff;
        }
        #info{
            font-size: 14px;
            color: #666;
        }
        #back-btn{
            padding: 4px 12px;
            background-color: #7FA8DA;
            color: #fff;
            display: inline-block;
            border-radius: 4px;
            margin-top: 20px;
            font-size: 12px
        }
        #alert{
            width: 200px;
            margin: 50px auto;
            text-align: center;
        }
    </style>
</head>
<body>
<div class="wrapper">
    <div id="alert">
        <p id='info'><?php echo $errorType[$_GET['resid']]; ?></p>
        <a id='back-btn' href="../index.html">返回</a>
    </div>
</div>
</body>
</html>
