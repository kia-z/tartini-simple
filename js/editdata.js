// Function to fetch existing data based on "name"
document.getElementById("fetchDataBtn").addEventListener("click", function () {
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
            document.getElementById("researcher").value = data.researcher || "";
            document.getElementById("birthDate").value = data.date_birth || "";
            document.getElementById("birthPlace").value = data.place_birth || "";
            document.getElementById("deathDate").value = data.date_death || "";
            document.getElementById("deathPlace").value = data.place_death || "";
            document.getElementById("startTartini").value = data.start_tartini || "";
            document.getElementById("finishTartini").value = data.finish_tartini || "";
            document.getElementById("musicComposed").value = data.music_composed || "";
            document.getElementById("orchestra").value = data.orchestra_played || "";
            document.getElementById("reference").value = data.reference || "";
        })
        .catch(() => alert("Error fetching data."));
});

// Function to submit updated data
document.getElementById("editForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = {
        action: "edit",  // Identifies this request as an update
        researcher: document.getElementById("researcher").value,
        name: document.getElementById("name").value, // Required to find the row
        date_birth: document.getElementById("birthDate").value,
        place_birth: document.getElementById("birthPlace").value,
        date_death: document.getElementById("deathDate").value,
        place_death: document.getElementById("deathPlace").value,
        start_tartini: document.getElementById("startTartini").value,
        finish_tartini: document.getElementById("finishTartini").value,
        music_composed: document.getElementById("musicComposed").value,
        orchestra_played: document.getElementById("orchestra").value,
        reference: document.getElementById("reference").value
    };

    fetch("https://script.google.com/macros/s/AKfycbyyBx9jeumHTpvKeubGhNlyGyjhufI88F9GJF4F4vK6g-qkz5FWgFXO5yCQ10Ex8Byp/exec", {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
    })
    .then(() => {
        document.getElementById("responseMessage").innerText = "Data updated successfully!";
    })
    .catch(() => {
        document.getElementById("responseMessage").innerText = "Error updating data.";
    });
});