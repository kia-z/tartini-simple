async function submitRelationship(payload, entity) {
  if (!window.pendingRelationship) {
    console.log("No pending relationship to submit.");
    return;
  }

  const relationInput = document.getElementById("relationship_type");
  const relationType = relationInput?.value?.trim() || "related_to";

  const sourceId = payload[`${entity}_name`] || payload[`${entity}_title`] || "unknown";

  const relationshipPayload = {
    action: "addRelationship",
    source_entity: window.pendingRelationship.source_entity,
    source_id: window.pendingRelationship.source_id,
    target_entity: window.pendingRelationship.target_entity,
    target_id: sourceId,
    relation_type: relationType
  };

  console.log("Submitting relationship:", relationshipPayload);

  await fetch("https://script.google.com/macros/s/AKfycbyBBRlu5qk8SgG-QJhAhriKSLwLh7HJ4DH5KmUyLc2aggftNvHyB3LOKNqQC0CM2cNB3w/exec", {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(relationshipPayload)
  });

  window.pendingRelationship = null;
  console.log("Relationship submitted.");
}
