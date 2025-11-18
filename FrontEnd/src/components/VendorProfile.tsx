import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from './Header';
import { VendorHeader } from './VendorHeader';
import { TabNavigation } from './TabNavigation';
import { DetailsTab } from './tabs/DetailsTab';
import { PackagesTab } from './tabs/PackagesTab';
import { ReviewsTab } from './tabs/ReviewsTab';
import { Loading } from './Loading';
import { ChevronLeftIcon } from 'lucide-react';
import { vendorAPI } from '../services/api';
export const VendorProfile = () => {
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
    return <Loading />;
  }

  return <div className="flex flex-col min-h-screen w-full">
      <Header />
      <div className="px-6 py-4">
        <Link to="/vendors" className="flex items-center text-gray-300 hover:text-white mb-2">
          <ChevronLeftIcon size={20} />
          <span className="ml-1">Back to Vendors</span>
        </Link>
      </div>
      <VendorHeader vendor={vendorData?.vendor} />
      <div className="max-w-7xl mx-auto w-full px-6 pb-10">
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === 'details' && <DetailsTab vendor={vendorData?.vendor} reviewCount={vendorData?.reviewCount || 0} />}
        {activeTab === 'packages' && <PackagesTab packages={vendorData?.packages} vendorId={id} />}
        {activeTab === 'reviews' && <ReviewsTab reviews={vendorData?.reviews} vendorId={id} />}
      </div>
    </div>;
};