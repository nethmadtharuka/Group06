import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const BackButton = ({ to = -1, text = 'Back' }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (to === -1) {
      navigate(-1);
    } else {
      navigate(to);
    }
  };

  return (
    <button
      onClick={handleBack}
      className="flex items-center space-x-2 text-gray-600 hover:text-teal-600 transition-colors mb-4"
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="text-sm font-medium">{text}</span>
    </button>
  );
};

export default BackButton;
