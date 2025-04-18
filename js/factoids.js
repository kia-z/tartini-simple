let multipleFactoids = [];

function addFactoidRow() {
    const container = document.getElementById("factoids_section");
    const rowIndex = multipleFactoids.length;
  
    const wrapper = document.createElement("div");
    wrapper.className = "p-3 mb-3 border rounded bg-light";
  
    const row1 = document.createElement("div");
    row1.className = "row mb-2";
  
    const row2 = document.createElement("div");
    row2.className = "row mb-2";
  
    const row3 = document.createElement("div");
    row3.className = "row mb-2";
  
    // Target ID input
    const target_id = document.createElement("input");
    target_id.type = "text";
    target_id.className = "form-control col";
    target_id.placeholder = "Who is this factoid about?";
    target_id.dataset.FactoidIndex = rowIndex;
  
    // Source ID input
    const source_id = document.createElement("input");
    source_id.type = "text";
    source_id.className = "form-control col";
    source_id.placeholder = "Who is the source? Who said this?";
    source_id.dataset.FactoidIndex = rowIndex;
  
    // Datalist for both
    const datalistId = `factoid_datalist_${rowIndex}`;
    target_id.setAttribute("list", datalistId);
    source_id.setAttribute("list", datalistId);
    const datalist = document.createElement("datalist");
    datalist.id = datalistId;
    loadSuggestionsForEntity("person", datalist);
  
    // Relationship type
    const factoid_relationship_type = document.createElement("input");
    factoid_relationship_type.type = "text";
    factoid_relationship_type.className = "form-control col";
    factoid_relationship_type.placeholder = "What is the statement?";
    factoid_relationship_type.dataset.FactoidIndex = rowIndex;
  
    // Source (textual)
    const factoid_source = document.createElement("input");
    factoid_source.type = "text";
    factoid_source.className = "form-control col";
    factoid_source.placeholder = "Reference for this factoid?";
    factoid_source.dataset.FactoidIndex = rowIndex;
  
    // Date from
    const factoid_date_from = document.createElement("input");
    factoid_date_from.type = "text";
    factoid_date_from.className = "form-control col";
    factoid_date_from.placeholder = "Earliest date?";
    factoid_date_from.dataset.FactoidIndex = rowIndex;
  
    // Date to
    const factoid_date_to = document.createElement("input");
    factoid_date_to.type = "text";
    factoid_date_to.className = "form-control col";
    factoid_date_to.placeholder = "Latest date?";
    factoid_date_to.dataset.FactoidIndex = rowIndex;
  
    // Notes
    const factoid_notes = document.createElement("textarea");
    factoid_notes.className = "form-control col";
    factoid_notes.placeholder = "Any additional notes?";
    factoid_notes.rows = 2;
    factoid_notes.dataset.FactoidIndex = rowIndex;
  
    // Append inputs to rows
    row1.appendChild(target_id);
    row1.appendChild(source_id);
  
    row2.appendChild(factoid_relationship_type);
    row2.appendChild(factoid_source);
  
    row3.appendChild(factoid_date_from);
    row3.appendChild(factoid_date_to);
  
    // Append all to wrapper
    wrapper.appendChild(row1);
    wrapper.appendChild(row2);
    wrapper.appendChild(row3);
    wrapper.appendChild(factoid_notes);
    wrapper.appendChild(datalist);
    container.appendChild(wrapper);
  
    // Init tracking
    multipleFactoids.push({
      factoid_target_id: "",
      factoid_source_id: "",
      factoid_relationship_type: "",
      factoid_source: "",
      factoid_date_from: "",
      factoid_date_to: "",
      factoid_notes: ""
    });  
  
    // Tracking events
    target_id.addEventListener("input", () => {
      multipleFactoids[rowIndex].factoid_target_id = target_id.value;
    });
  
    source_id.addEventListener("input", () => {
      multipleFactoids[rowIndex].factoid_source_id = source_id.value;
    });
  
    factoid_relationship_type.addEventListener("input", () => {
      multipleFactoids[rowIndex].factoid_relationship_type = factoid_relationship_type.value;
    });
  
    factoid_source.addEventListener("input", () => {
      multipleFactoids[rowIndex].factoid_source = factoid_source.value;
    });
  
    factoid_date_from.addEventListener("input", () => {
      multipleFactoids[rowIndex].factoid_date_from = factoid_date_from.value;
    });
  
    factoid_date_to.addEventListener("input", () => {
      multipleFactoids[rowIndex].factoid_date_to = factoid_date_to.value;
    });
  
    factoid_notes.addEventListener("input", () => {
      multipleFactoids[rowIndex].factoid_notes = factoid_notes.value;
    });
  }
  