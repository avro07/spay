import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ChevronRight, ArrowUpRight, CreditCard, Wallet, X, Bell, Shield, Settings as SettingsIcon, FileText, Landmark, ShoppingBag, Utensils, LogOut, Lock, User as UserIcon, Phone, Eye, EyeOff, QrCode as QrCodeIcon, Signal, Globe, UserCog, Contact as ContactIcon, ArrowRightLeft, Zap, Flame, Droplet, Tv, ShieldCheck, Car, MoreHorizontal, ScrollText, BarChart3, ScanLine, ArrowRight, Loader2 } from 'lucide-react';
import BalanceHeader from './components/BalanceHeader';
import ActionGrid from './components/ActionGrid';
import BottomNav from './components/BottomNav';
import AIAssistant from './components/AIAssistant';
import HoldToConfirm from './components/HoldToConfirm';
import OfferCarousel from './components/OfferCarousel';
import NumericKeypad from './components/NumericKeypad';
import AdminDashboard from './components/AdminDashboard';
import TransactionDetails from './components/TransactionDetails';
import { AppScreen, User, Transaction, SendMoneyFormData, NotificationPreferences, Language, Contact } from './types';
import { INITIAL_USER, MOCK_TRANSACTIONS, TRANSLATIONS, MOCK_USERS_DB, MOCK_CONTACTS } from './constants';

