/**
 * Created by LikoLu on 2016/5/3.
 */

function mapService($rootScope){
    var features,
        vectorSource,
        vectorLayer,
        map,
        interaction={};
    /*Tile预渲染层*/
    var tileLayer = new ol.layer.Tile({
        source: new ol.source.OSM(),
        visible:false,
        preload:0
    });

    /*style*/
    var commonStyle = new ol.style.Style({
        fill: new ol.style.Fill({
            color:"rgba(0,0,0,0.8)"
        }),
        stroke: new ol.style.Stroke({
            color:"rgba(120,120,120,1)",
            width:1
        }),
        text: new ol.style.Text({
            font: '10px 微软雅黑',
            fill: new ol.style.Fill({
                color: '#ddd'
            })
        })
    });
    var selectedStyle = new ol.style.Style({
        fill:new ol.style.Fill({
            color:"rgba(255,255,255,0.5)"
          }),
        stroke:new ol.style.Stroke({
            color:"#0BA6FF",
            width:1
        }),
        text: new ol.style.Text({
            color:'#333'
        })
    });
    var delectedStyle = new ol.style.Style({
      fill:new ol.style.Fill({
        color:"rgba(255,255,255,0)"
      }),
      stroke:new ol.style.Stroke({
        color:"rgba(255,255,255,0)",
        width:0
      })
    })
    /*视图*/
    var defaultView = new ol.View({
        projection: 'EPSG:4326',
        center:[120,40],
        zoom:3,
        maxResolution:1,
        minResolution:0.00008
    });
    /*鼠标指针事件监听器--popOverlayer*/
    var oldID = -1;
    var featureProps = {};
    var pointermoveListener = function(evt){
        var coordinate = evt.coordinate;
        var features = [];
        map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
            features.push(feature);
        });
        if(features.length){
            if(oldID != features[0].getId()){
                var t = features[0].getProperties();
                delete t.geometry;
                featureProps = t;
                oldID = features[0].getId();
                $rootScope.$broadcast('featureProps.updated',t);
                $rootScope.$broadcast('mouserOverMap.updated',true);
            }
        }else{
            $rootScope.$broadcast('mouserOverMap.updated',false);
        }
    };
    /*绘制*/
    this.drawMap = (mapdata)=>{
        /*数据源特征*/
        features = (new ol.format.GeoJSON()).readFeatures(mapdata);
        features.map(function(item,index){
            item.setId(mapdata.features[index]._id);
        });
        /*矢量源*/
        vectorSource = new ol.source.Vector({
            features: features
        });
        /*创建矢量数据层*/
        vectorLayer = new ol.layer.Vector({
            source:vectorSource,
            style:function(feature, resolution) {
                var s = commonStyle;
                s.getText().setText(resolution < 0.1 ? feature.get('name') : "");
                return s;
            }
        });
        map = new ol.Map({
            layers: [
                tileLayer,
                vectorLayer
            ],
            target: 'map',
            view: defaultView
        });
        /*注册鼠标移动事件*/
        map.on('pointermove', pointermoveListener);
        return {
            interaction:{}
        }
    }
    this.getFeatureProps = ()=>{
        return featureProps;
    };
    /*移除鼠标移动事件监听*/
    this.removeListenMouse = ()=>{
        oldID = -1;
        map.un('pointermove',pointermoveListener);
    };
    this.addSelectAndModifyEvent = ()=>{
        var select = new ol.interaction.Select({
          wrapX: false
        });
        /*注册选择事件*/
        select.on('select',function(feature){
          /*是否有选中的特征*/
            if(feature['selected'].length<1){
                $rootScope.$broadcast('hasSelected.updated',false);
            }
            else{
                $rootScope.$broadcast('hasSelected.updated',true);
                feature['selected'].map(function(item,index){
                    var s = selectedStyle;
                    s.getText().setText(defaultView.getResolution() < 0.1 ? item.get('name') : "");
                    item.setStyle(s);
                    var t = item.getProperties();
                    delete t.geometry;
                    featureProps= t;
                     $rootScope.$broadcast('featureProps.updated',t);
                });
            }
            feature['deselected'].map(function(item,index){
                item.setStyle();
            });
        });
        interaction['select'] = select;
        map.addInteraction(select);

        var modify = new ol.interaction.Modify({
            features: select.getFeatures(),
            deleteCondition: function(event) {
                return ol.events.condition.shiftKeyOnly(event) &&
                ol.events.condition.singleClick(event);
            }
        });
        modify.on('modifystart',function(e){
            //已经被修改
            $rootScope.$broadcast('hasModified.updated',true);
        });
        interaction['modify'] = modify;
        map.addInteraction(modify);
    };
    this.removeSelectAndModifyEvent = ()=>{
        /*添加鼠标滑动事件监听*/
        map.on('pointermove',pointermoveListener);
        /*移除select和modify*/
        $rootScope.$broadcast('isEditingVector.updated',false);
        $rootScope.$broadcast('hasSelected.updated',false);
        $rootScope.$broadcast('hasModified.updated',false);
        map.removeInteraction(interaction.modify);
        map.removeInteraction(interaction.select);
        vectorLayer.getSource().getFeatures().map(function(item){
            item.setStyle();
        });
    };
    /*移除当前特征属性*/
    this.removeProps = key=>{
        var features = interaction.select.getFeatures();
        features.item(0).unset(key);
        var t = features.item(0).getProperties();
        delete t.geometry;
        $rootScope.$broadcast('featureProps.updated',t);
    };
    /*更新属性*/
    this.updateProps =(props)=>{
        var features = interaction.select.getFeatures();
        features.item(0).setProperties({
            [props.k]:props.v
        });
        var t = features.item(0).getProperties();
        delete t.geometry;
        $rootScope.$broadcast('featureProps.updated',t);
        $rootScope.$broadcast('featureProps.updated',t);
    };
    /*获取要保存的特征属性*/
    this.getFeatureToSave = ()=>{
        /*获取当前选中的特征数据*/
        var f = new ol.format.GeoJSON();
        var feature = interaction.select.getFeatures();
        return f.writeFeature(feature.item(0));
    };
    
    var curerntFeatureID = -1;
    /*获取要删除的特征属性*/
    this.getIdOfFeatureToDelete = ()=>{
        /*获取当前选中的特征数据*/
        var f = new ol.format.GeoJSON();
        var feature = interaction.select.getFeatures();
        curerntFeatureID = feature.item(0).getId();
        return curerntFeatureID;
    };
    this.deleteFeature = ()=>{
        vectorLayer.getSource().removeFeature(vectorSource.getFeatureById(curerntFeatureID));
        var feature = interaction.select.getFeatures();
        feature.item(0).setStyle(delectedStyle);
        curerntFeatureID = -1;
    }
    this.toggleTilelayer = function(flag){
        tileLayer.setVisible(flag);
    };
}
mapService.$inject = ['$rootScope'];
export default mapService;
