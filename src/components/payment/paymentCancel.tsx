import React from 'react';
import { XCircle, ArrowLeft, RefreshCw, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const PaymentCancel: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-white flex items-center justify-center p-5 ml-64">
      <div className="max-w-md w-full bg-[#0E1424] rounded-2xl border border-[#1A2236] p-8 text-center shadow-2xl">
        {/* ICON */}
        <div className="flex justify-center mb-6">
          <div className="bg-red-500/10 p-4 rounded-full border border-red-500/20">
            <XCircle className="w-16 h-16 text-red-500" />
          </div>
        </div>

        {/* TEXT */}
        <h1 className="text-2xl font-bold text-white mb-2">Payment Cancelled</h1>
        <p className="text-gray-400 mb-8">
          The transaction was not completed. You haven't been charged. Would you like to try again or change your details?
        </p>

        {/* HELP BOX */}
        <div className="bg-[#0B0F19] border border-[#1A2236] rounded-xl p-4 mb-8 text-left flex gap-3 items-start">
          <MessageSquare className="text-gray-500 shrink-0" size={18} />
          <p className="text-xs text-gray-400 leading-relaxed">
            If you experienced a technical issue with your card, please check your balance or contact your bank.
          </p>
        </div>

        {/* ACTIONS */}
        <div className="space-y-3">
          <Link 
            to="/stations" 
            className="w-full bg-white text-black py-4 rounded-xl font-bold hover:bg-gray-200 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <RefreshCw size={20} /> Return to Booking
          </Link>
          
          <Link 
            to="/" 
            className="w-full border border-[#1A2236] text-gray-300 py-4 rounded-xl font-bold hover:bg-[#1A2236] transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft size={20} /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;