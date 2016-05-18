/**
 * Created by Vico on 2016.05.18.
 */
function mainCtrl($scope,userService) {
    userService.checkUser();
    $scope.user = userService.getUserName();
}
mainCtrl.$inject = ['$scope','userService'];
export  default mainCtrl;