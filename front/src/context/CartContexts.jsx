import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [currency, setCurrency] = useState('USD');

  // Conversion rates
  const conversionRates = {
    USD: 1,
    KSH: 130 // Example rate: 1 USD = 130 Ksh
  };

  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        );
      }
      return [...prevItems, product];
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const setCurrencySelection = (currency) => {
    setCurrency(currency);
  };

  const calculateTotal = () => {
    const totalUSD = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    return totalUSD * conversionRates[currency];
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, setCurrencySelection, calculateTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
