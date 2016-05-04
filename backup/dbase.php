<?php
header("Content-Type: text/html; charset=utf-8");
// require_once("lib/json_encode_cn.php");//json中文转换
require_once('lib/shapefile.php');
function readShpfile($filePathName){
    try {
        $ShapeFile = new ShapeFile($filePathName);
        $shpfile = $ShapeFile->getRecord(SHAPEFILE::GEOMETRY_ARRAY);
        // $shp = $record['shp'];
        // $dbf = readDbfFile();
        $len = count($shpfile['shp']);
        $records = array();
        for($i = 0; $i<$len; $i++){
            $records[$i] = array(
                type => 'Feature',
                geometry => $shpfile['shp'][$i],
                properties => $shpfile['dbf'][$i]
                );
        }
        $conn = new MongoClient();
        $db = $conn->selectDB('test');//选择一个数据库
        $coll = $db->selectCollection('data');
        for($i=0;$i<$len;$i++){
            $coll->insert($records[$i]);
        }
        echo 'success';
        // echo json_encode($records[0]);

    } catch (ShapeFileException $e) {
        exit('Error '.$e->getCode().': '.$e->getMessage());
    }
}
readShpfile('data/data112.shp');
?>