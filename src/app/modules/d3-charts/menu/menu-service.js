'use strict';
(function(window, angular, undefined){
  /**
   * @ngdoc service
   * @name  ChartMenuService
   * @description
   * Provide functionality for the ChartMenuController and d3ChartMenu directive
   */
  function ChartMenuService(){
    var model;
    model = this;
    /**
     * Default menu items and actions
     * @type {Array}
     */
    model.defaultMenu = function(){
      var menu = {
        date: {
          title: 'Date range...',
          action: '#'
        },
        sort : {
          title: 'Sort by',
          action: '#',
          menu: {
            name: {
              title: 'Name',
              action: '#'
            },
            date: {
              title: 'Date',
              action: '#'
            }
          }
        },
        filter: {
          title: 'Filter...',
          action: '#'
        },
        downloadCSV: {
          title: 'Download CSV',
          action: '#'
        },
        downloadPDF: {
          title: 'Download PDF',
          action: '#'
        },
        view: {
          title: 'View all data',
          action: '#'
        },
        about: {
          title: 'About this chart',
          action: '#'
        }
      };
      return menu;
    };


  }

  ChartMenuService.$inject = [];

  angular.module('d3Charts')
  .service('ChartMenuService', ChartMenuService);

})(window, window.angular);
