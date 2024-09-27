import React, { useState, useRef, useEffect } from 'react';
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
  const [showSupport, setShowSupport] = useState(false);
  const dropdownRef = useRef(null);

  const toggleSupportDropdown = () => {
    setShowSupport(!showSupport);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowSupport(false);
    }
  };

  useEffect(() => {
    // Add event listener to handle clicks outside
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="mb-4 sm:mb-0">
            <div className="text-center sm:text-left">
              <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
            </div>
          </div>
          <div className="flex justify-center mb-4 sm:mb-0">
            <a
              href="https://www.facebook.com/yourpage"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-400 mx-2"
            >
              <FaFacebook size={20} />
            </a>
            <a
              href="https://www.instagram.com/ogresbeads?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-400 mx-2"
            >
              <FaInstagram size={20} />
            </a>
            <a
              href="https://wa.me/+254768595592"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-400 mx-2"
            >
              <FaWhatsapp size={20} />
            </a>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 text-center sm:text-right">
            <a href="/" className="hover:text-gray-400">About Us</a>
            <a href="/products" className="hover:text-gray-400">Shop</a>
            <button onClick={toggleSupportDropdown} className="hover:text-gray-400">
              Support
            </button>
          </div>
        </div>

        {/* Support Dropdown */}
        {showSupport && (
          <div ref={dropdownRef} className="mt-4 bg-gray-700 p-4 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-2">Contact Us</h3>
            <p className="mb-2">Phone: <a href="tel:+254768595592" className="text-white underline">+254 768595592</a></p>
            <p className="mb-2">Email: <a href="mailto:ogresmurathimi@gmail.com" className="text-white underline">ogresmurathimi@gmail.com</a></p>
            <div className="flex justify-center">
              <a
                href="https://wa.me/+254768595592"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-400 mx-2"
              >
                <FaWhatsapp size={24} />
              </a>
              <a
                href="https://www.instagram.com/ogresbeads?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-400 mx-2"
              >
                <FaInstagram size={24} />
              </a>
              <a
                href="https://www.facebook.com/yourpage"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-400 mx-2"
              >
                <FaFacebook size={24} />
              </a>
            </div>
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;
