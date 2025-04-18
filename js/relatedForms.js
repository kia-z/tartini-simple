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
      alert("Please correct invalid date fields (should be DD-MM-YYYY or MM-YYYY or YYYY).");
      return;
    }

  if (!confirm("Do you want to save this record before proceeding?")) {
    return reject("User cancelled save");
  }

  console.log("Saving these data:", payload);
  fetch("https://script.google.com/macros/s/AKfycbyiWuECCOa4UvjCen7jDNFC-VKQ4Zcv8NAAwJWVVOCLaKHFCLLUj1ezCvp1W5Avov3b1Q/exec", {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
  })
.then(data => {
  alert("Record saved successfully! Now continuing.");
})
  .then(() => {
    let subformsSaved = false; 
    // Now look for any subform to submit (e.g. for places)
    if (entity === "person") {
      subPlaceFields.forEach(baseField => {
        const name = document.getElementById(`${baseField}_place_name`)?.value?.trim();
        const country = document.getElementById(`${baseField}_place_country`)?.value?.trim();
        const lat = document.getElementById(`${baseField}_place_lat`)?.value?.trim();
        const long = document.getElementById(`${baseField}_place_long`)?.value?.trim();
        const geo = document.getElementById(`${baseField}_place_geonames`)?.value?.trim();

        if (name && (country || lat || long || geo)) {
          const placePayload = {
            action: "addPlaces",
            place_name: name,
            place_country: country || "",
            place_lat: lat || "",
            place_long: long || "",
            place_geonames: geo || ""
          };

          console.log("Saving place subform:", placePayload);
  
          fetch("https://script.google.com/macros/s/AKfycbyiWuECCOa4UvjCen7jDNFC-VKQ4Zcv8NAAwJWVVOCLaKHFCLLUj1ezCvp1W5Avov3b1Q/exec", {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(placePayload)
          }).then(() => {
            alert("Subform place saved successfully! Now continuing.");
            document.getElementById("my_form").reset();
           }).catch(err => {
            console.error("Failed to add place subform:", err);
          });
        }
      });
    }
    // Always resolve after checking for subforms
    if (!subformsSaved) {
      resolve(payload);
    }
    // save factoids if any
    let factoidsSaved = false;
if (multipleFactoids && multipleFactoids.length > 0) {
  const factoidRequests = multipleFactoids
    .filter(f => f.factoid_target_id && f.factoid_relationship_type)
    .map(factoid => {
      const factoidPayload = {
        action: "addFactoids",
        factoid_target_entity: "person",
        factoid_target_id: factoid.factoid_target_id,
        factoid_source_entity: "person",
        factoid_source_id: factoid.factoid_source_id,
        factoid_relationship_type: factoid.factoid_relationship_type,
        factoid_source: factoid.factoid_source,
        factoid_date_from: factoid.factoid_date_from,
        factoid_date_to: factoid.factoid_date_to,
        factoid_notes: factoid.factoid_notes
      };

      console.log("Submitting factoid:", factoidPayload);

      return fetch("https://script.google.com/macros/s/AKfycbyiWuECCOa4UvjCen7jDNFC-VKQ4Zcv8NAAwJWVVOCLaKHFCLLUj1ezCvp1W5Avov3b1Q/exec", {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(factoidPayload)
      });
    });

  // Wait for all factoid fetches to complete
  Promise.all(factoidRequests)
    .then(() => {
      console.log("All factoids submitted.");
      resolve(payload);  // Final resolve after factoids
    })
    .catch(err => {
      console.error("Error submitting factoids:", err);
      reject(err);
    });
} else {
  resolve(payload);  // No factoids to submit? Just resolve.
}
})
.catch(error => {
  console.error("Save failed:", error);
  alert("Could not save data. Please try again.");
  reject(error);
});
});
}