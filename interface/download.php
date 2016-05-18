<?php
/**
 * Created by PhpStorm.
 * User: Vico
 * Date: 2016.05.18
 * Time: 16:05
 */
try{
    $conn = new MongoClient();
    $db = $conn->selectDB('gis_manage_db');//选择一个数据库
}catch(MongoException $e){
    exit();
}
if(!$coll_name)
    $coll_name = "data_".$_GET['id'];
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
$file_name = explode(".",$record['file_name'])[0].'.json';

header("Content-type: application/json"); 
header("Accept-Ranges: bytes"); 
header("Accept-Length: ".strlen(json_encode($geo_coll)));
header("Content-Disposition: attachment; filename=$file_name"); 
header("Pragma:no-cache"); 
header("Expires:0"); 
echo json_encode($geo_coll);

?>