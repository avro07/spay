import { Transaction, User } from './types';
import { Send, Download, Smartphone, ShoppingBag, PlusCircle, ArrowDownLeft, FileText, Landmark, ScanLine } from 'lucide-react';

export const INITIAL_USER: User = {
  name: "তানভীর আহমেদ",
  phone: "01711-XXXXXX",
  balance: 25450.50,
  avatarUrl: "https://picsum.photos/100/100"
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
  { id: 'scan', label: 'QR স্ক্যান', icon: ScanLine, color: 'text-rose-600' },
  { id: 'send', label: 'সেন্ড মানি', icon: Send, color: 'text-rose-500' },
  { id: 'cashout', label: 'ক্যাশ আউট', icon: Download, color: 'text-emerald-500' },
  { id: 'recharge', label: 'মোবাইল রিচার্জ', icon: Smartphone, color: 'text-violet-500' },
  { id: 'payment', label: 'পেমেন্ট', icon: ShoppingBag, color: 'text-blue-500' },
  { id: 'addmoney', label: 'অ্যাড মানি', icon: PlusCircle, color: 'text-rose-400' },
  { id: 'paybill', label: 'পে বিল', icon: FileText, color: 'text-teal-500' },
  { id: 'tobank', label: 'SPay টু ব্যাংক', icon: Landmark, color: 'text-indigo-500' },
  { id: 'reqmoney', label: 'রিকোয়েস্ট মানি', icon: ArrowDownLeft, color: 'text-orange-500' },
];