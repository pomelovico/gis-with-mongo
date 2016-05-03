/**
 * Created by Vico on 2016.05.02.
 */

import {API} from '../constants/server';

function gisData($http, $rootScope,$location){
    var GisData = [];
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
    this.deleteGisData = (id)=>{
        $rootScope.$broadcast('gisdata.isdeleting');
        $http.post(
            API.deleteGisData,
            {
                user_id:1,
                coll_name:`data_${id}`
            })
            .success((data)=>{
                console.log('success');
                let t = [];
                for (let i in GisData){
                    if(GisData[i].id != id){
                        t.push(GisData[i]);
                    }
                }
                GisData = t;
                $rootScope.$broadcast('gisdata.deleted');
            })
            .error((data)=>{console.log(data)});
    };
}
gisData.$inject = ['$http','$rootScope','$location'];
export default gisData;