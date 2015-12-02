'use strict';
(function(window, angular, undefined){
  function FiltersService($q, $timeout, Restangular, TenantService, TenantFilters){
    let model = this;

    function init() {
      let deferred        = $q.defer();
      // get tenant
      let tenant          = TenantService.getTenant().value;
      // get tenant filter config
      model.tenantFilters = TenantFilters.getTenantFilters(tenant)[0];
      // setup Restangular
      let _filters        = Restangular.one(tenant, 'filters');
      // create promise array of requests
      let filterRequests  = model.tenantFilters.resource.map(function(service){
        // {pageNumber: 0} is hack until errorReponseInterceptor is fixed
        return _filters.one(service).get({pageNumber: 0});
      });

      // wait for all promises to resolve
      $q.all(filterRequests).then(function(results){
        model.tenantFilters.resource.forEach(function(tf, i){
          model[tf] = results[i].data;
        });
        deferred.resolve(results);
      });
      return deferred.promise;
    }

    let ready = init();

    // get filters only once per page load
    model.getFilters = function(){
      let deferred = $q.defer();
      $q.when(ready).then(function(){
        deferred.resolve(model.tenantFilters.resource.map(function(tf){
          return {resource: tf,  data: model[tf]};
        }));
      });
      return deferred.promise;
    };
  }

  FiltersService.$inject = ['$q', '$timeout', 'Restangular', 'TenantService', 'TenantFilters'];

  angular.module('apollo-analytics')
  .service('FiltersService', FiltersService);
})(window, window.angular);
