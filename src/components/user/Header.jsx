import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import heroImage from "../../assets/images/homeimg.jpg";


const Header = () => {
  const navigate=useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleLogin=async(e)=>{
    
    e.preventDefault(e)
    e.preventDefault()
    navigate('/user/login')
  }

  return (
    <header className="w-full">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6 md:justify-start md:space-x-10">
            <div className="flex justify-start lg:w-0 lg:flex-1">
              <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-800 transition duration-300">PEDALQUEST</Link>
            </div>
            <div className="-mr-2 -my-2 md:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <span className="sr-only">Open menu</span>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
              <Link to="/" className="text-base font-medium text-gray-500 hover:text-gray-900 mx-5 hover:underline">Home</Link>
              <Link to="/user/store" className="text-base font-medium text-gray-500 hover:text-gray-900 mx-5 hover:underline">Store</Link>
              <Link to="" className="text-base font-medium text-gray-500 hover:text-gray-900 mx-5 hover:underline">About Us</Link>
              <Link to="" className="text-base font-medium text-gray-500 hover:text-gray-900 mx-5 hover:underline">Contact Us</Link>
              <Link 
                onClick={handleLogin}
                className="ml-8 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transition duration-300"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Home</Link>
              <Link to="/store" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Store</Link>
              <Link to="/about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">About Us</Link>
              <Link to="/contact" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Contact Us</Link>
              <Link to="/user/login" className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:text-blue-700 hover:bg-gray-50">Login</Link>
            </div>
          </div>
        )}
      </nav>
      <div className="relative">
        <img
          src={heroImage}
          alt="Cyclist in gear"
          className="w-full h-[60vh] object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-white text-6xl font-bold tracking-wider animate-pulse">
            PEDALQUEST
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;