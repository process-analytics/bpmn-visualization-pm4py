import flask
from flask import Flask, request, jsonify
from flask_cors import CORS

import pm4py
from pm4py.objects.log.importer.xes import importer as xes_importer
from enum import Enum

import subprocess #to execute the layout-generator jar file

class Parameters:
    EVENT_LOG_DISCOVERY = None
    EVENT_LOG_CONFORMANCE = None
    BPMN_MODEL = None
    PETRI_NET = None
    IM = None
    FM = None

app = Flask(__name__)
CORS(app)


@app.route('/discover/inductive-miner', methods=["POST"])
def discover_inductive_miner():
    #read xes log
    log_stream = request.files.getlist('file')[0].read()
    noise = request.form.get('noise')

    #create pm4py event log object
    Parameters.EVENT_LOG_DISCOVERY = xes_importer.deserialize(log_stream)

    #discover petri net
    Parameters.PETRI_NET, Parameters.IM, Parameters.FM = pm4py.discover_petri_net_inductive(Parameters.EVENT_LOG_DISCOVERY, noise_threshold=float(noise))

    #convert petri net to bpmn
    Parameters.BPMN_MODEL = pm4py.convert_to_bpmn(Parameters.PETRI_NET, Parameters.IM, Parameters.FM)

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

    #alignment can be only on done on Petri nets
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
def compute_activity_frequency():
    log_df = pm4py.convert_to_dataframe(Parameters.EVENT_LOG_DISCOVERY)
    activity_freq_df = log_df['concept:name'].value_counts()
    return flask.jsonify(activity_freq_df.to_dict())


if __name__ == "__main__":
    app.run("localhost", 6969)