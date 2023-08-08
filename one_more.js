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

function calculateTimeDifference(departureTime, mbtaDistance) {
    const dateObject = new Date(departureTime);
    const currentTime = new Date();
    let message;

    // calculate the time difference in minutes
    const timeDifference = Math.round((dateObject - currentTime) / (1000 * 60));

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
    let lineType = 1

    // may need additional checks for commuter and buses
    if(line == "Green") {
        lineType = 0
    }

    return lineType;
}

function convertTime(departureTime) {
    const dateObject = new Date(departureTime);
    const timeString = dateObject.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return timeString;
}

// get individual trip details
async function fetchTripDetails(id) {
    const apiUrl = `https://api-v3.mbta.com/trips/${id}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
}

// get information about a station and the next 6 predicted departures
async function processDepartures(railType, mbtaStop, line) {
    // call mbta api to get the station name
    const stationNameResponse = await fetch(`https://api-v3.mbta.com/stops/${mbtaStop}`);
    const stationNameData = await stationNameResponse.json();
    const stationName = stationNameData.data.attributes.name;
    let departuresResponse;

    // call mbta api to get the next 3 departures for each direction
    // green ling gets handled differently since it's light rail
    if(line != "Green") {
        departuresResponse = await fetch(`https://api-v3.mbta.com/predictions?filter[stop]=${mbtaStop}&filter[route_type]=${railType}&page[limit]=6&sort=departure_time&filter[route]=${line}`);
    } else {
        departuresResponse = await fetch(`https://api-v3.mbta.com/predictions?filter[stop]=${mbtaStop}&filter[route_type]=${railType}&page[limit]=6&sort=departure_time`);
    }

    const departuresData = await departuresResponse.json();
    const departures = departuresData.data;
    
    let formattedDepartures = [];

    // process each departure
    for (const departure of departures) {
        const departureTime = convertTime(departure.attributes.departure_time);

        // get the additional detials so we know where the trains are headed
        const tripDetails = await fetchTripDetails(departure.relationships.trip.data.id);
        const headsign = tripDetails.data.attributes.headsign;

        // format the data to display
        let formattedDeparture = `${departureTime} towards ${headsign}, ${calculateTimeDifference(departure.attributes.departure_time, mbtaDistance)}`;
        formattedDepartures.push(formattedDeparture);
    }

    let departureString = formattedDepartures.join('<br>');


    document.getElementById("resolved_mbta_stop").textContent = stationName;
    
    // could probably add one last check to this to see if there isn't a train to one of the ends and call that out
    if(line == "Red") {
        document.getElementById("red_line_departures").innerHTML = departureString;
        document.getElementById("red_line_departures").style.color = "#DA291C"
    } else if(line == "Green") {
        document.getElementById("green_line_departures").innerHTML = departureString;
        document.getElementById("green_line_departures").style.color = "#00843D"
    } else if(line == "Orange") {
        document.getElementById("orange_line_departures").innerHTML = departureString;
        document.getElementById("orange_line_departures").style.color = "#ED8B00"
    } else if(line == "Blue") {
        document.getElementById("blue_line_departures").innerHTML = departureString;
        document.getElementById("blue_line_departures").style.color = "#ED8B00"
    }
}

/*for(let i = 0; i < stationLines.length; i++) {
    if(stationLines[i] == "Red") {
        processDepartures(returnLineType(stationLines[i]), mbtaStop, stationLines[i]);
    } else if(stationLines[i] == "Green") {
        processDepartures(returnLineType(stationLines[i]), mbtaStop, stationLines[i]);
    } else if(stationLines[i] == "Orange") {
        processDepartures(returnLineType(stationLines[i]), mbtaStop, stationLines[i]);
    } else if(stationLines[i] == "Blue") {
        processDepartures(returnLineType(stationLines[i]), mbtaStop, stationLines[i]);
    } 
}*/

for(let i = 0; i < stationLines.length; i++) {
    processDepartures(returnLineType(stationLines[i]), mbtaStop, stationLines[i]);
}