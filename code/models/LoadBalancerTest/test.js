import axios from 'axios';

// Replace 'your_server_url' with the actual URL of your server
const serverUrl = 'http://localhost:3001'; // Update the port if necessary

// Example message data
const message = {
  sender: 'Cloud',
  content: 'banana',
};

// Send a POST request to the server
axios.post(`${serverUrl}/your-api-endpoint`, message)
  .then(response => {
    console.log('Response from server:', response.data);
  })
  .catch(error => {
    console.error('Error sending request:', error.message);
  });
