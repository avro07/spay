
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
    <div className="fixed bottom-0 left-0 w-full z-50 pointer-events-none">
      {/* Background Container - Compact Style matching Android look */}
      <div className="pointer-events-auto w-full bg-white border-t border-gray-100 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] rounded-t-xl relative">
        <div className="flex justify-between items-center px-6 h-[60px]">
          {navItems.map((item) => {
            const isActive = currentScreen === item.id;
            
            // Special Scan Button
            if (item.isSpecial) {
               return (
                 <div key={item.id} className="relative flex flex-col items-center justify-end w-[20%] h-full cursor-pointer group pb-1" onClick={() => onNavigate(AppScreen.SCAN)}>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-10 transition-transform duration-200 group-active:scale-90">
                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-rose-500 blur-xl opacity-20 rounded-full translate-y-2 scale-110"></div>
                        
                        {/* Main Button */}
                        <div className="relative w-[52px] h-[52px] bg-gradient-to-tr from-rose-600 to-pink-500 rotate-45 rounded-[18px] flex items-center justify-center shadow-[0_8px_16px_-4px_rgba(225,29,72,0.4)] border-[4px] border-white ring-1 ring-black/5">
                             <div className="-rotate-45">
                                <ScanLine size={24} className="text-white" strokeWidth={2.5} />
                             </div>
                        </div>
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 mt-6 leading-none group-hover:text-rose-600 transition-colors">
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
                className={`relative flex flex-col items-center justify-center w-[20%] h-full gap-1 transition-colors duration-300 group`}
              >
                <div className={`
                    p-1.5 rounded-xl transition-all duration-300
                    ${isActive ? 'bg-rose-50 text-rose-600 -translate-y-0.5' : 'text-gray-400 group-hover:text-gray-600 group-hover:bg-gray-50'}
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
