<!DOCTYPE html>
<html>
  <head>
    <meta charset='utf-8'>
    <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
    <link rel="icon" href="favicon.ico" type="image/x-icon">
    <meta http-equiv="X-UA-Compatible" content="chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- <link rel="stylesheet/less" type="text/css" href="css/home.less"> -->
    <link  rel='stylesheet' type="text/css" href="css/bootstrap.min.css">
    <style type="text/css">
    html,body{
      font-family: 'Microsoft Yahei','Arial';
      background-color: #f3f3f3;
    }
    .header-bar{
      height: 73px;
      background-color: #FFF;
    }
    .container{
      background-color: #fff;
    }
    .table>tbody>tr>td{
      vertical-align: middle;
    }
    </style>
    <title>上传GIS数据</title>
  </head>
  <body>
   <div class="header-bar">
     <div class="container">
        <div class="row">
          <h2 class='pull-left'>GIS数据管理系统</h2>
          <div class="pull-right">
            <span >上传GIS文件</span>
            <span >Pomelo</span>
          </div>
        </div>
     </div> 
   </div>
  <div class="container">
     <div class="row">
     <div class="col-sm-10 col-sm-offset-1">
       <table class="table table-bordered table-hover table-responsive">
       <caption class='text-center'>GIS数据</caption>
       <thead>
         <tr>
           <td>名称</td>
           <td>类型</td>
           <td>大小</td>
           <td>上传时间</td>
           <td>操作</td>
         </tr>
       </thead>
       <tbody>
          <tr>
           <td>11.json</td>
           <td>geojson</td>
           <td>53KB</td>
           <td>2016-04-04-17</td>
           <td>
             <button class="btn btn-info" data-coll-name="data31314242">查看</button>
             <button class="btn btn-danger">删除</button>
           </td>
          </tr>
          <tr>
           <td>11.json</td>
           <td>geojson</td>
           <td>53KB</td>
           <td>2016-04-04-17</td>
           <td>
             <button class="btn btn-info" data-coll-name="data31314242">查看</button>
             <button class="btn btn-danger">删除</button>
           </td>
          </tr>
          <tr>
           <td>11.json</td>
           <td>geojson</td>
           <td>53KB</td>
           <td>2016-04-04-17</td>
           <td>
             <button class="btn btn-info" data-coll-name="data31314242">查看</button>
             <button class="btn btn-danger">删除</button>
           </td>
         </tr>
       </tbody>
     </table>
     </div>
   </div>
   <hr>
   <div class="row">
   <div class="col-sm-10 col-sm-offset-1">
      <form action="upload2.php" method="post" enctype="multipart/form-data" role='form'>
      <div class="form-group">
        <label class=''>上传GeoJSON</label><br>
        <input name='geo' type='file' style='display:none' id='open-btn-true'>
        <br>
        <button type="button" class='btn btn-primary' id='open-btn'>
          <span class="glyphicon glyphicon-folder-open"></span>
          &nbsp;
          <span>选择文件</span>
        </button>
        <span id='file-name'></span>
      </div>
    <!--     <label>上传Shapefile</label><br>
        <input name='shp' type='file' /><br>
        <input name='dbf' type='file' /><br> -->
        <button type="submit" class='btn btn-success'>
          <span class="glyphicon glyphicon-open"></span>
          &nbsp;
          <span>上传</span>
        </button>
        <!-- <input name='upload' type='submit' value='上传' class='btn glyphicon glyphicon-upload' /> -->
    </form>
    </div>
   </div>
  </div>
  <script src='script/jquery-1.12.2.min.js'></script>
  <script src='script/bootstrap.min.js'></script>
  <script type="text/javascript">
  $(function(){
    $('#open-btn').click(function(){
      $('#open-btn-true').click();
    });
    $('#open-btn-true').change(function(){
      var arr = $('#open-btn-true').val().split('\\');
      var file_name = arr[arr.length-1];
      $('#file-name').text(file_name);
    });
  });
  </script>
  </body>
</html>
