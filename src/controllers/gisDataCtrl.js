/**
 * Created by LikoLu on 2016/4/21.
 */

function gisDataCtrl($scope,gisData){
    $scope.message = 'Gisdata Page';
    $scope.gisdata = gisData.getGisData();
    $scope.$on('gisdata.updated',()=>{
        $scope.gisdata = gisData.getGisData();
    });
}
gisDataCtrl.$inject = ['$scope','gisData'];
export  default gisDataCtrl;