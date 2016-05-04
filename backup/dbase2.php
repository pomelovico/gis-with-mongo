<?php
header("Content-Type: text/html; charset=utf-8");
require_once("lib/json_encode_cn.php");//json中文转换
require_once('lib/dbase_functions.php');

dbase_open('data/data1.dbf', 0);
if ($db !==false) {
  // $record_numbers = dbase_numrecords($db);
  for ($i = 1; $i <= 1; $i++) {
      $row = dbase_get_record_with_names(0, $i);
         // print_r($row);
         echo json_encode($row);
  }
}
//读取dbf文件
/*function readDbfFile() { 
	$dbfname = "data\data1.dbf";
    $fdbf = fopen($dbfname,'r'); 
    $fields = array(); 
    $buf = fread($fdbf,32); 
    $header=unpack( "VRecordCount/vFirstRecord/vRecordLength", substr($buf,4,8)); 
    // echo 'Header: '.json_encode($header).'<br/>'; 
    $goon = true; 
    $unpackString=''; 
    while ($goon && !feof($fdbf)) { // read fields: 
        $buf = fread($fdbf,32); 
        if (substr($buf,0,1)==chr(13)) {
            $goon=false;
        } // end of field list 
        else { 
            $field=unpack( "a11fieldname/A1fieldtype/Voffset/Cfieldlen/Cfielddec", substr($buf,0,18)); 
            // echo 'Field: '.json_encode_cn($field).'<br/>'; 
            $unpackString.="A$field[fieldlen]$field[fieldname]/"; 
            array_push($fields, $field);
        }
    } 
    fseek($fdbf, $header['FirstRecord']+1); // move back to the start of the first record (after the field definitions) 
    $records_dbf = array();
    for ($i=1; $i<=$header['RecordCount']; $i++) { 
        $buf = fread($fdbf,$header['RecordLength']);
        $records_dbf[]=unpack(strtolower($unpackString),$buf);
    } //raw record 
    fclose($fdbf); 
    return $records_dbf;
} */
?>

