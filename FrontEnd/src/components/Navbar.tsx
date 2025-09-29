import React from 'react';
import { Link } from 'react-router-dom';
export const Navbar = () => {
  return <nav className="bg-white shadow-sm py-4 px-6 md:px-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold text-indigo-600">
            Event Craft
          </Link>
        </div>
        <div className="hidden md:flex space-x-8">
          <Link to="/" className="text-gray-600 hover:text-indigo-600 transition-colors">
            Home
          </Link>
          <Link to="/vendors" className="text-gray-600 hover:text-indigo-600 transition-colors">
            Vendors
          </Link>
          <Link to="/about" className="text-gray-600 hover:text-indigo-600 transition-colors">
            About
          </Link>
          <Link to="/contact" className="text-gray-600 hover:text-indigo-600 transition-colors">
            Contact
          </Link>
        </div>
        <div>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
            Sign In
          </button>
        </div>
      </div>
    </nav>;
};