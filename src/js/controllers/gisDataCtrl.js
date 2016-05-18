/**
 * Created by LikoLu on 2016/4/21.
 */

function gisDataCtrl($scope,gisData,userService){
    userService.checkUser();
    gisData.fetchGisData(userService.getUserId());
    
    $scope.alertInfo = '';
    $scope.gisID = '';
    $scope.gisdata = '';
    
    $scope.deleteGisData = ()=>{
        gisData.deleteGisData($scope.gisID,userService.getUserId());
    };
    $scope.$on('gisdata.updated',()=>{
        $scope.gisdata = gisData.getGisData();
    });
    $scope.$on('gisdata.deleted',()=>{
        $scope.gisdata = gisData.getGisData();
    });

}
gisDataCtrl.$inject = ['$scope','gisData','userService'];
export  default gisDataCtrl;