'use strict';

angular.module('apollo-authentication', ['ngLodash', 'js-path', 'apollo-tenant'])

.factory('Auth', ['$http', '$cookies', 'lodash', 'JSPath', 'TenantService',
  function ($http, $cookies, _, JSPath, TenantService) {

    // transform roles to array of roles by app name, e.g.
    //
    function transformRoles(data) {
      var dataObj = angular.fromJson(data) || {},
        appRoles = {};
      _.forEach(dataObj.roles || [], function (val) {
          var apps = JSPath.apply('.resources.appName', val),
              roleName = val.roleName;
        _.forEach(apps, function (app) {
          if (appRoles[app]) {
            appRoles[app].push(roleName);
          } else {
            appRoles[app] = [roleName];
          }
        });
      });
      // remove dupe app names
      appRoles = _.mapValues(appRoles, _.uniq);
      return appRoles;
    }

    return {
      'get': function () {
        return $http.get('/api/authentication-service/2/' + TenantService.getTenant().value + '/user/info');
      },
      'login': function (data) {
        return $http.post('/api/authentication-service/2/' + TenantService.getTenant().value + '/user/login', data);
      },
      'logout': function () {
        return $http.get('/api/authentication-service/2/' + TenantService.getTenant().value + '/user/logout');
      },

      'roles': function (config) {
        var cfg = angular.extend({
          transformResponse: transformRoles
        }, config);
        return $http.get('/api/authorization-service/2/' + 'apti' + '/userinfo', cfg);
      },
      'hasCookies': function () {
        return $cookies.INFO && $cookies.TOKEN ? true : false;
      }
    };
  }
]);
