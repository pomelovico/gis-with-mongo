<?php
header('Content-Type: application/json; charset=utf-8'); 

$data = json_decode($_POST['data'],true);
$coll_name = $_POST['coll_name'];

$geometry = $data['geometry'];
// print_r($geometry);
$conn = new MongoClient();
$db = $conn->selectDB('gis_manage_db');//选择一个数据库
$coll = $db->selectCollection("data_".$coll_name);//选择数据库中的集合

$coll->update(
	array('properties.name'=>$data['properties']['name']),
	array('$set'=>array(
		'geometry'=>$geometry
		))
);

?>