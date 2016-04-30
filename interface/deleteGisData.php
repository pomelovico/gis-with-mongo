<?php
header('Content-Type:text/html;charset=utf-8');

$conn = new MongoClient();
$db = $conn->selectDB('gis_manage_db');//选择一个数据库

$user_id = '';
$coll_name = '';
if(isset($_POST['user_id'])){
	$user_id = $_POST['user_id'];
	$coll_name = $_POST['coll_name'];
}

$coll = $db->selectCollection('users_data_records');
$result =  $coll->update(
	array(
		'user_id'=>$user_id
	),
	array(
		'$pull'=>array(
			'gis_records'=>array(
					'coll_name'=>$coll_name
				)
			)
	)
);
echo json_encode($result).'<br>';

$coll = $db->selectCollection('gis_data_records');
$result = $coll->remove(array(
		'coll_name'=>$coll_name
	)
);
echo json_encode($result).'<br>';

$coll = $db->selectCollection($coll_name);
$result = $coll->drop();
echo json_encode($result).'<br>';
?>