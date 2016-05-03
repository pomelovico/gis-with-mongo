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
        isOverMap:false
    };
    gisData.fecthGis($routeParams.id);
    /*监听来自service的广播事件*/
    $scope.$on('gisDetailData.updated',(e,data)=>{
        if(data.status == 0){
            GISDATA = data.content;
            $scope.record = GISDATA.record;
            mapService.drawMap(GISDATA.gis);
        }
    });
    $scope.$on('featureProps.updated',(e,data)=>{
        $scope.$apply(()=>{
            $scope.featureProps = data;
        });
    });
    $scope.$on('mouserOverMap.updated',(e,data)=>{
        $scope.$apply(()=>{
            $scope.Flag.isOverMap = data;
        });
    });
    $scope.$on('hasSelected.updated',(e,data)=>{
        $scope.$apply(()=>{
            $scope.Flag.hasSelected = data;
        });
    });
    $scope.$on('hasModified.updated',(e,data)=>{
        $scope.$apply(()=>{
            $scope.Flag.hasModified = data;
        });
    });

    /*编辑GIS数据——图形*/
    $scope.editGis = function(){
        /*移除鼠标移动事件监听*/
        mapService.removeListenMouse();
        mapService.addSelectAndModifyEvent();
        $scope.featureProps = {};

        $scope.Flag.isEditingVector = true;
        $scope.Flag.isOverMap = false;


      };
}
gisDetailCtrl.$inject = ['$scope','gisData','mapService','$routeParams'];
export  default gisDetailCtrl;