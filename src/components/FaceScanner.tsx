"use client";
import { useEffect, useRef, useState } from "react";
import { ScanFace, CheckCircle2, AlertCircle } from "lucide-react";

interface FaceScannerProps {
  expectedName: string;
  onSuccess: () => void;
}

export default function FaceScanner({ expectedName, onSuccess }: FaceScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<"scanning" | "liveness" | "success" | "error">("scanning");
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let stream: MediaStream | null = null;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err: any) {
        setStatus("error");
        setErrorMsg("Camera access denied or unavailable.");
      }
    };
    startCamera();

    // Simulation of Face-API.js processing for MVP Demonstration
    const timer1 = setTimeout(() => {
      if (status !== 'error') setStatus("liveness");
    }, 1200);

    const timer2 = setTimeout(() => {
      if (status !== 'error') {
        setStatus("success");
        setTimeout(onSuccess, 800);
      }
    }, 2800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      if (stream) stream.getTracks().forEach((track) => track.stop());
    };
  }, [expectedName, onSuccess, status]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-teal-500 shadow-xl bg-slate-900 mx-auto my-6 flex items-center justify-center">
        {status === "error" ? (
          <div className="text-slate-400 flex flex-col items-center p-6 bg-slate-800 rounded-full h-full w-full justify-center">
            <AlertCircle size={48} className="text-red-500 mb-2" />
            <span className="text-sm text-center">{errorMsg}</span>
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover scale-125"
          />
        )}
        
        {/* Scanning Overlay Animation */}
        {status === "scanning" && (
          <div className="absolute inset-0 bg-teal-500/20 mix-blend-overlay flex flex-col">
            <div className="w-full h-1 bg-white shadow-[0_0_15px_4px_#3b82f6] animate-[scan_2s_ease-in-out_infinite]" />
          </div>
        )}

        {status === "success" && (
          <div className="absolute inset-0 bg-emerald-500/70 flex items-center justify-center backdrop-blur-sm">
            <CheckCircle2 size={80} className="text-white drop-shadow-md animate-in zoom-in" />
          </div>
        )}
      </div>

      <div className="text-center h-20">
        {status === "scanning" && <p className="text-teal-600 font-semibold animate-pulse flex items-center justify-center gap-2"><ScanFace /> Scanning face pattern...</p>}
        {status === "liveness" && <p className="text-amber-600 font-bold animate-pulse text-lg">Please blink slowly to verify liveness.</p>}
        {status === "success" && <p className="text-emerald-600 font-bold text-lg">Face Match Successful! ({expectedName})</p>}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { transform: translateY(0); }
          50% { transform: translateY(320px); }
          100% { transform: translateY(0); }
        }
      `}} />
    </div>
  );
}
