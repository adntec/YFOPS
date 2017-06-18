;
angular.module('SeanApp').controller('BBPFactoryController', [
  '$rootScope',
  '$scope',
  '$http',
  '$timeout',
  '$window',
  '$state',
  function ($rootScope, $scope, $http, $timeout, $window, $state) {
    var widgetHeight;
    $scope.charts = new Array();
    $scope.option = new Array();
    $scope.$on('ngRepeatFinished', function (repeatFinishedEvent) {
    });
    $scope.$on('$viewContentLoaded', function () {
      $('.portlet .fa-download,.portlet .fa-search-plus').bind('click', function () {
        var id = $(this).parents('.portlet').find('.ops-chart').attr('id');
        var title = $(this).parents('.portlet').find('.caption-subject').html();
        window.localStorage.setItem('chartOption', JSON.stringify($scope.option[id]));
        window.localStorage.setItem('title', title);
        $state.go('chart');
      });
      initWidgetHeight();
      $scope.getfilterList();
      $scope.timer = $timeout(function () {
        $scope.timeout = null;
        angular.element($window).bind('resize', function () {
          $scope.timeout = $timeout(function () {
            $scope.initEchart($scope.overviewData);
            $timeout.cancel($scope.timeout);
          }, 300);
        });
      }, 600);
      $scope.$on('$destroy', function (event) {
        $timeout.cancel($scope.timer);
        angular.element($window).unbind('resize');
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
        xAxis: [{
            type: 'category',
            axisLabel: {
              interval: 0,
              rotate: 45,
              margin: 6
            }
          }],
        yAxis: [{
            type: 'value',
            name: '',
            axisLabel: {
              formatter: function (value) {
                return value;
              }
            },
            splitLine: { show: false }
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
    //双轴
    var trendOption2 = {
        tooltip: { trigger: 'axis' },
        legend: { bottom: 48 },
        grid: {
          show: false,
          x: 42,
          y: 26,
          x2: 30,
          y2: 148
        },
        xAxis: [{
            type: 'category',
            axisLabel: {
              interval: 0,
              rotate: 45,
              margin: 6
            }
          }],
        yAxis: [{
            type: 'value',
            name: '',
            axisLabel: { formatter: '{value}' },
            splitLine: { show: false }
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
        xAxis: [{
            type: 'category',
            axisLabel: {
              interval: 0,
              rotate: 45,
              margin: 6
            }
          }],
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
    $scope.initEchart = function (data) {
      if (!data || data == undefined) {
        return;
      }
      try {
        $scope.title1 = data.ciSaving[0].lable;
        $scope.getBarLineChartExtra(data.ciSaving, 'chart1', trendOption2);
      } catch (e) {
      }
      try {
        $scope.title2 = data.conversionCostDivideEQU[0].lable;
        $scope.getBarLineChart(data.conversionCostDivideEQU, 'chart2', trendOption2);
      } catch (e) {
      }
    };
    // var initializeChartSize = function() {
    //     $timeout.cancel($scope.layout);
    //     $scope.layout = $timeout(function(){
    //         initEchart($scope.overviewData);
    //     },80);
    // };
    $scope.getfilterListSuccess = function (list) {
      // console.log(list);
      $scope.filterList = new Array();
      for (var i = 0; i < list.length; i++) {
        $scope.filterList.push(list[i].businessCat3);
      }
      $scope.setFilter($scope.currentFilter || $scope.filterList[0]);
    };
    $scope.getfilterList = function () {
      ///////真数据
      $http.get($rootScope.settings.api + '/bbp/queryFilter').success(function (json) {
        $scope.filterListObject = json.filterList;
        $scope.getfilterListSuccess($scope.filterListObject);
      }).error(function () {
        console.log('/bbp/queryFilter error', '');
        ///////假数据
        $scope.filterListObject = bbpQueryFilter.filterList;
        $scope.getfilterListSuccess($scope.filterListObject);
      });
    };
    $scope.setFilter = function (filter) {
      $scope.currentFilter = filter;
      $scope.getOverviewData($rootScope.buCodeShortName, $scope.currentFilter);
    };
    $scope.$on('onSelectedPBU', function (buShortName) {
      window.location.href = '#/BBPOverview';
    });
    $scope.getOverviewData = function (entityName, costType) {
      var param = {
          'entityName': entityName || 'JIT PBU',
          'costType': costType
        };
      $http.post($rootScope.settings.api + '/bbp/queryFactoryData', param).success(function (json) {
        $scope.overviewData = json;
        $scope.initEchart($scope.overviewData);
      }).error(function () {
        ////假数据
        $scope.overviewData = bbpQueryFactoryData;
        $scope.initEchart($scope.overviewData);
      });
    };
    $scope.getBarLineChartExtra = function (data, chart, option) {
      //x
      var xAxisObject = new Object();
      var typeObject = new Object();
      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        if (xAxisObject[item.xAxisValue] == undefined) {
          xAxisObject[item.xAxisValue] = new Object();
          typeObject[item.xAxisValue] = new Object();
        }
        xAxisObject[item.xAxisValue][item.yAxisLabel] = data[i].yAxisValue;
        typeObject[item.xAxisValue][item.yAxisLabel] = data[i].axisNo;  //TODO
      }
      var xAxisData = Object.getOwnPropertyNames(xAxisObject);
      var series = new Array();
      var legend = Object.getOwnPropertyNames(xAxisObject[xAxisData[0]]);
      //顺序问题 
      // var legend = ['CI-Saving-Act','CI-Saving-T1','CI-Saving-T2','CI-Saving-T3']//Object.getOwnPropertyNames(xAxisObject[xAxisData[0]]);
      for (var i = 0; i < xAxisData.length; i++) {
        for (var j = 0; j < legend.length; j++) {
          if (series[j] == undefined) {
            series[j] = new Object();
            series[j].name = legend[j];
            series[j].type = 'bar';
            // series[j].stack = stack;
            series[j].data = new Array();
            if (typeObject[xAxisData[i]][legend[j]] == 1) {
              series[j].type = 'line';
            } else if (typeObject[xAxisData[i]][legend[j]] == 0) {
              series[j].type = 'bar';
            }
          }
          series[j].data.push(xAxisObject[xAxisData[i]][legend[j]] || 0);
        }
      }
      //set chart option
      $scope.option[chart] = angular.copy(option);
      $scope.option[chart].legend.data = legend;
      //默认勾选T2 Act
      $scope.option[chart].legend.selected = new Object();
      for (var i = 0; i < legend.length; i++) {
        $scope.option[chart].legend.selected[legend[i]] = false;
        if (legend[i].indexOf('T2') != -1 || legend[i].indexOf('Act') != -1 || legend[i].indexOf('BM') != -1) {
          $scope.option[chart].legend.selected[legend[i]] = true;
        }
      }
      $scope.option[chart].xAxis[0].data = xAxisData;
      $scope.option[chart].series = series;
      $scope.option[chart].yAxis[0].name = data[0].unit != undefined ? '(' + data[0].unit + ')' : '';
      $scope.charts[chart] = echarts.init(document.getElementById(chart), theme);
      $scope.charts[chart].setOption($scope.option[chart]);
    };
    $scope.getBarLineChart = function (data, chart, option) {
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
            if (legend[j].indexOf('Act') > -1) {
              series[j].type = 'bar';  // series[j].yAxisIndex = 0;
            } else {
              series[j].type = 'line';  // series[j].yAxisIndex = 1;
            }
          }
          series[j].data.push(xAxisObject[xAxisData[i]][legend[j]] || 0);
        }
      }
      //set chart option
      $scope.option[chart] = angular.copy(option);
      $scope.option[chart].legend.data = legend;
      //默认勾选T2 Act
      $scope.option[chart].legend.selected = new Object();
      for (var i = 0; i < legend.length; i++) {
        $scope.option[chart].legend.selected[legend[i]] = false;
        if (legend[i].indexOf('T2') != -1 || legend[i].indexOf('Act') != -1 || legend[i].indexOf('BM') != -1) {
          $scope.option[chart].legend.selected[legend[i]] = true;
        }
      }
      $scope.option[chart].yAxis[0].name = data[0].unit != undefined ? '(' + data[0].unit + ')' : '';
      $scope.option[chart].xAxis[0].data = xAxisData;
      $scope.option[chart].series = series;
      $scope.charts[chart] = echarts.init(document.getElementById(chart), theme);
      $scope.charts[chart].setOption($scope.option[chart]);
    };
    $scope.getMixBarChart = function (data, chart, option) {
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
      $scope.option[chart] = angular.copy(option);
      $scope.option[chart].legend.data = legend;
      //默认勾选T2 Act
      $scope.option[chart].legend.selected = new Object();
      for (var i = 0; i < legend.length; i++) {
        $scope.option[chart].legend.selected[legend[i]] = false;
        if (legend[i].indexOf('T2') != -1 || legend[i].indexOf('Act') != -1 || legend[i].indexOf('BM') != -1) {
          $scope.option[chart].legend.selected[legend[i]] = true;
        }
      }
      $scope.option[chart].yAxis[0].name = data[0].unit != undefined ? '(' + data[0].unit + ')' : '';
      $scope.option[chart].xAxis[0].data = xAxisData;
      $scope.option[chart].series = series;
      $scope.charts[chart] = echarts.init(document.getElementById(chart), theme);
      $scope.charts[chart].setOption($scope.option[chart]);
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
  '$state',
  function ($rootScope, $scope, $http, $timeout, $window, $state) {
    var widgetHeight;
    $scope.charts = new Array();
    $scope.option = new Array();
    $scope.$on('ngRepeatFinished', function (repeatFinishedEvent) {
    });
    $scope.$on('$viewContentLoaded', function () {
      $('.portlet .fa-download,.portlet .fa-search-plus').bind('click', function () {
        var id = $(this).parents('.portlet').find('.ops-chart').attr('id');
        var title = $(this).parents('.portlet').find('.caption-subject').html();
        window.localStorage.setItem('chartOption', JSON.stringify($scope.option[id]));
        window.localStorage.setItem('title', title);
        $state.go('chart');
      });
      initWidgetHeight();
      $scope.getfilterList();
      $scope.timer = $timeout(function () {
        $scope.timeout = null;
        angular.element($window).bind('resize', function () {
          $scope.timeout = $timeout(function () {
            $scope.initEchart($scope.overviewData);
            $timeout.cancel($scope.timeout);
          }, 300);
        });
      }, 600);
      $scope.$on('$destroy', function (event) {
        $timeout.cancel($scope.timer);
        angular.element($window).unbind('resize');
      });
    });
    //单轴
    var trendOption1 = {
        tooltip: { trigger: 'axis' },
        legend: {
          bottom: 48,
          data: []
        },
        grid: {
          show: false,
          x: 41,
          y: 26,
          x2: 30,
          y2: 128
        },
        xAxis: [{
            type: 'category',
            axisLabel: {
              interval: 0,
              rotate: 45,
              margin: 6
            },
            data: []
          }],
        yAxis: [{
            type: 'value',
            name: '',
            axisLabel: {
              formatter: function (value) {
                var val = value;
                if (value >= 100000000) {
                  val = value / 100000000 + '\u4ebf';
                } else if (value >= 10000) {
                  val = value / 10000 + '\u4e07';
                }
                return val;
              }
            },
            splitLine: { show: false }
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
    //双轴 亿
    var trendOption2 = {
        tooltip: { trigger: 'axis' },
        legend: {
          bottom: 48,
          data: []
        },
        grid: {
          show: false,
          x: 47,
          y: 30,
          x2: 46,
          y2: 158
        },
        xAxis: [{
            type: 'category',
            axisLabel: {
              interval: 0,
              rotate: 45,
              margin: 6
            },
            data: []
          }],
        yAxis: [
          {
            type: 'value',
            name: '',
            axisLabel: {
              formatter: function (value) {
                var val = value;
                if (value >= 100000000) {
                  val = value / 100000000 + '\u4ebf';
                } else if (value >= 10000) {
                  val = value / 10000 + '\u4e07';
                }
                return val;
              }
            },
            splitLine: { show: false }
          },
          {
            type: 'value',
            name: '',
            axisLabel: {
              formatter: function (value) {
                var val = value;
                if (value >= 100000000) {
                  val = value / 100000000 + '\u4ebf';
                } else if (value >= 10000) {
                  val = value / 10000 + '\u4e07';
                }
                return val;
              }
            },
            splitLine: { show: false }
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
    //双轴 常规
    var trendOptionNormal = {
        tooltip: { trigger: 'axis' },
        legend: {
          bottom: 48,
          data: []
        },
        grid: {
          show: false,
          x: 51,
          y: 26,
          x2: 30,
          y2: 158
        },
        xAxis: [{
            type: 'category',
            axisLabel: {
              interval: 0,
              rotate: 45,
              margin: 6
            },
            data: []
          }],
        yAxis: [{
            type: 'value',
            name: '',
            axisLabel: {
              formatter: function (value) {
                var val = value;
                if (value >= 100000000) {
                  val = value / 100000000 + '\u4ebf';
                } else if (value >= 10000) {
                  val = value / 10000 + '\u4e07';
                }
                return val;
              }
            },
            splitLine: { show: false }
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
          x: 40,
          y: 26,
          x2: 20,
          y2: 128
        },
        xAxis: [{
            type: 'category',
            axisLabel: {
              interval: 0,
              rotate: 45,
              margin: 6
            }
          }],
        yAxis: [{
            type: 'value',
            name: '',
            min: 0,
            max: 6000,
            interval: 1000,
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
    var initWidgetHeight = function () {
      var height = $(window).height() - 63.99 - 77.78 - 18.89 - 50;
      $('.page-content').css('min-height', height);
      widgetHeight = 274;
      // (height -77.8 -60) / 2 ;
      $('.yfops-widget').css('min-height', widgetHeight);
      $('.yfops-map').css('min-height', widgetHeight - 4);
    };
    $scope.initEchart = function (data) {
      if (!data || data == undefined) {
        return;
      }
      console.log(data);
      var valueArray = [
          data.conversionCostDivideEQU,
          data.equ,
          data.ciSaving,
          data.conversionCost
        ];
      $scope.values = new Array();
      for (var i = 0; i < valueArray.length; i++) {
        if (valueArray[i].length == 0)
          continue;
        $scope.values[i] = new Object();
        if (valueArray[i][0].axisValue > valueArray[i][1].axisValue) {
          $scope.values[i].state = 'up';
        } else if (valueArray[i][0].axisValue < valueArray[i][1].axisValue) {
          $scope.values[i].state = 'down';
        } else {
          $scope.values[i].state = 'equals';
        }
        $scope.values[i].axisValue = valueArray[i][0].axisValue;
        $scope.values[i].percent = valueArray[i][0].axisValue / valueArray[i][1].axisValue * 100;
        $scope.values[i].lable = valueArray[i][0].lable;
        $scope.values[i].axis = valueArray[i][0].axis + '/' + valueArray[i][1].axis;
        $scope.values[i].unit = valueArray[i][0].unit;
      }
      try {
        $scope.title1 = data.conversionCostDivideEQUTrendMonth[0].lable;
        $scope.getBarLineChartDefault(data.conversionCostDivideEQUTrendMonth, 'chart1', trendOption2, 50, 100);
      } catch (e) {
      }
      try {
        $scope.title2 = data.conversionCostDivideEQUTrendYear[0].lable;
        $scope.getBarLineChartDefault(data.conversionCostDivideEQUTrendYear, 'chart2', trendOption2, 85, 100);
      } catch (e) {
      }
      try {
        $scope.title3 = data.conversionCostDivideEQUClassMonth[0].lable;
        $scope.getLineMixBarChart(data.conversionCostDivideEQUClassMonth, 'chart3', trendOptionNormal, 50, 100);
      } catch (e) {
      }
      try {
        $scope.title4 = data.conversionCostDivideEQUClassYear[0].lable;
        $scope.getLineMixBarChart(data.conversionCostDivideEQUClassYear, 'chart4', trendOptionNormal, 85, 100);
      } catch (e) {
      }
      try {
        $scope.title5 = data.ciSavingTrendMonth[0].lable;
        $scope.getBarLineChart(data.ciSavingTrendMonth, 'chart5', trendOption1, 50, 100);
      } catch (e) {
      }
      try {
        $scope.title6 = data.ciSavingTrendYear[0].lable;
        $scope.getBarLineChart(data.ciSavingTrendYear, 'chart6', trendOption1, 85, 100);
      } catch (e) {
      }
    };
    $scope.getfilterList = function () {
      ///////真数据
      $http.get($rootScope.settings.api + '/bbp/queryFilter').success(function (json) {
        $scope.filterListObject = json.filterList;
        $scope.getfilterListSuccess($scope.filterListObject);
        $scope.getBuList('JIT PBU');
      }).error(function () {
        toastr.clear();
        console.log('/bbp/queryFilter \u8bf7\u6c42error', '');
        ///////假数据
        $scope.filterListObject = bbpQueryFilter.filterList;
        $scope.getfilterListSuccess($scope.filterListObject);
        $scope.getBuList('JIT PBU');
      });
    };
    $scope.getfilterListSuccess = function (list) {
      $scope.filterList = new Array();
      for (var i = 0; i < list.length; i++) {
        $scope.filterList.push(list[i].businessCat3);
      }
      $scope.setFilter($scope.filterList[0]);
    };
    $scope.setFilter = function (filter) {
      console.log(filter);
      $scope.currentFilter = filter;
      $scope.getOverviewData($rootScope.entityShortName || 'JIT PBU', $scope.currentFilter);
    };
    $scope.getBuListSuccess = function (buList) {
      $rootScope.BuList = new Object();
      $rootScope.ALLBuList = new Array();
      for (var i = 0; i < buList.length; i++) {
        var shortName = buList[i].buCodeShortName;
        if (shortName == null)
          continue;
        if ($rootScope.BuList[shortName] == undefined) {
          $rootScope.BuList[shortName] = new Array();
        }
        $rootScope.BuList[shortName].push(buList[i]);
        $rootScope.ALLBuList.push(buList[i]);
      }
      //bu列表
      $rootScope.BuNameList = Object.getOwnPropertyNames($rootScope.BuList);
      $rootScope.BuNameList = $rootScope.BuNameList.sort();
      // $rootScope.pubCodeShortName = buList[0].pubCodeShortName;
      // $rootScope.buCodeShortName = $rootScope.BuList[$rootScope.BuNameList[0]][0].buCodeShortName;
      $rootScope.entityShortName = $state.params['id'] || buList[0].pubCodeShortName || 'JIT PBU';
      console.log('shortName:' + $rootScope.entityShortName);
    };
    $scope.getBuList = function (pubCodeShortName) {
      $rootScope.pubCodeShortName = pubCodeShortName;
      $http.get($rootScope.settings.api + '/finance/queryBuList').success(function (json) {
        ///////真数据
        $scope.BuListObject = json.BuList;
        $scope.getBuListSuccess($scope.BuListObject);
        $scope.getOverviewData($rootScope.entityShortName, $scope.currentFilter);
        $scope.refreshChinaMap($rootScope.entityShortName);
      }).error(function () {
        console.log('\u8bf7\u6c42error,\u53d6\u5047\u6570\u636e');
        $scope.BuListObject = queryBuList.BuList;
        $scope.getBuListSuccess($scope.BuListObject);
        $scope.getOverviewData($rootScope.entityShortName, $scope.currentFilter);
        $scope.refreshChinaMap($rootScope.entityShortName);
      });
    };
    $scope.$on('onSelectedPBU', function (scope, buShortName) {
      // $rootScope.buCodeShortName = buShortName;
      // $rootScope.entityShortName = buShortName;
      // $scope.getOverviewData($rootScope.entityShortName, $scope.currentFilter);
      // $scope.refreshChinaMap($rootScope.entityShortName);
      // $('.yfops-sparkline li.active').removeClass('active');
      window.location.href = '#/BBPOverview';
    });
    $scope.selectBU = function (buShortName, $event) {
      // $rootScope.buCodeShortName = buShortName;
      // $rootScope.entityShortName = buShortName;
      // $('.yfops-sparkline li.active').removeClass('active');
      // $($event.currentTarget).addClass('active');
      // $scope.getOverviewData($rootScope.entityShortName, $scope.currentFilter);
      // $scope.refreshChinaMap(buShortName);
      window.location.href = '#/bbp/' + buShortName;
    };
    $scope.refreshChinaMap = function (buShortName) {
      var locations = new Array();
      var keys;
      if (buShortName != 'JIT PBU' && $rootScope.BuList[buShortName] != undefined) {
        keys = $rootScope.BuList[buShortName];
      } else {
        keys = $rootScope.ALLBuList;
      }
      for (var i = 0; i < keys.length; i++) {
        var entity = {
            'action': 'tooltip',
            'id': keys[i].entityCode,
            'title': keys[i].entityShortName,
            'description': keys[i].entityShortName,
            'link': '#/bbp/' + keys[i].entityShortName,
            'x': keys[i].axisX || 0,
            'y': keys[i].axisY || 0
          };
        locations.push(entity);
      }
      var option = angular.copy(mapOption);
      option.levels[0].locations = locations;
      $scope.initChinaMap(option);
    };
    $scope.initChinaMap = function (option) {
      if ($('#mapplic').size() === 0) {
        return;
      }
      $('#mapplic').html('').data('mapplic', null);
      var h = widgetHeight - 2;
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
    $scope.$on('onSelectedPBU', function (scope, buShortName) {
      $rootScope.buCodeShortName = buShortName;
      $rootScope.entityShortName = buShortName;
      $scope.getOverviewData($rootScope.entityShortName, $scope.currentFilter);
    });
    $scope.getOverviewData = function (entityName, costType) {
      var param = {
          'entityName': entityName || 'JIT PBU',
          'costType': costType
        };
      $http.post($rootScope.settings.api + '/bbp/queryOverviewData', param).success(function (json) {
        $scope.overviewData = json;
        $scope.initEchart($scope.overviewData);
      }).error(function () {
        ////假数据
        toastr.clear();
        console.log('/bbp/queryOverviewData \u8bf7\u6c42error', '');
        $scope.overviewData = bbpQueryOverviewData;
        $scope.initEchart($scope.overviewData);
      });
    };
    $scope.getBarLineChartDefault = function (data, chart, option, start, end) {
      //x
      var xAxisObject = new Object();
      var typeObject = new Object();
      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        if (xAxisObject[item.xAxisValue] == undefined) {
          xAxisObject[item.xAxisValue] = new Object();
          typeObject[item.xAxisValue] = new Object();
        }
        xAxisObject[item.xAxisValue][item.yAxisLabel] = data[i].yAxisValue;
        typeObject[item.xAxisValue][item.yAxisLabel] = data[i].axisNo;  //TODO
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
            // if(xAxisObject[xAxisData[i]][legend[j]]> 100) {
            //     series[j].type = 'bar';
            //     series[j].yAxisIndex = 1;
            // }else{
            //     series[j].type = 'line';
            //     series[j].yAxisIndex = 0;
            // }
            if (typeObject[xAxisData[i]][legend[j]] == 1) {
              series[j].type = 'line';
              series[j].yAxisIndex = 1;
            } else if (typeObject[xAxisData[i]][legend[j]] == 0) {
              series[j].type = 'bar';
              series[j].yAxisIndex = 0;
            }
          }
          series[j].data.push(xAxisObject[xAxisData[i]][legend[j]] || 0);
        }
      }
      //set chart option
      $scope.option[chart] = angular.copy(option);
      $scope.option[chart].legend.data = legend;
      //默认勾选T2 ACTUAL
      $scope.option[chart].legend.selected = new Object();
      for (var i = 0; i < legend.length; i++) {
        $scope.option[chart].legend.selected[legend[i]] = false;
        if (legend[i].indexOf('T2') != -1 || legend[i].indexOf('Act') != -1 || legend[i].indexOf('BM') != -1) {
          $scope.option[chart].legend.selected[legend[i]] = true;
        }
      }
      $scope.option[chart].yAxis[0].name = data[0].unit != undefined ? '(' + data[0].unit + ')' : '';
      $scope.option[chart].xAxis[0].data = xAxisData;
      $scope.option[chart].series = series;
      $scope.option[chart].dataZoom[0].start = start;
      $scope.option[chart].dataZoom[0].end = end;
      $scope.charts[chart] = echarts.init(document.getElementById(chart), theme);
      $scope.charts[chart].setOption($scope.option[chart]);
    };
    $scope.getBarLineChart = function (data, chart, option, start, end) {
      //x
      var xAxisObject = new Object();
      var typeObject = new Object();
      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        if (xAxisObject[item.xAxisValue] == undefined) {
          xAxisObject[item.xAxisValue] = new Object();
          typeObject[item.xAxisValue] = new Object();
        }
        xAxisObject[item.xAxisValue][item.yAxisLabel] = data[i].yAxisValue;
        typeObject[item.xAxisValue][item.yAxisLabel] = data[i].axisNo;  //TODO
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
            series[j].data = new Array();  // if(legend[j].indexOf('T1') != -1 || legend[j].indexOf('T2') != -1 || legend[j].indexOf('T3') != -1) {
                                           //     series[j].type = 'line';
                                           //     series[j].yAxisIndex = 1;
                                           // }else{
                                           //     series[j].type = 'bar';
                                           //     series[j].yAxisIndex = 0;
                                           // }
          }
          if (typeObject[xAxisData[i]][legend[j]] == 1) {
            series[j].type = 'line';
          } else if (typeObject[xAxisData[i]][legend[j]] == 0) {
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
      for (var i = 0; i < legend.length; i++) {
        $scope.option[chart].legend.selected[legend[i]] = false;
        if (legend[i].indexOf('T2') != -1 || legend[i].indexOf('Act') != -1 || legend[i].indexOf('BM') != -1) {
          $scope.option[chart].legend.selected[legend[i]] = true;
        }
      }
      $scope.option[chart].yAxis[0].name = data[0].unit != undefined ? '(' + data[0].unit + ')' : '';
      $scope.option[chart].xAxis[0].data = xAxisData;
      $scope.option[chart].series = series;
      $scope.option[chart].dataZoom[0].start = start;
      $scope.option[chart].dataZoom[0].end = end;
      $scope.charts[chart] = echarts.init(document.getElementById(chart), theme);
      $scope.charts[chart].setOption($scope.option[chart]);
    };
    $scope.getMixBarChart = function (data, chart, option, start, end) {
      //x
      var xAxisObject = new Object();
      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        if (xAxisObject[item.xAxisValue] == undefined) {
          xAxisObject[item.xAxisValue] = new Object();
        }
        xAxisObject[item.xAxisValue][item.yAxisLabel] = data[i].yAxisValue;  //TODO
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
      $scope.option[chart] = angular.copy(option);
      $scope.option[chart].legend.data = legend;
      $scope.option[chart].xAxis[0].data = xAxisData;
      $scope.option[chart].series = series;
      $scope.option[chart].dataZoom[0].start = start;
      $scope.option[chart].dataZoom[0].end = end;
      $scope.charts[chart] = echarts.init(document.getElementById(chart), theme);
      $scope.charts[chart].setOption($scope.option[chart]);
    };
    $scope.getLineMixBarChart = function (data, chart, option, start, end) {
      //x
      var xAxisObject = new Object();
      var typeObject = new Object();
      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        if (xAxisObject[item.xAxisValue] == undefined) {
          xAxisObject[item.xAxisValue] = new Object();
          typeObject[item.xAxisValue] = new Object();
        }
        xAxisObject[item.xAxisValue][item.yAxisLabel] = data[i].yAxisValue;
        //TODO
        typeObject[item.xAxisValue][item.yAxisLabel] = data[i].axisNo;  //TODO
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
            series[j].data = new Array();
            if (typeObject[xAxisData[i]][legend[j]] == 1) {
              series[j].type = 'line';
            } else if (typeObject[xAxisData[i]][legend[j]] == 0) {
              series[j].type = 'bar';
              series[j].stack = stack;
            }
          }
          series[j].data.push(xAxisObject[xAxisData[i]][legend[j]] || 0);
        }
      }
      //set chart option
      $scope.option[chart] = angular.copy(option);
      $scope.option[chart].legend.data = legend;
      $scope.option[chart].yAxis[0].name = data[0].unit != undefined ? '(' + data[0].unit + ')' : '';
      $scope.option[chart].xAxis[0].data = xAxisData;
      $scope.option[chart].series = series;
      $scope.option[chart].dataZoom[0].start = start;
      $scope.option[chart].dataZoom[0].end = end;
      $scope.charts[chart] = echarts.init(document.getElementById(chart), theme);
      $scope.charts[chart].setOption($scope.option[chart]);
    };
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    $rootScope.entityShortName = $state.params['id'] || 'JIT PBU';
    console.log('shortName:' + $rootScope.entityShortName);
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
angular.module('SeanApp').controller('ChartController', [
  '$rootScope',
  '$scope',
  '$http',
  '$timeout',
  '$window',
  '$state',
  function ($rootScope, $scope, $http, $timeout, $window, $state) {
    //亿元 单轴
    var trendOption1 = {
        tooltip: { trigger: 'axis' },
        legend: { bottom: 48 },
        grid: {
          show: false,
          x: 46,
          y: 10,
          x2: 46,
          y2: 118
        },
        xAxis: [{
            type: 'category',
            axisLabel: {
              interval: 0,
              rotate: 45,
              margin: 6
            }
          }],
        yAxis: [{
            type: 'value',
            name: '',
            axisLabel: {
              formatter: function (value) {
                var val = value;
                if (value >= 10000000) {
                  val = value / 100000000 + '\u4ebf';
                } else if (value >= 1000) {
                  val = value / 10000 + '\u4e07';
                }
                return val;
              }
            },
            splitLine: { show: false }
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
    //亿元 天数 双轴
    var trendOption2 = {
        tooltip: { trigger: 'axis' },
        legend: {
          width: 500,
          left: 'center',
          bottom: 48
        },
        grid: {
          show: false,
          x: 46,
          y: 10,
          x2: 46,
          y2: 138
        },
        xAxis: [{
            type: 'category',
            axisLabel: {
              interval: 0,
              rotate: 45,
              margin: 6
            }
          }],
        yAxis: [
          {
            type: 'value',
            name: '',
            axisLabel: {
              formatter: function (value) {
                var val = value;
                if (value > 10000000) {
                  val = value / 100000000 + '\u4ebf';
                } else if (value > 10000) {
                  val = value / 10000 + '\u4e07';
                }
                return val;
              }
            },
            splitLine: { show: false }
          },
          {
            type: 'value',
            name: '',
            axisLabel: { formatter: '{value}\u5929' },
            splitLine: { show: false }
          }
        ],
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
    //叠柱
    var ageOption = {
        tooltip: { trigger: 'axis' },
        legend: { bottom: 48 },
        grid: {
          show: false,
          x: 46,
          y: 10,
          x2: 46,
          y2: 108
        },
        xAxis: [{
            type: 'category',
            axisLabel: {
              interval: 0,
              rotate: 45,
              margin: 6
            }
          }],
        yAxis: [{
            type: 'value',
            name: '',
            min: 0,
            max: 100,
            interval: 20,
            axisLabel: { formatter: '{value}%' },
            splitLine: { show: false }
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
    var widgetHeight;
    $scope.$on('$viewContentLoaded', function () {
      $scope.initWidgetHeight();
      var option = JSON.parse(window.localStorage.getItem('chartOption'));
      var title = window.localStorage.getItem('title');
      console.log(option);
      option.grid.x = 50;
      option.grid.y = 80;
      option.title = { text: title };
      option.toolbox = {
        show: true,
        feature: {
          saveAsImage: { show: true },
          myTool: {
            show: true,
            title: '\u540e\u9000',
            icon: 'image://./css/close.png',
            onclick: function () {
              window.history.go(-1);
            }
          }
        }
      };
      option.yAxis[0] = {
        type: 'value',
        name: '',
        axisLabel: {
          formatter: function (value) {
            var val = value;
            if (value >= 10000000) {
              val = value / 100000000 + '\u4ebf';
            } else if (value >= 10000) {
              val = value / 10000 + '\u4e07';
            }
            return val;
          }
        },
        splitLine: { show: false }
      };
      var chart = echarts.init(document.getElementById('chart'), theme);
      chart.setOption(option);
      $scope.timer = $timeout(function () {
        var timeout;
        angular.element($window).bind('resize', function () {
          timeout = $timeout(function () {
            $scope.initEchart($scope.overviewData);
            $timeout.cancel(timeout);
          }, 300);
        });
      }, 1000);
      $scope.$on('$destroy', function (event) {
        $timeout.cancel($scope.timer);
      });
    });
    $scope.initWidgetHeight = function () {
      var height = $(window).height() - 34;
      $('.yfops-widget').css('min-height', height);
      $('.ops-chart').css('min-height', height - 50);
    };
    $scope.initEchart = function (data) {
      if (!data || data == undefined) {
        return;
      }
      getBarLineChart(data.overviewTurnoverDaysMonth, 'chart', trendOption2);
    };
    $scope.charts = new Array();
    //库龄分析
    $scope.getMixBarChart = function (data, chart, option) {
      //x
      var xAxisObject = new Object();
      var typeObject = new Object();
      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        if (xAxisObject[item.xAxisValue] == undefined) {
          xAxisObject[item.xAxisValue] = new Object();
          typeObject[item.xAxisValue] = new Object();
        }
        xAxisObject[item.xAxisValue][item.yAxisLabel] = data[i].yAxisValue * 100;
        typeObject[item.xAxisValue][item.yAxisLabel] = data[i].axisNo;  //TODO
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
            // series[j].formatter = '{value}%';
            series[j].data = new Array();
          }
          if (typeObject[xAxisData[i]][legend[j]] == 1) {
            series[j].type = 'line';
          } else if (typeObject[xAxisData[i]][legend[j]] == 0) {
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
      $scope.charts[chart] = echarts.init(document.getElementById(chart), theme);
      $scope.charts[chart].setOption(_option);
    };
    //双轴
    $scope.getBarLineChart = function (data, chart, option) {
      //x 
      var xAxisObject = new Object();
      var typeObject = new Object();
      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        if (xAxisObject[item.xAxisValue] == undefined) {
          xAxisObject[item.xAxisValue] = new Object();
          typeObject[item.xAxisValue] = new Object();
        }
        xAxisObject[item.xAxisValue][item.yAxisLabel] = data[i].yAxisValue;
        typeObject[item.xAxisValue][item.yAxisLabel] = data[i].axisNo;  //TODO
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
            series[j].data = new Array();  // if(typeObject[xAxisData[i]][legend[j]] ==1){
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
          if (typeObject[xAxisData[i]][legend[j]] == 1) {
            series[j].type = 'line';
            series[j].yAxisIndex = 1;
          } else if (typeObject[xAxisData[i]][legend[j]] == 0) {
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
      for (var i = 0; i < legend.length; i++) {
        _option.legend.selected[legend[i]] = false;
        if (legend[i].indexOf('T2') != -1 || legend[i].indexOf('Actual') != -1 || legend[i].indexOf('Benchmark') != -1) {
          console.log(legend[i]);
          _option.legend.selected[legend[i]] = true;
        }
      }
      _option.xAxis[0].data = xAxisData;
      _option.series = series;
      console.log(_option);
      $scope.charts[chart] = echarts.init(document.getElementById(chart), theme);
      $scope.charts[chart].setOption(_option);  // var img = chart.getDataURL({
                                                //     type:"png",
                                                //     pixelRatio: 2,
                                                //     backgroundColor: '#fff'
                                                // });
    };
    //双轴
    $scope.getBarLineChartDefault = function (data, chart, option) {
      //x 
      var xAxisObject = new Object();
      var typeObject = new Object();
      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        if (xAxisObject[item.xAxisValue] == undefined) {
          xAxisObject[item.xAxisValue] = new Object();
          typeObject[item.xAxisValue] = new Object();
        }
        xAxisObject[item.xAxisValue][item.yAxisLabel] = data[i].yAxisValue;
        typeObject[item.xAxisValue][item.yAxisLabel] = data[i].axisNo;  //TODO
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
            series[j].data = new Array();
          }
          if (typeObject[xAxisData[i]][legend[j]] == 1) {
            series[j].type = 'line';
          } else if (typeObject[xAxisData[i]][legend[j]] == 0) {
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
      for (var i = 0; i < legend.length; i++) {
        _option.legend.selected[legend[i]] = false;
        if (legend[i].indexOf('T2') != -1 || legend[i].indexOf('Actual') != -1) {
          console.log(legend[i]);
          _option.legend.selected[legend[i]] = true;
        }
      }
      _option.xAxis[0].data = xAxisData;
      _option.series = series;
      console.log(_option);
      $scope.charts[chart] = echarts.init(document.getElementById(chart), theme);
      $scope.charts[chart].setOption(_option);  // var img = chart.getDataURL({
                                                //     type:"png",
                                                //     pixelRatio: 2,
                                                //     backgroundColor: '#fff'
                                                // });
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
  '$state',
  function ($rootScope, $scope, $http, $timeout, $window, $state) {
    //亿元 单轴
    var trendOption1 = {
        tooltip: { trigger: 'axis' },
        legend: { bottom: 48 },
        grid: {
          show: false,
          x: 52,
          y: 26,
          x2: 16,
          y2: 118
        },
        xAxis: [{
            type: 'category',
            axisLabel: {
              interval: 0,
              rotate: 45,
              margin: 6
            }
          }],
        yAxis: [{
            type: 'value',
            name: '',
            axisLabel: {
              formatter: function (value) {
                var val = value;
                if (value >= 100000000 || value <= -100000000) {
                  val = value / 100000000 + '\u4ebf';
                } else if (value >= 10000 || value <= -10000) {
                  val = value / 10000 + '\u4e07';
                }
                return val;
              }
            },
            splitLine: { show: false }
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
    //亿元 天数 双轴
    var trendOption2 = {
        tooltip: { trigger: 'axis' },
        legend: {
          left: 'center',
          bottom: 48
        },
        grid: {
          show: false,
          x: 49,
          y: 26,
          x2: 46,
          y2: 138
        },
        xAxis: [{
            type: 'category',
            axisLabel: {
              interval: 0,
              rotate: 45,
              margin: 6
            }
          }],
        yAxis: [
          {
            type: 'value',
            name: '',
            axisLabel: {
              formatter: function (value) {
                var val = value;
                if (value >= 100000000 || value <= -100000000) {
                  val = value / 100000000 + '\u4ebf';
                } else if (value >= 10000 || value <= -10000) {
                  val = value / 10000 + '\u4e07';
                }
                return val;
              }
            },
            splitLine: { show: false }
          },
          {
            type: 'value',
            name: '',
            axisLabel: { formatter: '{value}\u5929' },
            splitLine: { show: false }
          }
        ],
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
    //叠柱
    var ageOption = {
        tooltip: { trigger: 'axis' },
        legend: { bottom: 48 },
        grid: {
          show: false,
          x: 46,
          y: 10,
          x2: 46,
          y2: 108
        },
        xAxis: [{
            type: 'category',
            axisLabel: {
              interval: 0,
              rotate: 45,
              margin: 6
            }
          }],
        yAxis: [{
            type: 'value',
            name: '',
            min: 0,
            max: 100,
            interval: 20,
            axisLabel: { formatter: '{value}%' },
            splitLine: { show: false }
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
    var widgetHeight;
    $scope.$on('ngRepeatFinished', function (repeatFinishedEvent) {
    });
    $scope.$on('$viewContentLoaded', function () {
      $('.portlet .fa-download,.portlet .fa-search-plus').bind('click', function () {
        var id = $(this).parents('.portlet').find('.ops-chart').attr('id');
        var title = $(this).parents('.portlet').find('.caption-subject').html();
        window.localStorage.setItem('chartOption', JSON.stringify($scope.option[id]));
        window.localStorage.setItem('title', title);
        $state.go('chart');
      });
      initWidgetHeight();
      $scope.getBuList('JIT PBU');
      $scope.timer = $timeout(function () {
        $scope.timeout = null;
        angular.element($window).bind('resize', function () {
          $scope.timeout = $timeout(function () {
            $scope.initEchart($scope.overviewData);
            $timeout.cancel($scope.timeout);
          }, 300);
        });
      }, 600);
      $scope.$on('$destroy', function (event) {
        $timeout.cancel($scope.timer);
        angular.element($window).unbind('resize');
        console.log($state.$current.name + ' dashboard destroy');
      });
    });
    var initWidgetHeight = function () {
      var height = $(window).height() - 63.99 - 77.78 - 18.89 - 50;
      $('.page-content').css('min-height', height);
      widgetHeight = 274;
      // (height -77.8 -60) / 2 ;
      $('.yfops-widget').css('min-height', widgetHeight);
      $('.yfops-map').css('min-height', widgetHeight - 4);
    };
    $scope.initChinaMap = function (option) {
      if ($('#mapplic').size() === 0) {
        return;
      }
      $('#mapplic').html('').data('mapplic', null);
      var h = widgetHeight - 2;
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
    $scope.initEchart = function (data) {
      if (!data || data == undefined) {
        return;
      }
      var valueArray = [
          data.overviewStockAmount,
          data.overviewTurnoverDays,
          data.overviewUnbilledSell
        ];
      $scope.values = new Array();
      for (var i = 0; i < valueArray.length; i++) {
        if (valueArray[i].length == 0)
          continue;
        $scope.values[i] = new Object();
        if (valueArray[i][0].axisValue > valueArray[i][1].axisValue) {
          $scope.values[i].state = 'up';
        } else if (valueArray[i][0].axisValue < valueArray[i][1].axisValue) {
          $scope.values[i].state = 'down';
        } else {
          $scope.values[i].state = 'equals';
        }
        $scope.values[i].axisValue = valueArray[i][0].axisValue;
        $scope.values[i].percent = valueArray[i][0].axisValue / valueArray[i][1].axisValue * 100;
        $scope.values[i].lable = valueArray[i][0].lable;
        $scope.values[i].axis = valueArray[i][0].axis + '/' + valueArray[i][1].axis;
        $scope.values[i].unit = valueArray[i][0].unit;
      }
      try {
        $scope.title1 = data.overviewTurnoverDaysMonth[0].lable;
        $scope.getBarLineChart(data.overviewTurnoverDaysMonth, 'chart1', trendOption2, 50, 100);
      } catch (e) {
      }
      try {
        $scope.title2 = data.overviewTurnoverDaysYear[0].lable;
        $scope.getBarLineChart(data.overviewTurnoverDaysYear, 'chart2', trendOption2, 85, 100);
      } catch (e) {
      }
      // $scope.title3 = data.overviewStockageMonth[0].lable;
      // $scope.getMixBarChart(data.overviewStockageMonth, 'chart3',ageOption,50,100);
      // $scope.title4 = data.overviewStockageYear[0].lable;
      // $scope.getMixBarChart(data.overviewStockageYear, 'chart4',ageOption,80,100);
      try {
        $scope.title5 = data.overviewUnbilledSellTrendMonth[0].lable;
        $scope.getBarLineChartDefault(data.overviewUnbilledSellTrendMonth, 'chart5', trendOption1, 50, 100);
      } catch (e) {
      }
      try {
        $scope.title6 = data.overviewUnbilledSellTrendYear[0].lable;
        $scope.getBarLineChartDefault(data.overviewUnbilledSellTrendYear, 'chart6', trendOption1, 85, 100);
      } catch (e) {
      }
    };
    $scope.getBuListSuccess = function (buList) {
      $rootScope.BuList = new Object();
      $rootScope.ALLBuList = new Array();
      for (var i = 0; i < buList.length; i++) {
        var shortName = buList[i].buCodeShortName;
        if (shortName == null)
          continue;
        if ($rootScope.BuList[shortName] == undefined) {
          $rootScope.BuList[shortName] = new Array();
        }
        $rootScope.BuList[shortName].push(buList[i]);
        $rootScope.ALLBuList.push(buList[i]);
      }
      //bu列表
      $rootScope.BuNameList = Object.getOwnPropertyNames($rootScope.BuList);
      $rootScope.BuNameList = $rootScope.BuNameList.sort();
      $rootScope.entityShortName = $state.params['id'] || buList[0].pubCodeShortName || 'JIT PBU';
      console.log('shortName:' + $rootScope.entityShortName);
    };
    $scope.getBuList = function (pubCodeShortName) {
      $rootScope.pubCodeShortName = pubCodeShortName;
      $http.get($rootScope.settings.api + '/finance/queryBuList').success(function (json) {
        ///////真数据
        $scope.BuListObject = json.BuList;
        $scope.getBuListSuccess($scope.BuListObject);
        $scope.getOverviewData($rootScope.entityShortName);
        $scope.refreshChinaMap($rootScope.entityShortName);
      }).error(function () {
        toastr.clear();
        console.log('/finance/queryBuList error', '');
        $scope.BuListObject = queryBuList.BuList;
        $scope.getBuListSuccess($scope.BuListObject);
        $scope.refreshChinaMap($rootScope.entityShortName);
        $scope.getOverviewData($rootScope.entityShortName);
      });
    };
    $scope.$on('onSelectedPBU', function (scope, buShortName) {
      // $rootScope.buCodeShortName = buShortName;
      // $rootScope.entityShortName = buShortName;
      // $scope.getOverviewData($rootScope.entityShortName);
      // $scope.refreshChinaMap($rootScope.entityShortName);
      // $('.yfops-sparkline li.active').removeClass('active');
      window.location.href = '#/dashboard';
    });
    $scope.selectBU = function (buShortName, $event) {
      // $rootScope.buCodeShortName = buShortName;
      // $rootScope.entityShortName = buShortName;
      // $('.yfops-sparkline li.active').removeClass('active');
      // $($event.currentTarget).addClass('active');
      // $scope.getOverviewData(buShortName);
      // $scope.refreshChinaMap(buShortName);
      window.location.href = '#/finance/' + buShortName;
    };
    $scope.refreshChinaMap = function (buShortName) {
      var locations = new Array();
      var keys;
      if (buShortName != 'JIT PBU' && $rootScope.BuList[buShortName] != undefined) {
        keys = $rootScope.BuList[buShortName];
      } else {
        keys = $rootScope.ALLBuList;
      }
      for (var i = 0; i < keys.length; i++) {
        var entity = {
            'action': 'tooltip',
            'id': keys[i].entityCode,
            'title': keys[i].entityShortName,
            'description': keys[i].entityShortName,
            'link': '#/finance/' + keys[i].entityShortName,
            'x': keys[i].axisX || 0,
            'y': keys[i].axisY || 0
          };
        locations.push(entity);
      }
      var option = angular.copy(mapOption);
      option.levels[0].locations = locations;
      $scope.initChinaMap(option);
    };
    $scope.getOverviewData = function (buShortName) {
      var param = { 'entityName': buShortName || 'JIT PBU' };
      $http.post($rootScope.settings.api + '/finance/overviewData', param).success(function (json) {
        ////真数据
        $scope.overviewData = json;
        $scope.initEchart($scope.overviewData);
      }).error(function () {
        toastr.clear();
        console.log('/finance/overviewData \u8bf7\u6c42error', '');
        $scope.overviewData = overviewData;
        $scope.initEchart($scope.overviewData);
      });
    };
    $scope.charts = new Array();
    $scope.option = new Array();
    //库龄分析
    $scope.getMixBarChart = function (data, chart, option) {
      //x
      var xAxisObject = new Object();
      var typeObject = new Object();
      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        if (xAxisObject[item.xAxisValue] == undefined) {
          xAxisObject[item.xAxisValue] = new Object();
          typeObject[item.xAxisValue] = new Object();
        }
        xAxisObject[item.xAxisValue][item.yAxisLabel] = data[i].yAxisValue * 100;
        typeObject[item.xAxisValue][item.yAxisLabel] = data[i].axisNo;  //TODO
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
            // series[j].formatter = '{value}%';
            series[j].data = new Array();
          }
          if (typeObject[xAxisData[i]][legend[j]] == 1) {
            series[j].type = 'line';
          } else if (typeObject[xAxisData[i]][legend[j]] == 0) {
            series[j].type = 'bar';
            series[j].stack = stack;
          }
          series[j].data.push(xAxisObject[xAxisData[i]][legend[j]] || 0);
        }
      }
      //set chart option
      $scope.option[chart] = angular.copy(option);
      $scope.option[chart].legend.data = legend;
      //默认勾选T2 ACTUAL
      // $scope.option[chart].legend.selected = new Object();
      // for(var i=0;i<legend.length;i++){
      //     $scope.option[chart].legend.selected[legend[i]] = false;
      //     if(legend[i].indexOf('T2') != -1 || legend[i].indexOf('Actual')!= -1 || legend[i].indexOf('Benchmark')!= -1){
      //         console.log(legend[i]);
      //         $scope.option[chart].legend.selected[legend[i]] = true;
      //     }
      // }
      $scope.option[chart].xAxis[0].data = xAxisData;
      $scope.option[chart].series = series;
      $scope.charts[chart] = echarts.init(document.getElementById(chart), theme);
      $scope.charts[chart].setOption($scope.option[chart]);
    };
    //双轴
    $scope.getBarLineChart = function (data, chart, option, start, end) {
      //x 
      var xAxisObject = new Object();
      var typeObject = new Object();
      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        if (xAxisObject[item.xAxisValue] == undefined) {
          xAxisObject[item.xAxisValue] = new Object();
          typeObject[item.xAxisValue] = new Object();
        }
        xAxisObject[item.xAxisValue][item.yAxisLabel] = data[i].yAxisValue;
        typeObject[item.xAxisValue][item.yAxisLabel] = data[i].axisNo;  //TODO
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
            series[j].data = new Array();  // if(typeObject[xAxisData[i]][legend[j]] ==1){
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
          if (typeObject[xAxisData[i]][legend[j]] == 1) {
            series[j].type = 'line';
            series[j].yAxisIndex = 1;
          } else if (typeObject[xAxisData[i]][legend[j]] == 0) {
            series[j].type = 'bar';
            series[j].yAxisIndex = 0;
          }
          series[j].data.push(xAxisObject[xAxisData[i]][legend[j]] || 0);
        }
      }
      //set chart option
      $scope.option[chart] = angular.copy(option);
      $scope.option[chart].legend.data = legend;
      //默认勾选T2 ACTUAL
      $scope.option[chart].legend.selected = new Object();
      for (var i = 0; i < legend.length; i++) {
        $scope.option[chart].legend.selected[legend[i]] = false;
        if (legend[i].indexOf('T2') != -1 || legend[i].indexOf('Act') != -1 || legend[i].indexOf('BM') != -1) {
          $scope.option[chart].legend.selected[legend[i]] = true;
        }
      }
      $scope.option[chart].yAxis[0].name = data[0].unit != undefined ? '(' + data[0].unit + ')' : '';
      $scope.option[chart].xAxis[0].data = xAxisData;
      $scope.option[chart].series = series;
      $scope.option[chart].dataZoom[0].start = start;
      $scope.option[chart].dataZoom[0].end = end;
      $scope.charts[chart] = echarts.init(document.getElementById(chart), theme);
      $scope.charts[chart].setOption($scope.option[chart]);  // var img = chart.getDataURL({
                                                             //     type:"png",
                                                             //     pixelRatio: 2,
                                                             //     backgroundColor: '#fff'
                                                             // });
    };
    //双轴
    $scope.getBarLineChartDefault = function (data, chart, option, start, end) {
      //x 
      var xAxisObject = new Object();
      var typeObject = new Object();
      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        if (xAxisObject[item.xAxisValue] == undefined) {
          xAxisObject[item.xAxisValue] = new Object();
          typeObject[item.xAxisValue] = new Object();
        }
        xAxisObject[item.xAxisValue][item.yAxisLabel] = data[i].yAxisValue;
        typeObject[item.xAxisValue][item.yAxisLabel] = data[i].axisNo;  //TODO
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
            series[j].data = new Array();
          }
          if (typeObject[xAxisData[i]][legend[j]] == 1) {
            series[j].type = 'line';
          } else if (typeObject[xAxisData[i]][legend[j]] == 0) {
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
      for (var i = 0; i < legend.length; i++) {
        $scope.option[chart].legend.selected[legend[i]] = false;
        if (legend[i].indexOf('T2') != -1 || legend[i].indexOf('Act') != -1 || legend[i].indexOf('BM') != -1) {
          $scope.option[chart].legend.selected[legend[i]] = true;
        }
      }
      $scope.option[chart].yAxis[0].name = data[0].unit != undefined ? '(' + data[0].unit + ')' : '';
      $scope.option[chart].xAxis[0].data = xAxisData;
      $scope.option[chart].series = series;
      $scope.option[chart].dataZoom[0].start = start;
      $scope.option[chart].dataZoom[0].end = end;
      $scope.charts[chart] = echarts.init(document.getElementById(chart), theme);
      $scope.charts[chart].setOption($scope.option[chart]);  // var img = chart.getDataURL({
                                                             //     type:"png",
                                                             //     pixelRatio: 2,
                                                             //     backgroundColor: '#fff'
                                                             // });
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
  '$state',
  function ($rootScope, $scope, $http, $timeout, $window, $state) {
    var widgetHeight;
    $scope.charts = new Array();
    $scope.option = new Array();
    $scope.$on('ngRepeatFinished', function (repeatFinishedEvent) {
    });
    $scope.$on('$viewContentLoaded', function () {
      $('.portlet .fa-download,.portlet .fa-search-plus').bind('click', function () {
        var id = $(this).parents('.portlet').find('.ops-chart').attr('id');
        var title = $(this).parents('.portlet').find('.caption-subject').html();
        window.localStorage.setItem('chartOption', JSON.stringify($scope.option[id]));
        window.localStorage.setItem('title', title);
        $state.go('chart');
      });
      $scope.getOverviewData($rootScope.buShortName);
      $scope.timer = $timeout(function () {
        $scope.timeout = null;
        angular.element($window).bind('resize', function () {
          $scope.timeout = $timeout(function () {
            $scope.initEchart($scope.overviewData);
            $timeout.cancel($scope.timeout);
          }, 300);
        });
      }, 600);
      $scope.$on('$destroy', function (event) {
        $timeout.cancel($scope.timer);
        angular.element($window).unbind('resize');
        console.log('factory destroy');
      });
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
          y: 26,
          x2: 40,
          y2: 128
        },
        xAxis: [{
            type: 'category',
            axisLabel: {
              interval: 0,
              rotate: 45,
              margin: 6
            }
          }],
        yAxis: [
          {
            type: 'value',
            name: '',
            axisLabel: {
              formatter: function (value) {
                var val = value;
                if (value >= 100000000 || value <= -100000000) {
                  val = value / 100000000 + '\u4ebf';
                } else if (value >= 10000 || value <= -10000) {
                  val = value / 10000 + '\u4e07';
                }
                return val;
              }
            },
            splitLine: { show: false }
          },
          {
            type: 'value',
            name: '',
            axisLabel: {
              formatter: function (value) {
                return value + '\u5929';
              }
            },
            splitLine: { show: false }
          }
        ],
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
    //天数 天数 双轴 ? 单轴
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
          y: 26,
          x2: 40,
          y2: 128
        },
        xAxis: [{
            type: 'category',
            axisLabel: {
              interval: 0,
              rotate: 45,
              margin: 6
            }
          }],
        yAxis: [{
            type: 'value',
            name: '',
            axisLabel: { formatter: '{value}\u5929' },
            splitLine: { show: false }
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
    //万元 单轴
    var trendOption3 = {
        tooltip: { trigger: 'axis' },
        legend: { bottom: 48 },
        grid: {
          show: false,
          x: 40,
          y: 26,
          x2: 40,
          y2: 128
        },
        xAxis: [{
            type: 'category',
            axisLabel: {
              interval: 0,
              rotate: 45,
              margin: 6
            }
          }],
        yAxis: [{
            type: 'value',
            name: '',
            axisLabel: {
              formatter: function (value) {
                var val = value;
                if (value >= 100000000 || value <= -100000000) {
                  val = value / 100000000 + '\u4ebf';
                } else if (value >= 10000 || value <= -10000) {
                  val = value / 10000 + '\u4e07';
                }
                return val;
              }
            },
            splitLine: { show: false }
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
    var ageOption = {
        tooltip: { trigger: 'axis' },
        legend: { bottom: 48 },
        grid: {
          show: false,
          x: 38,
          y: 26,
          x2: 20,
          y2: 98
        },
        xAxis: [{
            type: 'category',
            axisLabel: {
              interval: 0,
              rotate: 45,
              margin: 6
            }
          }],
        yAxis: [{
            type: 'value',
            name: '',
            min: 0,
            max: 100,
            interval: 20,
            axisLabel: { formatter: '{value}%' },
            splitLine: { show: false }
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
    $scope.initEchart = function (data) {
      if (!data || data == undefined) {
        return;
      }
      try {
        $scope.title1 = data.stockTurnoverDays[0].lable;
        $scope.getBarLineChartDouble(data.stockTurnoverDays, 'chart1', trendOption1);
      } catch (e) {
      }
      try {
        $scope.title2 = data.stockStockage[0].lable;
        $scope.getBarLineChart(data.stockStockage, 'chart2', trendOption3);
      } catch (e) {
      }
      try {
        $scope.title3 = data.stockUnbilledAmount[0].lable;
        $scope.getBarLineChart(data.stockUnbilledAmount, 'chart3', trendOption3);
      } catch (e) {
      }
    };
    $scope.$on('onSelectedPBU', function (scope, buShortName) {
      window.location.href = '#/dashboard';
    });
    $scope.getOverviewData = function (buShortName) {
      console.log('factory buShortName :' + buShortName);
      var param = { 'entityName': buShortName };
      $http.post($rootScope.settings.api + '/finance/buData', param).success(function (json) {
        $scope.overviewData = json;
        $scope.initEchart($scope.overviewData);
      }).error(function () {
        console.log('/finance/buData error', '');
        $scope.overviewData = buData;
        $scope.initEchart($scope.overviewData);
      });
    };
    //库龄分析
    $scope.getMixBarChart = function (data, chart, option) {
      //x
      var xAxisObject = new Object();
      var typeObject = new Object();
      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        if (xAxisObject[item.xAxisValue] == undefined) {
          xAxisObject[item.xAxisValue] = new Object();
          typeObject[item.xAxisValue] = new Object();
        }
        xAxisObject[item.xAxisValue][item.yAxisLabel] = data[i].yAxisValue * 100;
        typeObject[item.xAxisValue][item.yAxisLabel] = data[i].axisNo;  //TODO
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
          if (typeObject[xAxisData[i]][legend[j]] == 1) {
            series[j].type = 'line';
          } else if (typeObject[xAxisData[i]][legend[j]] == 0) {
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
      for (var i = 0; i < legend.length; i++) {
        $scope.option[chart].legend.selected[legend[i]] = false;
        if (legend[i].indexOf('T2') != -1 || legend[i].indexOf('Act') != -1 || legend[i].indexOf('BM') != -1) {
          $scope.option[chart].legend.selected[legend[i]] = true;
        }
      }
      $scope.option[chart].yAxis[0].name = data[0].unit != undefined ? '(' + data[0].unit + ')' : '';
      $scope.option[chart].xAxis[0].data = xAxisData;
      $scope.option[chart].series = series;
      $scope.charts[chart] = echarts.init(document.getElementById(chart), theme);
      $scope.charts[chart].setOption($scope.option[chart]);
    };
    //双轴
    $scope.getBarLineChartDouble = function (data, chart, option) {
      //x
      var xAxisObject = new Object();
      var typeObject = new Object();
      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        if (xAxisObject[item.xAxisValue] == undefined) {
          xAxisObject[item.xAxisValue] = new Object();
          typeObject[item.xAxisValue] = new Object();
        }
        xAxisObject[item.xAxisValue][item.yAxisLabel] = data[i].yAxisValue;
        typeObject[item.xAxisValue][item.yAxisLabel] = data[i].axisNo;  //TODO
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
            series[j].data = new Array();  // if(xAxisObject[xAxisData[i]][legend[j]]> 100) {
                                           //     series[j].type = 'bar';
                                           //     series[j].yAxisIndex = 0;
                                           // }else{
                                           //     series[j].type = 'line';
                                           //     series[j].yAxisIndex = 1;
                                           // }
          }
          if (typeObject[xAxisData[i]][legend[j]] == 1) {
            series[j].type = 'line';
            series[j].yAxisIndex = 1;
          } else if (typeObject[xAxisData[i]][legend[j]] == 0) {
            series[j].type = 'bar';
            series[j].yAxisIndex = 0;
          }
          series[j].data.push(xAxisObject[xAxisData[i]][legend[j]] || 0);
        }
      }
      //set chart option
      $scope.option[chart] = angular.copy(option);
      $scope.option[chart].legend.data = legend;
      //默认勾选T2 ACTUAL
      $scope.option[chart].legend.selected = new Object();
      for (var i = 0; i < legend.length; i++) {
        $scope.option[chart].legend.selected[legend[i]] = false;
        if (legend[i].indexOf('T2') != -1 || legend[i].indexOf('Act') != -1 || legend[i].indexOf('BM') != -1) {
          $scope.option[chart].legend.selected[legend[i]] = true;
        }
      }
      $scope.option[chart].yAxis[0].name = data[0].unit != undefined ? '(' + data[0].unit + ')' : '';
      $scope.option[chart].xAxis[0].data = xAxisData;
      $scope.option[chart].series = series;
      $scope.charts[chart] = echarts.init(document.getElementById(chart), theme);
      $scope.charts[chart].setOption($scope.option[chart]);
    };
    //单轴
    $scope.getBarLineChart = function (data, chart, option) {
      //x
      var xAxisObject = new Object();
      var typeObject = new Object();
      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        if (xAxisObject[item.xAxisValue] == undefined) {
          xAxisObject[item.xAxisValue] = new Object();
          typeObject[item.xAxisValue] = new Object();
        }
        xAxisObject[item.xAxisValue][item.yAxisLabel] = data[i].yAxisValue;
        typeObject[item.xAxisValue][item.yAxisLabel] = data[i].axisNo;  //TODO
      }
      var xAxisData = Object.getOwnPropertyNames(xAxisObject);
      var series = new Array();
      var legend = Object.getOwnPropertyNames(xAxisObject[xAxisData[0]]);
      for (var i = 0; i < xAxisData.length; i++) {
        for (var j = 0; j < legend.length; j++) {
          if (series[j] == undefined) {
            series[j] = new Object();
            series[j].name = legend[j];
            series[j].type = 'bar';
            // series[j].stack = stack;
            series[j].data = new Array();  // if(legend[j].indexOf('T1') != -1){
                                           //     series[j].type = 'line';
                                           // }else if(legend[j].indexOf('T2') != -1){
                                           //     series[j].type = 'line';
                                           // }else if(legend[j].indexOf('T3') != -1){
                                           //     series[j].type = 'line';
                                           // }else if(legend[j].indexOf('Actual') != -1){
                                           //     series[j].type = 'bar';
                                           // }
          }
          if (typeObject[xAxisData[i]][legend[j]] == 1) {
            series[j].type = 'line';
          } else if (typeObject[xAxisData[i]][legend[j]] == 0) {
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
      for (var i = 0; i < legend.length; i++) {
        $scope.option[chart].legend.selected[legend[i]] = false;
        if (legend[i].indexOf('T2') != -1 || legend[i].indexOf('Act') != -1 || legend[i].indexOf('BM') != -1) {
          $scope.option[chart].legend.selected[legend[i]] = true;
        }
      }
      $scope.option[chart].yAxis[0].name = data[0].unit != undefined ? '(' + data[0].unit + ')' : '';
      $scope.option[chart].xAxis[0].data = xAxisData;
      $scope.option[chart].series = series;
      $scope.charts[chart] = echarts.init(document.getElementById(chart), theme);
      $scope.charts[chart].setOption($scope.option[chart]);
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
  '$state',
  function ($rootScope, $scope, $http, $timeout, $window, $state) {
    var widgetHeight;
    $scope.charts = new Array();
    $scope.option = new Array();
    $scope.$on('ngRepeatFinished', function (repeatFinishedEvent) {
    });
    $scope.$on('$viewContentLoaded', function () {
      $('.portlet .fa-download,.portlet .fa-search-plus').bind('click', function () {
        var id = $(this).parents('.portlet').find('.ops-chart').attr('id');
        var title = $(this).parents('.portlet').find('.caption-subject').html();
        window.localStorage.setItem('chartOption', JSON.stringify($scope.option[id]));
        window.localStorage.setItem('title', title);
        $state.go('chart');
      });
      initWidgetHeight();
      $scope.getfilterList();
      $scope.timer = $timeout(function () {
        $scope.timeout = null;
        angular.element($window).bind('resize', function () {
          $scope.timeout = $timeout(function () {
            $scope.initEchart($scope.overviewData);
            $timeout.cancel($scope.timeout);
          }, 300);
        });
      }, 600);
      $scope.$on('$destroy', function (event) {
        $timeout.cancel($scope.timer);
        angular.element($window).unbind('resize');
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
        xAxis: [{
            type: 'category',
            axisLabel: {
              interval: 0,
              rotate: 45,
              margin: 6
            }
          }],
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
    var ageOption = {
        tooltip: { trigger: 'axis' },
        legend: { bottom: 48 },
        grid: {
          show: false,
          x: 38,
          y: 26,
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
    $scope.initEchart = function (data) {
      if (!data || data == undefined) {
        return;
      }
      try {
        $scope.title1 = data.totalLaborHoursDivideEQU[0].lable;
        $scope.getBarLineChart(data.totalLaborHoursDivideEQU, 'chart1', trendOption2);
      } catch (e) {
      }
    };
    // $scope.initializeChartSize = function() {
    //     $timeout.cancel($scope.layout);
    //     $scope.layout = $timeout(function(){
    //         initEchart($scope.overviewData);
    //     },80);
    // };
    $scope.getfilterList = function () {
      ///////真数据
      $http.get($rootScope.settings.api + '/hr/queryFilter').success(function (json) {
        $scope.filterListObject = json.filterList;
        $scope.getfilterListSuccess($scope.filterListObject);
      }).error(function () {
        console.log('/hr/queryFilter error', '');
        ///////假数据
        $scope.filterListObject = hrQueryFilter.filterList;
        $scope.getfilterListSuccess($scope.filterListObject);
      });
    };
    $scope.getfilterListSuccess = function (list) {
      $scope.filterList = new Array();
      for (var i = 0; i < list.length; i++) {
        $scope.filterList.push(list[i].businessCat3);
      }
      $scope.setFilter($scope.currentFilter || $scope.filterList[0]);
    };
    $scope.setFilter = function (filter) {
      $scope.currentFilter = filter;
      $scope.getOverviewData($rootScope.buCodeShortName, $scope.currentFilter);
    };
    $scope.$on('onSelectedPBU', function (scope, buShortName) {
      window.location.href = '#/HROverview';
    });
    $scope.getOverviewData = function (entityName, costType) {
      var param = {
          'entityName': entityName || 'JIT PBU',
          'costType': costType
        };
      $http.post($rootScope.settings.api + '/hr/queryFactoryData', param).success(function (json) {
        $scope.overviewData = json;
        $scope.initEchart($scope.overviewData);
      }).error(function () {
        ////假数据
        $scope.overviewData = hrQueryFactoryData;
        $scope.initEchart($scope.overviewData);
      });
    };
    $scope.getBarLineChart = function (data, chart, option) {
      //x
      var xAxisObject = new Object();
      var typeObject = new Object();
      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        if (xAxisObject[item.xAxisValue] == undefined) {
          xAxisObject[item.xAxisValue] = new Object();
          typeObject[item.xAxisValue] = new Object();
        }
        xAxisObject[item.xAxisValue][item.yAxisLabel] = data[i].yAxisValue;
        typeObject[item.xAxisValue][item.yAxisLabel] = data[i].axisNo;  //TODO
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
          }
          // if(legend[j].indexOf('Actual') != -1) {
          //     series[j].type = 'bar';
          // }else{
          //     series[j].type = 'line';
          // }
          if (typeObject[xAxisData[i]][legend[j]] == 1) {
            series[j].type = 'line';
          } else if (typeObject[xAxisData[i]][legend[j]] == 0) {
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
      for (var i = 0; i < legend.length; i++) {
        $scope.option[chart].legend.selected[legend[i]] = false;
        if (legend[i].indexOf('T2') != -1 || legend[i].indexOf('Act') != -1 || legend[i].indexOf('BM') != -1) {
          $scope.option[chart].legend.selected[legend[i]] = true;
        }
      }
      $scope.option[chart].yAxis[0].name = data[0].unit != undefined ? '(' + data[0].unit + ')' : '';
      $scope.option[chart].xAxis[0].data = xAxisData;
      $scope.option[chart].series = series;
      $scope.charts[chart] = echarts.init(document.getElementById(chart), theme);
      $scope.charts[chart].setOption($scope.option[chart]);
    };
    $scope.getMixBarChart = function (data, chart, option) {
      //x
      var xAxisObject = new Object();
      var typeObject = new Object();
      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        if (xAxisObject[item.xAxisValue] == undefined) {
          xAxisObject[item.xAxisValue] = new Object();
          typeObject[item.xAxisValue] = new Object();
        }
        xAxisObject[item.xAxisValue][item.yAxisLabel] = data[i].yAxisValue * 100;
        typeObject[item.xAxisValue][item.yAxisLabel] = data[i].axisNo;  //TODO
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
          if (typeObject[xAxisData[i]][legend[j]] == 1) {
            series[j].type = 'line';
          } else if (typeObject[xAxisData[i]][legend[j]] == 0) {
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
      for (var i = 0; i < legend.length; i++) {
        _option.legend.selected[legend[i]] = false;
        if (legend[i].indexOf('T2') != -1 || legend[i].indexOf('Act') != -1 || legend[i].indexOf('BM') != -1) {
          $scope.option[chart].legend.selected[legend[i]] = true;
        }
      }
      $scope.option[chart].xAxis[0].data = xAxisData;
      $scope.option[chart].series = series;
      $scope.charts[chart] = echarts.init(document.getElementById(chart), theme);
      $scope.charts[chart].setOption($scope.option[chart]);
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
  '$state',
  function ($rootScope, $scope, $http, $timeout, $window, $state) {
    var widgetHeight;
    $scope.charts = new Array();
    $scope.option = new Array();
    $scope.$on('ngRepeatFinished', function (repeatFinishedEvent) {
    });
    $scope.$on('$viewContentLoaded', function () {
      $('.portlet .fa-download,.portlet .fa-search-plus').bind('click', function () {
        var id = $(this).parents('.portlet').find('.ops-chart').attr('id');
        var title = $(this).parents('.portlet').find('.caption-subject').html();
        window.localStorage.setItem('chartOption', JSON.stringify($scope.option[id]));
        window.localStorage.setItem('title', title);
        $state.go('chart');
      });
      initWidgetHeight();
      $scope.getfilterList();
      $scope.timer = $timeout(function () {
        $scope.timeout = null;
        angular.element($window).bind('resize', function () {
          $scope.timeout = $timeout(function () {
            $scope.initEchart($scope.overviewData);
            $timeout.cancel($scope.timeout);
          }, 300);
        });
      }, 600);
      $scope.$on('$destroy', function (event) {
        $timeout.cancel($scope.timer);
        angular.element($window).unbind('resize');
      });
    });
    //单轴
    var trendOption1 = {
        tooltip: { trigger: 'axis' },
        legend: { bottom: 48 },
        grid: {
          show: false,
          x: 40,
          y: 10,
          x2: 30,
          y2: 138
        },
        xAxis: [{
            type: 'category',
            axisLabel: {
              interval: 0,
              rotate: 45,
              margin: 6
            }
          }],
        yAxis: [{
            type: 'value',
            name: '',
            axisLabel: {
              formatter: function (value) {
                var val = value;
                if (value >= 100000000) {
                  val = value / 100000000 + '\u4ebf';
                } else if (value >= 10000) {
                  val = value / 10000 + '\u4e07';
                }
                return val;
              }
            },
            splitLine: { show: false }
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
          y: 26,
          x2: 50,
          y2: 138
        },
        xAxis: [{
            type: 'category',
            axisLabel: {
              interval: 0,
              rotate: 45,
              margin: 6
            }
          }],
        yAxis: [
          {
            type: 'value',
            name: '',
            axisLabel: { formatter: '{value}' },
            splitLine: { show: false }
          },
          {
            type: 'value',
            name: '',
            axisLabel: {
              formatter: function (value) {
                var val = value;
                if (value >= 10000000) {
                  val = value / 100000000 + '\u4ebf';
                } else if (value >= 10000) {
                  val = value / 10000 + '\u4e07';
                }
                return val;
              }
            },
            splitLine: { show: false }
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
    //叠柱
    var ageOption = {
        tooltip: { trigger: 'axis' },
        legend: {
          width: 640,
          left: 'center',
          bottom: 48
        },
        grid: {
          show: false,
          x: 40,
          y: 26,
          x2: 20,
          y2: 138
        },
        xAxis: [{
            type: 'category',
            axisLabel: {
              interval: 0,
              rotate: 45,
              margin: 6
            }
          }],
        yAxis: [{
            type: 'value',
            name: '',
            axisLabel: {
              formatter: function (value) {
                var val = value;
                if (value >= 10000000) {
                  val = value / 100000000 + '\u4ebf';
                } else if (value >= 10000) {
                  val = value / 10000 + '\u4e07';
                }
                return val;
              }
            },
            splitLine: { show: false }
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
    var initWidgetHeight = function () {
      var height = $(window).height() - 63.99 - 77.78 - 18.89 - 50;
      $('.page-content').css('min-height', height);
      widgetHeight = 274;
      // (height -77.8 -60) / 2 ;
      $('.yfops-widget').css('min-height', widgetHeight);
      $('.yfops-map').css('min-height', widgetHeight - 4);
    };
    $scope.initEchart = function (data) {
      if (!data || data == undefined) {
        return;
      }
      var valueArray = [
          data.totalLaborhoursDivideEQU,
          data.equ,
          data.totalLaborhours
        ];
      $scope.values = new Array();
      for (var i = 0; i < valueArray.length; i++) {
        if (valueArray[i].length == 0)
          continue;
        $scope.values[i] = new Object();
        if (valueArray[i][0].axisValue > valueArray[i][1].axisValue) {
          $scope.values[i].state = 'up';
        } else if (valueArray[i][0].axisValue < valueArray[i][1].axisValue) {
          $scope.values[i].state = 'down';
        } else {
          $scope.values[i].state = 'equals';
        }
        $scope.values[i].axisValue = valueArray[i][0].axisValue;
        $scope.values[i].percent = valueArray[i][0].axisValue / valueArray[i][1].axisValue * 100;
        $scope.values[i].lable = valueArray[i][0].lable;
        $scope.values[i].axis = valueArray[i][0].axis + '/' + valueArray[i][1].axis;
        $scope.values[i].unit = valueArray[i][0].unit;
      }
      try {
        $scope.title1 = data.totalLaborhoursDivideEQUTrendMonth[0].lable;
        $scope.getBarLineChart(data.totalLaborhoursDivideEQUTrendMonth, 'chart1', trendOption2, 50, 100);
      } catch (e) {
      }
      try {
        $scope.title2 = data.totalLaborhoursDivideEQUTrendYear[0].lable;
        $scope.getBarLineChart(data.totalLaborhoursDivideEQUTrendYear, 'chart2', trendOption2, 85, 100);
      } catch (e) {
      }
      try {
        $scope.title3 = data.totalLaborhoursDivideEQUClassMonth[0].lable;
        $scope.getLineMixBarChart(data.totalLaborhoursDivideEQUClassMonth, 'chart3', ageOption, 50, 100);
      } catch (e) {
      }
      try {
        $scope.title4 = data.totalLaborhoursDivideEQUClassYear[0].lable;
        $scope.getLineMixBarChart(data.totalLaborhoursDivideEQUClassYear, 'chart4', ageOption, 85, 100);
      } catch (e) {
      }
    };
    var initializeChartSize = function () {
      $timeout.cancel($scope.layout);
      $scope.layout = $timeout(function () {
        initEchart($scope.overviewData);
      }, 80);
    };
    $scope.getfilterList = function () {
      ///////真数据
      $http.get($rootScope.settings.api + '/hr/queryFilter').success(function (json) {
        $scope.filterListObject = json.filterList;
        $scope.getfilterListSuccess($scope.filterListObject);
        $scope.getBuList($rootScope.entityShortName);
      }).error(function () {
        ///////假数据
        $scope.filterListObject = hrQueryFilter.filterList;
        $scope.getfilterListSuccess($scope.filterListObject);
        $scope.getBuList($rootScope.entityShortName);
      });
    };
    $scope.getfilterListSuccess = function (list) {
      $scope.filterList = new Array();
      for (var i = 0; i < list.length; i++) {
        $scope.filterList.push(list[i].businessCat3);
      }
      $scope.setFilter($scope.filterList[0]);
    };
    $scope.setFilter = function (filter) {
      $scope.currentFilter = filter;
      $scope.getOverviewData($rootScope.entityShortName, $scope.currentFilter);
    };
    $scope.getBuListSuccess = function (buList) {
      $rootScope.BuList = new Object();
      $rootScope.ALLBuList = new Array();
      for (var i = 0; i < buList.length; i++) {
        var shortName = buList[i].buCodeShortName;
        if (shortName == null)
          continue;
        if ($rootScope.BuList[shortName] == undefined) {
          $rootScope.BuList[shortName] = new Array();
        }
        $rootScope.BuList[shortName].push(buList[i]);
        $rootScope.ALLBuList.push(buList[i]);
      }
      //bu列表
      $rootScope.BuNameList = Object.getOwnPropertyNames($rootScope.BuList);
      $rootScope.BuNameList = $rootScope.BuNameList.sort();
      // $rootScope.pubCodeShortName = buList[0].pubCodeShortName;
      // $rootScope.buCodeShortName = $rootScope.BuList[$rootScope.BuNameList[0]][0].buCodeShortName;
      $rootScope.entityShortName = $state.params['id'] || buList[0].pubCodeShortName || 'JIT PBU';
    };
    $scope.getBuList = function (pubCodeShortName) {
      $rootScope.pubCodeShortName = pubCodeShortName;
      $http.get($rootScope.settings.api + '/finance/queryBuList').success(function (json) {
        ///////真数据
        $scope.BuListObject = json.BuList;
        $scope.getBuListSuccess($scope.BuListObject);
        $scope.getOverviewData($rootScope.entityShortName, $scope.currentFilter);
        $scope.refreshChinaMap($rootScope.entityShortName);
      }).error(function () {
        console.log('\u8bf7\u6c42error,\u53d6\u5047\u6570\u636e');
        $scope.BuListObject = queryBuList.BuList;
        $scope.getBuListSuccess($scope.BuListObject);
        $scope.getOverviewData($rootScope.entityShortName, $scope.currentFilter);
        $scope.refreshChinaMap($rootScope.entityShortName);
      });
    };
    $scope.$on('onSelectedPBU', function (scope, buShortName) {
      // $rootScope.buCodeShortName = buShortName;
      // $rootScope.entityShortName = buShortName;
      // $scope.getOverviewData($rootScope.entityShortName, $scope.currentFilter);
      // $scope.refreshChinaMap($rootScope.entityShortName);
      // $('.yfops-sparkline li.active').removeClass('active');
      window.location.href = '#/HROverview';
    });
    $scope.selectBU = function (buShortName, $event) {
      // $rootScope.buCodeShortName = buShortName;
      // $rootScope.entityShortName = buShortName;
      // $('.yfops-sparkline li.active').removeClass('active');
      // $($event.currentTarget).addClass('active');
      // $scope.getOverviewData($rootScope.entityShortName, $scope.currentFilter);
      // $scope.refreshChinaMap(buShortName);
      window.location.href = '#/hr/' + buShortName;
    };
    $scope.refreshChinaMap = function (buShortName) {
      var locations = new Array();
      var keys;
      if (buShortName != 'JIT PBU' && $rootScope.BuList[buShortName] != undefined) {
        keys = $rootScope.BuList[buShortName];
      } else {
        keys = $rootScope.ALLBuList;
      }
      for (var i = 0; i < keys.length; i++) {
        var entity = {
            'action': 'tooltip',
            'id': keys[i].entityCode,
            'title': keys[i].entityShortName,
            'description': keys[i].entityShortName,
            'link': '#/hr/' + keys[i].entityShortName,
            'x': keys[i].axisX || 0,
            'y': keys[i].axisY || 0
          };
        locations.push(entity);
      }
      var option = angular.copy(mapOption);
      option.levels[0].locations = locations;
      $scope.initChinaMap(option);
    };
    $scope.initChinaMap = function (option) {
      if ($('#mapplic').size() === 0) {
        return;
      }
      $('#mapplic').html('').data('mapplic', null);
      var h = widgetHeight - 2;
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
    $scope.getOverviewData = function (entityName, costType) {
      var param = {
          'entityName': entityName || 'JIT PBU',
          'costType': costType
        };
      $http.post($rootScope.settings.api + '/hr/queryHRData', param).success(function (json) {
        $scope.overviewData = json;
        $scope.initEchart($scope.overviewData);
      }).error(function () {
        ////假数据
        $scope.overviewData = hrQueryOverviewData;
        $scope.initEchart($scope.overviewData);
      });
    };
    $scope.getBarLineChart = function (data, chart, option, start, end) {
      //x
      var xAxisObject = new Object();
      var typeObject = new Object();
      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        if (xAxisObject[item.xAxisValue] == undefined) {
          xAxisObject[item.xAxisValue] = new Object();
          typeObject[item.xAxisValue] = new Object();
        }
        xAxisObject[item.xAxisValue][item.yAxisLabel] = data[i].yAxisValue;
        //TODO
        typeObject[item.xAxisValue][item.yAxisLabel] = data[i].axisNo;  //TODO
      }
      var xAxisData = Object.getOwnPropertyNames(xAxisObject);
      var stack = data[0].lable;
      var series = new Array();
      var legend = Object.getOwnPropertyNames(xAxisObject[xAxisData[xAxisData.length - 1]]);
      for (var i = 0; i < xAxisData.length; i++) {
        for (var j = 0; j < legend.length; j++) {
          if (series[j] == undefined) {
            series[j] = new Object();
            series[j].name = legend[j];
            series[j].type = 'bar';
            series[j].data = new Array();
          }
          if (typeObject[xAxisData[i]][legend[j]] == 1) {
            //数据0和1搞错了
            series[j].type = 'line';
            series[j].yAxisIndex = 1;
          } else if (typeObject[xAxisData[i]][legend[j]] == 0) {
            series[j].type = 'bar';
            // series[j].stack = stack;
            series[j].yAxisIndex = 0;
          }
          series[j].data.push(xAxisObject[xAxisData[i]][legend[j]] || 0);
        }
      }
      //set chart option
      $scope.option[chart] = angular.copy(option);
      $scope.option[chart].legend.data = legend;
      //默认勾选T2 ACTUAL
      $scope.option[chart].legend.selected = new Object();
      for (var i = 0; i < legend.length; i++) {
        $scope.option[chart].legend.selected[legend[i]] = false;
        if (legend[i].indexOf('T2') != -1 || legend[i].indexOf('Act') != -1 || legend[i].indexOf('BM') != -1) {
          $scope.option[chart].legend.selected[legend[i]] = true;
        }
      }
      $scope.option[chart].yAxis[0].name = data[0].unit != undefined ? '(' + data[0].unit + ')' : '';
      $scope.option[chart].xAxis[0].data = xAxisData;
      $scope.option[chart].series = series;
      $scope.option[chart].dataZoom[0].start = start;
      $scope.option[chart].dataZoom[0].end = end;
      $scope.charts[chart] = echarts.init(document.getElementById(chart), theme);
      $scope.charts[chart].setOption($scope.option[chart]);
    };
    $scope.getMixBarChart = function (data, chart, option, start, end) {
      //x
      var xAxisObject = new Object();
      var typeObject = new Object();
      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        if (xAxisObject[item.xAxisValue] == undefined) {
          xAxisObject[item.xAxisValue] = new Object();
          typeObject[item.xAxisValue] = new Object();
        }
        xAxisObject[item.xAxisValue][item.yAxisLabel] = data[i].yAxisValue;
        //TODO
        typeObject[item.xAxisValue][item.yAxisLabel] = data[i].axisNo;  //TODO
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
            series[j].data = new Array();
          }
          if (typeObject[xAxisData[i]][legend[j]] == 1) {
            series[j].type = 'line';
          } else if (typeObject[xAxisData[i]][legend[j]] == 0) {
            series[j].type = 'bar';
            series[j].stack = stack;
          }
          series[j].data.push(xAxisObject[xAxisData[i]][legend[j]] || 0);
        }
      }
      //set chart option
      $scope.option[chart] = angular.copy(option);
      $scope.option[chart].legend.data = legend;
      //默认勾选T2 ACTUAL
      $scope.option[chart].legend.selected = new Object();
      for (var i = 0; i < legend.length; i++) {
        $scope.option[chart].legend.selected[legend[i]] = false;
        if (legend[i].indexOf('T2') != -1 || legend[i].indexOf('Act') != -1 || legend[i].indexOf('BM') != -1) {
          $scope.option[chart].legend.selected[legend[i]] = true;
        }
      }
      $scope.option[chart].yAxis[0].name = data[0].unit != undefined ? '(' + data[0].unit + ')' : 'xx';
      $scope.option[chart].xAxis[0].data = xAxisData;
      $scope.option[chart].series = series;
      $scope.option[chart].dataZoom[0].start = start;
      $scope.option[chart].dataZoom[0].end = end;
      $scope.charts[chart] = echarts.init(document.getElementById(chart), theme);
      $scope.charts[chart].setOption($scope.option[chart]);
    };
    $scope.getLineMixBarChart = function (data, chart, option, start, end) {
      //x
      var xAxisObject = new Object();
      var typeObject = new Object();
      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        if (xAxisObject[item.xAxisValue] == undefined) {
          xAxisObject[item.xAxisValue] = new Object();
          typeObject[item.xAxisValue] = new Object();
        }
        xAxisObject[item.xAxisValue][item.yAxisLabel] = data[i].yAxisValue;
        //TODO
        typeObject[item.xAxisValue][item.yAxisLabel] = data[i].axisNo;  //TODO
      }
      var xAxisData = Object.getOwnPropertyNames(xAxisObject);
      //y
      var stack = data[0].lable;
      var series = new Array();
      // var legend = Object.getOwnPropertyNames(xAxisObject[xAxisData[0]]);  //顺序问题
      var legend = [
          'Direct Labor Hours-Act',
          'Indirect Labor Hours-Act',
          'Outsourcing Labor Hours-Act',
          'Salary Labor Hours-Act',
          'Total Labor Hours-Act'
        ];
      for (var i = 0; i < xAxisData.length; i++) {
        for (var j = 0; j < legend.length; j++) {
          if (series[j] == undefined) {
            series[j] = new Object();
            series[j].name = legend[j];
            series[j].type = 'bar';
            series[j].data = new Array();
          }
          if (typeObject[xAxisData[i]][legend[j]] == 1) {
            series[j].type = 'line';
          } else if (typeObject[xAxisData[i]][legend[j]] == 0) {
            series[j].type = 'bar';
            series[j].stack = stack;
          }
          series[j].data.push(xAxisObject[xAxisData[i]][legend[j]] || 0);
        }
      }
      //set chart option
      $scope.option[chart] = angular.copy(option);
      $scope.option[chart].legend.data = legend;
      //默认勾选T2 ACTUAL
      $scope.option[chart].legend.selected = new Object();
      for (var i = 0; i < legend.length; i++) {
        $scope.option[chart].legend.selected[legend[i]] = false;
        if (legend[i].indexOf('T2') != -1 || legend[i].indexOf('Act') != -1 || legend[i].indexOf('BM') != -1) {
          $scope.option[chart].legend.selected[legend[i]] = true;
        }
      }
      $scope.option[chart].yAxis[0].name = data[0].unit != undefined ? '(' + data[0].unit + ')' : '';
      $scope.option[chart].xAxis[0].data = xAxisData;
      $scope.option[chart].series = series;
      $scope.option[chart].dataZoom[0].start = start;
      $scope.option[chart].dataZoom[0].end = end;
      $scope.charts[chart] = echarts.init(document.getElementById(chart), theme);
      $scope.charts[chart].setOption($scope.option[chart]);
    };
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    $rootScope.entityShortName = $state.params['id'] || 'JIT PBU';
    console.log('shortName:' + $rootScope.entityShortName);
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
    $scope.request = {
      userName: '',
      password: ''
    };
    $scope.login = function () {
      //TODO: static login
      // $state.go('dashboard');
      $http.post($rootScope.settings.api + '/user/login', $scope.request).success(function (json) {
        if (json.errorMsg) {
          console.log(json.errorMsg, '');
          return;
        }
        if (json.token) {
          toastr['success']('\u767b\u5f55\u6210\u529f', '');
          $rootScope.token = json.token;
          window.localStorage.setItem('t', json.token);
          $state.go('dashboard');
        }
      });
    };
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
  }
]);
;
angular.module('SeanApp').controller('OtherFactoryController', [
  '$rootScope',
  '$scope',
  '$http',
  '$timeout',
  '$window',
  '$state',
  function ($rootScope, $scope, $http, $timeout, $window, $state) {
    var widgetHeight;
    $scope.charts = new Array();
    $scope.option = new Array();
    $scope.$on('ngRepeatFinished', function (repeatFinishedEvent) {
    });
    $scope.$on('$viewContentLoaded', function () {
      $('.portlet .fa-download,.portlet .fa-search-plus').bind('click', function () {
        var id = $(this).parents('.portlet').find('.ops-chart').attr('id');
        var title = $(this).parents('.portlet').find('.caption-subject').html();
        window.localStorage.setItem('chartOption', JSON.stringify($scope.option[id]));
        window.localStorage.setItem('title', title);
        $state.go('chart');
      });
      initWidgetHeight();
      // getfilterList();
      $scope.getOverviewData($rootScope.entityName);
      $scope.timer = $timeout(function () {
        $scope.timeout = null;
        angular.element($window).bind('resize', function () {
          $scope.timeout = $timeout(function () {
            $scope.initEchart($scope.overviewData);
            $timeout.cancel($scope.timeout);
          }, 300);
        });
      }, 600);
      $scope.$on('$destroy', function (event) {
        $timeout.cancel($scope.timer);
        angular.element($window).unbind('resize');
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
          y: 26,
          x2: 30,
          y2: 148
        },
        xAxis: [{
            type: 'category',
            axisLabel: {
              interval: 0,
              rotate: 45,
              margin: 6
            }
          }],
        yAxis: [{
            type: 'value',
            name: '',
            axisLabel: {
              formatter: function (value) {
                return value;
              }
            },
            splitLine: { show: false }
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
        xAxis: [{
            type: 'category',
            axisLabel: {
              interval: 0,
              rotate: 45,
              margin: 6
            }
          }],
        yAxis: [{
            type: 'value',
            name: '',
            interval: 20,
            axisLabel: { formatter: '{value}' },
            splitLine: { show: false }
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
    $scope.initEchart = function (data) {
      if (!data || data == undefined) {
        return;
      }
      try {
        $scope.title1 = data.activeDimissionRate[0].lable;
        $scope.getBarLineChart(data.activeDimissionRate, 'chart1', trendOption2);
      } catch (e) {
      }
      try {
        $scope.title2 = data.mu[0].lable;
        $scope.getBarLineChartExtra(data.mu, 'chart2', trendOption2);
      } catch (e) {
      }
      try {
        $scope.title3 = data.personnelExpensesWithBU[0].lable;
        $scope.getBarLineChart(data.personnelExpensesWithBU, 'chart3', trendOption2);
      } catch (e) {
      }
      try {
        $scope.title4 = data.personnelExpensesWithCompany[0].lable;
        $scope.getBarLineChart(data.personnelExpensesWithCompany, 'chart4', trendOption2);
      } catch (e) {
      }
    };
    // var initializeChartSize = function() {
    //     $timeout.cancel($scope.layout);
    //     $scope.layout = $timeout(function(){
    //         initEchart($scope.overviewData);
    //     },80);
    // };
    $scope.$on('onSelectedPBU', function (scope, buShortName) {
      window.location.href = '#/OtherOverview';
    });
    $scope.getOverviewData = function (entityName) {
      var param = { 'entityName': entityName || 'JIT PBU' };
      $http.post($rootScope.settings.api + '/other/queryFactoryData', param).success(function (json) {
        $scope.overviewData = json;
        $scope.initEchart($scope.overviewData);
      }).error(function () {
        ////假数据
        $scope.overviewData = otherQueryFactoryData;
        $scope.initEchart($scope.overviewData);
      });
    };
    $scope.getBarLineChartExtra = function (data, chart, option) {
      //x
      var xAxisObject = new Object();
      var typeObject = new Object();
      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        if (xAxisObject[item.xAxisValue] == undefined) {
          xAxisObject[item.xAxisValue] = new Object();
          typeObject[item.xAxisValue] = new Object();
        }
        xAxisObject[item.xAxisValue][item.yAxisLabel] = data[i].yAxisValue;
        typeObject[item.xAxisValue][item.yAxisLabel] = data[i].axisNo;  //TODO
      }
      var xAxisData = Object.getOwnPropertyNames(xAxisObject);
      var series = new Array();
      var legend = [
          'MU-Act',
          'MU-BM'
        ];
      //Object.getOwnPropertyNames(xAxisObject[xAxisData[0]]);
      for (var i = 0; i < xAxisData.length; i++) {
        for (var j = 0; j < legend.length; j++) {
          if (series[j] == undefined) {
            series[j] = new Object();
            series[j].name = legend[j];
            series[j].type = 'line';
            // series[j].stack = stack;
            series[j].data = new Array();  // if(legend[j].indexOf('T1') != -1 ||legend[j].indexOf('T2') != -1　|| legend[j].indexOf('T3') != -1 || legend[j].indexOf('Benchmark') != -1) {
                                           //     series[j].type = 'line';
                                           //     // series[j].yAxisIndex = 0;
                                           // }else if(legend[j].indexOf('Actual') != -1){
                                           //     series[j].type = 'bar';
                                           //     // series[j].yAxisIndex = 0;
                                           // }else{
                                           //     series[j].type = 'bar';
                                           //     // series[j].yAxisIndex = 0;
                                           // }
          }
          if (typeObject[xAxisData[i]][legend[j]] == 1) {
            series[j].type = 'line';
          } else if (typeObject[xAxisData[i]][legend[j]] == 0) {
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
      for (var i = 0; i < legend.length; i++) {
        $scope.option[chart].legend.selected[legend[i]] = false;
        if (legend[i].indexOf('T2') != -1 || legend[i].indexOf('Act') != -1 || legend[i].indexOf('BM') != -1) {
          $scope.option[chart].legend.selected[legend[i]] = true;
        }
      }
      $scope.option[chart].yAxis[0].name = data[0].unit != undefined ? '(' + data[0].unit + ')' : '';
      $scope.option[chart].xAxis[0].data = xAxisData;
      $scope.option[chart].series = series;
      $scope.charts[chart] = echarts.init(document.getElementById(chart), theme);
      $scope.charts[chart].setOption($scope.option[chart]);
    };
    $scope.getBarLineChart = function (data, chart, option) {
      //x
      var xAxisObject = new Object();
      var typeObject = new Object();
      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        if (xAxisObject[item.xAxisValue] == undefined) {
          xAxisObject[item.xAxisValue] = new Object();
          typeObject[item.xAxisValue] = new Object();
        }
        xAxisObject[item.xAxisValue][item.yAxisLabel] = data[i].yAxisValue;
        typeObject[item.xAxisValue][item.yAxisLabel] = data[i].axisNo;  //TODO
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
            series[j].data = new Array();  // if(legend[j].indexOf('T1') != -1 ||legend[j].indexOf('T2') != -1　|| legend[j].indexOf('T3') != -1 || legend[j].indexOf('Benchmark') != -1) {
                                           //     series[j].type = 'line';
                                           //     // series[j].yAxisIndex = 1;
                                           // }else if(legend[j].indexOf('Actual') != -1){
                                           //     series[j].type = 'bar';
                                           //     // series[j].yAxisIndex = 0;
                                           // }else{
                                           //     series[j].type = 'bar';
                                           //     // series[j].yAxisIndex = 0;
                                           // }
          }
          if (typeObject[xAxisData[i]][legend[j]] == 1) {
            series[j].type = 'line';
          } else if (typeObject[xAxisData[i]][legend[j]] == 0) {
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
      for (var i = 0; i < legend.length; i++) {
        $scope.option[chart].legend.selected[legend[i]] = false;
        if (legend[i].indexOf('T2') != -1 || legend[i].indexOf('Act') != -1 || legend[i].indexOf('BM') != -1) {
          $scope.option[chart].legend.selected[legend[i]] = true;
        }
      }
      $scope.option[chart].yAxis[0].name = data[0].unit != undefined ? '(' + data[0].unit + ')' : '';
      $scope.option[chart].xAxis[0].data = xAxisData;
      $scope.option[chart].series = series;
      $scope.charts[chart] = echarts.init(document.getElementById(chart), theme);
      $scope.charts[chart].setOption($scope.option[chart]);
    };
    $scope.getMixBarChart = function (data, chart, option) {
      //x
      var xAxisObject = new Object();
      var typeObject = new Object();
      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        if (xAxisObject[item.xAxisValue] == undefined) {
          xAxisObject[item.xAxisValue] = new Object();
          typeObject[item.xAxisValue] = new Object();
        }
        xAxisObject[item.xAxisValue][item.yAxisLabel] = data[i].yAxisValue * 100;
        typeObject[item.xAxisValue][item.yAxisLabel] = data[i].axisNo;  //TODO
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
          if (typeObject[xAxisData[i]][legend[j]] == 1) {
            series[j].type = 'line';
          } else if (typeObject[xAxisData[i]][legend[j]] == 0) {
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
      for (var i = 0; i < legend.length; i++) {
        $scope.option[chart].legend.selected[legend[i]] = false;
        if (legend[i].indexOf('T2') != -1 || legend[i].indexOf('Act') != -1 || legend[i].indexOf('BM') != -1) {
          $scope.option[chart].legend.selected[legend[i]] = true;
        }
      }
      $scope.option[chart].xAxis[0].data = xAxisData;
      $scope.option[chart].series = series;
      $scope.charts[chart] = echarts.init(document.getElementById(chart), theme);
      $scope.charts[chart].setOption($scope.option[chart]);
    };
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
  }
]);
;
angular.module('SeanApp').controller('OtherOverviewController', [
  '$rootScope',
  '$scope',
  '$http',
  '$timeout',
  '$window',
  '$state',
  function ($rootScope, $scope, $http, $timeout, $window, $state) {
    var widgetHeight;
    $scope.charts = new Array();
    $scope.option = new Array();
    $scope.$on('ngRepeatFinished', function (repeatFinishedEvent) {
    });
    $scope.$on('$viewContentLoaded', function () {
      $('.portlet .fa-download,.portlet .fa-search-plus').bind('click', function () {
        var id = $(this).parents('.portlet').find('.ops-chart').attr('id');
        var title = $(this).parents('.portlet').find('.caption-subject').html();
        window.localStorage.setItem('chartOption', JSON.stringify($scope.option[id]));
        window.localStorage.setItem('title', title);
        $state.go('chart');
      });
      initWidgetHeight();
      // $scope.getfilterList();
      $scope.getBuList($rootScope.entityShortName);
      $scope.getOverviewData($rootScope.entityShortName);
      $scope.timer = $timeout(function () {
        $scope.timeout = null;
        angular.element($window).bind('resize', function () {
          $scope.timeout = $timeout(function () {
            $scope.initEchart($scope.overviewData);
            $timeout.cancel($scope.timeout);
          }, 300);
        });
      }, 600);
      $scope.$on('$destroy', function (event) {
        $timeout.cancel($scope.timer);
        angular.element($window).unbind('resize');
      });
    });
    //单轴
    var trendOption1 = {
        tooltip: { trigger: 'axis' },
        legend: { bottom: 48 },
        grid: {
          show: false,
          x: 40,
          y: 26,
          x2: 30,
          y2: 98
        },
        xAxis: [{
            type: 'category',
            axisLabel: {
              interval: 0,
              rotate: 45,
              margin: 6
            }
          }],
        yAxis: [{
            type: 'value',
            name: '',
            axisLabel: {
              formatter: function (value) {
                return value;
              }
            },
            splitLine: { show: false }
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
    //双轴
    var trendOption2 = {
        tooltip: { trigger: 'axis' },
        legend: { bottom: 48 },
        grid: {
          show: false,
          x: 40,
          y: 26,
          x2: 30,
          y2: 138
        },
        xAxis: [{
            type: 'category',
            axisLabel: {
              interval: 0,
              rotate: 45,
              margin: 6
            }
          }],
        yAxis: [{
            type: 'value',
            name: '',
            axisLabel: {
              formatter: function (value) {
                return value;
              }
            },
            splitLine: { show: false }
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
    //叠柱
    var ageOption = {
        tooltip: { trigger: 'axis' },
        legend: {
          width: 640,
          left: 'center',
          bottom: 48
        },
        grid: {
          show: false,
          x: 40,
          y: 26,
          x2: 20,
          y2: 128
        },
        xAxis: [{
            type: 'category',
            axisLabel: {
              interval: 0,
              rotate: 45,
              margin: 6
            }
          }],
        yAxis: [{
            type: 'value',
            name: '',
            axisLabel: { formatter: '{value}' },
            splitLine: { show: false }
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
    var initWidgetHeight = function () {
      var height = $(window).height() - 63.99 - 77.78 - 18.89 - 50;
      $('.page-content').css('min-height', height);
      widgetHeight = 274;
      // (height -77.8 -60) / 2 ;
      $('.yfops-widget').css('min-height', widgetHeight);
      $('.yfops-map').css('min-height', widgetHeight - 4);
    };
    $scope.initEchart = function (data) {
      if (!data || data == undefined) {
        return;
      }
      var valueArray = [
          data.mu,
          data.activeDimissionRate,
          data.personnelExpensesWithBU,
          data.personnelExpensesWithCompany
        ];
      $scope.values = new Array();
      for (var i = 0; i < valueArray.length; i++) {
        if (valueArray[i].length == 0)
          continue;
        // console.log(valueArray[i]);
        $scope.values[i] = new Object();
        if (valueArray[i][0].axisValue > valueArray[i][1].axisValue) {
          $scope.values[i].state = 'up';
        } else if (valueArray[i][0].axisValue < valueArray[i][1].axisValue) {
          $scope.values[i].state = 'down';
        } else {
          $scope.values[i].state = 'equals';
        }
        $scope.values[i].axisValue = valueArray[i][0].axisValue;
        $scope.values[i].percent = valueArray[i][0].axisValue / valueArray[i][1].axisValue * 100;
        $scope.values[i].lable = valueArray[i][0].lable;
        $scope.values[i].axis = valueArray[i][0].axis + '/' + valueArray[i][1].axis;
        $scope.values[i].unit = valueArray[i][0].unit;
      }
      try {
        $scope.title1 = data.muTrendMonth[0].lable;
        $scope.getBarLineChartMU(data.muTrendMonth, 'chart1', trendOption2, 50, 100);
      } catch (e) {
      }
      try {
        $scope.title2 = data.muTrendYear[0].lable;
        $scope.getBarLineChartMU(data.muTrendYear, 'chart2', trendOption2, 85, 100);
      } catch (e) {
      }
      try {
        $scope.title3 = data.personnelExpensesTrendWithBUByMonth[0].lable;
        $scope.getBarLineChart(data.personnelExpensesTrendWithBUByMonth, 'chart3', trendOption2, 50, 100);
      } catch (e) {
      }
      try {
        $scope.title4 = data.personnelExpensesTrendWithBUByYear[0].lable;
        $scope.getBarLineChart(data.personnelExpensesTrendWithBUByYear, 'chart4', trendOption2, 85, 100);
      } catch (e) {
      }
      try {
        $scope.title5 = data.personnelExpensesTrendWithCompanyByMonth[0].lable;
        $scope.getBarLineChart(data.personnelExpensesTrendWithCompanyByMonth, 'chart5', trendOption2, 50, 100);
      } catch (e) {
      }
      try {
        $scope.title6 = data.personnelExpensesTrendWithCompanyByYear[0].lable;
        $scope.getBarLineChart(data.personnelExpensesTrendWithCompanyByYear, 'chart6', trendOption2, 85, 100);
      } catch (e) {
      }
      try {
        $scope.title7 = data.activeDimissionRateTrendMonth[0].lable;
        $scope.getBarLineChart(data.activeDimissionRateTrendMonth, 'chart7', trendOption2, 50, 100);
      } catch (e) {
      }
      try {
        $scope.title8 = data.activeDimissionRateTrendYear[0].lable;
        $scope.getBarLineChart(data.activeDimissionRateTrendYear, 'chart8', trendOption2, 85, 100);
      } catch (e) {
      }
    };
    // var initializeChartSize = function() {
    //     $timeout.cancel($scope.layout);
    //     $scope.layout = $timeout(function(){
    //         initEchart($scope.overviewData);
    //     },80);
    // };
    $scope.getBuListSuccess = function (buList) {
      $rootScope.BuList = new Object();
      $rootScope.ALLBuList = new Array();
      for (var i = 0; i < buList.length; i++) {
        var shortName = buList[i].buCodeShortName;
        if (shortName == null)
          continue;
        if ($rootScope.BuList[shortName] == undefined) {
          $rootScope.BuList[shortName] = new Array();
        }
        $rootScope.BuList[shortName].push(buList[i]);
        $rootScope.ALLBuList.push(buList[i]);
      }
      //bu列表
      $rootScope.BuNameList = Object.getOwnPropertyNames($rootScope.BuList);
      $rootScope.BuNameList = $rootScope.BuNameList.sort();
      $rootScope.entityShortName = $state.params['id'] || buList[0].pubCodeShortName || 'JIT PBU';
    };
    $scope.getBuList = function (pubCodeShortName) {
      $rootScope.pubCodeShortName = pubCodeShortName;
      $http.get($rootScope.settings.api + '/finance/queryBuList').success(function (json) {
        ///////真数据
        $scope.BuListObject = json.BuList;
        $scope.getBuListSuccess($scope.BuListObject);
        $scope.getOverviewData($rootScope.entityShortName);
        $scope.refreshChinaMap($rootScope.entityShortName);
      }).error(function () {
        console.log('\u8bf7\u6c42error,\u53d6\u5047\u6570\u636e');
        $scope.BuListObject = queryBuList.BuList;
        $scope.getBuListSuccess($scope.BuListObject);
        $scope.getOverviewData($rootScope.entityShortName);
        $scope.refreshChinaMap($rootScope.entityShortName);
      });
    };
    $scope.$on('onSelectedPBU', function (scope, buShortName) {
      // $rootScope.buCodeShortName = buShortName;
      // $rootScope.entityShortName = buShortName;
      // $scope.getOverviewData($rootScope.entityShortName);
      // $scope.refreshChinaMap($rootScope.entityShortName);
      // $('.yfops-sparkline li.active').removeClass('active');
      window.location.href = '#/OtherOverview';
    });
    $scope.selectBU = function (buShortName, $event) {
      // $rootScope.buCodeShortName = buShortName;
      // $rootScope.entityShortName = buShortName;
      // $('.yfops-sparkline li.active').removeClass('active');
      // $($event.currentTarget).addClass('active');
      // $scope.getOverviewData(buShortName);
      // $scope.refreshChinaMap(buShortName);
      window.location.href = '#/other/' + buShortName;
    };
    $scope.refreshChinaMap = function (buShortName) {
      var locations = new Array();
      var keys;
      if (buShortName != 'JIT PBU' && $rootScope.BuList[buShortName] != undefined) {
        keys = $rootScope.BuList[buShortName];
      } else {
        keys = $rootScope.ALLBuList;
      }
      for (var i = 0; i < keys.length; i++) {
        var entity = {
            'action': 'tooltip',
            'id': keys[i].entityCode,
            'title': keys[i].entityShortName,
            'description': keys[i].entityShortName,
            'link': '#/other/' + keys[i].entityShortName,
            'x': keys[i].axisX || 0,
            'y': keys[i].axisY || 0
          };
        locations.push(entity);
      }
      var option = angular.copy(mapOption);
      option.levels[0].locations = locations;
      $scope.initChinaMap(option);
    };
    $scope.initChinaMap = function (option) {
      if ($('#mapplic').size() === 0) {
        return;
      }
      $('#mapplic').html('').data('mapplic', null);
      var h = widgetHeight - 2;
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
    $scope.$on('onSelectedPBU', function (scope, buShortName) {
      $rootScope.buCodeShortName = buShortName;
      $rootScope.entityShortName = buShortName;
      $scope.getOverviewData($rootScope.entityShortName);
    });
    $scope.getOverviewData = function (entityName) {
      var param = { 'entityName': entityName || 'JIT PBU' };
      $http.post($rootScope.settings.api + '/other/queryOverviewData', param).success(function (json) {
        $scope.overviewData = json;
        $scope.initEchart($scope.overviewData);
      }).error(function () {
        ////假数据
        $scope.overviewData = otherQueryOverviewData;
        $scope.initEchart($scope.overviewData);
      });
    };
    $scope.getBarLineChartMU = function (data, chart, option, start, end) {
      //x
      var xAxisObject = new Object();
      var typeObject = new Object();
      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        if (xAxisObject[item.xAxisValue] == undefined) {
          xAxisObject[item.xAxisValue] = new Object();
          typeObject[item.xAxisValue] = new Object();
        }
        xAxisObject[item.xAxisValue][item.yAxisLabel] = data[i].yAxisValue;
        typeObject[item.xAxisValue][item.yAxisLabel] = data[i].axisNo;  //TODO
      }
      var xAxisData = Object.getOwnPropertyNames(xAxisObject);
      var series = new Array();
      // var legend = Object.getOwnPropertyNames(xAxisObject[xAxisData[0]]);
      var legend = [
          'MU-Act',
          'MU-BM'
        ];
      for (var i = 0; i < xAxisData.length; i++) {
        for (var j = 0; j < legend.length; j++) {
          if (series[j] == undefined) {
            series[j] = new Object();
            series[j].name = legend[j];
            series[j].type = 'line';
            // series[j].stack = stack;
            series[j].data = new Array();
            //sql里 T1 T2 T3的type是 0
            // if(legend[j].indexOf('T1')!= -1 || legend[j].indexOf('T2')!= -1 || legend[j].indexOf('T3')!= -1 || legend[j].indexOf('Benchmark')!= -1){
            //     series[j].type = 'line';
            //     // series[j].yAxisIndex = 1;
            // }else{
            //     series[j].type = 'bar';
            //     // series[j].yAxisIndex = 0;
            // }
            if (typeObject[xAxisData[i]][legend[j]] == 1) {
              series[j].type = 'line';
            } else if (typeObject[xAxisData[i]][legend[j]] == 0) {
              series[j].type = 'bar';
            }
          }
          series[j].data.push(xAxisObject[xAxisData[i]][legend[j]] || 0);
        }
      }
      //set chart option
      $scope.option[chart] = angular.copy(option);
      $scope.option[chart].legend.data = legend;
      //默认勾选T2 ACTUAL
      $scope.option[chart].legend.selected = new Object();
      for (var i = 0; i < legend.length; i++) {
        $scope.option[chart].legend.selected[legend[i]] = false;
        if (legend[i].indexOf('T2') != -1 || legend[i].indexOf('Act') != -1 || legend[i].indexOf('BM') != -1) {
          $scope.option[chart].legend.selected[legend[i]] = true;
        }
      }
      $scope.option[chart].yAxis[0].name = data[0].unit != undefined ? '(' + data[0].unit + ')' : '';
      $scope.option[chart].xAxis[0].data = xAxisData;
      $scope.option[chart].series = series;
      $scope.option[chart].dataZoom[0].start = start;
      $scope.option[chart].dataZoom[0].end = end;
      $scope.charts[chart] = echarts.init(document.getElementById(chart), theme);
      $scope.charts[chart].setOption($scope.option[chart]);
    };
    $scope.getBarLineChart = function (data, chart, option, start, end) {
      //x
      var xAxisObject = new Object();
      var typeObject = new Object();
      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        if (xAxisObject[item.xAxisValue] == undefined) {
          xAxisObject[item.xAxisValue] = new Object();
          typeObject[item.xAxisValue] = new Object();
        }
        xAxisObject[item.xAxisValue][item.yAxisLabel] = data[i].yAxisValue;
        typeObject[item.xAxisValue][item.yAxisLabel] = data[i].axisNo;  //TODO
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
            //sql里 T1 T2 T3的type是 0
            if (legend[j].indexOf('T1') != -1 || legend[j].indexOf('T2') != -1 || legend[j].indexOf('T3') != -1 || legend[j].indexOf('BM') != -1) {
              series[j].type = 'line';  // series[j].yAxisIndex = 1;
            } else {
              series[j].type = 'bar';  // series[j].yAxisIndex = 0;
            }  // if(typeObject[xAxisData[i]][legend[j]] ==1){
               //     series[j].type = 'line';
               // }else if(typeObject[xAxisData[i]][legend[j]] ==0){
               //     series[j].type = 'bar';
               // }
          }
          series[j].data.push(xAxisObject[xAxisData[i]][legend[j]] || 0);
        }
      }
      //set chart option
      $scope.option[chart] = angular.copy(option);
      $scope.option[chart].legend.data = legend;
      //默认勾选T2 ACTUAL
      $scope.option[chart].legend.selected = new Object();
      for (var i = 0; i < legend.length; i++) {
        $scope.option[chart].legend.selected[legend[i]] = false;
        if (legend[i].indexOf('T2') != -1 || legend[i].indexOf('Act') != -1 || legend[i].indexOf('BM') != -1) {
          $scope.option[chart].legend.selected[legend[i]] = true;
        }
      }
      $scope.option[chart].yAxis[0].name = data[0].unit != undefined ? '(' + data[0].unit + ')' : '';
      $scope.option[chart].xAxis[0].data = xAxisData;
      $scope.option[chart].series = series;
      $scope.option[chart].dataZoom[0].start = start;
      $scope.option[chart].dataZoom[0].end = end;
      $scope.charts[chart] = echarts.init(document.getElementById(chart), theme);
      $scope.charts[chart].setOption($scope.option[chart]);
    };
    $scope.getMixBarChart = function (data, chart, option, start, end) {
      //x
      var xAxisObject = new Object();
      var typeObject = new Object();
      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        if (xAxisObject[item.xAxisValue] == undefined) {
          xAxisObject[item.xAxisValue] = new Object();
          typeObject[item.xAxisValue] = new Object();
        }
        xAxisObject[item.xAxisValue][item.yAxisLabel] = data[i].yAxisValue;
        typeObject[item.xAxisValue][item.yAxisLabel] = data[i].axisNo;  //TODO
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
          if (typeObject[xAxisData[i]][legend[j]] == 1) {
            series[j].type = 'line';
          } else if (typeObject[xAxisData[i]][legend[j]] == 0) {
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
      for (var i = 0; i < legend.length; i++) {
        $scope.option[chart].legend.selected[legend[i]] = false;
        if (legend[i].indexOf('T2') != -1 || legend[i].indexOf('Act') != -1 || legend[i].indexOf('BM') != -1) {
          $scope.option[chart].legend.selected[legend[i]] = true;
        }
      }
      $scope.option[chart].yAxis[0].name = data[0].unit != undefined ? '(' + data[0].unit + ')' : '';
      $scope.option[chart].xAxis[0].data = xAxisData;
      $scope.option[chart].series = series;
      $scope.option[chart].dataZoom[0].start = start;
      $scope.option[chart].dataZoom[0].end = end;
      $scope.charts[chart] = echarts.init(document.getElementById(chart), theme);
      $scope.charts[chart].setOption($scope.option[chart]);
    };
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    $rootScope.entityShortName = $state.params['id'] || 'JIT PBU';
    console.log('shortName:' + $rootScope.entityShortName);
  }
]);