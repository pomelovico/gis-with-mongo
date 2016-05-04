/**
 * Created by LikoLu on 2016/5/3.
 */
function mySelectBtn($timeout){
    return {
        restrict:'E',
        transclude:true,
        scope:{},
        template:"<div> " +
        "<button class='btn btn-primary openfile-btn' type='button' ng-click='openFile()'><div ng-transclude></div></button> " +
        "<span class='filename' ng-bind='fileName'></span>",
        link:(scope,element,attrs)=>{
            let node = document.getElementById(attrs.filetype);
            node.addEventListener('change',e=>{
                scope.$apply(()=>{
                    scope.fileName = e.target.files[0].name;
                });
            });
            scope.openFile = ()=>{
                $timeout(()=>node.click(),0);
            }
        }
    }
}
mySelectBtn.$inject = ['$timeout'];
export default mySelectBtn;