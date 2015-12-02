'use strict';
d3.chart('HorizontalBar').extend('HorizontalBarModal', {
  initialize: function(config){
    let chart = this;
    chart.rectHeight = 30;

    function barsEnter() {
      this.attr('transform', function(d, i) { return 'translate('+(chart.offsetLeft + 5 )+',' + i * (chart.rectHeight + 2) + ')'; })
            .attr('width', function(d){return (chart.x(d.y) );})
            .attr('height', chart.rectHeight)
            .attr('class', config.graph.classname)
            .attr('opacity', 1);
    }

    function barsEnterTransition() {
      this.duration(100)
          .attr('width', function(d){return (chart.x(d.y) );})
          .attr('opacity', 1);
    }

    function barsUpdateTransition() {
      this.duration(100)
          .attr('width', function(d){return (chart.x(d.y) );})
          .attr('opacity', 1);
    }

    function barsExit() {
      return;
    }

    this.layer('bars').on('enter', barsEnter);
    this.layer('bars').on('enter:transition', barsEnterTransition);
    this.layer('bars').on('update:transition', barsUpdateTransition);
    this.layer('bars').on('exit', barsExit);

    function innerLabelsEnter() {
      this.attr('transform', function(d,i) { return 'translate('+chart.offsetLeft+',' + i * (chart.rectHeight + 2) + ')'; })
            .attr('x', function(d) { return  chart.positionInnerLabel(d); })
            .attr('y', chart.rectHeight/2)
            .attr('fill', function(d){ return d.color; })
            .attr('dy', '.35em')
            .attr('opacity', 1)
            .text(function(d) { return d.y; });
    }

    this.layer('innerLabels').on('enter', innerLabelsEnter);

    function outerLabelsEnter() {
     this.attr('transform', function(d,i) { return 'translate('+chart.offsetLeft+',' + i * (chart.rectHeight + 2) + ')'; })
            .attr('x', -3)
            .attr('y', chart.rectHeight/2)
            .attr('dy', '.35em')
            .attr('text-anchor', 'end')
            .attr('opacity', 1)
            .text(function(d) { return d.x; });
    }


    this.layer('outerLabels').on('enter', outerLabelsEnter);
  }
});
