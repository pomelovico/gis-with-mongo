/**
 * Created by LikoLu on 2016/4/25.
 */
function photos($http,$rootScope){
    this.Photos = {};

    $http.get('data/photos.json')
        .success((data)=>{
            this.Photos=data.ablums;
            $rootScope.$broadcast('ablums.updated');
        })
        .error((data)=>{console.log(data)});

    this.getPhotos = ()=>{
        return this.Photos;
    };
}
photos.$inject = ['$http','$rootScope'];
export default photos;