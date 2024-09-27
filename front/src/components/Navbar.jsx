import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa';
import { useCart } from '../context/CartContexts';
import Cart from './Cart';

const Navbar = () => {
  const { cartItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navbarRef = useRef(null); // Reference to the navbar

  const totalItems = cartItems.length; // Display the number of unique items, not the quantity

  const handleCartClick = () => {
    setIsCartOpen(!isCartOpen);
  };

  const handleCloseCart = () => {
    setIsCartOpen(false);
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleClickOutside = (event) => {
    if (navbarRef.current && !navbarRef.current.contains(event.target)) {
      setIsMenuOpen(false); // Close the menu if click is outside the navbar
      setIsCartOpen(false); // Optionally, close the cart as well
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-gray-800 p-4 relative" ref={navbarRef}>
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-2xl font-bold">
          <Link to="/">Ogres Beads Workshop</Link>
        </div>
        <div className="hidden md:flex space-x-4">
          <Link to="/" className="text-white hover:text-yellow-300">Home</Link>
          <Link to="/products" className="text-white hover:text-yellow-300">Products</Link>
          <Link to="/reviews" className="text-white hover:text-yellow-300">Reviews</Link>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={handleCartClick} className="relative text-white hover:text-yellow-300">
            <FaShoppingCart size={24} />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 bg-red-600 text-white rounded-full text-xs px-2 py-1">
                {totalItems}
              </span>
            )}
          </button>
          {isCartOpen && <Cart onClose={handleCloseCart} />}
          <button onClick={handleMenuToggle} className="md:hidden text-white">
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-gray-800 text-white">
          <Link to="/" className="block py-2 px-4 hover:bg-gray-700" onClick={handleMenuToggle}>Home</Link>
          <Link to="/products" className="block py-2 px-4 hover:bg-gray-700" onClick={handleMenuToggle}>Products</Link>
          <Link to="/reviews" className="block py-2 px-4 hover:bg-gray-700" onClick={handleMenuToggle}>Reviews</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
