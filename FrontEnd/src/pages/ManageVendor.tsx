import React from 'react';
import { UserIcon, SettingsIcon, LockIcon, StoreIcon, LogOutIcon } from 'lucide-react';
import { Header } from '../components/Header';
import { logout } from '../utils/auth';
export const ManageVendor = () => {
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
              <span>Manage Vendor</span>
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
              Manage Vendor
            </h1>
            <p className="text-gray-400 mb-8">
              Edit your vendor profile details here.
            </p>
            <form className="space-y-6">
              <div>
                <label className="block text-white mb-2">Company Name</label>
                <input type="text" defaultValue="Elite Catering Co." className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
              <div>
                <label className="block text-white mb-2">Service Type</label>
                <input type="text" defaultValue="Catering Services" className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
              <div>
                <label className="block text-white mb-2">Address</label>
                <input type="text" defaultValue="456 Culinary Ave, Foodie City, FC 67890" className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white mb-2">
                    Main Photo URL
                  </label>
                  <input type="text" defaultValue="https://images.unsplash.com/photo-1555243896-c" className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
                <div>
                  <label className="block text-white mb-2">
                    Detail Photo URL
                  </label>
                  <input type="text" defaultValue="https://images.unsplash.com/photo-1551024601-be" className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
              </div>
              <div>
                <label className="block text-white mb-2">Details</label>
                <textarea rows={6} defaultValue="Providing exquisite culinary experiences for weddings, corporate events, and private parties. Our team of expert chefs uses only the freshest local ingredients to create unforgettable meals tailored to your specific tastes and dietary needs." className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"></textarea>
              </div>
              <div className="flex justify-end">
                <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-8 rounded-lg font-medium transition-colors">
                  Update
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>;
};