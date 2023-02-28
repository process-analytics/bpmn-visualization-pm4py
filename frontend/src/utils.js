import globals from "./globals";

export function getBpmnActivityElementbyName(activityName){
    if(globals.bpmnActivityElements){
        return globals.bpmnActivityElements.find((elt) => elt.bpmnSemantic.name === activityName);
    }
    return null
}

// for both backend and backend-mock-server
export const apiUrl = 'http://localhost:6969';
