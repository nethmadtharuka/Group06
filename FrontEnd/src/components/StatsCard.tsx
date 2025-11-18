import React from 'react';
interface StatsCardProps {
  title: string;
  value: string | number;
  change: string;
  isPositive?: boolean;
}
export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  isPositive = true
}) => {
  return <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6 border border-gray-700">
      <h3 className="text-gray-400 text-sm mb-2">{title}</h3>
      <p className="text-4xl font-bold text-white mb-2">{value}</p>
      <p className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {change}
      </p>
    </div>;
};