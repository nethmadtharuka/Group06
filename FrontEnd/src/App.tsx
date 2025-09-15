import React from 'react';
import { Navbar } from './components/Navbar';
import { VendorRegistrationForm } from './components/VendorRegistrationForm';
export function App() {
  return <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <div className="flex justify-center">
          <VendorRegistrationForm />
        </div>
      </div>
    </div>;
}