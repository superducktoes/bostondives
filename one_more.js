// Retrieve URL parameters
const urlParams = new URLSearchParams(window.location.search);

// Get the value of the 'name' parameter and display it
const nameValue = urlParams.get('name');
document.getElementById('name').textContent = nameValue;

// Get the value of the 'mbta_stop' parameter and display it
const mbtaStopValue = urlParams.get('mbta_stop');
document.getElementById('mbta_stop').textContent = mbtaStopValue;
