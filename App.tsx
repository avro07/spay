import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ChevronRight, ArrowUpRight, CreditCard, Wallet, X, Bell, Shield, Settings as SettingsIcon, FileText, Landmark, ShoppingBag, Utensils, LogOut, Lock, User as UserIcon, Phone, Eye, EyeOff } from 'lucide-react';
import BalanceHeader from './components/BalanceHeader';
import ActionGrid from './components/ActionGrid';
import BottomNav from './components/BottomNav';
import AIAssistant from './components/AIAssistant';
import HoldToConfirm from './components/HoldToConfirm';
import OfferCarousel from './components/OfferCarousel';
import { AppScreen, User, Transaction, SendMoneyFormData, NotificationPreferences } from './types';
import { INITIAL_USER, MOCK_TRANSACTIONS } from './constants';

const App: React.FC = () => {
  // Start at LOGIN screen
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.LOGIN);
  const [user, setUser] = useState<User>(INITIAL_USER);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Login/Register Form State
  const [loginPhone, setLoginPhone] = useState(INITIAL_USER.phone);
  const [loginPin, setLoginPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [registerData, setRegisterData] = useState({ name: '', phone: '', pin: '', confirmPin: '' });
  
  // Notification Preferences State
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences>({
    transactions: true,
    offers: true,
    securityAlerts: true
  });

  // Transaction Flow State
  const [transactionStep, setTransactionStep] = useState(1);
  const [formData, setFormData] = useState<SendMoneyFormData>({
    recipient: '',
    amount: '',
    reference: '',
    pin: ''
  });

  // Dynamic Status Bar Color
  useEffect(() => {
    let color = '#ffffff';

    switch (currentScreen) {
      case AppScreen.LOGIN:
      case AppScreen.REGISTER:
        color = '#e11d48'; // Brand color for auth screens
        break;
      case AppScreen.HOME:
        color = '#e11d48'; // Matches the rose-600 gradient start of BalanceHeader
        break;
      case AppScreen.SCAN:
        color = '#000000'; // Black for scan screen
        break;
      case AppScreen.TRANSACTIONS:
        color = '#f8f9fa'; // Matches transaction screen background
        break;
      case AppScreen.AI_CHAT:
        color = '#000000'; // Dark overlay
        break;
      case AppScreen.SETTINGS:
      case AppScreen.SUCCESS:
      case AppScreen.SEND_MONEY:
      case AppScreen.CASH_OUT:
      case AppScreen.MOBILE_RECHARGE:
      case AppScreen.PAYMENT:
      case AppScreen.ADD_MONEY:
      case AppScreen.REQUEST_MONEY:
      case AppScreen.PAY_BILL:
      case AppScreen.TRANSFER_TO_BANK:
      case AppScreen.OFFERS:
        color = '#ffffff'; // White for standard screens
        break;
      default:
        color = '#e11d48';
    }

    // Update the meta tag
    const metaThemeColor = document.querySelector("meta[name='theme-color']");
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', color);
    }
  }, [currentScreen]);

  // Camera Logic for Scan Screen
  useEffect(() => {
    let stream: MediaStream | null = null;

    if (currentScreen === AppScreen.SCAN) {
      const startCamera = async () => {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' } 
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error("Camera access error:", err);
        }
      };
      
      startCamera();
    }

    // Cleanup function to stop camera when leaving screen
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [currentScreen]);

  // Auth Handlers
  const handleLogin = () => {
    if (loginPin.length >= 4) {
      // Simple mock validation
      if (loginPin === '6175') {
        setCurrentScreen(AppScreen.HOME);
        setLoginPin(''); // Clear pin for security
      } else {
        alert("ভুল পিন নম্বর (Demo PIN: 6175)");
      }
    }
  };

  const handleRegister = () => {
    if (registerData.name && registerData.phone && registerData.pin.length === 4) {
      if (registerData.pin !== registerData.confirmPin) {
        alert("পিন নম্বর মিলছে না");
        return;
      }
      // Create new user context
      setUser({
        ...user,
        name: registerData.name,
        phone: registerData.phone,
        balance: 50 // Signup bonus
      });
      // Add welcome notification/transaction
      setTransactions([
        {
          id: `TXN${Date.now()}`,
          type: 'RECEIVED_MONEY',
          amount: 50,
          recipientName: 'SPay বোনাস',
          date: 'এইমাত্র',
          description: 'স্বাগতম বোনাস'
        },
        ...transactions
      ]);
      setCurrentScreen(AppScreen.HOME);
    }
  };

  const handleLogout = () => {
    setCurrentScreen(AppScreen.LOGIN);
    setTransactionStep(1);
    setFormData({ recipient: '', amount: '', reference: '', pin: '' });
  };

  // Simulate scanning a QR code
  const simulateScan = () => {
    // In a real app, this would be data parsed from the QR code
    const mockMerchantNumber = "01712345678";
    
    setFormData(prev => ({
      ...prev,
      recipient: mockMerchantNumber
    }));
    
    // Navigate to Payment screen and skip to amount input
    setCurrentScreen(AppScreen.PAYMENT);
    setTransactionStep(2);
  };

  // Configuration for different transaction types
  const getScreenConfig = () => {
    switch (currentScreen) {
      case AppScreen.SEND_MONEY:
        return { title: 'সেন্ড মানি', label: 'প্রাপক নম্বর', type: 'SEND_MONEY' as const, operatorPrefix: true };
      case AppScreen.CASH_OUT:
        return { title: 'ক্যাশ আউট', label: 'এজেন্ট নম্বর', type: 'CASH_OUT' as const, operatorPrefix: true };
      case AppScreen.MOBILE_RECHARGE:
        return { title: 'মোবাইল রিচার্জ', label: 'মোবাইল নম্বর', type: 'MOBILE_RECHARGE' as const, operatorPrefix: true };
      case AppScreen.PAYMENT:
        return { title: 'পেমেন্ট', label: 'মার্চেন্ট নম্বর/নাম', type: 'PAYMENT' as const, operatorPrefix: false };
      case AppScreen.ADD_MONEY:
        return { title: 'অ্যাড মানি', label: 'ব্যাংক/কার্ড নম্বর', type: 'ADD_MONEY' as const, operatorPrefix: false };
      case AppScreen.PAY_BILL:
        return { title: 'পে বিল', label: 'বিল নম্বর/অ্যাকাউন্ট', type: 'PAY_BILL' as const, operatorPrefix: false };
      case AppScreen.TRANSFER_TO_BANK:
        return { title: 'SPay টু ব্যাংক', label: 'ব্যাংক অ্যাকাউন্ট নম্বর', type: 'TRANSFER_TO_BANK' as const, operatorPrefix: false };
      case AppScreen.REQUEST_MONEY:
        return { title: 'রিকোয়েস্ট মানি', label: 'প্রাপক নম্বর', type: 'REQUEST_MONEY' as const, operatorPrefix: true };
      default:
        return { title: 'লেনদেন', label: 'প্রাপক', type: 'SEND_MONEY' as const, operatorPrefix: true };
    }
  };

  // Utility to handle back navigation
  const handleBack = () => {
    if (transactionStep > 1) {
      setTransactionStep(prev => prev - 1);
    } else {
      setCurrentScreen(AppScreen.HOME);
      setTransactionStep(1);
      setFormData({ recipient: '', amount: '', reference: '', pin: '' });
    }
  };

  // Logic to execute transaction
  const executeTransaction = () => {
    const config = getScreenConfig();
    const amount = parseFloat(formData.amount);
    
    // Balance check for debit transactions
    if (config.type !== 'ADD_MONEY' && config.type !== 'REQUEST_MONEY' && amount > user.balance) {
       alert('অপর্যাপ্ত ব্যালেন্স');
       return;
    }

    const newTxn: Transaction = {
      id: `TXN${Date.now()}`,
      type: config.type,
      amount: amount,
      recipientName: formData.recipient,
      date: 'এইমাত্র',
      description: formData.reference || config.title
    };

    setTransactions([newTxn, ...transactions]);
    
    // Update balance
    if (config.type === 'ADD_MONEY') {
        setUser(prev => ({ ...prev, balance: prev.balance + amount }));
    } else if (config.type !== 'REQUEST_MONEY') {
        // Request Money doesn't deduct balance immediately in this simulation
        setUser(prev => ({ ...prev, balance: prev.balance - amount }));
    }

    setCurrentScreen(AppScreen.SUCCESS);
  };

  // --- RENDER HELPERS ---

  const renderLogin = () => (
    <div className="flex flex-col h-full bg-gradient-to-br from-rose-600 to-pink-700 animate-in fade-in">
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-white">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-rose-900/30 border border-white/30">
                 <span className="text-4xl font-bold tracking-tighter italic">SPay</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">স্বাগতম!</h1>
            <p className="text-rose-100 text-sm mb-12">আপনার নিরাপদ লেনদেনের সাথী</p>
        </div>

        <div className="bg-white rounded-t-[35px] p-8 pb-[calc(2rem+env(safe-area-inset-bottom))] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.3)] min-h-[50%] animate-in slide-in-from-bottom duration-500">
             <div className="space-y-6">
                 <div>
                     <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">মোবাইল নম্বর</label>
                     <div className="relative">
                         <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                             <Phone size={20} />
                         </div>
                         <input 
                            type="tel"
                            value={loginPhone}
                            onChange={(e) => setLoginPhone(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 font-semibold text-gray-800 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
                            placeholder="01XXXXXXXXX"
                         />
                     </div>
                 </div>

                 <div>
                     <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">পিন নম্বর</label>
                     <div className="relative">
                         <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                             <Lock size={20} />
                         </div>
                         <input 
                            type={showPin ? "text" : "password"}
                            value={loginPin}
                            onChange={(e) => setLoginPin(e.target.value)}
                            maxLength={4}
                            className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-12 font-bold text-gray-800 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all tracking-widest"
                            placeholder="****"
                         />
                         <button 
                            onClick={() => setShowPin(!showPin)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                         >
                             {showPin ? <EyeOff size={20} /> : <Eye size={20} />}
                         </button>
                     </div>
                     <div className="flex justify-end mt-2">
                        <button className="text-xs text-rose-600 font-semibold hover:underline">পিন ভুলে গেছেন?</button>
                     </div>
                 </div>

                 <button 
                    onClick={handleLogin}
                    className="w-full bg-rose-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-rose-200 hover:bg-rose-700 hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                 >
                     লগ ইন <ArrowRightIcon className="w-5 h-5" />
                 </button>

                 <div className="text-center mt-6">
                     <p className="text-gray-500 text-sm">
                         অ্যাকাউন্ট নেই? <button onClick={() => setCurrentScreen(AppScreen.REGISTER)} className="text-rose-600 font-bold hover:underline">রেজিস্ট্রেশন করুন</button>
                     </p>
                 </div>
             </div>
        </div>
    </div>
  );

  const renderRegister = () => (
    <div className="flex flex-col h-full bg-white animate-in slide-in-from-right duration-300">
        <div className="bg-rose-600 px-6 pt-12 pb-8 rounded-b-[35px] shadow-lg relative z-10">
            <button onClick={() => setCurrentScreen(AppScreen.LOGIN)} className="absolute top-12 left-4 p-2 bg-white/20 rounded-full text-white backdrop-blur-md">
                <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold text-white mt-8">নতুন অ্যাকাউন্ট</h1>
            <p className="text-rose-100 text-sm">SPay-তে রেজিস্ট্রেশন করুন</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] space-y-5">
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">আপনার নাম</label>
                <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <UserIcon size={20} />
                    </div>
                    <input 
                    type="text"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 font-medium text-gray-800 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
                    placeholder="আপনার পূর্ণ নাম"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">মোবাইল নম্বর</label>
                <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <Phone size={20} />
                    </div>
                    <input 
                    type="tel"
                    value={registerData.phone}
                    onChange={(e) => setRegisterData({...registerData, phone: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 font-semibold text-gray-800 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
                    placeholder="01XXXXXXXXX"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">পিন নম্বর</label>
                    <input 
                        type="password"
                        maxLength={4}
                        value={registerData.pin}
                        onChange={(e) => setRegisterData({...registerData, pin: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-4 font-bold text-center text-gray-800 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
                        placeholder="****"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">কনফার্ম পিন</label>
                    <input 
                        type="password"
                        maxLength={4}
                        value={registerData.confirmPin}
                        onChange={(e) => setRegisterData({...registerData, confirmPin: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-4 font-bold text-center text-gray-800 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
                        placeholder="****"
                    />
                </div>
            </div>

            <div className="pt-4">
                <button 
                    onClick={handleRegister}
                    className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl shadow-xl hover:bg-black active:scale-[0.98] transition-all"
                >
                    রেজিস্ট্রেশন করুন
                </button>
            </div>
            
            <p className="text-center text-xs text-gray-400 mt-4 leading-relaxed px-4">
                রেজিস্ট্রেশন করার মাধ্যমে আপনি SPay এর <span className="text-rose-600 font-bold">শর্তাবলী</span> এবং <span className="text-rose-600 font-bold">গোপনীয়তা নীতি</span> তে সম্মত হচ্ছেন।
            </p>
        </div>
    </div>
  );

  const renderHome = () => (
    <div className="pb-[calc(7rem+env(safe-area-inset-bottom))] animate-in fade-in duration-500 relative">
      {/* Background Ambient Blobs for Glass Effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[20%] left-[-10%] w-72 h-72 bg-purple-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute top-[40%] right-[-10%] w-72 h-72 bg-yellow-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-[20%] left-[20%] w-72 h-72 bg-pink-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        <BalanceHeader 
            user={user} 
            onProfileClick={() => setCurrentScreen(AppScreen.SETTINGS)} 
        />
        <ActionGrid onNavigate={setCurrentScreen} />
        
        {/* Promotions Carousel */}
        <div className="px-5 mt-6">
            <OfferCarousel onNavigate={setCurrentScreen} />
        </div>

        {/* Recent Transactions Preview */}
        <div className="px-5 mt-8">
            <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-800 font-bold text-lg">সাম্প্রতিক লেনদেন</h3>
            <button 
                onClick={() => setCurrentScreen(AppScreen.TRANSACTIONS)}
                className="text-rose-600 text-sm font-semibold flex items-center hover:gap-1 transition-all"
            >
                সব দেখুন <ChevronRight size={16} />
            </button>
            </div>
            <div className="flex flex-col gap-3">
            {transactions.slice(0, 3).map((txn) => (
                <div key={txn.id} className="bg-white/40 backdrop-blur-xl p-4 rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] border border-white/50 flex items-center justify-between active:scale-[0.99] transition-transform hover:bg-white/50 group">
                <div className="flex items-center space-x-4">
                    <div className={`
                        w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold shadow-inner backdrop-blur-sm
                        ${txn.type === 'RECEIVED_MONEY' || txn.type === 'ADD_MONEY' 
                            ? 'bg-emerald-100/40 text-emerald-600' 
                            : 'bg-rose-100/40 text-rose-600'}
                    `}>
                        {txn.type === 'SEND_MONEY' && <ArrowUpRight size={24} />}
                        {txn.type === 'CASH_OUT' && <ArrowUpRight size={24} />}
                        {txn.type === 'MOBILE_RECHARGE' && <Wallet size={24} />}
                        {(txn.type === 'RECEIVED_MONEY' || txn.type === 'ADD_MONEY') && <ArrowUpRight size={24} className="rotate-180" />}
                        {txn.type === 'PAYMENT' && <CreditCard size={24} />}
                        {txn.type === 'PAY_BILL' && <FileText size={24} />}
                        {txn.type === 'TRANSFER_TO_BANK' && <Landmark size={24} />}
                        {txn.type === 'REQUEST_MONEY' && <ArrowUpRight size={24} className="rotate-180 text-orange-500" />}
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-800 line-clamp-1 group-hover:text-rose-600 transition-colors">{txn.recipientName}</p>
                        <p className="text-xs text-gray-500 font-medium mt-0.5">{txn.description} • {txn.date}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className={`text-base font-bold font-mono tracking-tight ${['RECEIVED_MONEY', 'ADD_MONEY'].includes(txn.type) ? 'text-emerald-600' : 'text-gray-900'}`}>
                    {['RECEIVED_MONEY', 'ADD_MONEY'].includes(txn.type) ? '+' : '-'}৳{txn.amount.toLocaleString('bn-BD')}
                    </p>
                </div>
                </div>
            ))}
            </div>
        </div>
      </div>
    </div>
  );

  const renderOffers = () => (
    <div className="flex flex-col h-full bg-gray-50 animate-in fade-in slide-in-from-right duration-300">
       {/* Header */}
       <div className="bg-white px-4 pb-4 pt-[calc(env(safe-area-inset-top)+1rem)] flex items-center shadow-sm sticky top-0 z-20">
          <button onClick={() => setCurrentScreen(AppScreen.HOME)} className="p-2 hover:bg-gray-100 rounded-full mr-2 -ml-2 transition-colors">
            <ArrowLeft className="text-gray-700 w-6 h-6" />
          </button>
          <h1 className="font-bold text-xl text-gray-800">অফার সমূহ</h1>
       </div>

       <div className="flex-1 overflow-y-auto p-5 pb-[calc(7rem+env(safe-area-inset-bottom))] space-y-5">
          {/* Banner 1: Recharge */}
          <div 
             onClick={() => setCurrentScreen(AppScreen.MOBILE_RECHARGE)}
             className="relative overflow-hidden bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl p-5 shadow-lg shadow-violet-200 group cursor-pointer transition-transform active:scale-[0.98]"
          >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-400 opacity-20 rounded-full -ml-10 -mb-10 blur-xl"></div>
              
              <div className="relative z-10">
                  <span className="bg-white/20 backdrop-blur-sm px-2.5 py-0.5 rounded text-[10px] font-bold text-white border border-white/20 inline-block mb-2">
                      মোবাইল রিচার্জ
                  </span>
                  <h3 className="font-bold text-white text-xl mb-1">২০ টাকা ক্যাশব্যাক</h3>
                  <p className="text-violet-100 text-sm mb-3">৫০ টাকা বা তার বেশি রিচার্জে</p>
                  <div className="flex justify-between items-end">
                      <span className="text-xs text-white/80">মেয়াদ: ৩০ জুন পর্যন্ত</span>
                      <button className="bg-white text-violet-600 px-4 py-1.5 rounded-full text-xs font-bold shadow-sm">নিন</button>
                  </div>
              </div>
          </div>

          {/* Banner 2: Grocery (Swapno) */}
          <div 
             onClick={() => setCurrentScreen(AppScreen.PAYMENT)}
             className="relative overflow-hidden bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-5 shadow-lg shadow-orange-200 group cursor-pointer transition-transform active:scale-[0.98]"
          >
              <div className="absolute top-10 right-10 w-40 h-40 bg-yellow-300 opacity-20 rounded-full blur-3xl"></div>
              
              <div className="relative z-10">
                  <div className="flex justify-between items-start">
                    <div>
                        <span className="bg-white/20 backdrop-blur-sm px-2.5 py-0.5 rounded text-[10px] font-bold text-white border border-white/20 inline-block mb-2">
                            সুপার শপ
                        </span>
                        <h3 className="font-bold text-white text-xl">স্বপ্ন-তে ১০% ছাড়</h3>
                        <p className="text-orange-100 text-sm mt-1">যেকোনো গ্রোসারি কেনাকাটায়</p>
                    </div>
                    <div className="bg-white/20 rounded-lg p-2 backdrop-blur-sm">
                        <ShoppingBag className="text-white w-6 h-6" />
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center">
                      <span className="text-xs text-white/90">মিনিমাম ৫০০ টাকার কেনাকাটায়</span>
                      <span className="font-bold text-white text-lg">১০%</span>
                  </div>
              </div>
          </div>

          {/* Banner 3: Add Money (Existing style) */}
          <div 
             onClick={() => setCurrentScreen(AppScreen.ADD_MONEY)}
             className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-5 shadow-lg shadow-blue-200 group cursor-pointer transition-transform active:scale-[0.98]"
          >
               <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
               <div className="absolute bottom-0 left-0 w-24 h-24 bg-rose-500 opacity-20 rounded-full -ml-10 -mb-10 blur-xl"></div>
               
               <div className="relative z-10 flex justify-between items-center">
                    <div className="space-y-1">
                        <span className="bg-white/20 backdrop-blur-sm px-2.5 py-0.5 rounded text-[10px] font-bold text-white border border-white/20 inline-block mb-1">
                            অ্যাড মানি
                        </span>
                        <h3 className="font-bold text-white text-xl">২০০০ টাকা অ্যাড মানি</h3>
                        <p className="text-indigo-100 text-sm">ব্যাংক বা কার্ড থেকে করলেই</p>
                    </div>
                    <div className="text-right">
                        <span className="block text-3xl font-black text-white drop-shadow-sm">২০৳</span>
                        <span className="text-xs text-indigo-100 font-medium">বোনাস</span>
                    </div>
                </div>
          </div>

           {/* Banner 4: Food (KFC) */}
           <div 
              onClick={() => setCurrentScreen(AppScreen.PAYMENT)}
              className="relative overflow-hidden bg-black rounded-2xl p-5 shadow-lg shadow-gray-300 group cursor-pointer transition-transform active:scale-[0.98]"
           >
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop')] bg-cover opacity-40 mix-blend-overlay"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
              
              <div className="relative z-10">
                  <div className="flex justify-between items-center mb-6">
                     <span className="bg-red-600 px-2.5 py-0.5 rounded text-[10px] font-bold text-white inline-block">
                          ফুড অফার
                      </span>
                      <div className="bg-white/10 backdrop-blur-sm p-1.5 rounded-lg">
                        <Utensils className="text-yellow-400 w-5 h-5" />
                      </div>
                  </div>
                  
                  <h3 className="font-bold text-white text-2xl leading-none">১টি কিনলে <br/><span className="text-red-500">১টি ফ্রি!</span></h3>
                  <p className="text-gray-300 text-xs mt-2">KFC-তে নির্দিষ্ট বার্গার এবং মিল অর্ডারে</p>
              </div>
          </div>

       </div>
    </div>
  );

  const renderScan = () => (
    <div className="flex flex-col h-full bg-black text-white relative animate-in fade-in">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 pt-[calc(env(safe-area-inset-top)+1rem)] px-4 pb-4 z-20 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
         <button onClick={() => setCurrentScreen(AppScreen.HOME)} className="p-2 bg-white/20 rounded-full backdrop-blur-md active:scale-95 transition-transform">
            <X className="w-6 h-6 text-white" />
         </button>
         <h3 className="font-bold text-lg tracking-wide">QR স্ক্যান করুন</h3>
         <div className="w-10"></div>
      </div>

      {/* Camera View */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-gray-900">
         <video 
            ref={videoRef}
            autoPlay 
            playsInline
            muted 
            className="absolute inset-0 w-full h-full object-cover"
         />
         
         {/* Scan Frame */}
         <div 
            onClick={simulateScan}
            className="relative z-10 w-64 h-64 border-2 border-rose-500 rounded-3xl shadow-[0_0_0_9999px_rgba(0,0,0,0.7)] flex items-center justify-center cursor-pointer active:scale-95 transition-transform group"
         >
             <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-rose-500 -mt-1 -ml-1 rounded-tl-2xl"></div>
             <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-rose-500 -mt-1 -mr-1 rounded-tr-2xl"></div>
             <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-rose-500 -mb-1 -ml-1 rounded-bl-2xl"></div>
             <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-rose-500 -mb-1 -mr-1 rounded-br-2xl"></div>
             
             {/* Scanning Animation */}
             <div className="absolute top-0 left-0 w-full h-0.5 bg-rose-500 shadow-[0_0_15px_#f43f5e] animate-pulse top-1/2"></div>
             
             <div className="absolute -bottom-16 text-center">
                 <p className="text-sm font-medium text-white/90 bg-black/40 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/10 group-hover:bg-rose-600/80 transition-colors">
                     পেমেন্ট করতে ট্যাপ করুন
                 </p>
             </div>
         </div>
      </div>
    </div>
  );

  const renderTransactionFlow = () => {
    const config = getScreenConfig();
    
    return (
    <div className="flex flex-col h-full bg-gray-50 animate-in slide-in-from-right duration-300">
      <div className="bg-white px-4 pb-4 pt-[calc(env(safe-area-inset-top)+1rem)] flex items-center justify-between shadow-sm sticky top-0 z-20">
        <div className="flex items-center">
            <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-full mr-2 -ml-2 transition-colors">
            <ArrowLeft className="text-gray-700 w-6 h-6" />
            </button>
            <h1 className="font-bold text-xl text-gray-800">{config.title}</h1>
        </div>
        <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 font-bold text-xs">
            {transactionStep}/3
        </div>
      </div>

      <div className="flex-1 p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
         {/* Step Indicator */}
         <div className="w-full bg-gray-200 h-1.5 rounded-full mb-8 overflow-hidden">
            <div 
                className="h-full bg-rose-600 transition-all duration-500 ease-out rounded-full" 
                style={{ width: `${(transactionStep / 3) * 100}%` }}
            ></div>
         </div>

         <div className="bg-white p-6 rounded-3xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-gray-100">
           {transactionStep === 1 && (
             <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
               <label className="block text-sm font-semibold text-gray-600 mb-3">{config.label}</label>
               <div className="relative">
                 <input 
                    type="tel" 
                    placeholder={config.operatorPrefix ? "01XXXXXXXXX" : ""}
                    value={formData.recipient}
                    onChange={e => setFormData({...formData, recipient: e.target.value})}
                    className="w-full text-xl font-semibold border-b-2 border-gray-200 focus:border-rose-500 outline-none py-3 px-1 placeholder-gray-300 bg-transparent text-gray-800 transition-colors"
                    autoFocus
                 />
                 {formData.recipient && (
                     <button onClick={() => setFormData({...formData, recipient: ''})} className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600">
                         <X size={18} />
                     </button>
                 )}
               </div>
               <div className="mt-8">
                <button 
                    onClick={() => formData.recipient.length > 3 && setTransactionStep(2)}
                    disabled={formData.recipient.length < 3}
                    className="w-full bg-rose-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-rose-200 hover:shadow-xl hover:bg-rose-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:shadow-none"
                >
                    পরবর্তী ধাপ
                </button>
               </div>
             </div>
           )}

           {transactionStep === 2 && (
             <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="flex items-center justify-between mb-8 bg-rose-50 p-4 rounded-2xl border border-rose-100">
                 <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 font-bold">
                        {formData.recipient.substring(0,2)}
                    </div>
                    <div>
                        <div className="text-xs text-gray-500 font-medium">{config.label === 'প্রাপক নম্বর' ? 'প্রাপক' : config.label}</div>
                        <div className="font-bold text-gray-800 line-clamp-1 break-all">{formData.recipient}</div>
                    </div>
                 </div>
                 <button onClick={() => setTransactionStep(1)} className="text-rose-600 text-xs font-bold px-3 py-1 bg-white rounded-full shadow-sm shrink-0">পরিবর্তন</button>
               </div>
               
               <label className="block text-center text-sm font-medium text-gray-500 mb-4">টাকার পরিমাণ দিন</label>
               <div className="relative mb-4 flex justify-center items-center">
                 <span className="text-4xl font-bold text-gray-800 mr-1">৳</span>
                 <input 
                   type="number" 
                   placeholder="0"
                   value={formData.amount}
                   onChange={e => setFormData({...formData, amount: e.target.value})}
                   className="w-40 text-center text-5xl font-bold border-b-2 border-transparent focus:border-rose-500 outline-none py-2 placeholder-gray-200 bg-transparent text-rose-600"
                   autoFocus
                 />
               </div>
               <p className="text-center text-gray-500 text-sm mb-8 bg-gray-100 inline-block mx-auto px-4 py-1 rounded-full">বর্তমান ব্যালেন্স: ৳ {user.balance.toLocaleString('bn-BD')}</p>
               
               {/* Quick Amount Chips */}
               <div className="flex justify-center gap-3 mb-8">
                   {[500, 1000, 2000].map(amt => (
                       <button 
                        key={amt}
                        onClick={() => setFormData({...formData, amount: amt.toString()})}
                        className="px-4 py-2 rounded-full border border-gray-200 text-sm font-medium text-gray-600 hover:border-rose-500 hover:text-rose-600 transition-colors"
                       >
                           ৳{amt}
                       </button>
                   ))}
               </div>

               <button 
                 onClick={() => Number(formData.amount) > 0 && setTransactionStep(3)}
                 disabled={!formData.amount || Number(formData.amount) <= 0}
                 className="w-full bg-rose-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-rose-200 hover:shadow-xl hover:bg-rose-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:shadow-none"
               >
                 পরবর্তী ধাপ
               </button>
             </div>
           )}

           {transactionStep === 3 && (
             <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="mb-6 text-left bg-gray-50 p-5 rounded-2xl space-y-3 border border-gray-100 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-20 h-20 bg-rose-100 rounded-full -mr-10 -mt-10 opacity-50"></div>
                 
                 <div className="flex justify-between text-sm text-gray-600 relative z-10"><span>প্রাপক/হিসাব</span> <span className="font-bold text-gray-800 font-mono break-all pl-2">{formData.recipient}</span></div>
                 <div className="flex justify-between text-sm text-gray-600 relative z-10"><span>পরিমাণ</span> <span className="font-bold text-gray-800 font-mono">৳ {formData.amount}</span></div>
                 <div className="flex justify-between text-sm text-gray-600 relative z-10"><span>চার্জ</span> <span className="font-bold text-emerald-600">ফ্রি</span></div>
                 <div className="my-2 border-t border-gray-200 border-dashed"></div>
                 <div className="flex justify-between text-lg pt-1 text-rose-600 font-black relative z-10"><span>সর্বমোট</span> <span className="font-mono">৳ {formData.amount}</span></div>
               </div>
               
               <div className="mb-8">
                  <label className="block text-left text-sm font-medium text-gray-500 mb-2 ml-1">পিন নম্বর</label>
                  <input 
                    type="password" 
                    placeholder="****"
                    maxLength={4}
                    value={formData.pin}
                    onChange={e => setFormData({...formData, pin: e.target.value})}
                    className="w-full text-center text-3xl tracking-[0.5em] border-b-2 border-gray-200 focus:border-rose-500 outline-none py-3 placeholder-gray-200 bg-transparent text-gray-800 font-bold"
                  />
               </div>

               {formData.pin.length === 4 ? (
                  <HoldToConfirm onConfirm={executeTransaction} label="নিশ্চিত করতে ধরে রাখুন" />
               ) : (
                 <div className="h-24 flex items-center justify-center">
                     <p className="text-gray-400 text-sm bg-gray-100 px-4 py-2 rounded-full">লেনদেন নিশ্চিত করতে পিন দিন</p>
                 </div>
               )}
             </div>
           )}
         </div>
      </div>
    </div>
  )};

  const renderSuccess = () => {
     const config = getScreenConfig();
     return (
     <div className="flex flex-col items-center justify-center h-full bg-white p-8 pb-[calc(2rem+env(safe-area-inset-bottom))] animate-in zoom-in duration-500">
        <div className="relative mb-8">
            <div className="absolute inset-0 bg-emerald-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
            <div className="w-28 h-28 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-200 relative z-10">
                <svg className="w-12 h-12 text-white drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
            </div>
            {/* Confetti dots */}
            <div className="absolute -top-2 -left-2 w-3 h-3 bg-yellow-400 rounded-full animate-bounce delay-100"></div>
            <div className="absolute top-10 -right-4 w-2 h-2 bg-rose-400 rounded-full animate-bounce delay-300"></div>
            <div className="absolute -bottom-2 left-4 w-3 h-3 bg-blue-400 rounded-full animate-bounce delay-500"></div>
        </div>
        
        <h2 className="text-3xl font-black text-gray-800 mb-2">সফল হয়েছে!</h2>
        <p className="text-gray-500 mb-10 text-center max-w-[250px] leading-relaxed">
            আপনার <span className="font-bold text-gray-800">৳{formData.amount}</span> {config.title} সফলভাবে সম্পন্ন হয়েছে।
        </p>
        
        <div className="w-full bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
           <div className="flex justify-between mb-3"><span className="text-gray-500 text-sm">প্রাপক/হিসাব</span> <span className="font-bold text-gray-800">{formData.recipient}</span></div>
           <div className="flex justify-between mb-3"><span className="text-gray-500 text-sm">ট্রানজেকশন আইডি</span> <span className="font-mono font-bold text-gray-800 text-xs bg-white px-2 py-1 rounded border border-gray-200">{transactions[0].id}</span></div>
           <div className="flex justify-between"><span className="text-gray-500 text-sm">সময়</span> <span className="font-bold text-gray-800 text-sm">{transactions[0].date}</span></div>
        </div>

        <button 
          onClick={() => {
            setTransactionStep(1);
            setFormData({ recipient: '', amount: '', reference: '', pin: '' });
            setCurrentScreen(AppScreen.HOME);
          }}
          className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold shadow-xl hover:bg-black transition-all"
        >
          হোম এ ফিরে যান
        </button>
     </div>
  )};

  const renderTransactions = () => (
    <div className="flex flex-col h-full bg-[#f8f9fa] animate-in fade-in relative overflow-hidden">
      {/* Decorative Background Elements for Glass Effect */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[30%] bg-purple-200/30 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] left-[-10%] w-[50%] h-[30%] bg-rose-200/30 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="bg-white/70 backdrop-blur-lg px-4 pb-4 pt-[calc(env(safe-area-inset-top)+1rem)] flex items-center shadow-sm sticky top-0 z-20 border-b border-white/30">
        <button onClick={() => setCurrentScreen(AppScreen.HOME)} className="p-2 hover:bg-black/5 rounded-full mr-2 -ml-2 transition-colors">
          <ArrowLeft className="text-gray-700 w-6 h-6" />
        </button>
        <h1 className="font-bold text-xl text-gray-800">লেনদেন সমূহ</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto p-5 pb-[calc(7rem+env(safe-area-inset-bottom))] space-y-4 relative z-10">
         {transactions.map((txn, index) => (
           <div 
                key={txn.id} 
                className="bg-white/60 backdrop-blur-xl p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 flex justify-between items-center hover:bg-white/70 transition-all duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center space-x-4">
                 <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center border shadow-sm
                    ${['RECEIVED_MONEY', 'ADD_MONEY'].includes(txn.type) ? 'bg-emerald-50/80 border-emerald-100 text-emerald-600' : 'bg-gray-50/80 border-gray-200 text-gray-500'}
                 `}>
                    <span className="font-bold text-sm">{txn.recipientName?.substring(0,2) || 'Tx'}</span>
                 </div>
                 <div>
                    <h4 className="font-bold text-gray-800 text-base">{txn.recipientName || txn.type}</h4>
                    <div className="flex items-center text-xs text-gray-500 mt-1 gap-2">
                        <span className="bg-white/50 px-1.5 py-0.5 rounded text-gray-500 font-medium border border-gray-100">{txn.type.split('_')[0]}</span>
                        <span>•</span>
                        <span>{txn.date}</span>
                    </div>
                 </div>
              </div>
              <div className="text-right">
                 <p className={`font-bold text-lg font-mono ${['RECEIVED_MONEY', 'ADD_MONEY'].includes(txn.type) ? 'text-emerald-600' : 'text-gray-800'}`}>
                    {['RECEIVED_MONEY', 'ADD_MONEY'].includes(txn.type) ? '+' : '-'}৳{txn.amount.toLocaleString('bn-BD')}
                 </p>
              </div>
           </div>
         ))}
      </div>
    </div>
  );

  const renderSettings = () => (
      <div className="flex flex-col h-full bg-gray-50 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="bg-white px-4 pb-4 pt-[calc(env(safe-area-inset-top)+1rem)] flex items-center shadow-sm sticky top-0 z-20">
            <button onClick={() => setCurrentScreen(AppScreen.HOME)} className="p-2 hover:bg-gray-100 rounded-full mr-2 -ml-2 transition-colors">
            <ArrowLeft className="text-gray-700 w-6 h-6" />
            </button>
            <h1 className="font-bold text-xl text-gray-800">সেটিংস</h1>
        </div>

        <div className="p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <h2 className="text-gray-800 font-bold mb-4 flex items-center gap-2">
                    <SettingsIcon size={20} className="text-rose-600" />
                    নোটিফিকেশন প্রিফারেন্স
                </h2>

                {/* Transaction Alert Toggle */}
                <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                    <div>
                        <p className="font-medium text-gray-800">লেনদেন অ্যালার্ট</p>
                        <p className="text-xs text-gray-400">টাকা পাঠানো বা গ্রহণের নোটিফিকেশন</p>
                    </div>
                    <button
                        onClick={() => setNotificationPrefs(p => ({...p, transactions: !p.transactions}))}
                        className={`w-12 h-6 rounded-full transition-colors relative ${notificationPrefs.transactions ? 'bg-rose-500' : 'bg-gray-300'}`}
                    >
                        <div className={`w-4 h-4 bg-white rounded-full shadow-md absolute top-1 transition-transform ${notificationPrefs.transactions ? 'left-7' : 'left-1'}`}></div>
                    </button>
                </div>

                 {/* Offers Toggle */}
                <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                    <div>
                        <p className="font-medium text-gray-800">অফার সমূহ</p>
                        <p className="text-xs text-gray-400">নতুন অফার এবং ডিসকাউন্ট আপডেট</p>
                    </div>
                    <button
                        onClick={() => setNotificationPrefs(p => ({...p, offers: !p.offers}))}
                        className={`w-12 h-6 rounded-full transition-colors relative ${notificationPrefs.offers ? 'bg-rose-500' : 'bg-gray-300'}`}
                    >
                        <div className={`w-4 h-4 bg-white rounded-full shadow-md absolute top-1 transition-transform ${notificationPrefs.offers ? 'left-7' : 'left-1'}`}></div>
                    </button>
                </div>

                {/* Security Toggle */}
                <div className="flex items-center justify-between py-3">
                    <div>
                        <p className="font-medium text-gray-800">সিকিউরিটি অ্যালার্ট</p>
                        <p className="text-xs text-gray-400">লগইন এবং পাসওয়ার্ড পরিবর্তন সতর্কতা</p>
                    </div>
                    <button
                        onClick={() => setNotificationPrefs(p => ({...p, securityAlerts: !p.securityAlerts}))}
                        className={`w-12 h-6 rounded-full transition-colors relative ${notificationPrefs.securityAlerts ? 'bg-rose-500' : 'bg-gray-300'}`}
                    >
                        <div className={`w-4 h-4 bg-white rounded-full shadow-md absolute top-1 transition-transform ${notificationPrefs.securityAlerts ? 'left-7' : 'left-1'}`}></div>
                    </button>
                </div>
            </div>

            {/* Logout Button */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 text-rose-600 font-bold py-2 rounded-xl bg-rose-50 hover:bg-rose-100 transition-colors"
                >
                   <LogOut size={20} /> লগ আউট করুন
                </button>
            </div>

             {/* Version Info */}
            <div className="text-center mt-2">
                <p className="text-gray-400 text-xs">SPay অ্যাপ ভার্সন ১.০.০</p>
            </div>
        </div>
      </div>
  );

  // Helper component for arrow right in login button
  const ArrowRightIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  );

  // --- MAIN RENDER ---
  return (
    <div className="min-h-screen flex justify-center bg-gray-100 font-sans selection:bg-rose-100">
      <div className="w-full max-w-md bg-[#FAFAFA] h-screen shadow-2xl shadow-gray-300 relative overflow-hidden flex flex-col border-x border-white">
        
        {/* Screen Content */}
        <div className="flex-1 overflow-y-auto scroll-smooth no-scrollbar">
          {currentScreen === AppScreen.LOGIN && renderLogin()}
          {currentScreen === AppScreen.REGISTER && renderRegister()}
          {currentScreen === AppScreen.HOME && renderHome()}
          {[
            AppScreen.SEND_MONEY, 
            AppScreen.CASH_OUT, 
            AppScreen.MOBILE_RECHARGE, 
            AppScreen.PAYMENT, 
            AppScreen.ADD_MONEY,
            AppScreen.REQUEST_MONEY,
            AppScreen.PAY_BILL,
            AppScreen.TRANSFER_TO_BANK
          ].includes(currentScreen) && renderTransactionFlow()}
          {currentScreen === AppScreen.TRANSACTIONS && renderTransactions()}
          {currentScreen === AppScreen.SUCCESS && renderSuccess()}
          {currentScreen === AppScreen.SETTINGS && renderSettings()}
          {currentScreen === AppScreen.SCAN && renderScan()}
          {currentScreen === AppScreen.OFFERS && renderOffers()}
        </div>

        {/* Navigation */}
        {(currentScreen === AppScreen.HOME || currentScreen === AppScreen.TRANSACTIONS || currentScreen === AppScreen.OFFERS) && (
          <BottomNav currentScreen={currentScreen} onNavigate={setCurrentScreen} />
        )}

        {/* AI Assistant Modal */}
        {currentScreen === AppScreen.AI_CHAT && (
          <AIAssistant 
            user={user} 
            transactions={transactions} 
            onClose={() => setCurrentScreen(AppScreen.HOME)} 
          />
        )}

      </div>
    </div>
  );
};

export default App;