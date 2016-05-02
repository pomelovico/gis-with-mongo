/**
 * Created by LikoLu on 2016/4/26.
 */

function modifyUserInfo(userInfo,$location){
    return {
        restrict:'A',
        link:(scope, element, attrs)=>{
            element.bind('click',()=>{
                userInfo.setUser(scope.user);
                $location.path('/contact');
                scope.$apply();
            })
        }
    }
}
modifyUserInfo.$inject = ['userInfo','$location'];
export default modifyUserInfo;