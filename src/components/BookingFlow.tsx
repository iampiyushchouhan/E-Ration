"use client";
import { useState, useEffect } from "react";
import QRTicket from "./QRTicket";
import FaceScanner from "./FaceScanner";
import { format, addDays } from "date-fns";
import { ArrowLeft, ArrowRight, UserCheck, Camera, Loader2, Volume2, VolumeX } from "lucide-react";
import { t } from "@/lib/translations";

type Step = 'ID' | 'MEMBER' | 'SLOT' | 'KYC' | 'SUCCESS';

interface BookingFlowProps { lang: 'EN' | 'HI'; onCancel: () => void; }

export default function BookingFlow({ lang, onCancel }: BookingFlowProps) {
  const [step, setStep] = useState<Step>('ID');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Voice State
  const [isMuted, setIsMuted] = useState(false);

  // Data State
  const [customerId, setCustomerId] = useState('');
  const [customerData, setCustomerData] = useState<any>(null);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [slotsData, setSlotsData] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [bookingResult, setBookingResult] = useState<any>(null);

  // AI Voice Logic
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel(); // Stop overlapping voices
    if (isMuted) return;

    const scripts = {
      EN: {
        ID: "Please enter your 5 digit consumer number.",
        MEMBER: "Please select a family member.",
        SLOT: "Please select a date and an available time slot.",
        KYC: "Please keep your face in the circle and blink your eyes.",
        SUCCESS: "Booking successful! Your ticket is generated."
      },
      HI: {
        ID: "कृपया अपना पांच अंकों का उपभोक्ता नंबर दर्ज करें।",
        MEMBER: "कृपया परिवार के किसी सदस्य का चयन करें।",
        SLOT: "कृपया एक तारीख और उपलब्ध समय स्लॉट चुनें।",
        KYC: "कृपया अपना चेहरा गोले में रखें और अपनी आँखें झपकाएं।",
        SUCCESS: "बुकिंग सफल रही! आपका टिकट जनरेट हो गया है।"
      }
    };

    const text = scripts[lang][step];
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'HI' ? 'hi-IN' : 'en-US';

    // Optional: map specific OS voices if available
    const voices = window.speechSynthesis.getVoices();
    const targetVoice = voices.find(v => v.lang.includes(lang === 'HI' ? 'hi' : 'en'));
    if (targetVoice) utterance.voice = targetVoice;

    window.speechSynthesis.speak(utterance);

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [step, isMuted, lang]);

  const btext = t[lang].booking;
  const ctext = t[lang].common;

  const fetchCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId) return;
    setLoading(true); setError('');
    try {
      // 1. Check if they already have an active booking
      const checkRes = await fetch(`/api/booking/${customerId}`);
      if (checkRes.ok) {
        throw new Error(btext.activeBookingError);
      }

      // 2. Fetch Customer Details
      const res = await fetch(`/api/customer/${customerId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCustomerData(data.customer);
      setStep('MEMBER');
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  const loadSlots = async (date: string) => {
    setSelectedDate(date);
    setLoading(true); setError('');
    try {
      const res = await fetch(`/api/slots?date=${date}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSlotsData(data.slots);
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  const handleMemberSelect = (member: any) => {
    setSelectedMember(member);
    loadSlots(selectedDate);
    setStep('SLOT');
  };

  const confirmBooking = async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          memberName: selectedMember.name,
          date: selectedDate,
          timeSlot: selectedSlot
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setBookingResult(data.booking);
      setStep('SUCCESS');
    } catch (err: any) {
      setError(err.message);
      setStep('SLOT'); // Send back if error
    } finally {
      setLoading(false);
    }
  };

  const next7Days = Array.from({ length: 4 }).map((_, i) => format(addDays(new Date(), i), 'yyyy-MM-dd'));

  return (
    <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-slate-200">
      {step !== 'SUCCESS' && (
        <div className="flex items-center justify-between mb-8">
          <button onClick={onCancel} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium transition px-4 py-2 hover:bg-slate-50 rounded-lg -ml-4">
            <ArrowLeft size={18} /> {ctext.backHome}
          </button>

          <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-200">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-1.5 transition rounded-lg ${isMuted ? 'text-red-500 hover:bg-red-50' : 'text-teal-600 hover:bg-teal-50'}`}
              title={isMuted ? btext.voiceMuted : btext.voiceUnmuted}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          </div>
        </div>
      )}

      {step === 'ID' && (
        <div className="max-w-md mx-auto py-8 fade-in animate-in">
          <h2 className="text-3xl font-bold mb-3 tracking-tight">{btext.enterIdTitle}</h2>
          <p className="text-slate-500 mb-8">{btext.enterIdDesc}</p>
          <form onSubmit={fetchCustomer} className="flex gap-3 flex-col sm:flex-row">
            <input type="text" maxLength={5} value={customerId} onChange={(e) => setCustomerId(e.target.value.replace(/\D/g, '').slice(0, 5))} placeholder={btext.idPlaceholder} className="flex-1 px-5 py-4 bg-stone-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition text-lg" required />
            <button type="submit" disabled={loading} className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-2xl font-semibold transition flex items-center justify-center min-w-[140px] shadow-sm">
              {loading ? <Loader2 className="animate-spin" size={24} /> : <div className="flex items-center gap-2">{ctext.next} <ArrowRight size={20} /></div>}
            </button>
          </form>
          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        </div>
      )}

      {step === 'MEMBER' && (
        <div className="fade-in animate-in slide-in-from-right-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold">{btext.selectMemberTitle}</h2>
            <p className="text-slate-500">{btext.whoCollecting}</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {customerData?.members.map((member: any, i: number) => (
              <button key={i} onClick={() => handleMemberSelect(member)} className="flex items-center gap-4 p-5 rounded-2xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50 transition text-left group shadow-sm hover:shadow">
                <div className="bg-slate-100 p-3 rounded-full group-hover:bg-teal-100 group-hover:text-teal-700 transition"><UserCheck size={24} /></div>
                <div>
                  <p className="font-bold text-lg text-slate-800">{member.name}</p>
                  <p className="text-slate-500 text-sm">{btext.ageLabel} {member.age}</p>
                </div>
              </button>
            ))}
          </div>
          <button onClick={() => setStep('ID')} className="mt-8 text-slate-500 hover:text-slate-900 underline block text-center w-full">{btext.changeId}</button>
        </div>
      )}

      {step === 'SLOT' && (
        <div className="fade-in animate-in slide-in-from-right-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold">{btext.selectSlotTitle}</h2>
            <p className="text-slate-500">{btext.bookingFor} <strong className="text-slate-800">{selectedMember.name}</strong></p>
          </div>

          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {next7Days.map((date) => (
              <button key={date} onClick={() => loadSlots(date)} className={`flex-shrink-0 px-6 py-3 rounded-xl border font-medium transition ${selectedDate === date ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50'}`}>
                {format(new Date(date), 'MMM do')}
              </button>
            ))}
          </div>

          {loading ? (<div className="flex justify-center py-12"><Loader2 className="animate-spin text-slate-400" size={32} /></div>) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {slotsData.map((slot, idx) => (
                <button key={idx} disabled={slot.isFull} onClick={() => setSelectedSlot(slot.timeSlot)} className={`p-4 rounded-xl border text-left transition ${selectedSlot === slot.timeSlot ? 'border-teal-500 ring-4 ring-teal-500/20 bg-teal-50 shadow-sm transform -translate-y-1' : slot.isFull ? 'bg-slate-100 border-slate-200 opacity-50 cursor-not-allowed' : 'bg-white hover:border-slate-300 shadow-sm'}`}>
                  <p className="font-bold mb-3 text-sm text-slate-800">{slot.timeSlot}</p>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden mb-2">
                    <div className={`h-full transition-all duration-500 ${slot.isFull ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${(slot.booked / slot.maxCapacity) * 100}%` }}></div>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">{slot.booked}/{slot.maxCapacity} {btext.bookedSuffix} {slot.isFull && <span className="text-red-500 ml-1">{btext.fullSuffix}</span>}</p>
                </button>
              ))}
            </div>
          )}

          {error && <p className="text-red-600 mb-6 bg-red-50 p-4 rounded-xl font-medium border border-red-100">{error}</p>}

          <div className="flex justify-between items-center pt-6 border-t border-slate-100">
            <button onClick={() => setStep('MEMBER')} className="text-slate-500 font-medium px-4 py-2 hover:bg-slate-50 rounded-lg">{ctext.back}</button>
            <button disabled={!selectedSlot || loading} onClick={() => setStep('KYC')} className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-2xl font-semibold transition disabled:opacity-50 flex items-center gap-2 shadow-sm hover:shadow-md">
              {btext.verifyFace} <Camera size={20} />
            </button>
          </div>
        </div>
      )}

      {step === 'KYC' && (
        <div className="fade-in animate-in zoom-in-95">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800">{btext.faceAuthTitle}</h2>
            <p className="text-slate-500">{btext.faceAuthDesc}</p>
          </div>

          <FaceScanner lang={lang} expectedName={selectedMember.name} onSuccess={confirmBooking} />
        </div>
      )}

      {step === 'SUCCESS' && bookingResult && (
        <div className="fade-in animate-in zoom-in-95 py-6">
          <QRTicket booking={bookingResult} />
          <div className="mt-10 text-center">
            <button onClick={onCancel} className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-semibold hover:bg-slate-800 transition shadow-md hover:shadow-lg">{btext.returnHome}</button>
          </div>
        </div>
      )}
    </div>
  );
}
