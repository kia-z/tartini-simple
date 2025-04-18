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
  fetch(`https://script.google.com/macros/s/AKfycbyiWuECCOa4UvjCen7jDNFC-VKQ4Zcv8NAAwJWVVOCLaKHFCLLUj1ezCvp1W5Avov3b1Q/exec?action=get_list&entity=${entity}`, {
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
    fetch(`https://script.google.com/macros/s/AKfycbyiWuECCOa4UvjCen7jDNFC-VKQ4Zcv8NAAwJWVVOCLaKHFCLLUj1ezCvp1W5Avov3b1Q/exec?action=get_suggestions&field=place_name`, {
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

// fetch data for place details fields
let PlaceDetailsRecords = [];

function loadSuggestionsForPlaceDetails() {
  fetch(`https://script.google.com/macros/s/AKfycbyiWuECCOa4UvjCen7jDNFC-VKQ4Zcv8NAAwJWVVOCLaKHFCLLUj1ezCvp1W5Avov3b1Q/exec?action=get_suggestions`, {
    method: "GET"
  })
  .then(res => res.json())
  .then(data => {
    PlaceDetailsRecords = data; // store full records

    ["person_birth_place", "person_death_place", "activity_place", "work_place"].forEach(field => {
      const datalist = document.getElementById(`${field}_datalist`);
      if (!datalist) {
        return;
      }
      datalist.innerHTML = "";

      PlaceDetailsRecords.forEach(record => {
        const option = document.createElement("option");
        option.value = record.place_name; // Or customize with more info
        datalist.appendChild(option);
      });
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
  
    fetch(`https://script.google.com/macros/s/AKfycbyiWuECCOa4UvjCen7jDNFC-VKQ4Zcv8NAAwJWVVOCLaKHFCLLUj1ezCvp1W5Avov3b1Q/exec?action=get_relations&field=relation_type`, {
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