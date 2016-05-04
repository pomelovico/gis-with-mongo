<?php
header('Content-Type:text/html;charset=utf-8');

$conn = new MongoClient();
$db = $conn->selectDB('gis_manage_db');//选择一个数据库
$coll_name = "data_20160409238886";
$coll = $db->selectCollection($coll_name);//选择数据库中的集合
$geo_coll = array();
$geo_coll['type'] = "FeatureCollection";
$features = array();
foreach ($coll->find() as $key => $value) {
	array_push($features, $value);
}
$geo_coll['features'] = $features;
echo json_encode($geo_coll);
?>
