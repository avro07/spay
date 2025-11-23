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
    <div className="absolute bottom-0 left-0 w-full z-50 pointer-events-none">
      {/* Background Container */}
      <div className="pointer-events-auto absolute bottom-0 w-full bg-white/90 backdrop-blur-2xl border-t border-white/60 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.1)] rounded-t-[35px] pb-[env(safe-area-inset-bottom)]">
        <div className="flex justify-between items-center px-6 h-[85px]">
          {navItems.map((item) => {
            const isActive = currentScreen === item.id;
            
            // Special Scan Button (Diamond Shape)
            if (item.isSpecial) {
               return (
                 <div key={item.id} className="relative -top-10 flex flex-col items-center justify-center w-[20%] h-full group cursor-pointer" onClick={() => onNavigate(AppScreen.SCAN)}>
                    <div className="relative w-[72px] h-[72px] bg-gradient-to-tr from-rose-600 to-rose-500 rounded-[24px] rotate-45 flex items-center justify-center shadow-2xl shadow-rose-500/40 border-[6px] border-[#FAFAFA] transform transition-transform duration-300 hover:scale-105 active:scale-95 hover:rotate-[50deg] group-active:rotate-90">
                      {/* Inner Shine */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-[18px]"></div>
                      <ScanLine strokeWidth={2.5} className="w-8 h-8 text-white -rotate-45 drop-shadow-sm" />
                    </div>
                    <span className="absolute -bottom-1 text-[10px] font-bold text-gray-500/90 tracking-wide mt-2 bg-white/80 px-2.5 py-0.5 rounded-full shadow-sm backdrop-blur-sm border border-white">
                      {item.label}
                    </span>
                 </div>
               )
            }

            // Standard Nav Item
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id as AppScreen)}
                className={`relative flex flex-col items-center justify-center w-[20%] h-full gap-1 transition-all duration-300 group`}
              >
                <div className={`
                    relative p-2.5 rounded-2xl transition-all duration-500 ease-out
                    ${isActive ? 'bg-rose-50 text-rose-600 -translate-y-3 shadow-md shadow-rose-100' : 'bg-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50'}
                `}>
                   <item.icon 
                      size={24} 
                      strokeWidth={isActive ? 2.5 : 2} 
                      className={`transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} 
                   />
                </div>
                
                <span className={`
                  text-[10px] font-semibold transition-all duration-300 absolute bottom-3.5
                  ${isActive ? 'text-rose-600 opacity-100 translate-y-0 scale-110' : 'text-gray-400 opacity-80 translate-y-1'}
                `}>
                  {item.label}
                </span>

                {/* Active Indicator Dot */}
                <div className={`
                  absolute bottom-1 w-1 h-1 bg-rose-600 rounded-full transition-all duration-300
                  ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}
                `}></div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomNav;