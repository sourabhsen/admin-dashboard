'use strict';
(function(window, angular, undefined){
  /**
   * @ngdoc directive
   * @name  d3ChartInfo
   * @description
   * A popover info component
   *
   * example implementation
   * <d3-chart-info config="configObejct"></d3-chart-info>
   */
  function info(ChartInfoService){
    return {
      require     : '^d3Chart',
      replace     : true,
      transclude  : true,
      scope       : true,
      templateUrl : 'app/modules/d3-charts/info/info-template.html',
      link        : function(scope, elem, attr, ctrl){
        scope.infoPopoverOpts = {
          title       : 'About this chart',
          content     : ctrl.config.infoContent || 'lorem ipsum lorem ipsum lorem ipsum lorem ipsum',
        };
      }
    };
  }
  info.$inject = ['ChartInfoService'];

  angular.module('d3Charts')
  .directive('d3ChartInfo', info);

})(window, window.angular);
