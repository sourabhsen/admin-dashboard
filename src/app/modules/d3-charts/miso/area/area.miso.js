'use strict';

d3.chart('Area', {
  initialize: function(config){
    let chart = this;
    let base = this.base.append('g')
      .attr('transform', 'translate(' + config.margin.left + ',' + config.margin.top + ')');

    chart.config = config;
    chart.config.parent = this;
    chart.dotradius = 3 ;
    chart.axisWidth = 14;
    chart.axisHeight = 18;

    this.x = d3.time.scale();
    this.y = d3.scale.linear();
    this.width(chart.config.width);
    this.height(chart.config.height);

    // creates the area
    let area = d3.svg.area()
      .interpolate('linear')
      .x(function(d) { return chart.x(d.x); })
      .y0(function(d){ return chart.y(d.y0); })
      .y1(function(d){ return chart.y(d.y0 + d.y); });

    // creates the stacked area layers
    let stack = d3.layout.stack()
      .offset('zero')
      .values(function(d){ return d.values; })
      .x(function(d){ return d.x; })
      .y(function(d){ return d.y; });

    // nest the area data
    let nest = d3.nest()
      .key(function(d){ return d.key; });

    this.layer('gridlines', base.append('g').attr('class', 'grid-lines'), {
      dataBind: function(data){
        chart.xExtent = d3.extent(data, function(d) { return chart.x(d.x); });
        chart.YExtent = d3.max(data, function(d) { return d.y; });
        chart.dataLength = data.length;
        return this.selectAll('line').data(chart.y.ticks(5));
      },
      insert: function(){
        return this.insert('line');
      },
      events: {
        'enter':function(){
          this
            .attr('x1', chart.xExtent[0])
            .attr('x2', chart.xExtent[1])
            .attr('y1', function(d){ return chart.y(d);})
            .attr('y2', function(d){ return chart.y(d);})
            .attr('class', 'gridline');
        },
        'merge:transition': function(){
          this
            .attr('y1', function(d){ return chart.y(d);})
            .attr('y2', function(d){ return chart.y(d);});
        },
        'exit': function(){
          this.remove();
        }
      }
    });

    this.layer('area', base.append('g').attr('class', 'volume'), {
      dataBind: function(data){
        let layers = stack(nest.entries(data));
        return this.selectAll('path').data(layers);
      },
      insert: function(){
        return this.insert('path');
      },
      events: {
        'enter': function(){
          this.attr('d', function(d){ return area(d.values); })
            .attr('class', config.graph.classname)
            .attr('opacity', 0);
        },
        'enter:transition': function(){
          this.duration(1000)
            .attr('opacity', 1);
        },
        'update': function(){
          this.attr('d', function(d){ return area(d.values); });
        },
        'update:transition': function(){
           this.duration(1000)
            .attr('opacity', 1);
        },
        'exit:transition': function(){
          this.duration(1000)
            .attr('opacity', 0)
            .remove();
        }
      }
    });


    let line   = d3.svg.line()
      .x(function(d) {  return chart.x(d.x); })
      .y(function(d){ return chart.y(d.y); })
      .interpolate('linear');

    this.layer('line', base.append('g').attr('class', 'line'), {
      dataBind: function(data){
        return this.selectAll('path').data([data]);
      },
      insert: function(){
        return this.insert('path');
      },
      events: {
        'enter': function(data){
          this.attr('d', function(d){ return line(d); })
            .attr('class', config.graph.classname);
        },
        'enter:transition': function(){
          this.duration(1000)
            .attr('opacity', 1);
        },
        'update': function(){
          this.attr('d', function(d){ return line(d); });
        },
        'update:transition': function(){
           this.duration(1000)
            .attr('opacity', 1);
        },
        'exit:transition': function(){
          this.duration(1000)
            .attr('opacity', 0)
            .remove();
        }
      }
    });

    let dot = this.layer('dot', base.append('g').attr('class', 'dot'), {
       dataBind: function(data){
        return this.selectAll('circle').data([data]);
      },
      insert: function(){
        return this.insert('circle');
      },
      events: {
        'enter': function(data){
          this
            .attr('r', chart.dotradius)
            .attr('class', config.graph.classname);
        },
        'exit': function(){
          this.remove();
        }
      }
    });

    let interactiveLine = this.layer('interactiveLine', base.append('g').attr('class', 'interactiveLine'), {
       dataBind: function(data){
        return this.selectAll('line').data([data]);
      },
      insert: function(){
        return this.insert('line');
      },
      events: {
        'enter': function(data){
          this
            .attr('class', config.graph.classname)
            .attr('y1', chart.axisHeight)
            .attr('y2', chart.height() - chart.axisWidth);
        },
        'update':function(){
          this.style('display', 'none');
        },
        'exit': function(){
          this.remove();
        }
      }
    });

    let bisectDate = d3.bisector(function(d){ return d.x; }).left;
    let interactiveBisector = function (values, xAccessor, searchVal){
      let index = bisectDate(values, xAccessor, searchVal),
        d0 = values[index-1],
        d1 = values[index],
        d = xAccessor - d0.x > d1.x - xAccessor ? d1 : d0;
        return d;
    };

    this.layer('focus', base.append('g').attr('class', 'focus'), {
      dataBind: function(data){
        return this.selectAll('rect').data([data]);
      },
      insert: function(){
        return this.insert('rect');
      },
      events: {
        'enter': function(){
          this.attr('class', 'focus-overlay')
            .attr('width', chart.xExtent[1])
            .attr('height', chart.config.height)
            .on('mouseover', function(){
              dot.style('display', 'block');
              interactiveLine.style('display', 'block');
            })
            .on('mouseout', function(){
              dot.style('display', 'none');
              interactiveLine.style('display', 'none');
            })
            .on('mousemove', function(){
              let _x = chart.x.invert(d3.mouse(this)[0]),
                d = interactiveBisector(chart.data, _x, 1);
                dot.attr('transform', 'translate('+ chart.x(d.x) + ',' + chart.y(d.y)+')');
                interactiveLine.attr('transform', 'translate(' + chart.x(d.x) + ')');
            });
          },
        'exit': function(){
          this.remove();
        }
      }
    });

    chart.xAxis = this.base.select('g').chart('xAxis', config)
      .tickSize(1)
      .tickFormat(d3.time.format('%_m/%_d'))
      .tickPadding(5);

    this.attach('xAxis', chart.xAxis);

    chart.yAxis = this.base.select('g').chart('yAxis', config)
      .ticks(5)
      .tickSize(1)
      .tickPadding(5);

    this.attach('yAxis', chart.yAxis);

    //adding tooltips
    chart.tooltip = d3.select('body').chart('tooltip',  {
      layer : chart,
      type : '.focus rect',
      chartContainer : chart.config.parent,
      intersectActive : true,
      tipFormatter : function(d, i, e){
        var _d = interactiveBisector(d, chart.x.invert(e[0]), 1);
        return '<span>'+ d3.time.format('%m/%d/%y')(_d.x) +':&nbsp;'+ _d.y +'</span>';
      }
    });

    this.attach('tooltip', chart.tooltip);

  },
  width: function(newWidth) {
    if (!arguments.length) {
      return this.w;
    }
    this.w = newWidth;
    this.x.range([(this.config.parent.dotradius + this.config.parent.axisWidth + 5), (this.w - this.config.margin.left - this.config.parent.dotradius - this.config.parent.axisWidth)]);
    this.base.attr('width', this.w);
    return this;
  },
  height: function(newHeight) {
    if (!arguments.length) {
      return this.h;
    }
    this.h = newHeight;
    this.y.range([(this.h - this.config.parent.dotradius - this.config.parent.axisHeight), this.config.parent.dotradius + this.config.parent.axisHeight]);
    this.base.attr('height', this.h);
    return this;
  },
  transform: function(dataSrc){
    let chart  = this;
    let format = d3.time.format('%Y-%m-%d');
    let data   = dataSrc.map(function(d){
      let data = {};
      data.x   = format.parse(d[chart.config.graph.xKey]);
      data.y   = +d[chart.config.graph.yKey];
      data.key = 'Total';
      return data;
    });

    this.x.domain(d3.extent(data, function(d) { return d.x; }));
    this.y.domain([0, d3.max(data, function(d) { return d.y; })]);
    this.data = data;

    return data;
  }

});
