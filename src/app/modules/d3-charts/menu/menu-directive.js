'use strict';
(function(window, angular, undefined){
  /**
   * @ngdoc directive
   * @name  d3ChartMenu
   * @description
   * A dropdown menu component
   *
   * example implementation
   * <d3-chart-menu config="configObejct"></d3-chart-menu>
   */
  function menu(ChartMenuService){
    return {
      require     : '^d3Chart',
      replace     : true,
      transclude  : true,
      scope       : true,
      templateUrl : 'app/modules/d3-charts/menu/menu-template.html',
      link        : function(scope, elem, attr, ctrl){
        // initiatlize menu items by merging the passed in config
        // with default values in service
        scope.menu = angular.merge({}, ChartMenuService.defaultMenu(), ctrl.config.menu);
      }
    };
  }
  menu.$inject = ['ChartMenuService'];

  angular.module('d3Charts')
  .directive('d3ChartMenu', menu);

})(window, window.angular);
