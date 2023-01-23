import globals from './globals.js';
import { mxgraph } from './mxgraph-initializer';

import { FitType, ShapeBpmnElementKind } from 'bpmn-visualization';
import { frequencyScale, colorLegend } from './colors.js'
import { getBpmnActivityElementbyName } from './utils.js';

export function getBPMNDiagram(formData) {
    console.log('Get bpmn...');
    try{
        fetch('http://localhost:6969/discover/inductive-miner', {
            method: 'POST',
            body: formData
        }).then(response => response.text())
          .then(data => visualizeBPMN(data))
          
    }
    catch(error){
        console.log(error)
    }
}

function visualizeBPMN(data) {
    console.log("BPMN data received!")
    //load
    globals.bpmnVisualization.load(data, {
        fit: { type: FitType.Center }
    });
    globals.bpmnActivityElements = "Hello"

    //update the list of bpmn activities
    globals.bpmnActivityElements = globals.bpmnVisualization.bpmnElementsRegistry.getElementsByKinds(ShapeBpmnElementKind.TASK)
    computeFrequency()
}

function computeFrequency(){
    console.log('Compute frequency stats...');
    try{
        fetch('http://localhost:6969/stats/frequency')
            .then(response => response.json())
            .then(data => visualizeFrequency(data))
    }
    catch(error){
        console.log(error)
    }
}

function visualizeFrequency(data) {
    console.log("Frequency stats received!")
    const values = Object.values(data);
    const max = Math.max(...values);
    const myFrequencyScale = frequencyScale(0, max)
    let mxGraph = globals.bpmnVisualization.graph
    let activityCurrentStyle = null
    let activityNewColor = null
    let activityCell = null
    for (const [activityName, freqValue] of Object.entries(data)) {
        const activityElement = getBpmnActivityElementbyName(activityName)
        //set the frequency color
        //firstChild is the svg rect element of the activity element
        if(activityElement){
            activityCell = mxGraph.getModel().getCell(activityElement.bpmnSemantic.id)
            activityCurrentStyle = mxGraph.getModel().getStyle(activityCell)
            activityNewColor = "fillColor="+myFrequencyScale(freqValue)+";"
            mxGraph.getModel().beginUpdate()
            try {
                
               let style = mxgraph.mxUtils.setStyle(activityCurrentStyle, "fillColor", myFrequencyScale(freqValue))
				mxGraph.getModel().setStyle(activityCell, style);
            } finally {
                mxGraph.getModel().endUpdate();
            }
            //mxModel.setStyle(mxModel.getCell(activityElement.bpmnSemantic.id), "fill", myFrequencyScale(freqValue) )
            //
            //activityElement.htmlElement.firstChild.setAttribute("fill", myFrequencyScale(freqValue))
        }
    }
    //add legend
    colorLegend({
        colorScale: myFrequencyScale,
        title: "Frequency of execution"
    })   
}