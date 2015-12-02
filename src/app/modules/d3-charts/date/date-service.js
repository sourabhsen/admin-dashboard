'use strict';
/* global moment */
(function(window, angular, undefined){
  /**
   * @ngdoc service
   * @name  ChartMenuService
   * @description
   * Provide functionality for the ChartDateController and d3ChartDate directive
   */
  function ChartDateService($rootScope, $log, $http, _, ngDialog){
    var model;

    model = this;
    /**
     * Sets date range value on config object
     * Requires the config to pass in a dates.defaultRange
     * array specifying the amount to subtract from today's date
     * followed by the unit for example [1, 'Y']
     * substract 1 Year from today
     * @param  {object} config chart config
     * @return {object }       date object
     */
    model.initializeDate = function(config){
      let startOfMonth = moment().startOf('month');
      let range        = config.range ? config.range : 1;
      let interval     = config.interval ? config.interval : 'M';
      let date = {
        from: {
          date   : moment(startOfMonth).subtract(range, interval).format('MM/DD/YY'),
          picker : moment(startOfMonth).subtract(range, interval).format('MM/DD/YYYY'),
          isOpen : false
        },
        to: {
          date   : moment(startOfMonth).subtract(range, interval).endOf('month').format('MM/DD/YY'),
          picker : moment(startOfMonth).subtract(range, interval).endOf('month').format('MM/DD/YYYY'),
          isOpen : false
        }
      };
      return date;
    };

    // TODO: add functionality to update date range changes
    model.selectDateRange = function(from, to, config){
      var date;
      if(!from || !to) {
        // TODO: send error back to form control for display
        $log.warn('Did not pick two valid dates!');
        return false;
      } else {
         $rootScope.$broadcast('ns:popover:hide');
          date = {
            from: {
              date   : moment(new Date(from)).format('MM/DD/YY'),
              picker : moment(new Date(from)).format('MM/DD/YYYY'),
              isOpen : false
            },
            to: {
              date   : moment(new Date(to)).format('MM/DD/YY'),
              picker : moment(new Date(to)).format('MM/DD/YYYY'),
              isOpen : false
            }
          };
        return date;
      }
    };

    model.minDate = function(){
      return moment(new Date('2013'))._d;
    };

    model.maxDate = function() {
      return $http.get('/api/analytics-service/1/uopx/etljobs/status',{
        // headers: {
        //   'Authorization': 'Basic YXB0X2FjY2VwdGFuY2VfYWNjb3VudDphcHRfYWNjZXB0YW5jZV9hY2NvdW50'
        // },
      }).then(function(response){

        let _data = _.min(response.data, function(item){
          return moment(item.lastRunDate)._d;
        });

        return moment(_data.lastRunDate)._d;
      }, function(response){
        return moment()._d; //set maxdate to present day
      });
    };

    model.lastWeek = function(){
      let to    = moment().startOf('week').add(1,'d').format('MM/DD/YYYY');
      let from  = moment(new Date(to)).subtract(1,'w').format('MM/DD/YYYY');
      let range = [from, to];

      return range;
    };

    model.lastMonth = function(){
      let to    = moment().startOf('month').format('MM/DD/YYYY');
      let from  = moment(new Date(to)).subtract(1,'M').format('MM/DD/YYYY');
      let range = [from, to];

      return range;
    };

    model.lastQuarter = function(){
      let to    = moment().startOf('quarter').format('MM/DD/YYYY');
      let from  = moment(new Date(to)).subtract(1,'Q').format('MM/DD/YYYY');
      let range = [from, to];

      return range;
    };

    model.customDateRange = function(global, dateConfig){
          ngDialog.open({
            template: 'app/modules/d3-charts/date/date-picker-modal.html',
            showClose: false,
            className: 'ngdialog-theme-default ch-date-modal',
            resolve: {
              global: function(){
                return global;
              },
              config: function(){
                return dateConfig;
              }
            },
            controller: ['$scope', 'global', 'config', 'ChartDateService',  function($scope, global, config, ChartDateService){
              let model = this;

              /**
               * Event handler for date range selection change
               * calls to service to update date range object and then
               * calls to config update function to update chart
               * @param  {string} from date selected
               * @param  {string} to   date selected
               */

              model.selectDateRange = function(from, to){
                let range = ChartDateService.selectDateRange(from, to);
                if(range){
                   $rootScope.$emit('global-date', {name: 'Custom', value: 'custom'}, range);
                  ngDialog.close();
                }
              };
            }],
            controllerAs: 'ctrl'
          });
        };

  }


  ChartDateService.$inject = ['$rootScope', '$log', '$http', 'lodash', 'ngDialog'];

  angular.module('d3Charts')
  .service('ChartDateService', ChartDateService);

})(window, window.angular);
