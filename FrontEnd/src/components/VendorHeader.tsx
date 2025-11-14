import React from 'react';
export const VendorHeader = ({ vendor }: { vendor?: any }) => {
  // Use detailPhotoURL first, fallback to mainPhotoURL, then default image
  const backgroundImage = vendor?.detailPhotoURL || vendor?.mainPhotoURL;
  
  return <div className="relative w-full h-[400px] mb-8">
      <div 
        className="absolute inset-0 bg-center bg-cover" 
        style={{
          backgroundImage: backgroundImage 
            ? `url('${backgroundImage}')` 
            : "url('https://uploadthingy.s3.us-west-1.amazonaws.com/kZPxGBYXb9J251w4QjUuAN/Vendorpage1.png')"
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>
      <div className="absolute bottom-10 left-10">
        <h1 className="text-5xl font-bold text-white">{vendor?.companyName || 'Vendor'}</h1>
      </div>
    </div>;
};