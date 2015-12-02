'use strict';
(function(window, angular, undefined){
  function donutChart(){
    return {
      require : '^d3Chart',
      link    : function(scope, elem, attr, ctrl){
        var chart;
        elem.addClass('d3-donut-chart');

        function init(){
          chart = ctrl.config.svg.chart('DonutChart', ctrl.config);
        }

        function update(config){
          chart.draw(config.data);
        }

        ctrl.addInitListener(init.bind(this));

        ctrl.addUpdateListener(update.bind(this));
      }
    };
  }

  donutChart.$inject = [];

  angular.module('d3Charts')
  .directive('d3DonutChart', donutChart);

})(window, window.angular);
