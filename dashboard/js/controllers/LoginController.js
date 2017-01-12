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

    $scope.request = {
        // userName:'ali1429',
        // password:'Qaz111',
        userName:'',
        password:'',
    };

    $scope.login = function(){
        //TODO: static login
        // $state.go('dashboard');

        $http.post( $rootScope.settings.api + '/user/login',$scope.request).success(function(json){
            
            if(json.errorMsg){
                toastr["warning"](json.errorMsg,"");
                return;
            }

            if(json.token){
                toastr["success"]('登录成功',"");

                $rootScope.token = json.token;
                window.localStorage.setItem('t',json.token);
                
                $state.go('dashboard');
            }

        })
    }


    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

}]);