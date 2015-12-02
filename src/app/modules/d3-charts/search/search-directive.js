'use strict';
(function(window, angular, undefined){
  function search(SearchService, $http){
    return {
      require     : '^d3Chart',
      replace     : true,
      transclude  : true,
      scope       : true,
      templateUrl : 'app/modules/d3-charts/search/search-template.html',
      link  : function(scope, elem, attr, ctrl){
        scope.search = ctrl.config.search;
        scope.searchQuery = null;
        scope.search.filter = {};

        //get the data
        scope.getResults = function(val){
          let autoCompleteData = null;
          switch(scope.search.key){
            case 'jobTitle':
              autoCompleteData = SearchService.getJobs(val);
              break;
            case 'companyName':
              autoCompleteData = SearchService.getJobs(val);
              break;
            case 'location':
              autoCompleteData = SearchService.getLocations(val);
              break;
            case 'goal':
              autoCompleteData = SearchService.getGoals(val);
              break;
            case 'skillName':
              autoCompleteData = SearchService.getSkills(val);
              break;
          }
          return autoCompleteData;
        };

        //set on selection
        scope.onSelect = function(model) {
          scope.search.filter[scope.search.key] = model;
          SearchService.uopxSearchModal(ctrl.config, model);
        };

        //onclick of search icon
        scope.searchfilter = function(){
          if(scope.searchQuery === null || scope.searchQuery === '') {
            return;
          }
          scope.search.filter[scope.search.key] = scope.searchQuery;
          SearchService.uopxSearchModal(ctrl.config, scope.searchQuery);
        };

        scope.searchKey = ctrl.config.search;
      }

    };
  }

  search.$inject = ['SearchService', '$http'];

  angular.module('d3Charts')
  .directive('d3ChartSearch', search);

})(window, window.angular);
