window.onload = function() {
    fetch('http://localhost:3000/api/schedules')
      .then(response => response.json())
      .then(data => {
        const tableBody = document.querySelector('#scheduleTable tbody');
        data.forEach(schedule => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${schedule.bus_number}</td>
            <td>${schedule.route}</td>
            <td>${schedule.departure_time}</td>
            <td>${schedule.arrival_time}</td>
          `;
          tableBody.appendChild(row);
        });
      })
      .catch(error => console.error('Error fetching data:', error));
  };  