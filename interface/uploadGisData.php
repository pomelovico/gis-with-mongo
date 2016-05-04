<?php
header('Content-Type:text/html;charset=utf-8');
date_default_timezone_set("Asia/Shanghai");

$shp = $_FILES['shp'];  //获取shp的信息
$dbf = $_FILES['dbf'];  //获取dbf的信息
$geo = $_FILES['geo'];
$infoType = array(
	EMPTY_DATA => '未上传数据',
	WAITING => "处理数据中,请稍后...",
	SUCCESS => "数据上传成功!",
	WRONG_FORMAT => "数据格式错误",
	EMPTY_FEATURE => "特征数据为空或格式有误！",
	WRONG_DATABASE => "数据库错误!"
);

/*生成随机字符串*/
function getRandomStr($len){
	$str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRETUVWXYZ0123456789";
	$max = strlen($str)-1;
	$res = '';
	for($i=0; $i<$len; $i++){
	    $res.=$str[rand(0,$max)]; //rand($min,$max)生成介于min和max两个数之间的一个随机整数
   }
   return $res;
}
$info =$infoType['WAITING'];

function insertToDB($geo){
	global $infoType;
	$tempfile_name = $geo['tmp_name'];
    $upload_file_name = $geo['name'];
    // echo "临时目录：".$tempfile_name."<br>";
    /*$geoJSON = json_decode($str ,true);
    $str = file_get_contents($tempfile_name);
    echo 'encode type:'.mb_detect_encoding($str, array("ASCII",'UTF-8',"GB2312","GBK",'BIG5'));*/

    $geoJSON = json_decode(trim(file_get_contents($tempfile_name),chr(239).chr(187).chr(191)),true); 
    // $geoJSON = ''; 
    if(!$geoJSON){
    	return $infoType['WRONG_FORMAT'];
    }
    $conn = new MongoClient();
	$db = $conn->selectDB('gis_manage_db');//选择一个数据库
	$user_name = 'pomelo';
	$user_id = '1';
	
	$user_coll = $db->selectCollection('users_data_records');
	$user_data_record = $user_coll->find(array(user_id=>$user_id));
	$user_gis_records = $user_data_record->next()['gis_records'];
	/*处理文件上传重名*/
	$same_filename_count = 0;
	$records_len = count($user_gis_records);
	for($i = 0; $i < $records_len; $i+=1){
		$n = explode("(",explode('.json',$user_gis_records[$i]['file_name'])[0])[0];
		if($n == basename($upload_file_name,'.json')) 
			$same_filename_count+=1;
	}
	if($same_filename_count){
		$upload_file_name=basename($upload_file_name,'.json')."(".$same_filename_count.").json";
	}
	// echo '<br>filename:'.$upload_file_name.'<br>';
	$new_coll_name = 'data_'.getRandomStr(10).date("His");
	// echo '<br>集合名：'.$new_coll_name.'<br>';
	/*创建集合*/
	try{
			/*插入数据集合到数据库中*/
			$coll = $db->selectCollection($new_coll_name);//选择数据库中的集合
			$cursor = $coll->find();//查询集合，返回结果集的MongoCursor
			/*特征个数*/
			$len = count($geoJSON['features']);
			// echo '<br>特征个数:'.$len.'<br>';
			if($len>0){
				for($i = 0; $i < $len; $i++){
					$feature = $geoJSON['features'][$i];
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
					type=>'geojson',
					size=>filesize($tempfile_name),
					count=>$len,
					upload_time=>date("Y-m-d-H-i"),
					description=>'gis数据',
				);
				$res = $user_coll->update(
					array(user_id=>$user_id),
					array('$set'=>array("gis_records.$records_len"=>$user_gis_record))
				);

				if($res['ok']){
					/*在记录表中插入一条数据*/
					$db_gis_record = $user_gis_record;
					$db_gis_record['_id'] = date("YmdH").rand(100,999);
					$db_gis_record['user'] = $user_name;
					$db_gis_record['user_id'] = $user_id;
					$db->selectCollection('gis_data_records')->insert($db_gis_record)['ok'];
				}
				return $infoType['SUCCESS'];
				
			}else{
				return $infoType['EMPTY_FEATURE'];
			}

	}catch (exception $e){
		global $info;
		$info = $infoType['WRONG_DATABASE'].$e;
	}
}


if($geo['size'] > 0){
	global $info;
	$info = insertToDB($geo);
}else if($shp['size'] > 0 && $dbf['size'] > 0){
	
}else{
	global $info;
	$info = $infoType['EMPTY_DATA'];
}
?>
<!DOCTYPE html>
<html>
<head>
	<meta charset='utf-8' >
	<link  rel='stylesheet' type="text/css" href="../src/css/common.css">
	<title>Upload</title>
	<style>
	.wrapper{
		margin:0 auto;
		width: 80%;
		min-height: 400px;
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
	</style>
</head>
<body>
<div class="wrapper">
	<p id='info'><?php echo $info; ?></p>
	<a id='back-btn' href="../index-backup.html">返回</a>
</div>
</body>
</html>