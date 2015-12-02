'use strict';
(function(window, angular, undefined){
  function TenantFilters (_){
    let model = this;

    let filters = [{
      tenant   : 'uopx',
      resource : ['programschool', 'programinfo'], //service properties are in use for now as a way to provide service definitions, but for multi tenancy there will need to be a way to map service data to filters dynamically, for now we hide filters except uopx
      filters  : [{
          param    : 'programSchool',
          title    : 'School',
          fn       : uopxSchools,
          options  : [],
          selected : []
        },{
          param    : 'programDegree',
          title    : 'Degree',
          fn       : uopxDegrees,
          options  : [],
          selected : []
        },{
          param    : 'program',
          title    : 'Program',
          // fn       : uopxPrograms,
          options  : [],
          selected : []
        },{
          param    : 'status',
          title    : 'Student Status',
          options  : ['Student', 'Faculty', 'Alumni' ,'Staff', 'Prospect'],
          selected : []
        }
      ],
      defaults: ['programSchool', 'programDegree', 'program', 'status'],
      optional: [{
          param    : 'preferredPartner',
          title    : 'Employer Partners'
        },{
          param    : 'tuitionReimbursement',
          title    : 'Tuition Reimbursement'
        }]
    }];
    // custom data transform functions for uopx
    function uopxSchools(data){
      let options = data.filter(function(d){
        return d.resource === 'programschool';
      }).map(function(d){
        return d.data;
      });
      return options[0];
    }
    model.uopxSchools = uopxSchools;

    function uopxDegrees(data){
      let options = data.filter(function(d){
        return d.resource === 'programinfo';
      }).map(function(d){
        return _.without(_.uniq(_.pluck(_.flatten(d.data), 'programDegree')), null);
      });
      return options[0];
    }
    model.uopxDegrees = uopxDegrees;

    function uopxPrograms(data){
      let options = data.filter(function(d){
        return d.resource === 'programinfo';
      }).map(function(d){
        return _.without(_.uniq(_.pluck(_.flatten(d.data), 'program')), null);
      });
      return options[0];
    }
    model.uopxPrograms = uopxPrograms;

    model.getTenantFilters = function(tenant){
      return filters.filter(function(fltr){
        return tenant === fltr.tenant;
      });
    };
  }

  TenantFilters.$inject = ['lodash'];

  angular.module('apollo-tenant')
  .service('TenantFilters', TenantFilters);
})(window, window.angular);




