import globals from './globals.js';
import { violationScale } from './colors.js'
import { colorLegend, overlayLegend } from './legend.js';
import { getDeviationOverlay, getSynchronousOverlay } from './overlays.js'
import { apiUrl, getBpmnActivityElementbyName } from './utils.js';
import { mxgraph, ShapeBpmnElementKind, FlowKind } from 'bpmn-visualization';

export function getAlignment(formData) {
    console.log("Get alignments...");
    return fetch(`${apiUrl}/conformance/alignment`,{
            method: 'POST',
            body: formData
        }).then(response => response.json())
          .then(data => visualizeAlignment(data))
          .catch(error => console.log(error))
}

function visualizeAlignment(alignedTraces){
    const myViolationScale = violationScale(0,100)
    console.log("alignments received!");

    //compute aggregated statistics of the received alignment
    const stats = getAlignmentDecorations(alignedTraces)

    //set the violation color
    const graph = globals.bpmnVisualization.graph

    // reset fill and font color for activities
    const activities = globals.bpmnVisualization.bpmnElementsRegistry.getElementsByKinds(ShapeBpmnElementKind.TASK);
    const activitiesIds = activities.map(elt => elt.bpmnSemantic.id);
    globals.bpmnVisualization.bpmnElementsRegistry.updateStyle(activitiesIds, {
        fill:{
            color: 'default'
        },
        font: {
            color: 'default'
        }
    });

    // reset color and width for edges
    const edges = globals.bpmnVisualization.bpmnElementsRegistry.getElementsByKinds(FlowKind.SEQUENCE_FLOW);
    const edgesIds = edges.map(elt => elt.bpmnSemantic.id);
    globals.bpmnVisualization.bpmnElementsRegistry.updateStyle(edgesIds, {
        stroke:{
            color: 'default'
        },
        width: 'default'
    });

    //remove overlays
    activities.forEach(act => globals.bpmnVisualization.bpmnElementsRegistry.removeAllOverlays(act.bpmnSemantic.id))
    edges.forEach(edge => globals.bpmnVisualization.bpmnElementsRegistry.removeAllOverlays(edge.bpmnSemantic.id))

    // update style and add overlay
    for (const [activityName, violationRatio] of Object.entries(stats.normalizedStats)) {
        const activityElement = getBpmnActivityElementbyName(activityName)
        if (activityElement) {
            let fontColor = 'default';
            if (violationRatio > 0.5) {
                fontColor= 'white';
            }
            globals.bpmnVisualization.bpmnElementsRegistry.updateStyle(activityElement.bpmnSemantic.id, {
                fill: {
                    color: myViolationScale(violationRatio * 100)
                },
                font: {
                    color: fontColor
                }
            });

            //add overlay
            globals.bpmnVisualization.bpmnElementsRegistry.addOverlays(
                activityElement.bpmnSemantic.id,
                [
                    getDeviationOverlay(stats.aggStats[activityName].modelMove,
                    violationRatio,
                    myViolationScale(violationRatio * 100)),
                    getSynchronousOverlay(stats.aggStats[activityName].syncMove)
                ])
        }
    }

    //add legend
    colorLegend({
        colorScale: myViolationScale,
        title: "% deviations (model moves)"
      })

    overlayLegend({
        leftOverlayLegend: "# conformities\n(synchronous moves)",
        rightOverlayLegend : "# deviations\n(model moves)"})
}

/**
 * For each activity, compute the number of model moves and syncronous moves
 */
function getAlignmentDecorations(alignments){
    //initialize the aggregated statistics for each activity
    const aggStats = globals.bpmnActivityElements.map(elt => {
        let result = {}
        result[elt.bpmnSemantic.name] = {syncMove: 0, modelMove: 0}
        return result
    })
      //convert the list aggStats to one object whose keys are the activity names
      .reduce((obj, item) => {
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
