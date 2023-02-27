import {BpmnVisualization} from 'bpmn-visualization';

export default{
    bpmnVisualization : new BpmnVisualization({
        container: 'bpmn-container',
        navigation: { enabled: true },
      }),
      bpmnActivityElements : null //updated each time a new BPMN is discovered
}
