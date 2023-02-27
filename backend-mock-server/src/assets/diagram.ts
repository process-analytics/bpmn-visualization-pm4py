// TODO load assets from diagram.bpmn
import diagramContent from './diagram.bpmn!text';

// not working
// console.info('diagram content from file', diagramContent);
// export const diagram = diagramContent;

export const diagram = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_0x0opj6" targetNamespace="http://example.bpmn.com/schema/bpmn">
  <bpmn:process id="Process_1" isExecutable="false">
    <bpmn:startEvent id="StartEvent_1" name="Invoice received">
      <bpmn:outgoing>Flow_1</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:sequenceFlow id="Flow_1" sourceRef="StartEvent_1" targetRef="Activity_1" />
    <bpmn:task id="Activity_1" name="Assign Approver">
      <bpmn:incoming>Flow_1</bpmn:incoming>
      <bpmn:outgoing>Flow_1w8ldp8</bpmn:outgoing>
    </bpmn:task>
    <bpmn:task id="Activity_1omool6" name="Approve Invoice">
      <bpmn:incoming>Flow_1w8ldp8</bpmn:incoming>
      <bpmn:incoming>Flow_09havhs</bpmn:incoming>
      <bpmn:outgoing>Flow_1pl5mvt</bpmn:outgoing>
    </bpmn:task>
    <bpmn:sequenceFlow id="Flow_1w8ldp8" sourceRef="Activity_1" targetRef="Activity_1omool6" />
    <bpmn:exclusiveGateway id="Gateway_0clqstl" name="Invoice approved?">
      <bpmn:incoming>Flow_1pl5mvt</bpmn:incoming>
      <bpmn:outgoing>Flow_0odkkje</bpmn:outgoing>
      <bpmn:outgoing>Flow_1x81xda</bpmn:outgoing>
    </bpmn:exclusiveGateway>
    <bpmn:sequenceFlow id="Flow_1pl5mvt" sourceRef="Activity_1omool6" targetRef="Gateway_0clqstl" />
    <bpmn:task id="Activity_1pkoaqu" name="Clarify Invoice">
      <bpmn:incoming>Flow_0odkkje</bpmn:incoming>
      <bpmn:outgoing>Flow_0a65aek</bpmn:outgoing>
    </bpmn:task>
    <bpmn:sequenceFlow id="Flow_0odkkje" name="no" sourceRef="Gateway_0clqstl" targetRef="Activity_1pkoaqu" />
    <bpmn:task id="Activity_1gv7jjb" name="Prepare Bank Transfer">
      <bpmn:incoming>Flow_1x81xda</bpmn:incoming>
      <bpmn:outgoing>Flow_0ba5hf8</bpmn:outgoing>
    </bpmn:task>
    <bpmn:sequenceFlow id="Flow_1x81xda" name="yes" sourceRef="Gateway_0clqstl" targetRef="Activity_1gv7jjb" />
    <bpmn:task id="Activity_11n0ixn" name="Archive Invoice">
      <bpmn:incoming>Flow_0ba5hf8</bpmn:incoming>
      <bpmn:outgoing>Flow_0hy3hcb</bpmn:outgoing>
    </bpmn:task>
    <bpmn:sequenceFlow id="Flow_0ba5hf8" sourceRef="Activity_1gv7jjb" targetRef="Activity_11n0ixn" />
    <bpmn:sequenceFlow id="Flow_0hy3hcb" sourceRef="Activity_11n0ixn" targetRef="Event_1plekh0" />
    <bpmn:endEvent id="Event_1plekh0" name="Invoice processed">
      <bpmn:incoming>Flow_0hy3hcb</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:exclusiveGateway id="Gateway_1dbyvzn" name="Review successful?">
      <bpmn:incoming>Flow_0a65aek</bpmn:incoming>
      <bpmn:outgoing>Flow_0ut6ewb</bpmn:outgoing>
      <bpmn:outgoing>Flow_09havhs</bpmn:outgoing>
    </bpmn:exclusiveGateway>
    <bpmn:sequenceFlow id="Flow_0a65aek" sourceRef="Activity_1pkoaqu" targetRef="Gateway_1dbyvzn" />
    <bpmn:endEvent id="Event_0jtoai0" name="Invoice not process">
      <bpmn:incoming>Flow_0ut6ewb</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="Flow_0ut6ewb" name="no" sourceRef="Gateway_1dbyvzn" targetRef="Event_0jtoai0" />
    <bpmn:sequenceFlow id="Flow_09havhs" name="yes" sourceRef="Gateway_1dbyvzn" targetRef="Activity_1omool6" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="BPMNShape_StartEvent_1" bpmnElement="StartEvent_1">
        <dc:Bounds x="232" y="81" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="210" y="133" width="80" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="BPMNShape_Activity_1" bpmnElement="Activity_1">
        <dc:Bounds x="330" y="59" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_06zea2d_di" bpmnElement="Activity_1omool6">
        <dc:Bounds x="530" y="59" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Gateway_0clqstl_di" bpmnElement="Gateway_0clqstl" isMarkerVisible="true">
        <dc:Bounds x="735" y="74" width="50" height="50" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="715" y="131" width="90" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_1pkoaqu_di" bpmnElement="Activity_1pkoaqu">
        <dc:Bounds x="890" y="-70" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_1gv7jjb_di" bpmnElement="Activity_1gv7jjb">
        <dc:Bounds x="890" y="59" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_11n0ixn_di" bpmnElement="Activity_11n0ixn">
        <dc:Bounds x="1100" y="59" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Gateway_1dbyvzn_di" bpmnElement="Gateway_1dbyvzn" isMarkerVisible="true">
        <dc:Bounds x="1125" y="-55" width="50" height="50" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="1121" y="2" width="58" height="27" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_0jtoai0_di" bpmnElement="Event_0jtoai0">
        <dc:Bounds x="1282" y="-48" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="1273" y="-5" width="54" height="27" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_1plekh0_di" bpmnElement="Event_1plekh0">
        <dc:Bounds x="1282" y="81" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="1256" y="124" width="89" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="BPMNEdge_Flow_1" bpmnElement="Flow_1">
        <di:waypoint x="268" y="99" />
        <di:waypoint x="330" y="99" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="255" y="63" width="56" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1w8ldp8_di" bpmnElement="Flow_1w8ldp8">
        <di:waypoint x="430" y="99" />
        <di:waypoint x="530" y="99" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="452" y="81" width="56" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1pl5mvt_di" bpmnElement="Flow_1pl5mvt">
        <di:waypoint x="630" y="99" />
        <di:waypoint x="735" y="99" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0odkkje_di" bpmnElement="Flow_0odkkje">
        <di:waypoint x="760" y="74" />
        <di:waypoint x="760" y="-30" />
        <di:waypoint x="890" y="-30" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="769" y="53" width="13" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1x81xda_di" bpmnElement="Flow_1x81xda">
        <di:waypoint x="785" y="99" />
        <di:waypoint x="890" y="99" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="791" y="103" width="18" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0ba5hf8_di" bpmnElement="Flow_0ba5hf8">
        <di:waypoint x="990" y="99" />
        <di:waypoint x="1100" y="99" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0hy3hcb_di" bpmnElement="Flow_0hy3hcb">
        <di:waypoint x="1200" y="99" />
        <di:waypoint x="1282" y="99" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0a65aek_di" bpmnElement="Flow_0a65aek">
        <di:waypoint x="990" y="-30" />
        <di:waypoint x="1125" y="-30" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0ut6ewb_di" bpmnElement="Flow_0ut6ewb">
        <di:waypoint x="1175" y="-30" />
        <di:waypoint x="1282" y="-30" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="1183" y="-17" width="13" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_09havhs_di" bpmnElement="Flow_09havhs">
        <di:waypoint x="1150" y="-55" />
        <di:waypoint x="1150" y="-140" />
        <di:waypoint x="580" y="-140" />
        <di:waypoint x="580" y="59" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="1161" y="-77" width="18" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>
`;
