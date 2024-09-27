// src/components/Cart.jsx
import React, { useState } from 'react';
import { useCart } from '../context/CartContexts';
import CheckoutForm from './CheckoutForm';

const Cart = () => {
  const { cartItems, removeFromCart, proceedToPayment } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  const handleProceedToPayment = () => {
    setShowCheckout(true);
  };

  const handleCloseCheckout = () => {
    setShowCheckout(false);
  };

  const totalValue = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);


  return (
    <>
      <div className="relative">
        <button
          className="bg-yellow-500 text-white p-2 rounded"
          onClick={() => setShowCheckout(false)}
        >
          Cart ({cartItems.length})
        </button>

        {cartItems.length > 0 && !showCheckout && (
          <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-64">
            <div className="p-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between mb-2">
                  <span>{item.name}</span>
                  <span>{item.quantity} x ${item.price.toFixed(2)}</span>
                  <button onClick={() => removeFromCart(item.id)}>Remove</button>
                </div>
              ))}
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${totalValue.toFixed(2)}</span>
              </div>
              <button
                onClick={handleProceedToPayment}
                className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        )}

        {showCheckout && (
          <CheckoutForm onClose={handleCloseCheckout} />
        )}
      </div>
    </>
  );
};

export default Cart;
