async function submitForm(mode, entity, payload) {
  console.log("Submitting entity:", entity, "with payload:", payload);

  await fetch("https://script.google.com/macros/s/AKfycbyBBRlu5qk8SgG-QJhAhriKSLwLh7HJ4DH5KmUyLc2aggftNvHyB3LOKNqQC0CM2cNB3w/exec", {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  alert(`Main record ${mode === "edit" ? "updated" : "added"} successfully.`);
}
