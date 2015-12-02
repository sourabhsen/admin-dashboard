'use strict';
(function(window, angular, undefined){
  function Careergoals(Restangular, TenantService, _, $q){
    let model = this;
    model.topn  = function(params){
      let tenant = TenantService.getTenant().value;
      return Restangular.one(tenant, 'careergoals').all('topn').getList(params);
    };

    model.topnTotal = function( params){
      let tenant = TenantService.getTenant().value;
      let paramConfig = _.extend({'totalCount' : true}, params);
      return Restangular.one(tenant, 'careergoals').all('topn').getList(paramConfig);
    };

    model.topnAll = function(params){
      let deferred = $q.defer();
      let all = [];

      all.push(model.topn(params));
      all.push(model.topnTotal(params));

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

  }

  Careergoals.$inject = ['Restangular', 'TenantService','lodash', '$q'];

  angular.module('apollo-analytics')
  .service('Careergoals', Careergoals);

})(window, window.angular);
