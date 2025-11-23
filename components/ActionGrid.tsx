
import React from 'react';
import { QUICK_ACTIONS, TRANSLATIONS } from '../constants';
import { AppScreen, Language } from '../types';

interface ActionGridProps {
  onNavigate: (screen: AppScreen) => void;
  language: Language;
}

const ActionGrid: React.FC<ActionGridProps> = ({ onNavigate, language }) => {
  const t = TRANSLATIONS[language];

  return (
    <div className="px-4 -mt-8 relative z-20">
      {/* Glass Effect Container */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] p-4 border border-white/80">
        <div className="grid grid-cols-4 gap-x-1 gap-y-4">
          {QUICK_ACTIONS.map((action, index) => (
            <button 
              key={action.id}
              onClick={() => {
                switch(action.id) {
                  case 'send': onNavigate(AppScreen.SEND_MONEY); break;
                  case 'cashout': onNavigate(AppScreen.CASH_OUT); break;
                  case 'recharge': onNavigate(AppScreen.MOBILE_RECHARGE); break;
                  case 'payment': onNavigate(AppScreen.PAYMENT); break;
                  case 'addmoney': onNavigate(AppScreen.ADD_MONEY); break;
                  case 'paybill': onNavigate(AppScreen.PAY_BILL); break;
                  case 'tobank': onNavigate(AppScreen.TRANSFER_TO_BANK); break;
                  case 'reqmoney': onNavigate(AppScreen.REQUEST_MONEY); break;
                }
              }}
              className="flex flex-col items-center space-y-1.5 group"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={`
                w-11 h-11 flex items-center justify-center rounded-[16px] 
                bg-white/60 group-hover:bg-white/90 group-active:scale-95 
                transition-all duration-300 border border-white/60 group-hover:border-rose-200 shadow-sm group-hover:shadow-rose-100/50
                ${action.color}
              `}>
                <action.icon size={22} strokeWidth={1.5} className="transform group-hover:-rotate-12 transition-transform duration-300" />
              </div>
              <span className="text-[10px] font-medium text-gray-700 text-center leading-tight group-hover:text-rose-600 transition-colors">
                {/* @ts-ignore */}
                {t[action.key] || action.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActionGrid;
