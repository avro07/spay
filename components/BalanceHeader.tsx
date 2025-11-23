
import React, { useState } from 'react';
import { Bell, Search, ChevronRight } from 'lucide-react';
import { User } from '../types';

interface BalanceHeaderProps {
  user: User;
  onProfileClick: () => void;
}

const BalanceHeader: React.FC<BalanceHeaderProps> = ({ user, onProfileClick }) => {
  const [showBalance, setShowBalance] = useState(false);
  const [animating, setAnimating] = useState(false);

  const toggleBalance = () => {
    if (!animating) {
      setAnimating(true);
      if (!showBalance) {
        setShowBalance(true);
        setTimeout(() => {
           setShowBalance(false);
           setAnimating(false);
        }, 5000);
      } else {
        setShowBalance(false);
      }
      setTimeout(() => setAnimating(false), 500);
    }
  };

  return (
    <div className="relative z-10 bg-gradient-to-br from-rose-600 via-pink-600 to-purple-700 rounded-b-[35px] shadow-[0_10px_40px_-10px_rgba(225,29,72,0.5)] pt-12 pb-16 px-6 overflow-hidden">
        {/* Live Animated Background Elements */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-rose-500 mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-purple-500 mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute top-[-20px] right-20 w-60 h-60 bg-pink-400 mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>

        {/* Content Container */}
        <div className="relative z-10">
            {/* Top Bar */}
            <div className="flex justify-between items-center mb-8">
                <div 
                  className="flex items-center space-x-3 group cursor-pointer"
                  onClick={onProfileClick}
                >
                    <div className="relative">
                        <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-r from-white/40 to-white/10 backdrop-blur-sm">
                            <img src={user.avatarUrl} alt="User" className="w-full h-full rounded-full object-cover border-2 border-white/50" />
                        </div>
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-rose-600 rounded-full"></div>
                    </div>
                    <div>
                        <h2 className="font-bold text-lg text-white leading-tight flex items-center gap-1">
                            {user.name}
                            <ChevronRight className="w-4 h-4 text-white/70 group-hover:translate-x-1 transition-transform" />
                        </h2>
                        <div className="flex items-center mt-0.5">
                            <span className="bg-white/10 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-semibold text-white/90 border border-white/10 shadow-sm">
                            DeshPay গোল্ড মেম্বার
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 transition-all active:scale-95 shadow-lg shadow-purple-900/10">
                        <Search className="w-5 h-5" />
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 transition-all active:scale-95 shadow-lg shadow-purple-900/10 relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-400 rounded-full animate-ping"></span>
                        <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-400 rounded-full"></span>
                    </button>
                </div>
            </div>

            {/* Balance Button */}
            <div className="flex justify-center mt-2">
                <button 
                onClick={toggleBalance}
                className={`
                    relative h-11 rounded-full shadow-[0_8px_20px_-5px_rgba(0,0,0,0.2)] transition-all duration-500 ease-out overflow-hidden flex items-center justify-center group
                    ${showBalance ? 'w-56 bg-white text-rose-600' : 'w-48 bg-white/20 backdrop-blur-lg border border-white/20 text-white hover:bg-white/25'}
                `}
                >
                    {/* Hidden State (Tap to see) */}
                    <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 transform ${showBalance ? 'opacity-0 scale-90 translate-y-4' : 'opacity-100 scale-100 translate-y-0'}`}>
                        <div className="flex items-center gap-2.5">
                            <div className="w-6 h-6 bg-white/90 rounded-full flex items-center justify-center text-rose-600 shadow-sm">
                                <span className="text-sm font-bold">৳</span>
                            </div>
                            <span className="font-medium tracking-wide text-sm drop-shadow-sm">ব্যালেন্স দেখুন</span>
                        </div>
                    </div>

                    {/* Visible State (Amount) */}
                    <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 transform ${showBalance ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-110 -translate-y-4'}`}>
                        <div className="flex flex-col items-center leading-none">
                            <span className="text-xs text-gray-400 font-medium mb-0.5">বর্তমান ব্যালেন্স</span>
                            <span className="text-xl font-bold text-rose-600 tracking-tight font-mono">৳ {user.balance.toLocaleString('bn-BD')}</span>
                        </div>
                    </div>
                    
                    {/* Shimmer Effect */}
                    {!showBalance && (
                        <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/30 opacity-40 animate-shimmer" />
                    )}
                </button>
            </div>
        </div>
    </div>
  );
};

export default BalanceHeader;
