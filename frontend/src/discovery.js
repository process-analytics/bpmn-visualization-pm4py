import globals from './globals.js';

import { FitType, mxgraph, ShapeBpmnElementKind } from 'bpmn-visualization';
import { frequencyScale } from './colors.js'
import { getFrequencyOverlay } from './overlays.js';
import { colorLegend, overlayLegend } from './legend.js';
import { apiUrl } from './utils.js';

export function getBPMNDiagram(formData) {
    console.log('Get bpmn...');
    return fetch(`${apiUrl}/discover/inductive-miner`, {
            method: 'POST',
            body: formData
        }).then(response => response.text())
          .then(data => visualizeBPMN(data))
          .catch(error => console.log(error));
}

function visualizeBPMN(data) {
    console.log('BPMN data received!')
    //load
    globals.bpmnVisualization.load(data, {
        fit: { type: FitType.Center }
    });

    //update the list of bpmn activities
    globals.bpmnActivityElements = globals.bpmnVisualization.bpmnElementsRegistry.getElementsByKinds(ShapeBpmnElementKind.TASK);
    computeFrequency();
}

function computeFrequency(){
    console.log('Compute frequency stats...');
    fetch(`${apiUrl}/stats/frequency`)
            .then(response => response.json())
            .then(data => visualizeFrequency(data))
            .catch(error => console.log(error))
}

function visualizeFrequency(data) {
    console.log('Frequency stats received!');

    // Preprocess data to replace the tuples in the form (source_id, target_id) with the edge id
    for (const key of Object.keys(data)) {
        // Check if the key matches the pattern (source_id,target_id)
        const match = key.match(/\('([^']+)'\s*,\s*'([^']+)'\)/);
        if (match) {
            // Extract the source and target ids
            const source_id = match[1];
            const target_id = match[2];
            // Get the edge id
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
    const statistics = values.map(Number); // Convert strings to numbers
    const max = Math.max(...statistics);
    const avg = max/2;
    const myFrequencyScale = frequencyScale(0, max);

    //iterate over the elements (activities and edges) and set their color by calling the frequency color scale function
    for (const [eltId, freqValue] of Object.entries(data)) {
        const freqNum = parseInt(freqValue);
        const bpmnElement = globals.bpmnVisualization.bpmnElementsRegistry.getElementsByIds(eltId)[0];
        
        if(bpmnElement){
            // Update style of activity element
            if (bpmnElement.bpmnSemantic.isShape) {
                let fontColor = 'default';
                if (freqNum > avg) {
                    fontColor = 'white';
                }

                globals.bpmnVisualization.bpmnElementsRegistry.updateStyle(eltId,{
                    fill: {
                        color: myFrequencyScale(freqNum)
                    },
                    font: {
                        color: fontColor
                    }
                });

                //add frequency overlay
                globals.bpmnVisualization.bpmnElementsRegistry.addOverlays(
                    bpmnElement.bpmnSemantic.id,
                    getFrequencyOverlay(freqNum, max, myFrequencyScale(freqNum), 'top-right'));
            }
            // Add overlay on edge
            else {
                globals.bpmnVisualization.bpmnElementsRegistry.addOverlays(
                    bpmnElement.bpmnSemantic.id,
                    getFrequencyOverlay(freqNum, max, myFrequencyScale(freqNum), 'middle'));
            }
        }
        else{
            console.log(`did not find the element of id ${eltId}`)
        }
    }

    //add legend
    colorLegend({
        colorScale: myFrequencyScale,
        title: 'Frequency of execution'
    });

    overlayLegend({rightOverlayLegend : '# executions'});
}

function findEdgeId(source_id, target_id) {
    const edgesIds = globals.bpmnVisualization.bpmnElementsRegistry.getElementsByIds(source_id)[0].bpmnSemantic.outgoingIds;
    for (const edgeId of edgesIds) {
      const targetActivityId = globals.bpmnVisualization.bpmnElementsRegistry.getElementsByIds(edgeId)[0].bpmnSemantic.targetRefId;
        if (targetActivityId === target_id) {
          // Found the edge ID
          return edgeId;
        }
    }
    // Edge not found
    return null;
  }
