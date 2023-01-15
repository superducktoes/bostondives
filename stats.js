//todo make this so i dont have to copy/paste
function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false); // false for synchronous request
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

window.onload = function () {
    fetch("./locations.json")
        .then(response => response.json())
        .then((json) => {

            let barsVistedCounter = localStorage.length;
            let barsNotVisitedCounter = json.length - localStorage.length;
            let barsCompleted = Math.round((barsVistedCounter / json.length) * 100);

            let listOfBars = "<ul id='listOfBars' style='list-style-type: none';padding: 0;margin: 0;>"

            // modify the json object based on local storage to update visited bars
            for (let i = 0; i < localStorage.length; i++) {
                var key = localStorage.key(i);
                for (let j = 0; j < json.length; j++) {
                    if (json[j]["name"] == key) {
                        json[j]["visited"] = true;
                    }
                }

            }

            for (let i = 0; i < json.length; i++) {
                let bullet = "❌"

                if (json[i]["visited"]) {
                    bullet = "✅"
                }

                listOfBars += `<li>${bullet} <a href="https://bostondives.bar/?bar=${json[i]["name"]}">${json[i]["name"]}</a></li>`
            }

            r = httpGet(`https://bostondives.bar/.netlify/functions/logging?barsCompleted=${barsCompleted}&barsVisitedCounter=${barsVistedCounter}&barsNotVisitedCounter=${barsNotVisitedCounter}`)
            document.getElementById("percentageCompleted").innerHTML = `You've been to ${barsCompleted}% of the bars on the map`
            document.getElementById("visitedBarsStats").innerHTML = `Visited: ${barsVistedCounter}  Not Visited: ${barsNotVisitedCounter}`

            listOfBars += "</ul>"

            document.getElementById("listOfBars").innerHTML = listOfBars

        })
}

function searchBars() {
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();

    ul = document.getElementById("listOfBars");

    li = ul.getElementsByTagName("li");

    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}