<?php
header("Content-Type: text/html; charset=utf-8");

$info = '处理中...';

require ('TriggerError.php');

class RequestFile{

    private $shp;
    private $dbf;
    private $geo;

    function __construct(){
        $this->shp = $_FILES['shp']['size'] > 0 ? $_FILES['shp'] : null;  //获取shp的信息
        $this->dbf = $_FILES['dbf']['size'] > 0 ? $_FILES['dbf'] : null;  //获取dbf的信息
        $this->geo = $_FILES['geo']['size'] > 0 ? $_FILES['geo'] : null; //获取geojson数据
    }
    function getFile(){
        try{
            if($this->geo){
                return array(
                    'type' => 'geo',
                    'geo' => $this->geo
                );
            }
            else if($this->shp && $this->dbf){
                return array(
                    'type' => 'shp',
                    'shp' => $this->shp,
                    'dbf' => $this->dbf,
                );
            }else{
                throw new Exception('EMPTY_FILE',8001);
            }
        }catch (Exception $e){
            TriggerError($e);
        }
    }
}

/*父类*/
class Files{
    protected $file_name;
    protected $feature_collection;
    protected $size;

    public function open(){}
    public function getFileName(){
        return $this->file_name;
    }
    public function getFeatureCollection(){
        return $this->feature_collection;
    }
    public function getSize(){
        return $this->size;
    }
    public function getType(){}
}

class GeoJSON extends Files{
    private $geoFile;
    function __construct($geoFile){
        $this->file_name = $geoFile['name'];
        $this->size = $geoFile['size'];
        $this->geoFile = $geoFile;
        $this->open();
    }
    public function open(){
        $geo_JSON = json_decode(trim(file_get_contents($this->geoFile['tmp_name']),chr(239).chr(187).chr(191)),true);
        try{
            if(!$geo_JSON){
                throw new Exception('WRONG_GEOJSON',8002);
            }else{
                $this->feature_collection = $geo_JSON['features']? $geo_JSON['features'] : null;
            }
        }catch (Exception $e){
            TriggerError($e);
        }

        return $this->feature_collection;
    }
    public function getType(){
        return 'json';
    }
}

class Shape extends Files{

    private $shpFile;
    private $dbfFile;
    function __construct($shpFile, $dbfFile){
        $this->file_name = $shpFile['name'];
        $this->shpFile = $shpFile;
        $this->dbfFile = $dbfFile;
        $this->size = $shpFile['size'] + $dbfFile['size'];
        $this->open();
    }

    /*解析shapefile*/
    function open(){
        require_once('../lib/shapefile.php');

        $ShapeFile = new ShapeFile($this->shpFile['tmp_name'],$this->dbfFile['tmp_name']);
        $shpfile = $ShapeFile->getRecord(SHAPEFILE::GEOMETRY_ARRAY);
        try{
            $len = count($shpfile['shp']);
            if(!$len)
                throw new Exception('ERROR_PARSE_SHPFILE',8003);
        }catch (Exception $e){
            TriggerError($e);
        }

        $records = array();
        for($i = 0; $i<$len; $i++){
            $records[$i] = array(
                'type' => 'Feature',
                'geometry' => $shpfile['shp'][$i],
                'properties' => $shpfile['dbf'][$i]
            );
        }
        $this->feature_collection = $records;
    }
    public function getType(){
        return 'shp';
    }
}

class GisData{

    /*获取随机字符串*/
    public function getRandomStr($len){
        $str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRETUVWXYZ0123456789";
        $max = strlen($str)-1;
        $res = '';
        for($i=0; $i<$len; $i++){
            $res.=$str[rand(0,$max)]; //rand($min,$max)生成介于min和max两个数之间的一个随机整数
        }
        return $res;
    }
    public function connectDB(){
        try{
            $conn = new MongoClient();
            return $conn->selectDB('gis_manage_db');//选择一个数据库
        }catch(MongoException $e){
            TriggerError($e);
        }
    }

