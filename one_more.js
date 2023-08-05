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
    console.log(resolvedStationInformation["data"]); // JSON object from the first API call

    const southDeparture = dataArray[0];
    console.log('south departure:');
    console.log(southDeparture["data"]); // JSON object from the second API call

    const northDeparture = dataArray[0];
    console.log('north departure:');
    console.log(northDeparture["data"]); // JSON object from the third API call

    document.getElementById('barName').textContent = barName;
    document.getElementById("mbta_stop").textContent = mbtaStop;
}

// now that we have our parameters let's make our api calls
const stationDetails = `https://api-v3.mbta.com/stops/${mbtaStop}`;

if (mbtaLine == "red") {
    const southDeparture = `https://api-v3.mbta.com/predictions?filter[stop]=${mbtaStop}n&include=stop&filter[route_type]=1&page[limit]=1&sort=departure_time`
    const northeparture = `https://api-v3.mbta.com/predictions?filter[stop]=${mbtaStop}&filter[direction_id]=1&include=stop&filter[route_type]=1&page[limit]=1&sort=departure_time`

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
    promises.push(fetchData(northeparture));

    Promise.all(promises)
        .then(dataArray => {
            // dataArray contains the data from all three API calls
            // Handle the fetched data here
            displayData(dataArray);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}
