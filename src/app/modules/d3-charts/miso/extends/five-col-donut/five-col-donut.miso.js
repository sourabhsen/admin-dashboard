'use strict';
d3.chart('DonutChart').extend('FiveColDonut', {
  initialize: function(config){
    let chart = this;
    let increase = 65;
    // larger radius for smaller chart
    this.radius(Math.min((chart.config.width + increase), (chart.config.height + increase)) / 2);
    this.base.attr('transform', 'translate(0,0)');
     // calculate the arc radius
    this.arc = d3.svg.arc()
      .outerRadius(this.r - 100)
      .innerRadius(this.r - 50);

    chart.positionLabel = function(d) {
      let position =
        d.value/chart.totalCount < 0.1 ?
          'translate(' + ((chart.r-20) * Math.sin(((d.endAngle - d.startAngle) / 2) + d.startAngle)) +
              ', ' + (-1 * (chart.r-40) * Math.cos(((d.endAngle - d.startAngle) / 2) + d.startAngle)) + ')':
          'translate(' + chart.arc.centroid(d) + ')';
      return position;
    };
    //event listener and call back for click
    function _enter(){
      this.attr('data', function(d){ return d.data.group; })
        .on('click', function(event, other){
          if(chart.config.click) {
            if(chart.config.click.group === event.data.group) {
              chart.config.click.action();
            }
          }
       });
    }
    this.layer('slices').on('enter', _enter);
  }
});
