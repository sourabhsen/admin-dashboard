'use strict';
(function(window, angular, undefined){
  function textual(){
    return {
      require : '^d3Chart',
      transclude  : true,
      scope       : true,
      templateUrl : 'app/modules/d3-charts/textual/textual-template.html',
      link        : function(scope, elem, attr, ctrl){
        function update(config){
          scope.textual = ctrl.config.textual;
        }
        ctrl.addUpdateListener(update.bind(this));
      }
    };
  }

  textual.$inject = [];

  angular.module('d3Charts')
  .directive('d3ChartTextual', textual);
})(window, window.angular);
