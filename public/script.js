document.getElementById('search-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const source = document.getElementById('source').value;
    const destination = document.getElementById('destination').value;
    const date = document.getElementById('date').value;

    try {
        const response = await fetch(`http://localhost:3000/routes?source=${source}&destination=${destination}&date=${date}`);
        const routes = await response.json();

        const routesList = document.getElementById('routes-list').querySelector('tbody');
        routesList.innerHTML = '';

        routes.forEach(route => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${route.routeid}</td>
                <td>${route.source}</td>
                <td>${route.destination}</td>
                <td>${route.scheduledate}</td>
                <td><button onclick="selectRoute(${route.routeid})">Select</button></td>
            `;
            routesList.appendChild(row);
        });
    } catch (err) {
        console.error(err);
        alert('Error fetching routes.');
    }
});

async function fetchLocations() {
    try {
        const response = await fetch('http://localhost:3000/locations');
        const data = await response.json();

        const sourceSelect = document.getElementById('source');
        const destinationSelect = document.getElementById('destination');

        // Clear existing options (if any)
        sourceSelect.innerHTML = '<option value="" disabled selected>Select Source</option>';
        destinationSelect.innerHTML = '<option value="" disabled selected>Select Destination</option>';

        // Populate the source dropdown
        data.sources.forEach(source => {
            const option = document.createElement('option');
            option.value = source;
            option.textContent = source;
            sourceSelect.appendChild(option);
        });

        // Populate the destination dropdown
        data.destinations.forEach(destination => {
            const option = document.createElement('option');
            option.value = destination;
            option.textContent = destination;
            destinationSelect.appendChild(option);
        });
    } catch (err) {
        console.error(err);
        alert('Error fetching locations.');
    }
}

// Call the function to populate source and destination dropdowns on page load
fetchLocations();
