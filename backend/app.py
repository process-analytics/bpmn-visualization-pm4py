import flask
from flask import Flask, request, jsonify
from flask_cors import CORS

import pm4py
from enum import Enum

import subprocess #to execute the layout-generator jar file

class Parameters:
    EVENT_LOG = None
    BPMN_MODEL = None
    PETRI_NET = None
    IM = None #petri net initial marking
    FM = None # Petri net final marking

app = Flask(__name__)
CORS(app)

@app.route("/")
def hello():
    return "Hello, from Flask!"

@app.route('/discover/inductive-miner', methods=["POST"])
def discover_inductive_miner():
    #read xes log
    stream = request.files.getlist('file')[0].read()

    #serialize log, so that we can process it with pm4py
    serialized_log = ('event_log', stream)

    #create pm4py event log object
    Parameters.EVENT_LOG = pm4py.deserialize(serialized_log)

    #discover petri net
    Parameters.PETRI_NET, Parameters.IM, Parameters.FM = pm4py.discover_petri_net_inductive(Parameters.EVENT_LOG)
    
    #convert petri net to bpmn
    Parameters.BPMN_MODEL = pm4py.convert_to_bpmn(Parameters.PETRI_NET, Parameters.IM, Parameters.FM)
    
    #generate the bpmn xml content from the bpmn graph model
    #bpmn-file is a tuple: first element is BPMN, second element is the XML content
    #bpmn_file = pm4py.utils.serialize(Parameters.BPMN_MODEL)

    #generate the layout using layout-generators
    '''
    TO BE FIXED
    '''
    #layout-generators takes a bpmn file, so save the bpmn-file first
    pm4py.write_bpmn(Parameters.BPMN_MODEL, 'result.bpmn')

    #generate layout
    subprocess.call(['java', '-jar', 'bpmn-layout-generator-0.1.4-jar-with-dependencies.jar', '--output=./result-with-layout.bpmn', 'result.bpmn'])
    #get result and send it to frontend
    file = open('result-with-layout.bpmn', 'r')
    bpmn_xml_content = file.read()
    print(bpmn_xml_content)
    
    return flask.Response(response = bpmn_xml_content, status=201, mimetype='text/xml')

@app.route('/conformance/alignment', methods=["GET"])
def compute_alignment():
    if Parameters.EVENT_LOG is not None and Parameters.PETRI_NET is not None:
        aligned_traces = pm4py.conformance_diagnostics_alignments(Parameters.EVENT_LOG, Parameters.PETRI_NET, Parameters.IM, Parameters.FM)
        return flask.jsonify(aligned_traces)
    else:
        return flask.Response(response = "Event log and/or BPMN diagram are missing. \n Re-discover a model and then apply conformance checking", status=404, mimetype='text/xml')
    

if __name__ == "__main__":
    app.run("localhost", 6969)