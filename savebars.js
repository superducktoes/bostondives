// this should always load since we need to populate the top text box with the b64 string
let bars = JSON.stringify({...localStorage});
let encoded = btoa(encodeURIComponent(bars));
document.getElementById('copyb64').value = encoded;

const element = document.getElementById("savebars");
element.addEventListener('click', function() {
    try {
        document.getElementById('loadMessage').innerText = "";
        let decodedBars = JSON.parse(decodeURIComponent(atob(document.getElementById("pasteb64")).value));
        localStorage.clear();
        for(let i in decodedBars) {
            localStorage.setItem(i, true)
        }
    } catch(e) {
        document.getElementById('loadMessage').innerText = e;
    }

    document.getElementById('loadMessage').innerText = "Bars successfully loaded";
}, false);