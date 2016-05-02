/**
 * Created by LikoLu on 2016/4/26.
 */
function myDate($timeout){
    return {
        restrict:'A',
        link:(scope,element,attrs)=>{
            var timeID;
            element.text(new Date());
            (function updateDate(){
                timeID = $timeout(()=>{
                    element.text(new Date());
                    updateDate();
                },1000);
            })();
            element.on('$destroy',()=>{
                $timeout.cancel(timeID);
            })
        },
        transclude: true
    }
}
myDate.$inject = ['$timeout'];
export default myDate;