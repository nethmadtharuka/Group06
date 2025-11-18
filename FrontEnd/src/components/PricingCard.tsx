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
  numericPrice?: number; // Add numeric price prop
}

export const PricingCard: React.FC<PricingCardProps> = ({
  name,
  price,
  description,
  features,
  popular,
  vendorId,
  packageId,
  numericPrice
}) => {
  const navigate = useNavigate();

  const handleBookNow = () => {
    // Use numericPrice if provided, otherwise extract from price string
    let finalPrice: string;
    if (numericPrice !== undefined) {
      finalPrice = numericPrice.toString();
    } else {
      // Extract numeric price from price string (e.g., "Rs. 5,000.00" -> "5000.00")
      // Remove all non-numeric characters except dots and commas, then remove commas
      const cleaned = price.replace(/[^0-9.,]/g, '').replace(/,/g, '');
      finalPrice = cleaned;
    }
    navigate('/contract/new', {
      state: { vendorId, packageId, packageName: name, packagePrice: finalPrice }
    });
  };

  return (
    <>
      <div className={`bg-gray-800 bg-opacity-50 rounded-lg p-6 vendor-pricing-card flex flex-col h-full ${popular ? 'border-2 border-purple-500 relative' : ''}`}>
        {popular && (
          <div className="absolute top-4 right-4 bg-purple-600 text-xs font-semibold py-1 px-3 rounded-full vendor-popular-badge">
            POPULAR
          </div>
        )}
        <h3 className="text-xl font-bold mb-2 vendor-pricing-title">{name}</h3>
        <p className="text-gray-400 text-sm mb-4 vendor-pricing-description">{description}</p>
        <div className="text-4xl font-bold text-purple-500 mb-6 vendor-pricing-price">{price}</div>
        <ul className="space-y-3 mb-6 flex-grow vendor-pricing-features">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center vendor-pricing-feature">
              <span className="mr-2 text-purple-500 vendor-pricing-check">
                <CheckIcon size={16} />
              </span>
              <span className="vendor-pricing-feature-text">{feature}</span>
            </li>
          ))}
        </ul>
        <button 
          onClick={handleBookNow}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3.5 px-4 rounded-lg font-semibold vendor-pricing-button whitespace-nowrap mt-auto"
        >
          Book Now
        </button>
      </div>
      <style>{`
        .vendor-pricing-card {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          min-height: 450px;
        }
        .vendor-pricing-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 16px 40px rgba(139, 92, 246, 0.3), 0 0 24px rgba(139, 92, 246, 0.2);
          border-color: rgba(139, 92, 246, 0.8);
        }
        .vendor-pricing-features {
          min-height: 0;
        }
        .vendor-popular-badge {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .vendor-pricing-card:hover .vendor-popular-badge {
          transform: scale(1.15) rotate(5deg);
          box-shadow: 0 4px 16px rgba(139, 92, 246, 0.4);
        }
        .vendor-pricing-title {
          transition: all 0.3s ease;
        }
        .vendor-pricing-card:hover .vendor-pricing-title {
          color: #a78bfa;
          transform: translateX(4px);
        }
        .vendor-pricing-description {
          transition: all 0.3s ease;
        }
        .vendor-pricing-card:hover .vendor-pricing-description {
          color: #c4b5fd;
        }
        .vendor-pricing-price {
          transition: all 0.3s ease;
        }
        .vendor-pricing-card:hover .vendor-pricing-price {
          transform: scale(1.1);
          text-shadow: 0 4px 16px rgba(139, 92, 246, 0.4);
        }
        .vendor-pricing-feature {
          transition: all 0.3s ease;
        }
        .vendor-pricing-card:hover .vendor-pricing-feature {
          transform: translateX(4px);
        }
        .vendor-pricing-check {
          transition: all 0.3s ease;
        }
        .vendor-pricing-card:hover .vendor-pricing-check {
          transform: scale(1.2) rotate(10deg);
        }
        .vendor-pricing-feature-text {
          transition: all 0.3s ease;
        }
        .vendor-pricing-card:hover .vendor-pricing-feature-text {
          color: #c4b5fd;
        }
        .vendor-pricing-button {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
          font-size: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .vendor-pricing-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }
        .vendor-pricing-button:hover::before {
          left: 100%;
        }
        .vendor-pricing-button:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.4), 0 0 16px rgba(139, 92, 246, 0.3);
        }
      `}</style>
    </>
  );
};