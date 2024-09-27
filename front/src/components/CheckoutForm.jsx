import React, { useState, useRef, useEffect } from 'react';
import { db } from '../utils/firebase';  // Assuming `db` is the Firestore instance
import { collection, addDoc } from 'firebase/firestore';
import { useCart } from '../context/CartContexts';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useNavigate } from 'react-router-dom';
import ReactIntlTelInput from 'react-intl-tel-input';
import 'react-intl-tel-input/dist/main.css';

const CheckoutForm = ({ onClose }) => {
  const [formData, setFormData] = useState({ email: '', firstName: '', lastName: '' });
  const [phoneNumber, setPhoneNumber] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [paypalClientId, setPaypalClientId] = useState(null);
  const { cartItems, calculateTotal, setCurrencySelection } = useCart();
  const formRef = useRef(null);
  const navigate = useNavigate();
  const total = calculateTotal();
  const [phoneError, setPhoneError] = useState(false); // For phone number validation

  useEffect(() => {
    const fetchPayPalClientId = async () => {
      try {
        const response = await fetch('/api/paypal-client-id');
        const data = await response.json();
        setPaypalClientId(data.clientId);
      } catch (error) {
        console.error('Error fetching PayPal client ID: ', error);
      }
    };

    fetchPayPalClientId();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handlePhoneNumberChange = (status, value, countryData, number) => {
    setPhoneNumber(number);
    setPhoneError(false);  // Clear the error when the user starts typing
  };

  const handleCurrencyChange = (e) => {
    const selectedCurrency = e.target.value;
    setCurrency(selectedCurrency);
    setCurrencySelection(selectedCurrency);
  };

  const saveReceipt = async (paymentDetails) => {
    try {
      await addDoc(collection(db, 'receipts'), {
        orderId,
        items: cartItems.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          imageUrl: item.imageUrl,
        })),
        totalAmount: total,
        currency,
        paymentDetails,
        createdAt: new Date(),
      });
      console.log('Receipt saved successfully!');

      await fetch('/api/orders/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          orderId,
          totalAmount: total,
          currency,
          items: cartItems,
          paymentDetails,
        }),
      });
      console.log('Order confirmation email sent successfully!');
    } catch (error) {
      console.error('Error saving receipt: ', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!phoneNumber) {
      setPhoneError(true);
      return;
    }

    try {
      const orderDoc = await addDoc(collection(db, 'orders'), {
        ...formData,
        phone: phoneNumber,
        items: cartItems.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          imageUrl: item.imageUrl,
        })),
        totalAmount: total,
        currency,
        createdAt: new Date(),
      });
      setOrderId(orderDoc.id);
      setOrderSubmitted(true);
    } catch (error) {
      console.error('Error submitting order: ', error);
    }
  };

  const handleContinueShopping = () => {
    navigate('/products');
    onClose();
  };

  const handleViewOrder = () => {
    navigate(`/order-summary/${orderId}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div ref={formRef} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center">Checkout</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 sm:text-sm"
              required
            />
          </div>
          <div className="flex space-x-2">
            <div className="flex-1">
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 sm:text-sm"
                required
              />
            </div>
            <div className="flex-1">
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 sm:text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
            <ReactIntlTelInput
              preferredCountries={['us', 'ke']}
              defaultCountry="us"
              value={phoneNumber}
              onPhoneNumberChange={handlePhoneNumberChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 sm:text-sm"
              required
            />
            {phoneError && (
              <p className="text-red-500 text-sm mt-1">Phone number is required.</p>
            )}
          </div>

          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700">Currency</label>
            <select
              id="currency"
              name="currency"
              value={currency}
              onChange={handleCurrencyChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 sm:text-sm"
            >
              <option value="USD">USD</option>
              <option value="KSH">Kenyan Shillings</option>
            </select>
          </div>

          {!orderSubmitted && (
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-150"
            >
              Submit Order
            </button>
          )}
        </form>

        {/* PayPal Buttons Section */}
        <div className={`mt-6 ${!orderSubmitted ? 'blur-sm pointer-events-none' : ''}`}>
          <h3 className="text-lg font-semibold text-center">Total Amount: {total} {currency}</h3>
          <PayPalScriptProvider options={{ "client-id": paypalClientId }}>
            {!paymentCompleted && (
              <PayPalButtons
                createOrder={(data, actions) => {
                  return actions.order.create({
                    purchase_units: [{
                      amount: {
                        value: total.toString(),
                        currency_code: currency,
                      },
                    }],
                  });
                }}
                onApprove={async (data, actions) => {
                  const paymentDetails = await actions.order.capture();
                  setPaymentCompleted(true);
                  await saveReceipt(paymentDetails);
                }}
              />
            )}
            {paymentCompleted && (
              <div className="text-center">
                <p className="text-green-600">Payment completed successfully!</p>
                <button
                  onClick={handleViewOrder}
                  className="mt-4 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition duration-150"
                >
                  View Your Order
                </button>
                <button
                  onClick={handleContinueShopping}
                  className="mt-2 bg-gray-300 text-black py-2 rounded-md hover:bg-gray-400 transition duration-150"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </PayPalScriptProvider>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
