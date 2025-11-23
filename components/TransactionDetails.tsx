import React from 'react';
import { ArrowLeft, Share2, Download, Copy, CheckCircle, ArrowUpRight, Wallet, CreditCard, FileText, Landmark } from 'lucide-react';
import { Transaction, Language } from '../types';

interface TransactionDetailsProps {
  transaction: Transaction;
  onClose: () => void;
  language: Language;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({ transaction, onClose, language }) => {
  const isPositive = ['RECEIVED_MONEY', 'ADD_MONEY'].includes(transaction.type);
  
  // Tailwind classes don't support dynamic string interpolation well in JIT, so we define them explicitly
  const theme = isPositive 
    ? {
        text: 'text-emerald-600',
        bg: 'bg-emerald-50',
        ring: 'ring-emerald-50/50',
        bar: 'bg-emerald-500',
        iconBg: 'bg-emerald-100'
      }
    : {
        text: 'text-rose-600',
        bg: 'bg-rose-50',
        ring: 'ring-rose-50/50',
        bar: 'bg-rose-500',
        iconBg: 'bg-rose-100'
      };
  
  const getIcon = () => {
    switch (transaction.type) {
        case 'SEND_MONEY': return <ArrowUpRight size={32} />;
        case 'CASH_OUT': return <ArrowUpRight size={32} />;
        case 'MOBILE_RECHARGE': return <Wallet size={32} />;
        case 'PAYMENT': return <CreditCard size={32} />;
        case 'PAY_BILL': return <FileText size={32} />;
        case 'TRANSFER_TO_BANK': return <Landmark size={32} />;
        default: return <ArrowUpRight size={32} className={isPositive ? 'rotate-180' : ''} />;
    }
  };

  const labels = {
      bn: {
          title: 'লেনদেনের বিস্তারিত',
          success: 'লেনদেন সফল',
          completed: 'সম্পন্ন হয়েছে',
          recipient: 'প্রাপক/প্রেরক',
          time: 'সময়',
          trxId: 'ট্রানজেকশন আইডি',
          ref: 'রেফারেন্স',
          share: 'শেয়ার করুন',
          download: 'ডাউনলোড'
      },
      en: {
          title: 'Transaction Details',
          success: 'Transaction Successful',
          completed: 'Completed',
          recipient: 'Recipient/Sender',
          time: 'Time',
          trxId: 'Transaction ID',
          ref: 'Reference',
          share: 'Share',
          download: 'Download'
      }
  };

  const t = labels[language];

  return (
    <div className="fixed inset-0 bg-gray-50 z-[60] flex flex-col animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="bg-white px-4 pt-[calc(env(safe-area-inset-top)+1rem)] pb-4 flex items-center justify-between shadow-sm sticky top-0 z-20">
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full -ml-2 transition-colors">
                <ArrowLeft className="text-gray-700 w-5 h-5" />
            </button>
            <h1 className="font-bold text-lg text-gray-800">{t.title}</h1>
            <div className="w-9"></div> 
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 pb-8">
            <div className="bg-white rounded-2xl shadow-lg shadow-gray-200 overflow-hidden relative border border-gray-100">
                {/* Colored Top Bar */}
                <div className={`h-2 w-full ${theme.bar}`}></div>
                
                <div className="p-8 flex flex-col items-center border-b border-gray-100 border-dashed">
                    <div className={`w-20 h-20 ${theme.bg} rounded-full flex items-center justify-center mb-4 ring-8 ${theme.ring}`}>
                        <div className={theme.text}>
                             {getIcon()}
                        </div>
                    </div>
                    <h2 className={`${theme.text} font-bold text-xl mb-1`}>{t.success}</h2>
                    <p className="text-gray-400 text-sm font-medium">{t.completed}</p>
                    
                    <div className="mt-6 text-center">
                        <p className={`text-4xl font-black text-gray-800 tracking-tight font-mono`}>
                           {isPositive ? '+' : '-'}৳{transaction.amount.toLocaleString(language === 'bn' ? 'bn-BD' : 'en-US')}
                        </p>
                        <p className="text-gray-500 text-sm font-medium mt-2 px-3 py-1 bg-gray-50 rounded-full inline-block">
                            {transaction.type.replace(/_/g, ' ')}
                        </p>
                    </div>
                </div>

                <div className="p-6 space-y-5 bg-gray-50/30">
                    <div className="flex justify-between items-start">
                        <span className="text-gray-500 text-sm font-medium mt-0.5">{t.recipient}</span>
                        <div className="text-right">
                             <span className="text-gray-800 font-bold text-base block">{transaction.recipientName || 'Unknown'}</span>
                             {/* Mock number */}
                             <span className="text-gray-400 text-xs font-mono">017XXXXXXXX</span> 
                        </div>
                    </div>
                     <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-sm font-medium">{t.time}</span>
                        <span className="text-gray-800 font-bold text-sm text-right">{transaction.date}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-sm font-medium">{t.trxId}</span>
                        <div 
                            className="flex items-center gap-2 group cursor-pointer" 
                            onClick={() => navigator.clipboard.writeText(transaction.id)}
                        >
                             <span className="text-gray-800 font-mono font-bold text-sm bg-white border border-gray-200 px-2 py-1 rounded shadow-sm group-active:scale-95 transition-transform">{transaction.id}</span>
                             <Copy size={14} className="text-gray-400 group-hover:text-gray-600" />
                        </div>
                    </div>
                    {transaction.description && (
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-sm font-medium">{t.ref}</span>
                            <span className="text-gray-800 font-bold text-sm text-right">{transaction.description}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-4 mt-6">
                <button className="flex items-center justify-center gap-2 bg-white border border-gray-200 p-4 rounded-xl font-bold text-gray-700 shadow-sm active:scale-[0.98] transition-all hover:bg-gray-50">
                    <Share2 size={18} /> {t.share}
                </button>
                <button className="flex items-center justify-center gap-2 bg-rose-600 text-white p-4 rounded-xl font-bold shadow-lg shadow-rose-200 active:scale-[0.98] transition-all hover:bg-rose-700">
                    <Download size={18} /> {t.download}
                </button>
            </div>
        </div>
    </div>
  );
};

export default TransactionDetails;