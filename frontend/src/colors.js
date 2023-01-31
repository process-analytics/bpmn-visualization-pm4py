import * as d3 from 'd3';

export function violationScale(min,max){
  return d3.scaleSequential().domain([min,max])
            .interpolator(d3.interpolateOrRd)
}

export function frequencyScale(min, max){
  return d3.scaleSequential().domain([min,max])
          .interpolator(d3.interpolatePuBu)
}