document.getElementById('chatbot-button').addEventListener('click', () => {
  const userInput = document.getElementById('chatbot-input').value;
  const response = userInput
      ? `You mentioned: "${userInput}". Let me find relevant information for you.`
      : "How can I assist you today? Please describe your symptoms.";
  document.getElementById('chatbot-response').innerText = response;
});

// Chart.js for Real-Time Analytics
const ctx = document.getElementById('analytics-chart').getContext('2d');
const chart = new Chart(ctx, {
  type: 'line',
  data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
          label: 'Health Trends',
          data: [10, 20, 15, 25, 30, 40],
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderWidth: 2
      }]
  },
  options: {
      responsive: true,
      plugins: {
          legend: {
              display: true,
              position: 'top'
          }
      }
  }
});

// Show input form when chart button is clicked
document.getElementById('chart-update-button').addEventListener('click', () => {
  document.getElementById('chart-input').style.display = 'block';
});

// Add new data to chart
document.getElementById('add-data-button').addEventListener('click', () => {
  const newData = document.getElementById('new-data').value.split(',').map(Number);
  chart.data.datasets[0].data.push(...newData);
  chart.update();
});

// Notifications functionality
document.getElementById('notifications-button').addEventListener('click', () => {
  document.getElementById('notification-response').innerText = "You have new health alerts! Please check your notifications.";
});

// Delivery requests functionality
document.getElementById('delivery-button').addEventListener('click', () => {
  document.getElementById('delivery-response').innerText = "Your supply request has been received and is being processed.";
});

// Emergency assistance functionality
document.getElementById('emergency-button').addEventListener('click', () => {
  document.getElementById('emergency-response').innerText = "Emergency assistance is on its way. Please stay safe.";
});
document.getElementById('quarantine-button').addEventListener('click', () => {
  document.getElementById('quarantine-response').innerText = "Quarantine compliance data is being monitored. Thank you for staying safe!";
});