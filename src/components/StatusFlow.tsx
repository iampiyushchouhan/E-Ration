"use client";
import { useState } from "react";
import QRTicket from "./QRTicket";
import { ArrowLeft, Search, Loader2 } from "lucide-react";
import { t } from "@/lib/translations";

interface StatusFlowProps { lang: 'EN'|'HI'; onCancel: () => void; }

export default function StatusFlow({ lang, onCancel }: StatusFlowProps) {
  const stext = t[lang].status;
  const ctext = t[lang].common;
  const [customerId, setCustomerId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [booking, setBooking] = useState<any>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId) return;
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch(`/api/booking/${customerId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch booking');
      setBooking(data.booking);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch(`/api/booking/${booking.customerId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to cancel booking');
      setBooking(null);
      alert('Your booking was successfully cancelled!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-slate-200">
      <button onClick={onCancel} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium transition mb-8 w-max px-4 py-2 hover:bg-slate-50 rounded-lg -ml-4">
         <ArrowLeft size={18} /> Back to Home
      </button>

      {!booking ? (
        <div className="max-w-md mx-auto py-8">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold mb-3 tracking-tight">Booking Status</h2>
            <p className="text-slate-500">Enter your Customer ID to view your ration collection ticket and QR code.</p>
          </div>
          
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
             <input 
               type="text" 
               maxLength={5}
               value={customerId} 
               onChange={(e) => setCustomerId(e.target.value.replace(/\D/g, '').slice(0, 5))} 
               placeholder="e.g. 12001" 
               className="flex-1 px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition text-lg" 
               required 
             />
             <button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl font-semibold transition flex items-center justify-center min-w-[140px] shadow-sm hover:shadow-md">
                {loading ? <Loader2 className="animate-spin" size={24} /> : <div className="flex items-center gap-2"><Search size={20} /> Find</div>}
             </button>
          </form>
          {error && <p className="text-red-600 mt-6 text-center bg-red-50 p-4 rounded-xl border border-red-100 font-medium">{error}</p>}
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
          <QRTicket booking={booking} />
          
          {error && <p className="text-red-600 mt-6 text-center bg-red-50 p-4 rounded-xl border border-red-100 font-medium">{error}</p>}

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button disabled={loading} onClick={handleCancelBooking} className="text-red-600 hover:text-red-700 hover:bg-red-50 px-6 py-3 rounded-xl font-medium transition flex items-center gap-2">
              {loading ? <Loader2 className="animate-spin" size={18} /> : null} Cancel Booking
            </button>
            <button disabled={loading} onClick={() => setBooking(null)} className="text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-6 py-3 rounded-xl font-medium transition">
              Search another Customer ID
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
