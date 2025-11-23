
import React from 'react';
import { Home, History, ScanLine, Gift, Bot } from 'lucide-react';
import { AppScreen } from '../types';

interface BottomNavProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  const navItems = [
    { id: AppScreen.HOME, icon: Home, label: 'হোম' },
    { id: AppScreen.TRANSACTIONS, icon: History, label: 'লেনদেন' },
    { id: AppScreen.SCAN, icon: ScanLine, label: '', isSpecial: true },
    { id: AppScreen.OFFERS, icon: Gift, label: 'অফার' },
    { id: AppScreen.AI_CHAT, icon: Bot, label: 'সহায়তা' },
  ];

  return (
    <div className="fixed bottom-[env(safe-area-inset-bottom)] left-1/2 -translate-x-1/2 w-[85%] max-w-[320px] bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_15px_40px_-12px_rgba(0,0,0,0.1)] border border-white/50 p-1.5 z-40 mb-1">
      <div className="flex justify-around items-center relative">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;
          
          if (item.isSpecial) {
             return (
               <button 
                 key={item.id} 
                 onClick={() => onNavigate(AppScreen.SCAN)}
                 className="relative group -mt-6"
               >
                 <div className="absolute inset-0 bg-rose-400 rounded-full blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
                 <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg shadow-rose-300/50 border-4 border-white transform transition-transform group-hover:scale-105 relative z-10 text-white">
                   <item.icon strokeWidth={2} className="w-5 h-5" />
                 </div>
               </button>
             )
          }

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as AppScreen)}
              className={`relative flex flex-col items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ${
                isActive ? 'text-rose-600 bg-rose-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} className={`transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} />
              {isActive && <span className="absolute -bottom-1 w-0.5 h-0.5 bg-rose-600 rounded-full"></span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;