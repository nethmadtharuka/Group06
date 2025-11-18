import { useState, useEffect } from 'react';
import { UserIcon, SettingsIcon, LockIcon, StoreIcon, LogOutIcon } from 'lucide-react';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { logout } from '../utils/auth';
import { userAPI, vendorAPI, vendorPackageAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { EditIcon, TrashIcon, PlusIcon } from 'lucide-react';

export const UserProfile = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('personal');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    bio: '', // Note: User entity doesn't have bio, but we can add it to the form
  });

  // Vendor registration form state
  const [vendorFormData, setVendorFormData] = useState({
    companyName: '',
    serviceType: '',
    address: '',
    mainPhotoURL: '',
    detailPhotoURL: '',
    details: '',
  });
  const [vendorSubmitting, setVendorSubmitting] = useState(false);
  const [vendorError, setVendorError] = useState('');
  const [vendorSuccess, setVendorSuccess] = useState('');
  
  // Vendor management state (for VENDOR role)
  const [vendor, setVendor] = useState<any>(null);
  const [vendorLoading, setVendorLoading] = useState(false);
  const [vendorUpdateData, setVendorUpdateData] = useState({
    companyName: '',
    serviceType: '',
    address: '',
    mainPhotoURL: '',
    detailPhotoURL: '',
    details: '',
  });
  const [vendorUpdateSubmitting, setVendorUpdateSubmitting] = useState(false);
  
  // Package management state
  const [packages, setPackages] = useState<any[]>([]);
  const [packageFormData, setPackageFormData] = useState({
    packageName: '',
    description: '',
    price: '',
    features: [] as string[],
    duration: '',
    isActive: true,
  });
  const [currentFeature, setCurrentFeature] = useState('');
  const [editingPackage, setEditingPackage] = useState<any>(null);
  const [packageSubmitting, setPackageSubmitting] = useState(false);
  const [packageError, setPackageError] = useState('');
  const [packageSuccess, setPackageSuccess] = useState('');

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          navigate('/login');
          return;
        }

        const userData = await userAPI.getUserById(userId);
        if (userData && (userData.id || userData._id)) {
          setUser(userData);
          setFormData({
            fullName: userData.fullName || '',
            username: userData.username || '',
            email: userData.email || '',
            phone: userData.phone || '',
            bio: '', // User entity doesn't have bio field
          });
          
          // If user is a VENDOR, load vendor data
          if (userData.role === 'VENDOR') {
            await loadVendorData(userId);
          }
        } else {
          setError('User not found');
        }
      } catch (error) {
        console.error('Error loading user:', error);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [navigate]);

  const loadVendorData = async (userId: string) => {
    setVendorLoading(true);
    try {
      const vendorData = await vendorAPI.getVendorByUserId(userId);
      if (vendorData) {
        setVendor(vendorData);
        setVendorUpdateData({
          companyName: vendorData.companyName || '',
          serviceType: vendorData.serviceType || '',
          address: vendorData.address || '',
          mainPhotoURL: vendorData.mainPhotoURL || '',
          detailPhotoURL: vendorData.detailPhotoURL || '',
          details: vendorData.details || '',
        });
        
        // Load packages
        if (vendorData.id) {
          await loadPackages(vendorData.id);
        }
      }
    } catch (error) {
      console.error('Error loading vendor data:', error);
    } finally {
      setVendorLoading(false);
    }
  };

  const loadPackages = async (vendorId: string) => {
    try {
      const packagesData = await vendorPackageAPI.getPackagesByVendor(vendorId);
      setPackages(packagesData || []);
    } catch (error) {
      console.error('Error loading packages:', error);
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        navigate('/login');
        return;
      }

      const updatedUser = await userAPI.updateUser(userId, {
        fullName: formData.fullName,
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
      });

      // Update local storage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setUser(updatedUser);
      setSuccess('Profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original user data
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        username: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: '',
      });
    }
    setError('');
    setSuccess('');
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  const handleVendorInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setVendorFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVendorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setVendorError('');
    setVendorSuccess('');
    setVendorSubmitting(true);

    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        navigate('/login');
        return;
      }

      // Validate required fields
      if (!vendorFormData.companyName || !vendorFormData.serviceType || !vendorFormData.address) {
        setVendorError('Please fill in all required fields (Company Name, Service Type, Address)');
        setVendorSubmitting(false);
        return;
      }

      const vendor = await vendorAPI.registerVendor(userId, {
        companyName: vendorFormData.companyName,
        serviceType: vendorFormData.serviceType,
        address: vendorFormData.address,
        mainPhotoURL: vendorFormData.mainPhotoURL || undefined,
        detailPhotoURL: vendorFormData.detailPhotoURL || undefined,
        details: vendorFormData.details || undefined,
      });

      setVendorSuccess('Vendor registration submitted successfully! Your application is pending approval.');
      
      // Clear form
      setVendorFormData({
        companyName: '',
        serviceType: '',
        address: '',
        mainPhotoURL: '',
        detailPhotoURL: '',
        details: '',
      });

      // Clear success message after 5 seconds
      setTimeout(() => setVendorSuccess(''), 5000);
    } catch (err: any) {
      setVendorError(err.message || 'Failed to register as vendor. Please try again.');
    } finally {
      setVendorSubmitting(false);
    }
  };

  // Vendor update handler (for VENDOR role)
  const handleVendorUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setVendorError('');
    setVendorSuccess('');
    setVendorUpdateSubmitting(true);

    try {
      const userId = localStorage.getItem('userId');
      if (!userId || !vendor?.id) {
        setVendorError('Vendor information not found');
        setVendorUpdateSubmitting(false);
        return;
      }

      const updatedVendor = await vendorAPI.updateVendor(vendor.id, userId, {
        companyName: vendorUpdateData.companyName,
        serviceType: vendorUpdateData.serviceType,
        address: vendorUpdateData.address,
        mainPhotoURL: vendorUpdateData.mainPhotoURL || undefined,
        detailPhotoURL: vendorUpdateData.detailPhotoURL || undefined,
        details: vendorUpdateData.details || undefined,
      });

      setVendor(updatedVendor);
      setVendorSuccess('Vendor information updated successfully!');
      setTimeout(() => setVendorSuccess(''), 3000);
    } catch (err: any) {
      setVendorError(err.message || 'Failed to update vendor information. Please try again.');
    } finally {
      setVendorUpdateSubmitting(false);
    }
  };

  // Package management handlers
  const handlePackageInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setPackageFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setPackageFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const addFeature = () => {
    if (currentFeature.trim()) {
      setPackageFormData(prev => ({
        ...prev,
        features: [...prev.features, currentFeature.trim()]
      }));
      setCurrentFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setPackageFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handlePackageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPackageError('');
    setPackageSuccess('');
    setPackageSubmitting(true);

    try {
      if (!vendor?.id) {
        setPackageError('Vendor information not found');
        setPackageSubmitting(false);
        return;
      }

      if (!packageFormData.packageName || !packageFormData.description || !packageFormData.price) {
        setPackageError('Please fill in all required fields');
        setPackageSubmitting(false);
        return;
      }

      const packageData = {
        packageName: packageFormData.packageName,
        description: packageFormData.description,
        price: parseFloat(packageFormData.price),
        features: packageFormData.features,
        duration: packageFormData.duration || undefined,
        isActive: packageFormData.isActive,
      };

      if (editingPackage) {
        // Update existing package
        await vendorPackageAPI.updatePackage(editingPackage.id, vendor.id, packageData);
        setPackageSuccess('Package updated successfully!');
      } else {
        // Create new package
        await vendorPackageAPI.createPackage(vendor.id, packageData);
        setPackageSuccess('Package created successfully!');
      }

      // Reload packages
      await loadPackages(vendor.id);
      
      // Reset form
      setPackageFormData({
        packageName: '',
        description: '',
        price: '',
        features: [],
        duration: '',
        isActive: true,
      });
      setEditingPackage(null);
      setCurrentFeature('');

      setTimeout(() => setPackageSuccess(''), 3000);
    } catch (err: any) {
      setPackageError(err.message || 'Failed to save package. Please try again.');
    } finally {
      setPackageSubmitting(false);
    }
  };

  const handleEditPackage = (pkg: any) => {
    setEditingPackage(pkg);
    setPackageFormData({
      packageName: pkg.packageName || '',
      description: pkg.description || '',
      price: pkg.price?.toString() || '',
      features: pkg.features || [],
      duration: pkg.duration || '',
      isActive: pkg.isActive !== undefined ? pkg.isActive : true,
    });
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeletePackage = async (packageId: string) => {
    if (!confirm('Are you sure you want to delete this package?')) {
      return;
    }

    try {
      if (!vendor?.id) {
        setPackageError('Vendor information not found');
        return;
      }

      await vendorPackageAPI.deletePackage(packageId, vendor.id);
      setPackageSuccess('Package deleted successfully!');
      await loadPackages(vendor.id);
      setTimeout(() => setPackageSuccess(''), 3000);
    } catch (err: any) {
      setPackageError(err.message || 'Failed to delete package. Please try again.');
    }
  };

  const cancelPackageEdit = () => {
    setEditingPackage(null);
    setPackageFormData({
      packageName: '',
      description: '',
      price: '',
      features: [],
      duration: '',
      isActive: true,
    });
    setCurrentFeature('');
  };

  const getSections = () => {
    const baseSections = [
      {
    id: 'personal',
    icon: UserIcon,
    label: 'Personal Details'
      },
      {
    id: 'account',
    icon: SettingsIcon,
    label: 'Account Settings'
      },
      {
    id: 'security',
    icon: LockIcon,
    label: 'Security'
      }
    ];
    
    if (user?.role === 'VENDOR') {
      return [
        ...baseSections,
        {
          id: 'vendor',
          icon: StoreIcon,
          label: 'Manage Vendor'
        }
      ];
    } else {
      return [
        ...baseSections,
        {
    id: 'vendor',
    icon: StoreIcon,
    label: 'Register as a Vendor'
        }
      ];
    }
  };

  const sections = getSections();

  if (loading) {
    return <Loading />;
  }
  return <div className="flex flex-col min-h-screen bg-transparent w-full relative">
      <Header />
      <div className="flex flex-1">
        <aside className="w-72 bg-[#0a0a0f]/60 backdrop-blur-sm border-r border-gray-800 min-h-screen p-6 profile-sidebar">
          <h2 
            className="text-white font-bold text-lg mb-6 profile-sidebar-title"
            style={{ fontFamily: '"Poppins", sans-serif' }}
          >
            Profile Settings
          </h2>
          <nav className="space-y-2">
            {sections.map(section => {
            const Icon = section.icon;
            return <button 
              key={section.id} 
              onClick={() => setActiveSection(section.id)} 
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg profile-nav-button ${activeSection === section.id ? 'bg-purple-600 text-white profile-nav-button-active' : 'text-white'}`}
            >
                  <Icon size={20} className="profile-nav-icon" />
                  <span className="profile-nav-text">{section.label}</span>
                </button>;
          })}
          </nav>
          <div className="mt-auto pt-8 border-t border-gray-800">
            <button 
              onClick={logout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-white profile-logout-button"
            >
              <LogOutIcon size={20} className="profile-logout-icon" />
              <span className="profile-logout-text">Log Out</span>
            </button>
          </div>
        </aside>
        <main className="flex-1 p-8">
          {activeSection === 'personal' && user && (
            <div className="max-w-3xl profile-section">
              <h1 
                className="text-3xl font-bold text-white mb-2 profile-section-title"
                style={{ fontFamily: '"Poppins", sans-serif' }}
              >
                <span className="inline-block profile-section-title-word">Personal</span>{' '}
                <span className="inline-block profile-section-title-word">Details</span>
              </h1>
              <p className="text-gray-400 mb-8 profile-section-subtitle">
                <span className="inline-block profile-section-subtitle-phrase">Update your photo</span>{' '}
                <span className="inline-block profile-section-subtitle-phrase">and personal details here.</span>
              </p>
              
              {error && (
                <div className="mb-4 p-4 bg-red-900/30 border border-red-700 rounded-lg profile-error">
                  <p className="text-red-400">{error}</p>
                </div>
              )}
              
              {success && (
                <div className="mb-4 p-4 bg-green-900/30 border border-green-700 rounded-lg profile-success">
                  <p className="text-green-400">{success}</p>
                </div>
              )}

              <div className="flex items-center space-x-6 mb-8 profile-avatar-section">
                <div className="w-24 h-24 rounded-full bg-[#e8c4a3] flex items-center justify-center text-4xl text-white profile-avatar">
                  {getInitials(user.fullName || user.username || 'U')}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-white profile-user-name">{user.fullName || user.username || 'User'}</h2>
                  <p className="text-gray-400 profile-user-email">{user.email || 'No email'}</p>
                </div>
                <button className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-lg profile-change-photo-button">
                  Change Photo
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="profile-field-group">
                  <label className="block text-white mb-2 profile-field-label">Full Name</label>
                  <input 
                    type="text" 
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 profile-input" 
                  />
                </div>
                <div className="profile-field-group">
                  <label className="block text-white mb-2 profile-field-label">Username</label>
                  <input 
                    type="text" 
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 profile-input" 
                  />
                </div>
                <div className="profile-field-group">
                  <label className="block text-white mb-2 profile-field-label">Email</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 profile-input" 
                  />
                </div>
                <div className="profile-field-group">
                  <label className="block text-white mb-2 profile-field-label">Phone</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 profile-input" 
                  />
                </div>
                <div className="flex justify-end space-x-4 pt-4">
                  <button 
                    onClick={handleCancel}
                    className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg profile-cancel-button"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg profile-save-button"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeSection === 'account' && (
            <div className="max-w-3xl profile-section">
              <h1 
                className="text-3xl font-bold text-white mb-2 profile-section-title"
                style={{ fontFamily: '"Poppins", sans-serif' }}
              >
                <span className="inline-block profile-section-title-word">Account</span>{' '}
                <span className="inline-block profile-section-title-word">Settings</span>
              </h1>
              <p className="text-gray-400 mb-8 profile-section-subtitle">
                <span className="inline-block profile-section-subtitle-phrase">Manage your account preferences</span>{' '}
                <span className="inline-block profile-section-subtitle-phrase">and settings.</span>
              </p>
              <div className="bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg p-6 profile-account-card">
                <p className="text-gray-400 profile-account-text">Account settings coming soon...</p>
              </div>
            </div>
          )}
          
          {activeSection === 'security' && (
            <div className="max-w-3xl profile-section">
              <h1 
                className="text-3xl font-bold text-white mb-2 profile-section-title"
                style={{ fontFamily: '"Poppins", sans-serif' }}
              >
                Security
              </h1>
              <p className="text-gray-400 mb-8 profile-section-subtitle">
                <span className="inline-block profile-section-subtitle-phrase">Change your password</span>{' '}
                <span className="inline-block profile-section-subtitle-phrase">and manage security settings.</span>
              </p>
              <div className="bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg p-6 profile-security-card">
                <p className="text-gray-400 profile-security-text">Security settings coming soon...</p>
              </div>
            </div>
          )}
          
          {activeSection === 'vendor' && user?.role !== 'VENDOR' && (
            <div className="max-w-4xl profile-section">
              <h1 
                className="text-3xl font-bold text-white mb-2 profile-section-title"
                style={{ fontFamily: '"Poppins", sans-serif' }}
              >
                <span className="inline-block profile-section-title-word">Register</span>{' '}
                <span className="inline-block profile-section-title-word">as</span>{' '}
                <span className="inline-block profile-section-title-word">a</span>{' '}
                <span className="inline-block profile-section-title-word">Vendor</span>
              </h1>
              <p className="text-gray-400 mb-8 profile-section-subtitle">
                <span className="inline-block profile-section-subtitle-phrase">Fill out the form below</span>{' '}
                <span className="inline-block profile-section-subtitle-phrase">to apply to become a vendor.</span>{' '}
                <span className="inline-block profile-section-subtitle-phrase">Your application will be reviewed</span>{' '}
                <span className="inline-block profile-section-subtitle-phrase">by our admin team.</span>
              </p>

              {vendorError && (
                <div className="mb-4 p-4 bg-red-900/30 border border-red-700 rounded-lg profile-error">
                  <p className="text-red-400">{vendorError}</p>
                </div>
              )}
              
              {vendorSuccess && (
                <div className="mb-4 p-4 bg-green-900/30 border border-green-700 rounded-lg profile-success">
                  <p className="text-green-400">{vendorSuccess}</p>
                </div>
              )}

              <form onSubmit={handleVendorSubmit} className="space-y-6 profile-vendor-form">
                <div className="profile-field-group">
                  <label className="block text-white mb-2 profile-field-label">
                    Company Name <span className="text-red-400">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="companyName"
                    value={vendorFormData.companyName}
                    onChange={handleVendorInputChange}
                    placeholder="Enter your company name" 
                    required
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 profile-input" 
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="profile-field-group">
                    <label className="block text-white mb-2 profile-field-label">
                      Service Type <span className="text-red-400">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="serviceType"
                      value={vendorFormData.serviceType}
                      onChange={handleVendorInputChange}
                      placeholder="e.g., Catering, Photography, DJ Services" 
                      required
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 profile-input" 
                    />
                  </div>
                  <div className="profile-field-group">
                    <label className="block text-white mb-2 profile-field-label">
                      Address <span className="text-red-400">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="address"
                      value={vendorFormData.address}
                      onChange={handleVendorInputChange}
                      placeholder="Enter your business address" 
                      required
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 profile-input" 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="profile-field-group">
                    <label className="block text-white mb-2 profile-field-label">
                      Main Photo URL
                    </label>
                    <input 
                      type="url" 
                      name="mainPhotoURL"
                      value={vendorFormData.mainPhotoURL}
                      onChange={handleVendorInputChange}
                      placeholder="https://example.com/main-photo.jpg" 
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 profile-input" 
                    />
                  </div>
                  <div className="profile-field-group">
                    <label className="block text-white mb-2 profile-field-label">
                      Detail Photo URL
                    </label>
                    <input 
                      type="url" 
                      name="detailPhotoURL"
                      value={vendorFormData.detailPhotoURL}
                      onChange={handleVendorInputChange}
                      placeholder="https://example.com/detail-photo.jpg" 
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 profile-input" 
                    />
                  </div>
                </div>
                
                <div className="profile-field-group">
                  <label className="block text-white mb-2 profile-field-label">Details</label>
                  <textarea 
                    rows={6} 
                    name="details"
                    value={vendorFormData.details}
                    onChange={handleVendorInputChange}
                    placeholder="Describe your services in detail. Include your experience, specialties, and what makes your service unique." 
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 profile-input"
                  ></textarea>
                </div>
                
                <div className="flex justify-end">
                  <button 
                    type="submit" 
                    disabled={vendorSubmitting}
                    className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 px-8 rounded-lg font-medium profile-vendor-submit-button"
                  >
                    {vendorSubmitting ? 'Submitting...' : 'Request to Register as a Vendor'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeSection === 'vendor' && user?.role === 'VENDOR' && (
            <div className="max-w-6xl space-y-8 profile-section">
              <div>
                <h1 
                  className="text-3xl font-bold text-white mb-2 profile-section-title"
                  style={{ fontFamily: '"Poppins", sans-serif' }}
                >
                  <span className="inline-block profile-section-title-word">Manage</span>{' '}
                  <span className="inline-block profile-section-title-word">Vendor</span>
                </h1>
                <p className="text-gray-400 mb-8 profile-section-subtitle">
                  <span className="inline-block profile-section-subtitle-phrase">Update your vendor information</span>{' '}
                  <span className="inline-block profile-section-subtitle-phrase">and manage your packages.</span>
                </p>
              </div>

              {vendorError && (
                <div className="p-4 bg-red-900/30 border border-red-700 rounded-lg">
                  <p className="text-red-400">{vendorError}</p>
                </div>
              )}
              
              {vendorSuccess && (
                <div className="p-4 bg-green-900/30 border border-green-700 rounded-lg">
                  <p className="text-green-400">{vendorSuccess}</p>
                </div>
              )}

              {vendorLoading ? (
                <div className="text-center py-8 text-gray-400">
                  <Loading fullScreen={false} />
                </div>
              ) : vendor ? (
                <>
                  {/* Vendor Update Form */}
                  <div className="bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg p-6 profile-vendor-manage-card">
                    <h2 
                      className="text-2xl font-bold text-white mb-6 profile-vendor-manage-title"
                      style={{ fontFamily: '"Poppins", sans-serif' }}
                    >
                      Vendor Information
                    </h2>
                    <form onSubmit={handleVendorUpdate} className="space-y-6">
                      <div className="profile-field-group">
                        <label className="block text-white mb-2 profile-field-label">Company Name</label>
                        <input 
                          type="text" 
                          value={vendorUpdateData.companyName}
                          onChange={(e) => setVendorUpdateData(prev => ({ ...prev, companyName: e.target.value }))}
                          className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 profile-input" 
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="profile-field-group">
                          <label className="block text-white mb-2 profile-field-label">Service Type</label>
                          <input 
                            type="text" 
                            value={vendorUpdateData.serviceType}
                            onChange={(e) => setVendorUpdateData(prev => ({ ...prev, serviceType: e.target.value }))}
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 profile-input" 
                            required
                          />
                        </div>
                        <div className="profile-field-group">
                          <label className="block text-white mb-2 profile-field-label">Address</label>
                          <input 
                            type="text" 
                            value={vendorUpdateData.address}
                            onChange={(e) => setVendorUpdateData(prev => ({ ...prev, address: e.target.value }))}
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 profile-input" 
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="profile-field-group">
                          <label className="block text-white mb-2 profile-field-label">Main Photo URL</label>
                          <input 
                            type="url" 
                            value={vendorUpdateData.mainPhotoURL}
                            onChange={(e) => setVendorUpdateData(prev => ({ ...prev, mainPhotoURL: e.target.value }))}
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 profile-input" 
                          />
                        </div>
                        <div className="profile-field-group">
                          <label className="block text-white mb-2 profile-field-label">Detail Photo URL</label>
                          <input 
                            type="url" 
                            value={vendorUpdateData.detailPhotoURL}
                            onChange={(e) => setVendorUpdateData(prev => ({ ...prev, detailPhotoURL: e.target.value }))}
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 profile-input" 
                          />
                        </div>
                      </div>
                      
                      <div className="profile-field-group">
                        <label className="block text-white mb-2 profile-field-label">Details</label>
                        <textarea 
                          rows={6} 
                          value={vendorUpdateData.details}
                          onChange={(e) => setVendorUpdateData(prev => ({ ...prev, details: e.target.value }))}
                          className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 profile-input"
                        ></textarea>
                      </div>
                      
                      <div className="flex justify-end">
                        <button 
                          type="submit" 
                          disabled={vendorUpdateSubmitting}
                          className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 px-8 rounded-lg font-medium profile-vendor-update-button"
                        >
                          {vendorUpdateSubmitting ? 'Updating...' : 'Update Vendor Information'}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Package Management */}
                  <div className="bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg p-6 profile-package-card">
                    <div className="flex items-center justify-between mb-6">
                      <h2 
                        className="text-2xl font-bold text-white profile-package-title"
                        style={{ fontFamily: '"Poppins", sans-serif' }}
                      >
                        Packages
                      </h2>
                      {editingPackage && (
                        <button
                          onClick={cancelPackageEdit}
                          className="text-gray-400 hover:text-white profile-package-cancel-edit"
                        >
                          Cancel Edit
                        </button>
                      )}
                    </div>

                    {packageError && (
                      <div className="mb-4 p-4 bg-red-900/30 border border-red-700 rounded-lg profile-error">
                        <p className="text-red-400">{packageError}</p>
                      </div>
                    )}
                    
                    {packageSuccess && (
                      <div className="mb-4 p-4 bg-green-900/30 border border-green-700 rounded-lg profile-success">
                        <p className="text-green-400">{packageSuccess}</p>
                      </div>
                    )}

                    {/* Add/Edit Package Form */}
                    <form onSubmit={handlePackageSubmit} className="mb-8 space-y-6 bg-gray-900/50 p-6 rounded-lg profile-package-form">
                      <h3 
                        className="text-xl font-bold text-white profile-package-form-title"
                        style={{ fontFamily: '"Poppins", sans-serif' }}
                      >
                        {editingPackage ? 'Edit Package' : 'Add New Package'}
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="profile-field-group">
                          <label className="block text-white mb-2 profile-field-label">Package Name <span className="text-red-400">*</span></label>
                          <input 
                            type="text" 
                            name="packageName"
                            value={packageFormData.packageName}
                            onChange={handlePackageInputChange}
                            required
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 profile-input" 
                          />
                        </div>
                        <div className="profile-field-group">
                          <label className="block text-white mb-2 profile-field-label">Price <span className="text-red-400">*</span></label>
                          <input 
                            type="number" 
                            name="price"
                            value={packageFormData.price}
                            onChange={handlePackageInputChange}
                            step="0.01"
                            min="0"
                            required
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 profile-input" 
                          />
                        </div>
                      </div>
                      
                      <div className="profile-field-group">
                        <label className="block text-white mb-2 profile-field-label">Description <span className="text-red-400">*</span></label>
                        <textarea 
                          rows={3} 
                          name="description"
                          value={packageFormData.description}
                          onChange={handlePackageInputChange}
                          required
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 profile-input"
                        ></textarea>
                      </div>
                      
                      <div className="profile-field-group">
                        <label className="block text-white mb-2 profile-field-label">Duration</label>
                        <input 
                          type="text" 
                          name="duration"
                          value={packageFormData.duration}
                          onChange={handlePackageInputChange}
                          placeholder="e.g., Full day, 2 hours"
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 profile-input" 
                        />
                      </div>
                      
                      <div className="profile-field-group">
                        <label className="block text-white mb-2 profile-field-label">Features</label>
                        <div className="flex gap-2 mb-2">
                          <input 
                            type="text" 
                            value={currentFeature}
                            onChange={(e) => setCurrentFeature(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addFeature();
                              }
                            }}
                            placeholder="Add a feature and press Enter"
                            className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 profile-input" 
                          />
                          <button
                            type="button"
                            onClick={addFeature}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg profile-package-add-feature-button"
                          >
                            <PlusIcon size={20} />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {packageFormData.features.map((feature, index) => (
                            <span key={index} className="flex items-center gap-2 px-3 py-1 bg-purple-600/20 border border-purple-500 rounded-lg text-white profile-package-feature-tag">
                              {feature}
                              <button
                                type="button"
                                onClick={() => removeFeature(index)}
                                className="text-red-400 hover:text-red-300 profile-package-feature-remove"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center profile-field-group">
                        <input 
                          type="checkbox" 
                          name="isActive"
                          checked={packageFormData.isActive}
                          onChange={handlePackageInputChange}
                          className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 profile-package-checkbox"
                        />
                        <label className="ml-2 text-white profile-field-label">Active</label>
                      </div>
                      
                      <div className="flex justify-end">
                        <button 
                          type="submit" 
                          disabled={packageSubmitting}
                          className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2 px-6 rounded-lg font-medium profile-package-submit-button"
                        >
                          {packageSubmitting ? 'Saving...' : editingPackage ? 'Update Package' : 'Add Package'}
                        </button>
                      </div>
                    </form>

                    {/* Packages List */}
                    <div>
                      <h3 
                        className="text-xl font-bold text-white mb-4 profile-package-list-title"
                        style={{ fontFamily: '"Poppins", sans-serif' }}
                      >
                        Available Packages
                      </h3>
                      {packages.length === 0 ? (
                        <div className="text-center py-8 text-gray-400 profile-package-empty">
                          <p>No packages yet. Add your first package above.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {packages.map((pkg: any) => (
                            <div key={pkg.id} className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 profile-package-item">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h4 className="text-lg font-bold text-white profile-package-item-name">{pkg.packageName}</h4>
                                    <span className={`text-xs px-2 py-1 rounded profile-package-item-status ${pkg.isActive ? 'bg-green-600' : 'bg-gray-600'} text-white`}>
                                      {pkg.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                  </div>
                                  <p className="text-gray-300 mb-2 profile-package-item-description">{pkg.description}</p>
                                  <p className="text-purple-400 font-semibold mb-2 profile-package-item-price">Rs. {pkg.price?.toFixed(2) || '0.00'}</p>
                                  {pkg.duration && (
                                    <p className="text-gray-400 text-sm mb-2 profile-package-item-duration">Duration: {pkg.duration}</p>
                                  )}
                                  {pkg.features && pkg.features.length > 0 && (
                                    <div className="mt-2">
                                      <p className="text-gray-400 text-sm mb-1">Features:</p>
                                      <ul className="list-disc list-inside text-gray-300 text-sm profile-package-item-features">
                                        {pkg.features.map((feature: string, idx: number) => (
                                          <li key={idx} className="profile-package-item-feature">{feature}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                                <div className="flex gap-2 ml-4">
                                  <button
                                    onClick={() => handleEditPackage(pkg)}
                                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg profile-package-edit-button"
                                    title="Edit"
                                  >
                                    <EditIcon size={18} />
                                  </button>
                                  <button
                                    onClick={() => handleDeletePackage(pkg.id)}
                                    className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg profile-package-delete-button"
                                    title="Delete"
                                  >
                                    <TrashIcon size={18} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <p>Vendor information not found. Please contact support.</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
      <style>{`
        /* Profile Sidebar Animations */
        .profile-sidebar-title {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .profile-sidebar-title:hover {
          transform: translateX(5px);
          color: #a78bfa;
        }
        
        /* Navigation Buttons */
        .profile-nav-button {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
        }
        .profile-nav-button:hover {
          transform: translateX(5px);
          background: rgba(139, 92, 246, 0.2) !important;
        }
        .profile-nav-button-active {
          background: #7c3aed !important;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
        }
        .profile-nav-icon {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .profile-nav-button:hover .profile-nav-icon {
          transform: scale(1.2) rotate(5deg);
          color: #a78bfa;
        }
        .profile-nav-text {
          transition: all 0.3s ease;
        }
        .profile-nav-button:hover .profile-nav-text {
          color: #a78bfa;
        }
        
        /* Logout Button */
        .profile-logout-button {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .profile-logout-button:hover {
          transform: translateX(5px);
          background: rgba(239, 68, 68, 0.2);
        }
        .profile-logout-icon {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .profile-logout-button:hover .profile-logout-icon {
          transform: scale(1.2) rotate(-5deg);
          color: #ef4444;
        }
        .profile-logout-text {
          transition: all 0.3s ease;
        }
        .profile-logout-button:hover .profile-logout-text {
          color: #ef4444;
        }
        
        /* Section Title */
        .profile-section-title {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .profile-section-title-word {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: inline-block;
          cursor: default;
        }
        .profile-section-title-word:hover {
          transform: translateY(-4px) scale(1.1) rotate(2deg);
          color: #a78bfa;
          text-shadow: 0 6px 20px rgba(139, 92, 246, 0.4), 0 0 16px rgba(139, 92, 246, 0.3);
        }
        
        /* Section Subtitle */
        .profile-section-subtitle {
          transition: all 0.3s ease;
        }
        .profile-section-subtitle-phrase {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: inline-block;
          cursor: default;
        }
        .profile-section-subtitle-phrase:hover {
          transform: translateY(-2px) scale(1.05);
          color: #c4b5fd;
          background: rgba(139, 92, 246, 0.1);
          padding: 2px 4px;
          border-radius: 4px;
        }
        
        /* Error/Success Messages */
        .profile-error {
          animation: shake 0.5s ease-in-out;
        }
        .profile-success {
          animation: fadeInUp 0.5s ease-out;
        }
        
        /* Avatar Section */
        .profile-avatar-section {
          transition: all 0.3s ease;
        }
        .profile-avatar {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .profile-avatar-section:hover .profile-avatar {
          transform: scale(1.1) rotate(5deg);
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.4);
        }
        .profile-user-name {
          transition: all 0.3s ease;
        }
        .profile-avatar-section:hover .profile-user-name {
          color: #a78bfa;
        }
        .profile-user-email {
          transition: all 0.3s ease;
        }
        .profile-avatar-section:hover .profile-user-email {
          color: #c4b5fd;
        }
        .profile-change-photo-button {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .profile-change-photo-button:hover {
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
        }
        
        /* Form Fields */
        .profile-field-group {
          transition: all 0.3s ease;
        }
        .profile-section:hover .profile-field-group {
          transform: translateX(5px);
        }
        .profile-field-label {
          transition: all 0.3s ease;
        }
        .profile-field-group:hover .profile-field-label {
          color: #a78bfa;
        }
        .profile-input {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .profile-input:hover {
          transform: translateY(-2px);
          border-color: #a78bfa;
        }
        .profile-input:focus {
          transform: translateY(-3px);
          border-color: #a78bfa;
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.3), 0 0 0 2px rgba(139, 92, 246, 0.5);
        }
        
        /* Buttons */
        .profile-cancel-button {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .profile-cancel-button:hover {
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 4px 12px rgba(107, 114, 128, 0.4);
        }
        .profile-save-button {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
        }
        .profile-save-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }
        .profile-save-button:hover::before {
          left: 100%;
        }
        .profile-save-button:hover {
          transform: translateY(-3px) scale(1.05) rotate(1deg);
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.4), 0 0 16px rgba(139, 92, 246, 0.3);
        }
        .profile-save-button:active {
          transform: translateY(-1px) scale(1.02);
        }
        
        /* Account & Security Cards */
        .profile-account-card,
        .profile-security-card {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .profile-account-card:hover,
        .profile-security-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.2);
          border-color: rgba(139, 92, 246, 0.5);
        }
        .profile-account-text,
        .profile-security-text {
          transition: all 0.3s ease;
        }
        .profile-account-card:hover .profile-account-text,
        .profile-security-card:hover .profile-security-text {
          color: #c4b5fd;
        }
        
        /* Vendor Form */
        .profile-vendor-form {
          transition: all 0.3s ease;
        }
        .profile-vendor-submit-button {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
        }
        .profile-vendor-submit-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }
        .profile-vendor-submit-button:hover:not(:disabled)::before {
          left: 100%;
        }
        .profile-vendor-submit-button:hover:not(:disabled) {
          transform: translateY(-3px) scale(1.05) rotate(1deg);
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.4), 0 0 16px rgba(139, 92, 246, 0.3);
        }
        
        /* Vendor Manage Card */
        .profile-vendor-manage-card {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .profile-vendor-manage-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.2);
          border-color: rgba(139, 92, 246, 0.5);
        }
        .profile-vendor-manage-title {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .profile-vendor-manage-card:hover .profile-vendor-manage-title {
          color: #a78bfa;
          transform: translateX(4px);
        }
        .profile-vendor-update-button {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
        }
        .profile-vendor-update-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }
        .profile-vendor-update-button:hover:not(:disabled)::before {
          left: 100%;
        }
        .profile-vendor-update-button:hover:not(:disabled) {
          transform: translateY(-3px) scale(1.05) rotate(1deg);
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.4), 0 0 16px rgba(139, 92, 246, 0.3);
        }
        
        /* Package Card */
        .profile-package-card {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .profile-package-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.2);
          border-color: rgba(139, 92, 246, 0.5);
        }
        .profile-package-title {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .profile-package-card:hover .profile-package-title {
          color: #a78bfa;
          transform: translateX(4px);
        }
        .profile-package-cancel-edit {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .profile-package-cancel-edit:hover {
          transform: translateY(-2px);
          color: #a78bfa !important;
        }
        .profile-package-form {
          transition: all 0.3s ease;
        }
        .profile-package-form-title {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .profile-package-form:hover .profile-package-form-title {
          color: #a78bfa;
          transform: translateX(4px);
        }
        .profile-package-add-feature-button {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .profile-package-add-feature-button:hover {
          transform: scale(1.1) rotate(90deg);
        }
        .profile-package-feature-tag {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .profile-package-feature-tag:hover {
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
        }
        .profile-package-feature-remove {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .profile-package-feature-tag:hover .profile-package-feature-remove {
          transform: scale(1.2) rotate(90deg);
        }
        .profile-package-checkbox {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .profile-field-group:hover .profile-package-checkbox {
          transform: scale(1.1);
        }
        .profile-package-submit-button {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
        }
        .profile-package-submit-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }
        .profile-package-submit-button:hover:not(:disabled)::before {
          left: 100%;
        }
        .profile-package-submit-button:hover:not(:disabled) {
          transform: translateY(-3px) scale(1.05) rotate(1deg);
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.4), 0 0 16px rgba(139, 92, 246, 0.3);
        }
        .profile-package-list-title {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .profile-package-card:hover .profile-package-list-title {
          color: #a78bfa;
          transform: translateX(4px);
        }
        .profile-package-empty {
          transition: all 0.3s ease;
        }
        .profile-package-empty:hover {
          transform: translateY(-2px);
          color: #c4b5fd;
        }
        .profile-package-item {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .profile-package-item:hover {
          transform: translateX(4px) translateY(-2px);
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.2);
          border-color: rgba(139, 92, 246, 0.5);
        }
        .profile-package-item-name {
          transition: all 0.3s ease;
        }
        .profile-package-item:hover .profile-package-item-name {
          color: #a78bfa;
        }
        .profile-package-item-status {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .profile-package-item:hover .profile-package-item-status {
          transform: scale(1.1) rotate(5deg);
        }
        .profile-package-item-description {
          transition: all 0.3s ease;
        }
        .profile-package-item:hover .profile-package-item-description {
          color: #e9d5ff;
        }
        .profile-package-item-price {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .profile-package-item:hover .profile-package-item-price {
          transform: scale(1.05);
          color: #c4b5fd;
        }
        .profile-package-item-duration {
          transition: all 0.3s ease;
        }
        .profile-package-item:hover .profile-package-item-duration {
          color: #c4b5fd;
        }
        .profile-package-item-features {
          transition: all 0.3s ease;
        }
        .profile-package-item-feature {
          transition: all 0.3s ease;
        }
        .profile-package-item:hover .profile-package-item-feature {
          color: #e9d5ff;
        }
        .profile-package-edit-button {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .profile-package-edit-button:hover {
          transform: scale(1.15) rotate(5deg);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }
        .profile-package-delete-button {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .profile-package-delete-button:hover {
          transform: scale(1.15) rotate(-5deg);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
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
      `}</style>
    </div>;
};