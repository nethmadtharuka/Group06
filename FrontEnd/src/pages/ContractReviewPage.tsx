import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeftIcon, SaveIcon, CreditCardIcon } from 'lucide-react';
import { Header } from '../components/Header';
import jsPDF from 'jspdf';

interface ContractData {
  eventName: string;
  eventId: string;
  eventDate: string;
  venue: string;
  clientName: string;
  companyName: string;
  contactEmail: string;
  phoneNumber: string;
  address: string;
  totalFee: string;
  depositAmount: string;
  paymentDeadline: string;
  customClauses: string;
  vendorId?: string;
  packageId?: string;
  selectedClauses?: {
    cancellation: boolean;
    liability: boolean;
    confidentiality: boolean;
  };
  contractId?: string;
}

export const ContractReviewPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [contractData, setContractData] = useState<ContractData | null>(null);
  const [fromDashboard, setFromDashboard] = useState(false);

  useEffect(() => {
    // Get contract data from navigation state or localStorage
    const state = location.state as any;
    if (state?.contractData) {
      setContractData(state.contractData);
      setFromDashboard(state.fromDashboard || false);
    } else {
      // Try to get from localStorage as backup
      const stored = localStorage.getItem('pendingContract');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setContractData({
            ...parsed.formData,
            vendorId: parsed.vendorId,
            packageId: parsed.packageId,
            selectedClauses: parsed.selectedClauses
          });
        } catch (error) {
          if (import.meta.env.DEV) {
            console.error('Error parsing stored contract:', error);
          }
        }
      }
    }
  }, [location.state]);

  // Generate contract template
  const generateContractTemplate = () => {
    if (!contractData) return null;

    const formatDate = (dateStr: string) => {
      if (!dateStr) return 'Not specified';
      try {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      } catch {
        return dateStr;
      }
    };

    const formatCurrency = (amount: string) => {
      if (!amount) return 'Rs. 0.00';
      const num = parseFloat(amount);
      return 'Rs. ' + new Intl.NumberFormat('en-LK', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(num);
    };

    const calculateRemainingBalance = () => {
      const total = parseFloat(contractData.totalFee || '0');
      const deposit = parseFloat(contractData.depositAmount || '0');
      return total - deposit;
    };

    const clauses = contractData.selectedClauses || {
      cancellation: false,
      liability: false,
      confidentiality: false
    };

    return {
      eventName: contractData.eventName || 'Event',
      clientName: contractData.clientName || 'Client',
      companyName: contractData.companyName || 'Company',
      contactEmail: contractData.contactEmail || 'Email not provided',
      phoneNumber: contractData.phoneNumber || 'Phone not provided',
      address: contractData.address || 'Address not provided',
      eventDate: formatDate(contractData.eventDate),
      venue: contractData.venue || 'Venue not specified',
      totalFee: formatCurrency(contractData.totalFee),
      depositAmount: formatCurrency(contractData.depositAmount),
      remainingBalance: formatCurrency(calculateRemainingBalance().toString()),
      paymentDeadline: formatDate(contractData.paymentDeadline),
      customClauses: contractData.customClauses || '',
      clauses
    };
  };

  const contract = generateContractTemplate();

  const handleExportPDF = () => {
    if (!contract || !contractData) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;
    let yPosition = margin;

    // Helper function to add text with word wrapping
    const addWrappedText = (text: string, fontSize: number, isBold: boolean = false, color: number[] = [0, 0, 0]) => {
      doc.setFontSize(fontSize);
      doc.setTextColor(color[0], color[1], color[2]);
      if (isBold) {
        doc.setFont(undefined, 'bold');
      } else {
        doc.setFont(undefined, 'normal');
      }
      
      const lines = doc.splitTextToSize(text, maxWidth);
      lines.forEach((line: string) => {
        if (yPosition > doc.internal.pageSize.getHeight() - 30) {
          doc.addPage();
          yPosition = margin;
        }
        doc.text(line, margin, yPosition);
        yPosition += fontSize * 0.5 + 2;
      });
      yPosition += 3;
    };

    // Title
    addWrappedText('EVENT CONTRACT AGREEMENT', 18, true, [138, 92, 246]);
    yPosition += 5;

    // Date
    addWrappedText(`Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 10);
    yPosition += 5;

    // 1. Parties
    addWrappedText('1. Parties', 14, true);
    addWrappedText(`This Contract is entered into between the Client (${contract.clientName}) and the Event Planner.`, 10);
    addWrappedText(`Client Details:`, 10, true);
    addWrappedText(`- Name: ${contract.clientName}`, 10);
    addWrappedText(`- Company: ${contract.companyName}`, 10);
    addWrappedText(`- Email: ${contract.contactEmail}`, 10);
    addWrappedText(`- Phone: ${contract.phoneNumber}`, 10);
    addWrappedText(`- Address: ${contract.address}`, 10);
    yPosition += 3;

    // 2. Event Details
    addWrappedText('2. Event Details', 14, true);
    addWrappedText(`- Event Name: ${contract.eventName}`, 10);
    addWrappedText(`- Date: ${contract.eventDate}`, 10);
    addWrappedText(`- Venue: ${contract.venue}`, 10);
    addWrappedText(`- Client Contact: ${contract.clientName} (${contract.contactEmail})${contract.phoneNumber ? ` - ${contract.phoneNumber}` : ''}`, 10);
    yPosition += 3;

    // 3. Scope of Services
    addWrappedText('3. Scope of Services', 14, true);
    addWrappedText(`The Planner agrees to provide comprehensive event management services for ${contract.eventName}, including but not limited to venue coordination, vendor management, and on-site logistics.`, 10);
    yPosition += 3;

    // 4. Payment Terms
    addWrappedText('4. Payment Terms', 14, true);
    addWrappedText(`The total fee for the services rendered under this Contract is ${contract.totalFee}. The payment schedule is as follows:`, 10);
    addWrappedText(`- Deposit: A non-refundable deposit of ${contract.depositAmount} is due upon signing this contract.`, 10);
    addWrappedText(`- Final Balance: The remaining balance of ${contract.remainingBalance} is due${contract.paymentDeadline && contract.paymentDeadline !== 'Not specified' ? ` by ${contract.paymentDeadline}` : ' as specified in the payment schedule'}.`, 10);
    yPosition += 3;

    // 5. Standard Clauses
    addWrappedText('5. Standard Clauses', 14, true);
    if (contract.clauses.cancellation) {
      addWrappedText(`- Cancellation Policy: The client may cancel this contract with written notice. The deposit is non-refundable. Cancellations within 30 days of the event date will require payment of the full contract amount.`, 10);
    }
    if (contract.clauses.liability) {
      addWrappedText(`- Liability Insurance: Both parties agree to maintain appropriate liability insurance for the duration of the event.`, 10);
    }
    if (contract.clauses.confidentiality) {
      addWrappedText(`- Confidentiality: Both parties agree to maintain confidentiality regarding all proprietary information shared during the planning and execution of this event.`, 10);
    }
    if (!contract.clauses.cancellation && !contract.clauses.liability && !contract.clauses.confidentiality) {
      addWrappedText('No standard clauses selected.', 10);
    }
    yPosition += 3;

    // 6. Custom Clauses
    if (contract.customClauses) {
      addWrappedText('6. Custom Clauses', 14, true);
      addWrappedText(contract.customClauses, 10);
      yPosition += 3;
    }

    // 7. Agreement
    addWrappedText('7. Agreement', 14, true);
    addWrappedText('By proceeding, the Client agrees to the terms and conditions outlined in this contract. This document constitutes the entire agreement between the Planner and the Client.', 10);
    yPosition += 10;

    // Signature lines
    addWrappedText('_________________________', 10);
    addWrappedText('Client Signature', 10);
    yPosition += 10;
    addWrappedText('_________________________', 10);
    addWrappedText('Planner Signature', 10);

    // Generate filename
    const filename = `Contract_${contract.eventName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    
    // Save PDF
    doc.save(filename);
  };

  if (!contract) {
    return (
      <div className="flex flex-col min-h-screen bg-transparent w-full text-white relative">
        <Header />
        <main className="p-8 max-w-5xl mx-auto flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-400 mb-4">No contract data found.</p>
            <Link to="/contract/new" className="text-purple-500 hover:text-purple-400">
              Create a new contract
            </Link>
          </div>
        </main>
      </div>
    );
  }
  return <motion.div initial={{
    opacity: 0
  }} animate={{
    opacity: 1
  }} exit={{
    opacity: 0
  }} className="flex flex-col min-h-screen bg-transparent w-full text-white">
      <Header />
      <main className="p-8 max-w-5xl mx-auto flex-1">
        <div className="text-center mb-8 contract-review-header">
          <p className="text-purple-500 font-semibold mb-2 contract-review-subtitle">
            REVIEW YOUR CONTRACT
          </p>
          <h1 
            className="text-4xl font-bold mb-4 contract-review-title"
            style={{ fontFamily: '"Poppins", sans-serif' }}
          >
            <span className="inline-block contract-review-title-word">{contract.eventName}</span>{' '}
            <span className="inline-block contract-review-title-word">Event</span>{' '}
            <span className="inline-block contract-review-title-word">Contract</span>
          </h1>
          <p className="text-gray-400 contract-review-description">
            <span className="inline-block contract-review-description-phrase">Please review the terms and conditions</span>{' '}
            <span className="inline-block contract-review-description-phrase">of your event contract below.</span>{' '}
            <span className="inline-block contract-review-description-phrase">Once you're satisfied, proceed to payment</span>{' '}
            <span className="inline-block contract-review-description-phrase">to finalize your booking.</span>
          </p>
        </div>
        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-8 mb-8 contract-review-content">
          <div className="space-y-6 text-gray-300">
            <div className="contract-review-section">
              <h3 className="text-white font-bold mb-2 contract-review-section-title">1. Parties</h3>
              <p>
                This Event Management Contract ("Contract") is entered into by
                and between{' '}
                <span className="text-white font-medium">EventCraft Inc.</span>{' '}
                ("Planner") and{' '}
                <span className="text-white font-medium">{contract.companyName || contract.clientName}</span>{' '}
                ("Client"), effective as of {new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}.
              </p>
            </div>
            <div className="contract-review-section">
              <h3 className="text-white font-bold mb-2 contract-review-section-title">2. Event Details</h3>
              <ul className="list-disc list-inside space-y-1 ml-4 contract-review-list">
                <li className="contract-review-list-item">
                  <span className="text-white font-medium">Event Name:</span>{' '}
                  {contract.eventName}
                </li>
                <li className="contract-review-list-item">
                  <span className="text-white font-medium">Date:</span>{' '}
                  {contract.eventDate}
                </li>
                <li className="contract-review-list-item">
                  <span className="text-white font-medium">Venue:</span>{' '}
                  {contract.venue}
                </li>
                <li className="contract-review-list-item">
                  <span className="text-white font-medium">Client Contact:</span>{' '}
                  {contract.clientName} ({contract.contactEmail})
                  {contract.phoneNumber && ` - ${contract.phoneNumber}`}
                </li>
                {contract.address && (
                  <li className="contract-review-list-item">
                    <span className="text-white font-medium">Client Address:</span>{' '}
                    {contract.address}
                  </li>
                )}
              </ul>
            </div>
            <div className="contract-review-section">
              <h3 className="text-white font-bold mb-2 contract-review-section-title">
                3. Scope of Services
              </h3>
              <p>
                The Planner agrees to provide comprehensive event management
                services for {contract.eventName}, including but not limited to
                venue coordination, vendor management, and on-site logistics.
              </p>
            </div>
            <div className="contract-review-section">
              <h3 className="text-white font-bold mb-2 contract-review-section-title">4. Payment Terms</h3>
              <p className="mb-2 contract-review-paragraph">
                The total fee for the services rendered under this Contract is{' '}
                <span className="text-white font-bold contract-review-highlight">{contract.totalFee}</span>. The
                payment schedule is as follows:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 contract-review-list">
                <li className="contract-review-list-item">
                  <span className="text-white font-medium">Deposit:</span> A
                  non-refundable deposit of{' '}
                  <span className="text-white font-bold contract-review-highlight">{contract.depositAmount}</span> is due
                  upon signing this contract.
                </li>
                <li className="contract-review-list-item">
                  <span className="text-white font-medium">Final Balance:</span>{' '}
                  The remaining balance of{' '}
                  <span className="text-white font-bold contract-review-highlight">{contract.remainingBalance}</span> is due
                  {contract.paymentDeadline && contract.paymentDeadline !== 'Not specified' ? (
                    <> by <span className="text-white font-bold contract-review-highlight">{contract.paymentDeadline}</span>.</>
                  ) : (
                    ' as specified in the payment schedule.'
                  )}
                </li>
              </ul>
            </div>
            <div className="contract-review-section">
              <h3 className="text-white font-bold mb-2 contract-review-section-title">5. Standard Clauses</h3>
              <ul className="list-disc list-inside space-y-2 ml-4 contract-review-list">
                {contract.clauses.cancellation && (
                  <li className="contract-review-list-item">
                    <span className="text-white font-medium">
                      Cancellation Policy:
                    </span>{' '}
                    The client may cancel this contract with written notice. The
                    deposit is non-refundable. Cancellations within 30 days of the
                    event date will require payment of the full contract amount.
                  </li>
                )}
                {contract.clauses.liability && (
                  <li className="contract-review-list-item">
                    <span className="text-white font-medium">
                      Liability Insurance:
                    </span>{' '}
                    Both parties agree to maintain appropriate liability insurance
                    for the duration of the event.
                  </li>
                )}
                {contract.clauses.confidentiality && (
                  <li className="contract-review-list-item">
                    <span className="text-white font-medium">
                      Confidentiality:
                    </span>{' '}
                    Both parties agree to maintain confidentiality regarding all
                    proprietary information shared during the planning and execution
                    of this event.
                  </li>
                )}
                {!contract.clauses.cancellation && !contract.clauses.liability && !contract.clauses.confidentiality && (
                  <li className="italic text-gray-500 contract-review-list-item">No standard clauses selected.</li>
                )}
              </ul>
            </div>
            <div className="contract-review-section">
              <h3 className="text-white font-bold mb-2 contract-review-section-title">6. Custom Clauses</h3>
              {contract.customClauses ? (
                <div className="bg-gray-800/50 p-4 rounded-lg contract-review-custom-clauses">
                  <p className="whitespace-pre-line">{contract.customClauses}</p>
                </div>
              ) : (
                <p className="italic text-gray-500">No custom clauses specified.</p>
              )}
            </div>
            <div className="contract-review-section">
              <h3 className="text-white font-bold mb-2 contract-review-section-title">7. Agreement</h3>
              <p>
                By proceeding, the Client agrees to the terms and conditions
                outlined in this contract. This document constitutes the entire
                agreement between the Planner and the Client.
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center space-x-4 contract-review-actions">
          <button onClick={() => navigate(-1)} className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white py-3 px-6 rounded-lg contract-review-back-button">
            <ChevronLeftIcon size={20} />
            <span>Go Back</span>
          </button>
          <button 
            onClick={handleExportPDF}
            className="flex items-center space-x-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500 text-purple-400 py-3 px-6 rounded-lg contract-review-export-button"
          >
            <SaveIcon size={20} />
            <span>Export as PDF</span>
          </button>
          {!fromDashboard && (
            <Link 
              to="/payment" 
              state={{ contractData: contractData }}
              className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg contract-review-pay-button"
            >
              <CreditCardIcon size={20} />
              <span>Proceed to Pay</span>
            </Link>
          )}
        </div>
      </main>
      <style>{`
        /* Header Animations */
        .contract-review-header {
          transition: all 0.3s ease;
        }
        .contract-review-subtitle {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .contract-review-header:hover .contract-review-subtitle {
          transform: translateY(-2px);
          color: #c4b5fd;
        }
        .contract-review-title {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .contract-review-title-word {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: inline-block;
          cursor: default;
        }
        .contract-review-title-word:hover {
          transform: translateY(-4px) scale(1.1) rotate(2deg);
          color: #a78bfa;
          text-shadow: 0 6px 20px rgba(139, 92, 246, 0.4), 0 0 16px rgba(139, 92, 246, 0.3);
        }
        .contract-review-description {
          transition: all 0.3s ease;
        }
        .contract-review-description-phrase {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: inline-block;
          cursor: default;
        }
        .contract-review-description-phrase:hover {
          transform: translateY(-2px) scale(1.05);
          color: #c4b5fd;
          background: rgba(139, 92, 246, 0.1);
          padding: 2px 4px;
          border-radius: 4px;
        }
        
        /* Content Card Animations */
        .contract-review-content {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .contract-review-content:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.2);
          border-color: rgba(139, 92, 246, 0.5);
        }
        
        /* Section Animations */
        .contract-review-section {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .contract-review-section:hover {
          transform: translateX(4px);
        }
        .contract-review-section-title {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .contract-review-section:hover .contract-review-section-title {
          color: #a78bfa;
          transform: translateX(4px);
        }
        .contract-review-paragraph {
          transition: all 0.3s ease;
        }
        .contract-review-section:hover .contract-review-paragraph {
          color: #e9d5ff;
        }
        .contract-review-highlight {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .contract-review-section:hover .contract-review-highlight {
          transform: scale(1.05);
          color: #c4b5fd;
        }
        
        /* List Animations */
        .contract-review-list {
          transition: all 0.3s ease;
        }
        .contract-review-list-item {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .contract-review-list-item:hover {
          transform: translateX(4px);
          color: #e9d5ff;
        }
        .contract-review-list-item:hover .contract-review-highlight {
          transform: scale(1.1);
          color: #a78bfa;
        }
        
        /* Custom Clauses Box */
        .contract-review-custom-clauses {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .contract-review-section:hover .contract-review-custom-clauses {
          transform: translateX(4px);
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);
          border: 1px solid rgba(139, 92, 246, 0.3);
        }
        
        /* Button Animations */
        .contract-review-actions {
          transition: all 0.3s ease;
        }
        .contract-review-back-button {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .contract-review-back-button:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3);
        }
        .contract-review-export-button {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
        }
        .contract-review-export-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.2), transparent);
          transition: left 0.5s ease;
        }
        .contract-review-export-button:hover::before {
          left: 100%;
        }
        .contract-review-export-button:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.3), 0 0 16px rgba(139, 92, 246, 0.2);
          border-color: #a78bfa;
        }
        .contract-review-pay-button {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
        }
        .contract-review-pay-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }
        .contract-review-pay-button:hover::before {
          left: 100%;
        }
        .contract-review-pay-button:hover {
          transform: translateY(-3px) scale(1.05) rotate(1deg);
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.4), 0 0 16px rgba(139, 92, 246, 0.3);
        }
        .contract-review-pay-button:active {
          transform: translateY(-1px) scale(1.02);
        }
      `}</style>
    </motion.div>;
};