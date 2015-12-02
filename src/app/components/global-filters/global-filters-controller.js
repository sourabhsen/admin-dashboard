'use strict';
(function(window, angular, undefined){
  function GlobalFiltersController ($rootScope, ChartDateService, TenantService, ChartFilterService){
    let model = this;
    // this will later be moved to a rootScope variable
    model.tenants = TenantService.tenantList();
    model.tenant  = TenantService.getTenant();

    model.timeframes = [
      {name: 'Last full Week', value: 'lastWeek' },
      {name: 'Last Full Month', value: 'lastMonth'},
      {name: 'Last Quarter', value: 'lastQuarter'},
      {name: 'Custom', value: 'custom'}
    ];

    model.timeframe = model.timeframes[1];

    model.triggerEvent = function(eventname, msg){
      if(msg.value !== 'custom'){
        $rootScope.$emit(eventname, msg);
      }else{
        let dateConfig = {};
        dateConfig.range = ChartDateService.initializeDate(dateConfig);
        ChartDateService.customDateRange(true, dateConfig);
      }

    };

    let filterConfig = {};
    ChartFilterService.initFilters(filterConfig);
    model.filterStatus = 'None';
    model.openFilterModal = function($event){
      $event.preventDefault();
      $event.stopPropagation();
      ChartFilterService.uopxFilterModal(filterConfig,  true);
    };

    $rootScope.$on('tenant-change', function($event, msg){
      model.tenant = msg;
    });

    $rootScope.$on('update-global-filterStatus', function($event, msg){
      model.filterStatus = msg;
    });
  }

  GlobalFiltersController.$inject = ['$rootScope', 'ChartDateService', 'TenantService', 'ChartFilterService'];

  angular.module('admin-dashboard')
  .controller('GlobalFiltersController', GlobalFiltersController);
})(window, window.angular);
