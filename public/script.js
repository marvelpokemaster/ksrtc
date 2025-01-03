document.addEventListener('DOMContentLoaded', () => {
    const loginModal = document.getElementById('login-modal');
    const mainContent = document.getElementById('main-content');
    const loginForm = document.getElementById('login-form');
    const bookingModal = document.getElementById('booking-modal');
    const bookingForm = document.getElementById('booking-form');
    const bookingsTable = document.getElementById('bookings-table');
    const bookingsList = document.getElementById('bookings-list');
    const detailsModal = document.getElementById('details-modal');
    const detailsContent = document.getElementById('details-content');

    let selectedRouteId = null;
    let selectedFareId = null;
    let selectedBusno = null;

    // Admin login functionality
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        if (username === 'admin' && password === 'password123') {
            loginModal.classList.add('hidden');
            mainContent.classList.remove('hidden');
        } else {
            alert('Invalid username or password.');
        }
    });

    // Initialize locations and bookings
    fetchLocations();
    fetchBookings();

    // Route search form submission
    document.getElementById('search-form').addEventListener('submit', async (e) => {
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
            if (!response.ok) throw new Error('Failed to fetch routes');
            const routes = await response.json();

            if (routes.length === 0) {
                alert('No routes found for the selected criteria.');
            } else {
                displayRoutes(routes);
            }
        } catch (err) {
            console.error(err);
            alert('Error fetching routes. Please try again.');
        }
    });

    // Booking form submission
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const passengerName = document.getElementById('passenger-name').value.trim();
        const contact = document.getElementById('contact').value.trim();
        const seatNumber = document.getElementById('seat-number').value.trim();

        if (!selectedRouteId || !selectedFareId) {
            alert('A route and fare must be selected.');
            return;
        }
        if (!passengerName || !contact || !seatNumber) {
            alert('All fields are required.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    routeId: selectedRouteId,
                    fareId: selectedFareId,
                    busnumber: selectedBusno,
                    passengerName,
                    contact,
                    seatNumber,
                }),
            });

            const data = await response.json();
            if (response.ok && data.success) {
                alert(`Ticket booked successfully! Your ticket ID is ${data.ticketId}.`);
                bookingModal.classList.add('hidden');
                appendBooking({
                    ticketid: data.ticketId,
                    passengername: passengerName,
                    contact: contact,
                    seatnumber: seatNumber,
                    source: selectedRouteId, // Placeholder for actual source
                    destination: selectedFareId, // Placeholder for actual destination
                });
            } else {
                throw new Error(data.error || 'Failed to book ticket');
            }
        } catch (err) {
            console.error(err);
            alert('Error booking ticket. Please try again later.');
        }
    });

    // Fetch locations for dropdowns
    async function fetchLocations() {
        try {
            const response = await fetch('http://localhost:3000/locations');
            if (!response.ok) throw new Error('Failed to fetch locations');
            const data = await response.json();
            populateLocations(data);
        } catch (err) {
            console.error(err);
            alert('Error fetching locations.');
        }
    }

    // Populate dropdowns for source and destination
    function populateLocations(data) {
        const sourceSelect = document.getElementById('source');
        const destinationSelect = document.getElementById('destination');

        const createOption = (value) => `<option value="${value}">${value}</option>`;

        sourceSelect.innerHTML = '<option value="" disabled selected>Select Source</option>' +
            data.sources.map(createOption).join('');
        destinationSelect.innerHTML = '<option value="" disabled selected>Select Destination</option>' +
            data.destinations.map(createOption).join('');
    }

    // Select route for booking
    function selectRoute(routeId, fareId, busn) {
        selectedRouteId = routeId;
        selectedFareId = fareId;
        selectedBusno = busn;
        bookingModal.classList.remove('hidden');
    }

    // Fetch and display bookings
    async function fetchBookings() {
        try {
            const response = await fetch('http://localhost:3000/bookings');
            if (!response.ok) throw new Error('Failed to fetch bookings');
            const bookings = await response.json();
            displayBookings(bookings);
        } catch (err) {
            console.error(err);
            alert('Error fetching bookings.');
        }
    }

    // Display search results (routes)
    function displayRoutes(routes) {
        const tbody = document.querySelector('#routes-list tbody');
        tbody.innerHTML = '';
        routes.forEach(route => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${route.bustype}</td>
                <td>${route.busnumber}</td>
                <td>
                    <button class="select-route" data-routeid="${route.routeid}" data-fareid="${route.fareid}" data-busno="${route.busnumber}">Select</button>
                </td>
                <td>
                    <button class="details-btn" data-routeid="${route.routeid}">Details</button>
                </td>
            `;
            tbody.appendChild(row);
        });

        document.querySelectorAll('.select-route').forEach(button => {
            button.addEventListener('click', (e) => {
                const routeId = e.target.getAttribute('data-routeid');
                const fareId = e.target.getAttribute('data-fareid');
                const busn = e.target.getAttribute('data-busno');
                selectRoute(routeId, fareId, busn);
            });
        });

        document.querySelectorAll('.details-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
                const routeId = e.target.getAttribute('data-routeid');
                showRouteDetails(routeId);
            });
        });

        document.getElementById('routes-list').classList.remove('hidden');
    }

    // Show route details in a modal
    async function showRouteDetails(routeId) {
        try {
            const response = await fetch(`http://localhost:3000/route-details/${routeId}`);
            if (!response.ok) throw new Error('Failed to fetch route details');
            const data = await response.json();

            const routeDetail = data.routeDetails[0];
            const conductorName = routeDetail.conductorname || 'N/A';
            const driverName = routeDetail.drivername || 'N/A';

            detailsContent.innerHTML = `
                <h3>Conductor Info:</h3>
                <p>Name: ${conductorName}</p>

                <h3>Driver Info:</h3>
                <p>Name: ${driverName}</p>
            `;
            detailsModal.classList.remove('hidden');
        } catch (err) {
            console.error(err);
            alert('Error fetching route details.');
        }
    }

    // Display bookings in table
    function displayBookings(bookings) {
        bookingsList.innerHTML = bookings.map(booking => `
            <tr>
                <td>${booking.ticketid}</td>
                <td>${booking.passengername}</td>
                <td>${booking.contact}</td>
                <td>${booking.seatnumber}</td>
                <td>${booking.source}</td>
                <td>${booking.destination}</td>
            </tr>
        `).join('');
        bookingsTable.classList.remove('hidden');
    }

    // Append a single booking to "Your Bookings"
    function appendBooking(booking) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${booking.ticketid}</td>
            <td>${booking.passengername}</td>
            <td>${booking.contact}</td>
            <td>${booking.seatnumber}</td>
            <td>${booking.source}</td>
            <td>${booking.destination}</td>
        `;
        bookingsList.appendChild(row);
        bookingsTable.classList.remove('hidden');
    }
});
