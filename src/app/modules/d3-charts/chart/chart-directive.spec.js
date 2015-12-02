'use strict';

describe('Directive: d3Chart', function(){
  var $document, scope, compile;

  beforeEach(function(){
    module('d3Charts');
  });

  beforeEach(inject(function($rootScope, $compile){
    scope   = $rootScope;
    compile = $compile;
    scope.config  = {};
    scope.data    = [
      {x: 'a', y: 20},
      {x: 'b', y: 14},
      {x: 'c', y: 12},
      {x: 'd', y: 19},
      {x: 'e', y: 18},
      {x: 'f', y: 15},
      {x: 'g', y: 10},
      {x: 'h', y: 14}
    ];
    $document = angular.element(document);
    $document.find('body').append('<div style="width:1000px"><d3-chart id="chart" data="data" config="config"></d3-chart></div>');
    compile($document)(scope);
    scope.$digest();
  }));

  xdescribe('link', function(){
    it('should append svg element to the DOM', function() {
      var svg;
      svg = document.querySelector('svg');
      expect(svg).toBeDefined();
    });
    it('should set width and height of svg', function(){
      var svg;
      svg = document.querySelector('svg');
      expect(svg.getAttribute('width')).toEqual('1000');
      expect(svg.getAttribute('height')).toEqual('1000');
    });
    it('should append a group with a transform for top and left margins', function() {
      var svg, group;
      svg   = document.querySelector('svg');
      group = svg.querySelector('g');
      expect(group).toBeDefined();
      expect(group.getAttribute('transform')).toEqual('translate(20,20)');
    });
    it('should append X and Y axis groups', function() {
      var svg, x, y;
      svg = document.querySelector('svg');
      x   = svg.querySelector('.x');
      y   = svg.querySelector('.y');
      expect(x).toBeDefined();
      expect(y).toBeDefined();
    });
  });

});
