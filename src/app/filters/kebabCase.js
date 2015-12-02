'use strict';
(function(window, angular, undefined){
    function kebabCase(_){
      return function (value) {
        //using lodash as dependancy
        return _.kebabCase(value);
      };
    }

    kebabCase.$inject = ['lodash'];

    angular.module('admin-dashboard')
      .filter('kebabcase', kebabCase);

})(window, window.angular);
