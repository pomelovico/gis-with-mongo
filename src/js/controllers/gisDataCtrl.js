/**
 * Created by LikoLu on 2016/4/21.
 */

function gisDataCtrl($scope,gisData,$timeout){
    $scope.alertInfo = '';
    $scope.gisID = '123';
    $scope.gisdata = gisData.getGisData();
    $scope.$on('gisdata.updated',()=>{
        $scope.gisdata = gisData.getGisData();
    });
    $scope.$on('gisdata.deleted',()=>{
        $scope.gisdata = gisData.getGisData();
    });
    $scope.deleteGisData = ()=>{
        gisData.deleteGisData($scope.gisID);
    }
}
gisDataCtrl.$inject = ['$scope','gisData','$timeout'];
export  default gisDataCtrl;