// Function to fetch existing data based on "name" for first comparison item
document.getElementById("fetchDataButtonCompareFirst").addEventListener("click", function () {
    const name = document.getElementById("nameFirst").value; // The name to look up   
    if (!name) {
        alert("Please enter a name to fetch data.");
        return;
    }
    fetch("https://script.google.com/macros/s/AKfycbyyBx9jeumHTpvKeubGhNlyGyjhufI88F9GJF4F4vK6g-qkz5FWgFXO5yCQ10Ex8Byp/exec?action=get&name=" + encodeURIComponent(name),
    { method: "GET" }  
    )
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert("No data found for this name.");
                return;
            }
            // Fill the form with existing data
            document.getElementById("researcherFirst").innerText = data.researcher || "";
            document.getElementById("birthDateFirst").innerText = data.date_birth || "";
            document.getElementById("birthPlaceFirst").innerText = data.place_birth || "";
            document.getElementById("deathDateFirst").innerText = data.date_death || "";
            document.getElementById("deathPlaceFirst").innerText = data.place_death || "";
            document.getElementById("startTartiniFirst").innerText = data.start_tartini || "";
            document.getElementById("finishTartiniFirst").innerText = data.finish_tartini || "";
            document.getElementById("musicComposedFirst").innerText = data.music_composed || "";
            document.getElementById("orchestraFirst").innerText = data.orchestra_played || "";
            document.getElementById("referenceFirst").innerText = data.reference || "";
        })
        .catch(() => alert("Error fetching data."));
});

// Function to fetch existing data based on "name" for second comparison item
document.getElementById("fetchDataButtonCompareSecond").addEventListener("click", function () {
    const name = document.getElementById("nameSecond").value; // The name to look up   
    if (!name) {
        alert("Please enter a name to fetch data.");
        return;
    }
    fetch("https://script.google.com/macros/s/AKfycbyyBx9jeumHTpvKeubGhNlyGyjhufI88F9GJF4F4vK6g-qkz5FWgFXO5yCQ10Ex8Byp/exec?action=get&name=" + encodeURIComponent(name),
    { method: "GET" }  
    )
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert("No data found for this name.");
                return;
            }
            // Fill the form with existing data
            document.getElementById("researcherSecond").innerText = data.researcher || "";
            document.getElementById("birthDateSecond").innerText = data.date_birth || "";
            document.getElementById("birthPlaceSecond").innerText = data.place_birth || "";
            document.getElementById("deathDateSecond").innerText = data.date_death || "";
            document.getElementById("deathPlaceSecond").innerText = data.place_death || "";
            document.getElementById("startTartiniSecond").innerText = data.start_tartini || "";
            document.getElementById("finishTartiniSecond").innerText = data.finish_tartini || "";
            document.getElementById("musicComposedSecond").innerText = data.music_composed || "";
            document.getElementById("orchestraSecond").innerText = data.orchestra_played || "";
            document.getElementById("referenceSecond").innerText = data.reference || "";
        })
        .catch(() => alert("Error fetching data."));
});