export function getDeviationOverlay(label, violationValue, color){
    let fontColor = "none"
    if(violationValue > 0.5){
        fontColor = "white"
    }
    else{
        fontColor = "black"
    }
    return {
        position: 'top-right',
        label: `${label}`,
        style: {
        font: { color: fontColor, size: 20 },
        fill: { color: color, opacity: 50},
        stroke: { color: 'transparent', width: 0}
        }
    }
}

export function getSynchronousOverlay(label){
    return {
        position: 'top-left',
        label: label + '✅',
        style: {
          font: { color: 'black', size: 20 },
          fill: { color: 'white'},
          stroke: { color: 'transparent', width: 0}
        }
    }
}