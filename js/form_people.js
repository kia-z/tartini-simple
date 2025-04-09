document.getElementById("people_form").addEventListener("submit", function (e) {
    e.preventDefault();

    // remember! the first name is the one in google spreadsheet, the second one is the ID in the html form
    const formPeople = {
        action: "addPeople", 
        name: document.getElementById("person_name").value,
        alternative_names: document.getElementById("person_altName").value,
        identifiers: document.getElementById("person_ids").value,
        roles: document.getElementById("person_role").value,
        birth_date: document.getElementById("birthDate").value,
        birth_place: document.getElementById("birthPlace").value,
        death_date: document.getElementById("deathDate").value,
        death_place: document.getElementById("deathPlace").value,
        sources: document.getElementById("person_reference").value
    };

    fetch("https://script.google.com/macros/s/AKfycbyEzOA4r-ReJaySgx-FJhQAm4fxKtKlrhKWSzzrJNvkmuD8Suc4YO2YbeYa9uoOJUZGCw/exec", {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formPeople),
    })
    .then(() => {
        document.getElementById("responseMessageAdd").innerText = "Data submitted successfully!";
        document.getElementById("people_form").reset();
    })
    .catch(() => {
        document.getElementById("responseMessageAdd").innerText = "Error submitting data.";
    });
});