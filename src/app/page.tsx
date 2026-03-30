"use client";
import { useState } from "react";
import BookingFlow from "@/components/BookingFlow";
import StatusFlow from "@/components/StatusFlow";
import { QrCode, ClipboardCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { t } from "@/lib/translations";

export default function Home() {
  const [activeTab, setActiveTab] = useState<'HOME' | 'BOOKING' | 'STATUS'>('HOME');
  const [language, setLanguage] = useState<'EN' | 'HI' | null>(null);

  if (!language) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-stone-900 relative">
        <div className="fixed inset-0 z-[-2] bg-center bg-no-repeat" style={{ backgroundImage: "url('/bg-wheat.jpg')", backgroundSize: 'contain', backgroundColor: '#fcfaf5' }}></div>
        <div className="fixed inset-0 z-[-1] bg-white/10 backdrop-blur-[2px]"></div>
        
        <div className="bg-white/90 backdrop-blur-xl p-10 rounded-3xl shadow-xl border border-white max-w-lg w-full text-center fade-in zoom-in-95">
           <img src="/logo.png" alt="Easy-Ration" className="w-24 h-24 mx-auto mb-6 drop-shadow" />
           <h1 className="text-3xl font-extrabold text-teal-900 mb-2">Easy-Ration</h1>
           <p className="text-slate-500 mb-10 text-lg">Please select your preferred language<br/>कृपया अपनी पसंदीदा भाषा चुनें</p>
           
           <div className="grid grid-cols-2 gap-4">
             <button onClick={() => setLanguage('EN')} className="flex flex-col items-center justify-center gap-3 bg-white hover:bg-teal-50 border-2 border-slate-200 hover:border-teal-500 rounded-2xl p-6 transition group shadow-sm">
                <span className="text-4xl font-black text-slate-300 group-hover:text-teal-400 transition">A</span>
                <span className="font-bold text-slate-700">English</span>
             </button>
             <button onClick={() => setLanguage('HI')} className="flex flex-col items-center justify-center gap-3 bg-white hover:bg-teal-50 border-2 border-slate-200 hover:border-teal-500 rounded-2xl p-6 transition group shadow-sm">
                <span className="text-4xl font-black text-slate-300 group-hover:text-teal-400 transition">अ</span>
                <span className="font-bold text-slate-700">हिंदी</span>
             </button>
           </div>
        </div>
      </div>
    );
  }

  const getText = t[language];

  return (
    <div className="min-h-screen text-stone-900 pb-12 font-sans selection:bg-teal-100 relative">
      <div
        className="fixed inset-0 z-[-2] bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/bg-wheat.jpg')", backgroundSize: 'contain', backgroundColor: '#fcfaf5' }}
      ></div>
      <div className="fixed inset-0 z-[-1] bg-white/10 backdrop-blur-[2px]"></div>

      <header className="bg-white/70 backdrop-blur-lg border-b border-white/40 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer group hover:opacity-90 transition"
            onClick={() => setActiveTab('HOME')}
          >
            <img src="/logo.png" alt="Easy-Ration Logo" className="w-11 h-11 object-contain drop-shadow-sm" />
            <h1 className="text-xl font-extrabold tracking-tight text-teal-900 drop-shadow-sm">Easy-Ration</h1>
          </div>
          <button onClick={() => setLanguage(null)} className="text-sm font-medium text-slate-500 hover:text-teal-600 border border-slate-200 px-3 py-1.5 rounded-lg bg-white/50">{getText.common.languageName} ⟳</button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <AnimatePresence mode="wait">
          {activeTab === 'HOME' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="grid md:grid-cols-2 gap-8 mt-12"
            >
              {/* Option A */}
              <button
                onClick={() => setActiveTab('BOOKING')}
                className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 hover:border-teal-300 transition-all text-left flex flex-col gap-4 aspect-square md:aspect-auto md:h-80"
              >
                <div className="bg-teal-50 text-teal-600 p-4 rounded-2xl w-max">
                  <ClipboardCheck size={36} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">{getText.home.bookTitle}</h2>
                  <p className="text-slate-500 leading-relaxed">
                    {getText.home.bookDesc}
                  </p>
                </div>
              </button>

              {/* Option B */}
              <button
                onClick={() => setActiveTab('STATUS')}
                className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 hover:border-emerald-300 transition-all text-left flex flex-col gap-4 aspect-square md:aspect-auto md:h-80"
              >
                <div className="bg-emerald-50 text-emerald-600 p-4 rounded-2xl w-max">
                  <QrCode size={36} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">{getText.home.statusTitle}</h2>
                  <p className="text-slate-500 leading-relaxed">
                    {getText.home.statusDesc}
                  </p>
                </div>
              </button>
            </motion.div>
          )}

          {activeTab === 'BOOKING' && (
            <motion.div key="booking" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }}>
              <BookingFlow lang={language} onCancel={() => setActiveTab('HOME')} />
            </motion.div>
          )}

          {activeTab === 'STATUS' && (
            <motion.div key="status" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }}>
              <StatusFlow lang={language} onCancel={() => setActiveTab('HOME')} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
