/**
 * Created by LikoLu on 2016/5/3.
 */

function mapService($rootScope){
    var features,
        vectorSource,
        vectorLayer,
        map;
    /*Tile预渲染层*/
    var tileLayer = new ol.layer.Tile({
        source: new ol.source.OSM(),
        visible:true,
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
                $rootScope.$broadcast('gisPopOverlayer.updated');
                oldID = features[0].getId();
            }
        }else{
            $rootScope.$broadcast('outOfMap');
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
                // tileLayer,
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
    this.removeListenMouse = ()=>{
        oldID = -1;
        map.un('pointermove',pointermoveListener);
    }
}
mapService.$inject = ['$rootScope'];
export default mapService;
