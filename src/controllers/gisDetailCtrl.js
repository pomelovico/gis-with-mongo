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
        hasModified:false, /*是否有修改*/
        hasSelected:false, /*是否有选中的特征*/
        isOverMap:false
    };
    /*提示信息*/
    $scope.alertInfo = '';
    /*当前特征属性*/
    $scope.currentProps = {
        k:'',
        v:''
    };

    $scope.$safeApply = function(fn) {
         var phase = this.$root.$$phase;
         if(phase == '$apply' || phase == '$digest') {
         if(fn && (typeof(fn) === 'function')) {
        fn();
        }
         }else {
        this.$apply(fn);
        }
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
    $scope.$on('featureProps.updated',(e,data)=>{$scope.$safeApply(()=>{$scope.featureProps = data;});});
    $scope.$on('mouserOverMap.updated',(e,data)=>{$scope.$safeApply(()=>{$scope.Flag.isOverMap = data;});});
    $scope.$on('hasSelected.updated',(e,data)=>{$scope.$safeApply(()=>{$scope.Flag.hasSelected = data;});});
    $scope.$on('hasModified.updated',(e,data)=>{$scope.$safeApply(()=>{$scope.Flag.hasModified = data;});});
    $scope.$on('isEditingVector.updated',(e,data)=>{$scope.$safeApply(()=>{$scope.Flag.isEditingVector = data;});});
    $scope.$on('isEditingProp.updated',(e,data)=>{$scope.$safeApply(()=>{$scope.Flag.isEditingProp = data;});});
    $scope.$on('isShowRecord.updated',(e,data)=>{$scope.$safeApply(()=>{$scope.Flag.isShowRecord = data;});});
    $scope.$on('isAddingProp.updated',(e,data)=>{$scope.$safeApply(()=>{$scope.Flag.isAddingProp = data;});});
    $scope.$on('currentProp.updated',(e,data)=>{$scope.$safeApply(()=>{$scope.currentProps = data});});
    $scope.$on('alertInfo.updated',(e,data)=>{$scope.$safeApply(()=>{$scope.alertInfo = data});});

    $scope.$on('feature.deleted',()=>{
        mapService.deleteFeature();
        // $scope.$safeApply(()=>{$scope.featureProps = {};});
    });
    /*编辑GIS数据——图形*/
    $scope.editGis = ()=>{
        /*移除鼠标移动事件监听*/
        mapService.removeListenMouse();
        mapService.addSelectAndModifyEvent();
        $scope.featureProps = {};
        $scope.Flag.isEditingVector = true;
      };
    $scope.cancleEdit = ()=>{
        mapService.removeSelectAndModifyEvent();
    };
    $scope.removeProps = ()=>{
        mapService.removeProps($scope.currentProps.k);
    };
    $scope.updateProps = ()=>{
        mapService.updateProps($scope.currentProps);
    };
/*    $scope.addPropToFeature = ()=>{
        // mapService.updateProps($scope.currentProps);
    };*/
    $scope.saveFeature = ()=>{
        console.log('save');
        let postData = {
            coll_name:$routeParams.id,
            type:'save',
            data:mapService.getFeatureToSave()
        };
        gisData.saveFeature(postData);
    };
    $scope.deleteFeature = ()=>{
        console.log('delete');
        let postData = {
            coll_name:$routeParams.id,
            type:'delete',
            data:JSON.stringify({id : mapService.getIdOfFeatureToDelete()})
        };
        gisData.deleteFeature(postData);
    }
}

gisDetailCtrl.$inject = ['$scope','gisData','mapService','$routeParams'];
export  default gisDetailCtrl;