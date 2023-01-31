export function getDeviationOverlay(violationLabel, violationRatio, color){
    let fontColor = "none"
    if(violationRatio > 0.5){
        fontColor = "white"
    }
    else{
        fontColor = "black"
    }
    return {
        position: 'top-right',
        label: `${violationLabel}`,
        style: {
        font: { color: fontColor, size: 20 },
        fill: { color: color},
        stroke: { color: 'transparent', width: 0}
        }
    }
}

export function getSynchronousOverlay(label){
    return {
        position: 'top-left',
        label: `${label}`,
        style: {
          font: { color: 'white', size: 20},
          fill: { color: '#009E73'},
          stroke: { color: 'transparent', width: 0}
        }
    }
}

export function getFrequencyOverlay(freqValue, freqMax, color){
    let fontColor = "none"
    if(freqValue > freqMax / 2){
        fontColor = "white"
    }
    else{
        fontColor = "black"
    }
    return {
        position: 'top-right',
        label: `${freqValue}`,
        style: {
        font: { color: fontColor, size: 20 },
        fill: { color: color},
        stroke: { color: 'transparent', width: 0}
        }
    }
}