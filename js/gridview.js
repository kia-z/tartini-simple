function createGrid() {
    fetch("https://script.google.com/macros/s/AKfycbyJFAZQxACQvuEf6ftM5uvv6S8xlQKdDDGD5O2EpkEe3_W8cw-dBl_impHGKy-_FJAJ/exec", { 
        method: "GET",
        mode: "no-cors",
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.type);
            }
            return response.json();
        })
        .then(data => {
            const cardGrid = document.getElementById("cardGrid");

            // Clear existing content
            cardGrid.innerHTML = '';

            // Create a card for each data entry
            data.forEach(entry => {
                const card = document.createElement("div");
                card.className = "card";
                card.innerHTML = `
                    <div class="card-body">
                        <h5 class="card-title">${entry.name}</h5>
                        <p>${entry.researcher}</p>
                        <p class="card-text">${entry.date_birth}, ${entry.place_birth} - ${entry.date_death}, ${entry.place_death}</p>
                        <p class="card-text">Period working with Tartini: ${entry.start_tartini} - ${entry.finish_tartini}</p>
                        <p class="card-text">Music composed: ${entry.music_composed}</p>
                        <p class="card-text">Orchestra played: ${entry.orchestra_played}</p>
                        <p class="card-text">Reference: ${entry.reference}</p>
                    </div>
                `;
                cardGrid.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            alert(`Error fetching data: ${error}`);
        });
}

// Call the createGrid function when the page loads
window.onload = createGrid;