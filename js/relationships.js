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
