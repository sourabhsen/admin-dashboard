'use strict';

(function() {

  angular
    .module('navigation', [])
    .controller('Navigation', [
      '$scope',
      function($scope) {
        var ctrl = this;
        ctrl.navigation = [
          {
            title : 'Overview',
            appUrl: 'overview',
            style: 'overview-nav'
          },
          {
            title : 'Jobs',
            appUrl: 'jobs',
            style: 'jobs-nav'
          },
          {
            title : 'Resumes & Goals',
            appUrl: 'resumes-and-goals',
            style: 'resume-nav'

          },
          {
            title : 'Skills',
            appUrl: 'skills',
            style: 'skills-nav'
          }
        ];
        ctrl.sendStatus = function(status){
          $scope.$emit('nav:status', status);
        };
    }]);

})();