const App: React.FC = () => {
  // Start at LOGIN screen
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.LOGIN);
  const [user, setUser] = useState<User>(INITIAL_USER);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Contacts Permission Simulation
  const [contactsPermission, setContactsPermission] = useState(false);
  
  // Language State
  const [language, setLanguage] = useState<Language>('bn');
  const t = TRANSLATIONS[language];

  // Login/Register Form State
  const [loginPhone, setLoginPhone] = useState(INITIAL_USER.phone);
  const [loginPin, setLoginPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [registerData, setRegisterData] = useState({ name: '', phone: '', pin: '', confirmPin: '' });
  
  // Admin Login State
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  // Keypad State
  const [activeInput, setActiveInput] = useState<'LOGIN_PIN' | 'AMOUNT' | 'TXN_PIN' | null>(null);

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
    pin: '',
    mfsProvider: 'Bkash'
  });
  
  // Derived state for recipient name lookup
  const [recipientNameDisplay, setRecipientNameDisplay] = useState<string>('');

  // Check for admin URL parameter on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const path = window.location.pathname;
    if (params.get('mode') === 'admin' || path === '/spay-admin') {
      setIsAdminMode(true);
    }
  }, []);
  
  // Lookup recipient name when number changes
  useEffect(() => {
    if (formData.recipient.length === 11) {
        const foundUser = MOCK_USERS_DB.find(u => u.phone === formData.recipient);
        if (foundUser) {
            setRecipientNameDisplay(foundUser.name);
        } else {
             // Look in contacts
            const foundContact = MOCK_CONTACTS.find(c => c.phone === formData.recipient);
            setRecipientNameDisplay(foundContact ? foundContact.name : '');
        }
    } else {
        setRecipientNameDisplay('');
    }
  }, [formData.recipient]);

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
      case AppScreen.ADMIN_DASHBOARD:
        color = '#0f172a'; // Slate-900 for admin
        break;
      case AppScreen.PAY_BILL:
         if (transactionStep === 0) color = '#e11d48'; // Header color for Pay Bill Dashboard
         else color = '#ffffff';
         break;
      case AppScreen.SETTINGS:
      case AppScreen.SUCCESS:
      case AppScreen.SEND_MONEY:
      case AppScreen.CASH_OUT:
      case AppScreen.MOBILE_RECHARGE:
      case AppScreen.PAYMENT:
      case AppScreen.ADD_MONEY:
      case AppScreen.MFS_TRANSFER:
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
  }, [currentScreen, transactionStep]);

  // Reset keypad when screen changes
  useEffect(() => {
    setActiveInput(null);
  }, [currentScreen, transactionStep]);

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

  // Keypad Handlers
  const handleKeypadPress = (val: string) => {
    if (activeInput === 'LOGIN_PIN') {
       if (loginPin.length < 4) setLoginPin(prev => prev + val);
    } else if (activeInput === 'AMOUNT') {
       if (formData.amount === '0') setFormData(prev => ({...prev, amount: val}));
       else setFormData(prev => ({...prev, amount: prev.amount + val}));
    } else if (activeInput === 'TXN_PIN') {
       if (formData.pin.length < 4) setFormData(prev => ({...prev, pin: prev.pin + val}));
    }
  };

  const handleKeypadDelete = () => {
    if (activeInput === 'LOGIN_PIN') {
       setLoginPin(prev => prev.slice(0, -1));
    } else if (activeInput === 'AMOUNT') {
       setFormData(prev => ({...prev, amount: prev.amount.slice(0, -1)}));
    } else if (activeInput === 'TXN_PIN') {
       setFormData(prev => ({...prev, pin: prev.pin.slice(0, -1)}));
    }
  };

  const handleKeypadDone = () => {
     setActiveInput(null);
     // Auto trigger next steps logic if applicable
     if (activeInput === 'LOGIN_PIN' && loginPin.length === 4) handleLogin();
  };

  // Auth Handlers
  const handleLogin = () => {
    if (loginPin.length >= 4) {
      // Simple mock validation
      if (loginPin === '6175') {
        setCurrentScreen(AppScreen.HOME);
        setLoginPin(''); // Clear pin for security
        setActiveInput(null);
      } else {
        alert("ভুল পিন নম্বর (Demo PIN: 6175)");
      }
    }
  };

  const handleAdminLogin = () => {
    // Mock admin credentials
    if (adminUsername === 'admin' && adminPassword === '1234') {
      setCurrentScreen(AppScreen.ADMIN_DASHBOARD);
      setAdminUsername('');
      setAdminPassword('');
    } else {
      alert('ভুল ইউজারনেম বা পাসওয়ার্ড (User: admin, Pass: 1234)');
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
    setFormData({ recipient: '', amount: '', reference: '', pin: '', mfsProvider: 'Bkash' });
  };

  // Navigation Handler
  const handleNavigation = (screen: AppScreen) => {
    setCurrentScreen(screen);
    // For Pay Bill, start at dashboard (step 0), for others start at step 1
    setTransactionStep(screen === AppScreen.PAY_BILL ? 0 : 1);
    
    // Reset form data
    setFormData({ recipient: '', amount: '', reference: '', pin: '', mfsProvider: 'Bkash' });
    setRecipientNameDisplay('');
  };

  const handleNotificationClick = () => {
    alert('বর্তমানে আপনার কোনো নতুন নোটিফিকেশন নেই।');
  };

  // Simulate scanning a QR code
  const simulateScan = () => {
    // In a real app, this would be data parsed from the QR code
    const mockMerchantNumber = "01912345678";
    
    setFormData(prev => ({
      ...prev,
      recipient: mockMerchantNumber
    }));
    
    // Navigate to Payment screen and skip to amount input
    setCurrentScreen(AppScreen.PAYMENT);
    setTransactionStep(2);
  };

  // Helper for operator detection
  const getOperatorInfo = (phone: string) => {
    if (!phone || phone.length < 3) return null;
    const prefix = phone.substring(0, 3);
    
    switch (prefix) {
      case '017':
      case '013':
        return { name: 'Grameenphone', bg: 'bg-sky-500', text: 'text-white', short: 'GP' };
      case '019':
      case '014':
        return { name: 'Banglalink', bg: 'bg-orange-500', text: 'text-white', short: 'BL' };
      case '018':
        return { name: 'Robi', bg: 'bg-red-600', text: 'text-white', short: 'Robi' };
      case '016':
        return { name: 'Airtel', bg: 'bg-red-500', text: 'text-white', short: 'Air' };
      case '015':
        return { name: 'Teletalk', bg: 'bg-teal-600', text: 'text-white', short: 'TT' };
      default:
        return null;
    }
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
        return { title: 'পেমেন্ট', label: 'মার্চেন্ট নম্বর', type: 'PAYMENT' as const, operatorPrefix: false };
      case AppScreen.ADD_MONEY:
        return { title: 'অ্যাড মানি', label: 'ব্যাংক/কার্ড নম্বর', type: 'ADD_MONEY' as const, operatorPrefix: false };
      case AppScreen.PAY_BILL:
        return { title: 'পে বিল', label: 'বিল নম্বর/অ্যাকাউন্ট', type: 'PAY_BILL' as const, operatorPrefix: false };
      case AppScreen.TRANSFER_TO_BANK:
        return { title: 'SPay টু ব্যাংক', label: 'ব্যাংক অ্যাকাউন্ট নম্বর', type: 'TRANSFER_TO_BANK' as const, operatorPrefix: false };
      case AppScreen.MFS_TRANSFER:
        return { title: 'MFS ট্রান্সফার', label: 'প্রাপক নম্বর', type: 'MFS_TRANSFER' as const, operatorPrefix: true };
      default:
        return { title: 'লেনদেন', label: 'প্রাপক', type: 'SEND_MONEY' as const, operatorPrefix: true };
    }
  };

  // Utility to handle back navigation
  const handleBack = () => {
    setActiveInput(null);
    
    // For Pay Bill specific back logic
    if (currentScreen === AppScreen.PAY_BILL && transactionStep === 1) {
        setTransactionStep(0); // Go back to dashboard from input screen
        return;
    }

    if (transactionStep > 1) {
      setTransactionStep(prev => prev - 1);
    } else {
      setCurrentScreen(AppScreen.HOME);
      setTransactionStep(1);
      setFormData({ recipient: '', amount: '', reference: '', pin: '', mfsProvider: 'Bkash' });
      setRecipientNameDisplay('');
    }
  };
  
  // Handle Next Step with Validation
  const handleNextStep1 = () => {
    if (formData.recipient.length !== 11 && currentScreen !== AppScreen.ADD_MONEY && currentScreen !== AppScreen.PAY_BILL) return;

    // RULE: Cannot Send Money to Agent
    if (currentScreen === AppScreen.SEND_MONEY) {
        const foundUser = MOCK_USERS_DB.find(u => u.phone === formData.recipient);
        if (foundUser && foundUser.role === 'AGENT') {
            alert('এজেন্ট নম্বরে সেন্ড মানি করা সম্ভব নয়। ক্যাশ আউট অপশন ব্যবহার করুন।');
            return;
        }
    }

    setTransactionStep(2);
  };

  // Logic to execute transaction
  const executeTransaction = () => {
    const config = getScreenConfig();
    const amount = parseFloat(formData.amount);
    let finalAmountToDeduct = amount;
    let fee = 0;
    
    // CASH OUT LOGIC: 1% Total Fee
    if (config.type === 'CASH_OUT') {
        fee = amount * 0.01;
        finalAmountToDeduct = amount + fee;
    }

    // MFS TRANSFER LOGIC: 0.85% Fee
    if (config.type === 'MFS_TRANSFER') {
        fee = amount * 0.0085; // 0.85%
        finalAmountToDeduct = amount + fee;
    }
    
    // Balance check for debit transactions
    if (config.type !== 'ADD_MONEY' && finalAmountToDeduct > user.balance) {
       alert(`অপর্যাপ্ত ব্যালেন্স। চার্জ সহ প্রয়োজন ৳${finalAmountToDeduct.toFixed(2)}`);
       return;
    }

    const newTxn: Transaction = {
      id: `TXN${Date.now()}`,
      type: config.type,
      amount: amount,
      recipientName: recipientNameDisplay || formData.recipient,
      date: 'এইমাত্র',
      description: config.type === 'MFS_TRANSFER' ? `${formData.mfsProvider} ট্রান্সফার` : (formData.reference || config.title),
      fee: fee > 0 ? fee : undefined,
      mfsProvider: formData.mfsProvider
    };

    setTransactions([newTxn, ...transactions]);
    
    // Update balance
    if (config.type === 'ADD_MONEY') {
        setUser(prev => ({ ...prev, balance: prev.balance + amount }));
    } else {
        // Deduct amount + fee
        setUser(prev => ({ ...prev, balance: prev.balance - finalAmountToDeduct }));
    }

    setCurrentScreen(AppScreen.SUCCESS);
  };

  // --- RENDER HELPERS ---

  const renderLogin = () => (
    <div className="flex flex-col min-h-full bg-gradient-to-br from-rose-600 to-pink-700 animate-in fade-in overflow-hidden relative">
        <div className="h-[35vh] flex flex-col items-center justify-end pb-8 text-white shrink-0">
            <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-rose-900/30 border border-white/50 p-1">
                 <img src="https://c.beoo.net/Files/3.jpg" alt="Logo" className="w-full h-full object-contain rounded-2xl" />
            </div>
            <h1 className="text-2xl font-bold mb-1">{isAdminMode ? 'অ্যাডমিন প্যানেল' : 'স্বাগতম!'}</h1>
            <p className="text-rose-100 text-xs">{isAdminMode ? 'সিস্টেম কন্ট্রোল সেন্টার' : 'আপনার নিরাপদ লেনদেনের সাথী'}</p>
        </div>

        <div className="flex-1 bg-white rounded-t-[30px] p-6 pb-[calc(2rem+env(safe-area-inset-bottom))] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.3)] animate-in slide-in-from-bottom duration-500 flex flex-col">
             
             {isAdminMode ? (
                // ADMIN LOGIN FORM
                <div className="space-y-4 animate-in fade-in">
                    <div>
                         <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">ইউজারনেম</label>
                         <div className="relative">
                             <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                 <UserIcon size={18} />
                             </div>
                             <input 
                                type="text"
                                value={adminUsername}
                                onChange={(e) => setAdminUsername(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-11 pr-4 font-medium text-gray-800 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all text-sm"
                                placeholder="Username"
                             />
                         </div>
                     </div>

                     <div>
                         <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">পাসওয়ার্ড</label>
                         <div className="relative">
                             <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                 <Lock size={18} />
                             </div>
                             <input 
                                type="password"
                                value={adminPassword}
                                onChange={(e) => setAdminPassword(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-11 pr-4 font-bold text-gray-800 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all text-sm"
                                placeholder="Password"
                             />
                         </div>
                     </div>

                     <button 
                        onClick={handleAdminLogin}
                        className="w-full bg-slate-800 text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-slate-900 transition-all flex items-center justify-center gap-2 text-sm mt-2"
                     >
                         লগ ইন <ArrowRight className="w-4 h-4" />
                     </button>
                    
                    <div className="bg-slate-100 p-3 rounded-lg border border-slate-200 text-center">
                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wide mb-1">Demo Credentials</p>
                        <p className="text-xs text-slate-700 font-mono">User: <span className="font-bold">admin</span> | Pass: <span className="font-bold">1234</span></p>
                    </div>

                     <div className="text-center mt-4">
                        <button 
                           onClick={() => {
                              setIsAdminMode(false);
                              setAdminUsername('');
                              setAdminPassword('');
                              const url = new URL(window.location.href);
                              url.searchParams.delete('mode');
                              window.history.replaceState({}, '', url);
                           }}
                           className="text-slate-400 text-xs font-medium hover:text-rose-600 transition-colors flex items-center justify-center gap-1 mx-auto"
                        >
                           <ArrowLeft size={14} /> ইউজার লগইনে ফিরে যান
                        </button>
                    </div>
                </div>
             ) : (
                // USER LOGIN FORM
                <div className="space-y-4 animate-in fade-in flex flex-col h-full">
                     <div>
                         <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">মোবাইল নম্বর</label>
                         <div className="relative">
                             <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                 <Phone size={18} />
                             </div>
                             <input 
                                type="tel"
                                value={loginPhone}
                                onChange={(e) => setLoginPhone(e.target.value)}
                                onFocus={() => setActiveInput(null)} // System keyboard for phone
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 font-semibold text-gray-800 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all text-sm"
                                placeholder="01XXXXXXXXX"
                             />
                         </div>
                     </div>

                     <div>
                         <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">পিন নম্বর</label>
                         <div className="relative">
                             <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                 <Lock size={18} />
                             </div>
                             <input 
                                type={showPin ? "text" : "password"}
                                value={loginPin}
                                readOnly // Prevent system keyboard
                                onClick={() => setActiveInput('LOGIN_PIN')}
                                className={`w-full bg-gray-50 border rounded-xl py-3.5 pl-11 pr-11 font-bold text-gray-800 focus:outline-none transition-all tracking-widest cursor-pointer text-sm ${activeInput === 'LOGIN_PIN' ? 'border-rose-500 ring-1 ring-rose-500 bg-white' : 'border-gray-200'}`}
                                placeholder="****"
                             />
                             <button 
                                onClick={(e) => { e.stopPropagation(); setShowPin(!showPin); }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                             >
                                 {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
                             </button>
                         </div>
                         <div className="flex justify-end mt-2">
                            <button className="text-[10px] text-rose-600 font-semibold hover:underline">পিন ভুলে গেছেন?</button>
                         </div>
                     </div>

                     <button 
                        onClick={handleLogin}
                        className="w-full bg-rose-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-rose-200 hover:bg-rose-700 hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm"
                     >
                         লগ ইন <ArrowRight className="w-4 h-4" />
                     </button>

                     <div className="text-center mt-4">
                         <p className="text-gray-500 text-xs">
                             অ্যাকাউন্ট নেই? <button onClick={() => setCurrentScreen(AppScreen.REGISTER)} className="text-rose-600 font-bold hover:underline">রেজিস্ট্রেশন করুন</button>
                         </p>
                     </div>
                 </div>
             )}
        </div>
    </div>
  );

  const renderRegister = () => (
    <div className="flex flex-col min-h-full bg-white animate-in slide-in-from-right duration-300">
        <div className="bg-rose-600 px-5 pt-10 pb-6 rounded-b-[30px] shadow-lg relative z-10 shrink-0">
            <button onClick={() => setCurrentScreen(AppScreen.LOGIN)} className="absolute top-10 left-4 p-2 bg-white/20 rounded-full text-white backdrop-blur-md">
                <ArrowLeft size={18} />
            </button>
            <h1 className="text-xl font-bold text-white mt-8">নতুন অ্যাকাউন্ট</h1>
            <p className="text-rose-100 text-xs">SPay-তে রেজিস্ট্রেশন করুন</p>
        </div>

        <div className="flex-1 overflow-y-auto p-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] space-y-4">
             <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">আপনার নাম</label>
                <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <UserIcon size={18} />
                    </div>
                    <input 
                    type="text"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                    onFocus={() => setActiveInput(null)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 font-medium text-gray-800 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all text-sm"
                    placeholder="আপনার পূর্ণ নাম"
                    />
                </div>
            </div>
             <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">মোবাইল নম্বর</label>
                <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <Phone size={18} />
                    </div>
                    <input 
                    type="tel"
                    value={registerData.phone}
                    onChange={(e) => setRegisterData({...registerData, phone: e.target.value})}
                    onFocus={() => setActiveInput(null)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 font-semibold text-gray-800 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all text-sm"
                    placeholder="01XXXXXXXXX"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">পিন নম্বর</label>
                    <input 
                        type="password"
                        maxLength={4}
                        value={registerData.pin}
                        onChange={(e) => setRegisterData({...registerData, pin: e.target.value})}
                        onFocus={() => setActiveInput(null)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 px-4 font-bold text-center text-gray-800 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all text-sm"
                        placeholder="****"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">কনফার্ম পিন</label>
                    <input 
                        type="password"
                        maxLength={4}
                        value={registerData.confirmPin}
                        onChange={(e) => setRegisterData({...registerData, confirmPin: e.target.value})}
                        onFocus={() => setActiveInput(null)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 px-4 font-bold text-center text-gray-800 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all text-sm"
                        placeholder="****"
                    />
                </div>
            </div>

            <div className="pt-2">
                <button 
                    onClick={handleRegister}
                    className="w-full bg-gray-900 text-white font-bold py-3.5 rounded-xl shadow-xl hover:bg-black active:scale-[0.98] transition-all text-sm"
                >
                    রেজিস্ট্রেশন করুন
                </button>
            </div>
            
            <p className="text-center text-[10px] text-gray-400 mt-2 leading-relaxed px-4">
                রেজিস্ট্রেশন করার মাধ্যমে আপনি SPay এর <span className="text-rose-600 font-bold">শর্তাবলী</span> এবং <span className="text-rose-600 font-bold">গোপনীয়তা নীতি</span> তে সম্মত হচ্ছেন।
            </p>
        </div>
    </div>
  );

  const renderHome = () => (
    <div className="pb-[calc(5.5rem+env(safe-area-inset-bottom))] animate-in fade-in duration-500 relative min-h-full">
      {/* Background Ambient Blobs for Glass Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[20%] left-[-10%] w-72 h-72 bg-purple-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute top-[40%] right-[-10%] w-72 h-72 bg-yellow-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-[20%] left-[20%] w-72 h-72 bg-rose-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <BalanceHeader 
        user={user} 
        onProfileClick={() => alert('Profile Clicked')} 
        onNotificationClick={handleNotificationClick} 
        language={language}
      />
      
      <ActionGrid onNavigate={handleNavigation} language={language} />

      <div className="mt-6 px-4 relative z-10">
         <div className="flex justify-between items-center mb-3 px-1">
             <h3 className="font-bold text-gray-800 text-sm">{t.nav_offers}</h3>
             <button onClick={() => setCurrentScreen(AppScreen.OFFERS)} className="text-rose-600 text-xs font-bold hover:underline">{t.see_all}</button>
         </div>
         <OfferCarousel onNavigate={handleNavigation} />
      </div>

      <div className="mt-8 px-4 relative z-10">
         <div className="flex justify-between items-center mb-3 px-1">
             <h3 className="font-bold text-gray-800 text-sm">{t.recent_transactions}</h3>
             <button onClick={() => setCurrentScreen(AppScreen.TRANSACTIONS)} className="text-rose-600 text-xs font-bold hover:underline">{t.see_all}</button>
         </div>
         
         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
             {transactions.slice(0, 5).map((txn, idx) => (
                 <div 
                    key={txn.id} 
                    onClick={() => setSelectedTransaction(txn)}
                    className={`p-4 flex items-center justify-between active:bg-gray-50 transition-colors cursor-pointer ${idx !== transactions.length - 1 ? 'border-b border-gray-50' : ''}`}
                 >
                     <div className="flex items-center gap-3">
                         <div className={`w-10 h-10 rounded-full flex items-center justify-center ${['RECEIVED_MONEY', 'ADD_MONEY'].includes(txn.type) ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                             {['RECEIVED_MONEY', 'ADD_MONEY'].includes(txn.type) ? <ArrowUpRight className="rotate-180" size={18} /> : <ArrowUpRight size={18} />}
                         </div>
                         <div>
                             <h4 className="font-bold text-gray-800 text-sm">{txn.recipientName || txn.type}</h4>
                             <p className="text-xs text-gray-500 mt-0.5">{txn.type.replace('_', ' ')} • {txn.date}</p>
                         </div>
                     </div>
                     <span className={`font-bold text-sm ${['RECEIVED_MONEY', 'ADD_MONEY'].includes(txn.type) ? 'text-emerald-600' : 'text-gray-800'}`}>
                         {['RECEIVED_MONEY', 'ADD_MONEY'].includes(txn.type) ? '+' : '-'}৳{txn.amount}
                     </span>
                 </div>
             ))}
         </div>
      </div>
    </div>
  );

  const renderTransactionFlow = () => {
    const config = getScreenConfig();

    return (
      <div className="flex flex-col h-full bg-white animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-4 pt-[calc(env(safe-area-inset-top)+1rem)] pb-4 flex items-center gap-4 sticky top-0 z-20">
          <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-full -ml-2">
            <ArrowLeft className="text-gray-600 w-5 h-5" />
          </button>
          <div>
            <h1 className="font-bold text-gray-800 text-lg">{config.title}</h1>
            {transactionStep > 1 && (
               <p className="text-xs text-gray-400">স্টেপ {transactionStep} / 3</p>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 pb-[env(safe-area-inset-bottom)]">
          {transactionStep === 1 && (
            <div className="space-y-6">
                
                {config.type === 'MFS_TRANSFER' && (
                     <div>
                        <label className="block text-xs font-bold text-gray-600 mb-2">সার্ভিস সিলেক্ট করুন</label>
                        <div className="flex gap-3">
                            {['Bkash', 'Nagad', 'Rocket', 'Upay'].map(provider => (
                                <button
                                    key={provider}
                                    onClick={() => setFormData({...formData, mfsProvider: provider})}
                                    className={`flex-1 py-3 rounded-xl border font-bold text-xs transition-all ${formData.mfsProvider === provider ? 'border-rose-600 bg-rose-50 text-rose-600' : 'border-gray-200 bg-white text-gray-500'}`}
                                >
                                    {provider}
                                </button>
                            ))}
                        </div>
                     </div>
                )}

                <div>
                    <label className="block text-xs font-bold text-gray-600 mb-2">{config.label}</label>
                    <div className="relative">
                        <input
                            type="tel"
                            value={formData.recipient}
                            onChange={(e) => setFormData({...formData, recipient: e.target.value})}
                            onFocus={() => setActiveInput(null)}
                            className="w-full text-lg font-bold p-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none"
                            placeholder={config.operatorPrefix ? "01XXXXXXXXX" : "Account Number"}
                        />
                        {/* Recipient Lookup Result */}
                        {recipientNameDisplay && (
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded">{recipientNameDisplay}</span>
                                <CheckCircle size={16} className="text-emerald-500" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Contacts List Mockup */}
                {!contactsPermission ? (
                    <div className="bg-rose-50 rounded-xl p-4 flex items-center justify-between border border-rose-100" onClick={() => setContactsPermission(true)}>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-rose-600 shadow-sm">
                                <ContactIcon size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-rose-700 text-sm">কন্টাক্টস থেকে নিন</h3>
                                <p className="text-rose-400 text-[10px]">সহজেই নম্বর সিলেক্ট করতে ট্যাপ করুন</p>
                            </div>
                        </div>
                        <ChevronRight className="text-rose-400" size={18} />
                    </div>
                ) : (
                    <div className="space-y-2">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Saved Contacts</p>
                        {MOCK_CONTACTS.map(contact => (
                            <div 
                                key={contact.id} 
                                onClick={() => setFormData({...formData, recipient: contact.phone})}
                                className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl active:bg-gray-50"
                            >
                                <img src={contact.avatar} className="w-10 h-10 rounded-full" alt="" />
                                <div className="flex-1">
                                    <h4 className="font-bold text-sm text-gray-800">{contact.name}</h4>
                                    <p className="text-xs text-gray-400">{contact.phone}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
          )}

          {transactionStep === 2 && (
            <div className="flex flex-col items-center pt-8">
                 <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-4">
                     {config.type === 'MOBILE_RECHARGE' ? <Smartphone size={32} /> : 
                      config.type === 'SEND_MONEY' ? <Send size={32} /> :
                      config.type === 'CASH_OUT' ? <Download size={32} /> : <CreditCard size={32} />}
                 </div>
                 
                 <p className="text-sm text-gray-500 font-medium mb-1">{recipientNameDisplay || config.label}</p>
                 <p className="text-lg font-bold text-gray-800 mb-8">{formData.recipient}</p>

                 <div className="w-full max-w-xs relative mb-8">
                     <div className="absolute left-0 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">৳</div>
                     <input
                        type="text"
                        value={formData.amount}
                        readOnly
                        onClick={() => setActiveInput('AMOUNT')}
                        className={`w-full text-center text-4xl font-bold py-4 bg-transparent border-b-2 outline-none ${activeInput === 'AMOUNT' ? 'border-rose-500 text-rose-600' : 'border-gray-200 text-gray-800'}`}
                        placeholder="0"
                     />
                     <p className="text-center text-xs text-gray-400 mt-2">বর্তমান ব্যালেন্স: ৳{user.balance}</p>
                 </div>

                 <div className="w-full space-y-3">
                     {[50, 100, 500, 1000].map(amt => (
                         <button 
                            key={amt}
                            onClick={() => setFormData({...formData, amount: amt.toString()})}
                            className="mr-2 mb-2 px-4 py-2 rounded-full bg-gray-100 text-xs font-bold text-gray-600 hover:bg-gray-200"
                         >
                            ৳{amt}
                         </button>
                     ))}
                 </div>
            </div>
          )}

           {transactionStep === 3 && (
            <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-rose-50 rounded-bl-full -mr-4 -mt-4 z-0"></div>
                    <div className="relative z-10">
                        <div className="flex justify-between mb-4 pb-4 border-b border-gray-100">
                             <div>
                                 <p className="text-xs text-gray-500 mb-0.5">প্রাপক</p>
                                 <p className="font-bold text-gray-800">{recipientNameDisplay || 'Unknown'}</p>
                                 <p className="text-xs text-gray-400">{formData.recipient}</p>
                             </div>
                             <div className="text-right">
                                 <p className="text-xs text-gray-500 mb-0.5">পরিমাণ</p>
                                 <p className="font-bold text-rose-600 text-lg">৳{formData.amount}</p>
                             </div>
                        </div>
                        <div className="flex justify-between text-sm">
                             <span className="text-gray-500">চার্জ</span>
                             <span className="font-bold text-gray-800">
                                {config.type === 'CASH_OUT' ? `৳${(parseFloat(formData.amount) * 0.01).toFixed(2)}` : 
                                 config.type === 'MFS_TRANSFER' ? `৳${(parseFloat(formData.amount) * 0.0085).toFixed(2)}` : '৳0.00'}
                             </span>
                        </div>
                        <div className="flex justify-between text-sm mt-2 pt-2 border-t border-gray-100">
                             <span className="text-gray-500 font-bold">সর্বমোট</span>
                             <span className="font-bold text-rose-600">
                                ৳{(parseFloat(formData.amount) + (config.type === 'CASH_OUT' ? parseFloat(formData.amount) * 0.01 : config.type === 'MFS_TRANSFER' ? parseFloat(formData.amount) * 0.0085 : 0)).toFixed(2)}
                             </span>
                        </div>
                    </div>
                </div>
                
                <div className="pt-4">
                     <label className="block text-center text-xs font-bold text-gray-500 mb-3">পিন নম্বর দিয়ে নিশ্চিত করুন</label>
                     <div className="flex justify-center mb-8">
                        <input
                            type="password"
                            value={formData.pin}
                            readOnly
                            onClick={() => setActiveInput('TXN_PIN')}
                            className={`w-40 text-center text-3xl font-bold py-2 border-b-2 outline-none tracking-[0.5em] ${activeInput === 'TXN_PIN' ? 'border-rose-600 text-rose-600' : 'border-gray-300 text-gray-400'}`}
                            placeholder="****"
                        />
                     </div>
                     
                     {formData.pin.length === 4 && (
                         <div className="animate-in fade-in slide-in-from-bottom duration-500">
                            <HoldToConfirm onConfirm={executeTransaction} />
                         </div>
                     )}
                </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {transactionStep < 3 && (
            <div className="p-4 bg-white border-t border-gray-100 pb-[env(safe-area-inset-bottom)]">
                <button
                    onClick={transactionStep === 1 ? handleNextStep1 : () => setTransactionStep(3)}
                    disabled={
                        (transactionStep === 1 && formData.recipient.length < 3) || 
                        (transactionStep === 2 && (!formData.amount || parseFloat(formData.amount) < 10))
                    }
                    className="w-full bg-rose-600 disabled:bg-gray-300 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-rose-200 disabled:shadow-none transition-all flex items-center justify-center gap-2"
                >
                    পরবর্তী <ArrowRight size={18} />
                </button>
            </div>
        )}
      </div>
    );
  };

  const renderSuccess = () => (
      <div className="h-full flex flex-col items-center justify-center bg-white p-6 animate-in zoom-in duration-300 pb-[env(safe-area-inset-bottom)]">
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
              <CheckCircle className="text-emerald-500 w-12 h-12" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">লেনদেন সফল হয়েছে!</h2>
          <p className="text-gray-500 text-center mb-8 max-w-xs">
              আপনার <span className="font-bold text-gray-700">৳{formData.amount}</span> টাকার লেনদেনটি সম্পন্ন হয়েছে।
          </p>
          
          <div className="w-full bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-8 max-w-sm">
               <div className="flex justify-between mb-2">
                   <span className="text-gray-500 text-xs">নতুন ব্যালেন্স</span>
                   <span className="font-bold text-gray-800">৳{user.balance.toFixed(2)}</span>
               </div>
               <div className="flex justify-between">
                   <span className="text-gray-500 text-xs">ট্রানজেকশন আইডি</span>
                   <span className="font-mono text-xs text-gray-800">{transactions[0]?.id}</span>
               </div>
          </div>

          <button 
             onClick={() => {
                 setCurrentScreen(AppScreen.HOME);
                 setTransactionStep(1);
             }}
             className="bg-rose-600 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-rose-200 hover:bg-rose-700 transition-all"
          >
              হোম-এ ফিরে যান
          </button>
      </div>
  );

  const renderScan = () => (
      <div className="h-full bg-black flex flex-col relative overflow-hidden">
          <video 
             ref={videoRef} 
             autoPlay 
             playsInline 
             muted 
             className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          
          <div className="relative z-10 flex-1 flex flex-col">
              <div className="p-4 flex justify-between items-center">
                  <button onClick={() => setCurrentScreen(AppScreen.HOME)} className="p-2 bg-white/20 backdrop-blur rounded-full text-white">
                      <X size={20} />
                  </button>
                  <h1 className="text-white font-bold">QR স্ক্যান করুন</h1>
                  <button className="p-2 bg-white/20 backdrop-blur rounded-full text-white">
                      <Zap size={20} />
                  </button>
              </div>

              <div className="flex-1 flex items-center justify-center">
                  <div className="w-64 h-64 border-2 border-white/50 rounded-3xl relative">
                      <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-rose-500 rounded-tl-3xl -mt-1 -ml-1"></div>
                      <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-rose-500 rounded-tr-3xl -mt-1 -mr-1"></div>
                      <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-rose-500 rounded-bl-3xl -mb-1 -ml-1"></div>
                      <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-rose-500 rounded-br-3xl -mb-1 -mr-1"></div>
                      
                      <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-full h-0.5 bg-rose-500 shadow-[0_0_15px_rgba(225,29,72,0.8)] animate-scan-line"></div>
                      </div>
                  </div>
              </div>

              <div className="p-8 text-center pb-24">
                   <p className="text-white/80 text-sm mb-6">মার্চেন্ট বা পার্সোনাল QR কোড স্ক্যান করুন</p>
                   <button 
                      onClick={simulateScan}
                      className="bg-white text-black px-6 py-3 rounded-full font-bold text-sm shadow-lg active:scale-95 transition-transform"
                   >
                      গ্যালারি থেকে নিন
                   </button>
              </div>
          </div>
      </div>
  );

  return (
    <div className="h-full w-full bg-slate-50 relative overflow-hidden flex flex-col font-sans">
      {/* Screen Routing */}
      {currentScreen === AppScreen.LOGIN && renderLogin()}
      {currentScreen === AppScreen.REGISTER && renderRegister()}
      
      {currentScreen === AppScreen.HOME && renderHome()}
      {currentScreen === AppScreen.SCAN && renderScan()}
      {currentScreen === AppScreen.SUCCESS && renderSuccess()}
      
      {/* Transaction Screens */}
      {[AppScreen.SEND_MONEY, AppScreen.CASH_OUT, AppScreen.MOBILE_RECHARGE, AppScreen.PAYMENT, AppScreen.ADD_MONEY, AppScreen.PAY_BILL, AppScreen.MFS_TRANSFER, AppScreen.TRANSFER_TO_BANK].includes(currentScreen) && renderTransactionFlow()}

      {currentScreen === AppScreen.TRANSACTIONS && (
          <div className="h-full flex flex-col bg-white animate-in slide-in-from-right">
              <div className="bg-white border-b border-gray-100 p-4 pt-[calc(env(safe-area-inset-top)+1rem)] sticky top-0 z-10 flex items-center gap-3">
                  <button onClick={() => setCurrentScreen(AppScreen.HOME)}><ArrowLeft size={20} className="text-gray-600" /></button>
                  <h1 className="font-bold text-lg">লেনদেনসমূহ</h1>
              </div>
              <div className="flex-1 overflow-y-auto p-4 pb-[5.5rem]">
                  {transactions.map((txn) => (
                      <div key={txn.id} onClick={() => setSelectedTransaction(txn)} className="flex items-center justify-between p-4 border-b border-gray-50 active:bg-gray-50">
                          <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${['RECEIVED_MONEY', 'ADD_MONEY'].includes(txn.type) ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                                  <FileText size={18} />
                              </div>
                              <div>
                                  <p className="font-bold text-sm text-gray-800">{txn.recipientName || txn.type}</p>
                                  <p className="text-xs text-gray-400">{txn.date}</p>
                              </div>
                          </div>
                          <span className={`font-bold text-sm ${['RECEIVED_MONEY', 'ADD_MONEY'].includes(txn.type) ? 'text-emerald-600' : 'text-gray-800'}`}>
                             {['RECEIVED_MONEY', 'ADD_MONEY'].includes(txn.type) ? '+' : '-'}৳{txn.amount}
                          </span>
                      </div>
                  ))}
              </div>
          </div>
      )}

      {currentScreen === AppScreen.OFFERS && (
          <div className="h-full bg-gray-50 flex flex-col">
               <div className="bg-white p-4 pt-[calc(env(safe-area-inset-top)+1rem)] flex items-center gap-3 shadow-sm">
                  <button onClick={() => setCurrentScreen(AppScreen.HOME)}><ArrowLeft size={20} className="text-gray-600" /></button>
                  <h1 className="font-bold text-lg">অফারসমূহ</h1>
              </div>
              <div className="p-4 space-y-4 overflow-y-auto pb-24">
                  <OfferCarousel onNavigate={handleNavigation} />
                  {/* More offers mock */}
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
                      <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                          <ShoppingBag size={24} />
                      </div>
                      <div>
                          <h3 className="font-bold text-gray-800">দারাজ পেমেন্টে ২০% ছাড়</h3>
                          <p className="text-xs text-gray-500 mt-1">মিনিমাম ৫০০ টাকার কেনাকাটায়</p>
                          <button className="mt-2 text-xs font-bold text-rose-600 border border-rose-200 px-3 py-1 rounded-full">বিস্তারিত</button>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {currentScreen === AppScreen.ADMIN_DASHBOARD && (
        <AdminDashboard transactions={transactions} onLogout={handleLogout} />
      )}

      {/* Global Overlays */}
      {currentScreen === AppScreen.AI_CHAT && (
          <AIAssistant user={user} transactions={transactions} onClose={() => setCurrentScreen(AppScreen.HOME)} />
      )}

      {selectedTransaction && (
          <TransactionDetails 
            transaction={selectedTransaction} 
            onClose={() => setSelectedTransaction(null)} 
            language={language}
          />
      )}

      {activeInput && (
          <NumericKeypad 
             onPress={handleKeypadPress} 
             onDelete={handleKeypadDelete} 
             onDone={handleKeypadDone} 
          />
      )}

      {/* Bottom Navigation (Only on Home & Sub-pages) */}
      {[AppScreen.HOME, AppScreen.TRANSACTIONS, AppScreen.OFFERS].includes(currentScreen) && (
          <BottomNav currentScreen={currentScreen} onNavigate={handleNavigation} language={language} />
      )}
    </div>
  );
};

// Check, User, Send, Smartphone, Download, CreditCard are imported from lucide-react
import { Check, User, Send, Smartphone, Download } from 'lucide-react';

export default App;