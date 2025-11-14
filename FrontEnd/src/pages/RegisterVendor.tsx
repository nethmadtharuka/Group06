import React from 'react';
import { UserIcon, SettingsIcon, LockIcon, StoreIcon, LogOutIcon } from 'lucide-react';
import { Header } from '../components/Header';
import { logout } from '../utils/auth';
export const RegisterVendor = () => {
  return <div className="flex flex-col min-h-screen bg-[#0a0a0f] w-full">
      <Header />
      <div className="flex flex-1">
        <aside className="w-72 bg-[#0a0a0f] border-r border-gray-800 min-h-screen p-6">
          <h2 className="text-white font-bold text-lg mb-6">
            Profile Settings
          </h2>
          <nav className="space-y-2">
            <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
              <UserIcon size={20} />
              <span>Personal Details</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
              <SettingsIcon size={20} />
              <span>Account Settings</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
              <LockIcon size={20} />
              <span>Security</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-purple-600 text-white transition-colors">
              <StoreIcon size={20} />
              <span>Register as a Vendor</span>
            </button>
          </nav>
          <div className="mt-auto pt-8 border-t border-gray-800">
            <button 
              onClick={logout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <LogOutIcon size={20} />
              <span>Log Out</span>
            </button>
          </div>
        </aside>
        <main className="flex-1 p-8">
          <div className="max-w-4xl">
            <h1 className="text-3xl font-bold text-white mb-2">
              Register as a Vendor
            </h1>
            <p className="text-gray-400 mb-8">
              Fill out the form below to apply to become a vendor.
            </p>
            <form className="space-y-6">
              <div>
                <label className="block text-white mb-2">Company Name</label>
                <input type="text" placeholder="Enter your company name" className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white mb-2">Service Type</label>
                  <input type="text" placeholder="e.g., Catering, Photography" className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
                <div>
                  <label className="block text-white mb-2">Address</label>
                  <input type="text" placeholder="Enter your business address" className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white mb-2">
                    Main Photo URL
                  </label>
                  <input type="text" placeholder="https://example.com/main-photo.jpg" className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
                <div>
                  <label className="block text-white mb-2">
                    Detail Photo URL
                  </label>
                  <input type="text" placeholder="https://example.com/detail-photo.jpg" className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
              </div>
              <div>
                <label className="block text-white mb-2">Details</label>
                <textarea rows={6} placeholder="Describe your services in detail" className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"></textarea>
              </div>
              <div className="flex justify-end">
                <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-8 rounded-lg font-medium transition-colors">
                  Request to Register as a Vendor
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>;
};