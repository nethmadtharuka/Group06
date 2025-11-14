import React, { useState, useEffect } from 'react';
import { SearchIcon, GridIcon, ListIcon, HeartIcon, StarIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { vendorAPI } from '../services/api';
export const VendorsPage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Vendors');

  useEffect(() => {
    const loadVendors = async () => {
      try {
        const allVendors = await vendorAPI.getAllVendors();
        setVendors(allVendors || []);
      } catch (error) {
        console.error('Error loading vendors:', error);
      } finally {
        setLoading(false);
      }
    };
    loadVendors();
  }, []);

  const filteredVendors = vendors.filter((vendor: any) => {
    const matchesSearch = vendor.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.serviceType?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Vendors' || 
                           vendor.serviceType?.toUpperCase() === selectedCategory.toUpperCase();
    return matchesSearch && matchesCategory;
  });

  const mockVendors = [{
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800',
    category: 'CATERING',
    name: 'Gourmet Creations',
    location: 'San Francisco, CA',
    rating: 4.7,
    reviews: 128
  }, {
    image: 'https://images.unsplash.com/photo-1519167758481-83f29da8c6b0?w=800',
    category: 'VENUES',
    name: 'The Grand Ballroom',
    location: 'New York, NY',
    rating: 5.0,
    reviews: 92
  }, {
    image: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=800',
    category: 'PHOTOGRAPHY',
    name: 'Everlasting Images',
    location: 'Chicago, IL',
    rating: 5.0,
    reviews: 210
  }, {
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800',
    category: 'ENTERTAINMENT',
    name: 'Rhythm Masters DJs',
    location: 'Los Angeles, CA',
    rating: 4.2,
    reviews: 85
  }];
  return <div className="flex flex-col min-h-screen bg-[#0a0a0f] w-full">
      <Header />
      <div className="flex flex-1">
        <aside className="w-80 bg-[#0a0a0f] border-r border-gray-800 min-h-screen p-6">
          <h2 className="text-white font-bold text-lg mb-6">Filters</h2>
          <div className="mb-6">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="DJ, John Smith..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" 
              />
            </div>
          </div>
          <div className="mb-6">
            <h3 className="text-white font-medium mb-3">Category</h3>
            <div className="space-y-2">
              {['All Vendors', 'Catering', 'Venues', 'Photography', 'Entertainment'].map(category => (
                <button 
                  key={category} 
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${selectedCategory === category ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                >
                  <span>{category}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <h3 className="text-white font-medium mb-3">Price Range</h3>
            <div className="px-2">
              <input type="range" min="500" max="5000" className="w-full" />
              <div className="flex justify-between text-sm text-gray-400 mt-2">
                <span>$500</span>
                <span>$5,000+</span>
              </div>
            </div>
          </div>
          <div className="mb-6">
            <h3 className="text-white font-medium mb-3">Rating</h3>
            <div className="flex items-center space-x-1 text-purple-500">
              {[1, 2, 3, 4, 5].map(star => <StarIcon key={star} size={20} fill="currentColor" />)}
              <span className="text-gray-400 ml-2">& up</span>
            </div>
          </div>
          <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg mb-3">
            Apply Filters
          </button>
          <button className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-lg">
            Reset
          </button>
        </aside>
        <main className="flex-1 p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white">
              Find Your Perfect Vendor
            </h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gray-800 rounded-lg p-1">
                <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-gray-400'}`}>
                  <GridIcon size={20} />
                </button>
                <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-gray-400'}`}>
                  <ListIcon size={20} />
                </button>
              </div>
              <select className="bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option>Sort by: Relevance</option>
                <option>Sort by: Rating</option>
                <option>Sort by: Price</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-3 text-center py-8 text-gray-400">Loading vendors...</div>
            ) : filteredVendors.length === 0 ? (
              <div className="col-span-3 text-center py-8 text-gray-400">No vendors found</div>
            ) : (
              filteredVendors.map((vendor: any, index: number) => (
                <Link key={vendor.id || index} to={`/vendor/${vendor.id}`} className="bg-gray-800 bg-opacity-50 rounded-lg overflow-hidden border border-gray-700 hover:border-purple-500 transition-colors">
                <div className="relative h-48">
                  {vendor.mainPhotoURL ? (
                    <img src={vendor.mainPhotoURL} alt={vendor.companyName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">{vendor.companyName?.[0] || 'V'}</span>
                    </div>
                  )}
                  <button className="absolute top-4 right-4 w-10 h-10 bg-black bg-opacity-50 rounded-full flex items-center justify-center hover:bg-opacity-70">
                    <HeartIcon size={20} className="text-white" />
                  </button>
                </div>
                <div className="p-4">
                  <span className="text-xs font-semibold text-gray-400 uppercase">
                    {vendor.serviceType || 'VENDOR'}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1 mb-2">
                    {vendor.companyName}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3">
                    {vendor.address || 'Location not specified'}
                  </p>
                  <div className="flex items-center">
                    <div className="flex text-yellow-400">
                      {[1, 2, 3, 4, 5].map(star => (
                        <StarIcon 
                          key={star} 
                          size={16} 
                          fill={star <= Math.round(vendor.rating || 0) ? "currentColor" : "none"}
                          className={star <= Math.round(vendor.rating || 0) ? "text-yellow-400" : "text-gray-600"}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-white font-medium">
                      {vendor.rating ? vendor.rating.toFixed(1) : '0.0'}
                    </span>
                    <span className="ml-1 text-gray-400 text-sm">
                      (reviews)
                    </span>
                  </div>
                </div>
              </Link>
            )))}
          </div>
          <div className="flex justify-center items-center space-x-2 mt-8">
            <button className="px-3 py-2 bg-gray-800 text-gray-400 rounded hover:bg-gray-700">
              &lt;
            </button>
            <button className="px-4 py-2 bg-purple-600 text-white rounded">
              1
            </button>
            <button className="px-4 py-2 bg-gray-800 text-gray-400 rounded hover:bg-gray-700">
              2
            </button>
            <button className="px-4 py-2 bg-gray-800 text-gray-400 rounded hover:bg-gray-700">
              3
            </button>
            <span className="px-3 py-2 text-gray-400">...</span>
            <button className="px-4 py-2 bg-gray-800 text-gray-400 rounded hover:bg-gray-700">
              12
            </button>
            <button className="px-3 py-2 bg-gray-800 text-gray-400 rounded hover:bg-gray-700">
              &gt;
            </button>
          </div>
        </main>
      </div>
    </div>;
};