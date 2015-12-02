'use strict';
(function(window, angular, undefined){
  /**
   * @ngdoc directive
   * @name  d3ChartDownload
   * @description
   * A popover download component
   *
   * example implementation
   * <d3-chart-download config="configObejct"></d3-chart-download>
   */
  function download(ChartDownloadService, $timeout, _){
    return {
      require     : '^d3Chart',
      replace     : true,
      transclude  : true,
      scope       : true,
      //templateUrl : 'app/modules/d3-charts/download/download-template-popup.html',
      templateUrl : 'app/modules/d3-charts/download/download-template.html',
      link        : function(scope, elem, attr, ctrl){
        // setup scope/view variables
        scope.downloadPopoverOpts = {
          title       : 'Download',
          content     : 'lorem ipsum lorem ipsum lorem ipsum lorem ipsum',
        };
        scope.menu = angular.extend({}, ChartDownloadService.defaultMenu());
        scope.downloadConfig = angular.extend({}, ChartDownloadService.defaultConfig());
        scope.selected = scope.menu.csv;

        // TODO: add this to observer pattern using chart controller notify
        // Apply width to popover from service configuration
        $timeout(function(){
          var popover = document.querySelectorAll('.ns-popover-download-theme');
          _.map(popover, function(po){
            po.style.width = scope.downloadConfig.width  + 'px';
          });
        }, 500);

        scope.exportChart = function($event, selection){
          switch(selection.value){
            case 'PDF':
              break;
            case 'CSV':
              ChartDownloadService.exportCSV(ctrl.config.data, ctrl.config.title, true, ctrl.config.hanger);
              break;
          }
        };
      }
    };
  }
  download.$inject = ['ChartDownloadService', '$timeout', 'lodash'];

  angular.module('d3Charts')
  .directive('d3ChartDownload', download);

})(window, window.angular);
