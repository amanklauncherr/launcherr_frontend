import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const {
    merchantId,
    merchantTransactionId,
    merchantUserId,
    amount,
    redirectUrl,
    redirectMode,
    callbackUrl,
    mobileNumber,
  } = req.body;

  const payload = {
    merchantId,
    merchantTransactionId,
    merchantUserId,
    amount,
    redirectUrl,
    redirectMode,
    callbackUrl,
    mobileNumber,
    paymentInstrument: {
      type: 'PAY_PAGE',
    },
  };

  const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
  const saltKey = process.env.NEXT_PUBLIC_SALT_KEY;
  const saltIndex = process.env.NEXT_PUBLIC_SALT_INDEX;
  const endpoint = '/pg/v1/pay';
  const xVerify = crypto.createHash('sha256').update(base64Payload + endpoint + saltKey).digest('hex') + '###' + saltIndex;

  try {
    const response = await fetch('https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': xVerify,
      },
      body: JSON.stringify({ request: base64Payload }),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
