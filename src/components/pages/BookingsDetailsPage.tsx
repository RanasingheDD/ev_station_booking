import React, { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import { fetchUserBookings, cancelBooking} from '../../services/booking_service';
import { Loader, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRef } from "react";


const BookingsPage: React.FC = () => {
  useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
const fetchedRef = useRef(false);

  useEffect(() => {
      if (fetchedRef.current) return;
  fetchedRef.current = true;
  
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchUserBookings();
        setBookings(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    setCancelling(id);
    try {
      await cancelBooking(id);
      setBookings((prev) => prev.map(b => b.id === id ? { ...b, status: 'CANCELLED' } : b));
    } catch (err) {
      console.error(err);
      alert('Failed to cancel booking');
    } finally {
      setCancelling(null);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 bg-[#0B0F19] text-gray-200 p-8 ml-64 overflow-y-auto flex items-center justify-center min-h-screen">
        <Loader className="animate-spin w-12 h-12 text-green-400" />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#0B0F19] text-gray-200 p-8 ml-64 overflow-y-auto min-h-screen">
      <div className="mb-6">
        <h2 className="text-sm text-gray-400">Pages / Bookings</h2>
        <h1 className="text-2xl font-bold text-white">My Bookings</h1>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500 p-3 rounded mb-4">{error}</div>}

      {bookings.length === 0 ? (
        <div className="bg-[#101726] p-8 rounded-lg text-center text-gray-400">You have no bookings yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookings.map((b: any) => (
            <motion.div key={b.id} className="bg-[#161B2E] p-6 rounded-xl border border-transparent hover:border-green-400 transition">
              <div className="flex justify-between items-start gap-4 mb-3">
                <div>
                  <h3 className="text-white font-semibold text-lg">{b.station?.name || b.stationName || b.stationId}</h3>
                  <p className="text-gray-400 text-sm">Charger: {b.charger?.displayName || b.charger?.name || b.chargerId}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${b.status === 'CANCELLED' ? 'text-red-400' : b.status === 'COMPLETED' ? 'text-gray-400' : 'text-green-400'}`}>{b.status}</p>
                  <p className="text-xs mt-1">
                    {b.paymentId ? <span className="text-green-300">Paid</span> : <span className="text-yellow-300">Payment Pending</span>}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-gray-400 text-sm">Start</p>
                  <p className="text-white">{new Date(b.startAt || b.startTime).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">End</p>
                  <p className="text-white">{new Date(b.endAt || b.endTime).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Amount</p>
                  <p className="text-white">{b.finalCost ?? b.priceLKR ?? b.estimatedCost ?? b.pointsPaid ?? '-'}</p>
                </div>
              </div>

              <div className="flex gap-3">
                {b.status !== 'CANCELLED' && b.status !== 'COMPLETED' && (
                  <button onClick={() => handleCancel(b.id)} disabled={cancelling === b.id} className="flex-1 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-semibold">
                    {cancelling === b.id ? 'Cancelling...' : 'Cancel Booking'}
                  </button>
                )}

                <button onClick={() => setSelectedBooking(b)} className="py-2 px-4 rounded bg-gray-700 hover:bg-gray-600 text-white">
                  Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selectedBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedBooking(null)}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#161B2E] border border-green-400/30 rounded-xl p-8 max-w-2xl w-full"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Booking Details</h2>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-gray-400 text-sm">Station</p>
                  <p className="text-white text-lg font-semibold">{selectedBooking.station?.name || selectedBooking.stationName || selectedBooking.stationId}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Status</p>
                  <p className={`text-lg font-semibold ${
                    selectedBooking.status === 'CANCELLED' ? 'text-red-400' : 
                    selectedBooking.status === 'COMPLETED' ? 'text-gray-400' : 
                    'text-green-400'
                  }`}>
                    {selectedBooking.status}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Charger</p>
                  <p className="text-white text-lg font-semibold">{selectedBooking.charger?.displayName || selectedBooking.charger?.name || selectedBooking.chargerId}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Booking ID</p>
                  <p className="text-gray-300 text-sm font-mono">{selectedBooking.id}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Start Time</p>
                  <p className="text-white">
                    {new Date(selectedBooking.startAt || selectedBooking.startTime).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">End Time</p>
                  <p className="text-white">
                    {new Date(selectedBooking.endAt || selectedBooking.endTime).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Amount (LKR)</p>
                  <p className="text-white text-lg font-semibold">{selectedBooking.finalCost ?? selectedBooking.priceLKR ?? selectedBooking.estimatedCost ?? selectedBooking.pointsPaid ?? '-'}</p>
                </div>
                {selectedBooking.priceLKR && (
                  <div>
                    <p className="text-gray-400 text-sm">Price (LKR)</p>
                    <p className="text-white text-lg font-semibold">{selectedBooking.priceLKR}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="px-6 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-semibold transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookingsPage;
