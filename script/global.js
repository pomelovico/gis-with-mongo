/*全局变量*/

var gisApp = function(){
  /*视图*/
  this.view_panel = {};

  /*url参数*/
  this.urlParam = (function(){
    var arr = window.location.href.split("?");
    if(arr.length>1){
      arr = arr[1].split('&');
      var params = arr.map(function(value, key){
          var temp = value.split('=');
          return {
            param:temp[0],
            value:temp[1]
          }
        });
      return params;
    }else{
      return {};
    }
    })();

  /*从本地cookie中查询是否有用户信息*/
  var user_info = (function(){return;})();
  this.getUserInfo = function(param){
    return;
  };
  this.setUserInfo = function(param, value){

  };
}

gisApp.prototype.Ajax = function(options, callback){
  $.ajax({
    url:options['url'],
    type:'post',
    data:options['data'],
    dataType:'json',
    success:function(data){callback(data);},
    error:function(){callback(false);}
  });
};

gisApp.prototype.bindEvent = function(selector, type, callback){
  $(selector)[type](callback);
}

gisApp.prototype.getUrlParam = function(param){
  var len = this.urlParam.length;
  for(var i=0; i<len; i+=1){
    if(this.urlParam[i].param == param)
      return this.urlParam[i].value;
  }
  return '';
}