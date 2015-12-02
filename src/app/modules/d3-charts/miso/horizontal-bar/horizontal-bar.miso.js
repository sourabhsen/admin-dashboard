'use strict';
d3.chart('HorizontalBar', {
  initialize: function(config) {
    let chart = this;
    let base  = this.base.append('g')
      .attr('transform', 'translate(' + config.margin.left + ',' + config.margin.top + ')');

    chart.config = config;
    chart.config.parent = this;
    this.offsetLeft = chart.config.offsetLeft ? chart.config.offsetLeft : chart.config.width/2;
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
          this.attr('transform', function(d, i) { return 'translate('+(chart.offsetLeft + 5 )+',' + chart.y(i) + ')'; })
            .attr('width', function(d){return (chart.x(d.y) );})
            .attr('height', chart.y.rangeBand())
            .attr('class', config.graph.classname)
            .attr('opacity', 0);
        },
        'enter:transition': function(){
          this.duration(1000).attr('opacity', 1);
        },
        'update:transition': function(){
          this.duration(1000)
            .attr('width', function(d){return (chart.x(d.y) );})
            .attr('opacity', 1);
        },
        'exit': function(){
           this.remove();
       }
      }
    });

    chart.positionInnerLabel = function(d) {
      let rectWidth = chart.x(d.y) ;
      let textX     = (d.y/ chart.totalCount > 0.1) ? (d.y.toString().length + 7) * 6 : (d.y.toString().length + 6) * 6;
      let position  = rectWidth - textX;

      if(textX >= rectWidth || position < 10) {
          position = rectWidth + 6;
          d.color  = '#000000';
      } else {
        if(chart.config.graph.classname && (chart.config.graph.classname==='job-search-hi' || chart.config.graph.classname==='job-app-hi' || chart.config.graph.classname==='skills-hi')){
          d.color       = '#000000';
        } else {
          d.color       = '#ffffff';
        }
      }
      return position;
    };

    this.layer('innerLabels', base.append('g'), {
      dataBind: function(data){
        return this.selectAll('text').data(data);
      },
      insert: function(){
        return this.insert('text');
      },
      events: {
        'enter': function(){
          this.attr('transform', function(d,i) { return 'translate('+chart.offsetLeft+',' + chart.y(i) + ')'; })
            .attr('x', function(d) { return  chart.positionInnerLabel(d); })
            .attr('y', chart.y.rangeBand()/2)
            .attr('fill', function(d){ return d.color; })
            .attr('dy', '.35em')
            .attr('text-anchor', 'start')
            .attr('opacity', 1)
            .text(function(d) {
              var percentage = (d.y/chart.totalCount)*100;
              return  d.y + ' (' + percentage.toFixed(1) + '%)'; }
            );
        },
        'enter:transition': function(){
          this.duration(1000).attr('opacity', 1);
        },
        'update:transition': function(){
          this.duration(1000)
            .attr('x', function(d) { return  chart.positionInnerLabel(d); })
            .attr('fill', function(d){ return d.color; })
            .text(function(d) {
              var percentage = (d.y/chart.totalCount)*100;
              return d.y + ' (' + percentage.toFixed(1) + '%)'; }
            )
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
          this.attr('transform', function(d,i) { return 'translate('+chart.offsetLeft+',' + chart.y(i) + ')'; })
            .attr('x', -3)
            .attr('y', chart.y.rangeBand()/2)
            .attr('dy', '.35em')
            .attr('text-anchor', 'end')
            .attr('opacity', 1)
            .text(function(d) { return d.x; });
        },
        'enter:transition': function(){
          this.duration(1000).attr('opacity', 1);
        },
        'update:transition': function(){
          this.duration(1000)
            .attr('x', -3)
            .attr('text-anchor', 'end')
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
        return '<span>'+d.fulltext +':&nbsp;'+ d.y +'</span>';
      }
    });

    this.attach('tooltip', chart.tooltip);

  },
  width: function(newWidth) {
    if (!arguments.length) {
      return this.w;
    }
    this.w = newWidth;
    this.x.range([0, (this.w - (this.offsetLeft + this.config.margin.left) - 7)]);
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
      let textlength = chart.offsetLeft/5.75;
      let data  = dataSrc.map(function(d){
        let data       = {};
        if (d[chart.config.graph.xKey] === null || d[chart.config.graph.xKey] === 'undefined') {
          d[chart.config.graph.xKey] = 'NULL';
        }
        data.x         = d[chart.config.graph.xKey].length < textlength ? d[chart.config.graph.xKey] : d[chart.config.graph.xKey].substring(0,textlength) +'...';
        data.y         = d[chart.config.graph.yKey];
        data. u        = Math.random(10);
        data.fulltext  = d[chart.config.graph.xKey];
        return data;
      });
      this.dataLength = data.length;
      this.x.domain([0, d3.max(data, function(d){ return d.y; })]);
      let domainY = chart.config.domainY ? data.length : 20;
      this.y.domain(d3.range(0, domainY));
      this.totalCount = chart.config.totalCount;
      return data;
  }
});
