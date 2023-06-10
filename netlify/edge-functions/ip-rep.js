const axios = require('axios');

exports.handler = async (event, context) => {
  const ip = event.headers['client-ip'];

  try {
    const response = await axios.get(`https://api.pangeo.io/ip/${ip}?key=YOUR_PANGEO_API_KEY`);
    
    const { reputation } = response.data;
    
    if (reputation === 'good') {
      // IP has a good reputation, allow the request
      return {
        statusCode: 200,
        body: 'Welcome to the website!',
      };
    } else {
      // IP has a bad reputation, reject the request
      return {
        statusCode: 403,
        body: 'Access denied due to IP reputation!',
      };
    }
  } catch (error) {
    // Handle errors, such as API request failures
    console.error('Error checking IP reputation:', error);
    return {
      statusCode: 500,
      body: 'Error checking IP reputation',
    };
  }
};