
// retrieve url parameters
const urlParams = new URLSearchParams(window.location.search);

// get the name of the bar
const barName = urlParams.get("barName");

// get the station id from the locations json
const mbtaStop = urlParams.get("mbta_stop");

// walkaing distance to the stop
const mbtaDistance = urlParams.get("mbta_distance");

// need to know which line so we know if it's north/south or east/west
const mbtaLine = urlParams.get("mbta_line");
let stationLines = mbtaLine.split(',');

document.getElementById('barName').textContent = barName;
document.getElementById("mbta_distance").textContent = mbtaDistance;
console.log(mbtaStop);
console.log(mbtaLine)
console.log(stationLines);

function returnLineType(line) {
    let lineType = 0

    // may need additional checks for commuter and buses
    if(lineType != "green") {
        lineType = 1
    }

    return lineType;
}

function convertTime(departureTime) {
    const dateObject = new Date(departureTime);
    const timeString = dateObject.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return timeString;
}

// Define a function to fetch trip details
async function fetchTripDetails(id) {
    const apiUrl = `https://api-v3.mbta.com/trips/${id}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
}

// Define a function to process departures for a given line
async function processDepartures(railType, mbtaStop, line) {
    // Call MBTA API to get the station name
    const stationNameResponse = await fetch(`https://api-v3.mbta.com/stops/${mbtaStop}`);
    const stationNameData = await stationNameResponse.json();
    const stationName = stationNameData.data.attributes.name;
    console.log(stationName);
    console.log(railType);

    // Call MBTA API to get the next 3 departures for each direction
    const departuresResponse = await fetch(`https://api-v3.mbta.com/predictions?filter[stop]=${mbtaStop}&filter[route_type]=1&page[limit]=3&sort=departure_time`);
    const departuresData = await departuresResponse.json();
    const departures = departuresData.data;
    console.log(departures);

    // Process each departure
    for (const departure of departures) {
        const departureTime = convertTime(departure.attributes.departure_time);

        // Call MBTA API to get additional trip details
        const tripDetails = await fetchTripDetails(departure.relationships.trip.data.id);
        const headsign = tripDetails.data.attributes.headsign;

        // Perform your desired actions with the retrieved data
        console.log(`Line: ${line}, Station: ${stationName}, Departure Time: ${departureTime}, Headsign: ${headsign}`);
    }
}

for(let i = 0; i < stationLines.length; i++) {
    if(stationLines[i] == "red") {
        console.log("red");
        // get the station name
        // call mbta api to get the next 3 departures for each direction
        // for each of those three departures call the mbta api to get additional trip details to display.
        processDepartures(returnLineType(stationLines[i]), mbtaStop, stationLines[i]);
    } else if(stationLines[i] == "green") {
        console.log("green")
        // get the station name
        // call mbta api to get the next 3 departures for each direction
        // for each of those three departures call the mbta api to get additional trip details to display.
        processDepartures(returnLineType(stationlined[i]), mbtaStop, stationLines[i]);
    }
}




// figure out what line or lines the bar is on
// get the station name
// get the next 3 departures from that station
// repeat for any other lines

