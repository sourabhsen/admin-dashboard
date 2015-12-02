'use strict';
(function(window, angular, undefined){
  function Jobapplication(Restangular, TenantService, _, $q){
    let model = this;

    model.topn = function(params, resource){
      let tenant = TenantService.getTenant().value;
      return Restangular.one(tenant, 'jobapplication').one('topn', resource).get(params);
    };

    model.topnTotal = function( params, resource){
      let tenant = TenantService.getTenant().value;
      let paramConfig = _.extend({'totalCount' : true}, params);
      return Restangular.one(tenant, 'jobapplication').one('topn', resource).get(paramConfig);
    };

    model.topnAll = function(params, resource){
      let deferred = $q.defer();
      let all = [];

      all.push(model.topn(params, resource));
      all.push(model.topnTotal(params, resource));

      $q.all(all).then(function(results){
        let firstResponses = results[0].data;
        let totalCount = results[1].data;

        // return groomed data
        let response = {
          'data' : firstResponses,
          'totalCount' : totalCount[0].totalCount
        };

        deferred.resolve(response);
      });

      return deferred.promise;
    };

    model.volume = function(params) {
      let tenant = TenantService.getTenant().value;
      return Restangular.one(tenant, 'jobapplication').one('volume').get(params);
    };

    model.status = function(params) {
      let tenant = TenantService.getTenant().value;
      return Restangular.one(tenant, 'jobapplication').one('status').get(params);
    };
  }

  Jobapplication.$inject = ['Restangular', 'TenantService','lodash', '$q'];

  angular.module('apollo-analytics')
  .service('Jobapplication', Jobapplication);

})(window, window.angular);
