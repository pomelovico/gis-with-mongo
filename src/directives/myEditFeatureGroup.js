/**
 * Created by LikoLu on 2016/5/4.
 */
function myEditFeatureGroup ($timeout){
    return {
        restrict:"AE",
        scope:{
            featureMethod : "&method"
        },
        template:"<div ng-click='saveGis()'> <span ng-transclude ></span>  </div>",
        link:(scope,element,attrs)=>{
            element.on('click',()=>{
                switch(attrs.type){
                    case 'addProp':
                        scope.$emit('isEditingProp.updated',true);
                        scope.$emit('isAddingProp.updated',true);
                        break;
                    case 'saveFeature':scope.featureMethod();break;
                    case 'deleteFeature':
                        scope.$emit('alertInfo.updated','确定删除此特征？');
                        angular.element('#removePropModal').modal('show');
                        break;
                }
            });
            scope.$on('feature.saved',()=>{
                scope.$emit('alertInfo.updated','保存成功！');
                angular.element('#removePropModal').modal('show');
                $timeout(()=>{
                    angular.element('#removePropModal').modal('hide');
                },1000);
            });
            scope.$on('feature.deleted',()=>{
                scope.$emit('alertInfo.updated','删除成功！');
                angular.element('#removePropModal').modal('show');
                $timeout(()=>{
                    angular.element('#removePropModal').modal('hide');
                },1000);
            });
        },
        transclude:true
    }
}
myEditFeatureGroup.$inject = ['$timeout'];
export default myEditFeatureGroup;