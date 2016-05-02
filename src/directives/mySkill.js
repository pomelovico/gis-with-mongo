/**
 * Created by LikoLu on 2016/4/26.
 */
function mySkill(){
    return {
        restrict:'E',
        scope:{
            skill:'='
        },
        template:'<div><h4>{{skill.name}}</h4><p>{{skill.notes}}</p></div>'
    }
}
export default mySkill;