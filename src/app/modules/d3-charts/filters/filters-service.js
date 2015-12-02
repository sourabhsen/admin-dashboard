'use strict';
(function(window, angular, undefined){
  function ChartFilterService($rootScope, FiltersService, TenantService, TenantFilters, ngDialog, _){
    let model = this;

    model.initFilters = function(config){
      // get tenant
      let tenant = TenantService.getTenant().value;
      if(tenant === 'uopx'){
         // get tenant filter config
        // currently defaults to uopx since there are no other tenant filters available
        let tenantFilters = angular.copy(TenantFilters.getTenantFilters(tenant)[0]);
        // query service for list of filter data
        FiltersService.getFilters().then(function(results){
          // if there is filter data add to chart config
          if(results.length) {
            model.filters = results;
            model.addFiltersToChartConfig(tenant, tenantFilters, results, config);
          }
        });
      }
    };

    model.addFiltersToChartConfig = function(tenant, tenantFilters, results, config){
       // populate options arrays
      tenantFilters.filters.forEach(function(filter){
        if(filter.fn instanceof Function) {
          filter.options = filter.fn(results);
        }
      });
      // add filter object to chart config
      config.filters = config.filters ? config.filters : {};
      config.filters.available = true;
      // add filter data to chart config
      config.filters.data = tenantFilters.filters.filter(function(filter){
       return tenantFilters.defaults.indexOf(filter.param) > -1;
      });
      // check for addtional filters
      if(config.filters.options) {
        config.filters.optional = tenantFilters.optional;
      }
    };



    model.uopxFilterModal = function(config, global){
        ngDialog.open({
            template: 'app/modules/d3-charts/filters/filters-modal.html',
            showClose: false,
            className: 'ngdialog-theme-default ch-filters-modal',
            resolve: {
              config: function(){
                return config;
              },
              allFilters: function(){
                return model.filters;
              },
              global: function(){
                return global;
              }
            },
            controller: ['$scope', 'config', 'allFilters', 'global', function($scope, config, allFilters, global){
              let model = this;
              let programInfo = allFilters.filter(function(f){
                return f.resource === 'programinfo';
              });

              model.config = config;

              model.checkAll = function($event){
                $event.stopPropagation();
                var currentTarget = $event.target.id;
                if ($event.target.checked){
                  config.filters.data.map(function(fltr){
                    if (fltr.param === currentTarget){
                      fltr.selected = angular.copy(fltr.options);
                    }
                  });
                } else {
                  config.filters.data.map(function(fltr){
                      if (fltr.param === currentTarget){
                      fltr.selected = [];
                    }
                  });
                }
              };

              model.clearAll = function($event){
                $event.preventDefault();
                $event.stopPropagation();
                config.filters.data.forEach(function(fltr){
                  fltr.titles = [];
                  fltr.selected = [];
                });
                if(config.filters.optional){
                  config.filters.optional.forEach(function(opts){
                    opts.selected = false;
                  });
                }

              };

              model.setOutput = function($event, filterparam, option){
                $event.stopPropagation();

                // filter for degrees and programs
                if(filterparam === 'programSchool') {
                  // get selected schools
                  let selected = config.filters.data[0].selected;
                  // check if we are filter out or reseting
                  if(selected.length){
                    let degrees  =  [];
                    selected.forEach(function(school){
                      let schoolDegrees = programInfo[0].data.filter(function(d){
                        return d.programSchool === school;
                      });
                      degrees = degrees.concat(schoolDegrees);
                    });
                     config.filters.data[1].options = _.without(_.uniq(_.pluck(_.flatten(degrees), 'programDegree')), null);
                     config.filters.data[2].options = _.without(_.uniq(_.pluck(_.flatten(degrees), 'program')), null);
                  } else {
                    // reset to all
                    config.filters.data[1].options = TenantFilters.uopxDegrees(allFilters);
                    config.filters.data[2].options = TenantFilters.uopxPrograms(allFilters);
                  }
                }
                // filter for schools and programs
                if(filterparam === 'programDegree') {
                  // get selected degrees
                  let selected = config.filters.data[1].selected;
                  if(selected.length) {
                    let programs = [];
                    selected.forEach(function(degree){
                      let degreePrograms = programInfo[0].data.filter(function(d){
                        return d.programDegree === degree;
                      });
                      programs = programs.concat(degreePrograms);
                    });
                    config.filters.data[2].options = _.without(_.uniq(_.pluck(_.flatten(programs), 'program')), null);
                  } else {
                    config.filters.data[2].options = TenantFilters.uopxPrograms(allFilters);
                  }
                }
              };

              model.updateFilters = function($event){
                $event.preventDefault();
                $event.stopPropagation();
                let selected = model.config.filters.data.map(function(filter){
                  return filter.selected.length;
                });
                if(model.config.filters.optional){
                  model.config.filters.optional.forEach(function(opt){
                    let count = opt.selected ? 1 : 0;
                    selected.push(count);
                  });
                }
                model.config.filterStatus = selected.reduce(function(previousValue, currentValue){
                  return previousValue + currentValue;
                });
                if(global){
                  $rootScope.$emit('global-filters', model.config);
                  //this will add the count to global filterStatus
                  $rootScope.$emit('update-global-filterStatus', model.config.filterStatus);
                } else {
                  model.config.update(model.config);
                }
                ngDialog.close();
              };

            }],
             controllerAs: 'ctrl'
          });
    };

  }

  ChartFilterService.$inject = ['$rootScope','FiltersService', 'TenantService', 'TenantFilters', 'ngDialog', 'lodash'];

  angular.module('d3Charts')
  .service('ChartFilterService', ChartFilterService);

})(window, window.angular);
