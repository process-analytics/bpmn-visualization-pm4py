import flask
from flask import Flask, request
from flask_cors import CORS

import pm4py
from pm4py.objects.log.importer.xes import importer as xes_importer
from pm4py.objects.conversion.bpmn.variants.to_petri_net import Parameters as PARAMS_CONVERTER, apply as petri_net_converter
from pm4py.visualization.petri_net.variants import token_decoration_frequency
from pm4py.visualization.petri_net import visualizer as petri_net_visualizer
import re
import subprocess #to execute the layout-generator jar file

class Parameters:
    EVENT_LOG_DISCOVERY = None
    EVENT_LOG_CONFORMANCE = None
    BPMN_MODEL = None
    PETRI_NET = None
    IM = None
    FM = None
    #store the mapping between bpmn and petrinet
    #will be used to be able to compute statistics related to edges and gateways
    FLOW_PLACE = {}
    TRANS_MAP = {}

app = Flask(__name__)
CORS(app)


@app.route('/discover/inductive-miner', methods=["POST"])
def discover_inductive_miner():
    #read xes log
    log_stream = request.files.getlist('file')[0].read()
    noise = request.form.get('noise')

    #create pm4py event log object
    Parameters.EVENT_LOG_DISCOVERY = xes_importer.deserialize(log_stream)

    #discover bpmn
    Parameters.BPMN_MODEL = pm4py.discover_bpmn_inductive(Parameters.EVENT_LOG_DISCOVERY, noise_threshold=float(noise))

    #convert bpmn to petri net to be able to replay log and compute later frequency and conformance data
    #use the new fix by pm4py to return the mapping between bpmn and petri net
    Parameters.PETRI_NET, Parameters.IM, Parameters.FM, Parameters.FLOW_PLACE, Parameters.TRANS_MAP = petri_net_converter(Parameters.BPMN_MODEL, {PARAMS_CONVERTER.RETURN_FLOW_TRANS_MAP.value: True})

    #generate the layout using layout-generators
    '''
    TO BE IMPROVED in future iterations
    '''
    #layout-generators takes a bpmn file, so save the bpmn-file first
    pm4py.write_bpmn(Parameters.BPMN_MODEL, 'result.bpmn')
    #generate layout
    subprocess.call(['java', '-jar', 'bpmn-layout-generator-0.1.4-jar-with-dependencies.jar', '--output=./result-with-layout.bpmn', 'result.bpmn'])
    
    #get result and send it
    file = open('result-with-layout.bpmn', 'r')
    bpmn_xml_content = file.read()
    
    return flask.Response(response = bpmn_xml_content, status=201, mimetype='text/xml')


@app.route('/conformance/alignment', methods=["POST"])
def compute_alignment():
    #read xes log
    log_stream = request.files.getlist('file')[0].read()

    #create pm4py event log object
    Parameters.EVENT_LOG_CONFORMANCE = xes_importer.deserialize(log_stream)

    #alignment can be only done on Petri nets
    if Parameters.PETRI_NET is not None:
        aligned_traces = pm4py.conformance_diagnostics_alignments(Parameters.EVENT_LOG_CONFORMANCE, Parameters.PETRI_NET, Parameters.IM, Parameters.FM)
        return flask.jsonify(aligned_traces)
    else:
        return flask.Response(response = "BPMN diagram is missing. \n Discover a model and then apply conformance checking", status=404, mimetype='text/xml')

@app.route('/conversion/xes-to-csv', methods=["POST"])
def xes_to_csv():
    log_stream = request.files.getlist('file')[0].read()

    #create pm4py event log object
    Parameters.EVENT_LOG_DISCOVERY = xes_importer.deserialize(log_stream)
    log_dataframe = pm4py.convert_to_dataframe(Parameters.EVENT_LOG_DISCOVERY)
    return flask.jsonify(log_dataframe.to_html())


@app.route('/stats/frequency', methods=["GET"])    
def compute_frequency():
    elements_frequency = {}
    # Compute frequency information on petri net
    frequency_decorations = token_decoration_frequency.get_decorations(Parameters.EVENT_LOG_DISCOVERY, Parameters.PETRI_NET, Parameters.IM, Parameters.FM, measure = 'frequency')

    # Add frequency of activities
    # Value is a list of pm4py Transition
    for value in Parameters.TRANS_MAP.values():
        if value[0].label is not None: # Test that it corresponds to a BPMN activity and not an event or a gateway (which are represented as silent transitions in petri_net)
            bpmn_activity_id = value[0].name
            activity_frequency = extract_activity_statistics_from_decorations(bpmn_activity_id, frequency_decorations)
            elements_frequency[bpmn_activity_id] = activity_frequency
    
    # Add frequency of edges
    # key is of type pm4py BPMN Flow, value is of type pm4py Place
    for key, value in Parameters.FLOW_PLACE.items():
        bpmn_source_id = key.get_source().get_id()
        bpmn_target_id = key.get_target().get_id()
        place_id = value.name
        edge_frequency = extract_edge_statistics_from_decorations(place_id, frequency_decorations)
        elements_frequency[(bpmn_source_id, bpmn_target_id)] = edge_frequency
    
    print(elements_frequency)
    # Convert key that are tuples to string
    result = {str(k): v for k, v in elements_frequency.items()}
    return flask.jsonify(result)

# key of decorations is of type pm4py Transition or Arc, value is a dict
def extract_activity_statistics_from_decorations(activity_id, decorations):
    for key, value in decorations.items():
        if type(key) is pm4py.objects.petri_net.obj.PetriNet.Transition:
            if key.name == activity_id:
                # Extract statistics from value and return it
                # Value is a dictionary: 'label': activity_name (statistics), 'color':color
                return re.findall(r'\((\d+)\)', value['label'])[0]    
                
    print('key for activity {} not found'.format(activity_id))
    return None

# An edge in BPMN corresponds to a place in petri_net
# key of decorations is of type pm4py Transition or Arc, value is a dict
def extract_edge_statistics_from_decorations(place_id, decorations):
    for key, value in decorations.items():
        if type(key) is pm4py.objects.petri_net.obj.PetriNet.Arc:
            if key.source.name == place_id or key.target.name == place_id:
                # Extract statistics from value and return it
                # Value is a dictionary: 'label': statistics, 'penwidth':width
                return value['label']    
                
    print('key for place {} not found'.format(place_id))
    return None

if __name__ == "__main__":
    app.run("localhost", 6969)