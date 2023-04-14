import globals from './globals.js';

import { FitType, mxgraph, ShapeBpmnElementKind } from 'bpmn-visualization';
import { frequencyScale } from './colors.js'
import { getFrequencyOverlay } from './overlays.js';
import { colorLegend, overlayLegend } from './legend.js';
import { apiUrl, getBpmnActivityElementbyName } from './utils.js';

export function getBPMNDiagram(formData) {
    console.log('Get bpmn...');
    return fetch(`${apiUrl}/discover/inductive-miner`, {
            method: 'POST',
            body: formData
        }).then(response => response.text())
          .then(data => visualizeBPMN(data))
          .catch(error => console.log(error))
}

function visualizeBPMN(data) {
    console.log("BPMN data received!")
    //load
    globals.bpmnVisualization.load(data, {
        fit: { type: FitType.Center }
    });

    //update the list of bpmn activities
    globals.bpmnActivityElements = globals.bpmnVisualization.bpmnElementsRegistry.getElementsByKinds(ShapeBpmnElementKind.TASK)
    computeFrequency()
}

function computeFrequency(){
    console.log('Compute frequency stats...');
    fetch(`${apiUrl}/stats/frequency`)
            .then(response => response.json())
            .then(data => visualizeFrequency(data))
            .catch(error => console.log(error))
}

function visualizeFrequency(data) {
    console.log("Frequency stats received!")

    // Preprocess data to replace the tuples in the form (source_id, target_id) with the edge id
    for (const key of Object.keys(data)) {
        // Check if the key matches the pattern (source_id,target_id)
        if (Array.isArray(key) && key.length === 2) {
            // Get the edge id
            const [source_id, target_id] = key;
            const edge_id = findEdgeId(source_id, target_id);
            if (edge_id !== null) {
                console.log(`Found edge ${edge_id} connecting activities ${source_id} and ${target_id}`);
                const value = data[key];
                data[edge_id] = value; // Create a new key with the same value
                delete data[key]; // Delete the original key
            } else {
                console.log(`No edge found connecting activities ${source_id} and ${target_id}`);
            }
        }
    }
    //set the frequency color scale
    const values = Object.values(data);
    const max = Math.max(...values);
    const avg = max/2;
    const myFrequencyScale = frequencyScale(0, max)

    //change activity style through mxGraph
    let graph = globals.bpmnVisualization.graph

    try {
        //iterate over the activities and set their color by calling the frequency color scale function
        for (const [activityName, freqValue] of Object.entries(data)) {
            const activityElement = getBpmnActivityElementbyName(activityName)
            if (activityElement) {
                const activityCell = graph.getModel().getCell(activityElement.bpmnSemantic.id)
                let style = graph.getModel().getStyle(activityCell);
                style = mxgraph.mxUtils.setStyle(style, mxgraph.mxConstants.STYLE_FILLCOLOR, myFrequencyScale(freqValue))

                if (freqValue > avg) {
                    style = mxgraph.mxUtils.setStyle(style, mxgraph.mxConstants.STYLE_FONTCOLOR, 'white')
                }
                graph.getModel().setStyle(activityCell, style);

                //add frequency overlay
                globals.bpmnVisualization.bpmnElementsRegistry.addOverlays(
                  activityElement.bpmnSemantic.id,
                  getFrequencyOverlay(freqValue, max, myFrequencyScale(freqValue)))
            }
        }
        // Allow to save the style in a new state, in particular keep the rounded activity
        graph.refresh();
    } finally {
        graph.getModel().endUpdate();
    }

    //add legend
    colorLegend({
        colorScale: myFrequencyScale,
        title: "Frequency of execution"
    })

    overlayLegend({rightOverlayLegend : "# executions"})
}

function findEdgeId(source_id, target_id) {
    const edgesIds = globals.bpmnVisualization.bpmnElementsRegistry.getElementsByIds(source_id)[0].bpmnSemantic.outgoingIds;
    for (const edgeId of edgesIds) {
      const outgoingActivitiesIds = globals.bpmnVisualization.bpmnActivityElements.getElementsByIds(edgeId)[0].bpmnSemantic.outgoingIds;
      for (const outgoingActivityId of outgoingActivitiesIds) {
        if (outgoingActivityId === target_id) {
          // Found the edge ID
          return edgeId;
        }
      }
    }
    // Edge not found
    return null;
  }
