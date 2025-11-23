import { GoogleGenAI } from "@google/genai";
import { Transaction, User } from '../types';

export const getAIResponse = async (
  userQuery: string,
  userContext: User,
  transactionHistory: Transaction[]
): Promise<string> => {
  try {
    // Safely check for API Key. In browser environments like this without a bundler shim, 
    // accessing process.env directly at the top level can cause a ReferenceError.
    // We check if process is defined first.
    // @ts-ignore
    const apiKey = (typeof process !== 'undefined' && process.env && process.env.API_KEY) 
      ? process.env.API_KEY 
      : '';
      
    if (!apiKey) {
        console.warn("Gemini API Key is missing. AI features will not work.");
        return "দুঃখিত, বর্তমানে এআই সেবাটি উপলব্ধ নেই। (API Key Missing)";
    }

    // Initialize Gemini Client Lazily
    const ai = new GoogleGenAI({ apiKey: apiKey });
    const model = 'gemini-2.5-flash';
    
    const historySummary = transactionHistory.map(t => 
      `- ${t.date}: ${t.type} of ${t.amount} BDT to/from ${t.recipientName || 'Unknown'} (${t.description || ''})`
    ).join('\n');

    const systemInstruction = `You are 'DeshPay Assistant', a helpful AI support agent for a Bangladeshi mobile financial app.
      
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
      5. Keep responses short (under 3 sentences if possible).`;

    const response = await ai.models.generateContent({
      model: model,
      contents: userQuery,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    return response.text || "দুঃখিত, আমি এখন উত্তর দিতে পারছি না।";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "সংযোগ সমস্যা হচ্ছে। অনুগ্রহ করে পরে আবার চেষ্টা করুন।";
  }
};