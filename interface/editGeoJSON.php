<?php
header('Content-Type: application/json; charset=utf-8'); 

$data = json_decode($_POST['data'],true);
$coll_name = $_POST['coll_name'];
$type = $_POST['type'];
$geometry = $data['geometry'];

$conn = new MongoClient();
$db = $conn->selectDB('gis_manage_db');//选择一个数据库
$coll = $db->selectCollection("data_".$coll_name);//选择数据库中的集合

switch($type){
	case 'save':
		$coll->update(
			array('_id'=>$data['id']),
			array('$set'=>array(
				'geometry'=>$data['geometry'],
				'properties'=>$data['properties']
				))
		);break;
	case 'delete':
		$coll->remove(
			array('_id'=>$data['id'])
		);break;
}
?>