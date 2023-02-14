import * as d3 from 'd3';

/* 
 * This function is derived from code in the https://observablehq.com/@d3/color-legend project,
 * which is licensed under the ISC license.
 *
 * Original code:
 * https://observablehq.com/@d3/color-legend
 *
 * ISC License:
 * Copyright 2019–2020 Observable, Inc.
 */
export function colorLegend({colorScale, title} = {}) {
    const tickSize = 6
    const width = 320
    const height = 44 + tickSize
    
    d3.select("#legend")
      .selectAll("*")
      .remove();

      const svgColorLegend = d3.select('#legend').append('svg').attr('id', 'color-legend')
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

    svgColorLegend.append("image")
    .attr("x", marginLeft)
    .attr("y", marginTop)
    .attr("width", width - marginLeft - marginRight)
    .attr("height", height - marginTop - marginBottom)
    .attr("preserveAspectRatio", "none")
    .attr("xlink:href", ramp(colorScale.interpolator()).toDataURL());

    //compute tick values
    const n = Math.round(ticks + 1);
    const tickValues = d3.range(n).map(i => d3.quantile(colorScale.domain(), i / (n - 1)));

    svgColorLegend.append("g")
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
  
    return svgColorLegend.node();
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

export function overlayLegend({leftOverlayLegend, rightOverlayLegend} = {}){
    const divElt = d3.select('#legend').node()
    const width = divElt.getBoundingClientRect().width/2;
    const height = divElt.getBoundingClientRect().height;
    const  svgOverlayLegend = d3.select('#legend').append('svg')
                                                .attr('id', 'overlay-legend')
                                                .attr('width', width)
                                                .attr('height', height)
                                                .attr('viewBox', [0, 0, width, height])
                                                .style('overflow', 'visible')
                                                .style('display', "block")
                                                
                                                
    
    const overlayGroup = svgOverlayLegend.append('g')
    
                                        
    
    const activityRectWidth = 40
    const activityRectHeight = 20
    const activityRectX = width/2 - activityRectWidth/2
    const activityRectY = height/2 - activityRectHeight/2
    overlayGroup.append('rect')
                    .attr('x', activityRectX)
                    .attr('y', activityRectY)
                    .attr('width', activityRectWidth)
                    .attr('height', activityRectHeight)
                    .attr('stroke', 'black')
                    .attr('fill', 'white')

    const overlaySize = 10
    const offset = 5

    //right overlay
    if(rightOverlayLegend != undefined){
        let overlayX = activityRectX + (activityRectWidth - overlaySize + offset)
        let overlayY = activityRectY - overlaySize + offset
        overlayGroup.append('rect')
                        .attr('x', overlayX)
                        .attr('y', overlayY)
                        .attr('width', overlaySize)
                        .attr('height', overlaySize)
                        .attr('stroke', 'black')
                        .attr('fill', 'white')
        //legend
        let overlayChunks = rightOverlayLegend.split("\n")
        let overlayTextX = overlayX + overlaySize + offset
        let overlayTextY = overlayY
        let overlayText = overlayGroup.append('text')
                        .attr('x', overlayTextX)
                        .attr('y', overlayTextY)
                        .style("font-size", "8px")
        overlayChunks.forEach(elt => overlayText.append('tspan')
                                                .attr('dy', '1em')
                                                .attr('x', overlayTextX)
                                                .text(elt))
    }
              
    //left overlay
    if(leftOverlayLegend !== undefined){
        let overlayX = activityRectX - overlaySize + offset
        let overlayY = activityRectY - overlaySize + offset
        overlayGroup.append('rect')
                        .attr('x', overlayX)
                        .attr('y', overlayY)
                        .attr('width', overlaySize)
                        .attr('height', overlaySize)
                        .attr('stroke', 'black')
                        .attr('fill', 'white')
        //legend
        let overlayChunks = leftOverlayLegend.split("\n")
        let overlayTextX = overlayX - 80
        let overlayTextY = overlayY
        let overlayText = overlayGroup.append('text')
                        .attr('x', overlayTextX)
                        .attr('y', overlayTextY)
                        .style("font-size", "8px")
        overlayChunks.forEach(elt => overlayText.append('tspan')
                                                .attr('dy', '1em')
                                                .attr('x', overlayTextX)
                                                .text(elt))
    }

    return svgOverlayLegend.node();
}

