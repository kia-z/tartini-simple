document.addEventListener("DOMContentLoaded", function () {
    
    // mapping of entity types to their respective fields and labels for the form and table display
const entityFields = {
    person: [
      "timestamp",
      "person_name",
      "person_alternative_name",
      "person_birth_date",
      "person_birth_place",
      "person_death_date",
      "person_death_place",
      "person_ids",
      "person_sources"
    ],
    activity: [
      "timestamp",
      "activity_title",
      "activity_type",
      "activity_start_date",
      "activity_end_date",
      "activity_place",
      "activity_institution",
      "activity_instrument_played",
      "activity_testimonies",
      "activity_sources",
      "activity_people_involved",
      "activity_works_references"
    ],
    work: [
      "timestamp",
      "work_title",
      "work_type",
      "work_subtype",
      "work_people_involved",
      "work_performance",
      "work_place",
      "work_sources",
      "work_date"
    ],
    place: [
      "timestamp",
      "place_name",
      "place_country",
      "place_lat",
      "place_long",
      "place_geonames"
    ]
  };
  
  const fieldLabels = {
    timestamp: "Timestamp",
    person_name: "Name",
    person_alternative_name: "Alternative Name",
    person_birth_date: "Birth Date",
    person_birth_place: "Birth Place",
    person_death_date: "Death Date",
    person_death_place: "Death Place",
    person_ids: "External IDs",
    person_sources: "Sources",
    activity_title: "Title",
    activity_type: "Type",
    activity_start_date: "Start Date",
    activity_end_date: "End Date",
    activity_place: "Place",
    activity_institution: "Institution",
    activity_instrument_played: "Instrument Played",
    activity_testimonies: "Testimonies",
    activity_sources: "Sources",
    activity_people_involved: "People Involved",
    activity_works_references: "Works Referenced",
    work_title: "Title",
    work_type: "Type",
    work_subtype: "Subtype",
    work_people_involved: "People Involved",
    work_performance: "Performance Info",
    work_place: "Place",
    work_sources: "Sources",
    work_date: "Date",
    place_name: "Place Name",
    place_country: "Country",
    place_lat: "Latitude",
    place_long: "Longitude",
    place_geonames: "Geonames ID"
  };
  
  const pluralEntities = {
    person: "People",
    activity: "Activities",
    work: "Works",
    place: "Places"
  };


  // fetch data for the selected entity type
  document.getElementById("fetch_for_me").addEventListener("click", function () {
    const name = document.getElementById("my_search").value.trim();
    const entity = document.getElementById("fetch_section").dataset.entity;

    if (!name || !entity) {
        alert("Please enter a name and select a type.");
        return;
    }

    fetchEntityData(entity, name);
});

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

    fetch(`https://script.google.com/macros/s/AKfycbzRowr7Of6C-uNT75rHKGAv6Gbo1StSOOaorWxnmhbjnp2-empw5HuF-TozxbmHqywCaQ/exec?action=get&${queryParam}=${encodeURIComponent(name)}`, {
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
            return
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            document.getElementById("fetch_response").innerText = "Record does not exist in the database";
        });
}

  // render table with existing data
  function renderDataTable(entity, data) {
    const tableSection = document.getElementById("data_table_section");
    const tableBody = document.getElementById("data_table_body");

    if (!tableSection || !tableBody) {
        console.error("Table section or body not found in the DOM.");
        return;
    }

    console.log("Rendering table for entity:", entity, "with data:", data);

    tableBody.innerHTML = "";

    entityFields[entity].forEach(field => {
        const row = document.createElement("tr");
        const labelCell = document.createElement("td");
        labelCell.textContent = fieldLabels[field] || field;
        const valueCell = document.createElement("td");
        valueCell.textContent = data[field] || "";
        row.appendChild(labelCell);
        row.appendChild(valueCell);
        tableBody.appendChild(row);
    });

    tableSection.style.display = "block";
  }
  
  // render form fields for all entities
  function renderFormFields(entity) {
    const formContainer = document.getElementById("form_fields");

    if (!formContainer) {
        console.error("Form container not found in the DOM.");
        return;
    }

    console.log("Rendering form fields for entity:", entity);

    formContainer.innerHTML = "";

    entityFields[entity].forEach(field => {
        if (field === "timestamp") return; // skip timestamp for input
        const div = document.createElement("div");
        div.className = "mb-3";

        const label = document.createElement("label");
        label.htmlFor = field;
        label.className = "form-label";
        label.innerText = fieldLabels[field] || field;

        const input = document.createElement("input");
        input.type = "text";
        input.className = "form-control";
        input.id = field;
        input.name = field;

        div.appendChild(label);
        div.appendChild(input);
        formContainer.appendChild(div);
    });

    document.getElementById("form_section").style.display = "block";
  }
  
  function fillFormFields(data) {
    console.log("Filling form fields with data:", data);

    for (let key in data) {
        const el = document.getElementById(key);
        if (el) {
            el.value = data[key];
        } else {
            console.warn(`Form field with ID "${key}" not found.`);
        }
    }
  }
  
  function clearFormFields(entity) {
    entityFields[entity].forEach(field => {
      const el = document.getElementById(field);
      if (el) el.value = "";
    });
  }
  

function setupDynamicButton(mode, entity) {
    const dynamicBtn = document.getElementById("dynamic_btn");

    if (!dynamicBtn) {
        console.error("Dynamic button not found in the DOM.");
        return;
    }

    console.log("Setting up dynamic button with mode:", mode, "and entity:", entity);

    dynamicBtn.innerText = "Submit";

    dynamicBtn.onclick = function () {
        const payload = {
            action: mode === "edit" ? "edit" + pluralEntities[entity] : "add" + pluralEntities[entity]
        };
        entityFields[entity].forEach(field => {
            const el = document.getElementById(field);
            if (el) payload[field] = el.value;
        });
        console.log("Payload:", payload);

        if (!confirm(`Are you sure you want to ${mode} this record?`)) return;

        fetch("https://script.google.com/macros/s/AKfycbzRowr7Of6C-uNT75rHKGAv6Gbo1StSOOaorWxnmhbjnp2-empw5HuF-TozxbmHqywCaQ/exec", {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
            .then(data => {
                alert(`Record ${mode === "edit" ? "updated" : "added"} successfully!`);
                document.getElementById("my_form").reset();
            })
            .catch(error => {
                console.error("Error submitting data:", error);
                alert("Error submitting data.");
            });
    };
}
});