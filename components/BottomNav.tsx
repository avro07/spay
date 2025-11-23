
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
      <div className="pointer-events-auto absolute bottom-0 w-full bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-[env(safe-area-inset-bottom)]">
        <div className="flex justify-between items-end px-2 h-[70px]">
          {navItems.map((item) => {
            const isActive = currentScreen === item.id;
            
            // Special Scan Button (Circular Floating)
            if (item.isSpecial) {
               return (
                 <div key={item.id} className="relative flex flex-col items-center justify-end w-[20%] h-full cursor-pointer group pb-2" onClick={() => onNavigate(AppScreen.SCAN)}>
                    <div className="absolute -top-6 transition-transform duration-200 group-active:scale-95">
                        <div className="w-[60px] h-[60px] bg-rose-600 rounded-full flex items-center justify-center shadow-lg shadow-rose-200 border-[4px] border-[#f3f4f6]">
                             <ScanLine size={24} className="text-white" strokeWidth={2.5} />
                        </div>
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 mt-8">
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
                className={`relative flex flex-col items-center justify-center w-[20%] h-full pb-2 gap-1 transition-colors duration-300 group`}
              >
                <item.icon 
                   size={24} 
                   strokeWidth={isActive ? 2.5 : 2} 
                   className={`transition-colors duration-300 ${isActive ? 'text-rose-600' : 'text-gray-400 group-hover:text-gray-600'}`} 
                />
                
                <span className={`
                  text-[10px] font-semibold transition-colors duration-300
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