    /*处理文件上传重名*/
    public function reName($records,$current_name,$file_type){
        $same_filename_count = 0;
        $records_len = count($records);
        /*统计*/

        for($i = 0; $i < $records_len; $i+=1){
            $n = explode("(",explode(".$file_type",$records[$i]['file_name'])[0])[0];
//            echo $n.'<br>';
            if($n == basename($current_name,".$file_type")) {
                $same_filename_count += 1;
            }
        }
        if($same_filename_count){
            return basename($current_name,".$file_type")."(".$same_filename_count.").$file_type";
        }else{
            return $current_name;
        }
    }
	/*插入特征集合到数据库中*/
    public function insertDataToDB($gisFile){
        $user_name = 'pomelo';
        $user_id = '1';

        try{
            $db = $this->connectDB();
            $user_coll = $db->selectCollection('users_data_records');
            $user_data_record = $user_coll->find(array('user_id'=>$user_id));
            if(!$user_data_record){
                throw new MongoException('DB_FAIL_FIND_USER_RECORD');
            }
            $user_gis_records = $user_data_record->getNext()['gis_records'];

        }catch (MongoException $e){
            TriggerError($e);
        }

        /*处理文件上传重名*/
        $upload_file_name = $this->reName($user_gis_records,$gisFile->getFileName(),$gisFile->getType());

        $new_coll_name = 'data_'.$this->getRandomStr(10).date("His");
        /*创建集合*/

        /*插入数据集合到数据库中*/
        $coll = $db->selectCollection($new_coll_name);//选择数据库中的集合
        $cursor = $coll->find();//查询集合，返回结果集的MongoCursor
        /*特征个数*/
        $feature_collection = $gisFile->getFeatureCollection();
        $len = count($feature_collection);
        // echo '<br>特征个数:'.$len.'<br>';
        try{
            if($len>0){

                for($i = 0; $i < $len; $i++){
                    $feature = $feature_collection[$i];
                    $feature['_id'] = $cursor->count()+$i;
                    $coll->insert($feature);
                }

                /*建立空间2D索引*/
                /*$str = 'geometry.coordinates.0.0';
                if($coll->ensureIndex(array($str=>'2d'))['ok'] == 1){
                    echo "success to build spatial index !";
                }*/

                /*插入到用户gis记录中*/
                $user_gis_record = array(
                    file_name=>$upload_file_name,
                    coll_name=>$new_coll_name,
                    type=>$gisFile->getType(),
                    size=>$gisFile->getSize(),
                    count=>$len,
                    upload_time=>date("Y-m-d-H-i"),
                    description=>'gis数据',
                );
                $record_pos = count($user_gis_records);
                try{
                    $res = $user_coll->update(
                        array('user_id'=>$user_id),
                        array('$set'=>array("gis_records.$record_pos"=>$user_gis_record))
                    );
                    if($res['ok']){
                        /*在记录表中插入一条数据*/
                        $db_gis_record = $user_gis_record;
                        $db_gis_record['_id'] = date("YmdH").rand(100,999);
                        $db_gis_record['user'] = $user_name;
                        $db_gis_record['user_id'] = $user_id;
                        $db->selectCollection('gis_data_records')->insert($db_gis_record)['ok'];
                        throw new MongoException("SUCCESS",8000);
                    }else{
                        throw new MongoException("FAIL_UPDATE_GIS_RECORDS");
                    }
                }catch (MongoException $e){
                    TriggerError($e);
                }
            }
            else{
                throw new Exception('EMPTY_FEATURE');
            }
        }catch (Exception $e){
            TriggerError($e);
        }

    }

}


$gisFile = new RequestFile();
$gis_file = $gisFile->getFile();


if($gis_file){
    $gis = '';
    switch($gis_file['type']){
        case 'geo':
            $gis = new GeoJSON($gis_file['geo']);
            break;
        case 'shp':
            $gis = new Shape($gis_file['shp'],$gis_file['dbf']);
            break;
    }
    $gisdata = new GisData();
    $gisdata->insertDataToDB($gis);
}
?>

