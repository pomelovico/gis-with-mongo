/**
 * Created by Vico on 2016.05.02.
 */
import {tmpls} from '../directives';
function confirmDelete(gisData){
    return {
        restrict:"A",
        link:function(scope,element,attrs){
            element.bind('click',function(e){

            });
        }
    }
}
confirmDelete.$inject = ['gisData'];
export default confirmDelete;