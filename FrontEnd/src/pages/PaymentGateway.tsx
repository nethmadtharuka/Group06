import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CreditCardIcon, LockIcon, CheckCircleIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
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
              if (import.meta.env.DEV) {
                console.error('Error fetching contracts:', error);
              }
            }
          }
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Error loading contract data:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    loadContractData();
  }, [location.state]);

  const formatCurrency = (amount: string) => {
    if (!amount) return 'Rs. 0.00';
    const num = parseFloat(amount);
    return 'Rs. ' + new Intl.NumberFormat('en-LK', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
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
      if (import.meta.env.DEV) {
        console.error('Payment error:', error);
      }
      alert(error.message || 'Payment failed. Please try again.');
      setProcessing(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-transparent w-full text-white">
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
                className="text-center payment-gateway-success"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="mb-6"
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl payment-gateway-success-icon">
                    <CheckCircleIcon size={48} className="text-white" />
                  </div>
                </motion.div>
                <h2 
                  className="text-3xl font-bold text-white mb-2 payment-gateway-success-title"
                  style={{ fontFamily: '"Poppins", sans-serif' }}
                >
                  Payment Successful!
                </h2>
                <p className="text-gray-400 mb-4 payment-gateway-success-message">
                  Your payment of <span className="text-white font-bold">{formatCurrency(paymentAmount)}</span> has been processed successfully.
                </p>
                <p className="text-gray-500 text-sm payment-gateway-success-redirect">
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
                <div className="text-center mb-8 payment-gateway-header">
                  <h1 
                    className="text-4xl font-bold text-white mb-4 payment-gateway-title"
                    style={{ fontFamily: '"Poppins", sans-serif' }}
                  >
                    <span className="inline-block payment-gateway-title-word">Secure</span>{' '}
                    <span className="inline-block payment-gateway-title-word">Payment</span>{' '}
                    <span className="inline-block payment-gateway-title-word">Gateway</span>
                  </h1>
                  <p className="text-yellow-500 text-sm payment-gateway-warning">
                    <span className="inline-block payment-gateway-warning-phrase">This is a test environment.</span>{' '}
                    <span className="inline-block payment-gateway-warning-phrase">No real transaction will be processed.</span>
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-sm border border-purple-500/30 rounded-xl p-8 mb-8 shadow-2xl payment-gateway-amount-card">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-gray-300 text-sm payment-gateway-amount-label">
                      Payment for
                    </p>
                    <LockIcon size={18} className="text-purple-400 payment-gateway-lock-icon" />
                  </div>
                  <p className="text-gray-400 text-sm mb-3 payment-gateway-event-name">
                    {contractData?.eventName || 'Event Contract'}
                  </p>
                  <p className="text-5xl font-bold text-white payment-gateway-amount-value">
                    {formatCurrency(paymentAmount)}
                  </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6 payment-gateway-form">
                  <div className="payment-gateway-field-group">
                    <label className="block text-white mb-2 payment-gateway-label">Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="Enter name as it appears on card"
                      value={formData.cardholderName}
                      onChange={(e) => setFormData({...formData, cardholderName: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 payment-gateway-input"
                      required
                    />
                  </div>
                  <div className="payment-gateway-field-group">
                    <label className="block text-white mb-2 payment-gateway-label">Card Number</label>
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
                        className="w-full px-4 py-3 pr-12 bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 payment-gateway-input"
                        required
                      />
                      <CreditCardIcon size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 payment-gateway-card-icon" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="payment-gateway-field-group">
                      <label className="block text-white mb-2 payment-gateway-label">Expiration Date</label>
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
                        className="w-full px-4 py-3 bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 payment-gateway-input"
                        required
                      />
                    </div>
                    <div className="payment-gateway-field-group">
                      <label className="block text-white mb-2 payment-gateway-label">CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        maxLength={4}
                        value={formData.cvv}
                        onChange={(e) => setFormData({...formData, cvv: e.target.value.replace(/\D/g, '')})}
                        className="w-full px-4 py-3 bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 payment-gateway-input"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white py-4 px-4 rounded-lg font-medium text-lg payment-gateway-submit-button"
                  >
                    {processing ? (
                      <span className="flex items-center justify-center space-x-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        <span>Processing Payment...</span>
                      </span>
                    ) : (
                      <span className="flex items-center justify-center space-x-2">
                        <LockIcon size={18} />
                        <span>Complete Payment</span>
                      </span>
                    )}
                  </button>
                </form>
                <div className="flex items-center justify-center space-x-2 mt-6 text-gray-400 payment-gateway-security">
                  <LockIcon size={16} className="payment-gateway-security-icon" />
                  <p className="text-sm payment-gateway-security-text">Payments are secure and encrypted</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <style>{`
        /* Header Animations */
        .payment-gateway-header {
          transition: all 0.3s ease;
        }
        .payment-gateway-title {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .payment-gateway-title-word {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: inline-block;
          cursor: default;
        }
        .payment-gateway-title-word:hover {
          transform: translateY(-4px) scale(1.1) rotate(2deg);
          color: #a78bfa;
          text-shadow: 0 6px 20px rgba(139, 92, 246, 0.4), 0 0 16px rgba(139, 92, 246, 0.3);
        }
        .payment-gateway-warning {
          transition: all 0.3s ease;
        }
        .payment-gateway-warning-phrase {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: inline-block;
          cursor: default;
        }
        .payment-gateway-warning-phrase:hover {
          transform: translateY(-2px) scale(1.05);
          color: #fbbf24;
          background: rgba(251, 191, 36, 0.1);
          padding: 2px 4px;
          border-radius: 4px;
        }
        
        /* Amount Card Animations */
        .payment-gateway-amount-card {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
        }
        .payment-gateway-amount-card::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, transparent, rgba(139, 92, 246, 0.1), transparent);
          transform: rotate(45deg);
          transition: all 0.6s ease;
        }
        .payment-gateway-amount-card:hover::before {
          top: 50%;
          left: 50%;
        }
        .payment-gateway-amount-card:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 12px 32px rgba(139, 92, 246, 0.3), 0 0 24px rgba(139, 92, 246, 0.2);
          border-color: rgba(139, 92, 246, 0.6);
        }
        .payment-gateway-amount-label {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .payment-gateway-amount-card:hover .payment-gateway-amount-label {
          color: #c4b5fd;
          transform: translateX(4px);
        }
        .payment-gateway-lock-icon {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .payment-gateway-amount-card:hover .payment-gateway-lock-icon {
          transform: scale(1.2) rotate(10deg);
          color: #a78bfa;
        }
        .payment-gateway-event-name {
          transition: all 0.3s ease;
        }
        .payment-gateway-amount-card:hover .payment-gateway-event-name {
          color: #e9d5ff;
        }
        .payment-gateway-amount-value {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .payment-gateway-amount-card:hover .payment-gateway-amount-value {
          transform: scale(1.05);
          color: #c4b5fd;
        }
        
        /* Form Animations */
        .payment-gateway-form {
          transition: all 0.3s ease;
        }
        .payment-gateway-field-group {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .payment-gateway-field-group:hover {
          transform: translateX(4px);
        }
        .payment-gateway-label {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .payment-gateway-field-group:hover .payment-gateway-label {
          color: #a78bfa;
          transform: translateX(2px);
        }
        .payment-gateway-input {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .payment-gateway-input:hover:not(:focus) {
          transform: translateY(-2px);
          border-color: rgba(139, 92, 246, 0.5);
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);
        }
        .payment-gateway-input:focus {
          transform: translateY(-3px);
          border-color: #a78bfa;
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.3), 0 0 0 2px rgba(139, 92, 246, 0.5);
          background: rgba(17, 24, 39, 0.9);
        }
        .payment-gateway-card-icon {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .payment-gateway-field-group:hover .payment-gateway-card-icon {
          transform: scale(1.2) rotate(5deg);
          color: #a78bfa;
        }
        
        /* Submit Button Animations */
        .payment-gateway-submit-button {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
        }
        .payment-gateway-submit-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }
        .payment-gateway-submit-button:hover:not(:disabled)::before {
          left: 100%;
        }
        .payment-gateway-submit-button:hover:not(:disabled) {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.4), 0 0 16px rgba(139, 92, 246, 0.3);
        }
        .payment-gateway-submit-button:active:not(:disabled) {
          transform: translateY(-1px) scale(1.01);
        }
        
        /* Security Text Animations */
        .payment-gateway-security {
          transition: all 0.3s ease;
        }
        .payment-gateway-security:hover {
          transform: translateY(-2px);
        }
        .payment-gateway-security-icon {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .payment-gateway-security:hover .payment-gateway-security-icon {
          transform: scale(1.2) rotate(10deg);
          color: #a78bfa;
        }
        .payment-gateway-security-text {
          transition: all 0.3s ease;
        }
        .payment-gateway-security:hover .payment-gateway-security-text {
          color: #c4b5fd;
        }
        
        /* Success State Animations */
        .payment-gateway-success {
          transition: all 0.3s ease;
        }
        .payment-gateway-success-icon {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
          }
          50% {
            box-shadow: 0 0 0 20px rgba(34, 197, 94, 0);
          }
        }
        .payment-gateway-success-title {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .payment-gateway-success:hover .payment-gateway-success-title {
          transform: translateY(-2px);
          color: #a78bfa;
        }
        .payment-gateway-success-message {
          transition: all 0.3s ease;
        }
        .payment-gateway-success:hover .payment-gateway-success-message {
          color: #e9d5ff;
        }
        .payment-gateway-success-redirect {
          transition: all 0.3s ease;
        }
        .payment-gateway-success:hover .payment-gateway-success-redirect {
          color: #c4b5fd;
        }
      `}</style>
    </div>
  );
};