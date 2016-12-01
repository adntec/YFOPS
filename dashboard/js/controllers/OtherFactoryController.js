;angular.module('SeanApp')
.controller('OtherFactoryController',['$rootScope', '$scope','$http', '$timeout','$window', function($rootScope, $scope, $http, $timeout,$window) {

    var widgetHeight;
    $scope.$on('ngRepeatFinished', function(repeatFinishedEvent) {
       
        
    });
    
    $scope.$on('$viewContentLoaded', function() {
        
        angular.element('.fullscreen').bind('click', function() {
            initializeChartSize();
        })

        initWidgetHeight();
        // getfilterList();
        getOverviewData($rootScope.entityName || 'BU1');
        
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
            // {
            //     name:'Inventory',
            //     type:'bar',
            //     data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
            // },
            // {
            //     name:'OBP Inventory',
            //     type:'bar',
            //     data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
            // },
            // {
            //     name:'Actual days',
            //     type:'line',
            //     yAxisIndex: 1,
            //     data:[2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
            // },
            // {
            //     name:'T3 days',
            //     type:'line',
            //     yAxisIndex: 1,
            //     data:[4.0, 4.2, 4.3, 4.5, 4.3, 4.2, 4.3, 4.4, 4.0, 4.5, 4.0, 2.2]
            // }
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

            // ,
            // {
            //     type: 'value',
            //     name: '',
            //     // min: 0,
            //     // max: 25,
            //     // interval: 5,
            //     axisLabel: {
            //         formatter: '{value}'
            //     }
            // }
        ],
        series: [
            // {
            //     name:'Inventory',
            //     type:'bar',
            //     data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
            // },
            // {
            //     name:'OBP Inventory',
            //     type:'bar',
            //     data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
            // },
            // {
            //     name:'Actual days',
            //     type:'line',
            //     yAxisIndex: 1,
            //     data:[2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
            // },
            // {
            //     name:'T3 days',
            //     type:'line',
            //     yAxisIndex: 1,
            //     data:[4.0, 4.2, 4.3, 4.5, 4.3, 4.2, 4.3, 4.4, 4.0, 4.5, 4.0, 2.2]
            // }
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
            y:10,
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
            // {
            //     name:'x<=1',
            //     type:'bar',
            //     stack:'库龄',
            //     data:[30, 10, 20, 30, 30, 10, 20, 30,30, 10,30, 10]
            // },
            // {
            //     name:'1<x<=7',
            //     type:'bar',
            //     stack:'库龄',
            //     data:[20,30, 40, 10, 20, 30, 40, 10, 20, 30, 20, 30]
            // },
            // {
            //     name:'7<x<=30',
            //     type:'bar',
            //     stack:'库龄',
            //     data:[40, 50, 10, 10, 40, 50, 10, 10,40, 50,40, 50]
            // },
            // {
            //     name:'x>30',
            //     type:'bar',
            //     stack:'库龄',
            //     data:[10, 10, 30, 50, 10, 10, 30, 50,10, 10,10, 10]
            // }
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


    var initEchart = function(data){

        if(!data || data == undefined){
            return;
        }

        console.log(data);
        
        $scope.title1 = data.activeDimissionRate[0].lable;
        getBarLineChart(data.activeDimissionRate, 'chart1',trendOption2);

        $scope.title2 = data.mu[0].lable;
        getBarLineChartExtra(data.mu, 'chart2',trendOption2);

        $scope.title3 = data.personnelExpensesWithBU[0].lable;
        getBarLineChart(data.personnelExpensesWithBU, 'chart3',trendOption2);

        $scope.title1 = data.personnelExpensesWithBU[0].lable;
        getBarLineChart(data.personnelExpensesWithBU, 'chart1',trendOption2);

        
        

    };

    var initializeChartSize = function() {
        $timeout.cancel($scope.layout);
        $scope.layout = $timeout(function(){
            initEchart($scope.overviewData);
        },80);
    };

    // var getfilterList = function(){
        
    //     ///////真数据
    //     $http.get($rootScope.settings.api + '/bbp/queryFilter').success(function(json){
            
    //         $scope.filterListObject = json.filterList;
    //         getfilterListSuccess($scope.filterListObject);

    //     }).error(function(){
    //         ///////假数据
    //         $scope.filterListObject = queryFilter.filterList;
    //         getfilterListSuccess($scope.filterListObject);
    //     });
    // }

    // var getfilterListSuccess = function(list){

    //     $scope.filterList = new Array();
    //     for(var i=0;i<list.length;i++){
            
    //         $scope.filterList.push(list[i].businessCat3);

    //     }
    //     $scope.setFilter($scope.filterList[0]);
    // }

    // $scope.setFilter = function(costType){
    //     console.log(costType);
    //     getOverviewData($rootScope.entityName || 'BU1',costType);
    // }

    $scope.$on('onSelectedPBU', function(buShortName){
        $rootScope.buCodeShortName = buShortName;
        getOverviewData(buShortName || 'BU1');
    });

    var getOverviewData = function(entityName){
        
        var param = {
           "entityName":entityName
        };

        $http.post($rootScope.settings.api + '/other/queryFactoryData' , param).success(function(json){
            
            $scope.overviewData = json;
            initEchart($scope.overviewData);

        }).error(function(){
            ////假数据
            $scope.overviewData = otherQueryFactoryData;
            initEchart($scope.overviewData);
        });
        
    }

    var getBarLineChartExtra = function(data, chart,option){
        //x
        var xAxisObject = new Object();
        for(var i=0; i < data.length; i++){
            var item = data[i];
            if(xAxisObject[item.xAxisValue] == undefined){
                xAxisObject[item.xAxisValue] = new Object();
            }

            xAxisObject[item.xAxisValue][item.yAxisLabel] = data[i].yAxisValue;
        }

        var xAxisData = Object.getOwnPropertyNames(xAxisObject);
        

        var series = new Array();

        var legend = ['MU-Actual','MU-Benchmark'];//Object.getOwnPropertyNames(xAxisObject[xAxisData[0]]);


        for(var i=0; i < xAxisData.length; i++){

            for(var j=0; j<legend.length; j++){
                
                if( series[j] == undefined){
                    series[j] = new Object();
                    series[j].name = legend[j];
                    series[j].type = 'line';
                    // series[j].stack = stack;
                    series[j].data = new Array();

                    if(legend[j].indexOf('T1') != -1 ||legend[j].indexOf('T2') != -1　|| legend[j].indexOf('T3') != -1 || legend[j].indexOf('Benchmark') != -1) {
                        series[j].type = 'line';
                        // series[j].yAxisIndex = 0;
                    }else if(legend[j].indexOf('Actual') != -1){
                        series[j].type = 'bar';
                        // series[j].yAxisIndex = 0;
                    }else{
                        series[j].type = 'bar';
                        // series[j].yAxisIndex = 0;
                    }
                }

                series[j].data.push(xAxisObject[xAxisData[i]][legend[j]] || 0);
            }
        }

        //set chart option
        var turnoverDaysOption = angular.copy(option);
        turnoverDaysOption.legend.data = legend;
        turnoverDaysOption.xAxis[0].data = xAxisData;
        turnoverDaysOption.series = series;

        var chart = echarts.init(document.getElementById(chart),theme);
        chart.setOption(turnoverDaysOption);
    }

    var getBarLineChart = function(data, chart,option){
        //x
        var xAxisObject = new Object();
        for(var i=0; i < data.length; i++){
            var item = data[i];
            if(xAxisObject[item.xAxisValue] == undefined){
                xAxisObject[item.xAxisValue] = new Object();
            }

            xAxisObject[item.xAxisValue][item.yAxisLabel] = data[i].yAxisValue;
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

                    if(legend[j].indexOf('T1') != -1 ||legend[j].indexOf('T2') != -1　|| legend[j].indexOf('T3') != -1 || legend[j].indexOf('Benchmark') != -1) {
                        series[j].type = 'line';
                        // series[j].yAxisIndex = 1;
                    }else if(legend[j].indexOf('Actual') != -1){
                        series[j].type = 'bar';
                        // series[j].yAxisIndex = 0;
                    }else{
                        series[j].type = 'bar';
                        // series[j].yAxisIndex = 0;
                    }
                }

                series[j].data.push(xAxisObject[xAxisData[i]][legend[j]] || 0);
            }
        }

        //set chart option
        var turnoverDaysOption = angular.copy(option);
        turnoverDaysOption.legend.data = legend;
        turnoverDaysOption.xAxis[0].data = xAxisData;
        turnoverDaysOption.series = series;

        var chart = echarts.init(document.getElementById(chart),theme);
        chart.setOption(turnoverDaysOption);
    }

    var getMixBarChart = function(data,chart,option){

        //x
        var xAxisObject = new Object();
        for(var i=0; i < data.length; i++){
            var item = data[i];
            if(xAxisObject[item.xAxisValue] == undefined){
                xAxisObject[item.xAxisValue] = new Object();
            }

            xAxisObject[item.xAxisValue][item.yAxisLabel] = data[i].yAxisValue*100;
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

                series[j].data.push(xAxisObject[xAxisData[i]][legend[j]] || 0);
            }
        }

        //set chart option
        var stockageMonthOption = angular.copy(option);
        stockageMonthOption.legend.data = legend;
        stockageMonthOption.xAxis[0].data = xAxisData;
        stockageMonthOption.series = series;

        var chart = echarts.init(document.getElementById(chart),theme);
        chart.setOption(stockageMonthOption);
    }


    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

}]);