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

async function getTripDetails(id) {
    const apiUrl = `https://api-v3.mbta.com/trips/ADDED-1581604879${id}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
}

function convertTime(departureTime) {
    const dateObject = new Date(departureTime);
    const timeString = dateObject.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return timeString;
}

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

function displayData(dataArray) {
    const resolvedStationInformation = dataArray[0];
    console.log('station information:');
    console.log(resolvedStationInformation); // JSON object from the first API call

    const southDeparture = dataArray[1];
    console.log('south departure:');
    console.log(southDeparture); // JSON object from the second API call

    const northDeparture = dataArray[2]["data"];
    console.log('north departure:');
    console.log(northDeparture); // JSON object from the third API call

    document.getElementById('barName').textContent = barName;
    document.getElementById("resolved_mbta_stop").textContent = resolvedStationInformation["data"]["attributes"]["name"];
    document.getElementById("mbta_distance").textContent = mbtaDistance;

    let departure_one_string = "Northbound: ";
    let depaturure_two_string = "Southbound: ";
    
    // process the information so that we can get multiple stop information and the heading information for the trains.
    async function processJsonData() {
        for (var i = 0; i < northDeparture.length; i++) {
            console.log(northDeparture[i])
            // get departure time and add it to string
            departure_one_string = departure_one_string.concat(" ", `${convertTime(northDeparture[i]["attributes"]["departure_time"])}`)
            // get the id of the trip
            // query api to get the direciton that its heading to
            const getTripDetails = await fetchAdditionalData(northDeparture[i]["relationships"]["trip"]["data"]["id"]);
            // add that to the string
            departure_one_string = departure_one_string.concat(" ", `towards ${getTripDetails["data"]["attributes"]["headsign"]}`)
            // do the calculation to figure out the time difference
        }
    }
    console.log(departure_one_string)
    document.getElementById("departure_one").textContent = departure_one_string;
    //document.getElementById("departure_one").textContent = `Northbound: ${convertTime(northDeparture["data"][0]["attributes"]["departure_time"])} towards ${northDeparture["included"][0]["attributes"]["platform_name"]}. ${calculateTimeDifference(northDeparture["data"][0]["attributes"]["departure_time"], mbtaDistance)}`
    //document.getElementById("departure_two").textContent = `Southbound: ${convertTime(southDeparture["data"][0]["attributes"]["departure_time"])} towards ${southDeparture["included"][0]["attributes"]["platform_name"]}. ${calculateTimeDifference(southDeparture["data"][0]["attributes"]["departure_time"], mbtaDistance)}`
}

// now that we have our parameters let's make our api calls
const stationDetails = `https://api-v3.mbta.com/stops/${mbtaStop}`;

if (mbtaLine == "red") {
    const southDeparture = `https://api-v3.mbta.com/predictions?filter[stop]=${mbtaStop}&filter[direction_id]=0&include=stop&filter[route_type]=1&page[limit]=2&sort=departure_time`
    const northDeparture = `https://api-v3.mbta.com/predictions?filter[stop]=${mbtaStop}&filter[direction_id]=1&include=stop&filter[route_type]=1&page[limit]=2&sort=departure_time`

    // store the promises
    const promises = [];

    // get data from api and return promise
    function fetchData(apiUrl) {
        return fetch(apiUrl)
            .then(response => response.json());
    }

    // Make the API calls and add the promises to the array
    promises.push(fetchData(stationDetails));
    promises.push(fetchData(southDeparture));
    promises.push(fetchData(northDeparture));

    Promise.all(promises)
        .then(dataArray => {
            // dataArray contains the data from all three API calls
            // Handle the fetched data here
            displayData(dataArray);
        })
    //.catch(err => console.log(err)); // TypeError: failed to fetch (the text may vary);
}
