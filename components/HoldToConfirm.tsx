import React, { useState, useRef, useEffect } from 'react';
import { Fingerprint } from 'lucide-react';

interface HoldToConfirmProps {
  onConfirm: () => void;
  label?: string;
}

const HoldToConfirm: React.FC<HoldToConfirmProps> = ({ onConfirm, label = "ট্যাপ করে ধরে রাখুন" }) => {
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const requestRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  
  const DURATION = 1500; // 1.5 seconds to confirm

  const animate = (time: number) => {
    if (!startTimeRef.current) startTimeRef.current = time;
    const elapsed = time - startTimeRef.current;
    
    // Calculate progress percentage
    const newProgress = Math.min((elapsed / DURATION) * 100, 100);
    setProgress(newProgress);

    if (newProgress < 100) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      // Finished
      onConfirm();
      setIsHolding(false);
    }
  };

  const startHolding = () => {
    setIsHolding(true);
    startTimeRef.current = 0; // Reset start time
    requestRef.current = requestAnimationFrame(animate);
  };

  const stopHolding = () => {
    setIsHolding(false);
    setProgress(0);
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
  };

  return (
    <div className="w-full select-none">
      <div className="relative w-full flex justify-between items-center mb-4">
         <div className="flex-1 h-full flex items-center justify-center">
             <p className="text-rose-500 font-semibold animate-pulse">{label}</p>
         </div>
      </div>

      <div className="relative flex justify-center pb-8">
        {/* Background Ring */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-4 border-gray-100"></div>

        {/* SVG Progress Ring */}
        <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 -rotate-90 transform pointer-events-none">
          <circle
            cx="48"
            cy="48"
            r="44"
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            className="text-rose-500"
            strokeDasharray={276} // 2 * PI * 44
            strokeDashoffset={276 - (276 * progress) / 100}
            strokeLinecap="round"
          />
        </svg>

        {/* Button */}
        <button
          onMouseDown={startHolding}
          onMouseUp={stopHolding}
          onMouseLeave={stopHolding}
          onTouchStart={startHolding}
          onTouchEnd={stopHolding}
          className={`
            relative z-10 w-20 h-20 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 flex items-center justify-center shadow-[0_0_20px_rgba(225,29,72,0.4)]
            transform transition-transform duration-200 border border-white/20
            ${isHolding ? 'scale-90' : 'scale-100'}
          `}
        >
          <Fingerprint className="text-white w-10 h-10" />
        </button>
      </div>
    </div>
  );
};

export default HoldToConfirm;