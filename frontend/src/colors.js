import * as d3 from 'd3';

export function violationScale(min,max){
  return d3.scaleSequential().domain([min,max])
            .interpolator(d3.interpolateOrRd)
}

export function frequencyScale(min, max){
  return d3.scaleSequential().domain([min,max])
          .interpolator(d3.interpolatePuBu)
}

//updated from: https://observablehq.com/@d3/color-legend
export function colorLegend({colorScale, title} = {}) {
    const tickSize = 6
    const width = 320
    const height = 44 + tickSize
    
    d3.select("#legend")
      .selectAll("*")
      .remove();

    d3.select('#legend').append('svg').attr('id', 'svg-legend')
    const appendedSvg = d3.select('#svg-legend')
                            .attr("id", "svg-legend")
                            .attr("width", width)
                            .attr("height", height)
                            .attr("viewBox", [0, 0, width, height])
                            .style("overflow", "visible")
                            .style("display", "block")
    
    const marginTop = 18
    const marginRight = 0
    const marginBottom = 16 + tickSize
    const marginLeft = 0
    const ticks = width / 64
  
    let tickAdjust = g => g.selectAll(".tick line").attr("y1", marginTop + marginBottom - height);
    let x = Object.assign(colorScale.copy()
    .interpolator(d3.interpolateRound(marginLeft, width - marginRight)), {
        range() {
        return [marginLeft, width - marginRight];
        }
    });

    appendedSvg.append("image")
    .attr("x", marginLeft)
    .attr("y", marginTop)
    .attr("width", width - marginLeft - marginRight)
    .attr("height", height - marginTop - marginBottom)
    .attr("preserveAspectRatio", "none")
    .attr("xlink:href", ramp(colorScale.interpolator()).toDataURL());

    //compute tick values
    const n = Math.round(ticks + 1);
    const tickValues = d3.range(n).map(i => d3.quantile(colorScale.domain(), i / (n - 1)));

    appendedSvg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(x)
            .ticks(ticks)
            .tickSize(tickSize)
            .tickValues(tickValues))
        .call(tickAdjust)
        .call(g => g.select(".domain").remove())
        .call(g => g.append("text")
        .attr("x", marginLeft)
        .attr("y", marginTop + marginBottom - height - 6)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text(title));
  
    return appendedSvg.node();
  }
  
  function ramp(color, n = 256) {
    var canvas = document.createElement('canvas');
    canvas.width = n;
    canvas.height = 1;
    const context = canvas.getContext("2d");
    for (let i = 0; i < n; ++i) {
      context.fillStyle = color(i / (n - 1));
      context.fillRect(i, 0, 1, 1);
    }
    return canvas;
}