import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { TabNavigation } from '../components/TabNavigation';
import { DetailsTab } from '../components/tabs/DetailsTab';
import { PackagesTab } from '../components/tabs/PackagesTab';
import { ReviewsTab } from '../components/tabs/ReviewsTab';
import { Loading } from '../components/Loading';
import { vendorAPI } from '../services/api';

export const VendorDetailsPage = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('details');
  const [vendorData, setVendorData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    loadVendor();
    
    // Listen for vendor updates (e.g., after review submission)
    const handleVendorUpdate = (event: any) => {
      if (event.detail) {
        setVendorData(event.detail);
      }
    };
    
    window.addEventListener('vendorUpdated', handleVendorUpdate);
    
    return () => {
      window.removeEventListener('vendorUpdated', handleVendorUpdate);
    };
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  if (!vendorData || !vendorData.vendor) {
    return (
      <div className="flex flex-col min-h-screen w-full items-center justify-center bg-transparent relative">
        <div className="text-white">Vendor not found</div>
        <Link to="/vendors" className="mt-4 text-purple-500 hover:text-purple-400">
          Back to Vendors
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-transparent text-white relative">
      {/* Hero Image Section */}
      <div className="relative h-96">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{
            backgroundImage: vendorData.vendor?.detailPhotoURL || vendorData.vendor?.mainPhotoURL
              ? `url('${vendorData.vendor.detailPhotoURL || vendorData.vendor.mainPhotoURL}')`
              : "url('https://uploadthingy.s3.us-west-1.amazonaws.com/kZPxGBYXb9J251w4QjUuAN/Vendorpage1.png')"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#0a0a0f]"></div>
        </div>
        
        {/* Glassmorphism Back Button */}
        <Link 
          to="/vendors" 
          className="absolute top-6 left-6 z-20 vendor-back-button-glass px-4 py-2.5 rounded-lg"
        >
          Back to Vendors
        </Link>

        {/* Vendor Name Overlay */}
        <div className="absolute bottom-10 left-10 z-10">
          <h1 
            className="text-5xl font-bold text-white vendor-title"
            style={{ fontFamily: '"Poppins", sans-serif' }}
          >
            {vendorData.vendor?.companyName || 'Vendor'}
          </h1>
        </div>
      </div>

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
      <style>{`
        .vendor-back-button-glass {
          background: rgba(10, 10, 15, 0.4);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
        }
        .vendor-back-button-glass::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          transition: left 0.6s ease;
        }
        .vendor-back-button-glass:hover::before {
          left: 100%;
        }
        .vendor-back-button-glass:hover {
          transform: translateY(-2px) scale(1.05);
          background: rgba(10, 10, 15, 0.6);
          border-color: rgba(139, 92, 246, 0.5);
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.3), 0 0 16px rgba(139, 92, 246, 0.2);
        }
        .vendor-title {
          transition: all 0.3s ease;
        }
        .vendor-title:hover {
          text-shadow: 0 4px 16px rgba(139, 92, 246, 0.4);
        }
      `}</style>
    </div>
  );
};


