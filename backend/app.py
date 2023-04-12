import flask
from flask import Flask, request, jsonify
from flask_cors import CORS

import pm4py
from pm4py.objects.log.importer.xes import importer as xes_importer
from pm4py.objects.conversion.bpmn.variants.to_petri_net import Parameters as PARAMS_CONVERTER, apply as petri_net_converter
from pm4py.visualization.petri_net import visualizer as petri_net_visualizer

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

    #convert bpmn to petri net to be able to replay log and compute frequency and conformance data
    #use the new fix by pm4py to return the mapping between bpmn and petri net
    parameters = {
        PARAMS_CONVERTER.RETURN_FLOW_TRANS_MAP.value: True,
        PARAMS_CONVERTER.ENABLE_REDUCTION.value: True
    }
    Parameters.PETRI_NET, Parameters.IM, Parameters.FM, Parameters.FLOW_PLACE, Parameters.TRANS_MAP = petri_net_converter(Parameters.BPMN_MODEL, parameters)

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