'use strict';
(function(window, angular, undefined){
  function horizontalBar(){
    return {
      require : '^d3Chart',
      link    : function(scope, elem, attr, ctrl){
        var chart;
        elem.addClass('d3-horizontal-bar');

        function init(){
          chart = ctrl.config.svg.chart('HorizontalBar', ctrl.config);
        }

        function update(config){
          chart.draw(config.data);
        }

        ctrl.addInitListener(init.bind(this));

        ctrl.addUpdateListener(update.bind(this));
      }
    };
  }

  horizontalBar.$inject = [];

  angular.module('d3Charts')
  .directive('d3HorizontalBar', horizontalBar);

})(window, window.angular);
