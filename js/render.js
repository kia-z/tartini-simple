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
        
        div.appendChild(label);
        div.appendChild(input);
        formContainer.appendChild(div);

        // Place-specific logic
if (["person_birth_place", "person_death_place", "activity_place", "work_place"].includes(field)) {
  const datalistId = `${field}_datalist`;
  input.setAttribute("list", datalistId);
  input.placeholder = "Start typing a place...";

  const datalist = document.createElement("datalist");
  datalist.id = datalistId;
  div.appendChild(datalist); // Attach before loading suggestions
  loadSuggestionsForPlaceField(field, datalist);

  // Add “Add Place Details” button
  const addPlaceBtn = document.createElement("button");
  addPlaceBtn.type = "button";
  addPlaceBtn.className = "btn btn-sm btn-outline-secondary mt-1 ms-2";
  addPlaceBtn.innerText = "➕ Add Details to Place";

  addPlaceBtn.addEventListener("click", () => {
    const place_name = input.value;
    const subformId = `${field}_subform`;
    const subformFieldsId = `${field}_subform_fields`;

    const subform = document.getElementById(subformId);
    const fieldContainer = document.getElementById(subformFieldsId);

    if (subform && fieldContainer) {
      subform.style.display = "block";
      fieldContainer.innerHTML = "";

      // Generate inline subfields
      ["place_country", "place_lat", "place_long", "place_geonames"].forEach(placeField => {
        const subDiv = document.createElement("div");
        subDiv.className = "mb-2";

        const subLabel = document.createElement("label");
        subLabel.innerText = fieldLabels[placeField] || placeField;

        const subInput = document.createElement("input");
        subInput.type = "text";
        subInput.className = "form-control";
        subInput.id = `${field}_${placeField}`;

        subDiv.appendChild(subLabel);
        subDiv.appendChild(subInput);
        fieldContainer.appendChild(subDiv);
      });

      // Add hidden field for place name
      const placeNameField = document.createElement("input");
      placeNameField.type = "hidden";
      placeNameField.id = `${field}_place_name`;
      placeNameField.value = place_name;
      fieldContainer.appendChild(placeNameField);
      prefillPlaceDetails(place_name, field); // Prefill place details if available
    }

  });

  div.appendChild(addPlaceBtn);

  // Subform container
  const subformContainer = document.createElement("div");
  subformContainer.className = "bg-light border rounded p-3 mt-2";
  subformContainer.id = `${field}_subform`;
  subformContainer.style.display = "none";

  const subformFields = document.createElement("div");
  subformFields.id = `${field}_subform_fields`;
  subformContainer.appendChild(subformFields);

  div.appendChild(subformContainer);
}

// Function to prefill place details (if available) based on place name
function prefillPlaceDetails(place_name, field) {
  const matched = PlaceDetailsRecords.find(r => r.place_name === place_name);

  if (matched) {
    ["place_country", "place_lat", "place_long", "place_geonames"].forEach(placeField => {
      const inputField = document.getElementById(`${field}_${placeField}`);
      if (inputField && matched[placeField]) {
        inputField.value = matched[placeField];
      }
    });
  } else {
    alert("Place details not found. Please enter the details manually.");
  }
}
loadSuggestionsForPlaceDetails('person_birth_place', document.getElementById('person_birth_place_datalist'));
loadSuggestionsForPlaceDetails('person_death_place', document.getElementById('person_death_place_datalist'));
loadSuggestionsForPlaceDetails('activity_place', document.getElementById('activity_place_datalist'));
loadSuggestionsForPlaceDetails('work_place', document.getElementById('work_place_datalist')); 
});
    document.getElementById("form_section").style.display = "block";

// Add extra relationship buttons at the bottom of form
const extraControls = document.createElement("div");
if (entity === "person") {
  extraControls.innerHTML = `
    <button type="button" class="btn btn-outline-secondary me-2" id="add_work_from_person">➕ Add Work by this Person</button>
    <button type="button" class="btn btn-outline-secondary" id="add_activity_from_person">➕ Add Activity by this Person</button>
  `;
} else if (entity === "activity") {
  extraControls.innerHTML = `
    <button type="button" class="btn btn-outline-secondary" id="add_work_from_activity">➕ Add Work connected to this Activity</button>
  `;
}
formContainer.appendChild(extraControls);


// === Create Section Wrapper ===
  const factoidSection = document.createElement("div");
  factoidSection.id = "factoids_section";
  factoidSection.className = "mt-4";

  const title = document.createElement("h5");
  title.textContent = "Factoids";
  factoidSection.appendChild(title);

  // === Add Factoid Button ===
  const addBtn = document.createElement("button");
  addBtn.type = "button";
  addBtn.className = "btn btn-outline-primary my-2";
  addBtn.textContent = "➕ Add Factoid";
  addBtn.onclick = addFactoidRow;
  factoidSection.appendChild(addBtn);

  formContainer.appendChild(factoidSection);

// Hook up those extra buttons
    setTimeout(() => {
      if (entity === "person") {
        const personName = document.getElementById("person_name");
        document.getElementById("add_work_from_person").addEventListener("click", () => {
          if (personName && personName.value) {
            openRelatedEntityForm("work", personName.value, "authored");
          } else {
            alert("Please enter the person's name first.");
          }
        });
        document.getElementById("add_activity_from_person").addEventListener("click", () => {
          if (personName && personName.value) {
            openRelatedEntityForm("activity", personName.value, "performed");
          } else {
            alert("Please enter the person's name first.");
          }
        });
      }
  
      if (entity === "activity") {
        const activityTitle = document.getElementById("activity_title");
        document.getElementById("add_work_from_activity").addEventListener("click", () => {
          if (activityTitle && activityTitle.value) {
            openRelatedEntityForm("work", activityTitle.value, "included_in");
          } else {
            alert("Please enter the activity title first.");
          }
        });
      }

    }, 0);

    }; // end of renderFormFields

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