import React from 'react';
import { Delete, Check } from 'lucide-react';

interface NumericKeypadProps {
  onPress: (val: string) => void;
  onDelete: () => void;
  onDone: () => void;
}

const NumericKeypad: React.FC<NumericKeypadProps> = ({ onPress, onDelete, onDone }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white z-[60] rounded-t-[20px] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] animate-in slide-in-from-bottom duration-300 pb-2">
      {/* Drag Handle / Header */}
      <div className="flex justify-center pt-2.5 pb-1.5" onClick={onDone}>
        <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
      </div>
      
      {/* Grid */}
      <div className="grid grid-cols-3 gap-1.5 p-2 bg-gray-50/50">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={(e) => {
              e.stopPropagation();
              onPress(num.toString());
            }}
            className="h-12 bg-white hover:bg-gray-50 active:bg-rose-50 rounded-lg text-xl font-bold text-gray-800 shadow-sm border border-gray-100 transition-all active:scale-95 font-mono flex items-center justify-center"
          >
            {num}
          </button>
        ))}
        
        {/* Bottom Row */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="h-12 bg-gray-200 hover:bg-gray-300 active:bg-gray-400 active:scale-95 rounded-lg flex items-center justify-center text-gray-600 transition-all shadow-inner"
        >
          <Delete size={20} />
        </button>
        
        <button
          onClick={(e) => {
             e.stopPropagation();
             onPress('0');
          }}
          className="h-12 bg-white hover:bg-gray-50 active:bg-rose-50 rounded-lg text-xl font-bold text-gray-800 shadow-sm border border-gray-100 transition-all active:scale-95 font-mono flex items-center justify-center"
        >
          0
        </button>
        
        <button
          onClick={(e) => {
             e.stopPropagation();
             onDone();
          }}
          className="h-12 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-lg flex items-center justify-center text-white font-bold shadow-md shadow-rose-200 active:scale-95 transition-all"
        >
          <Check size={20} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};

export default NumericKeypad;