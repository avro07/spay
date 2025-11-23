
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
      <div className="pointer-events-auto absolute bottom-0 w-full bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-[env(safe-area-inset-bottom)] rounded-t-[30px]">
        <div className="flex justify-between items-end px-4 h-[70px]">
          {navItems.map((item) => {
            const isActive = currentScreen === item.id;
            
            // Special Scan Button (Diamond/Squircle Design)
            if (item.isSpecial) {
               return (
                 <div key={item.id} className="relative flex flex-col items-center justify-end w-[20%] h-full cursor-pointer group pb-2" onClick={() => onNavigate(AppScreen.SCAN)}>
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-10 transition-transform duration-200 group-active:scale-90">
                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-rose-500 blur-xl opacity-20 rounded-full translate-y-2 scale-110"></div>
                        
                        {/* Main Button */}
                        <div className="relative w-[46px] h-[46px] bg-gradient-to-tr from-rose-600 to-pink-500 rotate-45 rounded-[15px] flex items-center justify-center shadow-[0_8px_16px_-4px_rgba(225,29,72,0.4)] border-[4px] border-white ring-1 ring-black/5">
                             <div className="-rotate-45">
                                <ScanLine size={20} className="text-white" strokeWidth={2.5} />
                             </div>
                        </div>
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 mt-8 leading-none group-hover:text-rose-600 transition-colors">
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
                className={`relative flex flex-col items-center justify-center w-[20%] h-full pb-3 gap-1.5 transition-colors duration-300 group`}
              >
                <div className={`
                    p-1.5 rounded-xl transition-all duration-300
                    ${isActive ? 'bg-rose-50 text-rose-600 -translate-y-1' : 'text-gray-400 group-hover:text-gray-600 group-hover:bg-gray-50'}
                `}>
                    <item.icon 
                       size={22} 
                       strokeWidth={isActive ? 2.5 : 2} 
                    />
                </div>
                
                <span className={`
                  text-[10px] font-semibold transition-colors duration-300 leading-none
                  ${isActive ? 'text-rose-600' : 'text-gray-500'}
                `}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomNav;
