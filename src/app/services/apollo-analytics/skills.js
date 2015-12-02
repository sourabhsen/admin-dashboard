'use strict';
(function(window, angular, undefined){
  function Skills(Restangular, TenantService, _, $q){
    let model = this;

    model.topn = function(params){
      let tenant = TenantService.getTenant().value;
      return Restangular.one(tenant, 'skills').one('topn').get(params);
    };

    model.topnTotal = function(params){
      let tenant = TenantService.getTenant().value;
      let paramConfig = _.extend({'totalCount' : true}, params);
      return Restangular.one(tenant, 'skills').one('topn').get(paramConfig);
    };

    model.topnAll = function(params){
      let deferred = $q.defer();
      let all = [];

      all.push(model.topn(params));
      all.push(model.topnTotal(params));

      $q.all(all).then(function(results){
        let firstResponses = results[0].data;
        let secondResponses = results[1].data;

        // return groomed data
        let response = {
          'data' : firstResponses,
          'totalCount' : secondResponses
        };

        deferred.resolve(response);
      });

      return deferred.promise;
    };
  }

  Skills.$inject = ['Restangular', 'TenantService','lodash', '$q'];

  angular.module('admin-dashboard')
  .service('Skills', Skills);
})(window, window.angular);
