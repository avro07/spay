

export interface Transaction {
  id: string;
  type: 'SEND_MONEY' | 'CASH_OUT' | 'MOBILE_RECHARGE' | 'PAYMENT' | 'ADD_MONEY' | 'RECEIVED_MONEY' | 'REQUEST_MONEY' | 'PAY_BILL' | 'TRANSFER_TO_BANK';
  amount: number;
  recipient?: string;
  recipientName?: string;
  date: string;
  icon?: string;
  description?: string;
  fee?: number;
}

export type UserRole = 'CUSTOMER' | 'AGENT' | 'MERCHANT' | 'DISTRIBUTOR' | 'ADMIN';

export interface User {
  id?: string;
  name: string;
  phone: string;
  balance: number;
  avatarUrl: string;
  status?: 'active' | 'blocked';
  role?: UserRole; // Updated from 'type' to 'role' for better clarity, though keeping backward compat if needed
  type?: 'user' | 'agent'; // Deprecated but kept for compatibility
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
}

export enum AppScreen {
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  HOME = 'HOME',
  SEND_MONEY = 'SEND_MONEY',
  CASH_OUT = 'CASH_OUT',
  MOBILE_RECHARGE = 'MOBILE_RECHARGE',
  PAYMENT = 'PAYMENT',
  ADD_MONEY = 'ADD_MONEY',
  REQUEST_MONEY = 'REQUEST_MONEY',
  PAY_BILL = 'PAY_BILL',
  TRANSFER_TO_BANK = 'TRANSFER_TO_BANK',
  TRANSACTIONS = 'TRANSACTIONS',
  AI_CHAT = 'AI_CHAT',
  SUCCESS = 'SUCCESS',
  SETTINGS = 'SETTINGS',
  SCAN = 'SCAN',
  OFFERS = 'OFFERS',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD'
}

export type Language = 'bn' | 'en';

export interface SendMoneyFormData {
  recipient: string;
  amount: string; // String to handle input parsing
  reference: string;
  pin: string;
}

export interface NotificationPreferences {
  transactions: boolean;
  offers: boolean;
  securityAlerts: boolean;
}