
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

function calculateTimeDifference(departureTime, mbtaDistance) {
    const dateObject = new Date(departureTime);
    const currentTime = new Date();
    let message;

    // calculate the time difference in minutes
    const timeDifference = Math.round((dateObject - currentTime) / (1000 * 60));
    console.log(timeDifference);

    if (timeDifference == mbtaDistance) {
        message = "Just enough time. Run!"
    } else if (timeDifference > mbtaDistance) {
        let updatedTime = timeDifference - mbtaDistance;
        message = `You have about ${updatedTime} minutes until you have to leave`
    } else {
        message = "Probably best to wait for the next one at this point."
    }

    return message;
}

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
    const departuresResponse = await fetch(`https://api-v3.mbta.com/predictions?filter[stop]=${mbtaStop}&filter[route_type]=${railType}&page[limit]=6&sort=departure_time`);
    const departuresData = await departuresResponse.json();
    const departures = departuresData.data;
    console.log(departures);
    
    let formattedDepartures = [];

    // Process each departure
    for (const departure of departures) {
        const departureTime = convertTime(departure.attributes.departure_time);

        // Call MBTA API to get additional trip details
        const tripDetails = await fetchTripDetails(departure.relationships.trip.data.id);
        const headsign = tripDetails.data.attributes.headsign;

        // Perform your desired actions with the retrieved data
        let formattedDeparture = `${departureTime} towards ${headsign}, ${calculateTimeDifference(departure.attributes.departure_time, mbtaDistance)}`;
        formattedDepartures.push(formattedDeparture);
    }

    console.log(formattedDepartures)
    let departureString = formattedDepartures.join('<br>');
    console.log(departureString);


    document.getElementById("resolved_mbta_stop").textContent = stationName;
    if(line == "red") {
        document.getElementById("red_line_departures").innerHTML = departureString;
        document.getElementById("red_line_departures").style.color = "#DA291C"
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
        processDepartures(returnLineType(stationLines[i]), mbtaStop, stationLines[i]);
    }
}




// figure out what line or lines the bar is on
// get the station name
// get the next 3 departures from that station
// repeat for any other lines

