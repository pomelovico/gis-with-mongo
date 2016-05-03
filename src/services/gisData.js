/**
 * Created by Vico on 2016.05.02.
 */

import {API} from '../constants/server';

function gisData($http, $rootScope,$location){
    let GisRecords = [];
    let DetailGisData = {};
    $http.post(
        API.getGisData,
        {
        user_id:1,
        type:'all'
        })
        .success((data)=>{
            GisRecords = data.gisdata;
            $rootScope.$broadcast('gisdata.updated');
        })
        .error((data)=>{console.log(data)});

    /*主页gis数据记录*/
    this.getGisData = ()=>{
        return Object.assign({},GisRecords);
    };
    this.deleteGisData = id =>{
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
                for (let i in GisRecords){
                    if(GisRecords[i].id != id){
                        t.push(GisRecords[i]);
                    }
                }
                GisRecords = t;
                $rootScope.$broadcast('gisdata.deleted');
            })
            .error((data)=>{console.log(data)});
    };
    /*GIS详情数据*/
    this.fecthGis = id =>{
        $http.post(
            API.getGisData,
            {
                gis:id,
                type:'one'
            })
            .success((data)=>{
                DetailGisData = data;
                $rootScope.$broadcast('gisDetailData.updated');
            })
            .error((data)=>{console.log(data)});
    };
    this.getDetailGis = id=>{
        return Object.assign({},DetailGisData);
    }
}
gisData.$inject = ['$http','$rootScope','$location'];
export default gisData;