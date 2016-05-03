/**
 * Created by LikoLu on 2016/5/3.
 */

function mapService(){
    var features,
        vectorSource,
        vectorLayer;
    /*Tile预渲染层*/
    var tileLayer = new ol.layer.Tile({
        source: new ol.source.OSM(),
        visible:true,
        preload:0
    });
    /*popover popOverlayer*/
    var popOverlayer = new ol.Overlay(({
        id: 1,
        element: document.getElementById('popup'),
        autoPan: true,
        autoPanAnimation: {
            duration: 250
        }
    }));
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
    var map = {};
    /*绘制*/
    this.drawMap = (mapdata)=>{
        /*数据源特征*/
        features = (new ol.format.GeoJSON()).readFeatures(mapdata);
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
            overlays:[
                popOverlayer
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
}

export default mapService;
