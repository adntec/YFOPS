/***
Sean AngularJS App Main Script
***/

/* Sean App */
var SeanApp = angular.module("SeanApp", [
    "ui.router", 
    "ui.bootstrap", 
    "oc.lazyLoad",  
    "ngSanitize",
    'ngValidate'
]); 

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
SeanApp.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        // global configs go here
    });
}]);

/*Content-Type application/json*/
SeanApp.config(['$httpProvider', function($httpProvider){
    $httpProvider.interceptors.push("$httpInterceptor");
}]);

//AngularJS v1.3.x workaround for old style controller declarition in HTML
SeanApp.config(['$controllerProvider', function($controllerProvider) {
  // this option might be handy for migrating old apps, but please don't use it
  // in new ones!
  $controllerProvider.allowGlobals();
}]);

/********************************************
 END: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/

/* Setup global settings */
SeanApp.factory('settings', ['$rootScope', function($rootScope) {
    // supported languages
    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar menu state
            pageContentWhite: true, // set page content layout
            pageBodySolid: false, // solid body color state
            pageAutoScrollOnLoad: 1000, // auto scroll to top on page load
            hideSidebar: true,
            setFullscreen: false,
            setDeviceButton:false,
            setLabButton:false,
        },
        assetsPath: '../assets',
        globalPath: '../assets/global',
        layoutPath: '../assets/layouts/layout',
        api:'http://127.0.0.1:8085',
        // api:'http://10.178.188.193:8085',
        version:'0.5.2',
        debug: {
            request:false,
            requestError:false,
            response:false,
            responseError:false
        }
    };

    $rootScope.settings = settings; 
    return settings;
}]);


/*HttpInterceptor Factory*/
SeanApp.factory("$httpInterceptor",["$q", "$rootScope", function($q, $rootScope) {
    return {
        request: function(json) {
            if($rootScope.settings.debug.request){
                console.log("[request]:"+json.url);
            }

            json.headers['Content-Type'] = 'application/json;charset=utf-8';
            json.headers['Cache-Control'] = 'no-cache';
            json.headers['Pragma'] = 'no-cache';
            json.headers['Authorization'] = $rootScope.token || window.localStorage.getItem('t') || '';

            $rootScope.$broadcast('$onSubmit');

            return json || $q.when(json);
        },
    　　 requestError: function(json) {
            if($rootScope.settings.debug.requestError){
                console.log("[requestError]:" + json.status);
            }
            
    　　　　 return $q.reject(json)
    　　 },
        response: function(json) {
            $rootScope.$broadcast('$onSubmitSuccess');
            
            if($rootScope.settings.debug.response){
                console.log("[response]:"+json.status+","+json.config.url);
            }
            // console.log(json);
            // if(angular.isDefined(json.data.errorMsg) && json.data.errorMsg != "" && json.data.errorMsg != null){
            //     // toastr.clear()
            //     console.log(json.data.errorMsg,"");
            //     window.location.href = "#/login";
            //     return;
            // }
            
            return json || $q.when(json);
        },
        responseError : function(json) {
            $rootScope.$broadcast('$onSubmitSuccess');
            
            // window.location.href = "#/login";
            return $q.reject(json);

            if($rootScope.settings.debug.responseError){
                console.log("[responseError]:"+JSON.stringify(json));
            }

            return $q.reject(json);
        }
    };
}]);

SeanApp.directive('onRepeatFinished', ['$timeout',function($timeout) {
    return {
        restrict: 'A',
        link: function(scope) {
            if (scope.$last === true) {
                $timeout(function() {
                    scope.$emit('ngRepeatFinished');
                });
            }
        }
    };
}]);
/* Setup App Main Controller */
SeanApp.controller('AppController', ['$scope', function($scope) {
    $scope.$on('$viewContentLoaded', function() {
        App.initComponents(); // init core components
        // Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive 
    });
}]);

