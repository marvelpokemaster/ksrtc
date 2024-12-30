document.addEventListener('DOMContentLoaded', () => {
    fetchLocations();

    document.getElementById('search-form').addEventListener('submit', async function (e) {
        e.preventDefault();
        const source = document.getElementById('source').value;
        const destination = document.getElementById('destination').value;
        const date = document.getElementById('date').value;

        if (!source || !destination || !date) {
            alert('Please fill all fields before searching.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/routes?source=${source}&destination=${destination}&date=${date}`);
            if (!response.ok) throw new Error('Network response was not ok');

            const routes = await response.json();
            displayRoutes(routes);
        } catch (err) {
            console.error(err);
            alert('Error fetching routes. Please try again later.');
        }
    });
});

async function fetchLocations() {
    try {
        const response = await fetch('http://localhost:3000/locations');
        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        populateLocations(data);
    } catch (err) {
        console.error(err);
        alert('Error fetching locations. Please try again later.');
    }
}

function populateLocations(data) {
    const sourceSelect = document.getElementById('source');
    const destinationSelect = document.getElementById('destination');

    sourceSelect.innerHTML = '<option value="" disabled selected>Select Source</option>';
    destinationSelect.innerHTML = '<option value="" disabled selected>Select Destination</option>';

    data.sources.forEach(source => {
        const option = document.createElement('option');
        option.value = source;
        option.textContent = source;
        sourceSelect.appendChild(option);
    });

    data.destinations.forEach(destination => {
        const option = document.createElement('option');
        option.value = destination;
        option.textContent = destination;
        destinationSelect.appendChild(option);
    });
}

function displayRoutes(routes) {
    const routesList = document.getElementById('routes-list').querySelector('tbody');
    routesList.innerHTML = '';

    if (routes.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="5">No routes found.</td>';
        routesList.appendChild(row);
    } else {
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
    }
}

async function selectRoute(routeid) {
    const passengerName = prompt("Enter your name:");
    const contact = prompt("Enter your contact number:");
    const seatNumber = prompt("Enter seat number:");

    if (!passengerName || !contact || !seatNumber) {
        alert("All fields are required.");
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/book', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                routeId: routeid,
                passengerName,
                contact,
                seatNumber,
            }),
        });

        const data = await response.json();
        if (data.success) {
            alert(`Ticket booked successfully! Your ticket ID is ${data.ticketId}.`);
        } else {
            alert(`Error: ${data.error}`);
        }
    } catch (err) {
        console.error(err);
        alert('Error booking ticket. Please try again later.');
    }
}
