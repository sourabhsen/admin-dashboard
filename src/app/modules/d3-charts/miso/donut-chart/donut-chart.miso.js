'use strict';
d3.chart('DonutChart', {

  initialize: function(config) {
    let chart = this;
    chart.config = config;
    chart.config.parent = this;

    this.radius(Math.min(chart.config.width, chart.config.height) / 2);

    //create an svg <g> element (base) to hold the generated donut slide
    let base = this.base.append('g').attr('transform', 'translate('+ config.width/2  + ',' + this.r + ')');

    // pie slice colors
    this.scaleColor(config.graph.scaleColor);
    this.textColor(config.graph.textColor);
    this.lineSpace = 20;

    //create the layout and attach the value
    this.donut = d3.layout.pie()
      .sort(null)
      .value(function(d) {
      return d.count;
    });

    // calculate the arc radius
    this.arc = d3.svg.arc()
      .outerRadius(this.r - 108)
      .innerRadius(this.r -50);
    // Donut slices
    this.layer('slices', base.append('g').classed('slices', true), {
      //binding all <g> element in the chart
      dataBind: function(data) {
        return this.selectAll('path').data(chart.donut(data), function(d){return d.data.u;});
      },
      insert: function() {
        var g = this.append('g')
                  .classed('slice', true);
        return  g.append('path')
                  .attr('fill', function(d, i) {
                    return chart.scaleColor[i];
                  })
                  .attr('fill-opacity', 1);
      },
      events: {
        'enter': function(){
          this.attr('d', chart.arc)
            .attr('opacity', 0);
        },
        'enter:transition': function(){
          this.duration(1000).attr('opacity', 1);
        },
        'update:transition': function(){
          this.duration(1000)
          .attr('d', chart.arc)
          .attr('opacity', 1);
        },
        'exit': function(){
           this.remove();
        }
      }
    });

    chart.positionLabel = function(d) {
      let position =
        d.value/chart.totalCount < 0.1 ?
          'translate(' + ((chart.r-20) * Math.sin(((d.endAngle - d.startAngle) / 2) + d.startAngle)) +
              ', ' + (-1 * (chart.r-20) * Math.cos(((d.endAngle - d.startAngle) / 2) + d.startAngle)) + ')':
          'translate(' + chart.arc.centroid(d) + ')';
      return position;
    };

    // Text label
    this.layer('labels', base.append('g').classed('labels', true), {
      dataBind: function(data){
        return this.selectAll('text').data(chart.donut(data));
      },
      insert: function(){
        return this.insert('text');
      },
      events: {
        'enter': function(){
            this.attr('transform', function(d) { return chart.positionLabel(d); })
            .attr('x', -8)
            .attr('fill', function(d,i){ return d.value/chart.totalCount < 0.1 ? '#000000' : chart.textColor[i]; })
            .attr('dy', '.35em')
            .attr('font-size', '9px')
            .text(function(d) {
              var percentage = (d.value/chart.totalCount)*100;
              return  percentage.toFixed(0) + '%'; }
            );
        },
        'enter:transition': function(){
          this.duration(1000).attr('opacity', 1);
        },
        'update:transition': function(){
          this.duration(1000)
          .attr('transform', function(d) {
            return chart.positionLabel(d); })
            .attr('x', -10)
            .text(function(d) {
              var percentage = (d.value/chart.totalCount)*100;
                return  percentage.toFixed(0) + '%';
             })
            .attr('opacity', 1);
        },
        'exit': function(){
           this.remove();
       }
      }
    });

    //Legend icon
    this.layer('legendIcon', base.append('g').classed('legend', true), {
      dataBind: function(data){
        return this.selectAll('rect').data(chart.donut(data));
      },
      insert: function(){
        return this.insert('rect');
      },
      events: {
        'enter': function(){
            this.attr('transform', function(d, i) {
              return 'translate('+ ((chart.config.width/2) - chart.config.margin.left) * -1 +',' + (chart.r -35 + chart.lineSpace*i) + ')'; })
            .attr('width', 10)
            .attr('height', 10)
            .attr('fill', function(d, i) {
              return chart.scaleColor[i];
            })
            .attr('opacity', 1);
        },
        'enter:transition': function(){
          this.duration(1000).attr('opacity', 1);
        },
        'update:transition': function(){

        },
        'exit': function(){
           this.remove();
       }
      }
    });

    this.layer('legendText', base.append('g').classed('legendText', true), {
      dataBind: function(data){
        return this.selectAll('text').data(chart.donut(data));
      },
      insert: function(){
       return this.insert('text');
      },
      events: {
        'enter': function(){

          this.attr('transform', function(d, i) {

          return 'translate(0,' + (chart.r -30 + chart.lineSpace*i) + ')'; })
            .attr('x', ((chart.config.width/2) - chart.config.margin.left - 20) * -1 ) // 20 = width of legend icon + margin
            .attr('dy', '.35em')
            .attr('opacity', 1)
            .text(function(d) { return d.data.group + ' (' + d.data.count + ')';});
        },
        'enter:transition': function(){
          this.duration(1000).attr('opacity', 1);
        },
        'update:transition': function(){
          this.duration(1000)
            .text(function(d) { return d.data.group + ' (' + d.data.count + ')';})
            .attr('opacity', 1);
        },
        'exit': function(){
           this.remove();
       }
      }
    });

    //adding clickable link next to legend text
    if(chart.config.click){
      this.layer('legendLink', base.append('g').classed('legendLink', true), {
        dataBind: function(data){
          return this.selectAll('text').data(chart.donut(data));
        },
        insert: function(){
         return this.insert('text');
        },
        events: {
          'enter': function(){
            this.attr('transform', function(d, i) {
                return 'translate(0,' + (chart.r -30 + chart.lineSpace*i) + ')';
              })
              .attr('x', function(d, i){
                var textNode = base.selectAll('g.legendText text').node();
                return textNode.getComputedTextLength() - 60;
              })
              .attr('dy', '.35em')
              .attr('opacity', 1)
              .classed('view-details', true);

              this.each(function(d){
                var tnode = d3.select(this);
                if(d.data.group === chart.config.click.group){
                    tnode.text('View List')
                    .on('click', function(){
                      chart.config.click.action();
                    });
                }
              });
          }
        }
      });
    }

    //adding tooltips
    chart.tooltip = d3.select('body').chart('tooltip',  {
      layer : chart,
      type : 'path',
      colorStyle : true,
      chartContainer : chart.config.parent,
      tipFormatter : function(d, i){
        var colorBckg = '#FFF';
        if(chart.scaleColor){
         colorBckg = chart.scaleColor[i];
        }
        var userString = (d.data.count === 1) ? 'user' : 'users';
        var percentageString = '(' + ((d.value/chart.totalCount)*100).toFixed(0) + '%)';

        return '<span class=donut-color style=color:'+chart.textColor[i]+';background-color:'+colorBckg+';>'+d.data.group +':<br>'+ d.data.count +'&nbsp;'+userString+'&nbsp;'+ percentageString +'</span>';
      }
    });

    this.attach('tooltip', chart.tooltip);
  },
  radius : function(newRadius) {
    if (!arguments.length) {
      return this.r;
    }
    this.r = newRadius;

    return this;
  },
  scaleColor: function(scaleColor){
    if(!scaleColor) {
      this.scaleColor =['#09587b', '#cedee5','#0099cc','#a3a3a1','#111C24','#aabe02','#4fac1c', '#d7234a', '#990000'];
    } else {
       this.scaleColor = scaleColor;
    }
    return this;
  },
  textColor: function(textColor){
    if(!textColor) {
      this.textColor = ['#ffffff', '#000000','#ffffff','#ffffff','#ffffff','#000000','#ffffff', '#ffffff', '#000000'];
    } else {
      this.textColor = textColor;
    }
    return this;
  },
  transform: function(dataSrc) {
    let chart = this;
    let data  = dataSrc.map(function(d){
      let data   = {};
      data.count = d[chart.config.graph.countKey];
      data.group = d[chart.config.graph.groupKey];
      data. u = Math.random(10);
      return data;
    });
    this.totalCount = d3.sum(data, function(d){ return d.count;});
    return data;
  }
});
