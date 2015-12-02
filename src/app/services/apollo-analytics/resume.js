'use strict';
(function(window, angular, undefined){
  function Resume(Restangular, $q, TenantService){
    let model = this;

    model.total  = function(params){
      let tenant = TenantService.getTenant().value;
      return Restangular.one(tenant, 'resume').all('total').getList(params);
    };

    model.created  = function(params){
      let tenant = TenantService.getTenant().value;
      return Restangular.one(tenant, 'resume').all('created').getList(params);
    };

    model.getTotalAndCreatedData = function(params){
      let resumesData = [];
      let deferred = $q.defer();

      resumesData.push(model.total(params));
      resumesData.push(model.created(params));

      // complete parameter updates before calling servies
      $q.all(resumesData).then(function(results){
        let totalResumes = results[0].data;
        let totalCount = 0;
         // check totalResumes is an array with length
        if(angular.isArray(totalResumes) && totalResumes.length === 1){
          totalCount = totalResumes[0].count;
        }

        let res = {
            'total' : totalCount,
            'created' : results[1].data
          };

        deferred.resolve(res);
      });
      return deferred.promise;
    };
  }

  Resume.$inject = ['Restangular', '$q', 'TenantService'];

  angular.module('apollo-analytics')
  .service('Resume', Resume);

})(window, window.angular);
