import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPinIcon, PhoneIcon, MailIcon } from 'lucide-react';
import { chatAPI } from '../../services/api';

export const DetailsTab = ({ vendor, reviewCount = 0 }: { vendor?: any, reviewCount?: number }) => {
  const rating = vendor?.rating || 0;
  const navigate = useNavigate();

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
      console.error('Error creating chat:', error);
      alert(error.message || 'Failed to start conversation. Please try again.');
    }
  };
  
  return <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <h2 className="text-2xl font-bold mb-4">About {vendor?.companyName || 'Vendor'}</h2>
        <p className="text-gray-300 mb-8 leading-relaxed">
          {vendor?.details || 'No description available for this vendor.'}
        </p>
      </div>
      <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg h-fit">
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map(star => (
                <svg 
                  key={star} 
                  className={`w-5 h-5 ${star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-600'}`} 
                  fill={star <= Math.round(rating) ? "currentColor" : "none"}
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="ml-2 text-xl font-bold">{rating.toFixed(1)}</span>
            <span className="ml-1 text-sm text-gray-400">({reviewCount} reviews)</span>
          </div>
        </div>
        <div className="mb-4">
          <h3 className="text-gray-400 mb-1">Category</h3>
          <p>{vendor?.serviceType || 'N/A'}</p>
        </div>
        {vendor?.address && (
          <div className="mb-4">
            <h3 className="text-gray-400 mb-1">Location</h3>
            <div className="flex items-center">
              <MapPinIcon size={16} className="mr-2 text-gray-400" />
              <p>{vendor.address}</p>
            </div>
          </div>
        )}
        {vendor?.user && (
          <>
            <div className="border-t border-gray-700 my-6"></div>
            <h3 className="font-bold mb-4">Contact Information</h3>
            <div className="space-y-3">
              {vendor.user.phone && (
                <div className="flex items-center">
                  <PhoneIcon size={16} className="mr-2 text-gray-400" />
                  <p>{vendor.user.phone}</p>
                </div>
              )}
              {vendor.user.email && (
                <div className="flex items-center">
                  <MailIcon size={16} className="mr-2 text-gray-400" />
                  <p>{vendor.user.email}</p>
                </div>
              )}
            </div>
          </>
        )}
        <div className="space-y-3 mt-6">
          <button 
            onClick={handleRequestQuote}
            className="block w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium transition-colors text-center"
          >
            Request a Quote
          </button>
          <Link to="/contract/new" className="block w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-colors text-center">
            Book Now
          </Link>
        </div>
      </div>
    </div>;
};