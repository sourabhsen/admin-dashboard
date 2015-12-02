'use strict';

angular.module('apollo-user', [
  'apollo-authentication',
  'apollo-profile'])

.service('User', [
  '$q',
  'Auth',
  'Profile',
  '$timeout',
  function ($q, Auth, Profile, $timeout) {
    var user = this;

    user.$reset = function() {
      user.auth= user.roles = user.profile= user.profileId = user.$promise= user.targetState= user.$promise= undefined;
    };

    user.reload = function(authOnly) {
        user.$reset();
        return user.get()
          .then(function() {
             //console.log('user reload');
          });
    };

    // retrieve authentication, profile, and session information for the user
    user.get = function() {
      // if active promise, return that to prevent multiple requests
      if (user.$promise) {
        return user.$promise;
      }

      var deferred = $q.defer();
      //if (user.isAuthenticated() && user.profile) {
      if (user.isAuthenticated()) {
        deferred.resolve(user);
      } else {
        Auth.get().then(function (auth) {
            user.auth = auth.data;

            if (user.auth && user.auth.loginStatus === 'LOGGEDIN') {
              user.profileId = user.auth.profileId;
              deferred.resolve(user);
              // Profile.getPublic({
              //   profileId: user.profileId
              // }, function (profile){
              //   user.profile = profile;
              //   deferred.resolve(user);
              // },  function (error) {
              //   if (error && error.status === 403) {
              //   deferred.resolve(user);
              //   }
              // });
          } else {
              // not authenticated
              deferred.resolve(user);
            }
          },
          function (error) {
            if (error && error.status === 401) {
              deferred.resolve(user);
            } else {
              deferred.reject(angular.extend(error, {
                errorMsg: 'Error retrieving auth info'
              }));
            }
          });
      }

      user.$promise = deferred.promise;
      return user.$promise;
    };

    user.getRoles = function() {
      if (user.roles) {
        return $q.when(user.roles);
      }
      return user.get().then(function() {
        return Auth.roles().then(function(http) {
          user.roles = http.data;
          return user.roles;
        });
      });
    };


    user.hasRole = function(app, role) {
      var appRoles = user.roles && user.roles[app] ? user.roles[app] : [];
      return appRoles.indexOf(role) > -1;
    };

    // checks whether user is authenticated
    user.isAuthenticated = function () {
      return user.auth && user.auth.authenticated && user.auth.loginStatus === 'LOGGEDIN' ? true : false;
    };

    // logout function - calls auth to logout and clears user upon success
    user.logout = function () {
      var deferred = $q.defer();
     // if (user.isAuthenticated()) {
        Auth.logout().then(function (http) {
          user.$reset();
          deferred.resolve(http);
        }, function (http) {
          deferred.reject(http);
        });
      // } else {
      //   deferred.reject('not authenticated');
      // }
      return deferred.promise;
    };

    // on startup, reset to defaults
    user.$reset();
  }
]);
