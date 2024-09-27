import React from 'react';
import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center p-4 sm:p-8">
      <div className="max-w-3xl w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4 text-center">Welcome to Ogres Beads Workshop</h1>
        <p className="text-lg mb-6 text-center">
          Nestled in Lamu, Ogres Beads Workshop has been a gem for over 20 years. Our passion lies in transforming nature’s raw gifts—minerals, soil, and animal byproducts—into stunning, handcrafted jewelry.
          Each piece tells a story of natural beauty, ethically sourced and meticulously crafted by skilled artisans. From the shores of Lamu to the world, we offer international shipping so you can experience our unique creations wherever you are.
          Join us in celebrating two decades of artistry and discover the magic of Ogres Beads Workshop.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
          <Link
            to="/products"
            className="bg-yellow-500 text-white py-2 px-6 rounded-lg hover:bg-yellow-600 transition duration-300 text-center"
          >
            Shop Now
          </Link>
          <a
            href="https://maps.app.goo.gl/zgXeSdLsjqbW32MK7"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition duration-300 text-center"
          >
            View Shop Location
          </a>
        </div>
        
        {/* Google Maps Embed */}
        <div className="mb-6">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3986.6984872208!2d40.89859107396238!3d-2.265974697714104!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1817190040c71433%3A0x2e0063e5dcd1cc00!2sogres%20beads%20workshop!5e0!3m2!1sen!2ske!4v1727430768826!5m2!1sen!2ske"
            width="400"
            height="300"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ogres Beads Workshop Location"
            className="w-full h-64 mb-4 rounded-lg" // Make it responsive
          ></iframe>
        </div>

        <div className="flex justify-center space-x-4">
          <a
            href="https://wa.me/+254768595592"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800"
          >
            <FaWhatsapp size={24} />
          </a>
          <a
            href="https://www.instagram.com/ogresbeads?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-500 hover:text-pink-700"
          >
            <FaInstagram size={24} />
          </a>
          <a
            href="https://facebook.com/yourfacebookpage"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 hover:text-blue-900"
          >
            <FaFacebookF size={24} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;
