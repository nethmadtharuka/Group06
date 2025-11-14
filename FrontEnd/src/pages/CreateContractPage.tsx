import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileTextIcon } from 'lucide-react';
import { Header } from '../components/Header';
import { eventAPI, contractAPI, userAPI } from '../services/api';
export const CreateContractPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [formData, setFormData] = useState({
    eventName: '',
    eventId: '',
    eventDate: '',
    venue: '',
    clientName: '',
    companyName: '',
    contactEmail: '',
    phoneNumber: '',
    address: '',
    totalFee: '',
    depositAmount: '',
    paymentDeadline: '',
    customClauses: ''
  });
  const [vendorId, setVendorId] = useState<string>('');
  const [packageId, setPackageId] = useState<string>('');

  // Load user events and populate form from location state
  useEffect(() => {
    const loadData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (userId) {
          // Fetch user events
          const userEvents = await eventAPI.getEventsByUser(userId);
          setEvents(userEvents || []);
          
          // Get user info for client details
          const userStr = localStorage.getItem('user');
          if (userStr) {
            const user = JSON.parse(userStr);
            setFormData(prev => ({
              ...prev,
              clientName: user.fullName || user.username || '',
              contactEmail: user.email || '',
              phoneNumber: user.phone || ''
            }));
          }
          
          // Get data from location state (from Book Now button)
          const state = location.state as any;
          if (state) {
            if (state.vendorId) setVendorId(state.vendorId);
            if (state.packageId) setPackageId(state.packageId);
            if (state.packagePrice) {
              setFormData(prev => ({
                ...prev,
                totalFee: state.packagePrice
              }));
            }
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [location.state]);

  // Handle event selection
  const handleEventChange = (eventId: string) => {
    setSelectedEventId(eventId);
    const selectedEvent = events.find(e => e.id === eventId);
    if (selectedEvent) {
      setFormData(prev => ({
        ...prev,
        eventId: eventId,
        eventName: selectedEvent.name || '',
        eventDate: selectedEvent.startDate ? selectedEvent.startDate.split('T')[0] : '',
        venue: selectedEvent.location || ''
      }));
    }
  };
  const [selectedClauses, setSelectedClauses] = useState({
    cancellation: true,
    liability: true,
    confidentiality: false
  });

  // Store form data in localStorage as backup (only when event is selected)
  useEffect(() => {
    if (formData.eventId) {
      const contractData = {
        formData,
        vendorId,
        packageId,
        selectedClauses
      };
      localStorage.setItem('pendingContract', JSON.stringify(contractData));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.eventId]);
  const toggleClause = (clause: string) => {
    setSelectedClauses(prev => ({
      ...prev,
      [clause]: !prev[clause as keyof typeof prev]
    }));
  };
  const handleGenerateContract = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        alert('Please log in to create a contract');
        navigate('/login');
        return;
      }

      if (!formData.eventId) {
        alert('Please select an event');
        return;
      }

      // Create contract text
      const contractText = `Contract for ${formData.eventName || 'Event'}
      
Client: ${formData.clientName}
Company: ${formData.companyName}
Contact: ${formData.contactEmail}
Phone: ${formData.phoneNumber}
Address: ${formData.address}

Event Details:
- Date: ${formData.eventDate}
- Venue: ${formData.venue}
- Total Fee: $${formData.totalFee}
- Deposit: $${formData.depositAmount}
- Payment Deadline: ${formData.paymentDeadline}

Selected Clauses:
${selectedClauses.cancellation ? '- Cancellation Policy' : ''}
${selectedClauses.liability ? '- Liability Insurance' : ''}
${selectedClauses.confidentiality ? '- Confidentiality' : ''}

${formData.customClauses ? `Custom Clauses:\n${formData.customClauses}` : ''}`;

      // Format payment deadline for backend
      let paymentDeadlineISO = '';
      if (formData.paymentDeadline) {
        const deadlineDate = new Date(formData.paymentDeadline);
        deadlineDate.setHours(23, 59, 59);
        paymentDeadlineISO = deadlineDate.toISOString();
      }

      const contractResponse = await contractAPI.createContract({
        userId: userId || undefined,
        contractText,
        eventId: formData.eventId,
        vendorId: vendorId || undefined,
        clientName: formData.clientName,
        companyName: formData.companyName,
        contactEmail: formData.contactEmail,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        totalFee: formData.totalFee ? parseFloat(formData.totalFee) : undefined,
        depositAmount: formData.depositAmount ? parseFloat(formData.depositAmount) : undefined,
        paymentDeadline: paymentDeadlineISO || undefined,
        venue: formData.venue
      });

      // Pass contract data to review page
      navigate('/contract/review', {
        state: {
          contractData: {
            ...formData,
            vendorId,
            packageId,
            selectedClauses,
            contractId: (contractResponse as any).contractId
          }
        }
      });
    } catch (error) {
      console.error('Error creating contract:', error);
      alert('Failed to create contract. Please try again.');
    }
  };
  return <motion.div initial={{
    opacity: 0
  }} animate={{
    opacity: 1
  }} exit={{
    opacity: 0
  }} className="flex flex-col min-h-screen bg-[#0a0a0f] w-full text-white">
      <Header />
      <main className="p-8 flex-1">
        <motion.h1 initial={{
        x: -20,
        opacity: 0
      }} animate={{
        x: 0,
        opacity: 1
      }} transition={{
        duration: 0.5
      }} className="text-4xl font-bold mb-8">
          Create a New Contract
        </motion.h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <motion.div initial={{
            y: 20,
            opacity: 0
          }} animate={{
            y: 0,
            opacity: 1
          }} transition={{
            duration: 0.5,
            delay: 0.1
          }} className="bg-gray-800/50 border border-gray-700 rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Select Your Event</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-white mb-2">Event Name</label>
                  <div className="relative">
                    {loading ? (
                      <div className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-400">
                        Loading events...
                      </div>
                    ) : (
                      <select
                        value={selectedEventId}
                        onChange={(e) => handleEventChange(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                      >
                        <option value="">Select an event</option>
                        {events.map((event: any) => (
                          <option key={event.id} value={event.id}>
                            {event.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white mb-2">Event Date</label>
                    <input 
                      type="date" 
                      value={formData.eventDate}
                      onChange={(e) => setFormData({...formData, eventDate: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-2">Venue</label>
                    <input 
                      type="text" 
                      value={formData.venue}
                      onChange={(e) => setFormData({...formData, venue: e.target.value})}
                      placeholder="Enter venue"
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" 
                    />
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div initial={{
            y: 20,
            opacity: 0
          }} animate={{
            y: 0,
            opacity: 1
          }} transition={{
            duration: 0.5,
            delay: 0.2
          }} className="bg-gray-800/50 border border-gray-700 rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-6">
                Client & Party Details
              </h2>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white mb-2">Client Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g., Jane Doe" 
                      value={formData.clientName}
                      onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-2">
                      Company Name
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g., Innovations Inc." 
                      value={formData.companyName}
                      onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white mb-2">
                      Contact Email
                    </label>
                    <input 
                      type="email" 
                      placeholder="e.g., jane.doe@example.com" 
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-2">
                      Phone Number
                    </label>
                    <input 
                      type="tel" 
                      placeholder="e.g., (555) 123-4567" 
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-white mb-2">Address</label>
                  <input 
                    type="text" 
                    placeholder="e.g., 123 Innovation Drive, Techville" 
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" 
                  />
                </div>
              </div>
            </motion.div>
            <motion.div initial={{
            y: 20,
            opacity: 0
          }} animate={{
            y: 0,
            opacity: 1
          }} transition={{
            duration: 0.5,
            delay: 0.3
          }} className="bg-gray-800/50 border border-gray-700 rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Contract Specifics</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <label className="block text-white mb-2">
                      Total Fee ($)
                    </label>
                    <input 
                      type="number" 
                      placeholder="e.g., 5000" 
                      value={formData.totalFee}
                      onChange={(e) => setFormData({...formData, totalFee: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-2">
                      Deposit Amount ($)
                    </label>
                    <input 
                      type="number" 
                      placeholder="e.g., 2500" 
                      value={formData.depositAmount}
                      onChange={(e) => setFormData({...formData, depositAmount: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-2">
                      Payment Deadline
                    </label>
                    <input 
                      type="date" 
                      value={formData.paymentDeadline}
                      onChange={(e) => setFormData({...formData, paymentDeadline: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-white mb-3">
                    Standard Clauses
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {[{
                    id: 'cancellation',
                    label: 'Cancellation Policy'
                  }, {
                    id: 'liability',
                    label: 'Liability Insurance'
                  }, {
                    id: 'confidentiality',
                    label: 'Confidentiality'
                  }].map(clause => <button key={clause.id} onClick={() => toggleClause(clause.id)} className={`flex items-center space-x-3 px-4 py-3 rounded-lg border transition-all ${selectedClauses[clause.id as keyof typeof selectedClauses] ? 'bg-purple-600/20 border-purple-500' : 'bg-gray-900 border-gray-700 hover:border-gray-600'}`}>
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${selectedClauses[clause.id as keyof typeof selectedClauses] ? 'bg-purple-600 border-purple-600' : 'border-gray-600'}`}>
                          {selectedClauses[clause.id as keyof typeof selectedClauses] && <svg className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>}
                        </div>
                        <span className="text-sm">{clause.label}</span>
                      </button>)}
                  </div>
                </div>
                <div>
                  <label className="block text-white mb-2">
                    Custom Clauses / Special Requirements
                  </label>
                  <textarea 
                    rows={6} 
                    placeholder="Add any additional terms or agreements here..." 
                    value={formData.customClauses}
                    onChange={(e) => setFormData({...formData, customClauses: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none"
                  ></textarea>
                </div>
              </div>
            </motion.div>
          </div>
          <motion.div initial={{
          x: 20,
          opacity: 0
        }} animate={{
          x: 0,
          opacity: 1
        }} transition={{
          duration: 0.5,
          delay: 0.2
        }} className="space-y-6">
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold mb-6">Contract Summary</h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Fee</span>
                  <span className="font-bold text-xl">${formData.totalFee ? parseFloat(formData.totalFee).toLocaleString() : '0.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Deposit Due</span>
                  <span className="font-bold text-xl">${formData.depositAmount ? parseFloat(formData.depositAmount).toLocaleString() : '0.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Final Balance Date</span>
                  <span className="font-medium">{formData.paymentDeadline || 'Not set'}</span>
                </div>
                <div className="pt-4 border-t border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-purple-400 font-medium">
                      Total
                    </span>
                    <span className="font-bold text-3xl text-purple-400">
                      ${formData.totalFee ? parseFloat(formData.totalFee).toLocaleString() : '0.00'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <button onClick={handleGenerateContract} className="w-full flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg transition-all transform hover:scale-105">
                  <FileTextIcon size={20} />
                  <span>Generate Contract</span>
                </button>
                <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg transition-colors">
                  Save as Draft
                </button>
                <Link to="/events" className="block text-center text-gray-400 hover:text-white py-3 transition-colors">
                  Cancel
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </motion.div>;
};