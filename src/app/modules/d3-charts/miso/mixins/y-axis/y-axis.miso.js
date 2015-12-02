'use strict';
d3.chart('yAxis', {
 initialize: function(config){
    let component = this;
    let chart = config.parent;
    this.name = 'yAxis';

    this.axisY = d3.svg.axis()
      .scale(chart.y)
      .orient('left');

    this.layer('axis', chart.base.append('g').attr('class', 'y axis'), {
      dataBind: function(data){
        return this.selectAll('g').data([data]);
      },
      insert: function(){
        return this.append('g');
      },
      events: {
        'merge:transition': function(){
          this.duration(100)
            .call(component.axisY)
            .attr('transform', 'translate('+(config.margin.left + chart.axisWidth + 3 )+', 0)') //don't know why +3 but it lines up?
          .selectAll('text')
            .attr('y', 0)
            .style('text-anchor', 'end');
        }
      }
    });
  },
  ticks: function(args){
     if(arguments.length === 0) {
      return this.axisY.ticks();
    }
    this.axisY.ticks(arguments[0], arguments[1]);

    return this;
  },
  tickValues: function(values){
     if(arguments.length === 0) {
      return this.axisY.ticks();
    }

    this.axisY.ticks(values);

    return this;
  },
  tickSize: function(size){
    if(arguments.length === 0) {
      return this.axisY.tickSize();
    }

    this.axisY.tickSize(size);

    return this;
  },
  innerTickSize: function(size){
    if(arguments.length === 0) {
      return this.axisY.innerTickSize();
    }

    this.axisY.innerTickSize(size);

    return this;
  },
  outerTickSize: function(size){
    if(arguments.length === 0) {
      return this.axisY.outerTickSize();
    }

    this.axisY.outerTickSize(size);

    return this;
  },
  tickPadding: function(padding){
     if(arguments.length === 0) {
      return this.axisY.tickPadding();
    }

    this.axisY.tickPadding(padding);

    return this;
  },
  tickFormat: function(format){
     if(arguments.length === 0) {
      return this.axisY.tickFormat();
    }

    this.axisY.tickFormat(format);

    return this;
  }
});
