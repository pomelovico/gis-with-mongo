<?php
/**
 * Created by PhpStorm.
 * User: Vico
 * Date: 2016.05.18
 * Time: 11:03
 */
header("Content-Type: text/html; charset=utf-8");

$user_acount = $_POST['user_acount'];
$user_pwd = $_POST['user_pwd'];

/*$user_acount = $_GET['user_acount'];
$user_pwd = $_GET['user_pwd'];*/

$conn = new MongoClient();
$db = $conn->selectDB('gis_manage_db');//选择一个数据库
$coll = $db->selectCollection("users_data_records");//选择数据库中的集合

$user = $coll->find(array(
    user_acount=>$user_acount,
    user_pwd=>$user_pwd
    ))->getNext();
if($user){
    echo json_encode(array(
        status=>1,
        user=>array(
            user_id=>$user['user_id'],
            user_name=>$user['user_name'],
            user_acount=>$user['user_acount'],
            user_pwd=>$user['user_pwd']
        )
    ));
}else{
    echo json_encode(array(status=>0));
}
?>
