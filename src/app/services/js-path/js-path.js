'use strict';

angular.module('js-path', [])
/**
 * Simple factory to return JSPath
 */
.factory('JSPath', ['$window',
  function($window) {
    return $window.JSPath;
  }
]);
