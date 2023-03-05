/*function onLocationError(e) {
    let errortype = e["type"]
    console.log(errortype)
    r = httpGet(`https://bostondives.bar/.netlify/functions/logging?error=${errortype}`);
}*/

function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false); // false for synchronous request
    xmlHttp.send(null);
    return xmlHttp.responseText;
}


function Check(value) {
    if (value['checked'] == true) {
        localStorage.setItem(value['id'], true)
    } else {
        localStorage.removeItem(value['id']);
    }
};

window.mobileCheck = function () {
    let check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};

//This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
function calcCrow(lat1, lon1, lat2, lon2) {
    var R = 6371; // km
    var dLat = toRad(lat2 - lat1);
    var dLon = toRad(lon2 - lon1);
    var lat1 = toRad(lat1);
    var lat2 = toRad(lat2);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;

    // return distance in feet. doesn't need to be super precise. this is dive bars we're talking about here
    return parseInt(d * 2380.8);
}

// Converts numeric degrees to radians
function toRad(Value) {
    return Value * Math.PI / 180;
}

// generate the slidey boi for whether or not you have been to a bar
function onClick(e) {

    // get the content of the original popup message
    var datas = this.getPopup().getContent()

    // regex out the name of the bar
    let re = new RegExp('<h3>(.*?)</h3>');
    let result = re.exec(datas)
    let barName = result[1]

    // check to see if this is a bar that has already been visited
    var checked = JSON.parse(localStorage.getItem(barName));
    var checked_field = " ";


    // split on the br tag to remove the checkbox so it doesn't get added multiple times
    var new_str = datas.split("<br>")[0];

    if (checked == true) {
        new_str += `<br><br><label><input type="checkbox" onchange="Check(this)" 
        id="${barName}" checked/> Drank here
        </label>`
        //r = httpGet(`https://bostondives.bar/.netlify/functions/logging?barSaved=${barName} - Saved`)
    } else {
        new_str += `<br><br><label><input type="checkbox" onchange="Check(this)" 
        id="${barName}" /> Drank here
        </label>`
        //r = httpGet(`https://bostondives.bar/.netlify/functions/logging?barSaved=${barName}`)
    }
    this.getPopup().setContent(new_str)

}

// returns whether or not a bar is open
function checkBarOpen(currentTime, barJson, currentDay) {

    // this handles when bars are open until 1 am the next morning and its still during the day
    // i hate the way this works.
    // i still think this is ugly but it seems like it works
    let open = barJson["hours"][currentDay][0].split(",")[0];
    let close = barJson["hours"][currentDay][0].split(",")[1];

    // catch 1 of 4 conditions that can occur
    // 1. bar is closed, 2. bar is closes before midnight
    // 3. bar closes after midnight and it's before midnight
    // 4. same as 3 but it's after midnight

    if (open == "closed") {
        return false;
    } else if (currentTime < open) {
        return false;
    }

    if ((close <= "23:59" && close > "02:00")) {
        return (currentTime > open && currentTime < close);
    }

    if ((close >= "00:00" && close <= "02:00") && (currentTime > "02:00" && currentTime <= "23:59")) {
        close = "23:59";
        return (currentTime > open && currentTime < close);
    }

    if ((close >= "00:00" && close <= "02:00") && (currentTime >= "00:00" && currentTime <= "02:00")) {
        currentDay = currentDay - 1
        close = barJson["hours"][currentDay][0].split(",")[1];
        open = "00:00";
        return (currentTime > open && currentTime < close);
    }

    // there's some weird condition that causes a few bars to fall through but they're all overnight
    // so this catches them
    return true;

}

function generatePopupMessage(barJson) {

    let ua = navigator.userAgent;
    let isMobile = window.mobileCheck();

    var lat = parseFloat(barJson["location"].split(",")[0])
    var long = parseFloat(barJson["location"].split(",")[1])
    let barName = barJson["name"];
    const d = new Date();
    let currentDay = d.getDay();
    const currentHour = String(d.getHours()).padStart(2, '0');
    const currentMinutes = String(d.getMinutes()).padStart(2, '0');
    let currentTime = `${currentHour}:${currentMinutes}`

    let funcPopupMessage = `<h3>${barName}</h3>`;

    if (barJson["whatToOrder"]) {
        funcPopupMessage += `<p>Recommended order: ${barJson["whatToOrder"]}</p>`
    }

    // send the current time and then the current day to figure out if the bar is open
    if (barJson["hours"]) {
        let barStatus = checkBarOpen(currentTime, barJson, currentDay)

        if (barStatus) {
            funcPopupMessage += `<p>Bar is currently <b>open</b></p>`;
        } else {
            funcPopupMessage += `<p>Bar is currently <b>closed</b></p>`;
        }
    }

    if (isMobile && ua.includes("Android")) {
        funcPopupMessage += `<a href='geo: ${lat}, ${long}?q=${lat},${long}' target='_blank' rel='noopener noreferrer'>Directions  </a>`;
    } else if (isMobile && (ua.includes("iPhone") || ua.includes("iPad"))) {
        funcPopupMessage += `<a href='https://maps.apple.com/?q=${lat},${long}' target='_blank' rel='noopener noreferrer'>Directions  </a>`
    } else {
        funcPopupMessage += `<a href="http://www.google.com/maps/place/${lat},${long}">Directions  </a>`
    }

    funcPopupMessage += `<a href="https://bostondives.bar/?bar=${barName}">Share  </a>`

    if (barJson["website"]) {
        funcPopupMessage += `<a href="${barJson["website"]}">Website</a>`;
    }

    return funcPopupMessage;
}

var redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

var greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

var yellowIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

var map = L.map('map').setView([42.352842657497064, -71.06222679401405], 14);

fetch("./locations.json")
    .then(response => response.json())
    .then((json) => {


        const timeout = 12000; // timeout setting for message boxes

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(map);

        for (var i = 0; i < json.length; i++) {
            var lat = parseFloat(json[i]["location"].split(",")[0])
            var long = parseFloat(json[i]["location"].split(",")[1])
            // determine what marker to use on the map
            let iconType = redIcon;
            if (json[i]["type"] == "food") {
                iconType = greenIcon;
            }


            // start creating the popup menu when an icon is clicked on
            let popupMessage = generatePopupMessage(json[i]);

            // add everything from locations
            marker = new L.marker([lat, long], { icon: iconType })
                .bindPopup(popupMessage)
                .on('click', onClick)
                .addTo(map);
        }


        /*var lc = L.control.locate({
            strings: {
              title: "Show me the closest dive bar"
            }
          }).addTo(map);*/
          L.DomEvent.on(document.getElementById('findClosestBarButton'), 'click', function(){
            map.locate({setView: true, maxZoom: 16});
            document.getElementById("findClosestBarButton").style.visibility = "hidden";
          })

        let isMobile = window.mobileCheck()

        // needs better work
        let barQuery = false;
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        let plotBarOnMap = urlParams.get('bar')
        if (plotBarOnMap) {
            barQuery = true;

            navigator.permissions && navigator.permissions.query({ name: 'geolocation' })
            .then(function (PermissionStatus) {
                if (PermissionStatus.state == 'granted') {
                    console.log("allowed")
                } else {
                    var options = { timeout: timeout, position: "topright" }
                    let msg = "Looks like someone shared a bar with you or you're getting directions direct to a bar.<br>If you share your location using the arrow directions to the bar will load automatically."
                    var box = L.control.messagebox(options).addTo(map).show(msg);
                }
            })

            for(var i = 0; i < json.length; i++) {

                if(json[i]["name"] == plotBarOnMap) {
                    let closestPopupMessage = generatePopupMessage(json[i]);
                    var lat = parseFloat(json[i]["location"].split(",")[0])
                    var long = parseFloat(json[i]["location"].split(",")[1])
                    map.setView([lat, long], 16);

                    closestMarker = new L.marker([lat, long], { icon: yellowIcon })
                    .bindPopup(closestPopupMessage)
                    .on('click', onClick)
                    .addTo(map);
                }
            }
            var x = document.getElementById("findClosestBarButton");
            x.innerHTML = "Get Directions To Bar";
            
        }

        let popupMessagePosition;
        if (isMobile) {
            popupMessagePosition = "bottomright"
        } else {
            popupMessagePosition = "topright"
        }

        var options = { timeout: timeout, position: popupMessagePosition }
        let msg = "BostonDives.com an interactive map of dives and neighborhood bars.<br>If you share your location with the button the left the map will automatically navigate you to the closest bar.<br>You can also track the bars you've drank at by marking them when clicking/tapping on an icon."
        //var box = L.control.messagebox(options).addTo(map).show(msg);

        // if a user has allowed the location to be accessed jump right to where they are.
        // if not there's a geolocate button they can use
        navigator.permissions && navigator.permissions.query({ name: 'geolocation' })
            .then(function (PermissionStatus) {
                if (PermissionStatus.state == 'granted') {
                    console.log("allowed")
                    map.locate({ setView: true, maxZoom: 16, timeout: 10000 });
                    document.getElementById("findClosestBarButton").style.visibility = "hidden";
                } else {
                    //denied
                    console.log("denied");
                    var box = L.control.messagebox(options).addTo(map).show(msg);
                }
            })


        map.on('locationfound', function (e) {

            // check to see if there is a prevous directions menu that we might need to delete
            var i, elements = document.getElementsByClassName('leaflet-routing-container leaflet-bar leaflet-routing-collapsible leaflet-control');
            for (i = elements.length; i--;) {
                elements[i].parentNode.removeChild(elements[i]);
            }

            // get the user coordinates
            let userLat = e.latitude;
            let userLong = e.longitude;
            //lc.stop(); // once we know the users location stop getting updates. although it would be cool to turn this on and find bars as you're walking

            let closestLat, closestLong;
            const distanceLimit = 528000;

            // calculate the closest bar
            let closestBar = "";
            let closestPopupMessage = "";
            let totalDistance = distanceLimit; // roughly 100 miles

            let secondClosestBar = ""
            let secondClosestDistance = distanceLimit;

            for (var i = 0; i < json.length; i++) {
                var lat = parseFloat(json[i]["location"].split(",")[0])
                var long = parseFloat(json[i]["location"].split(",")[1])

                // find the distance between the bar and the current location to determine whats closest
                distance = calcCrow(userLat, userLong, lat, long)

                // get this info to plot separately since we need the closest bar
                // also track the second closest bar in case we're too close and want to go somewhere else
                if (json[i]["type"] == "bar" && barQuery == "") {
                    if (distance < totalDistance) {
                        secondClosestDistance = totalDistance;
                        totalDistance = distance;
                        closestBar = "The closest dive bar is: " + json[i]["name"];
                        closestLat = lat;
                        closestLong = long;
                        closestPopupMessage = generatePopupMessage(json[i]);
                    } else if (distance < secondClosestDistance) {
                        secondClosestDistance = distance;
                        secondClosestBar = json[i]["name"];
                    }


                } else if (barQuery) {
                    // I call it closestPopup but its really being repurposed if someone is 
                    // querying for a bar directly
                    totalDistance = 0; // this is a hack to reset the view for out of state users
                    closestBar = "Directions to: " + plotBarOnMap; // set message on location pin

                    // loop through to find the bar to plot as the destination
                    if (json[i]["name"] == plotBarOnMap) {
                        closestPopupMessage = generatePopupMessage(json[i]);
                    }

                    var x = document.getElementById('findClosestBarButton');
                    x.style.visibility='hidden';

                }

                // determine what marker to use on the map
                let iconType = redIcon;
                if (json[i]["type"] == "food") {
                    iconType = greenIcon;
                }

                // start creating the popup menu when an icon is clicked on
                let popupMessage = generatePopupMessage(json[i]);

                // add everything from locations
                marker = new L.marker([lat, long], { icon: iconType })
                    .bindPopup(popupMessage)
                    .on('click', onClick)
                    .addTo(map);
            }

            // instead of getting the plot of the closest bar get the coords of the bar from the query
            if (plotBarOnMap) {
                for (let i = 0; i < json.length; i++) {
                    if (json[i]["name"] == plotBarOnMap) {
                        var lat = parseFloat(json[i]["location"].split(",")[0])
                        var long = parseFloat(json[i]["location"].split(",")[1])
                        closestLat = lat;
                        closestLong = long;
                    }
                }
            }

            // reset the view if the user is out of stateish
            // i also have no way of testing this right now
            if (totalDistance == distanceLimit) {
                var options = { timeout: timeout, position: "topright" }
                let msg = "You seem pretty far from Boston. Feel free to research dive bars if you're taking a trip. If you load the site on your phone when you're here it will automatically route you to the closest dive bar.";
                var box = L.control.messagebox(options).addTo(map).show(msg);

                map.setView([42.352842657497064, -71.06222679401405], 14);
            }

            if (closestBar) {
                L.Routing.control({
                    waypoints: [
                        L.latLng(userLat, userLong),
                        L.latLng(closestLat, closestLong),
                    ],
                    units: "imperial",
                    fitSelectedRoutes: true,
                    draggableWaypoints: false,
                    addWaypoints: false,
                    collapsible: true,
                    show: (isMobile ? false : true) // don't show the directions by default if we're on mobile
                }).addTo(map);

                L.marker(e.latlng).addTo(map)
                    .bindPopup(closestBar).openPopup();

                // this is temporary I tell myself
                let httpGetRequest = closestBar.split(":")[1]
                //r = httpGet(`https://bostondives.bar/.netlify/functions/logging?bar=${httpGetRequest}`)
            }

            // this gets added a second time to lay over the routing
            closestMarker = new L.marker([closestLat, closestLong], { icon: yellowIcon })
                .bindPopup(closestPopupMessage)
                .on('click', onClick)
                .addTo(map);


            // check to see if we need to add a button to help route to the next closest bar
            if (totalDistance < 300) {
                document.getElementById("closest-button").style.visibility = "hidden";
                document.getElementById("next-button").style.visibility = "visible";
                var button = document.getElementById('next-button');
                button.addEventListener('click', () => location.href = `https://bostondives.bar/?bar=${secondClosestBar}`);
            }

            if (barQuery) {
                document.getElementById("next-button").style.visibility = "hidden";
                document.getElementById("closest-button").style.visibility = "visible";
                var button = document.getElementById('closest-button');
                button.addEventListener('click', () => location.href = `https://bostondives.bar/`);
            }

        })
        //map.on('locationerror', onLocationError(e));
        map.on('locationerror', function(e) {
            let isMobile = window.mobileCheck()

            console.log("event e: ", e)
            let errortype = e["type"]
            console.log("error getting location");
            console.log(isMobile);
            if(isMobile){
                alert(`Sorry, looks like you're not sharing your location.\nIf you're on iOS you can go to:\nPrivacy and security > location services > safai\nAlso\nSettings > safari and enable location services\n\n For Android\n Settings > Location and make sure your browser has access.`)
            } else {
                alert("Error getting location, check your computer settings to make sure that you're sharing your location")
            }

            //r = httpGet(`https://bostondives.bar/.netlify/functions/logging?error=${errortype}`);

          });
    })