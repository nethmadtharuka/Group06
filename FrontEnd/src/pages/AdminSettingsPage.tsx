import { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { 
  SettingsIcon, 
  GlobeIcon, 
  MailIcon, 
  BellIcon, 
  ShieldIcon, 
  ServerIcon, 
  PaletteIcon,
  SaveIcon,
  CheckIcon,
  XIcon
} from 'lucide-react';

export const AdminSettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'EventCraft',
    siteDescription: 'Your trusted event planning platform',
    contactEmail: 'admin@eventcraft.com',
    contactPhone: '+1 (555) 123-4567',
    address: '123 Event Street, City, State 12345',
  });

  // Email Settings
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: 'smtp.example.com',
    smtpPort: '587',
    smtpUser: 'noreply@eventcraft.com',
    smtpPassword: '••••••••',
    fromEmail: 'noreply@eventcraft.com',
    fromName: 'EventCraft',
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    enableEmailNotifications: true,
    enablePushNotifications: true,
    notifyOnNewUser: true,
    notifyOnNewVendor: true,
    notifyOnNewEvent: false,
    notifyOnNewMessage: true,
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    requireEmailVerification: true,
    requirePhoneVerification: false,
    twoFactorAuth: false,
    sessionTimeout: '30',
    maxLoginAttempts: '5',
    passwordMinLength: '8',
  });

  // System Settings
  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    allowRegistration: true,
    allowVendorRegistration: true,
    autoApproveVendors: false,
    enableAnalytics: true,
    enableLogging: true,
  });

  // Appearance Settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    primaryColor: '#7c3aed',
    secondaryColor: '#a78bfa',
    theme: 'dark',
    logoUrl: '/LOGO.png',
    faviconUrl: '/LOGO.png',
  });

  const handleSave = async (settingsType: string) => {
    setSaving(true);
    setSuccess('');
    setError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(`${settingsType} settings saved successfully!`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(`Failed to save ${settingsType} settings`);
      setTimeout(() => setError(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  const settingsTabs = [
    { id: 'general', label: 'General', icon: GlobeIcon },
    { id: 'email', label: 'Email', icon: MailIcon },
    { id: 'notifications', label: 'Notifications', icon: BellIcon },
    { id: 'security', label: 'Security', icon: ShieldIcon },
    { id: 'system', label: 'System', icon: ServerIcon },
    { id: 'appearance', label: 'Appearance', icon: PaletteIcon },
  ];

  return (
    <div className="flex bg-transparent w-full min-h-screen">
      <Sidebar type="admin" />
      <div className="flex-1 ml-64 min-h-screen">
        <header className="bg-[#0a0a0f]/60 backdrop-blur-sm border-b border-gray-800 px-8 py-4 admin-settings-header">
          <div className="flex items-center justify-between">
            <h1 
              className="text-2xl font-bold text-white admin-settings-title"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              Settings
            </h1>
          </div>
        </header>
        <main className="p-8">
          <div className="max-w-6xl mx-auto">
            {/* Tabs */}
            <div className="mb-6 border-b border-gray-700 admin-settings-tabs">
              <div className="flex space-x-1">
                {settingsTabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-4 py-3 font-medium transition-all admin-settings-tab ${
                        activeTab === tab.id
                          ? 'text-purple-500 border-b-2 border-purple-500 admin-settings-tab-active'
                          : 'text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      <Icon size={18} className="admin-settings-tab-icon" />
                      <span className="admin-settings-tab-text">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Success/Error Messages */}
            {success && (
              <div className="mb-6 p-4 bg-green-900/30 border border-green-700 rounded-lg admin-settings-success">
                <div className="flex items-center space-x-2">
                  <CheckIcon size={20} className="text-green-400" />
                  <p className="text-green-400">{success}</p>
                </div>
              </div>
            )}
            {error && (
              <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg admin-settings-error">
                <div className="flex items-center space-x-2">
                  <XIcon size={20} className="text-red-400" />
                  <p className="text-red-400">{error}</p>
                </div>
              </div>
            )}

            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6 border border-gray-700 admin-settings-section">
                <h2 className="text-xl font-bold text-white mb-6 admin-settings-section-title">General Settings</h2>
                <div className="space-y-6">
                  <div className="admin-settings-field-group">
                    <label className="block text-white mb-2 admin-settings-label">Site Name</label>
                    <input
                      type="text"
                      value={generalSettings.siteName}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, siteName: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 admin-settings-input"
                    />
                  </div>
                  <div className="admin-settings-field-group">
                    <label className="block text-white mb-2 admin-settings-label">Site Description</label>
                    <textarea
                      value={generalSettings.siteDescription}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, siteDescription: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 admin-settings-textarea"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="admin-settings-field-group">
                      <label className="block text-white mb-2 admin-settings-label">Contact Email</label>
                      <input
                        type="email"
                        value={generalSettings.contactEmail}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, contactEmail: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 admin-settings-input"
                      />
                    </div>
                    <div className="admin-settings-field-group">
                      <label className="block text-white mb-2 admin-settings-label">Contact Phone</label>
                      <input
                        type="tel"
                        value={generalSettings.contactPhone}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, contactPhone: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 admin-settings-input"
                      />
                    </div>
                  </div>
                  <div className="admin-settings-field-group">
                    <label className="block text-white mb-2 admin-settings-label">Address</label>
                    <input
                      type="text"
                      value={generalSettings.address}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, address: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 admin-settings-input"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleSave('General')}
                      disabled={saving}
                      className="flex items-center space-x-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium admin-settings-save-button"
                    >
                      <SaveIcon size={18} />
                      <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Email Settings */}
            {activeTab === 'email' && (
              <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6 border border-gray-700 admin-settings-section">
                <h2 className="text-xl font-bold text-white mb-6 admin-settings-section-title">Email Settings</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="admin-settings-field-group">
                      <label className="block text-white mb-2 admin-settings-label">SMTP Host</label>
                      <input
                        type="text"
                        value={emailSettings.smtpHost}
                        onChange={(e) => setEmailSettings({ ...emailSettings, smtpHost: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 admin-settings-input"
                      />
                    </div>
                    <div className="admin-settings-field-group">
                      <label className="block text-white mb-2 admin-settings-label">SMTP Port</label>
                      <input
                        type="text"
                        value={emailSettings.smtpPort}
                        onChange={(e) => setEmailSettings({ ...emailSettings, smtpPort: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 admin-settings-input"
                      />
                    </div>
                  </div>
                  <div className="admin-settings-field-group">
                    <label className="block text-white mb-2 admin-settings-label">SMTP Username</label>
                    <input
                      type="text"
                      value={emailSettings.smtpUser}
                      onChange={(e) => setEmailSettings({ ...emailSettings, smtpUser: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 admin-settings-input"
                    />
                  </div>
                  <div className="admin-settings-field-group">
                    <label className="block text-white mb-2 admin-settings-label">SMTP Password</label>
                    <input
                      type="password"
                      value={emailSettings.smtpPassword}
                      onChange={(e) => setEmailSettings({ ...emailSettings, smtpPassword: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 admin-settings-input"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="admin-settings-field-group">
                      <label className="block text-white mb-2 admin-settings-label">From Email</label>
                      <input
                        type="email"
                        value={emailSettings.fromEmail}
                        onChange={(e) => setEmailSettings({ ...emailSettings, fromEmail: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 admin-settings-input"
                      />
                    </div>
                    <div className="admin-settings-field-group">
                      <label className="block text-white mb-2 admin-settings-label">From Name</label>
                      <input
                        type="text"
                        value={emailSettings.fromName}
                        onChange={(e) => setEmailSettings({ ...emailSettings, fromName: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 admin-settings-input"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleSave('Email')}
                      disabled={saving}
                      className="flex items-center space-x-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium admin-settings-save-button"
                    >
                      <SaveIcon size={18} />
                      <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6 border border-gray-700 admin-settings-section">
                <h2 className="text-xl font-bold text-white mb-6 admin-settings-section-title">Notification Settings</h2>
                <div className="space-y-4">
                  {Object.entries(notificationSettings).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-gray-900 rounded-lg admin-settings-toggle-group">
                      <div>
                        <label className="text-white font-medium admin-settings-toggle-label">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </label>
                        <p className="text-gray-400 text-sm mt-1">
                          {key === 'enableEmailNotifications' && 'Enable email notifications for all users'}
                          {key === 'enablePushNotifications' && 'Enable push notifications in the app'}
                          {key === 'notifyOnNewUser' && 'Send notification when a new user registers'}
                          {key === 'notifyOnNewVendor' && 'Send notification when a new vendor applies'}
                          {key === 'notifyOnNewEvent' && 'Send notification when a new event is created'}
                          {key === 'notifyOnNewMessage' && 'Send notification when a new message is received'}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer admin-settings-toggle">
                        <input
                          type="checkbox"
                          checked={value as boolean}
                          onChange={(e) => setNotificationSettings({ ...notificationSettings, [key]: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  ))}
                  <div className="flex justify-end pt-4">
                    <button
                      onClick={() => handleSave('Notification')}
                      disabled={saving}
                      className="flex items-center space-x-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium admin-settings-save-button"
                    >
                      <SaveIcon size={18} />
                      <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6 border border-gray-700 admin-settings-section">
                <h2 className="text-xl font-bold text-white mb-6 admin-settings-section-title">Security Settings</h2>
                <div className="space-y-6">
                  <div className="space-y-4">
                    {Object.entries(securitySettings).map(([key, value]) => {
                      if (typeof value === 'boolean') {
                        return (
                          <div key={key} className="flex items-center justify-between p-4 bg-gray-900 rounded-lg admin-settings-toggle-group">
                            <div>
                              <label className="text-white font-medium admin-settings-toggle-label">
                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                              </label>
                              <p className="text-gray-400 text-sm mt-1">
                                {key === 'requireEmailVerification' && 'Require users to verify their email address'}
                                {key === 'requirePhoneVerification' && 'Require users to verify their phone number'}
                                {key === 'twoFactorAuth' && 'Enable two-factor authentication for admin accounts'}
                              </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer admin-settings-toggle">
                              <input
                                type="checkbox"
                                checked={value as boolean}
                                onChange={(e) => setSecuritySettings({ ...securitySettings, [key]: e.target.checked })}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                            </label>
                          </div>
                        );
                      }
                      return (
                        <div key={key} className="admin-settings-field-group">
                          <label className="block text-white mb-2 admin-settings-label">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </label>
                          <input
                            type="text"
                            value={value as string}
                            onChange={(e) => setSecuritySettings({ ...securitySettings, [key]: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 admin-settings-input"
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleSave('Security')}
                      disabled={saving}
                      className="flex items-center space-x-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium admin-settings-save-button"
                    >
                      <SaveIcon size={18} />
                      <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* System Settings */}
            {activeTab === 'system' && (
              <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6 border border-gray-700 admin-settings-section">
                <h2 className="text-xl font-bold text-white mb-6 admin-settings-section-title">System Settings</h2>
                <div className="space-y-4">
                  {Object.entries(systemSettings).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-gray-900 rounded-lg admin-settings-toggle-group">
                      <div>
                        <label className="text-white font-medium admin-settings-toggle-label">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </label>
                        <p className="text-gray-400 text-sm mt-1">
                          {key === 'maintenanceMode' && 'Put the site in maintenance mode (only admins can access)'}
                          {key === 'allowRegistration' && 'Allow new users to register'}
                          {key === 'allowVendorRegistration' && 'Allow new vendors to register'}
                          {key === 'autoApproveVendors' && 'Automatically approve vendor registrations'}
                          {key === 'enableAnalytics' && 'Enable analytics tracking'}
                          {key === 'enableLogging' && 'Enable system logging'}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer admin-settings-toggle">
                        <input
                          type="checkbox"
                          checked={value as boolean}
                          onChange={(e) => setSystemSettings({ ...systemSettings, [key]: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  ))}
                  <div className="flex justify-end pt-4">
                    <button
                      onClick={() => handleSave('System')}
                      disabled={saving}
                      className="flex items-center space-x-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium admin-settings-save-button"
                    >
                      <SaveIcon size={18} />
                      <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
              <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6 border border-gray-700 admin-settings-section">
                <h2 className="text-xl font-bold text-white mb-6 admin-settings-section-title">Appearance Settings</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="admin-settings-field-group">
                      <label className="block text-white mb-2 admin-settings-label">Primary Color</label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={appearanceSettings.primaryColor}
                          onChange={(e) => setAppearanceSettings({ ...appearanceSettings, primaryColor: e.target.value })}
                          className="w-16 h-12 bg-gray-900 border border-gray-700 rounded-lg cursor-pointer admin-settings-color-input"
                        />
                        <input
                          type="text"
                          value={appearanceSettings.primaryColor}
                          onChange={(e) => setAppearanceSettings({ ...appearanceSettings, primaryColor: e.target.value })}
                          className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 admin-settings-input"
                        />
                      </div>
                    </div>
                    <div className="admin-settings-field-group">
                      <label className="block text-white mb-2 admin-settings-label">Secondary Color</label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={appearanceSettings.secondaryColor}
                          onChange={(e) => setAppearanceSettings({ ...appearanceSettings, secondaryColor: e.target.value })}
                          className="w-16 h-12 bg-gray-900 border border-gray-700 rounded-lg cursor-pointer admin-settings-color-input"
                        />
                        <input
                          type="text"
                          value={appearanceSettings.secondaryColor}
                          onChange={(e) => setAppearanceSettings({ ...appearanceSettings, secondaryColor: e.target.value })}
                          className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 admin-settings-input"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="admin-settings-field-group">
                    <label className="block text-white mb-2 admin-settings-label">Theme</label>
                    <select
                      value={appearanceSettings.theme}
                      onChange={(e) => setAppearanceSettings({ ...appearanceSettings, theme: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 admin-settings-select"
                    >
                      <option value="dark">Dark</option>
                      <option value="light">Light</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="admin-settings-field-group">
                      <label className="block text-white mb-2 admin-settings-label">Logo URL</label>
                      <input
                        type="text"
                        value={appearanceSettings.logoUrl}
                        onChange={(e) => setAppearanceSettings({ ...appearanceSettings, logoUrl: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 admin-settings-input"
                      />
                    </div>
                    <div className="admin-settings-field-group">
                      <label className="block text-white mb-2 admin-settings-label">Favicon URL</label>
                      <input
                        type="text"
                        value={appearanceSettings.faviconUrl}
                        onChange={(e) => setAppearanceSettings({ ...appearanceSettings, faviconUrl: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 admin-settings-input"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleSave('Appearance')}
                      disabled={saving}
                      className="flex items-center space-x-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium admin-settings-save-button"
                    >
                      <SaveIcon size={18} />
                      <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
      <style>{`
        /* Header Animations */
        .admin-settings-title {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .admin-settings-header:hover .admin-settings-title {
          transform: translateX(5px);
          color: #a78bfa;
        }
        
        /* Tab Animations */
        .admin-settings-tab {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
        }
        .admin-settings-tab:hover {
          transform: translateY(-2px);
          color: #a78bfa !important;
        }
        .admin-settings-tab-active {
          color: #a78bfa !important;
        }
        .admin-settings-tab-icon {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .admin-settings-tab:hover .admin-settings-tab-icon {
          transform: scale(1.2) rotate(5deg);
        }
        .admin-settings-tab-text {
          transition: all 0.3s ease;
        }
        
        /* Success/Error Messages */
        .admin-settings-success {
          animation: fadeInUp 0.5s ease-out;
        }
        .admin-settings-error {
          animation: shake 0.5s ease-in-out;
        }
        
        /* Section Animations */
        .admin-settings-section {
          transition: all 0.3s ease;
        }
        .admin-settings-section-title {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .admin-settings-section:hover .admin-settings-section-title {
          transform: translateX(10px);
          color: #a78bfa;
        }
        
        /* Field Group Animations */
        .admin-settings-field-group {
          transition: all 0.3s ease;
        }
        .admin-settings-section:hover .admin-settings-field-group {
          transform: translateX(5px);
        }
        .admin-settings-label {
          transition: all 0.3s ease;
        }
        .admin-settings-field-group:hover .admin-settings-label {
          color: #a78bfa;
        }
        .admin-settings-input,
        .admin-settings-textarea,
        .admin-settings-select {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .admin-settings-input:hover,
        .admin-settings-textarea:hover,
        .admin-settings-select:hover {
          transform: translateY(-2px);
          border-color: #a78bfa;
        }
        .admin-settings-input:focus,
        .admin-settings-textarea:focus,
        .admin-settings-select:focus {
          transform: translateY(-2px);
          border-color: #a78bfa;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
        }
        .admin-settings-color-input {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .admin-settings-color-input:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
        }
        
        /* Toggle Group Animations */
        .admin-settings-toggle-group {
          transition: all 0.3s ease;
        }
        .admin-settings-section:hover .admin-settings-toggle-group {
          transform: translateX(5px);
        }
        .admin-settings-toggle-group:hover {
          background: rgba(139, 92, 246, 0.1);
          border-color: #a78bfa;
        }
        .admin-settings-toggle-label {
          transition: all 0.3s ease;
        }
        .admin-settings-toggle-group:hover .admin-settings-toggle-label {
          color: #a78bfa;
        }
        
        /* Save Button */
        .admin-settings-save-button {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
        }
        .admin-settings-save-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }
        .admin-settings-save-button:hover::before {
          left: 100%;
        }
        .admin-settings-save-button:hover {
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 4px 16px rgba(139, 92, 246, 0.5);
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
      `}</style>
    </div>
  );
};

