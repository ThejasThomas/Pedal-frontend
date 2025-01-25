
import React from "react";
import { Link } from 'react-router-dom';
import footerBg from "../../../src/assets/images/footer.jpg";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 animate-bounce">SUNDAY SALE</h2>
          <div className="relative overflow-hidden rounded-lg">
            <img
              src={footerBg}
              alt="Cyclist silhouette"
              className="w-full h-48 object-cover  transition duration-500"
            />
            <div className="absolute inset-0 bg-blue-600 bg-opacity-50 flex items-center justify-center">
              <p className="text-2xl font-bold animate-pulse">Up to 50% OFF</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-blue-500 pb-2">Customer Service</h3>
            <ul className="space-y-2">
              <li><Link to="/contact" className="hover:text-blue-400 transition-colors duration-300">Contact Us</Link></li>
              <li><Link to="/shipping" className="hover:text-blue-400 transition-colors duration-300">Shipping Details</Link></li>
              <li><Link to="/returns" className="hover:text-blue-400 transition-colors duration-300">Return & Refund</Link></li>
              <li><Link to="/payment" className="hover:text-blue-400 transition-colors duration-300">Payment</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-blue-500 pb-2">About Us</h3>
            <ul className="space-y-2">
              <li><Link to="/story" className="hover:text-blue-400 transition-colors duration-300">Our Story</Link></li>
              <li><Link to="/careers" className="hover:text-blue-400 transition-colors duration-300">Careers</Link></li>
              <li><Link to="/sustainability" className="hover:text-blue-400 transition-colors duration-300">Sustainability</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-blue-500 pb-2">Contact</h3>
            <ul className="space-y-2">
              <li><Link to="/service" className="hover:text-blue-400 transition-colors duration-300">Service Hotline</Link></li>
              <li><Link to="/feedback" className="hover:text-blue-400 transition-colors duration-300">Feedback</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-gray-800 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-400">
          <p>©2023 All Rights Reserved. From us at PedalQuest</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;