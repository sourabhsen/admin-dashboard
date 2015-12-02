'use strict';
(function(window, angular, undefined){
  function Users(Restangular, TenantService){
    let model = this;

    model.milestones = function( params, resource){
      let tenant = TenantService.getTenant().value;
      return Restangular.one(tenant, 'users').one('milestones', resource).get(params);
    };

  }

  Users.$inject = ['Restangular', 'TenantService'];

  angular.module('apollo-analytics')
  .service('Users', Users);

})(window, window.angular);
