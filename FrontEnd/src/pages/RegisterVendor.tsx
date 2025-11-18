import { UserIcon, SettingsIcon, LockIcon, StoreIcon, LogOutIcon } from 'lucide-react';
import { Header } from '../components/Header';
import { logout } from '../utils/auth';
export const RegisterVendor = () => {
  return <div className="flex flex-col min-h-screen bg-transparent w-full relative">
      <Header />
      <div className="flex flex-1">
        <aside className="w-72 bg-[#0a0a0f]/60 backdrop-blur-sm border-r border-gray-800 min-h-screen p-6 register-vendor-sidebar">
          <h2 
            className="text-white font-bold text-lg mb-6 register-vendor-sidebar-title"
            style={{ fontFamily: '"Poppins", sans-serif' }}
          >
            Profile Settings
          </h2>
          <nav className="space-y-2">
            <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-white register-vendor-nav-button">
              <UserIcon size={20} className="register-vendor-nav-icon" />
              <span className="register-vendor-nav-text">Personal Details</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-white register-vendor-nav-button">
              <SettingsIcon size={20} className="register-vendor-nav-icon" />
              <span className="register-vendor-nav-text">Account Settings</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-white register-vendor-nav-button">
              <LockIcon size={20} className="register-vendor-nav-icon" />
              <span className="register-vendor-nav-text">Security</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-purple-600 text-white register-vendor-nav-button register-vendor-nav-button-active">
              <StoreIcon size={20} className="register-vendor-nav-icon" />
              <span className="register-vendor-nav-text">Register as a Vendor</span>
            </button>
          </nav>
          <div className="mt-auto pt-8 border-t border-gray-800">
            <button 
              onClick={logout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-white register-vendor-logout-button"
            >
              <LogOutIcon size={20} className="register-vendor-logout-icon" />
              <span className="register-vendor-logout-text">Log Out</span>
            </button>
          </div>
        </aside>
        <main className="flex-1 p-8">
          <div className="max-w-4xl register-vendor-form-container">
            <h1 
              className="text-3xl font-bold text-white mb-2 register-vendor-title"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              <span className="inline-block register-vendor-title-word">Register</span>{' '}
              <span className="inline-block register-vendor-title-word">as</span>{' '}
              <span className="inline-block register-vendor-title-word">a</span>{' '}
              <span className="inline-block register-vendor-title-word">Vendor</span>
            </h1>
            <p className="text-gray-400 mb-8 register-vendor-subtitle">
              <span className="inline-block register-vendor-subtitle-phrase">Fill out the form below</span>{' '}
              <span className="inline-block register-vendor-subtitle-phrase">to apply to become a vendor.</span>
            </p>
            <form className="space-y-6">
              <div className="register-vendor-field-group">
                <label className="block text-white mb-2 register-vendor-label">
                  Company Name <span className="text-red-400">*</span>
                </label>
                <input type="text" placeholder="Enter your company name" className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 register-vendor-input" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="register-vendor-field-group">
                  <label className="block text-white mb-2 register-vendor-label">
                    Service Type <span className="text-red-400">*</span>
                  </label>
                  <input type="text" placeholder="e.g., Catering, Photography, DJ Services" className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 register-vendor-input" />
                </div>
                <div className="register-vendor-field-group">
                  <label className="block text-white mb-2 register-vendor-label">
                    Address <span className="text-red-400">*</span>
                  </label>
                  <input type="text" placeholder="Enter your business address" className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 register-vendor-input" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="register-vendor-field-group">
                  <label className="block text-white mb-2 register-vendor-label">
                    Main Photo URL
                  </label>
                  <input type="text" placeholder="https://example.com/main-photo.jpg" className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 register-vendor-input" />
                </div>
                <div className="register-vendor-field-group">
                  <label className="block text-white mb-2 register-vendor-label">
                    Detail Photo URL
                  </label>
                  <input type="text" placeholder="https://example.com/detail-photo.jpg" className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 register-vendor-input" />
                </div>
              </div>
              <div className="register-vendor-field-group">
                <label className="block text-white mb-2 register-vendor-label">
                  Details
                </label>
                <textarea rows={6} placeholder="Describe your services in detail. Include your experience, specialties, and what makes your service unique." className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 register-vendor-textarea"></textarea>
              </div>
              <div className="flex justify-end">
                <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-8 rounded-lg font-medium register-vendor-submit-button">
                  Request to Register as a Vendor
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
      <style>{`
        /* Register Vendor Sidebar Animations */
        .register-vendor-sidebar-title {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .register-vendor-sidebar-title:hover {
          transform: translateX(5px);
          color: #a78bfa;
        }
        
        /* Navigation Buttons */
        .register-vendor-nav-button {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
        }
        .register-vendor-nav-button:hover {
          transform: translateX(5px);
          background: rgba(139, 92, 246, 0.2) !important;
        }
        .register-vendor-nav-button-active {
          background: #7c3aed !important;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
        }
        .register-vendor-nav-icon {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .register-vendor-nav-button:hover .register-vendor-nav-icon {
          transform: scale(1.2) rotate(5deg);
          color: #a78bfa;
        }
        .register-vendor-nav-text {
          transition: all 0.3s ease;
        }
        .register-vendor-nav-button:hover .register-vendor-nav-text {
          color: #a78bfa;
        }
        
        /* Logout Button */
        .register-vendor-logout-button {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .register-vendor-logout-button:hover {
          transform: translateX(5px);
          background: rgba(239, 68, 68, 0.2);
        }
        .register-vendor-logout-icon {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .register-vendor-logout-button:hover .register-vendor-logout-icon {
          transform: scale(1.2) rotate(-5deg);
          color: #ef4444;
        }
        .register-vendor-logout-text {
          transition: all 0.3s ease;
        }
        .register-vendor-logout-button:hover .register-vendor-logout-text {
          color: #ef4444;
        }
        
        /* Form Container */
        .register-vendor-form-container {
          transition: all 0.3s ease;
        }
        
        /* Title */
        .register-vendor-title {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .register-vendor-title-word {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: inline-block;
          cursor: default;
        }
        .register-vendor-title-word:hover {
          transform: translateY(-4px) scale(1.1) rotate(2deg);
          color: #a78bfa;
          text-shadow: 0 6px 20px rgba(139, 92, 246, 0.4), 0 0 16px rgba(139, 92, 246, 0.3);
        }
        
        /* Subtitle */
        .register-vendor-subtitle {
          transition: all 0.3s ease;
        }
        .register-vendor-subtitle-phrase {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: inline-block;
          cursor: default;
        }
        .register-vendor-subtitle-phrase:hover {
          transform: translateY(-2px) scale(1.05);
          color: #c4b5fd;
          background: rgba(139, 92, 246, 0.1);
          padding: 2px 4px;
          border-radius: 4px;
        }
        
        /* Form Fields */
        .register-vendor-field-group {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .register-vendor-field-group:hover {
          transform: translateX(5px);
        }
        .register-vendor-label {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .register-vendor-field-group:hover .register-vendor-label {
          color: #a78bfa;
          transform: translateX(4px);
        }
        .register-vendor-input,
        .register-vendor-textarea {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .register-vendor-input:hover:not(:focus),
        .register-vendor-textarea:hover:not(:focus) {
          transform: translateY(-2px);
          border-color: rgba(139, 92, 246, 0.5);
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);
        }
        .register-vendor-input:focus,
        .register-vendor-textarea:focus {
          transform: translateY(-3px);
          border-color: #a78bfa;
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.3), 0 0 0 2px rgba(139, 92, 246, 0.5);
        }
        
        /* Submit Button */
        .register-vendor-submit-button {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
        }
        .register-vendor-submit-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }
        .register-vendor-submit-button:hover::before {
          left: 100%;
        }
        .register-vendor-submit-button:hover {
          transform: translateY(-3px) scale(1.05) rotate(1deg);
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.4), 0 0 16px rgba(139, 92, 246, 0.3);
        }
        .register-vendor-submit-button:active {
          transform: translateY(-1px) scale(1.02);
        }
      `}</style>
    </div>;
};