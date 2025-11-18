import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPinIcon, PhoneIcon, MailIcon } from 'lucide-react';
import { chatAPI, vendorAPI } from '../../services/api';

export const DetailsTab = ({ vendor, reviewCount = 0 }: { vendor?: any, reviewCount?: number }) => {
  const rating = vendor?.rating || 0;
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');

  const handleRequestQuote = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('Please log in to request a quote');
      navigate('/login');
      return;
    }

    if (!vendor?.id) {
      alert('Vendor information is missing');
      return;
    }

    try {
      // Create or get existing chat
      const chat = await chatAPI.createOrGetChat({
        vendorId: vendor.id,
        userId: userId
      });
      
      // Navigate to messages page with the chat selected
      navigate('/messages', { state: { chatId: (chat as any).id } });
    } catch (error: any) {
      if (import.meta.env.DEV) {
        console.error('Error creating chat:', error);
      }
      alert(error.message || 'Failed to start conversation. Please try again.');
    }
  };

  const handleMessageVendor = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('Please log in to message vendors');
      navigate('/login');
      return;
    }

    if (!vendor?.id) {
      alert('Vendor information is missing');
      return;
    }

    try {
      // Get current vendor's ID
      const myVendor = await vendorAPI.getVendorByUserId(userId);
      
      if (!myVendor?.id) {
        alert('Unable to determine your vendor account. Please ensure you have a vendor profile.');
        return;
      }

      // Create or get vendor-to-vendor chat
      const chat = await chatAPI.createOrGetVendorToVendorChat(myVendor.id, vendor.id);
      
      // Navigate to messages page with the chat selected
      navigate('/messages', { state: { chatId: (chat as any).id } });
    } catch (error: any) {
      if (import.meta.env.DEV) {
        console.error('Error creating vendor-to-vendor chat:', error);
      }
      alert(error.message || 'Failed to start conversation. Please try again.');
    }
  };
  
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 
            className="text-2xl font-bold mb-4 vendor-details-title"
            style={{ fontFamily: '"Poppins", sans-serif' }}
          >
            About {vendor?.companyName || 'Vendor'}
          </h2>
          <p className="text-gray-300 mb-8 leading-relaxed vendor-details-description">
            {vendor?.details || 'No description available for this vendor.'}
          </p>
        </div>
        <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg h-fit vendor-details-card">
          <div className="mb-6 vendor-rating-section">
            <div className="flex items-center mb-2">
              <div className="flex vendor-stars">
                {[1, 2, 3, 4, 5].map(star => (
                  <svg 
                    key={star} 
                    className={`w-5 h-5 vendor-star ${star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-600'}`} 
                    fill={star <= Math.round(rating) ? "currentColor" : "none"}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="ml-2 text-xl font-bold vendor-rating-value">{rating.toFixed(1)}</span>
              <span className="ml-1 text-sm text-gray-400 vendor-review-count">({reviewCount} reviews)</span>
            </div>
          </div>
          <div className="mb-4 vendor-info-item">
            <h3 className="text-gray-400 mb-1 vendor-info-label">Category</h3>
            <p className="vendor-info-value">{vendor?.serviceType || 'N/A'}</p>
          </div>
          {vendor?.address && (
            <div className="mb-4 vendor-info-item">
              <h3 className="text-gray-400 mb-1 vendor-info-label">Location</h3>
              <div className="flex items-center vendor-location">
                <MapPinIcon size={16} className="mr-2 text-gray-400 vendor-location-icon" />
                <p className="vendor-location-text">{vendor.address}</p>
              </div>
            </div>
          )}
          {vendor?.user && (
            <>
              <div className="border-t border-gray-700 my-6"></div>
              <h3 className="font-bold mb-4 vendor-contact-title">Contact Information</h3>
              <div className="space-y-3">
                {vendor.user.phone && (
                  <div className="flex items-center vendor-contact-item">
                    <PhoneIcon size={16} className="mr-2 text-gray-400 vendor-contact-icon" />
                    <p className="vendor-contact-text">{vendor.user.phone}</p>
                  </div>
                )}
                {vendor.user.email && (
                  <div className="flex items-center vendor-contact-item">
                    <MailIcon size={16} className="mr-2 text-gray-400 vendor-contact-icon" />
                    <p className="vendor-contact-text">{vendor.user.email}</p>
                  </div>
                )}
              </div>
            </>
          )}
          <div className="space-y-3 mt-6">
            {userRole === 'VENDOR' ? (
              <button 
                onClick={handleMessageVendor}
                className="block w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium text-center vendor-action-button"
              >
                Message Vendor
              </button>
            ) : (
              <button 
                onClick={handleRequestQuote}
                className="block w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium text-center vendor-action-button"
              >
                Request a Quote
              </button>
            )}
            {userRole !== 'VENDOR' && (
              <Link to="/contract/new" className="block w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium text-center vendor-book-button">
                Book Now
              </Link>
            )}
          </div>
        </div>
      </div>
      <style>{`
        .vendor-details-title {
          transition: all 0.3s ease;
        }
        .vendor-details-title:hover {
          color: #a78bfa;
          transform: translateX(4px);
        }
        .vendor-details-description {
          transition: all 0.3s ease;
        }
        .vendor-details-card:hover .vendor-details-description {
          color: #c4b5fd;
        }
        .vendor-details-card {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .vendor-details-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(139, 92, 246, 0.2), 0 0 20px rgba(139, 92, 246, 0.1);
          border-color: rgba(139, 92, 246, 0.3);
        }
        .vendor-rating-section {
          transition: all 0.3s ease;
        }
        .vendor-details-card:hover .vendor-rating-section {
          transform: scale(1.05);
        }
        .vendor-star {
          transition: all 0.3s ease;
        }
        .vendor-details-card:hover .vendor-star {
          transform: scale(1.1);
        }
        .vendor-rating-value {
          transition: all 0.3s ease;
        }
        .vendor-details-card:hover .vendor-rating-value {
          color: #a78bfa;
        }
        .vendor-review-count {
          transition: all 0.3s ease;
        }
        .vendor-details-card:hover .vendor-review-count {
          color: #c4b5fd;
        }
        .vendor-info-item {
          transition: all 0.3s ease;
        }
        .vendor-details-card:hover .vendor-info-item {
          transform: translateX(4px);
        }
        .vendor-info-label {
          transition: all 0.3s ease;
        }
        .vendor-details-card:hover .vendor-info-label {
          color: #a78bfa;
        }
        .vendor-info-value {
          transition: all 0.3s ease;
        }
        .vendor-details-card:hover .vendor-info-value {
          color: #c4b5fd;
        }
        .vendor-location {
          transition: all 0.3s ease;
        }
        .vendor-details-card:hover .vendor-location {
          transform: translateX(4px);
        }
        .vendor-location-icon {
          transition: all 0.3s ease;
        }
        .vendor-details-card:hover .vendor-location-icon {
          color: #a78bfa;
          transform: scale(1.2);
        }
        .vendor-location-text {
          transition: all 0.3s ease;
        }
        .vendor-details-card:hover .vendor-location-text {
          color: #c4b5fd;
        }
        .vendor-contact-title {
          transition: all 0.3s ease;
        }
        .vendor-details-card:hover .vendor-contact-title {
          color: #a78bfa;
        }
        .vendor-contact-item {
          transition: all 0.3s ease;
        }
        .vendor-details-card:hover .vendor-contact-item {
          transform: translateX(4px);
        }
        .vendor-contact-icon {
          transition: all 0.3s ease;
        }
        .vendor-details-card:hover .vendor-contact-icon {
          color: #a78bfa;
          transform: scale(1.2);
        }
        .vendor-contact-text {
          transition: all 0.3s ease;
        }
        .vendor-details-card:hover .vendor-contact-text {
          color: #c4b5fd;
        }
        .vendor-action-button {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .vendor-action-button:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 8px 20px rgba(107, 114, 128, 0.3);
        }
        .vendor-book-button {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
        }
        .vendor-book-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }
        .vendor-book-button:hover::before {
          left: 100%;
        }
        .vendor-book-button:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.4), 0 0 16px rgba(139, 92, 246, 0.3);
        }
      `}</style>
    </>
  );
};