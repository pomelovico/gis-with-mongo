/**
 * Created by Vico on 2016.05.18.
 */
import {API} from '../constants/server';

function setCookie(name,value) {
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days*24*60*60*1000);
    document.cookie = name + "="+ encodeURI(value) + ";expires=" + exp.toGMTString();
}
function getCookie(name) {
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
        return decodeURI(arr[2]);
    else
        return null;
}
function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=getCookie(name);
    if(cval!=null)
        document.cookie= name + "="+cval+";expires="+exp.toGMTString();
}

function userService($http, $rootScope,$location){
    let USER = {};
    this.checkUser = ()=>{
        if(getCookie('user_id')){
            USER.user_id = getCookie('user_id');
            USER.user_acount = getCookie('user_acount');
            USER.user_name = getCookie('user_name');
            USER.user_pwd = getCookie('user_pwd');
        }else{
            $location.path('/user/login')
        }
    };
    this.login = (user)=>{
        $http.post(API.login, user)
            .success(data=>{
                if (data.status){
                    for(let i in data.user){
                        setCookie(i,data.user[i]);
                    }
                    USER = data.user;
                    console.log(document.cookie);
                    $rootScope.$broadcast('login.success',data.user);
                }else{
                    $rootScope.$broadcast('login.failed',data.user);
                }
            })
            .error(data=>{console.log(data)});
    };
    this.logout = ()=>{
        for(let i in USER){
            delCookie(i);
            $rootScope.$broadcast('logout.success');
        }
        USER = {};
    };
    this.regist = user=>{
        $http.post(API.regist, user)
            .success(data=>{
                if (data.status){
                    for(let i in data.user){
                        setCookie(i,data.user[i]);
                    }
                    USER = data.user;
                    console.log(document.cookie);
                    $rootScope.$broadcast('regist.success',data.user);
                }else{
                    $rootScope.$broadcast('regist.failed',data.user);
                }
            })
            .error(data=>{console.log(data)});
    };
    this.getUserId = ()=>{
        return USER.user_id;
    };
    this.getUserAcount = ()=>{
        return USER.user_acount;
    };
    this.getUserName = ()=>{
        console.log(USER);
        return USER.user_name;
    }
}
userService.$inject = ['$http','$rootScope','$location'];
export default userService;