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
  saveCurrentForm("edit", currentEntity, true) // or "add", depending on context
    .then(() => {
    // Build the new form
      renderFormFields(targetEntity);
      injectRelationTypeSelector(targetEntity);
      
  // Prefill the place_name if creating a place
  if (targetEntity === "place" && sourceValue) {
    const placeInput = document.getElementById("place_name");
    if (placeInput) placeInput.value = sourceValue;
  }

  // Prefill the peson_name if creating a person
  if (targetEntity === "person" && sourceValue) {
    const personInput = document.getElementById("person_name");
    if (personInput) personInput.value = sourceValue;
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
  
// validate new data and build payload for submission
function buildFormPayload(mode, entity) {
  let valid = true;

  const payload = {
    action: mode === "edit" ? "edit" + pluralEntities[entity] : "add" + pluralEntities[entity]
  };

  entityFields[entity].forEach(field => {
    const el = document.getElementById(field);
    if (el) {
      const value = el.value.trim();
      payload[field] = value;

      // Validate date fields
      if (field.includes("date") && value !== "") {
        if (!isValidDate(value)) {
          el.classList.add("is-invalid");
          valid = false;
        } else {
          el.classList.remove("is-invalid");

          const isPartialDate = /^\d{4}$/.test(value) || /^\d{2}-\d{4}$/.test(value);
          if (isPartialDate) {
            const confirmPartial = confirm(`The date "${value}" is incomplete. Do you want to proceed?`);
            if (!confirmPartial) {
              valid = false;
            }
          }
        }
      }
    }
  });

  // Optional: include sub-place fields if relevant
  const subPlaceFields = ["person_birth_place", "person_death_place", "activity_place", "work_place"];
  subPlaceFields.forEach(baseField => {
    ["place_country", "place_lat", "place_long", "place_geonames"].forEach(placeField => {
      const subInput = document.getElementById(`${baseField}_${placeField}`);
      if (subInput && subInput.value.trim()) {
        payload[`${baseField}_${placeField}`] = subInput.value.trim();
      }
    });

    const placeNameInput = document.getElementById(`${baseField}_place_name`);
    if (placeNameInput && placeNameInput.value.trim()) {
      payload[`${baseField}_place_name`] = placeNameInput.value.trim();
    }
  });

  if (!valid) {
    alert("Please correct invalid date fields (should be DD-MM-YYYY, MM-YYYY, or YYYY).");
    return null;
  }

  return payload;
}
 
// submit new data before switching form
async function saveCurrentForm(mode, entity) {
  try {
    // 1. Build and validate the form data
    const payload = buildFormPayload(mode, entity);
    if (!payload) throw new Error("Form validation failed.");

    // 2. Confirm intent
    if (!confirm("Do you want to add this record before proceeding?")) {
      throw new Error("User cancelled submission.");
    }

    // 3. Submit form and related data
    await submitForm(mode, entity, payload);
    await submitSubplaces(payload, entity);
    await submitFactoid(payload, entity);
    await submitRelationship(payload, entity);

    // 4. Clean up
    document.getElementById("my_form").reset();
    multipleFactoids = [];
    window.pendingRelationship = null;

    console.log("All data submitted and cleaned up.");
    return payload;

  } catch (err) {
    console.error("Save failed:", err);
    alert("Could not save data. Please fix any issues and try again.");
    throw err;
  }
}
