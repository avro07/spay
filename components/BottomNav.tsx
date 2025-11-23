import React from 'react';
import { Home, History, ScanLine, Gift, Bot } from 'lucide-react';
import { AppScreen, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface BottomNavProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  language: Language;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate, language }) => {
  const t = TRANSLATIONS[language];
  
  const navItems = [
    { id: AppScreen.HOME, icon: Home, label: t.nav_home },
    { id: AppScreen.TRANSACTIONS, icon: History, label: t.nav_history },
    { id: AppScreen.SCAN, icon: ScanLine, label: t.nav_scan, isSpecial: true },
    { id: AppScreen.OFFERS, icon: Gift, label: t.nav_offers },
    { id: AppScreen.AI_CHAT, icon: Bot, label: t.nav_help },
  ];

  return (
    <div className="absolute bottom-0 left-0 w-full bg-white/95 backdrop-blur-xl border-t border-gray-100 rounded-t-[25px] px-6 pt-2 pb-[env(safe-area-inset-bottom)] z-50 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.08)]">
      <div className="flex justify-between items-end pb-2">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;
          
          if (item.isSpecial) {
             return (
               <div key={item.id} className="relative -top-10 group">
                  <div className="absolute inset-0 bg-rose-500 rounded-full blur-xl opacity-40 group-active:opacity-60 transition-opacity scale-90 translate-y-4"></div>
                  <button 
                    onClick={() => onNavigate(AppScreen.SCAN)}
                    className="relative w-20 h-20 bg-gradient-to-br from-rose-600 to-pink-600 rounded-full flex items-center justify-center shadow-2xl shadow-rose-400/60 border-[6px] border-[#FAFAFA] transform transition-transform group-active:scale-95"
                  >
                    <ScanLine strokeWidth={2.5} className="w-9 h-9 text-white" />
                  </button>
               </div>
             )
          }

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as AppScreen)}
              className={`flex flex-col items-center justify-center w-12 transition-all duration-300 gap-1 ${
                isActive ? 'text-rose-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} className={`transition-transform duration-300 ${isActive ? '-translate-y-1' : ''}`} />
              <span className={`text-[9px] font-medium transition-colors ${isActive ? 'font-bold' : ''}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="w-1 h-1 bg-rose-600 rounded-full mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;