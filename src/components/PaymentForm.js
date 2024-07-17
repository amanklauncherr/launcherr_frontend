import { useState } from 'react';

const PaymentForm = () => {
  const [formData, setFormData] = useState({
    merchantId: 'PGTESTPAYUAT',
    merchantTransactionId: 'MT' + new Date().getTime(),
    merchantUserId: 'MUID123',
    amount: 10000, // Amount in paise (1 Rupee = 100 Paise)
    redirectUrl: 'https://webhook.site/redirect-url',
    redirectMode: 'REDIRECT', // or 'POST'
    callbackUrl: 'https://webhook.site/callback-url',
    mobileNumber: '9999999999',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        window.location.href = data.data.instrumentResponse.redirectInfo.url;
      } else {
        alert('Payment initiation failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Merchant ID</label>
        <input type="text" name="merchantId" value={formData.merchantId} onChange={handleChange} required />
      </div>
      <div>
        <label>Transaction ID</label>
        <input type="text" name="merchantTransactionId" value={formData.merchantTransactionId} onChange={handleChange} required />
      </div>
      <div>
        <label>User ID</label>
        <input type="text" name="merchantUserId" value={formData.merchantUserId} onChange={handleChange} required />
      </div>
      <div>
        <label>Amount</label>
        <input type="number" name="amount" value={formData.amount} onChange={handleChange} required />
      </div>
      <div>
        <label>Redirect URL</label>
        <input type="url" name="redirectUrl" value={formData.redirectUrl} onChange={handleChange} required />
      </div>
      <div>
        <label>Callback URL</label>
        <input type="url" name="callbackUrl" value={formData.callbackUrl} onChange={handleChange} required />
      </div>
      <div>
        <label>Mobile Number</label>
        <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} />
      </div>
      <button type="submit">Pay</button>
    </form>
  );
};

export default PaymentForm;
