'use strict';
(function(window, angular, undefined){
  /**
   * @ngdoc directive
   * @name  d3ChartDate
   * @description
   * A date picker component
   *
   * example implementation
   * <d3-chart-date config="configObejct"></d3-chart-date>
   */
  function date(ChartDateService, ngDialog, $filter){
    return {
      require     : '^d3Chart',
      replace     : true,
      transclude  : true,
      scope       : true,
      templateUrl : 'app/modules/d3-charts/date/date-template.html',
      link        : function(scope, elem, attr, ctrl){
        // attemp to make accessible by keyboard, not working :(
        let target = 'ch-date'+Math.round(Math.random() * 1000);
        elem.attr('id',target);
        scope.target = '#'+target;

        // initialize date from service
        ctrl.config.dates = {
          range : ctrl.config.dates &&  ctrl.config.dates.range ?  ctrl.config.dates.range : ChartDateService.initializeDate(ctrl.config),
          min   : ChartDateService.minDate(),
        };

        // initialize maxDate from service
        // if(ctrl.config.dates){
          ChartDateService.maxDate().then(function(result){
            ctrl.config.dates.max = result;
          });
        // }
        scope.config = ctrl.config;
        // send update to chart config update function
        ctrl.config.update(ctrl.config);

        scope.quickPick = function(time){
          let range = ChartDateService[time]();
          ctrl.config.dates.range = ChartDateService.selectDateRange(range[0], range[1], scope.config);
          ctrl.config.update(ctrl.config);
        };

        scope.customDateRange = function(){
          ngDialog.open({
            template: 'app/modules/d3-charts/date/date-picker-modal.html',
            showClose: false,
            className: 'ngdialog-theme-default ch-date-modal',
            resolve: {
              config: function(){
                return ctrl.config;
              }
            },
            controller: ['$scope', 'config', function($scope, config){
              let model = this;
              model.config = config;
              /**
               * Event handler for date range selection change
               * calls to service to update date range object and then
               * calls to config update function to update chart
               * @param  {string} from date selected
               * @param  {string} to   date selected
               */
              model.selectDateRange = function(from, to){
                var range = ChartDateService.selectDateRange(from, to);
                if(range){
                  model.config.dates.range = range;
                  model.config.update(model.config);
                  ngDialog.close();
                }
              };
            }],
            controllerAs: 'ctrl'
          });
        };

        scope.$watch('config.dates.range.from.picker', function(newval){
          scope.config.dates.range.from.picker = $filter('date')(newval, 'MM/dd/yy');
        });
        scope.$watch('config.dates.range.to.picker', function(newval){
          scope.config.dates.range.to.picker = $filter('date')(newval, 'MM/dd/yy');
        });
      }
    };
  }

  date.$inject = ['ChartDateService', 'ngDialog', '$filter'];

  angular.module('d3Charts')
  .directive('d3ChartDate', date);

})(window, window.angular);
