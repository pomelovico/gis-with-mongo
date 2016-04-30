var app = angular.module('gisApp',[],function($httpProvider) {
  /*重写angularjs的post请求模块*/
  // Use x-www-form-urlencoded Content-Type
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
  var param = function(obj) {
    var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
    for(name in obj) {
      value = obj[name];
      if(value instanceof Array) {
        for(i=0; i<value.length; ++i) {
          subValue = value[i];
          fullSubName = name + '[' + i + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if(value instanceof Object) {
        for(subName in value) {
          subValue = value[subName];
          fullSubName = name + '[' + subName + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if(value !== undefined && value !== null)
        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
    }
    return query.length ? query.substr(0, query.length - 1) : query;
  };
  // Override $http service's default transformRequest
  $httpProvider.defaults.transformRequest = [function(data) {
    return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
  }];
});
var App = new gisApp();


/*常量*/
var commonStyle = new ol.style.Style({
      fill: new ol.style.Fill({
        color:"rgba(0,0,0,0.8)"
      }),
      stroke: new ol.style.Stroke({
        color:"rgba(120,120,120,1)",
        width:1
      }),
      text: new ol.style.Text({
            font: '10px 微软雅黑',
            fill: new ol.style.Fill({
              color: '#ddd'
            })
          })
    });


app.controller('gisCtrl',function($scope,$http){
  var GISDATA = {};
  var MAP = {};
  $scope.featureProps = {};/*当前选中gis特征属性*/
  $scope.record = {}/*gis数据记录信息*/
  $scope.recordMap = {
    count:'特征数',
    description:'描述',
    file_name:'文件名',
    size:'文件大小',
    type:'文件类型',
    upload_time:'上传时间'
  }
  /*状态标识位*/
  $scope.Flag = {
    isEditingVector: false,/*正在编辑矢量数据*/
    isEditingProp: false,/*正在编辑属性*/
    isShowRecord: false, /*显示gis记录信息*/
    isAddingProp: false, /*正在添加属性*/
    isOpenTile: true, /*是否开启Tile层*/
    hasModified: false, /*是否有修改*/
    hasSelected: false /*是否有选中的特征*/
  };
 /*监控数据变化*/
  $scope.$watch('featureProps',setDefaultState);

  /*设置为初始状态*/
  var setDefaultState = function(type){
    switch(type){
      case 'cancle-edit-prop':
      case 'save-edit-prop':
          $scope.Flag.isEditingProp = false;
          $scope.Flag.isAddingProp = false;
      break;
      case 'add-edit-prop':
          $scope.Flag.isAddingProp = false;
          break;
      case 'cancle-edit-gis':
          $scope.Flag.hasSelected = false;
          break;
      case 'delete-edit-gis':
          $scope.Flag.hasSelected = false;
          $scope.featureProps = {};
          break;
    }
    $scope.Flag.hasModified = false;

    $scope.propName = '';
    $scope.propValue = '';
    oldID = -1;
  }

  /*鼠标指针事件监听器--popOverlayer*/
  var oldID = -1; 
  var pointermoveListener = function(evt){
    var coordinate = evt.coordinate;
    var features = [];
    MAP.map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
      features.push(feature);
    });
    if(features.length){
      if(oldID != features[0].getId()){
        $scope.$apply(function(){
          var t = features[0].getProperties();
          delete t.geometry;
          $scope.featureProps = t;
          oldID = features[0].getId();
        });
      }
      MAP.overlayer.popOverlayer.setPosition(coordinate);
    }else{
      MAP.overlayer.popOverlayer.setPosition(undefined);
    }
  };

  /*绘制map*/
  var drawMap = function(gisdata){
    var view = new ol.View({
        projection:'EPSG:4326',
        center:[120,40],
        zoom:3,
        maxResolution:1,
        minResolution:0.00008
    });
    /*矢量数据层*/
    var features = (new ol.format.GeoJSON()).readFeatures(gisdata);
    features.map(function(item,index){
      item.setId(gisdata.features[index]._id);
    });
    var vectorSource = new ol.source.Vector({
        features: features
      });

    var vectorLayer = new ol.layer.Vector({
      source:vectorSource,
      style:function(feature, resolution) {
          var s = commonStyle;
          s.getText().setText(resolution < 0.1 ? feature.get('name') : "");
          return s;
        }
    });

    /*Tile预渲染层*/
    var tileLayer = new ol.layer.Tile({
        source: new ol.source.OSM(),
        visible:true,
        preload:0
      });

    /*popover popOverlayer*/
    var popOverlayer = new ol.Overlay(({
      id: 1,
      element: document.getElementById('popup'),
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      }
    }));
    
    var map = new ol.Map({
      layers: [
        // tileLayer,
        vectorLayer
      ],
      overlays:[
        popOverlayer
      ],
      target: 'map',
      view: view,
      controls: ol.control.defaults().extend([
        new ol.control.FullScreen()
      ])
    });
    /*注册鼠标移动事件*/
    map.on('pointermove', pointermoveListener);
    return {
      view:view,
      layers:{
        tileLayer:tileLayer,
        vectorLayer:vectorLayer
      },
      overlayer:{
        popOverlayer:popOverlayer
      },
      map:map,
      features:features,
      interaction:{}
    }
  };
  /*获取GIS数据*/
  $http.post(
    'interface/getGisdata.php',
    {
      user_id:1,
      type:'ONE',
      gis:App.getUrlParam('gis')
    }
  ).success(function(data){
    GISDATA= angular.copy(data.gis);
    $scope.record = data.record;
    MAP = drawMap(data.gis);
  }).error(function(data){
    alert('数据获取失败');
  });

  /*编辑GIS数据——图形*/
  $scope.editGis = function(){
    /*移除popoverlay，鼠标移动事件监听*/
    MAP.map.removeOverlay(MAP.overlayer.popOverlayer);
    oldID = -1;
    MAP.map.un('pointermove',pointermoveListener);
    $scope.featureProps = {};

    $scope.Flag.isEditingVector = true;
    var select = new ol.interaction.Select({
      wrapX: false
    });
    select.on('select',function(feature){
      var style = new ol.style.Style({
          fill:new ol.style.Fill({
            color:"rgba(255,255,255,0.5)"
          }),
          stroke:new ol.style.Stroke({
            color:"#0BA6FF",
            width:1
          }),
          text: new ol.style.Text({
            color:'#333'
          })
        });

      /*是否有选中的特征*/
      
      // console.log($scope.Flag.hasSelected);
      $scope.$apply(function(){
        if(feature['selected'].length<1)
        $scope.Flag.hasSelected = false;
      else
        $scope.Flag.hasSelected = true;
      });
       /*注册选择事件*/
      feature['selected'].map(function(item,index){
        var s = style;
        s.getText().setText(MAP.view.getResolution() < 0.1 ? item.get('name') : "");
        item.setStyle(s);
        var t = item.getProperties();
        delete t.geometry;
        $scope.featureProps = t;
        $scope.$apply();
        // setDefaultState();
      });
      feature['deselected'].map(function(item,index){
        item.setStyle();
        setDefaultState();
      });
    });
    MAP.interaction.select = select;
    MAP.map.addInteraction(select);
    var modify = new ol.interaction.Modify({
      features: select.getFeatures(),
      deleteCondition: function(event) {
        return ol.events.condition.shiftKeyOnly(event) &&
            ol.events.condition.singleClick(event);
      }
    });
    modify.on('modifystart',function(e){
      //已经被修改
      $scope.Flag.hasModified = true;
    });
    MAP.interaction.modify = modify;
    MAP.map.addInteraction(modify);
  };

  /*保存GIS*/
  $scope.saveGis = function(type){
    /*type = save, delete, delete_confirm */

    switch(type){/*退出编辑*/
      case 'cancle': 
            var features = (new ol.format.GeoJSON()).readFeatures(GISDATA);
            features.map(function(item,index){
              item.setId(GISDATA.features[index]._id);
            });
            var vectorSource = new ol.source.Vector({
                features: features
              });
            MAP.layers.vectorLayer.setSource(vectorSource);
            setDefaultState('cancle-edit-gis');
            break;
      case 'delete_confirm':/*确认删除*/
            $('#deleteGis').modal('show');
            return;
      case 'save':
      case 'delete':
            /*Ajax数据*/
            var postData = {
              coll_name:App.getUrlParam('gis'),
              type:type
            };
            /*获取当前选中的特征数据*/
            var f = new ol.format.GeoJSON();
            var feature = MAP.interaction.select.getFeatures();
            postData['data'] = type == 'save' ? f.writeFeature(feature.item(0)) : JSON.stringify({id : feature.item(0).getId()});
            $http.post(
              'interface/editGeoJSON.php',
              postData
              )
              .success(function(data){
                console.log('success to save or delete');
                if(type=='delete'){
                  $('#deleteGis').modal('hide');
                  MAP.layers.vectorLayer.getSource().removeFeature(feature.item(0));
                  setDefaultState('delete-edit-gis');
                }
              })
              .error(function(data){
                console.log('faile to save');
            });
            return;
    }
   

      /*取消编辑*/
      /**/

    $scope.Flag.isEditingVector = false;
    /*添加popoverlay，鼠标移动事件监听*/
    MAP.map.addOverlay(MAP.overlayer.popOverlayer);
    MAP.map.on('pointermove',pointermoveListener);
    /*移除select和modify*/
    MAP.map.removeInteraction(MAP.interaction.modify);
    MAP.map.removeInteraction(MAP.interaction.select);
    /*设置所有特征的style*/
     MAP.layers.vectorLayer.getSource().getFeatures().map(function(item){
      item.setStyle();
    });
    $scope.featureProps = {};
  };
  $scope.deleteGis = function(){

  }
  /*编辑GIS属性数据*/
  $scope.propName = '';
  $scope.propValue = '';
  $scope.editProp = function(type, key, value){
    switch(type){
      case 'edit':
          if(!$scope.Flag.isEditingProp){
            $scope.Flag.isEditingProp = true;
            $scope.propName = key;
            $scope.propValue = value;
          }
          break;
      case 'save':
          var features = MAP.interaction.select.getFeatures();
          features.item(0).setProperties({
            [$scope.propName]:$scope.propValue
          });
          $scope.featureProps[$scope.propName] = $scope.propValue;

          setDefaultState('save-edit-prop');
          break
      case 'cancle':
          setDefaultState('cancle-edit-prop');
          break;
      case 'add':
          if($scope.Flag.hasSelected){
             $scope.Flag.isEditingProp = true;
              $scope.Flag.isAddingProp = true;
          }   
          break;
      case 'showConfirmModal':
          $('#removeProp').modal('show');
          $scope.propName = key;
          break;
      case 'remove':
          $('#removeProp').modal('hide');
          delete $scope.featureProps[$scope.propName];
          var features = MAP.interaction.select.getFeatures();
          features.item(0).unset(
            $scope.propName
          );
          setDefaultState('remove-edit-prop');
    }
  };
  /*Tile预渲染层*/
  $scope.toggleTilelayer = function(){
    $scope.Flag.isOpenTile =!$scope.Flag.isOpenTile;
    MAP.layers.tileLayer.setVisible($scope.Flag.isOpenTile);
  };
});
