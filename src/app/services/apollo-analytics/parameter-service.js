'use strict';
/* global moment */
(function(window, angular, undefined){
  /**
   * Shared parameter service
   */
  function ParameterService($q, $http){
    // var model;
    // model = {};
    let model = this;

    /**
     * set params object on chart config using values from date object
     * @param  {object} config chart config
     */
    model.dateRange = function(config){
      var deferred = $q.defer();
      config.params = angular.extend({}, config.params || {});
      var endDate = moment(config.dates.range.to.date, 'MM/DD/YY').format('YYYY-MM-DD');

      config.params.startDate = moment(config.dates.range.from.date,'MM/DD/YY').format('YYYY-MM-DD');
      config.params.endDate = (moment().diff(endDate, 'd') === 0)? moment(endDate).format() : endDate;

      deferred.resolve(config);
      return deferred.promise;
    };
    /**
     * Set param object on chart config using values from filter object
     * @param  {object} config chart config
     */
    model.filters = function(config){
      var deferred = $q.defer();
      if(config.filters && config.filters.data && config.filters.data.length) {
        config.filters.data.forEach(function(filter){
          if(config.params[filter.param]){
            delete config.params[filter.param];
          }
          if(filter.selected.length) {
            config.params[filter.param] = [];
            filter.selected.forEach(function(selected){
              config.params[filter.param].push(selected);
            });
          }
        });
      }
      if(config.filters && config.filters.optional) {
        config.filters.optional.forEach(function(opt){
          if(config.params[opt.param]) {
            delete config.params[opt.param];
          }
          if(opt.selected){
            config.params[opt.param] = true;
          }
        });
      }
      deferred.resolve();
      return deferred.promise;
    };
    /**
     * update params object and return promise
     * @param  {object} config chart config
     * @return {object}        Promise
     */
    model.update = function(config, opts){
      var paramsServiceUpdates = [];
      paramsServiceUpdates.push(model.dateRange(config));
      paramsServiceUpdates.push(model.filters(config));
      if(opts){
        opts.map(function(opt){
          paramsServiceUpdates.push(model[opt](config));
        });
      }
      return $q.all(paramsServiceUpdates);
    };
    /**
     * Select proper dateAggregationLevel parameter
     * Note that service currently supports
     * day, month, quarter, year
     * 1 day    = 86400000
     * ~1month  = 2419200000  (1day * 28)
     * ~2months = 4838400000  (1month * 2)
     * ~3months = 7257600000  (~1month * 3)
     * ~6month  = 14515200000 (~1month * 6)
     * 1 year   = 31536000000
     * @param  {object} config chart config
     */
    model.dateAggregationLevel = function(config){
      let deferred = $q.defer();
      let from = moment(config.dates.range.from.date, 'MM/DD/YY');
      let to = moment(config.dates.range.to.date, 'MM/DD/YY');
      let diff = to.diff(from);

      if(diff > 7257600000) { // 3months
        config.params.dateAggregationLevel = 'month';
      } else {
        config.params.dateAggregationLevel = 'day';
      }
      deferred.resolve(config);
      return deferred.promise;
    };

    model.etlJobStatus = function(){
      return $http.get('/api/analytics-service/1/uopx/etljobs/status', {
        // headers: {
        //   'Authorization': 'Basic YXB0X2FjY2VwdGFuY2VfYWNjb3VudDphcHRfYWNjZXB0YW5jZV9hY2NvdW50'
        // }
      });
    };

  }

  ParameterService.$inject = ['$q', '$http'];

  angular.module('apollo-analytics')
  .service('ParameterService', ParameterService);

})(window, window.angular);
