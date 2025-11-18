import React from 'react';
import { PricingCard } from '../PricingCard';
export const PackagesTab = ({ packages, vendorId }: { packages?: any[], vendorId?: string }) => {
  if (!packages || packages.length === 0) {
    return <div className="text-center py-12">
      <p className="text-gray-400 text-lg">No packages available for this vendor yet.</p>
    </div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {packages.map((pkg: any, index: number) => {
          // Format price for display
          const formattedPrice = pkg.price 
            ? `Rs. ${new Intl.NumberFormat('en-LK', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              }).format(pkg.price)}`
            : 'Contact for pricing';
          
          return (
            <div key={pkg.id || index} className="flex">
              <PricingCard 
                name={pkg.packageName || pkg.name || 'Package'}
                price={formattedPrice}
                description={pkg.description || ''}
                features={pkg.features || []}
                popular={pkg.isPopular || false}
                vendorId={vendorId}
                packageId={pkg.id}
                numericPrice={pkg.price} // Pass the actual numeric price
              />
            </div>
          );
        })}
      </div>
    </>
  );
};