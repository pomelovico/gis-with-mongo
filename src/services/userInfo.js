/**
 * Created by Vico on 2016.04.24.
 */

function userInfo($http, $rootScope){
    var User = {};
    $http.get('data/user.json')
        .success((data)=>{
            User = data;
            $rootScope.$broadcast('users.updated');
        })
        .error((data)=>{console.log(data)});

    this.getUser = ()=>{
        return Object.assign({},User);
    };
    this.setUser = (newUser)=>{
        User = newUser;
        $rootScope.$broadcast('users.updated');
    }
}

userInfo.$inject = ['$http','$rootScope'];
export default userInfo;

