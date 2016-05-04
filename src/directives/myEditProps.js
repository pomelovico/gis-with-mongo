/**
 * Created by LikoLu on 2016/5/4.
 */
function myEditProps(){
    return {
        restrict :"AE",
        scope:{
            type:'=type',
            update:'&updateProps'
        },
        link:(scope,element,attrs)=>{
            element.on('click',()=>{
                switch(attrs.type){
                    case 'ok':
                        scope.update();
                        break;
                    case 'cancle':
                        break;
                }
                scope.$emit('isEditingProp.updated',false);
                scope.$emit('isAddingProp.updated',false);
            });
        },
        transclude: true
    }
}
export default myEditProps;