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
  return (
    <>
      <div className="border-b border-gray-800 mb-8">
        <nav className="flex space-x-8">
          {tabs.map(tab => (
            <button 
              key={tab.id} 
              className={`py-4 px-1 relative vendor-tab-button ${activeTab === tab.id ? 'text-white font-medium' : 'text-gray-400 hover:text-white'}`} 
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 w-full h-1 bg-purple-600 vendor-tab-indicator"></span>
              )}
            </button>
          ))}
        </nav>
      </div>
      <style>{`
        .vendor-tab-button {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .vendor-tab-button:hover {
          transform: translateY(-2px);
          color: #a78bfa;
        }
        .vendor-tab-indicator {
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(139, 92, 246, 0.5);
        }
      `}</style>
    </>
  );
};