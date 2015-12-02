'use strict';

(function(window, angular, undefined) {

  angular.module('admin-dashboard', [
    'apollo-authentication',
    'apollo-analytics',
    'apollo-tenant',
    'apollo-user',
    'apollo-profile',
    'apollo-permissions',
    'primaryMetrics',
    'navigation',
    'd3Charts',
    'ngLodash',
    'ui.bootstrap',
    'ui.router',
    'ui.validate',
    'ngSanitize',
    'ngResource',
    'ngCookies',
    'cgBusy',
    'ngDialog',
    'ngAria'
  ])
  .config([ '$stateProvider','$urlRouterProvider', '$locationProvider',
    function($stateProvider, $urlRouterProvider, $locationProvider){

      // For any unmatched url, redirect to /overview
      $urlRouterProvider.otherwise('/overview');

      $stateProvider

        // .state('auth', {
        //   abstract: true,
        //   // Does not improve much on UX because of the way the views loaded. We set blue background
        //   // on the body which is loaded in the outer most template and the application view are loaded
        //   // 2/3 levels deep.
        //   template: '<ui-view />',
        //   resolve: {
        //     permissions: ['grant',
        //       function(grant) {
        //         return grant.only({test: 'auth', state: 'login'});
        //       }
        //     ],
        //     User: ['User', '$rootScope',
        //       function (User, $rootScope) {
        //         var userPromise = User.get();
        //         $rootScope.userPromise = userPromise;
        //         userPromise.then(function() {
        //           $rootScope.userPromise = null;
        //         });
        //         return userPromise;
        //       }
        //     ]
        //   }
        // })
        .state('overview', {
          url   : '/overview',
          views : {
            'main' : {
              templateUrl  : 'app/views/overview/overview.html',
            },
            'navigation' : {
              templateUrl  : 'app/modules/navigation/floating.html',
            }
          },
          resolve: {
            permissions: ['grant',
              function(grant) {
                return grant.only({test: 'auth', state: 'login'});
              }
            ]
          }
        })
        .state('jobs', {
          url   : '/jobs',
          views : {
            'main' : {
              templateUrl  : 'app/views/jobs/jobs.html',
            },
            'navigation' : {
              templateUrl  : 'app/modules/navigation/floating.html',
            }
          },
          resolve: {
            permissions: ['grant',
              function(grant) {
                return grant.only({test: 'auth', state: 'login'});
              }
            ]
          }
        })
        .state('resumes-and-goals', {
          url   : '/resumes-and-goals',
          views : {
            'main' : {
              templateUrl  : 'app/views/resumes-and-goals/resumes-and-goals.html',
            },
            'navigation' : {
              templateUrl  : 'app/modules/navigation/floating.html',
            }
          },
          resolve: {
            permissions: ['grant',
              function(grant) {
                return grant.only({test: 'auth', state: 'login'});
              }
            ]
          }
        })
        .state('skills', {
          url   : '/skills',
          views : {
            'main' : {
              templateUrl  : 'app/views/skills/skills.html',
            },
            'navigation' : {
              templateUrl  : 'app/modules/navigation/floating.html',
            }
          },
          resolve: {
            permissions: ['grant',
              function(grant) {
                return grant.only({test: 'auth', state: 'login'});
              }
            ]
          }
        })
        .state('login', {
          url: '/login',
          views : {
            'main' : { templateUrl: 'app/views/login/login.html'}
          }
        })
        .state('logout', {
          url: '/logout',
          views : {
            'main' : { templateUrl: 'app/views/login/login.html'}
          },
          data: {
            logout: true
          }
        })
        .state('styles', {
          url: '/style-guide',
          views : {
            'main' : {
              templateUrl : 'app/views/style-guide/style-guide.html'
            }
          }
        });
    }
  ])
  .controller('AppController', [
    '$scope',
    function($scope) {
      let model = this;
      model.status = 'nav-collapse';

      $scope.$on('nav:status', function(evt, val){
        model.status = val;
      });
      // $scope.status = 'cont-collapse';

      // $scope.setStatus = function (newValue){
      //   $scope.status = newValue;
      // };

      // $scope.getStatus = function (){
      //   return $scope.status;
      // };
    }
  ])
  .value('cgBusyDefaults', {
    templateUrl: 'app/components/cg-busy/cg-busy-template.html',
    backdrop: false,
    minDuration: 250
  })
  .run(['Permissions', '$rootScope', '$location', '$log', '$timeout', '$injector', 'GRANT_ERROR',
  function (Permissions, $rootScope, $location, $log, $timeout, $injector, GRANT_ERROR) {
    var User;

    // define all roles for permission checks on routes
    Permissions.setupPermissions();

    // store location in rootScope
    $rootScope.location = $location;

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
      // if new state starts with auth, store the targetState for auth purposes
      if (toState.name.lastIndexOf('auth', 0) === 0) {
        User = User || $injector.get('User');
        User.targetState = toState.name;
        User.targetStateParams = toParams;
      }

    });

    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams) {
      console.log('change state success');
    });


    // Catch any state change errors (which includes rejections of resolves on states)
    $rootScope.$on('$stateChangeError', function ($event, toState, toParams, fromState, fromParams, error) {
      // skip grant rejections
      if (!(error && error.type !== GRANT_ERROR)) {
        $log.debug('Permissions check failed on state', toState.name, ', test', error.test);
        $rootScope.server = false;
        $rootScope.errorPermission = true;
        return;
      }

      event.preventDefault();
      var $state = $injector.get('$state'),
        ErrorParser = $injector.get('ErrorParser'),
        errorMsg = ErrorParser.parseError(error),
        stateUrl = $state.href(toState, toParams);

      return $state.go('error', {
        errorMsg: errorMsg,
        to: stateUrl
      });
    });

  }
]);


})(window, window.angular);