/***
Layout Partials.
By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial 
initialization can be disabled and Layout.init() should be called on page load complete as explained above.
***/

/* Setup Layout Part - Header */
SeanApp.controller('HeaderController', ['$rootScope','$scope','$http','$state', function($rootScope,$scope,$http,$state) {
    $scope.$on('$includeContentLoaded', function() {
        // Layout.initHeader(); // init header
        initNavigation();

    });

    var initNavigation = function(){
        setTimeout(function(){
            $('.dropdown').click(function(){
                $('.dropdown.active').removeClass('open').removeClass('active');
                $(this).addClass('open').addClass('active');
            })

            $('.dropdown-menu.dropdown-menu-fw li').click(function(){
                $('.dropdown li').removeClass('active');
                $(this).addClass('active');
            })

            // $('.dropdown').eq(0).click();
        },500);
   }

   $rootScope.date = '2016年13月';
   $http.get($rootScope.settings.api + "/queryDate").success(function(json){
        $rootScope.date = json.date;
   })

   $scope.selectPBU = function(pbuCodeShortName,$event){
        $rootScope.pbuCodeShortName = pbuCodeShortName;
        $rootScope.$broadcast('onSelectedPBU',pbuCodeShortName);
   }

}]);

/* Setup Layout Part - Footer */
SeanApp.controller('FooterController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        // Layout.initFooter(); // init footer
    });
}]);

