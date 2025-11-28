
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ChevronRight, ArrowUpRight, CreditCard, Wallet, X, Bell, Shield, Settings as SettingsIcon, FileText, Landmark, ShoppingBag, Utensils, LogOut, Lock, User as UserIcon, Phone, Eye, EyeOff, QrCode as QrCodeIcon, Signal, Globe, UserCog, Contact as ContactIcon, ArrowRightLeft, Zap, Flame, Droplet, Tv, ShieldCheck, Car, MoreHorizontal, ScrollText, BarChart3, ScanLine, ArrowRight, Loader2, CheckCircle, Share2, Check, User, Send, Smartphone, Download, Wifi, GraduationCap, Plus, Search, Clock, Gift } from 'lucide-react';
import BalanceHeader from './components/BalanceHeader';
import ActionGrid from './components/ActionGrid';
import BottomNav from './components/BottomNav';
import AIAssistant from './components/AIAssistant';
import HoldToConfirm from './components/HoldToConfirm';
import OfferCarousel from './components/OfferCarousel';
import NumericKeypad from './components/NumericKeypad';
import AdminDashboard from './components/AdminDashboard';
import TransactionDetails from './components/TransactionDetails';
import { AppScreen, User as UserType, Transaction, SendMoneyFormData, NotificationPreferences, Language, Contact } from './types';
import { INITIAL_USER, MOCK_TRANSACTIONS, TRANSLATIONS, MOCK_USERS_DB, MOCK_CONTACTS } from './constants';
// import { apiClient } from './services/apiClient'; // Uncomment when backend is ready

