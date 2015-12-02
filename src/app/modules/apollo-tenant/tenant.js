'use strict';
(function(window, angular, undefined){
  function TenantService (){
    let model = this;

    let tenants = [
      {name: 'University of Phoenix', value: 'uopx'},
      {name: 'West', value: 'west'},
      {name: 'AEG', value: 'aeg'},
      {name: 'rockit', value: 'rockit'},
      {name: 'ironyard', value: 'ironyard'}
    ];

    let tenant = tenants[0];

    model.tenantList = function(){
      // later we will add functionality to return only
      // tenants per authorization and select the first
      return tenants;
    };

    model.getTenant = function(){
      return tenant;
    };

    model.setTenant = function(t){
      tenant = t;
    };
  }

  TenantService.$inject = [];

  angular.module('apollo-tenant')
  .service('TenantService', TenantService);
})(window, window.angular);
