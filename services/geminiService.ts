import { GoogleGenAI } from "@google/genai";
import { Transaction, User } from '../types';

// Initialize Gemini Client
// NOTE: In a real production app, API keys should be proxy-ed through a backend.
// For this demo, we assume process.env.API_KEY is available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIResponse = async (
  userQuery: string,
  userContext: User,
  transactionHistory: Transaction[]
): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    
    const historySummary = transactionHistory.map(t => 
      `- ${t.date}: ${t.type} of ${t.amount} BDT to/from ${t.recipientName || 'Unknown'} (${t.description || ''})`
    ).join('\n');

    const systemPrompt = `
      You are 'DeshPay Assistant', a helpful AI support agent for a Bangladeshi mobile financial app.
      
      Current User Context:
      - Name: ${userContext.name}
      - Current Balance: ${userContext.balance} BDT
      
      Recent Transactions:
      ${historySummary}
      
      Instructions:
      1. Answer the user's question primarily based on their transaction history.
      2. Be polite, concise, and use natural language (supports Bengali and English).
      3. If they ask about spending, summarize it.
      4. If the query is unrelated to finance/app, politely steer them back.
      5. Keep responses short (under 3 sentences if possible).
      
      User Query: ${userQuery}
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: systemPrompt,
    });

    return response.text || "দুঃখিত, আমি এখন উত্তর দিতে পারছি না।";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "সংযোগ সমস্যা হচ্ছে। অনুগ্রহ করে পরে আবার চেষ্টা করুন।";
  }
};