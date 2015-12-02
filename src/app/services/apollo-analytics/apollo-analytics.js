'use strict';
(function(window, angular, undefined){
  angular.module('apollo-analytics', [
    'restangular',
    'ngLodash',
    'apollo-tenant'
  ])
  .config(['RestangularProvider',
    function(RestangularProvider){
      RestangularProvider.setBaseUrl('/api/analytics-service/1/');
//      RestangularProvider.setDefaultHeaders({'Authorization' : 'Basic YXB0X2FjY2VwdGFuY2VfYWNjb3VudDphcHRfYWNjZXB0YW5jZV9hY2NvdW50'});
      RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response, deferred){
        if(response.config.params.pageNumber === 0) { // check that we are not doing a view all, might be able to use once we get length of ALL
          if(data && data.length === 0){
            response.data = {
              message: '<h3>No data available</h3><p>Please try a different date range or filter.</p>'
            };
          }
        }
        deferred.resolve(response);
      });
      RestangularProvider.setErrorInterceptor(function(response, deferred, responseHandler){
        if(response.status.toString().match(/^[4-5]/)){
          response.data = {
            message: '<h3>'+response.data.status+'</h3><p>'+response.data.message+'</p>'
          };
        }
        deferred.resolve(response);
      });
    }
  ]);
})(window, window.angular);




