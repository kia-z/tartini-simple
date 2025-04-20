// event listener for the "Fetch for me" button
document.getElementById("fetch_for_me").addEventListener("click", function () {
    const name = document.getElementById("entity_search_input").value.trim();
    const entity = document.getElementById("fetch_section").dataset.entity;

    if (!name || !entity) {
        alert("Please enter a name and select a type.");
        return;
    }

    fetchEntityData(entity, name);
});

// fetch data for the selected entity type
function fetchEntityData(entity, name) {
    const queryParam = entity === "person" ? "person_name" :
                       entity === "activity" ? "activity_title" :
                       entity === "work" ? "work_title" :
                       entity === "place" ? "place_name" : null;
    console.log("fetchEntityData called with:", entity, name); // add this
    if (!queryParam) {
        alert("Invalid entity type selected.");
        console.error("Invalid entity type:", entity);
        return;
    }

    fetch(`https://script.google.com/macros/s/AKfycbyBBRlu5qk8SgG-QJhAhriKSLwLh7HJ4DH5KmUyLc2aggftNvHyB3LOKNqQC0CM2cNB3w/exec?action=get&${queryParam}=${encodeURIComponent(name)}`, {
        method: "GET"
    })
        .then(response => response.json())
        .then(data => {
            console.log("Parsed data:", data);
            if (data.error) {
                document.getElementById("fetch_response").innerText = "No data found. You can add a new record.";
                renderFormFields(entity); // render form fields for the entity
                clearFormFields(entity); // clear the form fields
                fillFormFields({ [`${entity}_name`]: name }); // pre-fill the name
                setupDynamicButton("add", entity);
                return;
              }              
            document.getElementById("fetch_response").innerText = `${entity.charAt(0).toUpperCase() + entity.slice(1)} found: ${name}`;
            renderDataTable(entity, data);
            renderFormFields(entity);
            fillFormFields(data);
            setupDynamicButton("edit", entity);
            return;
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            document.getElementById("fetch_response").innerText = "Record does not exist in the database";
        });
}
