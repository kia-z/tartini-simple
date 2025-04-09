document.getElementById("works_form").addEventListener("submit", function (e) {
    e.preventDefault();

    // remember! the first name is the one in google spreadsheet, the second one is the ID in the html form
    const formWorks = {
        action: "addWorks", 
        title: document.getElementById("title").value,
        type: document.getElementById("type").value,
        subtype: document.getElementById("subtype").value,
        start_date: document.getElementById("start_date").value,
        end_date: document.getElementById("end_date").value,
        people_involved: document.getElementById("people_involved").value,
        performances: document.getElementById("performances").value,
        places: document.getElementById("places").value,
        sources: document.getElementById("sources").value
    };

    fetch("https://script.google.com/macros/s/AKfycbxdrGjEONP9yLAXZN-qtX6ELfEbFMC6zq8GPZ6pzqbM03lq6Cth73w5d1emk22rMP_Hcw/exec", {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formWorks),
    })
    .then(() => {
        document.getElementById("responseMessageAdd").innerText = "Data submitted successfully!";
        document.getElementById("works_form").reset();
    })
    .catch(() => {
        document.getElementById("responseMessageAdd").innerText = "Error submitting data.";
    });
});
