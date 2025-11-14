import React from 'react';
interface TabNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}
export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  setActiveTab
}) => {
  const tabs = [{
    id: 'details',
    label: 'Details'
  }, {
    id: 'packages',
    label: 'Packages'
  }, {
    id: 'reviews',
    label: 'Reviews'
  }];
  return <div className="border-b border-gray-800 mb-8">
      <nav className="flex space-x-8">
        {tabs.map(tab => <button key={tab.id} className={`py-4 px-1 relative ${activeTab === tab.id ? 'text-white font-medium' : 'text-gray-400 hover:text-white'}`} onClick={() => setActiveTab(tab.id)}>
            {tab.label}
            {activeTab === tab.id && <span className="absolute bottom-0 left-0 w-full h-1 bg-purple-600"></span>}
          </button>)}
      </nav>
    </div>;
};