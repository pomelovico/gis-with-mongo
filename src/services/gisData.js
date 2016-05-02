/**
 * Created by Vico on 2016.05.02.
 */

import {API} from '../constants/server';

function gisData($http, $rootScope){
    var GisData = {};
    $http.post(
        API.getGisData,
        {
        user_id:1,
        type:'all'
        })
        .success((data)=>{
            GisData = data.gisdata;
            $rootScope.$broadcast('gisdata.updated');
        })
        .error((data)=>{console.log(data)});

    this.getGisData = ()=>{
        return Object.assign({},GisData);
    };
    this.deleteGisData = (coll)=>{

    };
}
gisData.$inject = ['$http','$rootScope'];
export default gisData;