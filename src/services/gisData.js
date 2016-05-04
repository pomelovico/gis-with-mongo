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
                $rootScope.$broadcast('gisDetailData.updated',DetailGisData);
            })
            .error((data)=>{console.log(data)});
    };
    this.getDetailGis = id=>{
        return Object.assign({},DetailGisData);
    }
    this.saveFeature = postData=>{
        $http.post(
              API.editGeoJSON,
              postData
          )
          .success(function(data){
            console.log('success to save');
            $rootScope.$broadcast('feature.saved');
            /*if(type=='delete'){
              $('#deleteGis').modal('hide');
              MAP.layers.vectorLayer.getSource().removeFeature(feature.item(0));
              setDefaultState('delete-edit-gis');
            }*/
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
                console.log('success to delete');
                $rootScope.$broadcast('feature.deleted');
                /*if(type=='delete'){
                 $('#deleteGis').modal('hide');
                 MAP.layers.vectorLayer.getSource().removeFeature(feature.item(0));
                 setDefaultState('delete-edit-gis');
                 }*/
            })
            .error(function(data){
                console.log('faile to save');
            });
    };
}
gisData.$inject = ['$http','$rootScope','$location'];
export default gisData;