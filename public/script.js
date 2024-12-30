document.addEventListener('DOMContentLoaded', () => {
    const loginModal = document.getElementById('login-modal');
    const mainContent = document.getElementById('main-content');
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username === 'admin' && password === 'password123') {
            loginModal.classList.add('hidden');
            mainContent.classList.remove('hidden');
        } else {
            alert('Invalid username or password.');
        }
    });

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
            const routes = await response.json();
            displayRoutes(routes);
        } catch (err) {
            console.error(err);
            alert('Error fetching routes.');
        }
    });
});

async function fetchLocations() {
    try {
        const response = await fetch('http://localhost:3000/locations');
        const data = await response.json();
        populateLocations(data);
    } catch (err) {
        console.error(err);
        alert('Error fetching locations.');
    }
}

function populateLocations(data) {
    const sourceSelect = document.getElementById('source');
    const destinationSelect = document.getElementById('destination');

    sourceSelect.innerHTML = '<option value="" disabled selected>Select Source</option>';
    destinationSelect.innerHTML = '<option value="" disabled selected>Select Destination</option>';

    data.sources.forEach(source => {
        sourceSelect.innerHTML += `<option value="${source}">${source}</option>`;
    });

    data.destinations.forEach(destination => {
        destinationSelect.innerHTML += `<option value="${destination}">${destination}</option>`;
    });
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

function displayRoutes(routes) {
    const tbody = document.querySelector('#routes-list tbody');
    tbody.innerHTML = '';
    routes.forEach(route => {
        tbody.innerHTML += `
            <tr>
                <td>${route.routeid}</td>
                <td>${route.source}</td>
                <td>${route.destination}</td>
                <td>${route.scheduledate}</td>
                <td><button onclick="selectRoute(${route.routeid})">Select</button></td>
            </tr>
        `;
    });

    document.getElementById('routes-list').classList.remove('hidden');
}
