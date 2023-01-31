export function convertToCSV(formData){
    fetch('http://localhost:6969/conversion/xes-to-csv', {
        method: 'POST',
        body: formData
    }).then(response => response.json())
        .then(data => visualizeCSV(data))
        .catch(error => console.log(error))
}

function visualizeCSV(data){
    console.log(data)
    // Get a reference to the table
    let table = document.getElementById("xes-log-table");
    table.innerHTML = data
}