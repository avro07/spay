

import { Transaction, User, Contact } from './types';
import { Send, Download, Smartphone, ShoppingBag, PlusCircle, ArrowRightLeft, FileText, Landmark } from 'lucide-react';

export const INITIAL_USER: User = {
  id: '1',
  name: "তানভীর আহমেদ",
  phone: "01711234567",
  balance: 25450.50,
  avatarUrl: "https://picsum.photos/100/100",
  role: 'CUSTOMER',
  type: 'user'
};

// Centralized User Database for Name Lookup and Admin Panel
export const MOCK_USERS_DB: User[] = [
  INITIAL_USER,
  { id: '2', name: 'করিম চৌধুরী', phone: '01812345678', balance: 500.00, avatarUrl: 'https://picsum.photos/101/101', status: 'blocked', role: 'CUSTOMER', type: 'user' },
  { id: '3', name: 'স্বপ্ন সুপার শপ', phone: '01912345678', balance: 150000.00, avatarUrl: 'https://picsum.photos/102/102', status: 'active', role: 'MERCHANT', type: 'agent' },
  { id: '4', name: 'রহিম স্টোর (এজেন্ট)', phone: '01612345678', balance: 4500.00, avatarUrl: 'https://picsum.photos/103/103', status: 'active', role: 'AGENT', type: 'agent' },
  { id: '5', name: 'সালমা খাতুন', phone: '01512345678', balance: 1200.00, avatarUrl: 'https://picsum.photos/104/104', status: 'active', role: 'CUSTOMER', type: 'user' },
  { id: '6', name: 'ঢাকা ডিস্ট্রিবিউশন হাউজ', phone: '01700000001', balance: 500000.00, avatarUrl: 'https://picsum.photos/105/105', status: 'active', role: 'DISTRIBUTOR', type: 'agent' },
  { id: '7', name: 'আম্মু', phone: '01711111111', balance: 5000.00, avatarUrl: 'https://picsum.photos/106/106', status: 'active', role: 'CUSTOMER', type: 'user' },
  { id: '8', name: 'রফিক ইসলাম', phone: '01722222222', balance: 100.00, avatarUrl: 'https://picsum.photos/107/107', status: 'active', role: 'CUSTOMER', type: 'user' },
];

export const MOCK_CONTACTS: Contact[] = [
  { id: 'c1', name: 'আম্মু', phone: '01711111111', avatar: 'https://picsum.photos/201/201' },
  { id: 'c2', name: 'আব্বু', phone: '01711111112', avatar: 'https://picsum.photos/202/202' },
  { id: 'c3', name: 'ছোট ভাই', phone: '01911111113', avatar: 'https://picsum.photos/203/203' },
  { id: 'c4', name: 'অফিস বস', phone: '01811111114', avatar: 'https://picsum.photos/204/204' },
  { id: 'c5', name: 'বাড়ির মালিক', phone: '01611111115', avatar: 'https://picsum.photos/205/205' },
  { id: 'c6', name: 'ইন্টারনেট বিল', phone: '01511111116', avatar: 'https://picsum.photos/206/206' },
];

