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

function displayData(dataArray) {
    const resolvedStationInformation = dataArray[0];
    console.log('station information:');
    console.log(resolvedStationInformation); // JSON object from the first API call

    const southDeparture = dataArray[1];
    console.log('south departure:');
    console.log(southDeparture); // JSON object from the second API call

    const northDeparture = dataArray[2];
    console.log('north departure:');
    console.log(northDeparture); // JSON object from the third API call

    document.getElementById('barName').textContent = barName;
    document.getElementById("resolved_mbta_stop").textContent = resolvedStationInformation["data"]["attributes"]["name"];
    document.getElementById("mbta_distance").textContent = mbtaDistance;
    document.getElementById("departure_one").textContent = `Northbound: ${northDeparture["data"][0]["attributes"]["departure_time"]}`
    document.getElementById("departure_two").textContent = `Southbound: ${southDeparture["data"][0]["attributes"]["departure_time"]} towards ${southDeparture["included"][0]["attributes"]["platform_name"]}`
}

// now that we have our parameters let's make our api calls
const stationDetails = `https://api-v3.mbta.com/stops/${mbtaStop}`;

if (mbtaLine == "red") {
    const southDeparture = `https://api-v3.mbta.com/predictions?filter[stop]=${mbtaStop}&filter[direction_id]=0&include=stop&filter[route_type]=1&page[limit]=1&sort=departure_time`
    const northDeparture = `https://api-v3.mbta.com/predictions?filter[stop]=${mbtaStop}&filter[direction_id]=1&include=stop&filter[route_type]=1&page[limit]=1&sort=departure_time`

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
