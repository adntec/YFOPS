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
.controller('DashboardController',['$rootScope', '$scope','$http', '$timeout','$window','$state', function($rootScope, $scope, $http, $timeout,$window,$state) {

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
            x:40,
            y:10,
            x2:30,
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
                // min: 0,
                // max: 250,
                // interval: 50,
                axisLabel: {
                    formatter: function(value){
                        var rmb = value/100000000;
                        return rmb+'亿';
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
            x:40,
            y:10,
            x2:30,
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
                // min: 0,
                // max: 250,
                // interval: 50,
                axisLabel: {
                    formatter: function(value){
                        var rmb = value/100000000;
                        return rmb+'亿';
                    }
                }
            },
            {
                type: 'value',
                name: '',
                // min: 0,
                // max: 25,
                // interval: 5,
                axisLabel: {
                    formatter: '{value}天'
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
            x:38,
            y:10,
            x2:20,
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

    var mapOption = {
        "mapwidth":"860",
        "mapheight":"700",
        "categories":[],
        "levels":[
            {
                "id":"china",
                "title":"China",
                "map":"maps/china.svg",
                "minimap": "maps/china-mini.jpg",
                "locations":[
                    
                    // {
                    //     "id": "guangzhou",
                    //     "title": "Guangzhou",
                    //     "description": "Guangzhou is the third largest Chinese city.",
                    //     // "pin": "circular",
                    //     "x": "0.6989",
                    //     "y": "0.8536"
                    // },
                    // {
                    //     "id": "shanghai",
                    //     "title": "Shanghai 1",
                    //     "description": "Shanghai is the first largest Chinese city.",
                    //     // "pin": "circular",
                    //     "x": "0.8377",
                    //     "y": "0.6227"
                    // },
                    // {
                    //     "id": "shanghai",
                    //     "title": "Shanghai 2",
                    //     "description": "Shanghai is the first largest Chinese city.",
                    //     // "pin": "circular",
                    //     "x": "0.8369",
                    //     "y": "0.6152"
                    // },
                    // {
                    //     "id": "shanghai",
                    //     "title": "Shanghai 3",
                    //     "description": "Shanghai is the first largest Chinese city.",
                    //     // "pin": "circular",
                    //     "x": "0.8433",
                    //     "y": "0.6182"
                    // }
                ]
            }
        ]
    };

    var widgetHeight;

    $scope.$on('ngRepeatFinished', function(repeatFinishedEvent) {
         
        initSparkline();

        var v = $(".widget_sparkline_bar").eq(0);
        v.sparkline(v.data('array').split(','), {
            type: 'bar',
            width: '100',
            barWidth: 10,
            height: '34',
            barColor: '#5b9bd1',
            negBarColor: '#5b9bd1'
        });
        
    });
    
    $scope.$on('$viewContentLoaded', function() {
        
        angular.element('.fullscreen').bind('click', function() {
            initializeChartSize();
        });


        $('.portlet .fa-download').bind('click',function(){
            var id = $(this).parents('.portlet').find('.ops-chart').attr('id');
            // console.log(id);
            var img = $scope.charts[id].getDataURL({
                type:"png",
                pixelRatio: 2,
                backgroundColor: '#fff'
            });
            $(this).attr('href',img); 
             // $scope.charts[id].dispatchAction({type:'saveAsImage'});

        });

        initWidgetHeight();
        getBuList('JIT PBU');
        
    });

    var initSparkline = function(){

        $(".widget_sparkline_bar").each(function(i,v){
            
            var color = '#a6a6a6';

            $(v).sparkline($(v).data('array').split(','), {
                type: 'bar',
                width: '100',
                barWidth: 10,
                height: '34',
                barColor: color,
                negBarColor: color
            });
        })
    }

    var initWidgetHeight = function(){
        var height = $(window).height() - 63.99 - 77.78 -18.89-50;
        $('.page-content').css('min-height',height);

        widgetHeight = (height -77.8 -60) / 2 ;
        $('.yfops-widget').css('min-height',widgetHeight);
        $('.yfops-map').css('min-height',widgetHeight -4);
    }

    var initChinaMap = function(option) {

        if ($('#mapplic').size() === 0) {
            return;
        }
        $('#mapplic').html('').data('mapplic', null);

        var h = widgetHeight-2;
        $('#mapplic').mapplic({
            source: option,
            height: h,
            animate: true,
            sidebar: false,
            minimap: false,
            locations: false,
            deeplinking: false,
            fullscreen: false,
            hovertip: true,
            zoombuttons: true,
            clearbutton: true,
            developer: false,
            maxscale: 5,
            skin: 'mapplic-dark',
            zoom: true
        });

    };

    var initEchart = function(data){

        if(!data || data == undefined){
            return;
        }

        var valueArray = [data.overviewStockAmount,data.overviewTurnoverDays,data.overviewTurnoverRate,data.overviewUnbilledSell];
        $scope.values = new Array();
        for(var i=0;i<valueArray.length;i++){
            $scope.values[i] = new Object();
            if(valueArray[i][0].axisValue > valueArray[i][1].axisValue ){
                $scope.values[i].state = 'up';
            }else if(valueArray[i][0].axisValue < valueArray[i][1].axisValue){
                $scope.values[i].state = 'down';
            }else{
                $scope.values[i].state = 'equals';
            }
            $scope.values[i].axisValue = valueArray[i][0].axisValue;
            $scope.values[i].percent = (valueArray[i][1].axisValue / valueArray[i][0].axisValue)*100;
            $scope.values[i].lable = valueArray[i][0].lable;
            $scope.values[i].axis = valueArray[i][0].axis;
            $scope.values[i].unit = valueArray[i][0].unit;
        }

        $scope.title1 = data.overviewTurnoverDaysMonth[0].lable;
        getBarLineChart(data.overviewTurnoverDaysMonth, 'chart1',trendOption2);

        $scope.title2 = data.overviewStockageMonth[0].lable;
        getMixBarChart(data.overviewStockageMonth, 'chart2',ageOption);

        $scope.title3 = data.overviewTurnoverDaysYear[0].lable;
        getBarLineChart(data.overviewTurnoverDaysYear, 'chart3',trendOption2);
        
        $scope.title4 = data.overviewStockageYear[0].lable;
        getMixBarChart(data.overviewStockageYear, 'chart4',ageOption);

        $scope.title5 = data.overviewUnbilledSellTrendMonth[0].lable;
        getBarLineChart(data.overviewUnbilledSellTrendMonth, 'chart5',trendOption1);
        
        $scope.title6 = data.overviewUnbilledSellTrendYear[0].lable;
        getBarLineChart(data.overviewUnbilledSellTrendYear, 'chart6',trendOption1);

    };

    var initializeChartSize = function() {
        $timeout.cancel($scope.layout);
        $scope.layout = $timeout(function(){
            initEchart($scope.overviewData);
        },80);
    };


    var getBuListSuccess = function(buList){

        $rootScope.BuList = new Object();
        for(var i=0;i<buList.length;i++){
            var shortName = buList[i].buCodeShortName;
            if(shortName == null) continue;

            if( $rootScope.BuList[shortName] == undefined){
                $rootScope.BuList[shortName] = new Array();
            }else{
                $rootScope.BuList[shortName].push(buList[i]);
            }
        }

        //bu列表
        $rootScope.BuNameList = Object.getOwnPropertyNames($rootScope.BuList);
        $rootScope.BuNameList = $rootScope.BuNameList.sort();
        $rootScope.pubCodeShortName = buList[0].pubCodeShortName;
        $rootScope.buCodeShortName = $rootScope.BuList[$rootScope.BuNameList[0]][0].buCodeShortName;

        console.log($rootScope.pubCodeShortName)
    }

    var getBuList = function(pubCodeShortName){
        $rootScope.pubCodeShortName = pubCodeShortName;
        $.get($rootScope.settings.api + '/finance/queryBuList').success(function(json){
            ///////真数据
            $scope.BuListObject = json.BuList;
            getBuListSuccess($scope.BuListObject);
            getOverviewData($rootScope.entityShortName);
            refreshChinaMap($rootScope.buCodeShortName);

        }).error(function(){

            console.log('请求error,取假数据');
            $scope.BuListObject = queryBuList.BuList;
            getBuListSuccess($scope.BuListObject);
            getOverviewData($rootScope.entityShortName);
            refreshChinaMap($rootScope.buCodeShortName);
        });
        
    }

    $scope.$on('onSelectedPBU', function(scope,buShortName){
        $rootScope.buCodeShortName = buShortName;
        $rootScope.entityShortName = buShortName;
        getOverviewData($rootScope.entityShortName);
    });

    $scope.selectBU = function(buShortName,$event){
        
        $rootScope.buCodeShortName = buShortName;
        $rootScope.entityShortName = buShortName;
        initSparkline();

        $('.yfops-sparkline li.active').removeClass('active');
        $($event.currentTarget).addClass('active');

        var v = $($event.currentTarget).find('.widget_sparkline_bar');
        $(v).sparkline([8,7,9,8.5,8,8.2], {
            type: 'bar',
            width: '100',
            barWidth: 10,
            height: '34',
            barColor: '#5b9bd1',
            negBarColor: '#5b9bd1'
        });

        // var buShortName = $($event.currentTarget).find('.yfops-sparkline-title').html();
        getOverviewData(buShortName);
        refreshChinaMap(buShortName);
    }

    var refreshChinaMap = function(buShortName){

        if(buShortName == "JIT PBU" ) buShortName = "BU1";

        var locations = new Array();
        var keys = $rootScope.BuList[buShortName];
        // console.log($rootScope.BuList,buShortName,keys);

        for(var i=0;i<keys.length;i++){
            var entity = {
                "action":"tooltip",
                "id": keys[i].entityCode,
                "title": keys[i].entityShortName,
                "description": keys[i].entityShortName,
                "link":"#/finance/"+keys[i].entityShortName,
                // "pin": "circular",
                "x": keys[i].axisX || 0,
                "y": keys[i].axisY || 0
            }
            locations.push(entity);
        }

        var option = angular.copy(mapOption);
        option.levels[0].locations = locations;
        initChinaMap(option);
    }

    var getOverviewData = function(buShortName){

        var param = {
           "entityName":buShortName
        };

        $http.post($rootScope.settings.api + '/finance/overviewData' , param).success(function(json){
            ////真数据
            $scope.overviewData = json;
            initEchart($scope.overviewData);

        }).error(function(){

            console.log('请求error,取假数据');
            $scope.overviewData = overviewData;
            initEchart($scope.overviewData);
        });
        
    }


    $scope.charts = new Array();

    //库龄分析
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

                series[j].data.push(xAxisObject[xAxisData[i]][legend[j]] || 0);
            }
        }

        //set chart option
        var stockageMonthOption = angular.copy(option);
        stockageMonthOption.legend.data = legend;
        stockageMonthOption.xAxis[0].data = xAxisData;
        stockageMonthOption.series = series;

        $scope.charts[chart] = echarts.init(document.getElementById(chart),theme);
        $scope.charts[chart].setOption(stockageMonthOption);
    }

    //趋势分析
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
                    series[j].data = new Array();
                    

                    if(xAxisObject[xAxisData[i]][legend[j]]> 100) {
                        series[j].type = 'bar';
                        series[j].yAxisIndex = 0;
                        // if(series[j].name.indexOf('T1') != -1 || series[j].name.indexOf('T2') != -1 || series[j].name.indexOf('T3') != -1){
                        //     series[j].stack = 'TIT2T3';
                        // }
                    }else{
                        series[j].type = 'line';
                        series[j].yAxisIndex = 1;
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

        $scope.charts[chart] = echarts.init(document.getElementById(chart),theme);
        $scope.charts[chart].setOption(turnoverDaysOption);
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

    $rootScope.entityShortName = $state.params['id'] || "JIT PBU";
    console.log('shortName:' + $rootScope.entityShortName);
    

}]);