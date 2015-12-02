'use strict';
(function(window, angular, undefined){
  function message(){
    return {
      replace     : true,
      transclude  : true,
      scope       : {
        config: '='
      },
      templateUrl : 'app/modules/d3-charts/message/message-template.html',
      link        : function(scope, elem, attr){
        scope.message = scope.config.data.message;
      }
    };
  }

  message.$inject = [];

  angular.module('d3Charts')
  .directive('d3ChartMessage', message);
})(window, window.angular);
