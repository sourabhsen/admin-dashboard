'use strict';
(function(window, angular, undefined){
  function hozBar(){
    return {
      require : '^d3Chart',
      link    : function(scope, elem, attr, ctrl){
        var chart;
        elem.addClass('d3-hoz-bar');

        function init(){
          chart = ctrl.config.svg.chart('HozBar', ctrl.config);
        }

        function update(config){
          chart.draw(config.data);
        }

        ctrl.addInitListener(init.bind(this));

        ctrl.addUpdateListener(update.bind(this));
      }
    };
  }

  hozBar.$inject = [];

  angular.module('d3Charts')
  .directive('d3HozBar', hozBar);

})(window, window.angular);
