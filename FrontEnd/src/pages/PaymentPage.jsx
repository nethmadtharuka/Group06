import React, { useState } from 'react';
import { CreditCard, Lock, ArrowLeft, X, HelpCircle, Calendar, MapPin, Phone, Mail } from 'lucide-react';

const PaymentPage = () => {
  const [billingData, setBillingData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });

  const [formData, setFormData] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvv: '',
    saveCard: true
  });
  
  const [submitted, setSubmitted] = useState(false);

  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBillingData({
      ...billingData,
      [name]: value
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    let formattedValue = value;
    
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (formattedValue.length > 19) return;
    }
    
    if (name === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2, 4);
      }
      if (formattedValue.length > 5) return;
    }
    
    if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : formattedValue
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Payment form submitted:', { billingData, formData });
    setSubmitted(true);
  };

  const handleBack = () => {
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-teal-600 rounded-lg p-2">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">EventCraft</h1>
                  <p className="text-sm text-gray-500">Event Management</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        <div className="flex items-center justify-center px-4 py-16">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Saved!</h2>
            <p className="text-gray-600 mb-6">
              Your payment information has been securely saved.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
            >
              Add Another Card
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-teal-600 rounded-lg p-2">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">EventCraft</h1>
                <p className="text-sm text-gray-500">Event Management</p>
              </div>
            </div>
            <button
              onClick={handleBack}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              <span className="text-sm font-medium">Back</span>
            </button>
          </div>
        </div>
      </div>

      {/* Page Title */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-4">Payment</h1>
        <p className="text-center text-gray-600 max-w-2xl mx-auto">
          Complete your billing information and payment details to secure your event booking.
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Billing Information */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-center space-x-2 mb-6">
                <Mail className="h-6 w-6 text-teal-600" />
                <h2 className="text-2xl font-bold text-gray-900">Billing Information</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={billingData.fullName}
                    onChange={handleBillingChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={billingData.email}
                    onChange={handleBillingChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={billingData.phone}
                    onChange={handleBillingChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={billingData.address}
                    onChange={handleBillingChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="123 Main Street"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={billingData.city}
                      onChange={handleBillingChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="New York"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={billingData.state}
                      onChange={handleBillingChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="NY"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={billingData.zipCode}
                      onChange={handleBillingChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="10001"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={billingData.country}
                      onChange={handleBillingChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="United States"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-center space-x-2 mb-6">
                <CreditCard className="h-6 w-6 text-teal-600" />
                <h2 className="text-2xl font-bold text-gray-900">Payment Details</h2>
              </div>

              <div className="flex items-center justify-center space-x-2 text-teal-600 mb-6 p-3 bg-teal-50 rounded-lg">
                <div className="w-5 h-5 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-medium text-sm">Your payment information is safe with us</span>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-4 flex-wrap">
                  <div className="text-blue-600 font-bold text-lg">VISA</div>
                  <div className="flex space-x-1">
                    <div className="w-6 h-6 bg-red-500 rounded-full opacity-80"></div>
                    <div className="w-6 h-6 bg-yellow-500 rounded-full opacity-80 -ml-2"></div>
                  </div>
                  <div className="text-blue-700 font-bold text-sm border-2 border-blue-700 px-2 py-1">UnionPay</div>
                  <div className="text-blue-600 font-bold text-lg">AMEX</div>
                  <div className="flex space-x-1">
                    <div className="w-6 h-6 bg-red-600 rounded-sm"></div>
                    <div className="w-6 h-6 bg-blue-600 rounded-sm -ml-2"></div>
                    <div className="w-6 h-6 bg-green-600 rounded-sm -ml-2"></div>
                  </div>
                  <div className="flex items-center text-gray-600 ml-auto">
                    <span className="text-sm">Full List</span>
                    <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="Card number"
                    className="w-full px-4 py-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    name="cardholderName"
                    value={formData.cardholderName}
                    onChange={handleInputChange}
                    placeholder="Cardholder name"
                    className="w-full px-4 py-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                    className="w-full px-4 py-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-teal-500">
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      placeholder="CVV"
                      className="w-full px-4 py-4 text-base border-none rounded-lg focus:outline-none"
                    />
                    <button
                      type="button"
                      className="px-4 text-gray-400 hover:text-gray-600"
                    >
                      <HelpCircle className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg px-4 py-4 flex items-center justify-between border border-gray-200">
                  <span className="text-base text-gray-900">Save card details</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="saveCard"
                      checked={formData.saveCard}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                  </label>
                </div>

                <button
                  onClick={handleSubmit}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-colors mt-6"
                >
                  Save & Confirm Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;