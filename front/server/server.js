import express from 'express'; // Import express
import dotenv from 'dotenv'; // Import dotenv for environment variables
import bodyParser from 'body-parser';
import cors from 'cors';
import nodemailer from 'nodemailer';
import axios from 'axios'; // Import Axios for HTTP requests
import emailjs from 'emailjs-com'; // Import EmailJS

dotenv.config(); // Load environment variables

const app = express(); // Initialize express
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Endpoint to retrieve PayPal Client ID
app.get('/paypal-client-id', (req, res) => {
  const paypalClientId = process.env.PAYPAL_CLIENT_ID;
  res.json({ clientId: paypalClientId });
});

// Endpoint to retrieve Firebase config
app.get('/firebase-config', (req, res) => {
  const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
  };
  res.json(firebaseConfig);
});

// Endpoint to handle sending email after order completion
app.post('/api/orders/send-email', async (req, res) => {
  const { email, orderId, totalAmount, currency, items } = req.body;

  // Email content for Nodemailer
  const nodemailerContent = `
    <h2>Order Confirmation</h2>
    <p>Order ID: ${orderId}</p>
    <p>Total Amount: ${totalAmount} ${currency}</p>
    <p>Items:</p>
    <ul>
      ${items.map(item => `<li>${item.name} - Quantity: ${item.quantity}</li>`).join('')}
    </ul>
  `;

  try {
    // Send confirmation email to the customer using Nodemailer
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Order Confirmation',
      html: nodemailerContent,
    });

    // Send notification email to ogress638@gmail.com using Nodemailer
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'ogress638@gmail.com',
      subject: 'New Order Submitted',
      html: nodemailerContent,
    });

    // Optionally send email using EmailJS (if needed)
    const emailContent = {
      service_id: process.env.SERVICE_ID, // EmailJS service ID
      template_id: process.env.TEMPLATE_ID, // EmailJS template ID
      user_id: process.env.PUBLIC_KEY, // EmailJS public key
      template_params: {
        orderId,
        totalAmount,
        currency,
        items: items.map(item => `${item.name} - Quantity: ${item.quantity}`).join(', '),
      },
    };

    // Send confirmation email using EmailJS
    await emailjs.send(emailContent.service_id, emailContent.template_id, {
      ...emailContent.template_params,
      to_email: email, // Confirmation email
    });

    // Send notification email using EmailJS
    await emailjs.send(emailContent.service_id, emailContent.template_id, {
      ...emailContent.template_params,
      to_email: 'ogress638@gmail.com', // Notification email
    });

    res.status(200).send('Emails sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Failed to send emails');
  }
});

// Endpoint to create PayPal order
app.post('/api/paypal/create-order', async (req, res) => {
  try {
    const { totalAmount, currency } = req.body;

    // Get access token
    const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64');
    const tokenResponse = await axios.post('https://api-m.paypal.com/v1/oauth2/token', null, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      params: {
        grant_type: 'client_credentials'
      }
    });

    const accessToken = tokenResponse.data.access_token;

    // Create order
    const orderResponse = await axios.post('https://api-m.paypal.com/v2/checkout/orders', {
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: currency,
          value: totalAmount
        }
      }]
    }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    res.status(200).json(orderResponse.data);
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    res.status(500).send('Failed to create PayPal order');
  }
});

// Endpoint to capture PayPal order
app.post('/api/paypal/capture-order', async (req, res) => {
  try {
    const { orderID } = req.body;

    // Get access token
    const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64');
    const tokenResponse = await axios.post('https://api-m.paypal.com/v1/oauth2/token', null, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      params: {
        grant_type: 'client_credentials'
      }
    });

    const accessToken = tokenResponse.data.access_token;

    // Capture order
    const captureResponse = await axios.post(`https://api-m.paypal.com/v2/checkout/orders/${orderID}/capture`, {}, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    res.status(200).json(captureResponse.data);
  } catch (error) {
    console.error('Error capturing PayPal order:', error);
    res.status(500).send('Failed to capture PayPal order');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
