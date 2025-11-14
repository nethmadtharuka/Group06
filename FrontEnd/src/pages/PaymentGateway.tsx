import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CreditCardIcon, LockIcon, CheckCircleIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '../components/Header';
import { paymentAPI, contractAPI } from '../services/api';

export const PaymentGateway = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [contractData, setContractData] = useState<any>(null);
  const [paymentAmount, setPaymentAmount] = useState<string>('0.00');
  const [contractId, setContractId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [formData, setFormData] = useState({
    cardholderName: '',
    cardNumber: '',
    expirationDate: '',
    cvv: ''
  });

  useEffect(() => {
    const loadContractData = async () => {
      try {
        // Get contract data from navigation state or localStorage
        const state = location.state as any;
        let data = null;

        if (state?.contractData) {
          data = state.contractData;
        } else {
          // Try to get from localStorage
          const stored = localStorage.getItem('pendingContract');
          if (stored) {
            const parsed = JSON.parse(stored);
            data = {
              ...parsed.formData,
              contractId: parsed.contractId
            };
          }
        }

        if (data) {
          setContractData(data);
          setPaymentAmount(data.totalFee || '0.00');
          
          // Get contract ID from data or fetch latest
          if (data.contractId) {
            setContractId(data.contractId);
          } else {
            // Try to get the latest contract for this user
            try {
              const contracts = await contractAPI.getAllContracts();
              if (contracts && Array.isArray(contracts) && contracts.length > 0) {
                // Find contract matching the event ID if available
                const matchingContract = data.eventId 
                  ? contracts.find((c: any) => c.event?.id === data.eventId)
                  : null;
                
                const contractToUse = matchingContract || contracts[contracts.length - 1];
                setContractId((contractToUse as any).id);
              }
            } catch (error) {
              console.error('Error fetching contracts:', error);
            }
          }
        }
      } catch (error) {
        console.error('Error loading contract data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContractData();
  }, [location.state]);

  const formatCurrency = (amount: string) => {
    if (!amount) return '$0.00';
    const num = parseFloat(amount);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(num);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contractId) {
      alert('Contract information is missing. Please go back and create a contract first.');
      return;
    }

    if (!formData.cardholderName || !formData.cardNumber || !formData.expirationDate || !formData.cvv) {
      alert('Please fill in all payment details');
      return;
    }

    setProcessing(true);

    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create payment record
      await paymentAPI.createPayment({
        contractId: contractId,
        amount: parseFloat(paymentAmount),
        paymentMethod: 'CARD'
      });

      // Clear localStorage
      localStorage.removeItem('pendingContract');

      // Show success animation
      setPaymentSuccess(true);

      // Navigate to dashboard after 3 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (error: any) {
      console.error('Payment error:', error);
      alert(error.message || 'Payment failed. Please try again.');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#0a0a0f] w-full text-white">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-400">Loading payment information...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0f] w-full text-white">
      <Header />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait">
            {paymentSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="mb-6"
                >
                  <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircleIcon size={48} className="text-white" />
                  </div>
                </motion.div>
                <h2 className="text-3xl font-bold text-white mb-2">Payment Successful!</h2>
                <p className="text-gray-400 mb-4">
                  Your payment of {formatCurrency(paymentAmount)} has been processed successfully.
                </p>
                <p className="text-gray-500 text-sm">
                  Redirecting to dashboard...
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="text-center mb-8">
                  <h1 className="text-4xl font-bold text-white mb-4">
                    Simulated Payment Gateway
                  </h1>
                  <p className="text-yellow-500 text-sm">
                    This is a test environment. No real transaction will be processed.
                  </p>
                </div>
                <div className="bg-gray-900 bg-opacity-50 border border-gray-700 rounded-lg p-6 mb-8">
                  <p className="text-gray-400 mb-2">
                    Payment for {contractData?.eventName || 'Event Contract'}
                  </p>
                  <p className="text-4xl font-bold text-white">{formatCurrency(paymentAmount)}</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-white mb-2">Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="Enter name as it appears on card"
                      value={formData.cardholderName}
                      onChange={(e) => setFormData({...formData, cardholderName: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-2">Card Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        maxLength={19}
                        value={formData.cardNumber}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
                          setFormData({...formData, cardNumber: value});
                        }}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      />
                      <CreditCardIcon size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white mb-2">Expiration Date</label>
                      <input
                        type="text"
                        placeholder="MM / YY"
                        maxLength={7}
                        value={formData.expirationDate}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, '');
                          if (value.length >= 2) {
                            value = value.substring(0, 2) + ' / ' + value.substring(2, 4);
                          }
                          setFormData({...formData, expirationDate: value});
                        }}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-white mb-2">CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        maxLength={4}
                        value={formData.cvv}
                        onChange={(e) => setFormData({...formData, cvv: e.target.value.replace(/\D/g, '')})}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-4 px-4 rounded-lg font-medium text-lg transition-colors"
                  >
                    {processing ? 'Processing Payment...' : 'Complete Payment'}
                  </button>
                </form>
                <div className="flex items-center justify-center space-x-2 mt-6 text-gray-400">
                  <LockIcon size={16} />
                  <p className="text-sm">Payments are secure and encrypted</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};