import { getBPMNDiagram } from './discovery.js';
import { getAlignment } from './conformance.js';
import { convertToCSV } from './conversion.js';
import './styles.css';

const fileUpload = document.getElementById("xes-file-discovery")
fileUpload.addEventListener("change", function(e){
    document.getElementById('show-xes-log').classList.remove('d-invisible');
})

//modal interaction
const modalElt =  document.getElementById('event-log-modal')
document.getElementById('close-modal').onclick = () => {
    modalElt.classList.remove('active');
};
document.getElementsByClassName('modal-overlay').item(0).onclick = () => {
    modalElt.classList.remove('active');
};

const showEventLogButton = document.getElementById("show-xes-log")
showEventLogButton.addEventListener("click", function(e){
    let file = fileUpload.files[0]
    let formData = new FormData()
    formData.append('file', file)
    convertToCSV(formData)
    modalElt.classList.add('active');
})

const discoverBpmnButton = document.getElementById("discover-bpmn")
discoverBpmnButton.addEventListener("click", function(e){
    let file = fileUpload.files[0]
    let noiseThreshold = document.getElementById("noise-threshold").value
    let formData = new FormData()
    formData.append('file', file)
    formData.append('noise', noiseThreshold)
    getBPMNDiagram(formData)
})


const conformanceButton = document.getElementById("compute-conformance")
conformanceButton.addEventListener('click', function(e){
    let file = document.getElementById("xes-file-conformance").files[0]
    let formData = new FormData()
    formData.append('file', file)
    getAlignment(formData)
})