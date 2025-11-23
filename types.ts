
export interface Transaction {
  id: string;
  type: 'SEND_MONEY' | 'CASH_OUT' | 'MOBILE_RECHARGE' | 'PAYMENT' | 'ADD_MONEY' | 'RECEIVED_MONEY';
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
  HOME = 'HOME',
  SEND_MONEY = 'SEND_MONEY',
  TRANSACTIONS = 'TRANSACTIONS',
  AI_CHAT = 'AI_CHAT',
  SUCCESS = 'SUCCESS',
  SETTINGS = 'SETTINGS'
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
