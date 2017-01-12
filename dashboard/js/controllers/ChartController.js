Array.prototype.unique = function(){
 this.sort(); //先排序
 var res = [this[0]];
 for(var i = 1; i < this.length; i++){
  if(this[i] !== res[res.length - 1]){
   res.push(this[i]);
  }
 }
 return res;
};

;angular.module('SeanApp')
.controller('ChartController',['$rootScope', '$scope','$http', '$timeout','$window','$state', function($rootScope, $scope, $http, $timeout,$window,$state) {

    //亿元 单轴
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
            x:46,
            y:10,
            x2:46,
            y2:118
        },
        xAxis: [
            {
                type: 'category',
                axisLabel: {
                    interval:0,
                    rotate:45,
                    margin:6,
                }
                // data: ['2016-1','2016-2','2016-3','2016-4','2016-5','2016-6','2016-7','2016-8','2016-9','2016-10','2016-11','2016-12']
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '',
                axisLabel: {
                    formatter: function(value){
                        var val = value;
                        if(value>=10000000){
                            val = (value/100000000)+"亿";
                        }else if(value>=1000){
                            val = (value/10000)+"万";
                        }
                        return val;
                    }
                },
                
                splitLine: {show: false}
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

    //亿元 天数 双轴
    var trendOption2 = {
        tooltip: {
            trigger: 'axis'
        },

        legend: {
            width:500,
            left:'center',
            bottom:48,
            // data:['Inventory','OBP Inventory','Actual days','T3 days']
        },
        grid:{
            show:false,
            x:46,
            y:10,
            x2:46,
            y2:138
        },
        xAxis: [
            {
                type: 'category',
                axisLabel: {
                    interval:0,
                    rotate:45,
                    margin:6,
                }
                // data: ['2016-1','2016-2','2016-3','2016-4','2016-5','2016-6','2016-7','2016-8','2016-9','2016-10','2016-11','2016-12']
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '',
                axisLabel: {
                    formatter: function(value){
                        var val = value;
                        if(value>10000000){
                            val = (value/100000000)+"亿";
                        }else if(value>10000){
                            val = (value/10000)+"万";
                        }
                        return val;
                    }
                },
                
                splitLine: {show: false}
            },
            {
                type: 'value',
                name: '',
                axisLabel: {
                    formatter: '{value}天'
                },
                
                splitLine: {show: false}
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

    //叠柱
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
            x:46,
            y:10,
            x2:46,
            y2:108
        },
        xAxis: [
            {
                type: 'category',
                axisLabel: {
                    interval:0,
                    rotate:45,
                    margin:6,
                }
                // data: ['2016-1','2016-2','2016-3','2016-4','2016-5','2016-6','2016-7','2016-8','2016-9','2016-10','2016-11','2016-12']
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '',
                min: 0,
                max: 100,
                interval: 20,
                axisLabel: {
                    formatter: '{value}%'
                },
                
                splitLine: {show: false}
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

    var widgetHeight;

    
    $scope.$on('$viewContentLoaded', function() {
        
        $scope.initWidgetHeight();
        var option = JSON.parse(window.localStorage.getItem('chartOption'));
        var title = window.localStorage.getItem('title');
        console.log(option);
        option.grid.x = 50;
        option.grid.y = 80;
        option.title = {
            text:title
        };
        option.toolbox = {
            show : true,  
            feature: {    
                saveAsImage : {show: true},
                myTool : {  
                    show : true,  
                    title : '后退',  
                    icon : 'image://./css/close.png',  
                    onclick : function (){  
                        window.history.go(-1); 
                    }  
                }  
            },
            
        };
        option.yAxis[0] = {
                type: 'value',
                name: '',
                axisLabel: {
                    
                    formatter: function(value){
                        var val = value;
                        if(value>=10000000){
                            val = (value/100000000)+"亿";
                        }else if(value>=10000){
                            val = (value/10000)+"万";
                        }
                        return val;
                    }
                },
                splitLine: {show: false}
            };
        var chart = echarts.init(document.getElementById('chart'),theme);
        chart.setOption(option);

        $scope.timer = $timeout(function(){
            var timeout;
            angular.element($window).bind('resize', function() {
                timeout = $timeout(function(){
                    $scope.initEchart($scope.overviewData);
                    $timeout.cancel(timeout);
                },300);
            })
        },1000);

        $scope.$on("$destroy",function( event ) {
                $timeout.cancel( $scope.timer );
            }
        );
        
    });

    $scope.initWidgetHeight = function(){
        var height = $(window).height() - 34;
        $('.yfops-widget').css('min-height',height);
        $('.ops-chart').css('min-height',height-50);
    }


    $scope.initEchart = function(data){

        if(!data || data == undefined){
            return;
        }

        getBarLineChart(data.overviewTurnoverDaysMonth, 'chart',trendOption2);

    };

    $scope.charts = new Array();

    //库龄分析
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
        // var legend = Object.getOwnPropertyNames(xAxisObject[xAxisData[0]]);  //顺序问题
        var legend = ['x<=1','1<x<=7','7<x<=30','x>30'];

        for(var i=0; i < xAxisData.length; i++){

            for(var j=0; j<legend.length; j++){
                
                if( series[j] == undefined){
                    series[j] = new Object();
                    series[j].name = legend[j];
                    series[j].type = 'bar';
                    series[j].stack = stack;
                    // series[j].formatter = '{value}%';
                    series[j].data = new Array();
                }

                if(typeObject[xAxisData[i]][legend[j]] ==1){
                    series[j].type = 'line';
                }else if(typeObject[xAxisData[i]][legend[j]] ==0){
                    series[j].type = 'bar';
                    series[j].stack = stack;
                }

                series[j].data.push(xAxisObject[xAxisData[i]][legend[j]] || 0);
            }
        }

        //set chart option
        var _option = angular.copy(option);
        _option.legend.data = legend;
        //默认勾选T2 ACTUAL
        // _option.legend.selected = new Object();
        // for(var i=0;i<legend.length;i++){
        //     _option.legend.selected[legend[i]] = false;
        //     if(legend[i].indexOf('T2') != -1 || legend[i].indexOf('Actual')!= -1 || legend[i].indexOf('Benchmark')!= -1){
        //         console.log(legend[i]);
        //         _option.legend.selected[legend[i]] = true;
        //     }
        // }
        _option.xAxis[0].data = xAxisData;
        _option.series = series;

        $scope.charts[chart] = echarts.init(document.getElementById(chart),theme);
        $scope.charts[chart].setOption(_option);
    }

    //双轴
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
                    series[j].data = new Array();
                    
                    // if(typeObject[xAxisData[i]][legend[j]] ==1){
                    //     series[j].type = 'line';
                    //     series[j].yAxisIndex = 1;
                    // }else if(typeObject[xAxisData[i]][legend[j]] ==0){
                    //     series[j].type = 'bar';
                    //     // series[j].stack = stack;
                    //     series[j].yAxisIndex = 0;
                    // }

                    // if(xAxisObject[xAxisData[i]][legend[j]]> 100) {
                    //     series[j].type = 'bar';
                    //     // series[j].yAxisIndex = 0;
                    //     if(series[j].name.indexOf('T1') != -1 || series[j].name.indexOf('T2') != -1 || series[j].name.indexOf('T3') != -1){
                    //         // series[j].stack = 'TIT2T3';
                    //         series[j].type = 'line';
                    //     }
                    // }else{
                    //     series[j].type = 'line';
                    //     // series[j].yAxisIndex = 1;
                    // }
                }

                if(typeObject[xAxisData[i]][legend[j]] ==1){
                    series[j].type = 'line';
                    series[j].yAxisIndex = 1;
                }else if(typeObject[xAxisData[i]][legend[j]] ==0){
                    series[j].type = 'bar';
                    series[j].yAxisIndex = 0;
                }

                series[j].data.push(xAxisObject[xAxisData[i]][legend[j]] || 0);
            }
        }

        //set chart option
        var _option = angular.copy(option);
        _option.legend.data = legend;
        //默认勾选T2 ACTUAL
        _option.legend.selected = new Object();
        for(var i=0;i<legend.length;i++){
            _option.legend.selected[legend[i]] = false;
            if(legend[i].indexOf('T2') != -1 || legend[i].indexOf('Actual')!= -1 || legend[i].indexOf('Benchmark')!= -1){
                console.log(legend[i]);
                _option.legend.selected[legend[i]] = true;
            }
        }

        _option.xAxis[0].data = xAxisData;
        _option.series = series;
        console.log(_option);

        $scope.charts[chart] = echarts.init(document.getElementById(chart),theme);
        $scope.charts[chart].setOption(_option);
        // var img = chart.getDataURL({
        //     type:"png",
        //     pixelRatio: 2,
        //     backgroundColor: '#fff'
        // });
    }

    //双轴
    $scope.getBarLineChartDefault = function(data, chart,option){
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
        var _option = angular.copy(option);
        _option.legend.data = legend;
        //默认勾选T2 ACTUAL
        _option.legend.selected = new Object();
        for(var i=0;i<legend.length;i++){
            _option.legend.selected[legend[i]] = false;
            if(legend[i].indexOf('T2') != -1 || legend[i].indexOf('Actual')!= -1){
                console.log(legend[i]);
                _option.legend.selected[legend[i]] = true;
            }
        }

        _option.xAxis[0].data = xAxisData;
        _option.series = series;
        console.log(_option);

        $scope.charts[chart] = echarts.init(document.getElementById(chart),theme);
        $scope.charts[chart].setOption(_option);
        // var img = chart.getDataURL({
        //     type:"png",
        //     pixelRatio: 2,
        //     backgroundColor: '#fff'
        // });
    }

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    

}]);