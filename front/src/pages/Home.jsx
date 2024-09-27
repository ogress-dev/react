import React from 'react';
import { Link } from 'react-router-dom';
import { FaWhatsapp, FaInstagram, FaFacebook } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Welcome to Ogres Beads Workshop</h1>
      <p className="mb-4">
        Nestled in Lamu, Ogres Beads Workshop has been a gem for over 20 years. Our passion lies in transforming nature’s raw gifts—minerals, soil, and animal byproducts—into stunning, handcrafted jewelry.
        Each piece tells a story of natural beauty, ethically sourced and meticulously crafted by skilled artisans. From the shores of Lamu to the world, we offer international shipping so you can experience our unique creations wherever you are.
        Join us in celebrating two decades of artistry and discover the magic of Ogres Beads Workshop.
      </p>
      <div className="flex space-x-4 mb-4">
        <Link to="/products" className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600">Shop Now</Link>
        <a href="https://maps.app.goo.gl/zgXeSdLsjqbW32MK7" className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600" target="_blank" rel="noopener noreferrer">View Shop Location</a>
      </div>
      <div className="flex space-x-4">
        <a href="https://wa.me/+254768595592" className="text-green-500 hover:text-green-700" target="_blank" rel="noopener noreferrer"><FaWhatsapp size={24} /></a>
        <a href="https://www.instagram.com/ogresbeads?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" className="text-pink-500 hover:text-pink-700" target="_blank" rel="noopener noreferrer"><FaInstagram size={24} /></a>
        <a href="https://facebook.com/your-page" className="text-blue-500 hover:text-blue-700" target="_blank" rel="noopener noreferrer"><FaFacebook size={24} /></a>
      </div>
    </div>
  );
};

export default Home;
