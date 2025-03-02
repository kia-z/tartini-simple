// Function to fetch existing data based on "name" for single view
document.getElementById("fetchDataButtonView").addEventListener("click", function () {
    const name = document.getElementById("name").value; // The name to look up   
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
            document.getElementById("researcher").innerText = data.researcher || "";
            document.getElementById("birthDate").innerText = data.date_birth || "";
            document.getElementById("birthPlace").innerText = data.place_birth || "";
            document.getElementById("deathDate").innerText = data.date_death || "";
            document.getElementById("deathPlace").innerText = data.place_death || "";
            document.getElementById("startTartini").innerText = data.start_tartini || "";
            document.getElementById("finishTartini").innerText = data.finish_tartini || "";
            document.getElementById("musicComposed").innerText = data.music_composed || "";
            document.getElementById("orchestra").innerText = data.orchestra_played || "";
            document.getElementById("reference").innerText = data.reference || "";
        })
        .catch(() => alert("Error fetching data."));
});