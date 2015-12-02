'use strict';
(function(window, angular, undefined){
  /**
   * @ngdoc service
   * @name  ChartInfoService
   * @description
   * Provide functionality for the ChartInfoController and d3ChartInfo directive
   */
  function ChartInfoService(){
    var model;

    model = this;

  }

  ChartInfoService.$inject = [];

  angular.module('d3Charts')
  .service('ChartInfoService', ChartInfoService);

})(window, window.angular);
