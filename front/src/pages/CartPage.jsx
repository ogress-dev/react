import React from 'react';
import Cart from '../components/Cart';

const CartPage = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      <Cart />
    </div>
  );
};

export default CartPage;
