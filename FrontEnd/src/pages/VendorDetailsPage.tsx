import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { VendorHeader } from '../components/VendorHeader';
import { TabNavigation } from '../components/TabNavigation';
import { DetailsTab } from '../components/tabs/DetailsTab';
import { PackagesTab } from '../components/tabs/PackagesTab';
import { ReviewsTab } from '../components/tabs/ReviewsTab';
import { ChevronLeftIcon } from 'lucide-react';
import { vendorAPI } from '../services/api';

export const VendorDetailsPage = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('details');
  const [vendorData, setVendorData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVendor = async () => {
      if (id) {
        try {
          const data = await vendorAPI.getVendorDetails(id);
          setVendorData(data);
        } catch (error) {
          console.error('Error loading vendor:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    loadVendor();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen w-full items-center justify-center bg-[#0a0a0f]">
        <div className="text-white">Loading vendor...</div>
      </div>
    );
  }

  if (!vendorData || !vendorData.vendor) {
    return (
      <div className="flex flex-col min-h-screen w-full items-center justify-center bg-[#0a0a0f]">
        <div className="text-white">Vendor not found</div>
        <Link to="/vendors" className="mt-4 text-purple-500 hover:text-purple-400">
          Back to Vendors
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#0a0a0f] text-white">
      <Header />
      <div className="px-6 py-4">
        <Link to="/vendors" className="flex items-center text-gray-300 hover:text-white mb-2">
          <ChevronLeftIcon size={20} />
          <span className="ml-1">Back to Vendors</span>
        </Link>
      </div>
      <VendorHeader vendor={vendorData.vendor} />
      <div className="max-w-7xl mx-auto w-full px-6 pb-10">
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === 'details' && (
          <DetailsTab 
            vendor={vendorData.vendor} 
            reviewCount={vendorData.reviewCount || 0} 
          />
        )}
        {activeTab === 'packages' && (
          <PackagesTab 
            packages={vendorData.packages} 
            vendorId={id} 
          />
        )}
        {activeTab === 'reviews' && (
          <ReviewsTab 
            reviews={vendorData.reviews} 
            vendorId={id} 
          />
        )}
      </div>
    </div>
  );
};


