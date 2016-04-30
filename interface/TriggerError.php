<?php

/**
 * Created by PhpStorm.
 * User: Vico
 * Date: 2016.04.30
 * Time: 10:15
 */

//error_reporting(0);

function TriggerError($e){
    $errorType = array(
        FILE_UPLOAD_SUCCESS => 400,

        FILE_UPLOAD_NON => 501,

        FILE_UPLOAD_EMPTY => 502,

        DBF_NOT_FOUND => 503,
        SHP_NOT_FOUND => 504,

        SHP_FAIL_OPEN =>505,
        SHP_FAIL_OPEN =>506,

        SHP_FAIL_READ =>507,
        DBF_FAIL_READ =>508,

        SHP_TYPE_NOT_SUPPORTED => 509,
        WRONG_RECORD_TYPE => 510,

        POLYGON_AREA_TOO_SMALL => 511,


        DB_FAIL_CONNECT =>601
    );

//    echo 'Error Type: '.$type.'<br>';

    echo '错误信息：'.$e->getMessage().'<br>';
    echo '错误文件：'.$e->getFile().'<br>';
    echo '错误位置：'.$e->getLine().'<br>';
    echo '错误代码：'.$e->getCode().'<hr>';
    $str = $e->getCode();
    header("Location:result.php?resid=$str");
    exit();

/*    $url  =  "result.php?resid=$errorType[$type]" ;
    echo " <script  language='javascript'  type='text/javascript'> ";
    echo " window.location.href='$url'";
    echo " </script>";*/
    //
}
?>