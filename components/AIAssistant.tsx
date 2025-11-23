import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, X, Loader2 } from 'lucide-react';
import { getAIResponse } from '../services/geminiService';
import { User, Transaction } from '../types';

interface AIAssistantProps {
  user: User;
  transactions: Transaction[];
  onClose: () => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ user, transactions, onClose }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `হ্যালো ${user.name}! আমি SPay অ্যাসিস্ট্যান্ট। আপনার লেনদেন বা অফার সম্পর্কে কিছু জানতে চান?`,
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await getAIResponse(input, user, transactions);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      // Error handled in service usually, but safety net here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex flex-col justify-end sm:justify-center">
      <div className="bg-white w-full max-w-md mx-auto h-[90vh] sm:h-[600px] sm:rounded-2xl flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300">
        
        {/* Header */}
        <div className="bg-white p-4 shadow-sm border-b border-gray-100 flex justify-between items-center rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-rose-50 rounded-full flex items-center justify-center border border-rose-100">
              <Bot className="text-rose-600" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">স্মার্ট অ্যাসিস্ট্যান্ট</h3>
              <span className="text-xs text-emerald-500 flex items-center gap-1">
                 <span className="w-2 h-2 bg-emerald-500 rounded-full"></span> অনলাইন
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        {/* Chat Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
        >
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'bg-rose-600 text-white rounded-br-none' 
                    : 'bg-white text-gray-700 border border-gray-200 rounded-bl-none shadow-sm'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
             <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-gray-200 shadow-sm flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
                  <span className="text-xs text-gray-400">টাইপ করছে...</span>
                </div>
             </div>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-white p-4 border-t border-gray-100 pb-safe">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="এখানে লিখুন..."
              className="flex-1 bg-gray-100 border-0 rounded-full px-4 py-3 focus:ring-1 focus:ring-rose-500 outline-none text-sm text-gray-800"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={`p-3 rounded-full transition-colors ${
                input.trim() && !isLoading ? 'bg-rose-600 text-white shadow-lg shadow-rose-200 hover:bg-rose-700' : 'bg-gray-200 text-gray-400'
              }`}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;