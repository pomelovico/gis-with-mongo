/**
 * Created by Vico on 2016.05.02.
 */
function userCtrl($scope,userService,$location) {
    var patten = new RegExp('register');
    patten.test($location.$$path) ? null : userService.checkUser();

    $scope.login_user_acount = '';
    $scope.login_user_pwd = '';

    $scope.reg_user_acount = '';
    $scope.reg_user_name = '';
    $scope.reg_user_pwd = '';
    $scope.reg_user_pwd_r = '';

    $scope.logout = ()=> {
        userService.logout();
    };
    $scope.login = ()=> {
        userService.login({
            user_acount: $scope.login_user_acount,
            user_pwd: $scope.login_user_pwd
        });
    };
    $scope.regist = ()=>{
        if($scope.reg_user_pwd === $scope.reg_user_pwd_r 
            && $scope.reg_user_name!== '' 
            && $scope.reg_user_acount !== '' 
            &&$scope.reg_user_pwd!==''){
            userService.regist({
                user_name:$scope.reg_user_name,
                user_pwd :$scope.reg_user_pwd,
                user_acount :$scope.reg_user_acount
            });
        }
    };
    $scope.$on('login.success', (e, data)=> {
        $location.path('/gisdata')
    });
    $scope.$on('logout.success', ()=> {
        $location.path('/user/login');
    });
    $scope.$on('regist.success', ()=> {
        $location.path('/gisdata');
    });
}
userCtrl.$inject = ['$scope','userService','$location'];
export  default userCtrl;