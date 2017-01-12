;angular.module('SeanApp')
.controller('HRFactoryController',['$rootScope', '$scope','$http', '$timeout','$window','$state', function($rootScope, $scope, $http, $timeout,$window,$state) {

    var widgetHeight;
    $scope.charts = new Array();
    $scope.option = new Array(); 
    $scope.$on('ngRepeatFinished', function(repeatFinishedEvent) {
       
        
    });
    
    $scope.$on('$viewContentLoaded', function() {
        
        $('.portlet .fa-download,.portlet .fa-search-plus').bind('click',function(){
            var id = $(this).parents('.portlet').find('.ops-chart').attr('id');
            var title = $(this).parents('.portlet').find('.caption-subject').html(); 
            
            window.localStorage.setItem('chartOption',JSON.stringify($scope.option[id]));
            window.localStorage.setItem('title',title);

            $state.go('chart');

        });

        initWidgetHeight();
        $scope.getfilterList();

        $scope.timer = $timeout(function(){
            $scope.timeout = null;
            angular.element($window).bind('resize', function() {
                $scope.timeout = $timeout(function(){
                    $scope.initEchart($scope.overviewData);
                    $timeout.cancel( $scope.timeout);
                },300);
            })
        },600);

        $scope.$on("$destroy",function( event ) {
                $timeout.cancel( $scope.timer );
                angular.element($window).unbind('resize');
            }
        );
        
    });


    var initWidgetHeight = function(){
        var height = $(window).height() - 63.99 - 77.78 -18.89-50;
        $('.page-content').css('min-height',height);

        widgetHeight = (height -77.8 -60) / 2 -20;
        $('.yfops-widget').css('min-height',widgetHeight);
    }


    //单轴
    var trendOption1 = {
        tooltip: {
            trigger: 'axis'
        },

        legend: {
            bottom:48,
            // data:['Inventory','OBP Inventory','Actual days','T3 days']
        },
        grid:{
            show:false,
            x:40,
            y:10,
            x2:30,
            y2:98
        },
        xAxis: [
            {
                type: 'category',
                // data: ['2016-1','2016-2','2016-3','2016-4','2016-5','2016-6','2016-7','2016-8','2016-9','2016-10','2016-11','2016-12']
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '',
                // min: 0,
                // max: 250,
                // interval: 50,
                axisLabel: {
                    formatter: function(value){
                        return value;
                    }
                }
            }
        ],
        series: [
        ],
        dataZoom:[
            {
                start: 50,
                end: 100,
                handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                handleSize: '60%',
                handleStyle: {
                    color: '#fff',
                    shadowBlur: 3,
                    shadowColor: 'rgba(0, 0, 0, 0.6)',
                    shadowOffsetX: 2,
                    shadowOffsetY: 2
                },
                textStyle:{
                    color:'#fff'
                }
            }
        ]
    };

    //双轴
    var trendOption2 = {
        tooltip: {
            trigger: 'axis'
        },

        legend: {
            bottom:48,
            // data:['Inventory','OBP Inventory','Actual days','T3 days']
        },
        grid:{
            show:false,
            x:40,
            y:10,
            x2:30,
            y2:148
        },
        xAxis: [
            {
                type: 'category',
                axisLabel: {
                    interval:0,
                    rotate:45,
                    margin:6,
                },
                // data: ['2016-1','2016-2','2016-3','2016-4','2016-5','2016-6','2016-7','2016-8','2016-9','2016-10','2016-11','2016-12']
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '',
                axisLabel: {
                    formatter: function(value){
                        return value;
                    }
                }
            }
        ],
        series: [
          
        ],
        dataZoom:[
            {
                start: 0,
                end: 100,
                handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                handleSize: '60%',
                handleStyle: {
                    color: '#fff',
                    shadowBlur: 3,
                    shadowColor: 'rgba(0, 0, 0, 0.6)',
                    shadowOffsetX: 2,
                    shadowOffsetY: 2
                },
                textStyle:{
                    color:'#fff'
                }
            }
        ]
    };

    var ageOption = {
        tooltip: {
            trigger: 'axis'
        },

        legend: {
            bottom:48,
            // data:['x<=1','1<x<=7','7<x<=30','x>30']
        },
        grid:{
            show:false,
            x:38,
            y:26,
            x2:20,
            y2:128
        },
        xAxis: [
            {
                type: 'category',
                // data: ['2016-1','2016-2','2016-3','2016-4','2016-5','2016-6','2016-7','2016-8','2016-9','2016-10','2016-11','2016-12']
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '',
                interval: 20,
                axisLabel: {
                    formatter: '{value}'
                }
            }
        ],
        series: [
            
        ],
        
        dataZoom:[
            {
                start: 0,
                end: 100,
                handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                handleSize: '60%',
                handleStyle: {
                    color: '#fff',
                    shadowBlur: 3,
                    shadowColor: 'rgba(0, 0, 0, 0.6)',
                    shadowOffsetX: 2,
                    shadowOffsetY: 2
                },
                textStyle:{
                    color:'#fff'
                }
            }
        ]
    };


    $scope.initEchart = function(data){

        if(!data || data == undefined){
            return;
        }
        
        try{
            $scope.title1 = data.totalLaborHoursDivideEQU[0].lable;
            $scope.getBarLineChart(data.totalLaborHoursDivideEQU, 'chart1',trendOption2);
        }catch(e){

        }
        

    };

    // $scope.initializeChartSize = function() {
    //     $timeout.cancel($scope.layout);
    //     $scope.layout = $timeout(function(){
    //         initEchart($scope.overviewData);
    //     },80);
    // };

    $scope.getfilterList = function(){
        
        ///////真数据
        $http.get($rootScope.settings.api + '/hr/queryFilter').success(function(json){
            
            $scope.filterListObject = json.filterList;
            $scope.getfilterListSuccess($scope.filterListObject);

        }).error(function(){

            toastr["warning"]("/hr/queryFilter error","");
            ///////假数据
            $scope.filterListObject = hrQueryFilter.filterList;
            $scope.getfilterListSuccess($scope.filterListObject);
        });
    }

    $scope.getfilterListSuccess = function(list){

        $scope.filterList = new Array();
        for(var i=0;i<list.length;i++){
            
            $scope.filterList.push(list[i].businessCat3);

        }
        $scope.setFilter($scope.currentFilter || $scope.filterList[0]);
    }

    $scope.setFilter = function(filter){

        $scope.currentFilter = filter;
        $scope.getOverviewData($rootScope.buCodeShortName, $scope.currentFilter);
    };

    $scope.$on('onSelectedPBU', function(scope,buShortName){
        window.location.href = "#/HROverview";
    });

    $scope.getOverviewData = function(entityName,costType){
        
        var param = {
           "entityName":entityName  || 'JIT PBU',
           "costType":costType
        };

        $http.post($rootScope.settings.api + '/hr/queryFactoryData' , param).success(function(json){
            
            $scope.overviewData = json;
            $scope.initEchart($scope.overviewData);

        }).error(function(){
            ////假数据
            $scope.overviewData = hrQueryFactoryData;
            $scope.initEchart($scope.overviewData);
        });
        
    }

    $scope.getBarLineChart = function(data, chart,option){
        //x
        var xAxisObject = new Object();
        var typeObject = new Object();
        for(var i=0; i < data.length; i++){
            var item = data[i];
            if(xAxisObject[item.xAxisValue] == undefined){
                xAxisObject[item.xAxisValue] = new Object();
                typeObject[item.xAxisValue] = new Object();
            }

            xAxisObject[item.xAxisValue][item.yAxisLabel] = data[i].yAxisValue;
            typeObject[item.xAxisValue][item.yAxisLabel] = data[i].axisNo; //TODO
        }

        var xAxisData = Object.getOwnPropertyNames(xAxisObject);

        var series = new Array();
        var legend = Object.getOwnPropertyNames(xAxisObject[xAxisData[0]]);

        for(var i=0; i < xAxisData.length; i++){

            for(var j=0; j<legend.length; j++){
                
                if( series[j] == undefined){
                    series[j] = new Object();
                    series[j].name = legend[j];
                    series[j].type = 'line';
                    // series[j].stack = stack;
                    series[j].data = new Array();

                    
                }

                // if(legend[j].indexOf('Actual') != -1) {
                //     series[j].type = 'bar';
                // }else{
                //     series[j].type = 'line';
                // }

                if(typeObject[xAxisData[i]][legend[j]] ==1){
                    series[j].type = 'line';
                }else if(typeObject[xAxisData[i]][legend[j]] ==0){
                    series[j].type = 'bar';
                }

                series[j].data.push(xAxisObject[xAxisData[i]][legend[j]] || 0);
            }
        }

        //set chart option
        $scope.option[chart] = angular.copy(option);
        $scope.option[chart].legend.data = legend;
        //默认勾选T2 ACTUAL
        $scope.option[chart].legend.selected = new Object();
        for(var i=0;i<legend.length;i++){
            $scope.option[chart].legend.selected[legend[i]] = false;
            if(legend[i].indexOf('T2') != -1 || legend[i].indexOf('Act')!= -1 || legend[i].indexOf('BM')!= -1){
                $scope.option[chart].legend.selected[legend[i]] = true;
            }
        }
        $scope.option[chart].yAxis[0].name = data[0].unit != undefined ?  "("+data[0].unit+")" : '';
        $scope.option[chart].xAxis[0].data = xAxisData;
        $scope.option[chart].series = series;

        $scope.charts[chart] = echarts.init(document.getElementById(chart),theme);
        $scope.charts[chart].setOption($scope.option[chart]);
    }

    $scope.getMixBarChart = function(data,chart,option){

        //x
        var xAxisObject = new Object();
        var typeObject = new Object();
        for(var i=0; i < data.length; i++){
            var item = data[i];
            if(xAxisObject[item.xAxisValue] == undefined){
                xAxisObject[item.xAxisValue] = new Object();
                typeObject[item.xAxisValue] = new Object();
            }

            xAxisObject[item.xAxisValue][item.yAxisLabel] = data[i].yAxisValue*100;
            typeObject[item.xAxisValue][item.yAxisLabel] = data[i].axisNo; //TODO
        }

        var xAxisData = Object.getOwnPropertyNames(xAxisObject);
        //y
        var stack = data[0].lable;
        var series = new Array();
        var legend = Object.getOwnPropertyNames(xAxisObject[xAxisData[0]]);  //顺序问题
        // var legend = ['x<=1','1<x<=7','7<x<=30','x>30'];

        for(var i=0; i < xAxisData.length; i++){

            for(var j=0; j<legend.length; j++){
                
                if( series[j] == undefined){
                    series[j] = new Object();
                    series[j].name = legend[j];
                    series[j].type = 'bar';
                    series[j].stack = stack;
                    series[j].data = new Array();
                }

                if(typeObject[xAxisData[i]][legend[j]] ==1){
                    series[j].type = 'line';
                }else if(typeObject[xAxisData[i]][legend[j]] ==0){
                    series[j].type = 'bar';
                }

                series[j].data.push(xAxisObject[xAxisData[i]][legend[j]] || 0);
            }
        }

        //set chart option
        $scope.option[chart] = angular.copy(option);
        $scope.option[chart].legend.data = legend;
        //默认勾选T2 ACTUAL
        $scope.option[chart].legend.selected = new Object();
        for(var i=0;i<legend.length;i++){
            _option.legend.selected[legend[i]] = false;
            if(legend[i].indexOf('T2') != -1 || legend[i].indexOf('Act')!= -1 || legend[i].indexOf('BM')!= -1){
                $scope.option[chart].legend.selected[legend[i]] = true;
            }
        }
        $scope.option[chart].xAxis[0].data = xAxisData;
        $scope.option[chart].series = series;

        $scope.charts[chart] = echarts.init(document.getElementById(chart),theme);
        $scope.charts[chart].setOption($scope.option[chart]);
    }


    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

}]);