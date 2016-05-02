/**
 * Created by LikoLu on 2016/4/21.
 */
// import angular from 'angular';
import angularRouter from 'angular-route';

import {controllers} from './controllers';
import {services} from './services';
import {directives} from './directives';
import {tmpls} from './templates';

var app = angular.module('App',[angularRouter]);

/*路由*/
app.config(function($routeProvider){
    $routeProvider
        .when('/',{
            template : tmpls.gisdata,
            controller : 'gisDataCtrl'
        })
        .when('/gisdata',{
            template : tmpls.gisdata,
            controller : 'gisDataCtrl'
        })
        .when('/user',{
            template : tmpls.user,
            controller : 'userCtrl'
        })
        .when('/upload',{
            template : tmpls.upload,
            controller : 'uploadCtrl'
        })
});
/*注入服务*/
// app.service('userInfo',services.userInfo);


/*指令*/
// app.directive('myFooter',directives.myFooter);


/*控制器*/
app.controller('gisDataCtrl',controllers.gisDataCtrl);
app.controller('userCtrl',controllers.userCtrl);
app.controller('uploadCtrl',controllers.uploadCtrl);


