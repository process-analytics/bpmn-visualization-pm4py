import globals from "./globals";

export function getBpmnActivityElementbyName(activityName){
    if(globals.bpmnActivityElements){
        return globals.bpmnActivityElements.find((elt) => elt.bpmnSemantic.name === activityName);
    }
    return null
}

// for both backend and backend-mock-server
export const apiUrl = 'http://localhost:6969';

// Linear mapping function to return an edge width based on the frequency
export function mapFrequencyToWidth(frequency, minFrequency, maxFrequency, minWidth, maxWidth) {
    const range = maxFrequency - minFrequency;
    const fraction = (frequency - minFrequency) / range;
    const widthRange = maxWidth - minWidth;
    return minWidth + (fraction * widthRange);
}
