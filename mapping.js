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

// returns whether or not a bar is open
function checkBarOpen(currentTime, range) {

    let open = range[0].split(",")[0];
    let close = range[0].split(",")[1];

    // this handles when bars are open until 1 am the next morning and its still during the day
    if (close == "01:00" && currentTime < "9:00") {
        close = "23:59";
        return currentTime < close && currentTime > open;
    } else if (currentTime < "10:00" && currentTime >= "00:00") {
        // now if it's 12 am or later
        open = "00:00"
        return currentTime < close && currenTime > open;
    } else {
        // for bars that don't bleed over into the next day
        return currenTime < close && currentTime > open;
    }
}

// this is all kind of ugly but works. i forgot that people block all location requests
function onLocationError(e) {
    //alert(e.message);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap',
        detectRetina: true
    }).addTo(map);

    fetch("./locations.json")
        .then(response => response.json())
        .then((json) => {

            let isMobile = window.mobileCheck()
            for (var i = 0; i < json.length; i++) {
                var lat = parseFloat(json[i]["location"].split(",")[0])
                var long = parseFloat(json[i]["location"].split(",")[1])
                // determine what marker to use on the map
                let iconType = redIcon;
                if (json[i]["type"] == "food") {
                    iconType = greenIcon;
                }

                // start creating the popup menu when an icon is clicked on
                let popupMessage = json[i]["name"];

                // if mobile add a link to open in google maps
                let ua = navigator.userAgent;
                if (isMobile && ua.includes("Android")) {
                    popupMessage += `<br><a href='geo: ${lat}, ${long}?q=${lat},${long}' target='_blank' rel='noopener noreferrer'>Directions</a>`;
                } else if (isMobile && (ua.includes("iPhone") || ua.includes("iPad"))) {
                    popupMessage += `<br><a href='https://maps.apple.com/?q=${lat},${long}' target='_blank' rel='noopener noreferrer'>Directions</a>`
                }

                if (json[i]["website"]) {
                    popupMessage += `<br><a href=${json[i]["website"]}>Website</a>`
                }

                if (isMobile) {
                    popupMessage += `<br><a href="https://bostondives.bar/?bar=${json[i]["name"]}">Share</a>`
                }

                // if the what to order field is popuplated
                if (json[i]["whatToOrder"]) {
                    popupMessage += "<br>What to order: " + json[i]["whatToOrder"];
                }

                // add everything from locations
                marker = new L.marker([lat, long], { icon: iconType })
                    .bindPopup(popupMessage)
                    .addTo(map);
            }

            var options = { timeout: 8000, position: "topright" }
            let msg = "You're not sharing your location. Feel free to click around and research bars. If you share your location on your phone or computer it will automatically route you to the closest dive bar."
            var box = L.control.messagebox(options).addTo(map).show(msg);

        }

        )
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

window.mobileCheck = function () {
    let check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};

var map = L.map('map').setView([42.352842657497064, -71.06222679401405], 14);


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

