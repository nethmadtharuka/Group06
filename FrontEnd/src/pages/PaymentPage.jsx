import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import { 
  CreditCard, 
  CheckCircle, 
  AlertCircle, 
  DollarSign, 
  Calendar, 
  User, 
  Building2,
  Lock,
  Shield,
  FileText,
  Sparkles,
  Zap,
  Star,
  TrendingUp,
  Clock
} from 'lucide-react';
import { contractAPI } from '../services/api';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState(null);
  const [contract, setContract] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('PaymentPage - location.state:', location.state); // Debug log
    if (location.state) {
      setPaymentData(location.state);
      console.log('PaymentPage - loading contract with ID:', location.state.contractId); // Debug log
      loadContract(location.state.contractId);
    } else {
      console.log('PaymentPage - no location.state, redirecting to contracts'); // Debug log
      navigate('/contracts');
    }
  }, [location.state, navigate]);

  const loadContract = async (contractId) => {
    try {
      console.log('PaymentPage - fetching contract with ID:', contractId); // Debug log
      const contractData = await contractAPI.getContractById(contractId);
      console.log('PaymentPage - contract data received:', contractData); // Debug log
      setContract(contractData);
    } catch (err) {
      console.error('Error loading contract:', err);
      setError('Failed to load contract details');
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    setError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setPaymentSuccess(true);
      
      if (paymentData.contractId) {
        try {
          await contractAPI.updateContractStatus(paymentData.contractId, true);
        } catch (err) {
          console.error('Error updating contract status:', err);
        }
      }
    } catch (err) {
      setError('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-12 border border-white/20">
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <CheckCircle className="h-12 w-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
              Payment Successful!
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Your payment has been processed successfully. The contract has been signed and is now active.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/contracts')}
                className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center space-x-2"
              >
                <FileText className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                <span>View Contracts</span>
              </button>
              <button
                onClick={() => navigate('/vendors')}
                className="group bg-gradient-to-r from-gray-600 to-slate-600 hover:from-gray-700 hover:to-slate-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center space-x-2"
              >
                <Building2 className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                <span>Browse Vendors</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <p className="text-gray-600 font-medium">No payment information found. Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BackButton />
        
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-lg">
            <CreditCard className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-4">
            Secure Payment
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Complete your contract payment with our secure, encrypted payment system
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Payment Summary */}
          <div className="xl:col-span-1">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20 sticky top-8">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Payment Summary</h2>
                  <p className="text-gray-600">Review your order details</p>
                </div>
              </div>

              {contract && (
                <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-gray-900">Contract Details</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Building2 className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Vendor</p>
                        <p className="font-medium text-gray-900">{contract.vendor?.companyName || 'Unknown'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Event</p>
                        <p className="font-medium text-gray-900">{contract.event?.name || 'No specific event'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${contract.signed ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <p className="font-medium text-gray-900">{contract.signed ? 'Signed' : 'Pending'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex justify-between items-center py-4 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">Service</span>
                  <span className="font-semibold text-gray-900">{paymentData.description}</span>
                </div>
                
                <div className="flex justify-between items-center py-4 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">Contract Fee</span>
                  <span className="font-semibold text-gray-900">${paymentData.amount}</span>
                </div>
                
                <div className="flex justify-between items-center py-4 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">Processing Fee</span>
                  <span className="font-semibold text-green-600">FREE</span>
                </div>
                
                <div className="flex justify-between items-center py-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl px-4">
                  <span className="text-xl font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    ${paymentData.amount}
                  </span>
                </div>
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
                <div className="flex items-start space-x-3">
                  <Shield className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-green-900 mb-2">Bank-Level Security</h3>
                    <p className="text-sm text-green-800 leading-relaxed">
                      Your payment is protected by 256-bit SSL encryption and processed through secure payment gateways.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="xl:col-span-2">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Payment Details</h2>
                  <p className="text-gray-600">Enter your payment information</p>
                </div>
              </div>

              {error && (
                <div className="mb-8 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-4 flex items-start space-x-3 shadow-lg">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              )}

              <form className="space-y-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Card Number
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-white text-lg"
                      disabled
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-white text-lg"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      CVV
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-white text-lg"
                      disabled
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-white text-lg"
                    disabled
                  />
                </div>

                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Lock className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-yellow-900 mb-2">Demo Payment System</h3>
                      <p className="text-sm text-yellow-800 leading-relaxed">
                        This is a demonstration payment system. No real payment will be processed. 
                        Click "Process Payment" to simulate the payment flow and complete your contract.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="group w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-5 px-8 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:transform-none disabled:cursor-not-allowed text-lg"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      <span>Processing Payment...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
                      <span>Process Payment - ${paymentData.amount}</span>
                      <Zap className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;