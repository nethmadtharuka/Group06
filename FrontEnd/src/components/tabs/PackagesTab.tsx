import React from 'react';
import { PricingCard } from '../PricingCard';
export const PackagesTab = ({ packages, vendorId }: { packages?: any[], vendorId?: string }) => {
  if (!packages || packages.length === 0) {
    return <div className="text-center py-12">
      <p className="text-gray-400 text-lg">No packages available for this vendor yet.</p>
    </div>;
  }

  return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {packages.map((pkg: any, index: number) => (
        <PricingCard 
          key={pkg.id || index} 
          name={pkg.name || 'Package'}
          price={pkg.price ? `$${pkg.price}` : 'Contact for pricing'}
          description={pkg.description || ''}
          features={pkg.features || []}
          popular={pkg.isPopular || false}
          vendorId={vendorId}
          packageId={pkg.id}
        />
      ))}
    </div>;
};