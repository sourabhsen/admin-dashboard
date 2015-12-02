'use strict';
(function(window, angular, undefined){
  /**
   * Re-usable chart module for d3 visualizations
   * This pattern was adopted from this article http://busypeoples.github.io/post/reusable-chart-components-with-angular-d3-js/
   */
  angular.module('d3Charts', [
    'angularMoment',
    'd3Service',
    'ngResize',
    'nsPopover',
    'ui.bootstrap',
    'checklist-model'
  ]);

})(window, window.angular);
