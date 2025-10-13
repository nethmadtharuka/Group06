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
      className="group flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-all duration-200 mb-6 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20 shadow-sm hover:shadow-md"
    >
      <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" />
      <span className="text-sm font-semibold">{text}</span>
    </button>
  );
};

export default BackButton;
