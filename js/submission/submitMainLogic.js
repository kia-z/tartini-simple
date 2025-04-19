function setupDynamicButton(mode, entity) {
    const dynamicBtn = document.getElementById("dynamic_btn");
  
    if (!dynamicBtn) {
      console.error("Dynamic button not found in the DOM.");
      return;
    }
  
    dynamicBtn.innerText = "Submit";
  
    dynamicBtn.onclick = async function () {
      console.log("Dynamic button clicked. Mode:", mode, "Entity:", entity);
  
      const payload = buildFormPayload(mode, entity);
      if (!payload) return; // validation failed or user cancelled
  
      dynamicBtn.disabled = true;
      dynamicBtn.innerText = "Submitting...";
  
      try {
        await submitForm(mode, entity, payload);
        await submitSubplaces(payload, entity);
        await submitRelationship(payload, entity);
        await submitFactoid(payload, entity);
  
        alert("All data submitted.");
        document.getElementById("my_form").reset();
        multipleFactoids = [];
        window.pendingRelationship = null;
  
      } catch (err) {
        console.error("Submission flow failed:", err);
        alert("Something went wrong in the submission.");
      } finally {
        dynamicBtn.disabled = false;
        dynamicBtn.innerText = "Submit";
      }
    };
  }
  