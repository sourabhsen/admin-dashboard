'use strict';
(function(window, angular, undefined){
  /**
   * @ngdoc service
   * @name  ChartDownloadService
   * @description
   * Provide functionality for the ChartDownloadController and d3ChartDownload directive
   */
  function ChartDownloadService(_){
    var model;

    model = this;

    /**
     * Returns a default object for download popover configuration
     * @return {Object} default settings for popover
     */
    model.defaultConfig = function(){
      let config    = {
        width : 400,
        height: 400
      };
      return config;
    };

    /**
     * Default menu items and actions
     * @type {Object}
     */
    model.defaultMenu = function(){
      let menu = {
        pdf:{
          name:'PDF',
          value:'PDF',
          action: '#'
        },
        csv:{
          name:'CSV',
          value:'CSV',
          action:'exportCSV'
        }
      };
      return menu;
    };
    /**
     * Default menu items and actions
     * @type {Object}
     */
    model.exportCSV = function(data, title, showLabel, chartType){
      var REPORT,
            type,
            filename,
            uri,
            link;

        REPORT = '';
        REPORT += title + '\r\n\n';
        type = 'csv';
        data = angular.copy(data); //removed the $$hashKey properties

        if(chartType === 'd3-multi-donut'){
          let csvContent = '';
          data.map(function(d){
            csvContent += parseData(d, showLabel);
          });
          REPORT += csvContent;
        }else{
          REPORT += parseData(data, showLabel);
        }

        if(REPORT === ''){ return; }  //trigger an error here

        //helper function to generate csv content
        function parseData(dataSrc, rowLabel){
          let csvContent = '';
          if(rowLabel) {
            let row = '';
            // create labels from object keys
            _.keys(dataSrc[0]).forEach(function(key){
              row += key + ',';
            });
            // remove last comma
            row = row.slice(0, -1);
            //append label row with line break
            csvContent += row + '\r\n';
          }

          data.forEach(function(d, i){
            let row = '';
            _.keys(dataSrc[i]).forEach(function(key){
              row += '"' + dataSrc[i][key] + '",';
            });
            row = row.slice(0, -1);
            csvContent += row + '\r\n';
          });

          return csvContent;
        }


        // remove the blank-spaces from the title and replace it with an underscore
        filename = title.replace(/ /g,'_');

        uri = 'data:text/' + type + ';charset=utf-8,' + window.escape(REPORT);

        link = document.createElement('a');
        link.href = uri;

        link.style = 'visibility:hidden';
        link.download = filename + '.' + type;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

  }

  ChartDownloadService.$inject = ['lodash'];

  angular.module('d3Charts')
  .service('ChartDownloadService', ChartDownloadService);

})(window, window.angular);
