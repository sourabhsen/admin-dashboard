'use strict';
(function(window, angular, undefined){
	function metric(){
		return{
			require : '^d3Chart',
			templateUrl:'app/modules/primary-metrics/primary-metrics-template.html',
			link  : function(scope, elem, attr, ctrl){
        //An alias to isNumber method to be used in directive template
        scope.isNumber = angular.isNumber;
        scope.countFlag = false;
        scope.trendFlag = false;
        scope.uniqueFlag = false;

        function update(config){
         scope.metrics = config.data;
         scope.countFlag = scope.metrics.some(function(item){
            return item.count > 9999;
         });

         scope.trendFlag = scope.metrics.some(function(item){
            return item.change > 999;
         });

         scope.uniqueFlag = scope.metrics.some(function(item){
            return item.uniqueCount > 9999;
         });

       }

        ctrl.addUpdateListener(update.bind(this));
      }
    };
  }

  metric.$inject = [];

  angular.module('d3Charts')
  .directive('primaryMetric', metric);

})(window, window.angular);
