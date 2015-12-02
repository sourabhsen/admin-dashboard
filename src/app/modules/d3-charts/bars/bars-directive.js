'use strict';
(function(window, angular, undefined){

  function bars(d3, ChartTransitions){
    return {
      require : '^d3Chart',
      link    : function(scope, elem, attr, ctrl){
        /**
         * Transitions
         */
        var key,
            transition,
            exit,
            enter;

        key = attr.configKey || undefined;
        transition = function(config){
          this.duration(1000)
            .attr('opacity', 1)
            .attr('x', function(d){return config.x(d.x);})
            .attr('width', config.x.rangeBand())
            .attr('y', function(d){return config.y(d.y);})
            .attr('height', function(d){return config.height - config.y(d.y);});
        };
        exit = function(){
          this.duration(1000).attr('opacity', 0).remove();
        };
        enter = function(){
          this.duration(1000).attr('opacity', 0);
        };
        /**
         * Run on any data updates
         * @param  {object} config chart config
         */
        function update(config){
          var bars,
              entered,
              transitions;
          bars    = config
                    .svg
                    .selectAll('.bar')
                    .data(config.data);
          entered = bars
                    .enter()
                    .append('rect')
                    .attr('class', 'bar')
                    .attr('opacity', 0);
          transitions              = {};
          transitions.onEnter      = (config[key] && config[key].onEnter) ? config[key].onEnter :  enter;
          transitions.onTransition = (config[key] && config[key].onTransition) ? config[key].onTransition : transition;
          transitions.onExit       = (config[key] && config[key].onExit) ? config[key].onExit : exit;
          ChartTransitions.transition(entered, bars, transitions, config);
        }
        /**
         * Initialize chart
         * @param  {object} config chart config
         */
        function init(config){
         config.x     = d3.scale
                        .ordinal()
                        .rangeRoundBands([0, config.width], 0.05);
         config.y     = d3.scale
                          .linear()
                          .range([config.height, 0]);
         config.axisX = config.svg
                          .append('g')
                          .attr('class', 'x axis')
                          .attr('transform', 'translate(0,'+ config.height +')');
         config.axisY = config.svg
                          .append('g')
                          .attr('class', 'y axis');
         config.xAxis = d3.svg
                          .axis()
                          .scale(config.x)
                          .orient('bottom');
         config.yAxis = d3.svg
                          .axis()
                          .scale(config.y)
                          .orient('left');
          config.x.domain(config.data.map(function(d){ return d.x; }));
          config.y.domain([0, d3.max(config.data, function(d){ return d.y; })]);
        }

        ctrl.addInitListener(init.bind(this));
        ctrl.addUpdateListener(update.bind(this));
      }
    };
  }

  bars.$inject = ['d3','ChartTransitions'];

  angular.module('d3Charts')
  .directive('d3Bars', bars);

})(window, window.angular);
