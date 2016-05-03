<?php
header('Content-Type:text/html;charset=utf-8');


try{
    $conn = new MongoClient();
    $db = $conn->selectDB('gis_manage_db');//选择一个数据库
}catch(MongoException $e){
    echo json_encode(
        array(
            status=>1,
            gisdata=>[]
        )
    );
    exit();
}

$user_id = '';
$type = '';

if(isset($_POST['user_id'])){
	$user_id = $_POST['user_id'];
	$type = $_POST['type'];
}
if($type=='all'){
	$coll = $db->selectCollection('users_data_records');//选择数据库中的集合
	$gis_records = array();

	$records = $coll->find(array(user_id=>$user_id))->getNext()['gis_records'];
//	echo $records;
	for($i=0; $i<count($records); $i+=1){
		$gis_records[] = array(
			id=>explode("_",$records[$i]['coll_name'])[1],
			gis_name=>$records[$i]['file_name'],
			gis_type=>$records[$i]['type'],
			gis_size=>$records[$i]['size'],
			upload_time=>$records[$i]['upload_time']
		);
	}
	$res = array(
		gisdata=>$gis_records,
        status=>0
	);
	echo json_encode($res);
}else{
	$coll_name = "data_".$_POST['gis'];
	if(!$coll_name) $coll_name = "data_".$_GET['gis'];
	$coll = $db->selectCollection($coll_name);//选择数据库中的集合
	$geo_coll = array();
	$geo_coll['type'] = "FeatureCollection";
	$features = array();
	foreach ($coll->find() as $key => $value) {
		array_push($features, $value);
	}
	$geo_coll['features'] = $features;
	$coll = $db->selectCollection('gis_data_records');
	$record = $coll->find(array(coll_name=>$coll_name))->getNext();
	$data = array(
		gis=>$geo_coll,
		record=>array(
			file_name=>$record['file_name'],
			count=>$record['count'],
			size=>$record['size'],
			type=>$record['type'],
			upload_time=>$record['upload_time'],
			description=>$record['description'],
			)
	);
	echo json_encode(array(
		content=>$data,
        status=>0
	));
}
?>