'use strict';
(function(window, angular, undefined){
  /**
   * @ngdoc directive
   * @name  d3ChartFilters
   * @description
   * A filters component
   *
   * example implementation
   * <d3-chart-filters config="configObejct"></d3-chart-filters>
   */
  function filters($rootScope, ChartFilterService, ngDialog){

    return {
      require     : '^d3Chart',
      replace     : true,
      transclude  : true,
      scope       : true,
      templateUrl : 'app/modules/d3-charts/filters/filters-template.html',
      link        : function(scope, elem, attr, ctrl){
        scope.config = ctrl.config;
        ctrl.config.filterStatus = 'None';
        ctrl.config.titles = [];
        // pass all logic to chart filter service to process
        // this way only DOM functions are held in directive link fn
        // unit testing is easier as well since you don't need to mock DOM
        ChartFilterService.initFilters(ctrl.config);

        scope.open = function($event){
          $event.preventDefault();
          $event.stopPropagation();
          // need to add dynamic call here when other filters are ready
          ChartFilterService.uopxFilterModal(ctrl.config);
        };

      }
    };
  }
  filters.$inject = ['$rootScope', 'ChartFilterService', 'ngDialog'];

  angular.module('d3Charts')
  .directive('d3ChartFilters', filters);

})(window, window.angular);
