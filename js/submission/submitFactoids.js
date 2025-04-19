async function submitFactoid(payload, entity) {
  const allOptions = document.querySelectorAll("datalist option");
  const peopleInSuggestions = new Set([...allOptions].map(o => o.value.toLowerCase()));

  // Add the currently filled-in person manually
  const currentPersonName = document.getElementById("person_name")?.value?.trim().toLowerCase();
  if (currentPersonName) {
    peopleInSuggestions.add(currentPersonName);
  }
    const unknownPeople = [];

  multipleFactoids.forEach(f => {
    if (f.factoid_target_id && !peopleInSuggestions.has(f.factoid_target_id.toLowerCase())) {
      unknownPeople.push(f.factoid_target_id);
    }
    if (f.factoid_source_id && !peopleInSuggestions.has(f.factoid_source_id.toLowerCase())) {
      unknownPeople.push(f.factoid_source_id);
    }
  });
  
  if (unknownPeople.length > 0) {
    const names = [...new Set(unknownPeople)].join(", ");
    const confirmAdd = confirm(`${names} not found in the database. Do you want to add them now?`);
    if (confirmAdd) {
      const firstMissing = unknownPeople[0];
      peopleInSuggestions.add(firstMissing.toLowerCase());
    
      // Visually update all datalists
      document.querySelectorAll("datalist[id^='factoid_datalist_']").forEach(datalist => {
        const exists = [...datalist.options].some(opt => opt.value.toLowerCase() === firstMissing.toLowerCase());
        if (!exists) {
          const opt = document.createElement("option");
          opt.value = firstMissing;
          datalist.appendChild(opt);
        }
      });
    
      // Open subform after short delay
      setTimeout(() => {
        openRelatedEntityForm("person", firstMissing);
      }, 500);
    } 
  }

  const factoidRequests = multipleFactoids
    .filter(f => f.factoid_target_id && f.factoid_relationship_type)
    .map((factoid, index) => {
      const fromInput = document.getElementById(`factoid_date_from_${index}`);
      const toInput = document.getElementById(`factoid_date_to_${index}`);

      fromInput?.classList.remove("invalid");
      toInput?.classList.remove("invalid");

      if (factoid.factoid_date_from && !isValidDate(factoid.factoid_date_from)) {
        fromInput?.classList.add("invalid");
        fromInput?.focus();
        throw new Error(`Invalid From Date: ${factoid.factoid_date_from}`);
      }

      if (factoid.factoid_date_to && !isValidDate(factoid.factoid_date_to)) {
        toInput?.classList.add("invalid");
        toInput?.focus();
        throw new Error(`Invalid To Date: ${factoid.factoid_date_to}`);
      }

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

      return fetch("https://script.google.com/macros/s/AKfycbyiWuECCOa4UvjCen7jDNFC-VKQ4Zcv8NAAwJWVVOCLaKHFCLLUj1ezCvp1W5Avov3b1Q/exec", {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(factoidPayload)
      });
    });

  if (factoidRequests.length > 0) {
    await Promise.all(factoidRequests);
    console.log("All factoids submitted.");
    alert("Factoids added!");
  } else {
    console.log("No factoids to submit.");
  }
}
