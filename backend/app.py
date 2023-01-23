import flask
from flask import Flask, request, jsonify
from flask_cors import CORS

import pm4py
from enum import Enum

import subprocess #to execute the layout-generator jar file

class Parameters:
    EVENT_LOG_DISCOVERY = None
    EVENT_LOG_CONFORMANCE = None
    BPMN_MODEL = None
    PROCESS_TREE = None
    PETRI_NET = None
    IM = None
    FM = None

app = Flask(__name__)
CORS(app)

@app.route("/")
def hello():
    return "Hello, from Flask!"

@app.route('/discover/inductive-miner', methods=["POST"])
def discover_inductive_miner():
    #read xes log
    log_stream = request.files.getlist('file')[0].read()
    noise = request.form.get('noise')

    #serialize log, so that we can process it with pm4py
    serialized_log = ('event_log', log_stream)

    #create pm4py event log object
    Parameters.EVENT_LOG_DISCOVERY = pm4py.deserialize(serialized_log)

    #discover petri net
    Parameters.PETRI_NET, Parameters.IM, Parameters.FM = pm4py.discover_petri_net_inductive(Parameters.EVENT_LOG_DISCOVERY, noise_threshold=float(noise))

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
    
    return flask.Response(response = bpmn_xml_content, status=201, mimetype='text/xml')


@app.route('/conformance/alignment', methods=["POST"])
def compute_alignment():
    #read xes log
    log_stream = request.files.getlist('file')[0].read()

    #serialize log, so that we can process it with pm4py
    serialized_log = ('event_log', log_stream)

    #create pm4py event log object
    Parameters.EVENT_LOG_CONFORMANCE = pm4py.deserialize(serialized_log)
    if Parameters.PETRI_NET is not None:
        aligned_traces = pm4py.conformance_diagnostics_alignments(Parameters.EVENT_LOG_CONFORMANCE, Parameters.PETRI_NET, Parameters.IM, Parameters.FM)
        #print(aligned_traces)
        return flask.jsonify(aligned_traces)
    else:
        return flask.Response(response = "BPMN diagram is missing. \n Discover a model and then apply conformance checking", status=404, mimetype='text/xml')

@app.route('/conversion/xes-to-csv', methods=["POST"])
def xes_to_csv():
    log_stream = request.files.getlist('file')[0].read()

    #serialize log, so that we can process it with pm4py
    serialized_log = ('event_log', log_stream)

    #create pm4py event log object
    Parameters.EVENT_LOG_DISCOVERY = pm4py.deserialize(serialized_log)
    log_df = pm4py.convert_to_dataframe(Parameters.EVENT_LOG_DISCOVERY)
    return flask.jsonify(log_df.to_html())



@app.route('/stats/frequency', methods=["GET"])    
def compute_activity_frequency():
    log_df = pm4py.convert_to_dataframe(Parameters.EVENT_LOG_DISCOVERY)
    activity_freq_df = log_df['concept:name'].value_counts()
    return flask.jsonify(activity_freq_df.to_dict())



if __name__ == "__main__":
    app.run("localhost", 6969)