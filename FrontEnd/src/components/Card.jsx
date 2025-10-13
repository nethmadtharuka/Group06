import React from 'react';

const Card = ({ children, className = '', onClick }) => {
  return (
    <div 
      className={`bg-white rounded-lg shadow-md border border-gray-200 p-6 ${className} ${
        onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''
      }`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
