'use strict';
d3.chart('HozBar', {
  initialize: function(config) {
    let chart = this;
    let base = this.base.append('g')
      .attr('transform', 'translate(' + config.margin.left + ',' + config.margin.top + ')');

    chart.config = config;
    chart.config.parent = this;
    this.linespace = 18;

    this.x = d3.scale.linear();
    this.y = d3.scale.ordinal();
    this.width(chart.config.width);
    this.height(chart.config.height);


    this.layer('bars', base.append('g'), {
      dataBind: function(data){
        return this.selectAll('rect').data(data, function(d){return d.u;  });
      },
      insert: function(){
        return this.insert('rect');
      },
      events: {
        'enter': function(){
          this.attr('transform', function(d, i) { return 'translate(0,' + (chart.y(i) + (i+1)*chart.linespace) + ')'; })
            .attr('width', function(d){return chart.x(d.y) ;})
            .attr('height', chart.y.rangeBand())
            .attr('class', config.graph.classname)
            .attr('opacity', 0);
        },
        'enter:transition': function(){
          this.duration(1000).attr('opacity', 1);
        },
        'update:transition': function(){
          this.duration(1000)
            .attr('width', function(d){return chart.x(d.y);})
            .attr('opacity', 1);
        },
        'exit': function(){
           this.remove();
       }
      }
    });

    function positionInnerLabel(d) {
      let rectWidth = chart.x(d.y);
      let textX     = d.y.toString().length * 7;
      let position  = textX >= rectWidth  ? rectWidth + 3 : rectWidth - textX;
      d.color   = textX >= rectWidth  ? '#000000' : '#ffffff';
      return position;
    }

    this.layer('innerLabels', base.append('g'), {
      dataBind: function(data){
        return this.selectAll('text').data(data);
      },
      insert: function(){
        return this.insert('text');
      },
      events: {
        'enter': function(){
          this.attr('transform', function(d,i) { return 'translate(0,' + (chart.y(i) + (i+1)*chart.linespace) + ')'; })
            .attr('x', function(d) { return  positionInnerLabel(d); })
            .attr('y', chart.y.rangeBand()/2)
            .attr('fill', function(d){ return d.color; })
            .attr('dy', '.35em')
            .attr('opacity', 1)
            .text(function(d) { return d.y; });
        },
        'enter:transition': function(){
          this.duration(1000).attr('opacity', 1);
        },
        'update:transition': function(){
          this.duration(1000)
            .attr('x', function(d) { return  positionInnerLabel(d); })
            .text(function(d) { return d.y; })
            .attr('opacity', 1);
        },
        'exit': function(){
           this.remove();
       }
      }
    });

    this.layer('outerLabels', base.append('g'), {
      dataBind: function(data){
        return this.selectAll('text').data(data);
      },
      insert: function(){
        return this.insert('text');
      },
      events: {
        'enter': function(){
          this.attr('transform', function(d,i) { return 'translate(0,' + (chart.y(i) + i*chart.linespace) + ')'; })
            .attr('x', 0)
            .attr('y', chart.y.rangeBand()/2)
            .attr('dy', '.35em')
            .attr('opacity', 1)
            .text(function(d) { return d.x; });
        },
        'enter:transition': function(){
          this.duration(1000).attr('opacity', 1);
        },
        'update:transition': function(){
          this.duration(1000)
            .attr('x', 0)
            .text(function(d) { return d.x; })
            .attr('opacity', 1);
        },
        'exit': function(){
           this.remove();
       }
      }
    });

    //adding tooltips
    chart.tooltip = d3.select('body').chart('tooltip',  {
      layer : chart,
      type : 'rect',
      chartContainer : chart.config.parent,
      tipFormatter : function(d){
        // console.log(d);
        return '<span>'+d.x +':&nbsp;'+ d.y +'</span>';
      }
    });

    this.attach('tooltip', chart.tooltip);
  },
  width: function(newWidth) {
    if (!arguments.length) {
      return this.w;
    }
    this.w = newWidth;
    this.x.range([0, (this.w - (this.config.margin.left) - 7)]);
    this.base.attr('width', this.w);
    return this;
  },

  height: function(newHeight) {
    if (!arguments.length) {
      return this.h;
    }
    this.h = newHeight;
    this.y.rangeRoundBands([0, this.h], 0.1);
    this.base.attr('height', this.h);
    return this;
  },
  setY: function(data) {
    this.ySet = true;
    this.y.domain(data.map(function(d){ return d.x; }));
  },
  transform: function(dataSrc) {
      let chart = this;
      let data  = dataSrc.map(function(d){
        let data = {};
        //data.x   = d[chart.config.graph.xKey].length < 12 ? d[chart.config.graph.xKey] : d[chart.config.graph.xKey].substring(0,12) +'...';
        data.x   = d[chart.config.graph.xKey];
        data.y   = d[chart.config.graph.yKey];
        data. u = Math.random(10);
        return data;
      });

      this.x.domain([0, d3.max(data, function(d){ return d.y; })]);
      this.y.domain(d3.range(0, 40));
      return data;
  }
});
