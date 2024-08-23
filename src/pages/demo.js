import React from 'react'
import Cookies from 'js-cookie';
import axios from 'axios';

const demo = () => {
  const handlePayment = async () => {
    try {
      // Get the authorization token from the cookies
      const authToken = Cookies.get('auth_token');

      // Prepare the payload
      const payload = {
        price: "0.12",
      };

      // Make the API request to the /api/paypal endpoint
      const response = await axios.post('https://api.launcherr.co/api/paypal', payload, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      // Handle the response
      console.log('Payment successful:', response.data);
      // You can add further actions here, like redirecting the user or showing a success message.

    } catch (error) {
      // Handle any errors that occur during the request
      console.error('Payment failed:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div>
      <h1>PayPal Payment</h1>
      <button onClick={handlePayment}>Pay with PayPal</button>
    </div>
  );
};

export default demo