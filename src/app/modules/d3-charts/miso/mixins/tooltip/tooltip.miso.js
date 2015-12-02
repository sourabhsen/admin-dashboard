'use strict';
d3.chart('tooltip', {
  initialize: function(options) {
    options = options || {};

    // Options must contain a layer onto which the tooltips will be added.
    this.tooltipedLayer = options.layer;
    this.tooltipedSelectionType = options.type;
    this.tooltipColor = options.colorStyle || false;
    this.chartWindow = options.chartContainer;
    this.intersectActive = options.intersectActive || false;

    this.text(options.tipFormatter);

    var tooltipBase = this.base
      .append('div')
      .classed('d3-chart-tooltip', true);

    // Calculates the gravity offset of the tooltip. Parameter is position of tooltip
    // relative to the viewport.
    var calcGravityOffset = function(pos, chart) {
        var chartWindowWidth = chart.config.width || document.documentElement.clientWidth,
          posX = pos.offsetX,
          tooltipWidth = tooltipBase.node().offsetWidth,
          tooltipHeight = tooltipBase.node().offsetHeight,
          left, top, posTipRight = false;

          if(posX > (chartWindowWidth - tooltipWidth) - 20){
            left = pos.pageX - tooltipWidth + 20;
            posTipRight = true;
          }else{
            left = pos.pageX - 20;
            posTipRight = false;
          }

          /* @TODO need to set the tip at north
          * top = (posY - 20)  <  tooltipHeight ? d3.event.pageY + 10 : d3.event.pageY - tooltipHeight - 20  ;
          */
          top = pos.pageY - tooltipHeight - 20 ;

          return{
            'left' : left,
            'top': top,
            'tipRight': posTipRight
          };


    };

    var showTooltip =  function() {
         var chart = this.chart();
         var tooltip = tooltipBase;
         var content = this;


         tooltip.append('div').attr('class','d3-chart-tip');
         // find all the elements that we are listening to
          // based on the selection type
          chart.tooltipedLayer.base
            .selectAll(chart.tooltipedSelectionType)

            .on('mouseover.d3-chart-tooltip', function(d, i) {
              var posBisector = chart.intersectActive ? d3.mouse(this): false;

              content.html(function(){
                return chart._textFn(d, i, posBisector);
              });

              var posOffset = calcGravityOffset(d3.event, chart.chartWindow);
              var tip = tooltip.select('div.d3-chart-tip');

              if(posOffset.tipRight){
                tip.classed('right', true)
                   .style('right', '15px');
              }else{
                tip.classed('right', false)
                   .style('right', tooltip.node().offsetWidth - 30 +'px');
              }

             var colorSchema = content.select('span').style('background-color');
             if(colorSchema && chart.tooltipColor){
                tip.style({
                  'border-color': colorSchema +' transparent transparent transparent'
                });

               tooltip.style({
                  'background': colorSchema,
                });
             }

             tooltip.style({
                left: posOffset.left + 'px',
                top:  posOffset.top + 'px',
                'opacity': 1,
                'pointer-events': 'all'
              });
            })

          // when moving the tooltip, re-render its position
          // and update the text in case it's position dependent.
          .on('mousemove.d3-chart-tooltip', function(d, i) {
            var posBisector = chart.intersectActive ? d3.mouse(this): false;

            content.html(function(){
              return chart._textFn(d, i, posBisector);
            });

            var posOffset = calcGravityOffset(d3.event, chart.chartWindow);
            var tip = tooltip.select('div.d3-chart-tip');

            if(posOffset.tipRight){
              tip.classed('right', true)
                 .style('right', '15px');
            }else{
              tip.classed('right', false)
                 .style('right', tooltip.node().offsetWidth - 30 +'px');
            }

            var colorSchema = content.select('span').style('background-color');
            if(colorSchema && chart.tooltipColor){
              tip.style({
                'border-color': colorSchema +' transparent transparent transparent'
              });

              tooltip.style({
                'background': colorSchema,
              });
            }

            tooltip.style({
                left: posOffset.left + 'px',
                top:  posOffset.top + 'px',
                'opacity': 1,
                'pointer-events': 'all'
              });
          })

          // when exiting the tooltip, just set its contents to nothing.
            .on('mouseout.d3-chart-tooltip', function() {
              tooltip.style({ 'opacity': '0', 'pointer-events': 'none'});
              content.html('');
            });
    };

    this.layer('tooltips', tooltipBase, {
      dataBind: function() {

        // we only want to bind one data element to it
        // so the original data doesn't even matter
        // but we do need to create one element for it.
        return this.selectAll('div')
          .data([true]);
      },

      insert: function() {
        return this.append('div').attr('class','d3-chart-content');
      },


      events : {
        'enter' : showTooltip,
        'update': showTooltip,
        'exit'  : function(){
          this.remove();
        }
      }

    });
  },

  // the setter for the function that will render the
  // contents of the tooltip. It must be called before a chart
  // .draw is called.
  text: function(d) {
    if (arguments.length === 0) { return this._textFn; }
    this._textFn = d3.functor(d);
    return this;
  }
});
