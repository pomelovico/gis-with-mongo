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
            var modalID = '#removePropModal';
            element.on('click',()=>{
                switch(attrs.type){
                    case 'addProp':
                        scope.$emit('isEditingProp.updated',true);
                        scope.$emit('isAddingProp.updated',true);
                        scope.$emit('currentProp.updated',{k:'',v:''});
                        break;
                    case 'saveFeature':scope.featureMethod();break;
                    case 'deleteFeature':
                        scope.$emit('alertInfo.updated',{
                            info:'确定删除此特征？',
                            state:'toDelete'
                        });
                        angular.element('#removePropModal').modal('show');
                        break;
                }
            });
            scope.$on('feature.saved',()=>{
                scope.$emit('alertInfo.updated',{
                    info:'保存成功！',
                    state:'saved'
                });
                angular.element(modalID).modal('show');
                $timeout(()=>{
                    angular.element(modalID).modal('hide');
                },1000);
            });
            scope.$on('feature.deleted',()=>{
                scope.$emit('alertInfo.updated',{
                    info:'删除成功！',
                    state:'deleted'
                });
                scope.$emit('featureProps.updated',{});
                scope.$emit('hasSelected.updated',false);
                angular.element(modalID).modal('show');
                $timeout(()=>{
                    angular.element(modalID).modal('hide');
                },1000);
            });
        },
        transclude:true
    }
}
myEditFeatureGroup.$inject = ['$timeout'];
export default myEditFeatureGroup;