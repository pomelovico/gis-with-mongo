/**
 * Created by LikoLu on 2016/5/3.
 */
function gisDetailCtrl($scope,gisData,mapService,$routeParams){
    let GISDATA = {};
    let MAP = {};
    $scope.xx= 'liko';
    $scope.featureProps = {};/*当前选中gis特征属性*/
    $scope.record = {}/*gis数据记录信息*/
    $scope.recordMap = {
        count:'特征数',
        description:'描述',
        file_name:'文件名',
        size:'文件大小',
        type:'文件类型',
        upload_time:'上传时间'
    };
    $scope.Flag = {
        isEditingVector:false,/*正在编辑矢量数据*/
        isEditingProp:false,/*正在编辑属性*/
        isShowRecord:false, /*显示gis记录信息*/
        isAddingProp:false, /*正在添加属性*/
        isOpenTile:true, /*是否开启Tile层*/
        isInMap:false
    };
    gisData.fecthGis($routeParams.id);
    /*监听来自service的广播事件*/
    $scope.$on('gisDetailData.updated',()=>{
        let data = gisData.getDetailGis();
        if(data.status == 0){
            GISDATA = data.content;
            $scope.record = GISDATA.record;
            mapService.drawMap(GISDATA.gis);
        }
    });
    $scope.$on('gisPopOverlayer.updated',()=>{
        $scope.$apply(()=>{
            $scope.featureProps = mapService.getFeatureProps();
            $scope.Flag.isInMap = true;
        });
    });
    $scope.$on('outOfMap',()=>{
        $scope.$apply(()=>{
            $scope.Flag.isInMap = false;
        });
    });

    /*编辑GIS数据——图形*/
    $scope.editGis = function(){
        /*移除鼠标移动事件监听*/
        mapService.removeListenMouse();
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
}
gisDetailCtrl.$inject = ['$scope','gisData','mapService','$routeParams'];
export  default gisDetailCtrl;