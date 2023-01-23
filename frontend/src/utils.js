import globals from "./globals";

export function getBpmnActivityElementbyName(activityName){
    if(globals.bpmnActivityElements){
        return globals.bpmnActivityElements.find((elt) => elt.bpmnSemantic.name === activityName);
    }
    return null
}