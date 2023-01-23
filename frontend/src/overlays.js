export function getDeviationOverlay(label, color){
    return {
        position: 'top-right',
        label: `${label}`,
        style: {
          font: { color: 'black', size: 20 },
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