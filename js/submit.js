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
          alert("Please correct invalid date fields (use DD-MM-YYYY format).");
          return;
        } else if (!confirm(`Are you sure you want to ${mode} this record?`)) {
          return;
        }

        // Submit the main entity
        console.log("Final payload before submission:", payload);

        fetch("https://script.google.com/macros/s/AKfycbyiWuECCOa4UvjCen7jDNFC-VKQ4Zcv8NAAwJWVVOCLaKHFCLLUj1ezCvp1W5Avov3b1Q/exec", {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
            .then(data => {
                alert(`Record ${mode === "edit" ? "updated" : "added"} successfully!`);
    })
                .then(() => {
 
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
            
                        console.log("Submitting place subform:", placePayload);
                
                        fetch("https://script.google.com/macros/s/AKfycbyiWuECCOa4UvjCen7jDNFC-VKQ4Zcv8NAAwJWVVOCLaKHFCLLUj1ezCvp1W5Avov3b1Q/exec", {
                          method: "POST",
                          mode: "no-cors",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify(placePayload)
                        }).then(() => {
                          console.log("Subform place added.");
                          document.getElementById("my_form").reset();
                        }).catch(err => {
                          console.error("Failed to add place subform:", err);
                        });
                      }
                    });
                  }
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
        
                return fetch("https://script.google.com/macros/s/AKfycbyiWuECCOa4UvjCen7jDNFC-VKQ4Zcv8NAAwJWVVOCLaKHFCLLUj1ezCvp1W5Avov3b1Q/exec", {
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
            })
            .then(() => {
              console.log("Single relationship submitted.");

              // Handle factoids
              if (multipleFactoids && multipleFactoids.length > 0) {
                const factoidRequests = multipleFactoids.filter(f => f.factoid_target_id && f.factoid_relationship_type);
                
                factoidRequests.forEach(factoid => {
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
                // Wait for all factoids to finish submitting
                return Promise.all(factoidRequests)
                  .then(() => {
                    console.log("All factoids submitted.");
                    multipleFactoids = [];
                    alert("Factoids added!");
                  })
                  .catch(err => {
                    console.error("Failed to submit one or more factoids:", err);
                    alert("Error while submitting factoids.");
                  });
              }
            })
            document.getElementById("my_form").reset();
            console.log("Form reset after submission.");
           };
}