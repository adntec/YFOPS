;
angular.module('SeanApp').controller('BBPFactoryController', [
  '$rootScope',
  '$scope',
  '$http',
  '$timeout',
  '$window',
  function ($rootScope, $scope, $http, $timeout, $window) {
    var widgetHeight;
    $scope.$on('ngRepeatFinished', function (repeatFinishedEvent) {
    });
    $scope.$on('$viewContentLoaded', function () {
      initWidgetHeight();
      getfilterList();
      getOverviewData('BU1', 'Conversion Cost/EQU');
      angular.element('.fullscreen').bind('click', function () {
        initializeChartSize();
      });
      $(window).resize(function () {
        initializeChartSize();
      });
    });
    var initWidgetHeight = function () {
      var height = $(window).height() - 63.99 - 77.78 - 18.89 - 50;
      $('.page-content').css('min-height', height);
      widgetHeight = (height - 77.8 - 60) / 2 - 20;
      $('.yfops-widget').css('min-height', widgetHeight);
    };
    //单轴
    var trendOption1 = {
        tooltip: { trigger: 'axis' },
        legend: { bottom: 48 },
        grid: {
          show: false,
          x: 40,
          y: 10,
          x2: 30,
          y2: 98
        },
        xAxis: [{ type: 'category' }],
        yAxis: [{
            type: 'value',
            name: '',
            axisLabel: {
              formatter: function (value) {
                return value;
              }
            }
          }],
        series: [],
        dataZoom: [{
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
            textStyle: { color: '#fff' }
          }]
      };
    //双轴
    var trendOption2 = {
        tooltip: { trigger: 'axis' },
        legend: { bottom: 48 },
        grid: {
          show: false,
          x: 40,
          y: 10,
          x2: 30,
          y2: 148
        },
        xAxis: [{ type: 'category' }],
        yAxis: [
          {
            type: 'value',
            name: '',
            axisLabel: {
              formatter: function (value) {
                return value;
              }
            }
          },
          {
            type: 'value',
            name: '',
            axisLabel: { formatter: '{value}' }
          }
        ],
        series: [],
        dataZoom: [{
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
            textStyle: { color: '#fff' }
          }]
      };
    var ageOption = {
        tooltip: { trigger: 'axis' },
        legend: { bottom: 48 },
        grid: {
          show: false,
          x: 38,
          y: 10,
          x2: 20,
          y2: 128
        },
        xAxis: [{ type: 'category' }],
        yAxis: [{
            type: 'value',
            name: '',
            interval: 20,
            axisLabel: { formatter: '{value}' }
          }],
        series: [],
        dataZoom: [{
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
            textStyle: { color: '#fff' }
          }]
      };
    var initEchart = function (data) {
      if (!data || data == undefined) {
        return;
      }
      $scope.title1 = data.ciSaving[0].lable;
      getBarLineChart(data.ciSaving, 'chart1', trendOption2);
      $scope.title2 = data.conversionCostDivideEQU[0].lable;
      getBarLineChart(data.conversionCostDivideEQU, 'chart2', trendOption2);
    };
    var initializeChartSize = function () {
      $timeout.cancel($scope.layout);
      $scope.layout = $timeout(function () {
        initEchart($scope.overviewData);
      }, 80);
    };
    var getfilterListSuccess = function (list) {
      $scope.filterList = new Array();
      for (var i = 0; i < list.length; i++) {
        $scope.filterList.push(list[i].businessCat3);
      }
    };
    var getfilterList = function () {
      ///////真数据
      $http.get($rootScope.settings.api + '/bbp/queryFilter').success(function (json) {
        $scope.filterListObject = json.filterList;
        getfilterListSuccess($scope.filterListObject);
      }).error(function () {
        ///////假数据
        $scope.filterListObject = queryFilter.filterList;
        getfilterListSuccess($scope.filterListObject);
      });
    };
    $scope.setFilter = function (costType) {
      console.log(costType);
      getOverviewData($rootScope.entityName || 'BU1', costType);
    };
    var getOverviewData = function (entityName, costType) {
      var param = {
          'entityName': entityName,
          'costType': costType
        };
      $http.post($rootScope.settings.api + '/bbp/queryOverviewData', param).success(function (json) {
        $scope.overviewData = json;
        initEchart($scope.overviewData);
      }).error(function () {
        ////假数据
        $scope.overviewData = bbpQueryFactoryData;
        initEchart($scope.overviewData);
      });
    };
    var getBarLineChart = function (data, chart, option) {
      //x
      var xAxisObject = new Object();
      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        if (xAxisObject[item.xAxisValue] == undefined) {
          xAxisObject[item.xAxisValue] = new Object();
        }
        xAxisObject[item.xAxisValue][item.yAxisLabel] = data[i].yAxisValue;
      }
      var xAxisData = Object.getOwnPropertyNames(xAxisObject);
      var series = new Array();
      var legend = Object.getOwnPropertyNames(xAxisObject[xAxisData[0]]);
      for (var i = 0; i < xAxisData.length; i++) {
        for (var j = 0; j < legend.length; j++) {
          if (series[j] == undefined) {
            series[j] = new Object();
            series[j].name = legend[j];
            series[j].type = 'line';
            // series[j].stack = stack;
            series[j].data = new Array();
            if (xAxisObject[xAxisData[i]][legend[j]] > 100) {
              series[j].type = 'bar';
              series[j].yAxisIndex = 0;
            } else {
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
      var chart = echarts.init(document.getElementById(chart), theme);
      chart.setOption(turnoverDaysOption);
    };
    var getMixBarChart = function (data, chart, option) {
      //x
      var xAxisObject = new Object();
      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        if (xAxisObject[item.xAxisValue] == undefined) {
          xAxisObject[item.xAxisValue] = new Object();
        }
        xAxisObject[item.xAxisValue][item.yAxisLabel] = data[i].yAxisValue * 100;  //todo
      }
      var xAxisData = Object.getOwnPropertyNames(xAxisObject);
      //y
      var stack = data[0].lable;
      var series = new Array();
      var legend = Object.getOwnPropertyNames(xAxisObject[xAxisData[0]]);
      //顺序问题
      // var legend = ['x<=1','1<x<=7','7<x<=30','x>30'];
      for (var i = 0; i < xAxisData.length; i++) {
        for (var j = 0; j < legend.length; j++) {
          if (series[j] == undefined) {
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
      var chart = echarts.init(document.getElementById(chart), theme);
      chart.setOption(stockageMonthOption);
    };
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
  }
]);
;
angular.module('SeanApp').controller('BBPOverviewController', [
  '$rootScope',
  '$scope',
  '$http',
  '$timeout',
  '$window',
  function ($rootScope, $scope, $http, $timeout, $window) {
    var widgetHeight;
    $scope.$on('ngRepeatFinished', function (repeatFinishedEvent) {
    });
    $scope.$on('$viewContentLoaded', function () {
      initWidgetHeight();
      getfilterList();
      getOverviewData('BU1', 'Conversion Cost/EQU');
      angular.element('.fullscreen').bind('click', function () {
        initializeChartSize();
      });
      $(window).resize(function () {
        initializeChartSize();
      });
    });
    var initWidgetHeight = function () {
      var height = $(window).height() - 63.99 - 77.78 - 18.89 - 50;
      $('.page-content').css('min-height', height);
      widgetHeight = (height - 77.8 - 60) / 2 - 20;
      $('.yfops-widget').css('min-height', widgetHeight);
    };
    //单轴
    var trendOption1 = {
        tooltip: { trigger: 'axis' },
        legend: { bottom: 48 },
        grid: {
          show: false,
          x: 40,
          y: 10,
          x2: 30,
          y2: 98
        },
        xAxis: [{ type: 'category' }],
        yAxis: [{
            type: 'value',
            name: '',
            axisLabel: {
              formatter: function (value) {
                return value;
              }
            }
          }],
        series: [],
        dataZoom: [{
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
            textStyle: { color: '#fff' }
          }]
      };
    //双轴
    var trendOption2 = {
        tooltip: { trigger: 'axis' },
        legend: { bottom: 48 },
        grid: {
          show: false,
          x: 40,
          y: 10,
          x2: 30,
          y2: 148
        },
        xAxis: [{ type: 'category' }],
        yAxis: [
          {
            type: 'value',
            name: '',
            axisLabel: {
              formatter: function (value) {
                return value;
              }
            }
          },
          {
            type: 'value',
            name: '',
            axisLabel: { formatter: '{value}' }
          }
        ],
        series: [],
        dataZoom: [{
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
            textStyle: { color: '#fff' }
          }]
      };
    var ageOption = {
        tooltip: { trigger: 'axis' },
        legend: { bottom: 48 },
        grid: {
          show: false,
          x: 38,
          y: 10,
          x2: 20,
          y2: 128
        },
        xAxis: [{ type: 'category' }],
        yAxis: [{
            type: 'value',
            name: '',
            interval: 20,
            axisLabel: { formatter: '{value}' }
          }],
        series: [],
        dataZoom: [{
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
            textStyle: { color: '#fff' }
          }]
      };
    var initEchart = function (data) {
      if (!data || data == undefined) {
        return;
      }
      console.log(data);
      $scope.title1 = data.conversionCostDivideEQUTrendMonth[0].lable;
      getBarLineChart(data.conversionCostDivideEQUTrendMonth, 'chart1', trendOption2);
      $scope.title2 = data.conversionCostDivideEQUClassMonth[0].lable;
      getBarLineChart(data.conversionCostDivideEQUClassMonth, 'chart2', trendOption2);
      $scope.title3 = data.conversionCostDivideEQUClassMonth[0].lable;
      getMixBarChart(data.conversionCostDivideEQUClassMonth, 'chart3', ageOption);
      $scope.title4 = data.conversionCostDivideEQUClassMonth[0].lable;
      getMixBarChart(data.conversionCostDivideEQUClassMonth, 'chart4', ageOption);
    };
    var initializeChartSize = function () {
      $timeout.cancel($scope.layout);
      $scope.layout = $timeout(function () {
        initEchart($scope.overviewData);
      }, 80);
    };
    var getfilterListSuccess = function (list) {
      $scope.filterList = new Array();
      for (var i = 0; i < list.length; i++) {
        $scope.filterList.push(list[i].businessCat3);
      }
    };
    var getfilterList = function () {
      ///////真数据
      $http.get($rootScope.settings.api + '/bbp/queryFilter').success(function (json) {
        $scope.filterListObject = json.filterList;
        getfilterListSuccess($scope.filterListObject);
      }).error(function () {
        ///////假数据
        $scope.filterListObject = queryFilter.filterList;
        getfilterListSuccess($scope.filterListObject);
      });
    };
    $scope.setFilter = function (costType) {
      console.log(costType);
      getOverviewData($rootScope.entityName || 'BU1', costType);
    };
    var getOverviewData = function (entityName, costType) {
      var param = {
          'entityName': entityName,
          'costType': costType
        };
      $http.post($rootScope.settings.api + '/bbp/queryOverviewData', param).success(function (json) {
        $scope.overviewData = json;
        initEchart($scope.overviewData);
      }).error(function () {
        ////假数据
        $scope.overviewData = bbpQueryOverviewData;
        initEchart($scope.overviewData);
      });
    };
    var getBarLineChart = function (data, chart, option) {
      //x
      var xAxisObject = new Object();
      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        if (xAxisObject[item.xAxisValue] == undefined) {
          xAxisObject[item.xAxisValue] = new Object();
        }
        xAxisObject[item.xAxisValue][item.yAxisLabel] = data[i].yAxisValue;
      }
      var xAxisData = Object.getOwnPropertyNames(xAxisObject);
      var series = new Array();
      var legend = Object.getOwnPropertyNames(xAxisObject[xAxisData[0]]);
      for (var i = 0; i < xAxisData.length; i++) {
        for (var j = 0; j < legend.length; j++) {
          if (series[j] == undefined) {
            series[j] = new Object();
            series[j].name = legend[j];
            series[j].type = 'line';
            // series[j].stack = stack;
            series[j].data = new Array();
            if (xAxisObject[xAxisData[i]][legend[j]] > 100) {
              series[j].type = 'bar';
              series[j].yAxisIndex = 0;
            } else {
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
      var chart = echarts.init(document.getElementById(chart), theme);
      chart.setOption(turnoverDaysOption);
    };
    var getMixBarChart = function (data, chart, option) {
      //x
      var xAxisObject = new Object();
      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        if (xAxisObject[item.xAxisValue] == undefined) {
          xAxisObject[item.xAxisValue] = new Object();
        }
        xAxisObject[item.xAxisValue][item.yAxisLabel] = data[i].yAxisValue * 100;  //TODO
      }
      var xAxisData = Object.getOwnPropertyNames(xAxisObject);
      //y
      var stack = data[0].lable;
      var series = new Array();
      var legend = Object.getOwnPropertyNames(xAxisObject[xAxisData[0]]);
      //顺序问题
      // var legend = ['x<=1','1<x<=7','7<x<=30','x>30'];
      for (var i = 0; i < xAxisData.length; i++) {
        for (var j = 0; j < legend.length; j++) {
          if (series[j] == undefined) {
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
      var chart = echarts.init(document.getElementById(chart), theme);
      chart.setOption(stockageMonthOption);
    };
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
  }
]);
Array.prototype.unique = function () {
  this.sort();
  //先排序
  var res = [this[0]];
  for (var i = 1; i < this.length; i++) {
    if (this[i] !== res[res.length - 1]) {
      res.push(this[i]);
    }
  }
  return res;
};
;
angular.module('SeanApp').controller('DashboardController', [
  '$rootScope',
  '$scope',
  '$http',
  '$timeout',
  '$window',
  function ($rootScope, $scope, $http, $timeout, $window) {
    var widgetHeight;
    $scope.$on('ngRepeatFinished', function (repeatFinishedEvent) {
      initSparkline();
      var v = $('.widget_sparkline_bar').eq(0);
      v.sparkline(v.data('array').split(','), {
        type: 'bar',
        width: '100',
        barWidth: 10,
        height: '34',
        barColor: '#5b9bd1',
        negBarColor: '#5b9bd1'
      });
    });
    $scope.$on('$viewContentLoaded', function () {
      initWidgetHeight();
      initWorldMapStats();
      angular.element('.fullscreen').bind('click', function () {
        initializeChartSize();
      });
      $(window).resize(function () {
        initializeChartSize();
      });
      getBuList('JIT PBU');
    });
    var initSparkline = function () {
      $('.widget_sparkline_bar').each(function (i, v) {
        var color = '#a6a6a6';
        $(v).sparkline($(v).data('array').split(','), {
          type: 'bar',
          width: '100',
          barWidth: 10,
          height: '34',
          barColor: color,
          negBarColor: color
        });
      });
    };
    var initWidgetHeight = function () {
      var height = $(window).height() - 63.99 - 77.78 - 18.89 - 50;
      $('.page-content').css('min-height', height);
      widgetHeight = (height - 77.8 - 60) / 2 - 20;
      $('.yfops-widget').css('min-height', widgetHeight);
    };
    var initWorldMapStats = function () {
      if ($('#mapplic').size() === 0) {
        return;
      }
      var h = widgetHeight - 2;
      $('#mapplic').mapplic({
        source: './maps/china.json',
        height: h,
        animate: true,
        sidebar: false,
        minimap: false,
        locations: true,
        deeplinking: true,
        fullscreen: false,
        hovertip: true,
        zoombuttons: false,
        clearbutton: false,
        developer: true,
        maxscale: 5,
        skin: 'mapplic-dark',
        zoom: true
      });
    };
    //亿元 单轴
    var trendOption1 = {
        tooltip: { trigger: 'axis' },
        legend: { bottom: 48 },
        grid: {
          show: false,
          x: 40,
          y: 10,
          x2: 30,
          y2: 98
        },
        xAxis: [{ type: 'category' }],
        yAxis: [{
            type: 'value',
            name: '',
            axisLabel: {
              formatter: function (value) {
                var rmb = value / 100000000;
                return rmb + '\u4ebf';
              }
            }
          }],
        series: [],
        dataZoom: [{
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
            textStyle: { color: '#fff' }
          }]
      };
    //亿元 天数 双轴
    var trendOption2 = {
        tooltip: { trigger: 'axis' },
        legend: {
          bottom: 48,
          data: [
            'Inventory',
            'OBP Inventory',
            'Actual days',
            'T3 days'
          ]
        },
        grid: {
          show: false,
          x: 40,
          y: 10,
          x2: 30,
          y2: 98
        },
        xAxis: [{
            type: 'category',
            data: [
              '2016-1',
              '2016-2',
              '2016-3',
              '2016-4',
              '2016-5',
              '2016-6',
              '2016-7',
              '2016-8',
              '2016-9',
              '2016-10',
              '2016-11',
              '2016-12'
            ]
          }],
        yAxis: [
          {
            type: 'value',
            name: '',
            axisLabel: {
              formatter: function (value) {
                var rmb = value / 100000000;
                return rmb + '\u4ebf';
              }
            }
          },
          {
            type: 'value',
            name: '',
            axisLabel: { formatter: '{value}\u5929' }
          }
        ],
        series: [
          {
            name: 'Inventory',
            type: 'bar',
            data: [
              2,
              4.9,
              7,
              23.2,
              25.6,
              76.7,
              135.6,
              162.2,
              32.6,
              20,
              6.4,
              3.3
            ]
          },
          {
            name: 'OBP Inventory',
            type: 'bar',
            data: [
              2.6,
              5.9,
              9,
              26.4,
              28.7,
              70.7,
              175.6,
              182.2,
              48.7,
              18.8,
              6,
              2.3
            ]
          },
          {
            name: 'Actual days',
            type: 'line',
            yAxisIndex: 1,
            data: [
              2,
              2.2,
              3.3,
              4.5,
              6.3,
              10.2,
              20.3,
              23.4,
              23,
              16.5,
              12,
              6.2
            ]
          },
          {
            name: 'T3 days',
            type: 'line',
            yAxisIndex: 1,
            data: [
              4,
              4.2,
              4.3,
              4.5,
              4.3,
              4.2,
              4.3,
              4.4,
              4,
              4.5,
              4,
              2.2
            ]
          }
        ],
        dataZoom: [{
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
            textStyle: { color: '#fff' }
          }]
      };
    var ageOption = {
        tooltip: { trigger: 'axis' },
        legend: { bottom: 48 },
        grid: {
          show: false,
          x: 38,
          y: 10,
          x2: 20,
          y2: 98
        },
        xAxis: [{ type: 'category' }],
        yAxis: [{
            type: 'value',
            name: '',
            min: 0,
            max: 100,
            interval: 20,
            axisLabel: { formatter: '{value}%' }
          }],
        series: [],
        dataZoom: [{
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
            textStyle: { color: '#fff' }
          }]
      };
    var initEchart = function (data) {
      if (!data || data == undefined) {
        return;
      }
      $scope.title1 = data.overviewTurnoverDaysMonth[0].lable;
      getBarLineChart(data.overviewTurnoverDaysMonth, 'chart1', trendOption2);
      $scope.title2 = data.overviewStockageMonth[0].lable;
      getMixBarChart(data.overviewStockageMonth, 'chart2', ageOption);
      $scope.title3 = data.overviewTurnoverDaysYear[0].lable;
      getBarLineChart(data.overviewTurnoverDaysYear, 'chart3', trendOption2);
      $scope.title4 = data.overviewStockageYear[0].lable;
      getMixBarChart(data.overviewStockageYear, 'chart4', ageOption);
      $scope.title5 = data.overviewUnbilledSellTrendMonth[0].lable;
      getBarLineChart(data.overviewUnbilledSellTrendMonth, 'chart5', trendOption1);
      $scope.title6 = data.overviewUnbilledSellTrendYear[0].lable;
      getBarLineChart(data.overviewUnbilledSellTrendYear, 'chart6', trendOption1);
    };
    var initializeChartSize = function () {
      $timeout.cancel($scope.layout);
      $scope.layout = $timeout(function () {
        initEchart($scope.overviewData);
      }, 80);
    };
    var getBuListSuccess = function (buList) {
      $scope.BuList = new Object();
      for (var i = 0; i < buList.length; i++) {
        var shortName = buList[i].buCodeShortName;
        if (shortName == null)
          continue;
        if ($scope.BuList[shortName] == undefined) {
          $scope.BuList[shortName] = [];
        } else {
          $scope.BuList[shortName].push(buList[i]);
        }
      }
      //bu列表
      $rootScope.BuNameList = Object.getOwnPropertyNames($scope.BuList);
      $rootScope.BuNameList = $rootScope.BuNameList.sort();
      $rootScope.buShortName = buList[0].pubCodeShortName;
      getOverviewData($rootScope.buShortName);
    };
    var getBuList = function (pubCodeShortName) {
      $.get($rootScope.settings.api + '/finance/queryBuList').success(function (json) {
        ///////真数据
        $scope.responseBuList = json.BuList;
        getBuListSuccess($scope.responseBuList);
      }).error(function () {
        console.log('\u8bf7\u6c42error,\u53d6\u5047\u6570\u636e');
        $scope.responseBuList = queryBuList.BuList;
        getBuListSuccess($scope.responseBuList);
      });
    };
    $scope.selectBU = function (buShortName, $event) {
      $rootScope.entityName = buShortName;
      initSparkline();
      $('.ysops-sparkline li.active').removeClass('active');
      $($event.currentTarget).addClass('active');
      var v = $($event.currentTarget).find('.widget_sparkline_bar');
      $(v).sparkline([
        8,
        7,
        9,
        8.5,
        8,
        8.2
      ], {
        type: 'bar',
        width: '100',
        barWidth: 10,
        height: '34',
        barColor: '#5b9bd1',
        negBarColor: '#5b9bd1'
      });
      // var buShortName = $($event.currentTarget).find('.ysops-sparkline-title').html();
      getOverviewData(buShortName);
    };
    var getOverviewData = function (buShortName) {
      var param = { 'entityName': buShortName };
      $http.post($rootScope.settings.api + '/finance/overviewData', param).success(function (json) {
        ////真数据
        $scope.overviewData = json;
        initEchart($scope.overviewData);
      }).error(function () {
        console.log('\u8bf7\u6c42error,\u53d6\u5047\u6570\u636e');
        $scope.overviewData = overviewData;
        initEchart($scope.overviewData);
      });
    };
    //库龄分析
    var getMixBarChart = function (data, chart, option) {
      //x
      var xAxisObject = new Object();
      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        if (xAxisObject[item.xAxisValue] == undefined) {
          xAxisObject[item.xAxisValue] = new Object();
        }
        xAxisObject[item.xAxisValue][item.yAxisLabel] = data[i].yAxisValue * 100;
      }
      var xAxisData = Object.getOwnPropertyNames(xAxisObject);
      //y
      var stack = data[0].lable;
      var series = new Array();
      // var legend = Object.getOwnPropertyNames(xAxisObject[xAxisData[0]]);  //顺序问题
      var legend = [
          'x<=1',
          '1<x<=7',
          '7<x<=30',
          'x>30'
        ];
      for (var i = 0; i < xAxisData.length; i++) {
        for (var j = 0; j < legend.length; j++) {
          if (series[j] == undefined) {
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
      var chart = echarts.init(document.getElementById(chart), theme);
      chart.setOption(stockageMonthOption);
    };
    //趋势分析
    var getBarLineChart = function (data, chart, option) {
      //x
      var xAxisObject = new Object();
      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        if (xAxisObject[item.xAxisValue] == undefined) {
          xAxisObject[item.xAxisValue] = new Object();
        }
        xAxisObject[item.xAxisValue][item.yAxisLabel] = data[i].yAxisValue;
      }
      var xAxisData = Object.getOwnPropertyNames(xAxisObject);
      var series = new Array();
      var legend = Object.getOwnPropertyNames(xAxisObject[xAxisData[0]]);
      for (var i = 0; i < xAxisData.length; i++) {
        for (var j = 0; j < legend.length; j++) {
          if (series[j] == undefined) {
            series[j] = new Object();
            series[j].name = legend[j];
            series[j].type = 'line';
            // series[j].stack = stack;
            series[j].data = new Array();
            if (xAxisObject[xAxisData[i]][legend[j]] > 100) {
              series[j].type = 'bar';
              series[j].yAxisIndex = 0;
            } else {
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
      var chart = echarts.init(document.getElementById(chart), theme);
      chart.setOption(turnoverDaysOption);
    };
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
  }
]);
;
angular.module('SeanApp').controller('FactoryController', [
  '$rootScope',
  '$scope',
  '$http',
  '$timeout',
  '$window',
  function ($rootScope, $scope, $http, $timeout, $window) {
    var widgetHeight;
    $scope.$on('ngRepeatFinished', function (repeatFinishedEvent) {
    });
    $scope.$on('$viewContentLoaded', function () {
      angular.element('.fullscreen').bind('click', function () {
        initializeChartSize();
      });
      $(window).resize(function () {
        initializeChartSize();
      });
      getOverviewData('11');
    });
    var initWidgetHeight = function () {
      var height = $(window).height() - 63.99 - 77.78 - 18.89 - 50;
      $('.page-content').css('min-height', height);
      widgetHeight = (height - 77.8 - 60) / 2 - 20;
      $('.yfops-widget').css('min-height', widgetHeight);
    };
    //万元 天数 双轴
    var trendOption1 = {
        tooltip: { trigger: 'axis' },
        legend: { bottom: 48 },
        grid: {
          show: false,
          x: 40,
          y: 10,
          x2: 40,
          y2: 98
        },
        xAxis: [{ type: 'category' }],
        yAxis: [
          {
            type: 'value',
            name: '',
            axisLabel: {
              formatter: function (value) {
                return value / 100000000 + '\u4ebf';
              }
            }
          },
          {
            type: 'value',
            name: '',
            axisLabel: {
              formatter: function (value) {
                return value + '\u5929';
              }
            }
          }
        ],
        series: [],
        dataZoom: [{
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
            textStyle: { color: '#fff' }
          }]
      };
    //天数 天数 双轴
    var trendOption2 = {
        tooltip: { trigger: 'axis' },
        legend: {
          bottom: 48,
          data: [
            'Inventory',
            'OBP Inventory',
            'Actual days',
            'T3 days'
          ]
        },
        grid: {
          show: false,
          x: 40,
          y: 10,
          x2: 40,
          y2: 98
        },
        xAxis: [{ type: 'category' }],
        yAxis: [
          {
            type: 'value',
            name: '',
            axisLabel: { formatter: '{value}\u5929' }
          },
          {
            type: 'value',
            name: '',
            axisLabel: { formatter: '{value}\u5929' }
          }
        ],
        series: [],
        dataZoom: [{
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
            textStyle: { color: '#fff' }
          }]
      };
    //万元 单轴
    var trendOption3 = {
        tooltip: { trigger: 'axis' },
        legend: { bottom: 48 },
        grid: {
          show: false,
          x: 40,
          y: 10,
          x2: 40,
          y2: 98
        },
        xAxis: [{ type: 'category' }],
        yAxis: [{
            type: 'value',
            name: '',
            axisLabel: {
              formatter: function (value) {
                return value / 10000 + '\u4e07';
              }
            }
          }],
        series: [],
        dataZoom: [{
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
            textStyle: { color: '#fff' }
          }]
      };
    var ageOption = {
        tooltip: { trigger: 'axis' },
        legend: { bottom: 48 },
        grid: {
          show: false,
          x: 38,
          y: 10,
          x2: 20,
          y2: 98
        },
        xAxis: [{ type: 'category' }],
        yAxis: [{
            type: 'value',
            name: '',
            min: 0,
            max: 100,
            interval: 20,
            axisLabel: { formatter: '{value}%' }
          }],
        series: [],
        dataZoom: [{
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
            textStyle: { color: '#fff' }
          }]
      };
    var initEchart = function (data) {
      if (!data || data == undefined) {
        return;
      }
      $scope.title1 = data.stockTurnoverDays[0].lable;
      getBarLineChart(data.stockTurnoverDays, 'chart1', trendOption1);
      $scope.title2 = data.stockStockage[0].lable;
      getStockStockage(data.stockStockage, 'chart2', trendOption2);
      $scope.title3 = data.stockUnbilledAmount[0].lable;
      getBarLineChart(data.stockUnbilledAmount, 'chart3', trendOption3);
    };
    var initializeChartSize = function () {
      $timeout.cancel($scope.layout);
      $scope.layout = $timeout(function () {
        initEchart($scope.buData);
      }, 80);
    };
    var getOverviewData = function (buShortName) {
      var param = { 'entityName': buShortName };
      $http.post($rootScope.settings.api + '/finance/buData', param).success(function (json) {
        $scope.buData = json;
        initEchart($scope.buData);
      }).error(function () {
        console.log('\u8bf7\u6c42error,\u53d6\u5047\u6570\u636e');
        $scope.buData = buData;
        initEchart($scope.buData);
      });
    };
    //库龄分析
    var getMixBarChart = function (data, chart, option) {
      //x
      var xAxisObject = new Object();
      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        if (xAxisObject[item.xAxisValue] == undefined) {
          xAxisObject[item.xAxisValue] = new Object();
        }
        xAxisObject[item.xAxisValue][item.yAxisLabel] = data[i].yAxisValue * 100;
      }
      var xAxisData = Object.getOwnPropertyNames(xAxisObject);
      // console.log(data);
      //y
      var stack = data[0].lable;
      var series = new Array();
      // var legend = Object.getOwnPropertyNames(xAxisObject[xAxisData[0]]);  //顺序问题
      var legend = [
          'x<=1',
          '1<x<=7',
          '7<x<=30',
          'x>30'
        ];
      for (var i = 0; i < xAxisData.length; i++) {
        for (var j = 0; j < legend.length; j++) {
          if (series[j] == undefined) {
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
      var chart = echarts.init(document.getElementById(chart), theme);
      chart.setOption(stockageMonthOption);
    };
    //双轴
    var getBarLineChart = function (data, chart, option) {
      //x
      var xAxisObject = new Object();
      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        if (xAxisObject[item.xAxisValue] == undefined) {
          xAxisObject[item.xAxisValue] = new Object();
        }
        xAxisObject[item.xAxisValue][item.yAxisLabel] = data[i].yAxisValue;
      }
      var xAxisData = Object.getOwnPropertyNames(xAxisObject);
      var series = new Array();
      var legend = Object.getOwnPropertyNames(xAxisObject[xAxisData[0]]);
      console.log(legend);
      for (var i = 0; i < xAxisData.length; i++) {
        for (var j = 0; j < legend.length; j++) {
          if (series[j] == undefined) {
            series[j] = new Object();
            series[j].name = legend[j];
            series[j].type = 'line';
            // series[j].stack = stack;
            series[j].data = new Array();
            if (xAxisObject[xAxisData[i]][legend[j]] > 100) {
              series[j].type = 'bar';
              series[j].yAxisIndex = 0;
            } else {
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
      var chart = echarts.init(document.getElementById(chart), theme);
      chart.setOption(turnoverDaysOption);
    };
    //趋势分析
    var getStockStockage = function (data, chart, option) {
      //x
      var xAxisObject = new Object();
      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        if (xAxisObject[item.xAxisValue] == undefined) {
          xAxisObject[item.xAxisValue] = new Object();
        }
        xAxisObject[item.xAxisValue][item.yAxisLabel] = data[i].yAxisValue;
      }
      var xAxisData = Object.getOwnPropertyNames(xAxisObject);
      var series = new Array();
      var legend = Object.getOwnPropertyNames(xAxisObject[xAxisData[0]]);
      console.log(legend);
      for (var i = 0; i < xAxisData.length; i++) {
        for (var j = 0; j < legend.length; j++) {
          if (series[j] == undefined) {
            series[j] = new Object();
            series[j].name = legend[j];
            series[j].type = 'bar';
            // series[j].stack = stack;
            series[j].data = new Array();
            if (legend[j].indexOf('T1') != -1) {
              series[j].type = 'line';
              series[j].yAxisIndex = 1;
            } else if (legend[j].indexOf('T2') != -1) {
              series[j].type = 'line';
              series[j].yAxisIndex = 1;
            } else if (legend[j].indexOf('T3') != -1) {
              series[j].type = 'line';
              series[j].yAxisIndex = 1;
            } else if (legend[j].indexOf('Actual') != -1) {
              series[j].type = 'bar';
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
      var chart = echarts.init(document.getElementById(chart), theme);
      chart.setOption(turnoverDaysOption);
    };
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
  }
]);
;
angular.module('SeanApp').controller('HRFactoryController', [
  '$rootScope',
  '$scope',
  '$http',
  '$timeout',
  '$window',
  function ($rootScope, $scope, $http, $timeout, $window) {
    var widgetHeight;
    $scope.$on('ngRepeatFinished', function (repeatFinishedEvent) {
    });
    $scope.$on('$viewContentLoaded', function () {
      initWidgetHeight();
      getfilterList();
      getOverviewData('BU1', 'Conversion Cost/EQU');
      angular.element('.fullscreen').bind('click', function () {
        initializeChartSize();
      });
      $(window).resize(function () {
        initializeChartSize();
      });
    });
    var initWidgetHeight = function () {
      var height = $(window).height() - 63.99 - 77.78 - 18.89 - 50;
      $('.page-content').css('min-height', height);
      widgetHeight = (height - 77.8 - 60) / 2 - 20;
      $('.yfops-widget').css('min-height', widgetHeight);
    };
    //单轴
    var trendOption1 = {
        tooltip: { trigger: 'axis' },
        legend: { bottom: 48 },
        grid: {
          show: false,
          x: 40,
          y: 10,
          x2: 30,
          y2: 98
        },
        xAxis: [{ type: 'category' }],
        yAxis: [{
            type: 'value',
            name: '',
            axisLabel: {
              formatter: function (value) {
                return value;
              }
            }
          }],
        series: [],
        dataZoom: [{
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
            textStyle: { color: '#fff' }
          }]
      };
    //双轴
    var trendOption2 = {
        tooltip: { trigger: 'axis' },
        legend: { bottom: 48 },
        grid: {
          show: false,
          x: 40,
          y: 10,
          x2: 30,
          y2: 148
        },
        xAxis: [{ type: 'category' }],
        yAxis: [
          {
            type: 'value',
            name: '',
            axisLabel: {
              formatter: function (value) {
                return value;
              }
            }
          },
          {
            type: 'value',
            name: '',
            axisLabel: { formatter: '{value}' }
          }
        ],
        series: [],
        dataZoom: [{
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
            textStyle: { color: '#fff' }
          }]
      };
    var ageOption = {
        tooltip: { trigger: 'axis' },
        legend: { bottom: 48 },
        grid: {
          show: false,
          x: 38,
          y: 10,
          x2: 20,
          y2: 128
        },
        xAxis: [{ type: 'category' }],
        yAxis: [{
            type: 'value',
            name: '',
            interval: 20,
            axisLabel: { formatter: '{value}' }
          }],
        series: [],
        dataZoom: [{
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
            textStyle: { color: '#fff' }
          }]
      };
    var initEchart = function (data) {
      if (!data || data == undefined) {
        return;
      }
      console.log(data);
      $scope.title1 = data.totalLaborHoursDivideEQU[0].lable;
      getBarLineChart(data.totalLaborHoursDivideEQU, 'chart1', trendOption2);
    };
    var initializeChartSize = function () {
      $timeout.cancel($scope.layout);
      $scope.layout = $timeout(function () {
        initEchart($scope.overviewData);
      }, 80);
    };
    var getfilterListSuccess = function (list) {
      $scope.filterList = new Array();
      for (var i = 0; i < list.length; i++) {
        $scope.filterList.push(list[i].businessCat3);
      }
    };
    var getfilterList = function () {
      ///////真数据
      $http.get($rootScope.settings.api + '/bbp/queryFilter').success(function (json) {
        $scope.filterListObject = json.filterList;
        getfilterListSuccess($scope.filterListObject);
      }).error(function () {
        ///////假数据
        $scope.filterListObject = queryFilter.filterList;
        getfilterListSuccess($scope.filterListObject);
      });
    };
    $scope.setFilter = function (costType) {
      console.log(costType);
      getOverviewData($rootScope.entityName || 'BU1', costType);
    };
    var getOverviewData = function (entityName, costType) {
      var param = {
          'entityName': entityName,
          'costType': costType
        };
      $http.post($rootScope.settings.api + '/bbp/queryOverviewData', param).success(function (json) {
        $scope.overviewData = json;
        initEchart($scope.overviewData);
      }).error(function () {
        ////假数据
        $scope.overviewData = hrQueryFactoryData;
        initEchart($scope.overviewData);
      });
    };
    var getBarLineChart = function (data, chart, option) {
      //x
      var xAxisObject = new Object();
      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        if (xAxisObject[item.xAxisValue] == undefined) {
          xAxisObject[item.xAxisValue] = new Object();
        }
        xAxisObject[item.xAxisValue][item.yAxisLabel] = data[i].yAxisValue;
      }
      var xAxisData = Object.getOwnPropertyNames(xAxisObject);
      var series = new Array();
      var legend = Object.getOwnPropertyNames(xAxisObject[xAxisData[0]]);
      for (var i = 0; i < xAxisData.length; i++) {
        for (var j = 0; j < legend.length; j++) {
          if (series[j] == undefined) {
            series[j] = new Object();
            series[j].name = legend[j];
            series[j].type = 'line';
            // series[j].stack = stack;
            series[j].data = new Array();
            if (xAxisObject[xAxisData[i]][legend[j]] > 100) {
              series[j].type = 'bar';
              series[j].yAxisIndex = 0;
            } else {
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
      var chart = echarts.init(document.getElementById(chart), theme);
      chart.setOption(turnoverDaysOption);
    };
    var getMixBarChart = function (data, chart, option) {
      //x
      var xAxisObject = new Object();
      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        if (xAxisObject[item.xAxisValue] == undefined) {
          xAxisObject[item.xAxisValue] = new Object();
        }
        xAxisObject[item.xAxisValue][item.yAxisLabel] = data[i].yAxisValue * 100;
        console.log(data[i].yAxisValue);
      }
      var xAxisData = Object.getOwnPropertyNames(xAxisObject);
      console.log(xAxisObject);
      //y
      var stack = data[0].lable;
      var series = new Array();
      var legend = Object.getOwnPropertyNames(xAxisObject[xAxisData[0]]);
      //顺序问题
      // var legend = ['x<=1','1<x<=7','7<x<=30','x>30'];
      for (var i = 0; i < xAxisData.length; i++) {
        for (var j = 0; j < legend.length; j++) {
          if (series[j] == undefined) {
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
      var chart = echarts.init(document.getElementById(chart), theme);
      chart.setOption(stockageMonthOption);
    };
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
  }
]);
;
angular.module('SeanApp').controller('HROverviewController', [
  '$rootScope',
  '$scope',
  '$http',
  '$timeout',
  '$window',
  function ($rootScope, $scope, $http, $timeout, $window) {
    var widgetHeight;
    $scope.$on('ngRepeatFinished', function (repeatFinishedEvent) {
    });
    $scope.$on('$viewContentLoaded', function () {
      initWidgetHeight();
      getfilterList();
      getOverviewData('BU1', 'Conversion Cost/EQU');
      angular.element('.fullscreen').bind('click', function () {
        initializeChartSize();
      });
      $(window).resize(function () {
        initializeChartSize();
      });
    });
    var initWidgetHeight = function () {
      var height = $(window).height() - 63.99 - 77.78 - 18.89 - 50;
      $('.page-content').css('min-height', height);
      widgetHeight = (height - 77.8 - 60) / 2 - 20;
      $('.yfops-widget').css('min-height', widgetHeight);
    };
    //单轴
    var trendOption1 = {
        tooltip: { trigger: 'axis' },
        legend: { bottom: 48 },
        grid: {
          show: false,
          x: 40,
          y: 10,
          x2: 30,
          y2: 98
        },
        xAxis: [{ type: 'category' }],
        yAxis: [{
            type: 'value',
            name: '',
            axisLabel: {
              formatter: function (value) {
                return value;
              }
            }
          }],
        series: [],
        dataZoom: [{
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
            textStyle: { color: '#fff' }
          }]
      };
    //双轴
    var trendOption2 = {
        tooltip: { trigger: 'axis' },
        legend: { bottom: 48 },
        grid: {
          show: false,
          x: 40,
          y: 10,
          x2: 30,
          y2: 148
        },
        xAxis: [{ type: 'category' }],
        yAxis: [
          {
            type: 'value',
            name: '',
            axisLabel: {
              formatter: function (value) {
                return value;
              }
            }
          },
          {
            type: 'value',
            name: '',
            axisLabel: { formatter: '{value}' }
          }
        ],
        series: [],
        dataZoom: [{
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
            textStyle: { color: '#fff' }
          }]
      };
    var ageOption = {
        tooltip: { trigger: 'axis' },
        legend: { bottom: 48 },
        grid: {
          show: false,
          x: 38,
          y: 10,
          x2: 20,
          y2: 128
        },
        xAxis: [{ type: 'category' }],
        yAxis: [{
            type: 'value',
            name: '',
            interval: 20,
            axisLabel: { formatter: '{value}' }
          }],
        series: [],
        dataZoom: [{
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
            textStyle: { color: '#fff' }
          }]
      };
    var initEchart = function (data) {
      if (!data || data == undefined) {
        return;
      }
      $scope.title1 = data.totalLaborhoursDivideEQUTrendMonth[0].lable;
      getBarLineChart(data.totalLaborhoursDivideEQUTrendMonth, 'chart1', trendOption2);
      $scope.title2 = data.totalLaborhoursDivideEQUClassMonth[0].lable;
      getBarLineChart(data.totalLaborhoursDivideEQUClassMonth, 'chart2', trendOption2);
      $scope.title3 = data.totalLaborhoursDivideEQUTrendYear[0].lable;
      getMixBarChart(data.totalLaborhoursDivideEQUTrendYear, 'chart3', ageOption);
      $scope.title4 = data.totalLaborhoursDivideEQUClassYear[0].lable;
      getMixBarChart(data.totalLaborhoursDivideEQUClassYear, 'chart4', ageOption);
    };
    var initializeChartSize = function () {
      $timeout.cancel($scope.layout);
      $scope.layout = $timeout(function () {
        initEchart($scope.overviewData);
      }, 80);
    };
    var getfilterListSuccess = function (list) {
      $scope.filterList = new Array();
      for (var i = 0; i < list.length; i++) {
        $scope.filterList.push(list[i].businessCat3);
      }
    };
    var getfilterList = function () {
      ///////真数据
      $http.get($rootScope.settings.api + '/bbp/queryFilter').success(function (json) {
        $scope.filterListObject = json.filterList;
        getfilterListSuccess($scope.filterListObject);
      }).error(function () {
        ///////假数据
        $scope.filterListObject = queryFilter.filterList;
        getfilterListSuccess($scope.filterListObject);
      });
    };
    $scope.setFilter = function (costType) {
      console.log(costType);
      getOverviewData($rootScope.entityName || 'BU1', costType);
    };
    var getOverviewData = function (entityName, costType) {
      var param = {
          'entityName': entityName,
          'costType': costType
        };
      $http.post($rootScope.settings.api + '/bbp/queryOverviewData', param).success(function (json) {
        $scope.overviewData = json;
        initEchart($scope.overviewData);
      }).error(function () {
        ////假数据
        $scope.overviewData = hrQueryOverviewData;
        initEchart($scope.overviewData);
      });
    };
    var getBarLineChart = function (data, chart, option) {
      //x
      var xAxisObject = new Object();
      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        if (xAxisObject[item.xAxisValue] == undefined) {
          xAxisObject[item.xAxisValue] = new Object();
        }
        xAxisObject[item.xAxisValue][item.yAxisLabel] = data[i].yAxisValue;
      }
      var xAxisData = Object.getOwnPropertyNames(xAxisObject);
      var series = new Array();
      var legend = Object.getOwnPropertyNames(xAxisObject[xAxisData[0]]);
      for (var i = 0; i < xAxisData.length; i++) {
        for (var j = 0; j < legend.length; j++) {
          if (series[j] == undefined) {
            series[j] = new Object();
            series[j].name = legend[j];
            series[j].type = 'line';
            // series[j].stack = stack;
            series[j].data = new Array();
            if (xAxisObject[xAxisData[i]][legend[j]] > 100) {
              series[j].type = 'bar';
              series[j].yAxisIndex = 0;
            } else {
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
      var chart = echarts.init(document.getElementById(chart), theme);
      chart.setOption(turnoverDaysOption);
    };
    var getMixBarChart = function (data, chart, option) {
      //x
      var xAxisObject = new Object();
      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        if (xAxisObject[item.xAxisValue] == undefined) {
          xAxisObject[item.xAxisValue] = new Object();
        }
        xAxisObject[item.xAxisValue][item.yAxisLabel] = data[i].yAxisValue * 100;
      }
      var xAxisData = Object.getOwnPropertyNames(xAxisObject);
      //y
      var stack = data[0].lable;
      var series = new Array();
      var legend = Object.getOwnPropertyNames(xAxisObject[xAxisData[0]]);
      //顺序问题
      // var legend = ['x<=1','1<x<=7','7<x<=30','x>30'];
      for (var i = 0; i < xAxisData.length; i++) {
        for (var j = 0; j < legend.length; j++) {
          if (series[j] == undefined) {
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
      var chart = echarts.init(document.getElementById(chart), theme);
      chart.setOption(stockageMonthOption);
    };
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
  }
]);
;
angular.module('SeanApp').controller('LoginController', [
  '$rootScope',
  '$scope',
  '$http',
  '$state',
  '$window',
  function ($rootScope, $scope, $http, $state, $window) {
    var widgetHeight;
    $scope.$on('$viewContentLoaded', function () {
      $.backstretch(['css/p8.jpg'], {
        fade: 0,
        duration: 10000
      });
    });
    $scope.request = {};
    $scope.login = function () {
      //TODO: static login
      $state.go('dashboard');
      $http.post($rootScope.settings.api + '/user/login', $scope.request, function (json) {
        console.log(json);
      });
    };
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
  }
]);