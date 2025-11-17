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
              // Ensure packagePrice is a valid number string
              const priceValue = typeof state.packagePrice === 'number' 
                ? state.packagePrice.toString() 
                : state.packagePrice.toString().replace(/[^0-9.]/g, '');
              setFormData(prev => ({
                ...prev,
                totalFee: priceValue
              }));
            }
          }
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Error loading data:', error);
        }
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
      if (import.meta.env.DEV) {
        console.error('Error creating contract:', error);
      }
      alert('Failed to create contract. Please try again.');
    }
  };
  return <motion.div initial={{
    opacity: 0
  }} animate={{
    opacity: 1
  }} exit={{
    opacity: 0
  }} className="flex flex-col min-h-screen bg-transparent w-full text-white relative">
      <Header />
      <main className="p-8 flex-1">
        <h1 
          className="text-4xl font-bold mb-8 create-contract-title"
          style={{ fontFamily: '"Poppins", sans-serif' }}
        >
          <span className="inline-block create-contract-title-word">Create</span>{' '}
          <span className="inline-block create-contract-title-word">a</span>{' '}
          <span className="inline-block create-contract-title-word">New</span>{' '}
          <span className="inline-block create-contract-title-word">Contract</span>
        </h1>
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
          }} className="bg-gray-800/50 border border-gray-700 rounded-lg p-8 create-contract-section">
              <h2 className="text-2xl font-bold mb-6 create-contract-section-title">Select Your Event</h2>
              <div className="space-y-6">
                <div className="create-contract-field-group">
                  <label className="block text-white mb-2 create-contract-label">Event Name</label>
                  <div className="relative">
                    {loading ? (
                      <div className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-400">
                        Loading events...
                      </div>
                    ) : (
                      <select
                        value={selectedEventId}
                        onChange={(e) => handleEventChange(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 create-contract-input create-contract-select"
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
                  <div className="create-contract-field-group">
                    <label className="block text-white mb-2 create-contract-label">Event Date</label>
                    <input 
                      type="date" 
                      value={formData.eventDate}
                      onChange={(e) => setFormData({...formData, eventDate: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 create-contract-input" 
                    />
                  </div>
                  <div className="create-contract-field-group">
                    <label className="block text-white mb-2 create-contract-label">Venue</label>
                    <input 
                      type="text" 
                      value={formData.venue}
                      onChange={(e) => setFormData({...formData, venue: e.target.value})}
                      placeholder="Enter venue"
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 create-contract-input" 
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
          }} className="bg-gray-800/50 border border-gray-700 rounded-lg p-8 create-contract-section">
              <h2 className="text-2xl font-bold mb-6 create-contract-section-title">
                Client & Party Details
              </h2>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="create-contract-field-group">
                    <label className="block text-white mb-2 create-contract-label">Client Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g., Jane Doe" 
                      value={formData.clientName}
                      onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 create-contract-input" 
                    />
                  </div>
                  <div className="create-contract-field-group">
                    <label className="block text-white mb-2 create-contract-label">
                      Company Name
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g., Innovations Inc." 
                      value={formData.companyName}
                      onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 create-contract-input" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="create-contract-field-group">
                    <label className="block text-white mb-2 create-contract-label">
                      Contact Email
                    </label>
                    <input 
                      type="email" 
                      placeholder="e.g., jane.doe@example.com" 
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 create-contract-input" 
                    />
                  </div>
                  <div className="create-contract-field-group">
                    <label className="block text-white mb-2 create-contract-label">
                      Phone Number
                    </label>
                    <input 
                      type="tel" 
                      placeholder="e.g., (555) 123-4567" 
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 create-contract-input" 
                    />
                  </div>
                </div>
                <div className="create-contract-field-group">
                  <label className="block text-white mb-2 create-contract-label">Address</label>
                  <input 
                    type="text" 
                    placeholder="e.g., 123 Innovation Drive, Techville" 
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 create-contract-input" 
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
          }} className="bg-gray-800/50 border border-gray-700 rounded-lg p-8 create-contract-section">
              <h2 className="text-2xl font-bold mb-6 create-contract-section-title">Contract Specifics</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-6">
                  <div className="create-contract-field-group">
                    <label className="block text-white mb-2 create-contract-label">
                      Total Fee (Rs.)
                    </label>
                    <input 
                      type="number" 
                      placeholder="e.g., 5000" 
                      value={formData.totalFee}
                      onChange={(e) => setFormData({...formData, totalFee: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 create-contract-input" 
                    />
                  </div>
                  <div className="create-contract-field-group">
                    <label className="block text-white mb-2 create-contract-label">
                      Deposit Amount (Rs.)
                    </label>
                    <input 
                      type="number" 
                      placeholder="e.g., 2500" 
                      value={formData.depositAmount}
                      onChange={(e) => setFormData({...formData, depositAmount: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 create-contract-input" 
                    />
                  </div>
                  <div className="create-contract-field-group">
                    <label className="block text-white mb-2 create-contract-label">
                      Payment Deadline
                    </label>
                    <input 
                      type="date" 
                      value={formData.paymentDeadline}
                      onChange={(e) => setFormData({...formData, paymentDeadline: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 create-contract-input" 
                    />
                  </div>
                </div>
                <div className="create-contract-field-group">
                  <label className="block text-white mb-3 create-contract-label">
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
                  }].map(clause => <button key={clause.id} onClick={() => toggleClause(clause.id)} className={`flex items-center space-x-3 px-4 py-3 rounded-lg border transition-all create-contract-clause-button ${selectedClauses[clause.id as keyof typeof selectedClauses] ? 'bg-purple-600/20 border-purple-500' : 'bg-gray-900 border-gray-700 hover:border-gray-600'}`}>
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all create-contract-clause-checkbox ${selectedClauses[clause.id as keyof typeof selectedClauses] ? 'bg-purple-600 border-purple-600' : 'border-gray-600'}`}>
                          {selectedClauses[clause.id as keyof typeof selectedClauses] && <svg className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>}
                        </div>
                        <span className="text-sm create-contract-clause-label">{clause.label}</span>
                      </button>)}
                  </div>
                </div>
                <div className="create-contract-field-group">
                  <label className="block text-white mb-2 create-contract-label">
                    Custom Clauses / Special Requirements
                  </label>
                  <textarea 
                    rows={6} 
                    placeholder="Add any additional terms or agreements here..." 
                    value={formData.customClauses}
                    onChange={(e) => setFormData({...formData, customClauses: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 create-contract-textarea resize-none"
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
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 sticky top-8 create-contract-summary">
              <h2 className="text-xl font-bold mb-6 create-contract-summary-title">Contract Summary</h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between create-contract-summary-item">
                  <span className="text-gray-400 create-contract-summary-label">Total Fee</span>
                  <span className="font-bold text-xl create-contract-summary-value">Rs. {formData.totalFee ? parseFloat(formData.totalFee).toLocaleString() : '0.00'}</span>
                </div>
                <div className="flex justify-between create-contract-summary-item">
                  <span className="text-gray-400 create-contract-summary-label">Deposit Due</span>
                  <span className="font-bold text-xl create-contract-summary-value">Rs. {formData.depositAmount ? parseFloat(formData.depositAmount).toLocaleString() : '0.00'}</span>
                </div>
                <div className="flex justify-between create-contract-summary-item">
                  <span className="text-gray-400 create-contract-summary-label">Final Balance Date</span>
                  <span className="font-medium create-contract-summary-value">{formData.paymentDeadline || 'Not set'}</span>
                </div>
                <div className="pt-4 border-t border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-purple-400 font-medium create-contract-summary-total-label">
                      Total
                    </span>
                    <span className="font-bold text-3xl text-purple-400 create-contract-summary-total-value">
                      Rs. {formData.totalFee ? parseFloat(formData.totalFee).toLocaleString() : '0.00'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <button onClick={handleGenerateContract} className="w-full flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg create-contract-generate-button">
                  <FileTextIcon size={20} />
                  <span>Generate Contract</span>
                </button>
                <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg create-contract-draft-button">
                  Save as Draft
                </button>
                <Link to="/events" className="block text-center text-gray-400 hover:text-white py-3 create-contract-cancel-link">
                  Cancel
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <style>{`
        /* Title Animations */
        .create-contract-title {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .create-contract-title-word {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: inline-block;
          cursor: default;
        }
        .create-contract-title-word:hover {
          transform: translateY(-4px) scale(1.1) rotate(2deg);
          color: #a78bfa;
          text-shadow: 0 6px 20px rgba(139, 92, 246, 0.4), 0 0 16px rgba(139, 92, 246, 0.3);
        }
        
        /* Section Animations */
        .create-contract-section {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .create-contract-section:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.2);
          border-color: rgba(139, 92, 246, 0.5);
        }
        .create-contract-section-title {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .create-contract-section:hover .create-contract-section-title {
          color: #a78bfa;
          transform: translateX(4px);
        }
        
        /* Field Group Animations */
        .create-contract-field-group {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .create-contract-field-group:hover {
          transform: translateX(4px);
        }
        .create-contract-label {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .create-contract-field-group:hover .create-contract-label {
          color: #a78bfa;
          transform: translateX(2px);
        }
        
        /* Input Animations */
        .create-contract-input,
        .create-contract-select,
        .create-contract-textarea {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .create-contract-input:hover:not(:focus),
        .create-contract-select:hover:not(:focus),
        .create-contract-textarea:hover:not(:focus) {
          transform: translateY(-2px);
          border-color: rgba(139, 92, 246, 0.5);
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);
        }
        .create-contract-input:focus,
        .create-contract-select:focus,
        .create-contract-textarea:focus {
          transform: translateY(-3px);
          border-color: #a78bfa;
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.3), 0 0 0 2px rgba(139, 92, 246, 0.5);
        }
        
        /* Clause Button Animations */
        .create-contract-clause-button {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .create-contract-clause-button:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
        }
        .create-contract-clause-checkbox {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .create-contract-clause-button:hover .create-contract-clause-checkbox {
          transform: scale(1.1) rotate(5deg);
        }
        .create-contract-clause-label {
          transition: all 0.3s ease;
        }
        .create-contract-clause-button:hover .create-contract-clause-label {
          color: #c4b5fd;
        }
        
        /* Summary Card Animations */
        .create-contract-summary {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .create-contract-summary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.2);
          border-color: rgba(139, 92, 246, 0.5);
        }
        .create-contract-summary-title {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .create-contract-summary:hover .create-contract-summary-title {
          color: #a78bfa;
          transform: translateX(4px);
        }
        .create-contract-summary-item {
          transition: all 0.3s ease;
        }
        .create-contract-summary:hover .create-contract-summary-item {
          transform: translateX(2px);
        }
        .create-contract-summary-label {
          transition: all 0.3s ease;
        }
        .create-contract-summary-item:hover .create-contract-summary-label {
          color: #c4b5fd;
        }
        .create-contract-summary-value {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .create-contract-summary-item:hover .create-contract-summary-value {
          transform: scale(1.05);
          color: #a78bfa;
        }
        .create-contract-summary-total-label,
        .create-contract-summary-total-value {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .create-contract-summary:hover .create-contract-summary-total-label,
        .create-contract-summary:hover .create-contract-summary-total-value {
          transform: scale(1.05);
        }
        
        /* Button Animations */
        .create-contract-generate-button {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
        }
        .create-contract-generate-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }
        .create-contract-generate-button:hover::before {
          left: 100%;
        }
        .create-contract-generate-button:hover {
          transform: translateY(-3px) scale(1.05) rotate(1deg);
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.4), 0 0 16px rgba(139, 92, 246, 0.3);
        }
        .create-contract-generate-button:active {
          transform: translateY(-1px) scale(1.02);
        }
        .create-contract-draft-button {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .create-contract-draft-button:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3);
        }
        .create-contract-cancel-link {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .create-contract-cancel-link:hover {
          transform: translateY(-2px);
          color: #a78bfa !important;
        }
      `}</style>
    </motion.div>;
};