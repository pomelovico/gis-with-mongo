/**
 * Created by LikoLu on 2016/5/4.
 */

function myEditPropsGroup(gisData,$timeout,$rootScope){
    return {
        restrict:"EA",
        scope:{
            key:'@key',
            val:'@val',
            info:'=alertinfo'
        },
        template:"<span href='' class='icon-edit edit-item ' ng-click='editProp()'></span> " +
        "<span href='' class='icon-trash delete edit-item' ng-click='confirmDeleteProps()' ></span>",
        link:function(scope,element,attrs){
            scope.editProp = ()=>{
                // console.log(scope);
                scope.$emit('currentProp.updated',{k:scope.key,v:scope.val});
                scope.$emit('isEditingProp.updated',true);
                scope.$emit('isAddingProp.updated',false);

            };
            scope.confirmDeleteProps = ()=>{
                scope.info = '确认移除此属性？';
                angular.element('#removePropModal').modal('show');
                scope.$emit('currentProp.updated',{k:scope.key,v:scope.val});
            };
            scope.$on('props.removed',()=>{
                $timeout(()=>{
                    angular.element('#removePropModal').modal('hide');
                    scope.$emit('currentProp.updated',{k:'',v:''});
                },100);
            });
        },
        transclude: true
    }
}
myEditPropsGroup.$inject = ['gisData','$timeout','$rootScope'];
export default myEditPropsGroup;