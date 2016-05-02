/**
 * Created by LikoLu on 2016/4/25.
 */
function myFooter(){
    return {
        restrict:"AE",
        template:"<p><div class='container' >Designed By {{author}}</div><p my-date style='font-size:12px;color:#ddd'>current time</p></p>"
    }
}
export default myFooter;