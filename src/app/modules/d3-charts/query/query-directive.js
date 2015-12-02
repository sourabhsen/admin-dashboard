'use strict';
(function(window, angular, undefined){
  function query(){
    return {
      require     : '^d3Chart',
      replace     : true,
      transclude  : true,
      scope       : true,
      templateUrl : 'app/modules/d3-charts/query/query-template.html',
      link        : function(scope, elem, attr, ctrl){
      }
    };
  }
  query.$inject = [];

  angular.module('d3Charts')
  .directive('d3ChartQuery', query);

})(window, window.angular);
