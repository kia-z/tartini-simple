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

  await fetch("https://script.google.com/macros/s/AKfycbyiWuECCOa4UvjCen7jDNFC-VKQ4Zcv8NAAwJWVVOCLaKHFCLLUj1ezCvp1W5Avov3b1Q/exec", {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(relationshipPayload)
  });

  window.pendingRelationship = null;
  console.log("Relationship submitted.");
}
