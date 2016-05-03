/**
 * Created by LikoLu on 2016/5/3.
 */
function gisDetailCtrl($scope,gisData,mapService,$routeParams){
    let GISDATA = {};
    let MAP = {};
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
        isOpenTile:true /*是否开启Tile层*/
    };

    gisData.fecthGis($routeParams.id);
    $scope.$on('gisDetailData.updated',()=>{
        let data = gisData.getDetailGis();
        if(data.status == 0){
            GISDATA = data.content;
            mapService.drawMap(GISDATA.gis);
            console.log(GISDATA);
        }
    });
}
gisDetailCtrl.$inject = ['$scope','gisData','mapService','$routeParams'];
export  default gisDetailCtrl;