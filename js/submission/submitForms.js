async function submitForm(mode, entity, payload) {
  console.log("Submitting entity:", entity, "with payload:", payload);

  await fetch("https://script.google.com/macros/s/AKfycbyiWuECCOa4UvjCen7jDNFC-VKQ4Zcv8NAAwJWVVOCLaKHFCLLUj1ezCvp1W5Avov3b1Q/exec", {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  alert(`Main record ${mode === "edit" ? "updated" : "added"} successfully.`);
}
