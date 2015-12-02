'use strict';
(function(window, angular, undefined){

  function ChartController($log){
    var model;
    model         = this;
    model.inits   = [];
    model.axes    = [];
    model.updates = [];
     /**
     * Returns a default object for chart configuration
     * @return {Object} default settings for D3 chart
     */
    model.defaultConfig = function(){
      var config    = {};
      config.margin = {
            top    : 0,
            right  : 15,
            bottom : 5,
            left   : 15
      };
      config.width  = 500;
      config.height = 500;
      return config;
    };
    /**
     * Calculates number value for width to height ratio of
     * a chart and rounded to the thousandth decimal place
     * @param  {Integer} width  Width of chart
     * @param  {Integer} height Height of chart
     * @return {Integer}        Integer rounded to the thousandths
     */
    model.chartRatio = function(width, height){
      if(!width || !height || typeof width !== 'number' || typeof height !== 'number') {
        throw new Error('Must pass arguments for both width and height as integers');
      }
      return Math.round((width/height) * 1000)/1000;
    };
  /**
    * fn to retrieve width of containerWidth
    * @param  {DOM Selector} elem CSS selector
    */
    model.containerWidth = function(conf){
      var container = document.querySelector('#'+conf.id).parentNode;
      return container.offsetWidth;
    };
    /**
     * Calculate the height value for a specified ratio and width
     * @param  {Integer} ratio width/height ratio value round to the thousandths
     * @param  {Integer} width Width of chart
     * @return {Integer}       Return integer value for pixel height rounded to whole number
     *                         i.e. 968/3.457 = 280
     */
    model.chartHeight = function(ratio, width) {
      if(typeof ratio !== 'number' || typeof width !== 'number'){
        throw new Error('A Number is expected for both ratio and width');
      }
      return Math.round(width/ratio);
    };
    /**
     * Initialize chart component
     * @param  {Object} conf Config object
     */
    model.init = function(conf){
      model.config       = angular.extend(model.defaultConfig(), conf || {});
      model.config.ratio = model.chartRatio(model.config.width, model.config.height);
    };
    /**
     * Determine width and height values
     * @param  {Object} conf Config object
     */
    model.calculateDimensions = function(conf){
      var containerWidth;
      containerWidth       = model.containerWidth(conf);
      model.config.width   = containerWidth - conf.margin.left - conf.margin.right;
      model.config.height  = model.chartHeight(model.config.ratio, containerWidth) - conf.margin.top - conf.margin.bottom;
    };
    /**
     * Adds function to set inits on graph
     * @param {function} observer callback function
     */
    model.addInitListener = function(observer){
      model.inits.push(observer);
    };
    /**
     * Add function to update graph when data changes
     * @param {function} observer callback for updating graph
     */
    model.addUpdateListener = function(observer){
      model.updates.push(observer);
    };
    /**
     * Execute transcluded chart directive update functions
     * @param  {Object} message Data and config objects to be used by transcluded chart directive update functions
     */
    model.notify = function(handler, message){
      for (var i = model[handler].length - 1; i >= 0; i--) {
        model[handler][i](message);
      }
    };

    // $log.debug('ChartController', this);
  }

  ChartController.$inject = ['$log'];

  angular.module('d3Charts')
  .controller('ChartController', ChartController);

})(window, window.angular);
