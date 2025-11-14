import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckIcon } from 'lucide-react';

interface PricingCardProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  popular: boolean;
  vendorId?: string;
  packageId?: string;
}

export const PricingCard: React.FC<PricingCardProps> = ({
  name,
  price,
  description,
  features,
  popular,
  vendorId,
  packageId
}) => {
  const navigate = useNavigate();

  const handleBookNow = () => {
    // Extract numeric price from price string (e.g., "$500" -> 500)
    const numericPrice = price.replace(/[^0-9.]/g, '');
    navigate('/contract/new', {
      state: { vendorId, packageId, packageName: name, packagePrice: numericPrice }
    });
  };

  return <div className={`bg-gray-800 bg-opacity-50 rounded-lg p-6 ${popular ? 'border-2 border-purple-500 relative' : ''}`}>
      {popular && <div className="absolute top-4 right-4 bg-purple-600 text-xs font-semibold py-1 px-3 rounded-full">
          POPULAR
        </div>}
      <h3 className="text-xl font-bold mb-2">{name}</h3>
      <p className="text-gray-400 text-sm mb-4">{description}</p>
      <div className="text-4xl font-bold text-purple-500 mb-6">{price}</div>
      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => <li key={index} className="flex items-center">
            <span className="mr-2 text-purple-500">
              <CheckIcon size={16} />
            </span>
            <span>{feature}</span>
          </li>)}
      </ul>
      <button 
        onClick={handleBookNow}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium transition duration-200"
      >
        Book Now
      </button>
    </div>;
};