/**
 * Created by Vico on 2016.05.02.
 */

function myConfirmDel(gisData,$timeout){
    return {
        restrict:"EA",
        scope:{
            id:'@id',
            info:'=info',
            curID: '=curid'
        },
        template:"<button class='btn btn-danger delete-confirm' title='del' ng-click='del()'><i class='icon-trash'></i> </button>",
        link:function(scope,element,attrs){
            scope.del = ()=>{
                scope.info = '确认删除？';
                scope.curID = scope.id;
                angular.element('#confirmModal').modal('show');
            };
            
            scope.$on('gisdata.isdeleting',()=>{
                scope.info = '删除中，请稍后...';
            });
            scope.$on('gisdata.deleted',()=>{
                scope.info = '删除成功';
                scope.curID = scope.id;
                $timeout(()=>{
                    angular.element('#confirmModal').modal('hide');
                },1500);
            });
            scope.$on('gisdata.fail',()=>{
                scope.info = '删除失败,请重试';
                $timeout(()=>{
                    angular.element('#confirmModal').modal('hide');
                },1500);
            });
        },
        transclude: true
    }
}
myConfirmDel.$inject = ['gisData','$timeout'];
export default myConfirmDel;