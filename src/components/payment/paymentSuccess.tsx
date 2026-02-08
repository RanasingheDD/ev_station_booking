import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, LayoutDashboard, FileText } from 'lucide-react';

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get('id');
  console.log("Query params:", Object.fromEntries(searchParams.entries()));



  return (
    <div className="min-h-screen bg-[#0B0F19] text-white flex items-center justify-center p-5 ml-64">
      <div className="max-w-md w-full bg-[#0E1424] rounded-2xl border border-[#1A2236] p-8 text-center shadow-2xl">
        {/* ICON */}
        <div className="flex justify-center mb-6">
          <div className="bg-green-500/10 p-4 rounded-full border border-green-500/20">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
        </div>

        {/* TEXT */}
        <h1 className="text-2xl font-bold text-white mb-2">Payment Successful!</h1>
        <p className="text-gray-400 mb-8">
          Your charging session has been scheduled. A confirmation email has been sent.
        </p>

        {/* BOOKING DETAILS CARD */}
        <div className="bg-[#0B0F19] border border-[#1A2236] rounded-xl p-4 mb-8 text-left">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Payment ID</span>
            <FileText size={14} className="text-gray-500" />
          </div>
          <p className="text-green-400 font-mono font-bold tracking-wider">
            {paymentId || "N/A"}
          </p>
        </div>

        {/* ACTIONS */}
        <div className="space-y-3">
          <Link 
            to="/dashboard" 
            className="w-full bg-green-500 text-white py-4 rounded-xl font-bold hover:bg-green-600 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <LayoutDashboard size={20} /> View Dashboard
          </Link>
          
          <Link 
            to="/" 
            className="block w-full text-gray-400 py-3 rounded-xl font-medium hover:text-white transition-colors text-sm"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;