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
    ],
    relationship: [
      "timestamp",
      "relation_source_entity",
      "relation_source_id",	
      "relation_type",	
      "relation_target_entity",	
      "relation_target_id"
    ],
    factoid: [
      "timestamp",
      "factoid_source_entity",
      "factoid_source_id",
      "factoid_target_entity",
      "factoid_target_id",
      "factoid_relationship_type",
      "factoid_source",
      "factoid_date_from",
      "factoid_date_to",
      "factoid_notes"
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
    place: "Places",
    factoid: "Factoids"
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
    work: ["included_in", "performed", "referenced_in", "composer_of", "copied", "performed_in"],
    place: ["happened_in", "born_in", "died_in"]
  }

  const peopleBeingAdded = new Set(); // globally declared
  const peopleInSuggestions = [];

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