/* Setup Rounting For All Pages */
SeanApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

    var jsPath = '../dashboard/js/';
    // var jsPath = '../plugins';

    $urlRouterProvider.otherwise("/dashboard");  
    
    $stateProvider
        // Dashboard
        .state('chart', {
            url: "/chart",
            templateProvider: ['$templateCache',function($templateCache){ 
                return $templateCache.get('views/chart.html');
            }],

            data: {pageTitle: 'chart'},
            controller: "ChartController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'SeanApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [

                            './js/theme/chartOptions.js',
                            '../assets/global/plugins/echarts/echarts.js'
                        ] 
                    })
                }]
            }
        })

        // Material
        .state('dashboard', {
            url: "/dashboard",
            templateProvider: ['$templateCache',function($templateCache){ 
                return $templateCache.get('views/dashboard.html');
            }],

            data: {pageTitle: 'Material'},
            controller: "DashboardController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'SeanApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/mapplic/mapplic/mapplic.css',
                            '../assets/global/plugins/mapplic/js/hammer.min.js',
                            '../assets/global/plugins/mapplic/js/jquery.mousewheel.js',
                            '../assets/global/plugins/mapplic/js/jquery.easing.js',
                            '../assets/global/plugins/mapplic/mapplic/mapplic.js',
                            '../assets/global/plugins/jquery.sparkline.min.js',

                            './js/theme/chartOptions.js',
                            '../assets/global/plugins/echarts/echarts.js',
                            './js/json/overviewData.js',
                            './js/json/queryBuList.js'
                        ] 
                    })
                }]
            }
        })
        // Material Search
        .state('financeSearch', {
            url: "/finance/:id",
            templateProvider: ['$templateCache',function($templateCache){ 
                return $templateCache.get('views/dashboard.html');
            }],

            data: {pageTitle: 'Material'},
            controller: "DashboardController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'SeanApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/mapplic/mapplic/mapplic.css',
                            '../assets/global/plugins/mapplic/js/hammer.min.js',
                            '../assets/global/plugins/mapplic/js/jquery.mousewheel.js',
                            '../assets/global/plugins/mapplic/js/jquery.easing.js',
                            '../assets/global/plugins/mapplic/mapplic/mapplic.js',
                            '../assets/global/plugins/jquery.sparkline.min.js',

                            './js/theme/chartOptions.js',
                            '../assets/global/plugins/echarts/echarts.js',
                            './js/json/overviewData.js',
                            './js/json/queryBuList.js'
                        ] 
                    })
                }]
            }
        })

        // factory
        .state('factory', {
            url: "/factory",
            templateProvider: ['$templateCache',function($templateCache){ 
                return $templateCache.get('views/factory.html');
            }],

            data: {pageTitle: 'Material'},
            controller: "FactoryController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'SeanApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [

                            '../assets/global/plugins/echarts/echarts.js',
                            './js/json/buData.js',
                            './js/json/queryBuList.js'
                        ] 
                    })
                }]
            }
        })

        // BBP
        .state('BBPOverview', {
            url: "/BBPOverview",
            templateProvider: ['$templateCache',function($templateCache){ 
                return $templateCache.get('views/BBPOverview.html');
            }],

            data: {pageTitle: 'BBP-CC'},
            controller: "BBPOverviewController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'SeanApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/mapplic/mapplic/mapplic.css',
                            '../assets/global/plugins/mapplic/js/hammer.min.js',
                            '../assets/global/plugins/mapplic/js/jquery.mousewheel.js',
                            '../assets/global/plugins/mapplic/js/jquery.easing.js',
                            '../assets/global/plugins/mapplic/mapplic/mapplic.js',
                            '../assets/global/plugins/jquery.sparkline.min.js',

                            './js/theme/chartOptions.js',
                            '../assets/global/plugins/echarts/echarts.js',
                            './js/json/bbpQueryOverviewData.js',
                            './js/json/queryFilter.js',
                            './js/json/queryBuList.js'
                        ] 
                    })
                }]
            }
        })

        // BBPSearch
        .state('BBPSearch', {
            url: "/bbp/:id",
            templateProvider: ['$templateCache',function($templateCache){ 
                return $templateCache.get('views/BBPOverview.html');
            }],

            data: {pageTitle: 'BBP-CC'},
            controller: "BBPOverviewController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'SeanApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/mapplic/mapplic/mapplic.css',
                            '../assets/global/plugins/mapplic/js/hammer.min.js',
                            '../assets/global/plugins/mapplic/js/jquery.mousewheel.js',
                            '../assets/global/plugins/mapplic/js/jquery.easing.js',
                            '../assets/global/plugins/mapplic/mapplic/mapplic.js',
                            '../assets/global/plugins/jquery.sparkline.min.js',

                            './js/theme/chartOptions.js',
                            '../assets/global/plugins/echarts/echarts.js',
                            './js/json/bbpQueryOverviewData.js',
                            './js/json/queryFilter.js',
                            './js/json/queryBuList.js'
                        ] 
                    })
                }]
            }
        })

        // BBP
        .state('BBPFactory', {
            url: "/BBPFactory",
            templateProvider: ['$templateCache',function($templateCache){ 
                return $templateCache.get('views/BBPFactory.html');
            }],

            data: {pageTitle: 'BBP-CC'},
            controller: "BBPFactoryController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'SeanApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/echarts/echarts.js',
                            './js/json/bbpQueryFactoryData.js',
                            './js/json/queryFilter.js'
                        ] 
                    })
                }]
            }
        })

        // HR
        .state('HROverview', {
            url: "/HROverview",
            templateProvider: ['$templateCache',function($templateCache){ 
                return $templateCache.get('views/HROverview.html');
            }],

            data: {pageTitle: 'BBP-LH'},
            controller: "HROverviewController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'SeanApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [

                            '../assets/global/plugins/mapplic/mapplic/mapplic.css',
                            '../assets/global/plugins/mapplic/js/hammer.min.js',
                            '../assets/global/plugins/mapplic/js/jquery.mousewheel.js',
                            '../assets/global/plugins/mapplic/js/jquery.easing.js',
                            '../assets/global/plugins/mapplic/mapplic/mapplic.js',
                            '../assets/global/plugins/jquery.sparkline.min.js',

                            './js/theme/chartOptions.js',
                            '../assets/global/plugins/echarts/echarts.js',
                            './js/json/hrQueryOverviewData.js',
                            './js/json/hrQueryFilter.js',
                            './js/json/queryBuList.js'
                        ] 
                    })
                }]
            }
        })

        // HRSearch
        .state('HRSearch', {
            url: "/hr/:id",
            templateProvider: ['$templateCache',function($templateCache){ 
                return $templateCache.get('views/HROverview.html');
            }],

            data: {pageTitle: 'BBP-LH'},
            controller: "HROverviewController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'SeanApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/mapplic/mapplic/mapplic.css',
                            '../assets/global/plugins/mapplic/js/hammer.min.js',
                            '../assets/global/plugins/mapplic/js/jquery.mousewheel.js',
                            '../assets/global/plugins/mapplic/js/jquery.easing.js',
                            '../assets/global/plugins/mapplic/mapplic/mapplic.js',
                            '../assets/global/plugins/jquery.sparkline.min.js',

                            './js/theme/chartOptions.js',
                            '../assets/global/plugins/echarts/echarts.js',
                            './js/json/hrQueryOverviewData.js',
                            './js/json/hrQueryFilter.js',
                            './js/json/queryBuList.js'
                        ] 
                    })
                }]
            }
        })

        // HR
        .state('HRFactory', {
            url: "/HRFactory",
            templateProvider: ['$templateCache',function($templateCache){ 
                return $templateCache.get('views/HRFactory.html');
            }],

            data: {pageTitle: 'BBP-LH'},
            controller: "HRFactoryController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'SeanApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/echarts/echarts.js',
                            './js/json/hrQueryFactoryData.js',
                            './js/json/hrQueryFilter.js',
                        ] 
                    })
                }]
            }
        })

        // Other
        .state('OtherOverview', {
            url: "/OtherOverview",
            templateProvider: ['$templateCache',function($templateCache){ 
                return $templateCache.get('views/OtherOverview.html');
            }],

            data: {pageTitle: 'Other'},
            controller: "OtherOverviewController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'SeanApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [

                            '../assets/global/plugins/mapplic/mapplic/mapplic.css',
                            '../assets/global/plugins/mapplic/js/hammer.min.js',
                            '../assets/global/plugins/mapplic/js/jquery.mousewheel.js',
                            '../assets/global/plugins/mapplic/js/jquery.easing.js',
                            '../assets/global/plugins/mapplic/mapplic/mapplic.js',
                            '../assets/global/plugins/jquery.sparkline.min.js',

                            './js/theme/chartOptions.js',
                            '../assets/global/plugins/echarts/echarts.js',
                            './js/json/otherQueryOverviewData.js', 
                            './js/json/queryBuList.js'
                        ] 
                    })
                }]
            }
        })

        // HRSearch
        .state('OtherSearch', {
            url: "/other/:id",
            templateProvider: ['$templateCache',function($templateCache){ 
                return $templateCache.get('views/OtherOverview.html');
            }],

            data: {pageTitle: 'Other'},
            controller: "OtherOverviewController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'SeanApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/mapplic/mapplic/mapplic.css',
                            '../assets/global/plugins/mapplic/js/hammer.min.js',
                            '../assets/global/plugins/mapplic/js/jquery.mousewheel.js',
                            '../assets/global/plugins/mapplic/js/jquery.easing.js',
                            '../assets/global/plugins/mapplic/mapplic/mapplic.js',
                            '../assets/global/plugins/jquery.sparkline.min.js',

                            './js/theme/chartOptions.js',
                            '../assets/global/plugins/echarts/echarts.js',
                            './js/json/otherQueryOverviewData.js',
                            './js/json/queryBuList.js'
                        ] 
                    })
                }]
            }
        })

        // Other
        .state('OtherFactory', {
            url: "/OtherFactory",
            templateProvider: ['$templateCache',function($templateCache){ 
                return $templateCache.get('views/OtherFactory.html');
            }],

            data: {pageTitle: 'Other'},
            controller: "OtherFactoryController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'SeanApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/echarts/echarts.js',
                            './js/json/otherQueryFactoryData.js',
                        ] 
                    })
                }]
            }
        })

        .state('login', {
            url: "/login",
            templateProvider: ['$templateCache',function($templateCache){ 
                return $templateCache.get('views/login.html');
            }],

            data: {pageTitle: 'OPS Login'},
            controller: "LoginController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'SeanApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/pages/css/login-4.min.css',
                            '../assets/global/plugins/backstretch/jquery.backstretch.min.js'
                        ] 
                    })
                }]
            }
        })

        

}]);

