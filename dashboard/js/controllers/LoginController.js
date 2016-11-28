;angular.module('SeanApp')
.controller('LoginController',['$rootScope', '$scope','$http', '$state','$window', function($rootScope, $scope, $http, $state,$window) {
    var widgetHeight;
    $scope.$on('$viewContentLoaded', function() {
        $.backstretch([
            "css/p8.jpg"
            ], {
              fade: 0,
              duration: 10000
            }
        );
    });

    $scope.request = {};

    $scope.login = function(){
        //TODO: static login
        $state.go('dashboard');

        $http.post( $rootScope.settings.api + '/user/login',$scope.request,function(json){
            console.log(json);

        })
    }


    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

}]);