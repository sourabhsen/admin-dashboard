'use strict';
(function(window, angular, undefined){
  function globalFilters(){
    return {
      restrict: 'E',
      templateUrl: 'app/components/global-filters/global-filters-template.html',
      link: function(scope, elem, attr){

      }
    };
  }

  globalFilters.$inject = [];

  angular.module('admin-dashboard')
  .directive('globalFilters', globalFilters);
})(window, window.angular);
