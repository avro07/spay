
import { User, Transaction, SendMoneyFormData } from '../types';

// TODO: আপনার সার্ভারের আসল URL এখানে দিন
// উদাহরণ: 'https://your-domain.com/api'
const BASE_URL = 'http://localhost:3000/api'; 

export const apiClient = {
  // ১. ইউজার লগইন
  login: async (phone: string, pin: string) => {
    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, pin }),
      });
      return await response.json();
    } catch (error) {
      console.error("Login Error:", error);
      throw error;
    }
  },

  // ২. সব ইউজার এবং ব্যালেন্স লোড করা (Admin & Sync)
  getAllUsers: async () => {
    try {
      const response = await fetch(`${BASE_URL}/users`);
      return await response.json() as User[];
    } catch (error) {
      console.error("Fetch Users Error:", error);
      return []; // Return empty on error to prevent crash
    }
  },

  // ৩. নতুন ইউজার রেজিস্টার করা
  register: async (userData: any) => {
    try {
      const response = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      return await response.json();
    } catch (error) {
      console.error("Registration Error:", error);
      throw error;
    }
  },

  // ৪. লেনদেন সম্পন্ন করা
  createTransaction: async (txnData: Transaction) => {
    try {
      const response = await fetch(`${BASE_URL}/transaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(txnData),
      });
      return await response.json();
    } catch (error) {
      console.error("Transaction Error:", error);
      throw error;
    }
  },

  // ৫. লেনদেন ইতিহাস আনা
  getTransactionHistory: async (userId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/transactions/${userId}`);
      return await response.json() as Transaction[];
    } catch (error) {
      console.error("History Error:", error);
      return [];
    }
  }
};
