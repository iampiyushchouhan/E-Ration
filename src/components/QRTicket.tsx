import { QRCodeSVG } from 'qrcode.react';

interface QRTicketProps {
  booking: any;
}

export default function QRTicket({ booking }: QRTicketProps) {
  const codeValue = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify/${booking.qrToken}`;
  
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-sm mx-auto shadow-sm flex flex-col items-center relative overflow-hidden">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
      
      <h3 className="text-lg font-bold bg-emerald-100 text-emerald-800 px-5 py-1.5 rounded-full mb-6 mt-2 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        Booking Confirmed
      </h3>
      
      <div className="bg-slate-50 p-5 rounded-2xl shadow-inner border border-slate-100 mb-6 group hover:shadow-md transition">
        <QRCodeSVG value={codeValue} size={200} className="group-hover:scale-105 transition duration-500" />
      </div>
      
      <div className="w-full space-y-4 text-slate-700 bg-slate-50 p-6 rounded-2xl">
        <div className="flex justify-between items-center border-b border-slate-200 pb-3">
           <span className="text-slate-500 text-sm">Ref No.</span> 
           <span className="font-mono font-bold text-lg text-slate-900 bg-slate-200 px-2 py-0.5 rounded">{booking.referenceNumber}</span>
        </div>
        <div className="flex justify-between items-center border-b border-slate-200 pb-3">
           <span className="text-slate-500 text-sm">Customer ID</span> 
           <span className="font-semibold">{booking.customerId}</span>
        </div>
        <div className="flex justify-between items-center border-b border-slate-200 pb-3">
           <span className="text-slate-500 text-sm">Member</span> 
           <span className="font-semibold text-slate-900">{booking.memberName}</span>
        </div>
        <div className="flex justify-between items-center border-b border-slate-200 pb-3">
           <span className="text-slate-500 text-sm">Date</span> 
           <span className="font-semibold">{booking.date}</span>
        </div>
        <div className="flex justify-between items-center">
           <span className="text-slate-500 text-sm">Time Slot</span> 
           <span className="font-semibold text-emerald-700">{booking.timeSlot}</span>
        </div>
      </div>
    </div>
  );
}
