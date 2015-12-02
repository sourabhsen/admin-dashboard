'use strict';
(function(window, angular, undefined){
  function d3FiveColDonut(d3, $timeout, $compile, _){
    return {
      require : '^d3Chart',
      templateUrl: 'app/modules/d3-charts/miso/extends/five-col-donut/five-col-donut-template.html',
      link    : function(scope, elem, attr, ctrl){
        elem.addClass('d3-five-col-donut');

        let ratio =  Math.round((1/1.5) * 1000)/1000;

        function width  (conf){
          let container = document.querySelector('#'+ conf.id).parentNode;
          conf.width = container.offsetWidth - conf.margin.left - conf.margin.right;
        }

        function height(conf){
          conf.height = Math.round(conf.width/ratio);
        }

        scope.charts = ctrl.config.charts.map(function(chart, i){
          let config = angular.extend({}, ctrl.config, {
              margin: {
              top    : 0,
              right  : 0,
              bottom : 0,
              left   : 5
            },
            id: 'donut-' + i,
            graph: {
              countKey: 'count',
              groupKey: i === 4 ? 'status' : 'answer',
              scaleColor: chart.scaleColor,
              textColor: chart.textColor
            },
            title: chart.title
          });

          if(chart.click) {
            config.click = chart.click;
          }

          return config;
        });

        function init(){
          scope.charts.map(function(chart, i){
            width(chart);
            height(chart);
            let svg = d3.select('#donut-'+i).append('svg')
              .attr('width', chart.width)
              .attr('height', chart.height);
            chart.svg = svg.chart('FiveColDonut', chart);
          });
        }

        function update(config){

          scope.charts.map(function(chart, i){
            elem.find('#donut-'+i+' svg').show();
            elem.find('#donut-'+i+' .d3-chart-message').remove();
            let counts = _.chain(ctrl.config.data[i])
              .map(function(d){
                return d.count;
              })
              .reduce(function(p, c){
                return p +c;
              })
              .value();
            if(counts > 0){
              if(i === 0) {
                ctrl.config.data[i].map(function(d){
                  let temp = d.answer.split('-') ;
                  d.answer = temp[0];
                  return d;
               });
              }
              if(i === 1) {
                ctrl.config.data[i].sort(function(a, b){
                  let order = a.answer < b.answer ? -1 : 1;
                  return order;
                });
              }
              chart.data = ctrl.config.data[i];
              chart.svg.draw(chart.data);
            } else {
              let message = $compile('<div class="d3-chart-message" style="width:'+ctrl.config.width/5+'px; height:'+ctrl.config.height+'px;"> <div class="message-holder"><div class="message"><h3>No data available</h3><p>Please try a <br>different date range or filter.</p></div> </div> </div> ')(scope);
              elem.find('#donut-'+i+' svg').hide();
              elem.find('#donut-'+i).append(message);
            }
          });
        }

       $timeout(function(){
         init();
       });

        ctrl.addUpdateListener(update.bind(this));
      }
    };
  }

  d3FiveColDonut.$inject = ['d3', '$timeout', '$compile', 'lodash'];

  angular.module('d3Charts')
  .directive('d3FiveColDonut', d3FiveColDonut);
})(window, window.angular);
