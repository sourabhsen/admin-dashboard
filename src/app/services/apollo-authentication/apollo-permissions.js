'use strict';

angular.module('apollo-permissions', [
    // 'permission',
    'ui.router.grant',
    'apollo-authentication'
  ])
  /**
   * @ngdoc factory
   * @name Permissions
   * @function
   * @requires grant
   *
   * @description
   * Setup permissions used by Admin Dashboard app.  Leverages ui.router.grant and adds test that
   * are used to lock down routes.
   *
   */
  .factory('Permissions', [
    'grant',
    'User',
    'Auth',
    '$injector',
    '$q',
    function (grant, User, Auth, $injector, $q) {


      return {
        setupPermissions: function () {

          // admin user - check roles
          grant.addTest('auth', function () {
            return User.getRoles().then(function () {
              if (!User.hasRole('analytics-service', 'analytics-dashboard-user')) {
                return $q.reject();
              }
            });
          });

        }
      };
    }
  ]);
