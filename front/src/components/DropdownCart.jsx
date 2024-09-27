// src/components/DropDownCart.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useCart } from '../context/CartContexts';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';

const DropDownCart = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const formRef = useRef(null);

  const handleProceedToPayment = () => {
    if (cartItems.length === 0) return;
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'orders'), {
        email,
        phone,
        firstName,
        lastName,
        cartItems,
        totalAmount: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
      });
      clearCart();
      setShowForm(false);  // Hide the form
    } catch (error) {
      console.error('Error submitting order: ', error);
    }
  };

  const handleClickOutside = (e) => {
    if (formRef.current && !formRef.current.contains(e.target)) {
      setShowForm(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      {showForm ? (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <form ref={formRef} onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-xl mb-4">Payment Information</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block mb-2 p-2 border rounded w-full"
              required
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="block mb-2 p-2 border rounded w-full"
              required
            />
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="block mb-2 p-2 border rounded w-full"
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="block mb-2 p-2 border rounded w-full"
              required
            />
            <button type="submit" className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 w-full">
              Submit
            </button>
          </form>
        </div>
      ) : (
        <div className="absolute top-0 right-0 bg-white p-4 shadow-lg rounded-lg w-80">
          {cartItems.length === 0 ? (
            <p className="text-gray-700">Your cart is empty.</p>
          ) : (
            <>
              <ul>
                {cartItems.map((item) => (
                  <li key={item.id} className="flex justify-between items-center mb-2">
                    <span>{item.name} x {item.quantity}</span>
                    <button onClick={() => removeFromCart(item.id)} className="text-red-600 hover:text-red-800">
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <button
                  onClick={handleProceedToPayment}
                  className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 w-full"
                >
                  Proceed to Payment
                </button>
                <button
                  onClick={clearCart}
                  className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 w-full mt-2"
                >
                  Clear Cart
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default DropDownCart;
