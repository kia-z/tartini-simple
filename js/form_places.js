document.getElementById("places_form").addEventListener("submit", function (e) {
    e.preventDefault();

    // remember! the first name is the one in google spreadsheet, the second one is the ID in the html form
    const formPlaces = {
        action: "addPlaces", 
        place_name: document.getElementById("place_name").value,
        region: document.getElementById("region").value,
        country: document.getElementById("country").value,
        lat: document.getElementById("lat").value,
        long: document.getElementById("long").value,
        geonames: document.getElementById("geonames").value,
        other_identifier: document.getElementById("other_identifier").value
    };  						

    fetch("https://script.google.com/macros/s/AKfycbxdrGjEONP9yLAXZN-qtX6ELfEbFMC6zq8GPZ6pzqbM03lq6Cth73w5d1emk22rMP_Hcw/exec", {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formPlaces),
    })
    .then(() => {
        document.getElementById("responseMessageAdd").innerText = "Data submitted successfully!";
        document.getElementById("places_form").reset();
    })
    .catch(() => {
        document.getElementById("responseMessageAdd").innerText = "Error submitting data.";
    });
});