fetch("./locations.json")
    .then(response => response.json())
    .then((json) => {

        let isMobile = window.mobileCheck()

        // check if there is a bar parameter provided
        let barQuery = window.location.search;
        const urlParams = new URLSearchParams(barQuery);
        const plotBarOnMap = urlParams.get('bar');

        map.locate({ setView: true, maxZoom: 16 });
        map.on('locationfound', function (e) {
            // get the user coordinates
            let userLat = e.latitude
            let userLong = e.longitude
            let closestLat, closestLong, closestPopupMessage;
            let ua = navigator.userAgent;
            const d = new Date();
            let currentDay = d.getDay();
            let currentHour = d.getHours();
            let currentMinutes = d.getMinutes();
            let currentTime = `${currentHour}:${currentMinutes}`

            // calculate the closest bar
            let closestBar = "";
            let totalDistance = 528000; // roughly 100 miles

            for (var i = 0; i < json.length; i++) {
                var lat = parseFloat(json[i]["location"].split(",")[0])
                var long = parseFloat(json[i]["location"].split(",")[1])

                // find the distance between the bar and the current location to determine whats closest
                distance = calcCrow(userLat, userLong, lat, long)

                // get this info to plot separately since we need the closest bar
                if (distance < totalDistance && json[i]["type"] == "bar" && barQuery == "") {
                    totalDistance = distance;
                    closestBar = "The closest dive bar is: " + json[i]["name"];
                    closestLat = lat;
                    closestLong = long;
                    closestPopupMessage = json[i]["name"];

                    // if the what to order field is popuplated
                    if (json[i]["whatToOrder"]) {
                        closestPopupMessage += "<br>What to order: " + json[i]["whatToOrder"];
                    }


                    if (isMobile && ua.includes("Android")) {
                        closestPopupMessage += `<br><a href='geo: ${lat}, ${long}?q=${lat},${long}' target='_blank' rel='noopener noreferrer'>Directions</a>`;
                    } else if (isMobile && (ua.includes("iPhone") || ua.includes("iPad"))) {
                        closestPopupMessage += `<br><a href='https://maps.apple.com/?q=${lat},${long}' target='_blank' rel='noopener noreferrer'>Directions</a>`
                    }

                    isMobile = true;
                    if (isMobile) {
                        closestPopupMessage += `<br><a href="https://bostondives.bar/?bar=${json[i]["name"]}">Share</a>`

                        // this checks the range to see if the bar is open or not
                        if (json[i]["hours"]) {

                            // send the current time and then the current day to figure out if the bar is open
                            let barStatus = checkBarOpen(currentTime, json[i]["hours"][currentDay])

                            if (barStatus) {
                                closestPopupMessage += `<br><p>Bar is currently open</p>`;
                            } else {
                                closestPopupMessage += `<br><p>Bar is currently closed</p>`;
                            }
                        }
                    }

                } else if (barQuery) {
                    totalDistance = 0; // this is a hack to reset the view for out of state users

                    closestBar = "Directions to: " + plotBarOnMap;
                    closestPopupMessage = plotBarOnMap;

                    if (isMobile && ua.includes("Android")) {
                        closestPopupMessage += `<br><a href='geo: ${lat}, ${long}?q=${lat},${long}' target='_blank' rel='noopener noreferrer'>Directions</a>`;
                    } else if (isMobile && (ua.includes("iPhone") || ua.includes("iPad"))) {
                        closestPopupMessage += `<br><a href='https://maps.apple.com/?q=${lat},${long}' target='_blank' rel='noopener noreferrer'>Directions</a>`
                    }

                    if (isMobile) {
                        closestPopupMessage += `<br><a href="https://bostondives.bar/?bar=${json[i]["name"]}">Share</a>`
                    }
                }

                // determine what marker to use on the map
                let iconType = redIcon;
                if (json[i]["type"] == "food") {
                    iconType = greenIcon;
                }

                // start creating the popup menu when an icon is clicked on
                let popupMessage = json[i]["name"];

                // if the what to order field is popuplated
                if (json[i]["whatToOrder"]) {
                    popupMessage += "<br>What to order: " + json[i]["whatToOrder"];
                }

                if (isMobile && ua.includes("Android")) {
                    popupMessage += `<br><a href='geo: ${lat}, ${long}?q=${lat},${long}' target='_blank' rel='noopener noreferrer'>Directions</a>`;
                } else if (isMobile && ua.includes("iPhone")) {
                    popupMessage += `<br><a href='https://maps.apple.com/?q=${lat},${long}' target='_blank' rel='noopener noreferrer'>Directions</a>`
                }

                if (isMobile) {
                    popupMessage += `<br><a href="https://bostondives.bar/?bar=${json[i]["name"]}">Share</a>`
                }

                // add everything from locations
                marker = new L.marker([lat, long], { icon: iconType })
                    .bindPopup(popupMessage)
                    .addTo(map);
            }


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
            if (totalDistance == 528000) {
                var options = { timeout: 8000, position: "topright" }
                let msg = "You seem pretty far from Boston. Feel free to research dive bars if you're taking a trip. If you load the site on your phone when you're here it will automatically route you to the closest dive bar.";
                var box = L.control.messagebox(options).addTo(map).show(msg);

                map.setView([42.352842657497064, -71.06222679401405], 14);
            }

            if (closestBar) {
                L.Routing.control({
                    waypoints: [
                        L.latLng(userLat, userLong),
                        L.latLng(closestLat, closestLong)
                    ],
                    units: "imperial",
                    fitSelectedRoutes: true
                }).addTo(map);


                L.marker(e.latlng).addTo(map)
                    .bindPopup(closestBar).openPopup();
            }

            // this gets added a second time to lay over the routing
            closestMarker = new L.marker([closestLat, closestLong], { icon: yellowIcon })
                .bindPopup(closestPopupMessage)
                .addTo(map);

        })

        map.on('locationerror', onLocationError);
    })
