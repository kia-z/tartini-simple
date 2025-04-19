async function submitSubplaces(payload, entity) {
  const subPlaceFields = ["person_birth_place", "person_death_place", "activity_place", "work_place"];
  const placeRequests = [];

  subPlaceFields.forEach(baseField => {
    // Attach to payload in case you're using it later
    ["place_country", "place_lat", "place_long", "place_geonames"].forEach(placeField => {
      const input = document.getElementById(`${baseField}_${placeField}`);
      if (input && input.value.trim()) {
        payload[`${baseField}_${placeField}`] = input.value.trim();
      }
    });

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

      const request = fetch("https://script.google.com/macros/s/AKfycbyiWuECCOa4UvjCen7jDNFC-VKQ4Zcv8NAAwJWVVOCLaKHFCLLUj1ezCvp1W5Avov3b1Q/exec", {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(placePayload)
      });

      placeRequests.push(request);
    }
  });

  if (placeRequests.length > 0) {
    await Promise.all(placeRequests);
    console.log("Subform places submitted.");
  } else {
    console.log("No subform places to submit.");
  }
}