const App: React.FC = () => {
  // Global Users State (Simulated Backend)
  const [allUsers, setAllUsers] = useState<UserType[]>(MOCK_USERS_DB);

  // Start at LOGIN screen
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.LOGIN);
  const [user, setUser] = useState<UserType>(INITIAL_USER);
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
  
  // My QR Modal State
  const [showQrModal, setShowQrModal] = useState(false);

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

  // Helper to determine if we need full screen layout (Admin)
  const isAdminDashboard = currentScreen === AppScreen.ADMIN_DASHBOARD;

  // SESSION MANAGEMENT & URL CHECK
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const path = window.location.pathname;
    
    // 1. Check if Admin Mode is requested via URL
    if (params.get('mode') === 'admin' || path === '/spay-admin') {
      setIsAdminMode(true);
    }

    // 2. Check Local Storage for Persistent Login (Admin or User)
    const storedAdminSession = localStorage.getItem('spay_admin_session');
    const storedUserPhone = localStorage.getItem('spay_user_phone');

    if (storedAdminSession === 'true') {
        // Restore Admin Session
        setIsAdminMode(true);
        setCurrentScreen(AppScreen.ADMIN_DASHBOARD);
        // TODO: When backend is ready, fetch fresh data here
        // apiClient.getAllUsers().then(users => setAllUsers(users));
    } else if (storedUserPhone) {
        // Restore User Session
        const foundUser = allUsers.find(u => u.phone === storedUserPhone);
        if (foundUser) {
            setUser(foundUser);
            setCurrentScreen(AppScreen.HOME);
            // Update login phone field for visual consistency if they logout later
            setLoginPhone(foundUser.phone);
        }
    }
  }, []); // Run once on mount
  
  // Lookup recipient name from ALL USERS DB or CONTACTS
  useEffect(() => {
    if (formData.recipient.length === 11) {
        const foundUser = allUsers.find(u => u.phone === formData.recipient);
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
  }, [formData.recipient, allUsers]);

  // Sync current user state with allUsers DB whenever it changes
  useEffect(() => {
     if (user.phone) {
         const freshUserData = allUsers.find(u => u.phone === user.phone);
         if (freshUserData) {
             setUser(freshUserData);
         }
     }
  }, [allUsers]);

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
        } catch (err: any) {
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
  const handleLogin = async () => {
    if (loginPin.length >= 4) {
      // TODO: Replace with Real API Call
      // const response = await apiClient.login(loginPhone, loginPin);
      
      // Simple mock validation
      if (loginPin === '6175') {
        const loggedUser = allUsers.find(u => u.phone === loginPhone) || INITIAL_USER;
        
        // Save Session
        localStorage.setItem('spay_user_phone', loggedUser.phone);
        
        setUser(loggedUser);
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
      localStorage.setItem('spay_admin_session', 'true'); // Save Admin Session
      setCurrentScreen(AppScreen.ADMIN_DASHBOARD);
      setAdminUsername('');
      setAdminPassword('');
    } else {
      alert('ভুল ইউজারনেম বা পাসওয়ার্ড (User: admin, Pass: 1234)');
    }
  };

  const handleRegister = async () => {
    if (registerData.name && registerData.phone && registerData.pin.length === 4) {
      if (registerData.pin !== registerData.confirmPin) {
        alert("পিন নম্বর মিলছে না");
        return;
      }
      
      // Generate Unique QR Code for the user
      const generatedQrCode = `SPay:${registerData.phone}`;

      const newUser: UserType = {
        id: (allUsers.length + 1).toString(),
        name: registerData.name,
        phone: registerData.phone,
        balance: 50, // Signup bonus
        avatarUrl: `https://ui-avatars.com/api/?name=${registerData.name}&background=random`,
        role: 'CUSTOMER',
        type: 'user',
        qrCode: generatedQrCode,
        status: 'active'
      };

      // TODO: Replace with Real API Call
      // await apiClient.register(newUser);

      setAllUsers([...allUsers, newUser]);
      setUser(newUser);
      
      // Save Session on Register
      localStorage.setItem('spay_user_phone', newUser.phone);

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
    // Clear Sessions
    localStorage.removeItem('spay_admin_session');
    localStorage.removeItem('spay_user_phone');
    
    setCurrentScreen(AppScreen.LOGIN);
    setTransactionStep(1);
    setFormData({ recipient: '', amount: '', reference: '', pin: '', mfsProvider: 'Bkash' });
    setIsAdminMode(false); // Reset admin mode flag
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
    // Find a random user/merchant from DB to simulate a real scan
    const potentialTargets = allUsers.filter(u => u.phone !== user.phone);
    
    // Default to a merchant if possible, or fallback to any user
    const merchant = potentialTargets.find(u => u.role === 'MERCHANT');
    // Fallback to a hardcoded merchant if no DB match (failsafe)
    const target = merchant || potentialTargets[0] || { 
        name: 'স্বপ্ন সুপার শপ', 
        phone: '01912345678', 
        role: 'MERCHANT',
        qrCode: 'SPAY:01912345678'
    };
    
    // Extract phone
    const scannedData = target.qrCode || `SPAY:${target.phone}`;
    let phone = scannedData;
    if (scannedData.startsWith('SPAY:')) {
      phone = scannedData.split(':')[1];
    }

    // Visual feedback before redirecting
    if (videoRef.current) {
        videoRef.current.style.opacity = '0.3';
    }

    // Update Form with artificial delay to feel like scanning
    setTimeout(() => {
        setFormData(prev => ({
            ...prev,
            recipient: phone,
            amount: ''
        }));
        setRecipientNameDisplay(target.name);
    
        // Route based on role
        let nextScreen = AppScreen.SEND_MONEY;
        if (target.role === 'MERCHANT') {
           nextScreen = AppScreen.PAYMENT;
        } else if (target.role === 'AGENT') {
           nextScreen = AppScreen.CASH_OUT;
        }
    
        setCurrentScreen(nextScreen);
        setTransactionStep(2); // Skip to Amount input
    }, 500);
  };

  // Share QR Function
  const handleShareQr = async () => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(user.qrCode || user.phone)}`;
    const shareData = {
        title: 'SPay QR',
        text: `আমার SPay নম্বর: ${user.phone}। টাকা পাঠাতে এই QR কোডটি ব্যবহার করুন।`,
        url: qrUrl
    };

    if (navigator.share) {
        try {
            await navigator.share(shareData);
        } catch (err: any) {
            console.log('Share canceled');
        }
    } else {
        // Fallback for desktop/unsupported browsers
        try {
            await navigator.clipboard.writeText(`SPay: ${user.phone}`);
            alert('নম্বর ক্লিপবোর্ডে কপি করা হয়েছে!');
        } catch (e: any) {
            alert('শেয়ার করা সম্ভব হচ্ছে না');
        }
    }
  };

  // Save QR Function
  const handleSaveQr = async () => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(user.qrCode || user.phone)}&color=e11d48&bgcolor=fff&format=png`;
    
    try {
        const response = await fetch(qrUrl);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `SPay_${user.phone}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
    } catch (error: any) {
        // Fallback: Open in new tab if CORS blocks fetch
        window.open(qrUrl, '_blank');
    }
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
        const foundUser = allUsers.find(u => u.phone === formData.recipient);
        if (foundUser && foundUser.role === 'AGENT') {
            alert('এজেন্ট নম্বরে সেন্ড মানি করা সম্ভব নয়। ক্যাশ আউট অপশন ব্যবহার করুন।');
            return;
        }
    }

    setTransactionStep(2);
  };

  // Logic to execute transaction
  const executeTransaction = async () => {
    const config = getScreenConfig();
    const amount = parseFloat(formData.amount);
    let finalAmountToDeduct = amount;
    let fee = 0;
    
    // Create a copy of users to modify
    let updatedUsers = [...allUsers];
    const currentUserIndex = updatedUsers.findIndex(u => u.id === user.id);
    if (currentUserIndex === -1) return;

    const recipientUserIndex = updatedUsers.findIndex(u => u.phone === formData.recipient);

    // CASH OUT LOGIC: 1% Total Fee -> 0.30% Agent, 0.05% Distributor, Rest Admin
    if (config.type === 'CASH_OUT') {
        fee = amount * 0.01; // 1%
        finalAmountToDeduct = amount + fee;

        if (recipientUserIndex !== -1) {
            // Agent gets Amount + 0.30% Commission
            const agentCommission = amount * 0.003; // 0.30%
            updatedUsers[recipientUserIndex].balance += (amount + agentCommission);

            // Distributor Commission
            const distributorId = updatedUsers[recipientUserIndex].distributorId;
            if (distributorId) {
                const distIndex = updatedUsers.findIndex(u => u.id === distributorId);
                if (distIndex !== -1) {
                    const distCommission = amount * 0.0005; // 0.05%
                    updatedUsers[distIndex].balance += distCommission;
                }
            }
            
            // Rest goes to Admin
            // Admin gets: Total Fee - Agent Comm - Dist Comm = 1% - 0.30% - 0.05% = 0.65%
            const adminIndex = updatedUsers.findIndex(u => u.role === 'ADMIN');
            if (adminIndex !== -1) {
                const adminRevenue = fee - agentCommission - (amount * 0.0005);
                updatedUsers[adminIndex].balance += adminRevenue;
            }
        }
    }

    // MFS TRANSFER LOGIC: 0.85% Fee
    else if (config.type === 'MFS_TRANSFER') {
        fee = amount * 0.0085; // 0.85%
        finalAmountToDeduct = amount + fee;
        // Admin gets fee
        const adminIndex = updatedUsers.findIndex(u => u.role === 'ADMIN');
        if (adminIndex !== -1) {
            updatedUsers[adminIndex].balance += fee;
        }
    }

    // NORMAL SEND MONEY / PAYMENT
    else if (config.type === 'SEND_MONEY' || config.type === 'PAYMENT') {
        if (recipientUserIndex !== -1) {
            updatedUsers[recipientUserIndex].balance += amount;
        }
    }
    
    // Balance check for debit transactions
    if (config.type !== 'ADD_MONEY' && finalAmountToDeduct > updatedUsers[currentUserIndex].balance) {
       alert(`অপর্যাপ্ত ব্যালেন্স। চার্জ সহ প্রয়োজন ৳${finalAmountToDeduct.toFixed(2)}`);
       return;
    }

    // Deduct from Current User
    if (config.type === 'ADD_MONEY') {
        updatedUsers[currentUserIndex].balance += amount;
    } else {
        updatedUsers[currentUserIndex].balance -= finalAmountToDeduct;
    }

    // TODO: Replace with Real API Call
    // await apiClient.createTransaction(newTxn);

    // Commit changes to DB
    setAllUsers(updatedUsers);

    // Create Transaction Record
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
    setCurrentScreen(AppScreen.SUCCESS);
  };
  
  // Recent Contacts Helper (Unique recipients from history)
  const recentContacts = Array.from(new Set(transactions
    .filter(t => !['ADD_MONEY', 'RECEIVED_MONEY'].includes(t.type))
    .map(t => JSON.stringify({ name: t.recipientName, phone: '01XXXXXXXXX' })) // Mock phone extraction
  )).slice(0, 5).map((s: string) => JSON.parse(s));

  // --- RENDER HELPERS ---
  
  const renderMyQr = () => (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 relative shadow-2xl overflow-hidden">
          <button 
            onClick={() => setShowQrModal(false)}
            className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200"
          >
              <X size={20} />
          </button>
          
          <div className="flex flex-col items-center pt-4">
              <h3 className="text-xl font-bold text-gray-800 mb-1">{t.my_qr}</h3>
              <p className="text-gray-500 text-xs mb-8 text-center px-4">{t.my_qr_desc}</p>
              
              <div className="p-4 border-2 border-dashed border-rose-200 rounded-2xl bg-rose-50/50 mb-6 relative group">
                  {/* QR Code Image */}
                  <img 
                     src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(user.qrCode || user.phone)}&color=e11d48&bgcolor=fff`} 
                     alt="My QR Code" 
                     className="w-48 h-48 mix-blend-multiply"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-white/50 backdrop-blur-sm">
                     <span className="text-rose-600 font-bold text-sm">SPay QR</span>
                  </div>
              </div>

              <h2 className="text-lg font-bold text-gray-800">{user.name}</h2>
              <p className="text-gray-500 font-mono text-sm tracking-wider mb-8">{user.phone}</p>

              <div className="flex gap-3 w-full">
                  <button 
                    onClick={handleShareQr}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold text-sm hover:bg-gray-200 transition-colors"
                  >
                      <Share2 size={18} /> শেয়ার
                  </button>
                  <button 
                    onClick={handleSaveQr}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-600 text-white font-bold text-sm shadow-lg shadow-rose-200 hover:bg-rose-700 transition-colors"
                  >
                      <Download size={18} /> সেভ করুন
                  </button>
              </div>
          </div>
      </div>
    </div>
  );

  const renderLogin = () => (
    <div className="flex flex-col min-h-full bg-gradient-to-br from-rose-600 to-pink-700 animate-in fade-in overflow-hidden relative">
        <div className="h-[35vh] flex flex-col items-center justify-end pb-8 text-white shrink-0">
            <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-rose-900/30 border border-white/50 p-1">
                 <img src="https://wsrv.nl/?url=c.beoo.net/Files/3.jpg&w=192&h=192&fit=contain&bg=white&output=png" alt="Logo" className="w-full h-full object-contain rounded-2xl" />
            </div>
            <h1 className="text-2xl font-bold mb-1">{isAdminMode ? 'অ্যাডমিন প্যানেল' : 'স্বাগতম!'}</h1>
            <p className="text-rose-100 text-xs">{isAdminMode ? 'সিস্টেম কন্ট্রোল সেন্টার' : 'আপনার নিরাপদ লেনদেনের সাথী'}</p>
        </div>

        <div className="flex-1 bg-white rounded-t-[30px] p-6 pb-6 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.3)] animate-in slide-in-from-bottom duration-500 flex flex-col">
             
             {isAdminMode ? (
                // ADMIN LOGIN FORM
                <div className="space-y-4 animate-in fade-in">
                    {/* ... Admin Form Fields ... */}
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
                                onFocus={() => setActiveInput(null)} 
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
        <div className="bg-rose-600 px-5 pt-10 pb-6 rounded-b-[30px] shadow-lg relative z-10 shrink-0 text-center">
            <button onClick={() => setCurrentScreen(AppScreen.LOGIN)} className="absolute top-10 left-4 p-2 bg-white/20 rounded-full text-white backdrop-blur-md">
                <ArrowLeft size={18} />
            </button>
            <div className="text-center">
                <h1 className="text-xl font-bold text-white mt-8">নতুন অ্যাকাউন্ট</h1>
                <p className="text-rose-100 text-xs">SPay-তে রেজিস্ট্রেশন করুন</p>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 pb-6 space-y-4">
             {/* ... Register fields ... */}
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
    <div className="pb-24 animate-in fade-in duration-500 relative min-h-full">
      {/* Background Ambient Blobs for Glass Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[20%] left-[-10%] w-72 h-72 bg-purple-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute top-[40%] right-[-10%] w-72 h-72 bg-yellow-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-[20%] left-[20%] w-72 h-72 bg-rose-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <BalanceHeader 
        user={user} 
        onProfileClick={() => setShowQrModal(true)} 
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
    const isPayBillDashboard = config.type === 'PAY_BILL' && transactionStep === 0;

    return (
      <div className="flex flex-col h-full bg-white animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className={`${isPayBillDashboard ? 'bg-rose-600 text-white border-none' : 'bg-white border-b border-gray-100'} px-4 pt-[calc(env(safe-area-inset-top)+1rem)] pb-4 flex items-center gap-4 sticky top-0 z-20 transition-colors`}>
          <button onClick={handleBack} className={`p-2 rounded-full -ml-2 ${isPayBillDashboard ? 'hover:bg-white/20 text-white' : 'hover:bg-gray-100 text-gray-600'}`}>
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className={`font-bold text-lg ${isPayBillDashboard ? 'text-white' : 'text-gray-800'}`}>{config.title}</h1>
            {transactionStep > 1 && (
               <p className="text-xs text-gray-400">স্টেপ {transactionStep} / 3</p>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-0 pb-6">
          {transactionStep === 0 && config.type === 'PAY_BILL' && (
            <div className="animate-in slide-in-from-right duration-300">
                {/* Search Bar - Floating effect under red header */}
                <div className="bg-rose-600 px-4 pb-6 rounded-b-[30px] shadow-lg shadow-rose-200/50 mb-6">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="প্রতিষ্ঠান বা বিলার খুঁজুন" 
                            className="w-full bg-white text-gray-800 placeholder:text-gray-400 rounded-full py-3.5 pl-11 pr-4 text-sm font-medium shadow-sm outline-none" 
                        />
                    </div>
                </div>

                {/* Saved Bills */}
                <div className="px-5 mb-8">
                    <div className="flex justify-between items-center mb-3">
                         <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">সংরক্ষিত বিল</h3>
                         <button className="text-[10px] text-rose-600 font-bold hover:underline">সব দেখুন</button>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-4 -mx-5 px-5 no-scrollbar">
                        {/* Add New */}
                        <div className="flex flex-col items-center gap-2 min-w-[72px] cursor-pointer group">
                            <div className="w-14 h-14 rounded-2xl bg-white border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 group-hover:border-rose-400 group-hover:text-rose-500 transition-colors">
                                <Plus size={24} />
                            </div>
                            <span className="text-[10px] font-bold text-gray-500 text-center">নতুন যোগ</span>
                        </div>
                        {/* Mock Item */}
                        <div className="flex flex-col items-center gap-2 min-w-[72px] cursor-pointer" onClick={() => handleNextStep1()}>
                             <div className="w-14 h-14 rounded-2xl bg-yellow-50 border border-yellow-100 flex items-center justify-center text-yellow-600 shadow-sm relative">
                                 <Zap size={24} fill="currentColor" />
                                 <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
                             </div>
                             <span className="text-[10px] font-bold text-gray-700 text-center">বাসার বিদ্যুৎ</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 min-w-[72px] cursor-pointer" onClick={() => handleNextStep1()}>
                             <div className="w-14 h-14 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600 shadow-sm">
                                 <Wifi size={24} />
                             </div>
                             <span className="text-[10px] font-bold text-gray-700 text-center">Link3 Net</span>
                        </div>
                    </div>
                </div>

                {/* Categories Grid */}
                <div className="px-5 pb-8">
                    <h3 className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-wider">সকল প্রতিষ্ঠান</h3>
                    <div className="grid grid-cols-4 gap-x-2 gap-y-6">
                        {[
                            { icon: Zap, label: 'বিদ্যুৎ', color: 'text-yellow-600', bg: 'bg-yellow-100' },
                            { icon: Flame, label: 'গ্যাস', color: 'text-red-600', bg: 'bg-red-100' },
                            { icon: Droplet, label: 'পানি', color: 'text-blue-600', bg: 'bg-blue-100' },
                            { icon: Wifi, label: 'ইন্টারনেট', color: 'text-cyan-600', bg: 'bg-cyan-100' },
                            { icon: Tv, label: 'টিভি', color: 'text-orange-600', bg: 'bg-orange-100' },
                            { icon: GraduationCap, label: 'শিক্ষা', color: 'text-indigo-600', bg: 'bg-indigo-100' },
                            { icon: ShieldCheck, label: 'ইনস্যুরেন্স', color: 'text-emerald-600', bg: 'bg-emerald-100' },
                            { icon: MoreHorizontal, label: 'অন্যান্য', color: 'text-gray-600', bg: 'bg-gray-100' },
                        ].map((item, idx) => (
                            <button 
                                key={idx} 
                                onClick={() => {
                                    setTransactionStep(1);
                                }}
                                className="flex flex-col items-center gap-2 group"
                            >
                                <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center ${item.color} shadow-sm group-active:scale-95 transition-transform`}>
                                    <item.icon size={26} strokeWidth={2} />
                                </div>
                                <span className="text-[11px] font-bold text-gray-700">{item.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
          )}

          {transactionStep === 1 && (
            <div className="space-y-6 p-5">
                
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
                            maxLength={11}
                            value={formData.recipient}
                            onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '');
                                if (val.length <= 11) setFormData({...formData, recipient: val});
                            }}
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

                {/* Recent Contacts */}
                {recentContacts.length > 0 && (
                    <div className="space-y-2">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Recent Contacts</p>
                        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                            {recentContacts.map((contact, idx) => (
                                <div 
                                    key={idx}
                                    onClick={() => setFormData({...formData, recipient: contact.phone})}
                                    className="flex flex-col items-center gap-1 min-w-[64px] cursor-pointer"
                                >
                                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 border border-gray-200">
                                        <span className="text-xs font-bold">{contact.name?.[0]}</span>
                                    </div>
                                    <span className="text-[10px] text-gray-600 text-center w-full truncate">{contact.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* All Contacts List with Permission */}
                {!contactsPermission ? (
                    <div className="bg-rose-50 rounded-xl p-4 flex items-center justify-between border border-rose-100" onClick={() => setContactsPermission(true)}>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-rose-600 shadow-sm">
                                <ContactIcon size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-rose-700 text-sm">All Contacts</h3>
                                <p className="text-rose-400 text-[10px]">Tap to allow access</p>
                            </div>
                        </div>
                        <ChevronRight className="text-rose-400" size={18} />
                    </div>
                ) : (
                    <div className="space-y-2">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">All Contacts</p>
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
            <div className="flex flex-col items-center pt-8 p-5">
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
            <div className="space-y-6 p-5">
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
        {transactionStep < 3 && transactionStep > 0 && (
            <div className="p-4 bg-white border-t border-gray-100 pb-6">
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
      <div className="h-full flex flex-col items-center justify-center bg-white p-6 animate-in zoom-in duration-300 pb-6">
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
                   <span className="font-bold text-gray-800">৳{user.balance.toLocaleString()}</span>
               </div>
               <div className="flex justify-between">
                   <span className="text-gray-500 text-xs">ট্রানজেকশন আইডি</span>
                   <span className="font-mono font-bold text-gray-800 text-xs">{transactions[0]?.id}</span>
               </div>
          </div>

          <button
              onClick={() => {
                  setCurrentScreen(AppScreen.HOME);
                  setTransactionStep(1);
              }}
              className="w-full bg-rose-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-rose-200 hover:bg-rose-700 transition-all"
          >
              হোম এ ফিরে যান
          </button>
      </div>
  );

  return (
    <div className={`flex justify-center min-h-screen bg-gray-100 font-sans text-gray-900 selection:bg-rose-100 ${isAdminDashboard ? 'items-stretch' : ''}`}>
      <div className={`
        bg-white shadow-2xl overflow-hidden relative flex flex-col transition-all duration-300
        ${isAdminDashboard 
            ? 'w-full h-screen rounded-none max-w-none' 
            : 'w-full sm:max-w-md min-h-screen sm:min-h-[850px] sm:h-[850px] sm:rounded-[3rem]'
        }
      `}>
        
        {/* Status Bar (Visual only, hidden on admin) */}
        {!isAdminDashboard && (
            <div className="h-safe-top w-full bg-transparent absolute top-0 z-50 pointer-events-none"></div>
        )}

        {/* Main Content Area */}
        <div className={`flex-1 relative bg-white ${isAdminDashboard ? 'overflow-hidden' : 'overflow-y-auto no-scrollbar scroll-smooth'}`}>
           {currentScreen === AppScreen.LOGIN && renderLogin()}
           {currentScreen === AppScreen.REGISTER && renderRegister()}
           {currentScreen === AppScreen.HOME && renderHome()}
           
           {(currentScreen === AppScreen.SEND_MONEY || 
             currentScreen === AppScreen.CASH_OUT || 
             currentScreen === AppScreen.MOBILE_RECHARGE || 
             currentScreen === AppScreen.PAYMENT || 
             currentScreen === AppScreen.ADD_MONEY ||
             currentScreen === AppScreen.PAY_BILL ||
             currentScreen === AppScreen.TRANSFER_TO_BANK ||
             currentScreen === AppScreen.MFS_TRANSFER) && renderTransactionFlow()}
             
           {currentScreen === AppScreen.SUCCESS && renderSuccess()}
           {currentScreen === AppScreen.SCAN && (
             <div className="h-full bg-black relative flex flex-col">
                <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover opacity-60"></video>
                <div className="relative z-10 flex flex-col h-full">
                     <div className="p-4 flex justify-between items-center text-white">
                         <button onClick={() => setCurrentScreen(AppScreen.HOME)} className="p-2 bg-white/10 rounded-full backdrop-blur-md"><ArrowLeft /></button>
                         <h1 className="font-bold">স্ক্যান QR</h1>
                         <div className="w-10"></div>
                     </div>
                     <div className="flex-1 flex items-center justify-center p-8" onClick={simulateScan}>
                         <div className="w-64 h-64 border-2 border-white/30 rounded-3xl relative overflow-hidden flex items-center justify-center">
                              <div className="absolute inset-0 border-[3px] border-rose-500 rounded-3xl animate-pulse"></div>
                              <div className="w-full h-0.5 bg-rose-500 shadow-[0_0_15px_rgba(225,29,72,0.8)] absolute top-0 animate-scan"></div>
                              <p className="text-white/70 text-xs font-bold bg-black/50 px-3 py-1 rounded-full backdrop-blur-md pointer-events-none">স্ক্যান করতে ট্যাপ করুন</p>
                         </div>
                     </div>
                     <div className="p-8 text-center">
                         <p className="text-white/80 text-sm">QR কোডটি ফ্রেমের মধ্যে রাখুন</p>
                     </div>
                </div>
             </div>
           )}

           {currentScreen === AppScreen.OFFERS && (
               <div className="bg-white min-h-full">
                   <div className="bg-white px-4 pt-[calc(env(safe-area-inset-top)+1rem)] pb-4 flex items-center gap-4 sticky top-0 z-20 border-b border-gray-100">
                      <button onClick={() => setCurrentScreen(AppScreen.HOME)} className="p-2 hover:bg-gray-100 rounded-full -ml-2 text-gray-600"><ArrowLeft size={20} /></button>
                      <h1 className="font-bold text-lg text-gray-800">অফার সমূহ</h1>
                   </div>
                   <div className="p-4 space-y-4">
                       {[1, 2, 3].map(i => (
                           <div key={i} className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex gap-4">
                               <div className="w-16 h-16 bg-rose-100 rounded-xl flex items-center justify-center text-rose-600 shrink-0">
                                   <Gift size={32} />
                               </div>
                               <div>
                                   <h3 className="font-bold text-gray-800">ঈদ স্পেশাল অফার {i}</h3>
                                   <p className="text-xs text-gray-500 mt-1">নির্দিষ্ট আউটলেটে পেমেন্ট করলে ২০% পর্যন্ত ক্যাশব্যাক।</p>
                                   <button className="mt-2 text-[10px] font-bold text-rose-600 bg-white border border-rose-200 px-3 py-1 rounded-full">বিস্তারিত</button>
                               </div>
                           </div>
                       ))}
                   </div>
               </div>
           )}

           {currentScreen === AppScreen.TRANSACTIONS && (
               <div className="bg-white min-h-full">
                   <div className="bg-white px-4 pt-[calc(env(safe-area-inset-top)+1rem)] pb-4 flex items-center gap-4 sticky top-0 z-20 border-b border-gray-100">
                      <button onClick={() => setCurrentScreen(AppScreen.HOME)} className="p-2 hover:bg-gray-100 rounded-full -ml-2 text-gray-600"><ArrowLeft size={20} /></button>
                      <h1 className="font-bold text-lg text-gray-800">লেনদেন ইতিহাস</h1>
                   </div>
                   <div className="divide-y divide-gray-50">
                       {transactions.map(txn => (
                           <div key={txn.id} onClick={() => setSelectedTransaction(txn)} className="p-4 flex justify-between items-center active:bg-gray-50 transition-colors">
                               <div className="flex gap-3 items-center">
                                   <div className={`w-10 h-10 rounded-full flex items-center justify-center ${['RECEIVED_MONEY', 'ADD_MONEY'].includes(txn.type) ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                                       {['RECEIVED_MONEY', 'ADD_MONEY'].includes(txn.type) ? <ArrowUpRight className="rotate-180" size={18} /> : <ArrowUpRight size={18} />}
                                   </div>
                                   <div>
                                       <h4 className="font-bold text-gray-800 text-sm">{txn.recipientName || txn.type}</h4>
                                       <p className="text-xs text-gray-400">{txn.date}</p>
                                   </div>
                               </div>
                               <div className="text-right">
                                    <p className={`font-bold text-sm ${['RECEIVED_MONEY', 'ADD_MONEY'].includes(txn.type) ? 'text-emerald-600' : 'text-gray-800'}`}>
                                        {['RECEIVED_MONEY', 'ADD_MONEY'].includes(txn.type) ? '+' : '-'}৳{txn.amount}
                                    </p>
                                    <p className="text-[10px] text-gray-400">{txn.type}</p>
                               </div>
                           </div>
                       ))}
                   </div>
               </div>
           )}
           
           {currentScreen === AppScreen.ADMIN_DASHBOARD && (
                <AdminDashboard 
                    transactions={transactions} 
                    users={allUsers}
                    onUpdateUsers={setAllUsers}
                    onLogout={handleLogout} 
                />
           )}
        </div>

        {/* Bottom Navigation */}
        {[AppScreen.HOME, AppScreen.TRANSACTIONS, AppScreen.OFFERS, AppScreen.AI_CHAT].includes(currentScreen) && (
            <BottomNav currentScreen={currentScreen} onNavigate={handleNavigation} language={language} />
        )}
        
        {/* Modals & Overlays */}
        {showQrModal && renderMyQr()}
        
        {activeInput && (
             <NumericKeypad 
                onPress={handleKeypadPress}
                onDelete={handleKeypadDelete}
                onDone={handleKeypadDone}
             />
        )}

        {currentScreen === AppScreen.AI_CHAT && (
            <AIAssistant user={user} transactions={transactions} onClose={() => setCurrentScreen(AppScreen.HOME)} />
        )}
        
        {selectedTransaction && (
            <TransactionDetails transaction={selectedTransaction} onClose={() => setSelectedTransaction(null)} language={language} />
        )}

      </div>
    </div>
  );
};

export default App;
