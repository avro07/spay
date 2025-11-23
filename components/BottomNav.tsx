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
    { id: AppScreen.SCAN, icon: ScanLine, label: 'স্ক্যান', isSpecial: true },
    { id: AppScreen.OFFERS, icon: Gift, label: 'অফার' },
    { id: AppScreen.AI_CHAT, icon: Bot, label: 'সহায়তা' },
  ];

  return (
    <div className="absolute bottom-0 left-0 w-full bg-white/95 backdrop-blur-xl border-t border-gray-100 rounded-t-[25px] px-6 pt-3 pb-[calc(1rem+env(safe-area-inset-bottom))] z-50 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)]">
      <div className="flex justify-between items-end">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;
          
          if (item.isSpecial) {
             return (
               <div key={item.id} className="relative -top-8 group">
                  <div className="absolute inset-0 bg-rose-500 rounded-full blur opacity-40 group-active:opacity-60 transition-opacity"></div>
                  <button 
                    onClick={() => onNavigate(AppScreen.SCAN)}
                    className="relative w-16 h-16 bg-gradient-to-br from-rose-600 to-pink-600 rounded-full flex items-center justify-center shadow-xl shadow-rose-200 border-[5px] border-[#FAFAFA] transform transition-transform group-active:scale-95"
                  >
                    <ScanLine strokeWidth={2.5} className="w-7 h-7 text-white" />
                  </button>
               </div>
             )
          }

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as AppScreen)}
              className={`flex flex-col items-center justify-center w-14 transition-all duration-300 gap-1.5 ${
                isActive ? 'text-rose-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} className={`transition-transform duration-300 ${isActive ? '-translate-y-1' : ''}`} />
              <span className={`text-[10px] font-medium transition-colors ${isActive ? 'font-bold' : ''}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="w-1 h-1 bg-rose-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;