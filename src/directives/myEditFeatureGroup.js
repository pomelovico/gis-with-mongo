/**
 * Created by LikoLu on 2016/5/4.
 */
function myEditFeatureGroup (){
    return {
        restrict:"AE",
        scope:{
            
        },
        template:"<div ng-click='saveGis()'> <span ng-transclude ></span>  </div>",
        link:(scope,element,attrs)=>{
            element.on('click',()=>{
                switch(attrs.type){
                    case 'addProp':break;
                    case 'saveFeature':break;
                    case 'deleteFeature':break;
                }
            });
        },
        transclude:true
    }
}
export default myEditFeatureGroup;