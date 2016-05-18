<?php
/**
 * Created by PhpStorm.
 * User: Vico
 * Date: 2016.05.18
 * Time: 11:03
 */
header("Content-Type: text/html; charset=utf-8");
function genID(){
    $str = "0123456789";
    $max = strlen($str)-1;
    $res = '';
    for($i=0; $i<4; $i++){
        $res.=$str[rand(0,$max)]; //rand($min,$max)生成介于min和max两个数之间的一个随机整数
    }
    return $res.date("YmdH");
}

$user_acount = $_POST['user_acount'];
$user_pwd = $_POST['user_pwd'];
$user_name = $_POST['user_name'];

/*$user_acount = $_GET['user_acount'];
$user_pwd = $_GET['user_pwd'];
$user_name = $_GET['user_name'];*/

$conn = new MongoClient();
$db = $conn->selectDB('gis_manage_db');//选择一个数据库
$coll = $db->selectCollection("users_data_records");//选择数据库中的集合

$user = $coll->find(array(),array(user_acount=>1))->getNext();
$len = count($user);
$i = 0;
for($i=0; $i<$len;$i++){
    if($user_acount == $user['user_acount'])
        break;
}
$user_id = genID();
if($i==$len){
    $res = $coll->insert(array(
        user_name=> $user_name,
        user_id=> $user_id,
        user_acount=> $user_acount,
        user_pwd=> $user_pwd,
        gis_records=> array(),
    ));
    if($res['ok']){
        echo json_encode(array(
            status=>1,
            user=>array(
                user_name=> $user_name,
                user_id=> $user_id,
                user_acount=> $user_acount,
                user_pwd=> $user_pwd,
            )
        ));
    }else{
        echo json_encode(array(
            status=>0
        ));
    }
}else{
    echo json_encode(array(
        status=>0
    ));
}
?>
