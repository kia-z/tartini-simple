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

  const entityButtons = {
    person: {
      heading: "Check if this person already exists",
      description: "Enter the name of the pupil/musician...",
      label: "Enter Name to Fetch:",
      placeholder: "e.g. Giuseppe Tartini"
    },
    activity: {
      heading: "Check if this activity already exists",
      description: "Enter the name or description of the activity...",
      label: "Enter Activity Name:",
      placeholder: "e.g. Studied in Padua"
    },
    work: {
      heading: "Check if this work already exists",
      description: "Enter the title or short description of the work...",
      label: "Enter Work Title:",
      placeholder: "e.g. Sonata in G Major"
    },
    place: {
      heading: "Check if this place already exists",
      description: "Enter the name of the place to look up or add.",
      label: "Enter Place Name:",
      placeholder: "e.g. Venice"
    }
  };
  
    Object.keys(entityButtons).forEach(entity => {
      const button = document.getElementById(entity);
      if (button) {
        button.addEventListener("click", () => {
          const section = document.getElementById("fetch_section");
          section.style.display = "block";
  
          // Update content dynamically
          document.getElementById("step2_heading").textContent = entityButtons[entity].heading;
          document.getElementById("step2_description").textContent = entityButtons[entity].description;
          document.getElementById("search_label").textContent = entityButtons[entity].label;
          document.getElementById("entity_search_input").placeholder = entityButtons[entity].placeholder;
  
          section.dataset.entity = entity;
  
          // Load suggestions dynamically
          loadSuggestionsForEntity(entity);
        });
      }
    });

// fetch data for datalist
function loadSuggestionsForEntity(entity) {
  fetch(`https://script.google.com/macros/s/AKfycbz7QniyposSC7M4rhpzLHnpihg9o_JmlZY7euqPJsIVtlPyMKzI4VbQCD419uIw9HRazQ/exec?action=get_list&entity=${entity}`, {
    method: "GET"
})
    .then(res => res.json())
    .then(values => {
      const datalist = document.getElementById("dynamicSuggestions");
      datalist.innerHTML = ""; // Clear old entries
      values.forEach(value => {
        const option = document.createElement("option");
        option.value = value;
        datalist.appendChild(option);
      });
    })
    .catch(err => console.error("Suggestion loading error:", err));
}

// fetch data for place-related fields  
function loadSuggestionsForPlaceField(field, datalist) {
  fetch(`https://script.google.com/macros/s/AKfycbz7QniyposSC7M4rhpzLHnpihg9o_JmlZY7euqPJsIVtlPyMKzI4VbQCD419uIw9HRazQ/exec?action=get_suggestions&field=place_name`, {
      method: "GET"
  })
  .then(res => res.json())
    .then(values => {
      console.log("Fetched place suggestions:", values); // Debugging line
      datalist.innerHTML = ""; // Clear old entries
      values.forEach(value => {
        const option = document.createElement("option");
        option.value = value;
        datalist.appendChild(option);
      });
    })
    .catch(err => console.error("Suggestion loading error:", err));
}
         
  // fetch data for the selected entity type
  document.getElementById("fetch_for_me").addEventListener("click", function () {
    const name = document.getElementById("entity_search_input").value.trim();
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

    fetch(`https://script.google.com/macros/s/AKfycbz7QniyposSC7M4rhpzLHnpihg9o_JmlZY7euqPJsIVtlPyMKzI4VbQCD419uIw9HRazQ/exec?action=get&${queryParam}=${encodeURIComponent(name)}`, {
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
  
  // render form fields for selected entity 
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
        input.placeholder = field.includes("date") ? "DD-MM-YYYY" : "";

        if (field.includes("date")) {
          const feedback = document.createElement("div");
          feedback.className = "invalid-feedback";
          feedback.innerText = "Please enter a valid date (DD-MM-YYYY).";
          div.appendChild(feedback);
      }

 // Add a datalist for place-related fields (e.g., death_place)
 if (["person_birth_place", "person_death_place", "activity_place", "work_place"].includes(field)) {
  const datalistId = `${field}_datalist`;
  input.setAttribute("list", datalistId);
  input.placeholder = "Start typing a place...";

  const datalist = document.createElement("datalist");
  datalist.id = datalistId;

  // Dynamically populate the datalist
  loadSuggestionsForPlaceField(field, datalist);
  div.appendChild(datalist);
}    

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
  
  function isValidDate(input) {
    const fullDateRegex = /^\d{2}-\d{2}-\d{4}$/; // DD-MM-YYYY
    const yearMonthRegex = /^\d{2}-\d{4}$/; // MM-YYYY
    const yearOnlyRegex = /^\d{4}$/; // YYYY

    if (fullDateRegex.test(input)) {
        const [day, month, year] = input.split("-").map(Number);
        const date = new Date(year, month - 1, day);
        return (
            date.getFullYear() === year &&
            date.getMonth() === month - 1 &&
            date.getDate() === day
        );
    } else if (yearMonthRegex.test(input)) {
        const [month, year] = input.split("-").map(Number);
        return month >= 1 && month <= 12 && year > 0;
    } else if (yearOnlyRegex.test(input)) {
        const year = Number(input);
        return year > 0;
    }

    return false; // Invalid format
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
        let valid = true;
        const payload = {
            action: mode === "edit" ? "edit" + pluralEntities[entity] : "add" + pluralEntities[entity]
        };
        entityFields[entity].forEach(field => {
            const el = document.getElementById(field);
            if (el) {
                payload[field] = el.value;

                // Validate date fields
                if (field.includes("date") && el.value.trim() !== "") {
                    if (!isValidDate(el.value.trim())) {
                        el.classList.add("is-invalid");
                        valid = false;
                    } else {
                        el.classList.remove("is-invalid");

                        // Check for partial dates and confirm with the user
                        const isPartialDate = /^\d{4}$/.test(el.value.trim()) || /^\d{2}-\d{4}$/.test(el.value.trim());
                        if (isPartialDate) {
                            const confirmPartial = confirm(`The date "${el.value}" is incomplete. Do you want to proceed?`);
                            if (!confirmPartial) {
                                valid = false;
                            }
                        }
                    }
                }
            }
        });
        console.log("Payload:", payload);

        if (!valid) {
          alert("Please correct invalid date fields (use DD-MM-YYYY format).");
          return;
        } else if (!confirm(`Are you sure you want to ${mode} this record?`)) return;

        fetch("https://script.google.com/macros/s/AKfycbz7QniyposSC7M4rhpzLHnpihg9o_JmlZY7euqPJsIVtlPyMKzI4VbQCD419uIw9HRazQ/exec", {
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