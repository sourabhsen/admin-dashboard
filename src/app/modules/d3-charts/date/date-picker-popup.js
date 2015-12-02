'use strict';
(function(window, angular, undefined){
  /**
   * This is a fix for issue with angular ui.bootstrap date format on
   * datepicker-popup options for viewValue
   * http://stackoverflow.com/questions/24198669/angular-bootsrap-datepicker-date-format-does-not-format-ng-model-value#answer-28202178
   */
  function datepicker(dateFilter) {
    return {
      restrict: 'EAC',
      require: '?ngModel',
      link: function(scope, element, attr, ngModel) {
        ngModel.$parsers.push(function(viewValue){
          return dateFilter(viewValue,'MM/dd/yyyy');
        });
      }
    };
  }

  datepicker.$inject = ['dateFilter'];

  angular.module('d3Charts')
  .directive('datepicker', datepicker);
})(window, window.angular);
