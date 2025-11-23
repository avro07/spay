
export interface Transaction {
  id: string;
  type: 'SEND_MONEY' | 'CASH_OUT' | 'MOBILE_RECHARGE' | 'PAYMENT' | 'ADD_MONEY' | 'RECEIVED_MONEY' | 'REQUEST_MONEY' | 'PAY_BILL' | 'TRANSFER_TO_BANK';
  amount: number;
  recipient?: string;
  recipientName?: string;
  date: string;
  icon?: string;
  description?: string;
}

export interface User {
  name: string;
  phone: string;
  balance: number;
  avatarUrl: string;
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
  OFFERS = 'OFFERS'
}

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