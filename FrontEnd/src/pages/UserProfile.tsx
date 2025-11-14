import React, { useState } from 'react';
import { UserIcon, SettingsIcon, LockIcon, StoreIcon, LogOutIcon } from 'lucide-react';
import { Header } from '../components/Header';
import { logout } from '../utils/auth';
export const UserProfile = () => {
  const [activeSection, setActiveSection] = useState('personal');
  const sections = [{
    id: 'personal',
    icon: UserIcon,
    label: 'Personal Details'
  }, {
    id: 'account',
    icon: SettingsIcon,
    label: 'Account Settings'
  }, {
    id: 'security',
    icon: LockIcon,
    label: 'Security'
  }, {
    id: 'vendor',
    icon: StoreIcon,
    label: 'Register as a Vendor'
  }];
  return <div className="flex flex-col min-h-screen bg-[#0a0a0f] w-full">
      <Header />
      <div className="flex flex-1">
        <aside className="w-72 bg-[#0a0a0f] border-r border-gray-800 min-h-screen p-6">
          <h2 className="text-white font-bold text-lg mb-6">
            Profile Settings
          </h2>
          <nav className="space-y-2">
            {sections.map(section => {
            const Icon = section.icon;
            return <button key={section.id} onClick={() => setActiveSection(section.id)} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeSection === section.id ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                  <Icon size={20} />
                  <span>{section.label}</span>
                </button>;
          })}
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
          {activeSection === 'personal' && <div className="max-w-3xl">
              <h1 className="text-3xl font-bold text-white mb-2">
                Personal Details
              </h1>
              <p className="text-gray-400 mb-8">
                Update your photo and personal details here.
              </p>
              <div className="flex items-center space-x-6 mb-8">
                <div className="w-24 h-24 rounded-full bg-[#e8c4a3] flex items-center justify-center text-4xl text-white">
                  O
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-white">Jane Doe</h2>
                  <p className="text-gray-400">janedoe@example.com</p>
                </div>
                <button className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-lg">
                  Change Photo
                </button>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-white mb-2">Full Name</label>
                  <input type="text" defaultValue="Jane Doe" className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
                <div>
                  <label className="block text-white mb-2">Username</label>
                  <input type="text" defaultValue="janedoe" className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
                <div>
                  <label className="block text-white mb-2">Public Email</label>
                  <input type="email" placeholder="Enter your public email address" className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
                <div>
                  <label className="block text-white mb-2">Short Bio</label>
                  <textarea placeholder="Tell us a little about yourself" rows={4} className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"></textarea>
                </div>
                <div className="flex justify-end space-x-4 pt-4">
                  <button className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg">
                    Cancel
                  </button>
                  <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>}
        </main>
      </div>
    </div>;
};