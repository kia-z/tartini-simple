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
  
  const relationTypeSuggestions = {
    person: ["taught", "met", "studied", "worked_with", "authored"],
    activity: ["studied_in", "performed"],
    work: ["included_in", "performed"],
    place: ["happened_in", "born_in", "died_in"]
  }

  let multipleRelationships = [];

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

// fetch data for datalist entity
function loadSuggestionsForEntity(entity, targetElementIdOrElement = "dynamicSuggestions") {
  const datalist =
    typeof targetElementIdOrElement === "string"
      ? document.getElementById(targetElementIdOrElement)
      : targetElementIdOrElement;

  if (!datalist) {
    console.warn("No datalist found for entity:", entity);
    return;
  }
fetch(`https://script.google.com/macros/s/AKfycbzy9cEMKkU3Gow3icJDh6LQkm628rVmuZDeJIAQ-xkW7MFlQPXSn48taqyvV3jTSKQ4/exec?action=get_list&entity=${entity}`, {
    method: "GET"
})
    .then(res => res.json())
    .then(values => {
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
  fetch(`https://script.google.com/macros/s/AKfycbzy9cEMKkU3Gow3icJDh6LQkm628rVmuZDeJIAQ-xkW7MFlQPXSn48taqyvV3jTSKQ4/exec?action=get_suggestions&field=place_name`, {
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
 
// fetch data for relationship type fields  
function loadSuggestionsForRelationshipTypes(field, datalist) {
  if (!datalist) {
    console.error("Datalist element is not provided or does not exist.");
    return;
  }

  fetch(`https://script.google.com/macros/s/AKfycbzy9cEMKkU3Gow3icJDh6LQkm628rVmuZDeJIAQ-xkW7MFlQPXSn48taqyvV3jTSKQ4/exec?action=get_relations&field=relation_type`, {
    method: "GET"
  })
    .then(res => res.json())
    .then(values => {
      console.log("Fetched relationship suggestions:", values); // Debugging line
      datalist.innerHTML = ""; // Clear old entries
      values.forEach(value => {
        const option = document.createElement("option");
        option.value = value;
        datalist.appendChild(option);
      });
    })
    .catch(err => console.error("Suggestion loading error:", err));
}

// validate date format
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

    fetch(`https://script.google.com/macros/s/AKfycbzy9cEMKkU3Gow3icJDh6LQkm628rVmuZDeJIAQ-xkW7MFlQPXSn48taqyvV3jTSKQ4/exec?action=get&${queryParam}=${encodeURIComponent(name)}`, {
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

        if (["person_birth_place", "person_death_place", "activity_place", "work_place"].includes(field)) {
          const addPlaceBtn = document.createElement("button");
          addPlaceBtn.type = "button";
            addPlaceBtn.className = "btn btn-sm btn-outline-secondary mt-1";
            addPlaceBtn.innerText = "➕ Add Details to Place";
            addPlaceBtn.addEventListener("click", () => {
                const place_name = input.value;
                openRelatedEntityForm("place", place_name);
            });
            div.appendChild(addPlaceBtn);
        } 
    });

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

// relationships
const relSection = document.createElement("div");
relSection.id = "multi_relationships_section";
relSection.className = "mt-4";
relSection.innerHTML = `<h6>Add Related Entities</h6>`;
formContainer.appendChild(relSection);

addRelationshipRow(); // create first row

const addBtn = document.createElement("button");
addBtn.type = "button";
addBtn.className = "btn btn-sm btn-outline-secondary mt-2";
addBtn.innerText = "➕ Add Another Relationship";
addBtn.onclick = addRelationshipRow;
relSection.appendChild(addBtn);


    document.getElementById("form_section").style.display = "block";

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
  
// Add a new row for multiple relationships
function addRelationshipRow() {
  const container = document.getElementById("multi_relationships_section");
  const rowIndex = multipleRelationships.length;

  const row = document.createElement("div");
  row.className = "row mb-2";

  // Target name input (person/place/work)
  const input = document.createElement("input");
  input.type = "text";
  input.className = "form-control col";
  input.placeholder = "Related person/place/work name";
  input.dataset.relIndex = rowIndex;

  // Create a unique datalist for this input
  const datalistId = `rel_datalist_${rowIndex}`;
  input.setAttribute("list", datalistId);

  const datalist = document.createElement("datalist");
  datalist.id = datalistId;

  const targetEntityType = "person"; // or "place", "work", etc.
  loadSuggestionsForEntity(targetEntityType, datalist);

  // Relation type input with datalist
  const relationTypes = relationTypeSuggestions[input] || [];

  const relType = document.createElement("input");
  relType.type = "text";
  relType.className = "form-control col mx-2";
  relType.placeholder = "e.g. taught, studied_with, born_in";
  relType.setAttribute("list", "relationship_type_datalist");

  // Create the datalist for relationship types
  const datalistRel = document.createElement("datalist");
  datalistRel.id = "relationship_type_datalist";

  // Populate the datalist with options
  relationTypes.forEach(type => {
    const option = document.createElement("option");
    option.value = type;
    datalist.appendChild(option);
  });
  
  // Append elements to the row
  row.appendChild(input);
  row.appendChild(datalist);
  row.appendChild(relType);
  row.appendChild(datalistRel);
  container.appendChild(row);

  // Add to multipleRelationships array
  multipleRelationships.push({ target_id: "", relation_type: "" });

  // Add event listeners to update multipleRelationships
  input.addEventListener("input", () => {
    multipleRelationships[input.dataset.relIndex].target_id = input.value;
  });

  relType.addEventListener("relType", () => {
    multipleRelationships[input.dataset.relIndex].relation_type = relType.value;
  });
}

// relationships between entities
function injectRelationTypeSelector(targetEntity) {
  // Remove existing relation type selector if present
  const existing = document.getElementById("relationship_type_wrapper");
  if (existing) existing.remove();

  // Get the relationship types for the target entity
  const relationTypes = relationTypeSuggestions[targetEntity] || [];

  // Create a wrapper for the relationship type selector
  const wrapper = document.createElement("div");
  wrapper.id = "relationship_type_wrapper";
  wrapper.className = "mb-3";

  // Create a label for the relationship type input
  const label = document.createElement("label");
  label.innerText = "Relationship Type";
  label.setAttribute("for", "relationship_type");

  // Create the relationship type input
  const input = document.createElement("input");
  input.type = "text";
  input.id = "relationship_type";
  input.className = "form-control";
  input.setAttribute("list", "relationship_type_datalist");

  // Create the datalist for relationship types
  const datalist = document.createElement("datalist");
  datalist.id = "relationship_type_datalist";

  // Populate the datalist with options
  relationTypes.forEach(type => {
    const option = document.createElement("option");
    option.value = type;
    datalist.appendChild(option);
  });

  // Append the label, input, and datalist to the wrapper
  wrapper.appendChild(label);
  wrapper.appendChild(input);
  wrapper.appendChild(datalist);

  // Insert the wrapper into the form
  const formContainer = document.getElementById("form_section");
  const form = formContainer.querySelector("form");
  formContainer.insertBefore(wrapper, form); // Insert above the form
}

// open related entity form for adding new records
  function openRelatedEntityForm(targetEntity, sourceValue, relationType = "") {
    document.getElementById("form_section").style.display = "none";
    document.getElementById("data_table_section").style.display = "none";
    document.getElementById("fetch_section").style.display = "none";
    const currentEntity = document.getElementById("fetch_section").dataset.entity;
    const currentField =
      currentEntity === "person"
        ? "person_name"
        : currentEntity === "activity"
        ? "activity_title"
        : currentEntity === "work"
        ? "work_title"
        : currentEntity === "place"
        ? "place_name"
        : null;

        const sourceIdInput = document.getElementById(currentField);
        const sourceId = sourceIdInput ? sourceIdInput.value : "unknown";
  
  // Save current form (optional)
    saveCurrentForm("edit", currentEntity) // or "add", depending on context
    .then(() => {
    // Build the new form
      renderFormFields(targetEntity);
      injectRelationTypeSelector(targetEntity);
      
  // Prefill the place_name if creating a place
  if (targetEntity === "place" && sourceValue) {
    const placeInput = document.getElementById("place_name");
    if (placeInput) placeInput.value = sourceValue;
  }

   // Prefill the people_involved if departing from a person form
   if ((targetEntity === "activity" || targetEntity === "work") && sourceValue) {
    const peopleInput = document.getElementById(`${targetEntity}_people_involved`);
    if (peopleInput) peopleInput.value = sourceValue;
  }

    // store relationship globally
    window.pendingRelationship = {
      source_entity: currentEntity,
      source_id: sourceId,
      relation_type: relationType,
      target_entity: targetEntity
    };

    // Setup the correct submission behavior for the new form
  setupDynamicButton("add", targetEntity);
})
.catch(err => {
  console.log("Form save was cancelled or failed:", err);
  alert("Failed to save current form. Please try again.");
  // do nothing, stay on current form
});
}
  
// save new data before switching form
function saveCurrentForm(mode, entity) {
  return new Promise((resolve, reject) => {
    let valid = true;
    const payload = {
      action: mode === "edit" ? "edit" + pluralEntities[entity] : "add" + pluralEntities[entity]
    };

    entityFields[entity].forEach(field => {
      const el = document.getElementById(field);
      if (el) {
        payload[field] = el.value;

        console.log("Data to payload:", payload);

          // Validate date fields
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

    if (!valid) {
      alert("Please correct invalid date fields (should be DD-MM-YYYY or MM-YYYY or YYYY).");
      return;
    }

  if (!confirm("Do you want to save this record before proceeding?")) {
    return reject("User cancelled save");
  }

  console.log("Saving these data:", payload);
  fetch("https://script.google.com/macros/s/AKfycbzy9cEMKkU3Gow3icJDh6LQkm628rVmuZDeJIAQ-xkW7MFlQPXSn48taqyvV3jTSKQ4/exec", {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
  })
  .then(() => {
    alert("Record saved successfully! Now continuing.");
    resolve(payload); // optional: return saved data
  })
  .catch(error => {
    console.error("Save failed:", error);
    alert("Could not save data. Please try again.");
    reject(error);
  });
});
}

// setup dynamic button for form submission
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
        
        // Gather form data and validate
        entityFields[entity].forEach(field => {
          const el = document.getElementById(field);
          if (el) {
              payload[field] = el.value;
              console.log("Final cleaned payload:", payload);

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

        if (!valid) {
          alert("Please correct invalid date fields (use DD-MM-YYYY format).");
          return;
        } else if (!confirm(`Are you sure you want to ${mode} this record?`)) {
          return;
        }

        // Submit the main entity
        console.log("Final payload before submission:", payload);

        fetch("https://script.google.com/macros/s/AKfycbzy9cEMKkU3Gow3icJDh6LQkm628rVmuZDeJIAQ-xkW7MFlQPXSn48taqyvV3jTSKQ4/exec", {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
            .then(data => {
                alert(`Record ${mode === "edit" ? "updated" : "added"} successfully!`);
                document.getElementById("my_form").reset();
        
            const sourceId =
            payload[`${entity}_name`] ||
            payload[`${entity}_title`] ||
            "unknown";

        // Then handle pending relationship
        if (window.pendingRelationship) {       
          const relationInput = document.getElementById("relationship_type");
          const relationType = relationInput?.value?.trim() || "related_to";
        
          const rel = {
            ...window.pendingRelationship,
            relation_type: relationType,
            target_id: sourceId
          };
          console.log("Submitting single relationship:", rel);
  
          return fetch("https://script.google.com/macros/s/AKfycbzy9cEMKkU3Gow3icJDh6LQkm628rVmuZDeJIAQ-xkW7MFlQPXSn48taqyvV3jTSKQ4/exec", {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "addRelationship",
              ...rel
            })
          });
          window.pendingRelationship = null;
        }

        // Then: handle multiple relationship entries from section
        if (multipleRelationships && multipleRelationships.length > 0) {
          multipleRelationships.forEach(rel => {
            if (rel.target_id && rel.relation_type) {
              const relationshipPayload = {
                action: "addRelationship",
                source_entity: entity,
                source_id: sourceId,
                target_entity: "person", // customize if needed
                target_id: rel.target_id,
                relation_type: rel.relation_type
              };

              console.log("Submitting multi-relationship:", relationshipPayload);
              
              fetch("https://script.google.com/macros/s/AKfycbzy9cEMKkU3Gow3icJDh6LQkm628rVmuZDeJIAQ-xkW7MFlQPXSn48taqyvV3jTSKQ4/exec", {
                method: "POST",
                mode: "no-cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  action: "addRelationship",
                  ...relationshipPayload
                })
              });
            }
          });
          multipleRelationships = []; // reset
        }
      })
      .catch(error => {
        console.error("Error submitting data:", error);
        alert("Error submitting data.");
      });
  };
}
});