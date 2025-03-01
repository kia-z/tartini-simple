const newDate = new Date();
        const date = newDate.getDate();
        const month = newDate.getMonth() + 1;
        const year = newDate.getFullYear();
        document.getElementById('date').textContent = `${date}-${month}-${year}`;

document.getElementById("dataForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = {
        action: "add", 
        researcher: document.getElementById("researcher").value,
        name: document.getElementById("name").value,
        date_birth: document.getElementById("birthDate").value,
        place_birth: document.getElementById("birthPlace").value,
        date_death: document.getElementById("deathDate").value,
        place_death: document.getElementById("deathPlace").value,
        start_tartini: document.getElementById("startTartini").value,
        finish_tartini: document.getElementById("finishTartini").value,
        music_composed: document.getElementById("musicComposed").value,
        orchestra_played: document.getElementById("orchestra").value,
        reference: document.getElementById("reference").value
    };

    fetch("https://script.google.com/macros/s/AKfycbxp7_K9X_2p26igmXCl8onvlY8nm_mFshc4dZcNIm8CZ4f14ShDSWJwzii05kLFAgRU/exec", {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
    })
    .then(() => {
        document.getElementById("responseMessage").innerText = "Data submitted successfully!";
        document.getElementById("dataForm").reset();
    })
    .catch(() => {
        document.getElementById("responseMessage").innerText = "Error submitting data.";
    });
});
