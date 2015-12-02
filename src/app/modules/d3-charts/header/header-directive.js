'use strict';
(function(window, angular, undefined){
  function header(){
    return {
      require     : '^d3Chart',
      replace     : true,
      transclude  : true,
      scope       : true,
      templateUrl : 'app/modules/d3-charts/header/header-template.html',
      link        : function(scope, elem, attr, ctrl){
        // set directive specific scope variables
        scope.title = ctrl.config.title;
        scope.menu  = ctrl.config.menu;
      }
    };
  }
  header.$inject = [];

  angular.module('d3Charts')
  .directive('d3ChartHeader', header);

})(window, window.angular);
