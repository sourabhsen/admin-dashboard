'use strict';

describe('Controller: ChartController', function(){
  var scope, ctrl, $document;

  beforeEach(function(){
    module('d3Charts');
  });

  beforeEach(inject(function($rootScope, $controller){
     scope = $rootScope.$new();
     ctrl = $controller('ChartController', {

     });
  }));

  afterEach(function(){

  });

  describe('containerWidth', function(){
    beforeEach(function(){
      $document = angular.element(document);
      $document.find('body').append('<div></div>').css('width', '100px').append('<div id="test"></div>');

    });
    it('should return width of parent element as an integer', function(){
      var conf = {
        id: 'test'
      };
      expect(ctrl.containerWidth(conf)).toEqual(100);
    });
  });

  describe('chartRatio', function(){
    it('should throw if 2 arguments are not passed', function(){
      expect(function(){ctrl.chartRatio();}).toThrow(new Error('Must pass arguments for both width and height as integers'));
    });
    it('should throw if width is not a number', function(){
      expect(function(){ctrl.chartRatio('968', 280);}).toThrow(new Error('Must pass arguments for both width and height as integers'));
    });
    it('should throw if height is not a number', function(){
      expect(function(){ctrl.chartRatio(968, '280');}).toThrow(new Error('Must pass arguments for both width and height as integers'));
    });
    it('should return a decimal number to the thousandth', function(){
      expect(ctrl.chartRatio(968, 280)).toEqual(3.457);
    });
  });

  describe('chartHeight', function(){
    it('should throw if ratio is not a Number', function(){
      expect(function(){ctrl.chartHeight('3.457', 968);}).toThrow(new Error('A Number is expected for both ratio and width'));
    });
    it('should throw if width is not a Number', function(){
      expect(function(){ctrl.chartHeight(3.457, '968');}).toThrow(new Error('A Number is expected for both ratio and width'));
    });
    it('should return height value for defined aspect and width', function(){
      expect(ctrl.chartHeight(3.457, 968)).toEqual(280);
    });
  });

  describe('defaultConfig', function(){
    it('should return configuration object', function(){
      expect(ctrl.defaultConfig()).toBeNonEmptyObject();
    });
    it('should define default values for margins', function(){
      var config = ctrl.defaultConfig();
      expect(config.margin.top).toBeDefined();
      expect(config.margin.right).toBeDefined();
      expect(config.margin.bottom).toBeDefined();
      expect(config.margin.left).toBeDefined();
    });
  });

  describe('init', function(){
    it('should initialize a config object', function() {
      ctrl.init();
      expect(ctrl.config).toBeDefined();
    });
    it('should add a ratio to config', function() {
      ctrl.init({});
      expect(ctrl.config.ratio).toEqual(1);
    });
  });

  describe('calculateDimensions', function(){

    beforeEach(function(){
      var $document;
      $document = angular.element(document);
      $document.find('body').append('<div></div>').css('width', '700px').append('<div id="test"></div>');
    });

    it('should update config values for width and height', function() {
      ctrl.init({});
      expect(ctrl.config.width).toEqual(500);
      expect(ctrl.config.height).toEqual(500);
      ctrl.config.id = 'test';
      ctrl.calculateDimensions(ctrl.config);
      expect(ctrl.config.width).toEqual(670);
    });
  });

  xdescribe('addListener', function(){
    it('should add observer to elements Array', function() {
      expect(ctrl.elements.length).toEqual(0);
      ctrl.addListener({});
      expect(ctrl.elements.length).toEqual(1);
    });
  });

  xdescribe('notify', function(){
    it('should call to message function', function() {
      var obj, message;
      obj = {
        fn : function(data) {}
      };
      message = {data: [1,2,3], config:{}};
      spyOn(obj, 'fn');
      ctrl.addListener(obj.fn);
      ctrl.notify(message);
      expect(obj.fn).toHaveBeenCalled();
    });
  });

});
