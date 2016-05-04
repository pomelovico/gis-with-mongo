/**
 * Created by LikoLu on 2016/4/21.
 */
// import angular from 'angular';
import angularRouter from 'angular-route';


import {controllers} from './js/controllers';
import {services} from './js/services';
import {directives} from './js/directives';
import {tmpls} from './js/templates';

var app = angular.module('App',[angularRouter],['$httpProvider',function($httpProvider) {
    /*重写angularjs的post请求模块*/
    // Use x-www-form-urlencoded Content-Type
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    var param = function(obj) {
        var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
        for(name in obj) {
            value = obj[name];
            if(value instanceof Array) {
                for(i=0; i<value.length; ++i) {
                    subValue = value[i];
                    fullSubName = name + '[' + i + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            }
            else if(value instanceof Object) {
                for(subName in value) {
                    subValue = value[subName];
                    fullSubName = name + '[' + subName + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            }
            else if(value !== undefined && value !== null)
                query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }
        return query.length ? query.substr(0, query.length - 1) : query;
    };
    // Override $http service's default transformRequest
    $httpProvider.defaults.transformRequest = [function(data) {
        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];
}]);

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
        .when('/gisDetail/:id',{
            template : tmpls.gisDetail,
            controller : 'gisDetailCtrl'
        })
});
/*注入服务*/
app.service('gisData',services.gisData);
app.service('mapService',services.mapService);


/*指令*/
app.directive('myConfirmDel',directives.myConfirmDel);
app.directive('myEditPropsGroup',directives.myEditPropsGroup);
app.directive('myEditFeature',directives.myEditFeatureGroup);
app.directive('myEditProps',directives.myEditProps);
app.directive('mySelectBtn',directives.mySelectBtn);


/*控制器*/
app.controller('gisDataCtrl',controllers.gisDataCtrl);
app.controller('userCtrl',controllers.userCtrl);
app.controller('uploadCtrl',controllers.uploadCtrl);
app.controller('gisDetailCtrl',controllers.gisDetailCtrl);


