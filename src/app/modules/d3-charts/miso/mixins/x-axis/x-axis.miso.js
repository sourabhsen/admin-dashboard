'use strict';
d3.chart('xAxis', {
  initialize: function(config){
    let component = this;
    let chart = config.parent;

    this.name = 'xAxis';

    this.axisX = d3.svg.axis()
      .scale(chart.x)
      .orient('bottom');

    this.layer('xAxis', chart.base.append('g').attr('class', 'x axis'), {
      dataBind: function(data){
        component.dataLength = data.length;
        return this.selectAll('g').data([data]);
      },
      insert: function(){
        return this.append('g');
      },
      events: {
        'merge:transition': function(){
          this.duration(100)
            .call(component.axisX)
            .attr('transform', 'translate('+ config.margin.left + ','+ (config.height - 16) +')'); // 16 = 11px font-size + 5px top margin
        }
      }
    });
  },
  ticks: function(args){
     if(arguments.length === 0) {
      return this.axisX.ticks();
    }

    this.axisX.ticks(arguments[0], arguments[1]);

    return this;
  },
  tickValues: function(values){
     if(arguments.length === 0) {
      return this.axisX.ticks();
    }

    this.axisX.ticks(values);

    return this;
  },
  tickSize: function(size){
    if(arguments.length === 0) {
      return this.axisX.tickSize();
    }

    this.axisX.tickSize(size);

    return this;
  },
  innerTickSize: function(size){
    if(arguments.length === 0) {
      return this.axisX.innerTickSize();
    }

    this.axisX.innerTickSize(size);

    return this;
  },
  outerTickSize: function(size){
    if(arguments.length === 0) {
      return this.axisX.outerTickSize();
    }

    this.axisX.outerTickSize(size);

    return this;
  },
  tickPadding: function(padding){
     if(arguments.length === 0) {
      return this.axisX.tickPadding();
    }

    this.axisX.tickPadding(padding);

    return this;
  },
  tickFormat: function(format){
     if(arguments.length === 0) {
      return this.axisX.tickFormat();
    }

    this.axisX.tickFormat(format);

    return this;
  }
});
