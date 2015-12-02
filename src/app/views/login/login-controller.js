'use strict';

(function(window, angular, undefined){
function LoginController($rootScope, $scope, $state, $window, $location, Auth, User, TenantService, $timeout, $parse){
  //var ctrl = this;

  $scope.formValues = {};
  $scope.logout = false;
  $scope.redirecting = false;
  $scope.passwordUpdated = false;
  $scope.listTenants = TenantService.tenantList();

  $rootScope.state = $state.current.name;

  //   function ($scope, $state, $window, $location, CONSTANTS, Auth, User, $injector, $timeout, localStorageService, $log, $rootScope, $parse) {

  $scope.loginNative = function () {
    $scope.logout = false;
    $scope.$broadcast('show-errors-check-validity');

    if ($scope.loginForm.$valid) {
      TenantService.setTenant($scope.selectedTenant);

      Auth.login($scope.formValues).then(
        function (http) {
          if (http && http.data && http.data.authenticated && http.data.loginStatus === 'LOGGEDIN') {
            User.reload().then( $scope.redirect());
          } else {
            $scope.errorAuth = true;
          }
        },
        function () {
          $scope.server = true;
        }
      );
    }
  };

  $scope.changeState = function (params) {
    $state.go(params);
  };

  $scope.login = function (provider) {
    // store toUrl in local storage for later redirect after login (in app.js)
    // if ($state.params.to) {
    //   localStorageService.set('social-to-url', $state.params.to.replace(/^\#/, ''));
    // }

    // redirect to the url based on the provider
    // $window.location.href = CONSTANTS[provider];
  };

  $scope.redirect = function () {
    // set completion-redirect-ready token so that redirection to completion only happens once
    if ($state.params.to) {
      var newUrl = $state.params.to.replace(/^\#/, '');
      $location.url(newUrl);
    } else {
      console.log('call state go');
      $state.go('overview');
    }
  };

    // wait for 2 seconds and redirect
    $scope.showMsgAndRedirect = function () {
      $scope.redirecting = true;
      $timeout(function () {
        $scope.redirect();
      }, 2000);
    };

  $scope.init = function () {
 // set to parameter so redirect works
      if (User.targetState) {
        var stateUrl = $state.href(User.targetState, User.targetStateParams);
        $location.search('to', stateUrl);
      }

      if ($parse('current.data.logout')($state) && $scope.logout !== true) {
        User.logout().then(function () {
          $scope.logout = true;
        });
      }
      // if already logged in, redirect
      else if (User.isAuthenticated()) {
        $scope.showMsgAndRedirect();
      }
      // if auth cookies defined, check if already authenticated
      else if (Auth.hasCookies()) {
        User.get().then(function (myUser) {
          if (myUser.isAuthenticated()) {
            $scope.showMsgAndRedirect();
          }
        });
      }
  };

  // on start
  $scope.init();

  }

  LoginController.$inject = ['$rootScope', '$scope', '$state', '$window', '$location','Auth', 'User', 'TenantService', '$timeout',  '$parse'];

  angular.module('admin-dashboard')
  .controller('LoginController', LoginController);

})(window, window.angular);


