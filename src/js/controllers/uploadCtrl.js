/**
 * Created by Vico on 2016.05.02.
 */
function uploadCtrl($scope,userService){
    userService.checkUser();
    $scope.user_id = userService.getUserId();
    $scope.user_name = userService.getUserName();
}
uploadCtrl.$inject = ['$scope','userService'];
export  default uploadCtrl;