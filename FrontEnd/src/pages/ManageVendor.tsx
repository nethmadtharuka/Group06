import { UserIcon, SettingsIcon, LockIcon, StoreIcon, LogOutIcon } from 'lucide-react';
import { Header } from '../components/Header';
import { logout } from '../utils/auth';
export const ManageVendor = () => {
  return <div className="flex flex-col min-h-screen bg-transparent w-full relative">
      <Header />
      <div className="flex flex-1">
        <aside className="w-72 bg-[#0a0a0f]/60 backdrop-blur-sm border-r border-gray-800 min-h-screen p-6 manage-vendor-sidebar">
          <h2 
            className="text-white font-bold text-lg mb-6 manage-vendor-sidebar-title"
            style={{ fontFamily: '"Poppins", sans-serif' }}
          >
            Profile Settings
          </h2>
          <nav className="space-y-2">
            <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-white manage-vendor-nav-button">
              <UserIcon size={20} className="manage-vendor-nav-icon" />
              <span className="manage-vendor-nav-text">Personal Details</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-white manage-vendor-nav-button">
              <SettingsIcon size={20} className="manage-vendor-nav-icon" />
              <span className="manage-vendor-nav-text">Account Settings</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-white manage-vendor-nav-button">
              <LockIcon size={20} className="manage-vendor-nav-icon" />
              <span className="manage-vendor-nav-text">Security</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-purple-600 text-white manage-vendor-nav-button manage-vendor-nav-button-active">
              <StoreIcon size={20} className="manage-vendor-nav-icon" />
              <span className="manage-vendor-nav-text">Manage Vendor</span>
            </button>
          </nav>
          <div className="mt-auto pt-8 border-t border-gray-800">
            <button 
              onClick={logout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-white manage-vendor-logout-button"
            >
              <LogOutIcon size={20} className="manage-vendor-logout-icon" />
              <span className="manage-vendor-logout-text">Log Out</span>
            </button>
          </div>
        </aside>
        <main className="flex-1 p-8">
          <div className="max-w-4xl manage-vendor-form-container">
            <h1 
              className="text-3xl font-bold text-white mb-2 manage-vendor-title"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              Manage Vendor
            </h1>
            <p className="text-gray-400 mb-8 manage-vendor-subtitle">
              Edit your vendor profile details here.
            </p>
            <form className="space-y-6">
              <div className="manage-vendor-field-group">
                <label className="block text-white mb-2 manage-vendor-label">Company Name</label>
                <input type="text" defaultValue="Elite Catering Co." className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 manage-vendor-input" />
              </div>
              <div className="manage-vendor-field-group">
                <label className="block text-white mb-2 manage-vendor-label">Service Type</label>
                <input type="text" defaultValue="Catering Services" className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 manage-vendor-input" />
              </div>
              <div className="manage-vendor-field-group">
                <label className="block text-white mb-2 manage-vendor-label">Address</label>
                <input type="text" defaultValue="456 Culinary Ave, Foodie City, FC 67890" className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 manage-vendor-input" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="manage-vendor-field-group">
                  <label className="block text-white mb-2 manage-vendor-label">
                    Main Photo URL
                  </label>
                  <input type="text" defaultValue="https://images.unsplash.com/photo-1555243896-c" className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 manage-vendor-input" />
                </div>
                <div className="manage-vendor-field-group">
                  <label className="block text-white mb-2 manage-vendor-label">
                    Detail Photo URL
                  </label>
                  <input type="text" defaultValue="https://images.unsplash.com/photo-1551024601-be" className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 manage-vendor-input" />
                </div>
              </div>
              <div className="manage-vendor-field-group">
                <label className="block text-white mb-2 manage-vendor-label">Details</label>
                <textarea rows={6} defaultValue="Providing exquisite culinary experiences for weddings, corporate events, and private parties. Our team of expert chefs uses only the freshest local ingredients to create unforgettable meals tailored to your specific tastes and dietary needs." className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 manage-vendor-textarea"></textarea>
              </div>
              <div className="flex justify-end">
                <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-8 rounded-lg font-medium manage-vendor-submit-button">
                  Update
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
      <style>{`
        /* Manage Vendor Sidebar Animations */
        .manage-vendor-sidebar-title {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .manage-vendor-sidebar-title:hover {
          transform: translateX(5px);
          color: #a78bfa;
        }
        
        /* Navigation Buttons */
        .manage-vendor-nav-button {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
        }
        .manage-vendor-nav-button:hover {
          transform: translateX(5px);
          background: rgba(139, 92, 246, 0.2) !important;
        }
        .manage-vendor-nav-button-active {
          background: #7c3aed !important;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
        }
        .manage-vendor-nav-icon {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .manage-vendor-nav-button:hover .manage-vendor-nav-icon {
          transform: scale(1.2) rotate(5deg);
          color: #a78bfa;
        }
        .manage-vendor-nav-text {
          transition: all 0.3s ease;
        }
        .manage-vendor-nav-button:hover .manage-vendor-nav-text {
          color: #a78bfa;
        }
        
        /* Logout Button */
        .manage-vendor-logout-button {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .manage-vendor-logout-button:hover {
          transform: translateX(5px);
          background: rgba(239, 68, 68, 0.2);
        }
        .manage-vendor-logout-icon {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .manage-vendor-logout-button:hover .manage-vendor-logout-icon {
          transform: scale(1.2) rotate(-5deg);
          color: #ef4444;
        }
        .manage-vendor-logout-text {
          transition: all 0.3s ease;
        }
        .manage-vendor-logout-button:hover .manage-vendor-logout-text {
          color: #ef4444;
        }
        
        /* Form Container */
        .manage-vendor-form-container {
          transition: all 0.3s ease;
        }
        
        /* Title */
        .manage-vendor-title {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .manage-vendor-form-container:hover .manage-vendor-title {
          transform: translateX(10px);
          color: #a78bfa;
        }
        
        /* Subtitle */
        .manage-vendor-subtitle {
          transition: all 0.3s ease;
        }
        .manage-vendor-form-container:hover .manage-vendor-subtitle {
          color: #c4b5fd;
        }
        
        /* Form Fields */
        .manage-vendor-field-group {
          transition: all 0.3s ease;
        }
        .manage-vendor-form-container:hover .manage-vendor-field-group {
          transform: translateX(5px);
        }
        .manage-vendor-label {
          transition: all 0.3s ease;
        }
        .manage-vendor-field-group:hover .manage-vendor-label {
          color: #a78bfa;
        }
        .manage-vendor-input,
        .manage-vendor-textarea {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .manage-vendor-input:hover,
        .manage-vendor-textarea:hover {
          transform: translateY(-2px);
          border-color: #a78bfa;
        }
        .manage-vendor-input:focus,
        .manage-vendor-textarea:focus {
          transform: translateY(-2px);
          border-color: #a78bfa;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
        }
        
        /* Submit Button */
        .manage-vendor-submit-button {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
        }
        .manage-vendor-submit-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }
        .manage-vendor-submit-button:hover::before {
          left: 100%;
        }
        .manage-vendor-submit-button:hover {
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 4px 16px rgba(139, 92, 246, 0.5);
        }
      `}</style>
    </div>;
};