/* Init global settings and run the app */
SeanApp.run(["$rootScope", "settings", "$state", "$http", "$interval", function($rootScope, settings, $state,$http,$interval) {
    // var timer = $interval(function(){
    //     $rootScope.time = moment().format('YYYY年 MM月D日 HH:mm:ss');
    // },1000);
    

    $rootScope.$state = $state; // state to be accessed from view
    $rootScope.$settings = settings; // state to be accessed from view

    toastr.options = {
      "closeButton": true,
      "debug": false,
      "positionClass": "toast-top-center",
      "onclick": null,
      "showDuration": "3000",
      "hideDuration": "3000",
      "timeOut": "3000",
      "extendedTimeOut": "3000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    };
        
}]);
/***
GLobal Directives
***/

// Route State Load Spinner(used on page or content load)
SeanApp.directive('ngSpinnerBar', ['$rootScope','$http','$state',
    function($rootScope,$http,$state) {
        return {
            link: function(scope, element, attrs) {
                // by defult hide the spinner bar
                element.addClass('hide'); // hide spinner bar by default

                $rootScope.$on('$onSubmit', function() {
                    //console.log('show');
                    element.removeClass('hide');
                });
                
                $rootScope.$on('$onSubmitSuccess', function() {
                    //console.log('hide');
                    element.addClass('hide');
                });

                // display the spinner bar whenever the route changes(the content part started loading)
                $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

                    element.removeClass('hide'); // show spinner bar
                    // $('body').addClass('page-on-load');
                        
                    if(toState.name=='login') return;

                });

                // hide the spinner bar on rounte change success(after the content loaded)
                $rootScope.$on('$stateChangeSuccess', function() {

                    element.addClass('hide'); // hide spinner bar
                    $('body').removeClass('page-on-load'); // remove page loading indicator
                    // Layout.setSidebarMenuActiveLink('match'); // activate selected link in the sidebar menu
                    
                    //login view
                    if($rootScope.$state.current.name === 'login'){
                        $rootScope.loginPage = true;
                        $('body').addClass('login');
                        $('#ui_container').removeClass('page-content').removeAttr('style');//.appendTo($('body'));
                        
                        return;
                    }else{
                        $rootScope.loginPage = false; 
                        $rootScope.chartPage = false;
                        $('body').removeClass('login');
                        $('#ui_container').addClass('page-content');
                        $('.backstretch').remove();

                        if($rootScope.$state.current.name === 'chart'){ 
                            $rootScope.chartPage = true;
                        }
                    }
                   
                    // auto scorll to page top
                    // setTimeout(function () {
                    //     App.scrollTop(); // scroll to the top on content load
                    // }, $rootScope.settings.layout.pageAutoScrollOnLoad);     
                });

                // handle errors
                $rootScope.$on('$stateNotFound', function() {
                    element.addClass('hide'); // hide spinner bar
                });

                // handle errors
                $rootScope.$on('$stateChangeError', function() {
                    element.addClass('hide'); // hide spinner bar
                });
            }
        };
    }
])

// Handle global LINK click
SeanApp.directive('a', function() {
    return {
        restrict: 'E',
        link: function(scope, elem, attrs) {
            if (attrs.ngClick || attrs.href === '' || attrs.href === '#') {
                elem.on('click', function(e) {
                    e.preventDefault(); // prevent link click for above criteria
                });
            }
        }
    };
});
