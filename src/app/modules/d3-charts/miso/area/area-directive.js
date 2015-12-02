
'use strict';
(function(window, angular, undefined){
  function d3Area() {
    return {
      require : '^d3Chart',
      link    : function(scope, elem, attr, ctrl){
        var chart;
        elem.addClass('d3-area');

        function init(){
          chart = ctrl.config.svg.chart('Area', ctrl.config);
        }

        function update(config){
          chart.draw(config.data);
        }

        ctrl.addInitListener(init.bind(this));

        ctrl.addUpdateListener(update.bind(this));
      }
    };
  }

  d3Area.$inject = [];

  angular.module('d3Charts')
  .directive('d3Area', d3Area);
})(window, window.angular);
