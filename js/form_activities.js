document.getElementById("activities_form").addEventListener("submit", function (e) {
    e.preventDefault();

    // remember! the first name is the one in google spreadsheet, the second one is the ID in the html form
    const formActivities = {
        action: "add", 
        title: document.getElementById("activity_title").value,
        type: document.getElementById("activity_type").value,
        start_date: document.getElementById("start_date").value,
        end_date: document.getElementById("end_date").value,
        exact_date: document.getElementById("exact_date").value,
        people_involved: document.getElementById("people_involved").value,
        place: document.getElementById("place").value,
        music: document.getElementById("text_reference").value,
        sources: document.getElementById("sources").value,
    };

    fetch("https://script.google.com/macros/s/AKfycbyEzOA4r-ReJaySgx-FJhQAm4fxKtKlrhKWSzzrJNvkmuD8Suc4YO2YbeYa9uoOJUZGCw/exec", {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formActivities),
    })
    .then(() => {
        document.getElementById("responseMessageAdd").innerText = "Data submitted successfully!";
        document.getElementById("activities_form").reset();
    })
    .catch(() => {
        document.getElementById("responseMessageAdd").innerText = "Error submitting data.";
    });
});