export const TRANSLATIONS = {
  bn: {
    // Navigation
    nav_home: 'হোম',
    nav_history: 'লেনদেন',
    nav_scan: 'স্ক্যান',
    nav_offers: 'অফার',
    nav_help: 'সহায়তা',
    
    // Header
    balance_check: 'ব্যালেন্স দেখুন',
    gold_member: 'গোল্ড মেম্বার',
    
    // Quick Actions
    act_send: 'সেন্ড মানি',
    act_cashout: 'ক্যাশ আউট',
    act_recharge: 'মোবাইল রিচার্জ',
    act_payment: 'পেমেন্ট',
    act_addmoney: 'অ্যাড মানি',
    act_paybill: 'পে বিল',
    act_tobank: 'SPay টু ব্যাংক',
    act_mfs: 'MFS',
    
    // Sections
    recent_transactions: 'সাম্প্রতিক লেনদেন',
    see_all: 'সব দেখুন',
    
    // Settings
    settings_title: 'সেটিংস',
    language_label: 'ভাষা / Language',
    notif_title: 'নোটিফিকেশন প্রিফারেন্স',
    notif_txn: 'লেনদেন অ্যালার্ট',
    notif_txn_desc: 'টাকা পাঠানো বা গ্রহণের নোটিফিকেশন',
    notif_offer: 'অফার সমূহ',
    notif_offer_desc: 'নতুন অফার এবং ডিসকাউন্ট আপডেট',
    notif_sec: 'সিকিউরিটি অ্যালার্ট',
    notif_sec_desc: 'লগইন এবং পাসওয়ার্ড পরিবর্তন সতর্কতা',
    my_qr: 'আমার QR কোড',
    my_qr_desc: 'টাকা গ্রহণ করতে অন্য কাউকে এই QR কোডটি স্ক্যান করতে বলুন',
    logout: 'লগ আউট করুন',
    version: 'SPay অ্যাপ ভার্সন ১.০.০'
  },
  en: {
    // Navigation
    nav_home: 'Home',
    nav_history: 'History',
    nav_scan: 'Scan',
    nav_offers: 'Offers',
    nav_help: 'Support',
    
    // Header
    balance_check: 'Check Balance',
    gold_member: 'Gold Member',
    
    // Quick Actions
    act_send: 'Send Money',
    act_cashout: 'Cash Out',
    act_recharge: 'Recharge',
    act_payment: 'Payment',
    act_addmoney: 'Add Money',
    act_paybill: 'Pay Bill',
    act_tobank: 'To Bank',
    act_mfs: 'MFS',
    
    // Sections
    recent_transactions: 'Recent Transactions',
    see_all: 'See All',
    
    // Settings
    settings_title: 'Settings',
    language_label: 'Language / ভাষা',
    notif_title: 'Notification Preferences',
    notif_txn: 'Transaction Alerts',
    notif_txn_desc: 'Alerts for sending or receiving money',
    notif_offer: 'Offers',
    notif_offer_desc: 'Updates on new offers and discounts',
    notif_sec: 'Security Alerts',
    notif_sec_desc: 'Alerts for login and password changes',
    my_qr: 'My QR Code',
    my_qr_desc: 'Scan this QR code to receive money',
    logout: 'Log Out',
    version: 'SPay App Version 1.0.0'
  }
};

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'TXN123456',
    type: 'PAYMENT',
    amount: 1250,
    recipientName: 'স্বপ্ন সুপার শপ',
    date: 'আজ, ১০:৩০ AM',
    description: 'গ্রোসারি কেনাকাটা'
  },
  {
    id: 'TXN123457',
    type: 'RECEIVED_MONEY',
    amount: 5000,
    recipientName: 'রফিক ইসলাম',
    date: 'গতকাল, ০৮:১৫ PM',
    description: 'ধার ফেরত'
  },
  {
    id: 'TXN123458',
    type: 'MOBILE_RECHARGE',
    amount: 50,
    recipientName: 'নিজের নম্বর',
    date: 'গতকাল, ০৫:০০ PM',
    description: 'এয়ারটেল রিচার্জ'
  },
  {
    id: 'TXN123459',
    type: 'SEND_MONEY',
    amount: 2000,
    recipientName: 'আম্মু',
    date: '২০ মে, ২০২৪',
    description: 'মাসিক খরচ'
  }
];

export const QUICK_ACTIONS = [
  { id: 'send', key: 'act_send', label: 'সেন্ড মানি', icon: Send, color: 'text-rose-500' },
  { id: 'cashout', key: 'act_cashout', label: 'ক্যাশ আউট', icon: Download, color: 'text-emerald-500' },
  { id: 'recharge', key: 'act_recharge', label: 'মোবাইল রিচার্জ', icon: Smartphone, color: 'text-violet-500' },
  { id: 'payment', key: 'act_payment', label: 'পেমেন্ট', icon: ShoppingBag, color: 'text-blue-500' },
  { id: 'addmoney', key: 'act_addmoney', label: 'অ্যাড মানি', icon: PlusCircle, color: 'text-rose-400' },
  { id: 'paybill', key: 'act_paybill', label: 'পে বিল', icon: FileText, color: 'text-teal-500' },
  { id: 'tobank', key: 'act_tobank', label: 'SPay টু ব্যাংক', icon: Landmark, color: 'text-indigo-500' },
  { id: 'mfs', key: 'act_mfs', label: 'MFS', icon: ArrowRightLeft, color: 'text-pink-600' },
];