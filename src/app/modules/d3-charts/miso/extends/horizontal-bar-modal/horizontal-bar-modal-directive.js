'use strict';
(function(window, angular, undefined){
  function d3HorizontalBarModal($timeout){
    return{
      require : '^d3Chart',
      link    : function(scope, elem, attr, ctrl){
        var chart;
        elem.addClass('d3-horizontal-bar d3-horizontal-bar-modal');

        function init(){
          chart = ctrl.config.svg.chart('HorizontalBarModal', ctrl.config);
        }

        function update(config){

          elem.css({
            width: config.width,
            height: '70vh',
            'overflow-y': 'scroll',
            display: 'block'
          });

          chart.draw(config.data);
        }

        ctrl.addInitListener(init.bind(this));

        ctrl.addUpdateListener(update.bind(this));
        let scrollIncrement = Math.round((document.body.clientHeight/0.7)/2.25); // (doc height /70vh) = modal height
        let scrollStop = scrollIncrement;

        elem.on('scroll', function(){
          if(elem.scrollTop() > scrollStop) {
            scrollStop += scrollIncrement;
            ctrl.config.update(ctrl.config);
          }
        });
      }
    };
  }

  d3HorizontalBarModal.$inject = ['$timeout'];

  angular.module('d3Charts')
  .directive('d3HorizontalBarModal', d3HorizontalBarModal);
})(window, window.angular);
