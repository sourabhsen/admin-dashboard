'use strict';
(function(window, angular, undefined){
  function footer(){
    return {
      require     : '^d3Chart',
      replace     : true,
      transclude  : true,
      scope       : true,
      templateUrl : 'app/modules/d3-charts/footer/footer-template.html',
      link        : function(scope, elem, attr, ctrl){
        // flag to show view all
        scope.viewall = ctrl.config.viewall;
      }
    };
  }
  footer.$inject = [];

  angular.module('d3Charts')
  .directive('d3ChartFooter', footer);

})(window, window.angular);
