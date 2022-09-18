
window.onload = function () {
    fetch("./locations.json")
        .then(response => response.json())
        .then((json) => {

            let barsVistedCounter = localStorage.length;
            let barsNotVisitedCounter = json.length - localStorage.length;

            let barsVisistedList = "<ul>";
            let barsNotVisistedList = "<ul>";

            for (let i = 0; i < localStorage.length; i++) {
                var key = localStorage.key(i);
                for(let j = 0; j < json.length; j++) {
                    if(json[j]["name"] == key) {
                        barsVisistedList += `<li>${key}</li>`
                    }
                }
            }


            console.log(barsVistedCounter);
            console.log(barsNotVisitedCounter);

            document.getElementById("visitedBarsCounter").innerHTML = "Visited: " + barsVistedCounter;
            document.getElementById("notVisitedBarsCounter").innerHTML = "Not visited: " + barsNotVisitedCounter;

            barsVisistedList += "</ul>";
            barsNotVisistedList += "</ul>"
            document.getElementById("visitedBarsList").innerHTML = barsVisistedList;
            document.getElementById("notVisitedBarsList").innerHTML = barsNotVisistedList;

        })   
}