<?php
header('Content-Type: application/json; charset=utf-8'); 
$url='http://code.taobao.org/svn/angular_test/yunweix/lib/echarts-2.0.2/src/util/mapData/rawData/geoJson/world_geo.json';
$html = file_get_contents($url);
echo $html;
?>