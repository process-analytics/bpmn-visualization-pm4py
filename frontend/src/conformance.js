import globals from './globals.js';
import { mxgraph } from './mxgraph-initializer';
import { violationScale } from './colors.js'
import { colorLegend, overlayLegend } from './legend.js';
import { getDeviationOverlay, getSynchronousOverlay } from './overlays.js'
import { apiUrl, getBpmnActivityElementbyName } from './utils.js';
import { ShapeBpmnElementKind } from 'bpmn-visualization';

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
    /**
    * A high level API will be provided: see https://github.com/process-analytics/bpmn-visualization-R/issues/13
    */
    let mxGraph = globals.bpmnVisualization.graph
    let activityCurrentStyle = null
    let activityCell = null

    //first reset fill and font color
    // and remove overlays if existing
    let activities = globals.bpmnVisualization.bpmnElementsRegistry.getElementsByKinds(ShapeBpmnElementKind.TASK)
    let activityCells = activities.map(elt => mxGraph.getModel().getCell(elt.bpmnSemantic.id))
    mxGraph.getModel().beginUpdate()
    try {
        mxgraph.mxUtils.setCellStyles(mxGraph.getModel(), activityCells, "fillColor", "none")
        mxgraph.mxUtils.setCellStyles(mxGraph.getModel(), activityCells, "fontColor", "none")
    } finally {
        mxGraph.getModel().endUpdate();
    }

    //remove overlays
    activities.forEach(act => globals.bpmnVisualization.bpmnElementsRegistry.removeAllOverlays(act.bpmnSemantic.id))


    //set violation color
    for (const [activityName, violationRatio] of Object.entries(stats.normalizedStats)) {
        const activityElement = getBpmnActivityElementbyName(activityName)
        if(activityElement){
            activityCell = mxGraph.getModel().getCell(activityElement.bpmnSemantic.id)
            activityCurrentStyle = mxGraph.getModel().getStyle(activityCell)
            mxGraph.getModel().beginUpdate()
            try {
                let style = mxgraph.mxUtils.setStyle(activityCurrentStyle, "fillColor", myViolationScale(violationRatio*100))
				mxGraph.getModel().setStyle(activityCell, style);
                activityCurrentStyle = mxGraph.getModel().getStyle(activityCell)
                //different way of setting the style
                //mxGraph.setCellStyles("fillColor", "red", [activityCell]);

                //set label to white when the activity fillColor is above the scale average
                if(violationRatio > 0.5){
                    style = mxgraph.mxUtils.setStyle(activityCurrentStyle, 'fontColor', 'white')
				    mxGraph.getModel().setStyle(activityCell, style);
                }
            } finally {
                mxGraph.getModel().endUpdate();
            }
            //add overlay
            globals.bpmnVisualization.bpmnElementsRegistry.addOverlays(
                activityElement.bpmnSemantic.id,
                [
                    getDeviationOverlay(stats.aggStats[activityName].modelMove,
                                        violationRatio,
                                        myViolationScale(violationRatio*100)),
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
        leftOverlayLegend: "# conformoties\n(synchronous moves)",
        rightOverlayLegend : "# deviations\n(model moves)"})
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
