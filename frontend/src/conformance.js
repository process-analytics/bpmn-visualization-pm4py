import globals from './globals.js';
import { violationScale, colorLegend } from './colors.js'
import { getDeviationOverlay, getSynchronousOverlay } from './overlays.js'
import { getBpmnActivityElementbyName } from './utils.js';

export function getAlignment(formData) {
    console.log("Get alignments...");
    try{
        fetch('http://localhost:6969/conformance/alignment',{
            method: 'POST',
            body: formData
        }).then(response => response.json())
          .then(data => visualizeAlignment(data))
    }
    catch(error){
        console.log(error)
    }   
}

function visualizeAlignment(alignedTraces){
    const myViolationScale = violationScale(0,100)
    console.log("alignments received!");
    //compute aggregated statistics of the received alignment
    const stats = getAlignmentDecorations(alignedTraces)
    //generate colors for stats.normalizedStats
    console.log(stats.normalizedStats)
    for (const [activityName, violationValue] of Object.entries(stats.normalizedStats)) {
        const activityElement = getBpmnActivityElementbyName(activityName)
        //set the violation color
        //firstChild is the svg rect element of the activity element

        activityElement.htmlElement.firstChild.setAttribute("fill", myViolationScale(violationValue*100))
        //add overlay
        globals.bpmnVisualization.bpmnElementsRegistry.addOverlays(
            activityElement.bpmnSemantic.id,
            [getDeviationOverlay(stats.aggStats[activityName].modelMove, myViolationScale(violationValue*100)),
               getSynchronousOverlay(stats.aggStats[activityName].syncMove)])
    }
    //add legend
    colorLegend({
        colorScale: myViolationScale,
        title: "% of deviations (model moves)"
      })
}

/**
 * For each activity, compute the number of model moves and syncronous moves
 */
function getAlignmentDecorations(alignments){
    //initialize the aggregated statistics for each activity
    let aggStats = globals.bpmnActivityElements.map(function(elt){
        let result = new Object()
        result[elt.bpmnSemantic.name] = {syncMove: 0, modelMove: 0}
        return result
    })
    
    //convert the list aggStats to one object whose keys are the activity names
    aggStats = aggStats.reduce(function(obj,item){
        const key = Object.keys(item)[0]
        obj[key] = item[key]; 
        return obj;
      }, {});

    //extract the alignments
    alignments = alignments.map((elt) => elt.alignment)
    //iterate over the alignments and update aggStats
    for(const alignedTrace of alignments){
        for(const pair of alignedTrace){
            //pair[0] is a trace_move, pair[1] is a model_move
            if(pair[1] && pair[1] != '>>'){ //pair[1] is not null (tau transitions from petri net) and it is not a log move
                pair[1] === pair[0]? aggStats[pair[1]].syncMove++ : aggStats[pair[1]].modelMove++
            }   
        }
    }

    //normalize statistics wrt modelMove (which are the violations)
    let normalizedStats = Object.fromEntries(Object
        .entries(aggStats)
        .map(([activityName, value]) => [activityName, value.modelMove/(value.syncMove + value.modelMove)])
    );

    return {"aggStats": aggStats, "normalizedStats": normalizedStats}
}