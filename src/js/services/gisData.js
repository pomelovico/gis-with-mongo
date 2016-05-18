/**
 * Created by Vico on 2016.05.02.
 */

import {API} from '../constants/server';

function gisData($http, $rootScope,$location){
    let GisRecords = [];
    let DetailGisData = {};
    
    this.fetchGisData = user_id=>{
        $http.post(
            API.getGisData,
            {
                user_id:user_id,
                type:'all'
            })
            .success((data)=>{
                GisRecords = data.gisdata;
                $rootScope.$broadcast('gisdata.updated');
            })
            .error((data)=>{console.log(data)});
    };
    /*主页gis数据记录*/
    this.getGisData = ()=>{
        return GisRecords;
    }; 
    this.deleteGisData = (coll_id,user_id) =>{
        $rootScope.$broadcast('gisdata.isdeleting');
        $http.post(
            API.deleteGisData,
            {
                user_id:user_id,
                coll_name:`data_${coll_id}`
            })
            .success((data)=>{
                let t = [];
                for (let i in GisRecords){
                    if(GisRecords[i].id != coll_id){
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
                $rootScope.$broadcast('gisDetailData.updated',DetailGisData);
            })
            .error((data)=>{console.log(data)});
    };
    this.getDetailGis = id=>{
        return DetailGisData;
    }
    this.saveFeature = postData=>{
        $http.post(
              API.editGeoJSON,
              postData
          )
          .success(function(data){
            $rootScope.$broadcast('feature.saved');
          })
          .error(function(data){
            console.log('faile to save');
        });
    };
    this.deleteFeature = postData=>{
        $http.post(
            API.editGeoJSON,
            postData
            )
            .success(function(data){
                $rootScope.$broadcast('feature.deleted');
            })
            .error(function(data){
                console.log('faile to save');
            });
    };
}
gisData.$inject = ['$http','$rootScope','$location'];
export default gisData;