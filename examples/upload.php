<?php
header('Content-Type:text/html;charset=utf-8');
require_once("lib/json_encode_cn.php");//json中文转换

$shp = $_FILES['shp'];  //获取shp的信息
$dbf = $_FILES['dbf'];  //获取dbf的信息
$geo = $_FILES['geo'];
$upload_dir = 'upload/';   //保存上传文件的目录//处理上传的文件1
if(isset($geo)){
	$temp_name_geo = $geo['tmp_name'];
    $file_name_geo = $geo['name'];
    echo "临时目录：".$temp_name_geo."<br>";
    //移动临时文件夹中的文件1到存放上传文件的目录，并重命名为真实名称
    // move_uploaded_file($temp_name_geo, $upload_dir.$file_name_geo);
	// echo $file_name_geo.'文件上传成功!<br/>';
    $filePathName = $upload_dir.$file_name_geo;
    $geoJSON = file_get_contents($temp_name_geo);
    $geoJSON = json_decode($geoJSON,true);
    // $geoJSON['document_name'] = $file_name_geo;

    echo '键值对数量：'.count($geoJSON)."<br>";
    // print_r($geoJSON)."<br>";
    // foreach ($geoJSON as $key => $value) {
    // 	echo $key.":".$value."<br>";
    // }

    $conn = new MongoClient();
	$db = $conn->selectDB('geo');//选择一个数据库
	$colls = $db->listCollections();//获取所有集合
	$collection_name = 'geo_'.basename($file_name_geo, '.json');
	$count = 0;
	foreach ($colls as $key => $value) {
		if($collection_name == explode("(",$value->getName())[0]){
			$count++;
		}
	}
	if($count != 0){
		$collection_name = $collection_name."(".$count.")";
	}
	$coll = $db->selectCollection($collection_name);//选择数据库中的集合
	$cursor = $coll->find();//查询集合，返回结果集的MongoCursor
	try{
			$len = count($geoJSON['features']);//特征个数
			for($index = 0; $index < $len; $index++){
				$feature = $geoJSON['features'][$index];
				$feature['_id'] = $cursor->count()+$index;
				$coll->insert($feature);
			}
			if($index == $len)
				echo "success to insert !"."<br>";
			//建立空间2D索引
			$str = 'geometry.coordinates.0.0';
			if($coll->ensureIndex(array($str=>'2d'))['ok'] == 1){
				echo "success to build spatial index !";
			}
	}catch (exception $e){
		echo '数据库错误：'.$e;
	}
}
else{
	if ($shp['error'] == UPLOAD_ERR_OK && $dbf['error'] == UPLOAD_ERR_OK){
    //上传文件1在服务器上的临时存放路径
    $temp_name_shp = $shp['tmp_name'];
    $temp_name_dbf = $dbf['tmp_name'];
    
	//上传文件1在客户端计算机上的真实名称
    $file_name_shp = $shp['name'];
    $file_name_dbf = $dbf['name'];
    
    //移动临时文件夹中的文件1到存放上传文件的目录，并重命名为真实名称
    move_uploaded_file($temp_name_shp, $upload_dir.$file_name_shp);
    move_uploaded_file($temp_name_dbf, $upload_dir.$file_name_dbf);
	echo 'shapefile文件上传成功!<br/>';
    $filePathName = $upload_dir.$file_name_shp;
    readShapefile($filePathName);	    
	}
	else{
	    echo '文件上传失败!<br/>';
	}
}

function readShapefile($filePathName){
	require_once('lib/shapefile.php');
	try {
		$ShapeFile = new ShapeFile($filePathName);
		$record = $ShapeFile->getRecord(SHAPEFILE::GEOMETRY_ARRAY);
			// Geometry
			// print_r($record['shp']);
			// DBF Data
			// echo $record['dbf'];
		// echo $ShapeFile->getShapeType(SHAPEFILE::FORMAT_STR);

		$shp = $record['shp'];
		// echo json_encode($shp['parts']['rings']);
		print_r($shp['parts'][0]['rings'][0]['points'][0]);
		// echo json_encode($record['shp']);
		// foreach ($record['shp'] as $key => $value) {
		// 	echo $key.$value."<br>";
		// }
	} catch (ShapeFileException $e) {
		exit('Error '.$e->getCode().': '.$e->getMessage());
		
	}
}
?>

