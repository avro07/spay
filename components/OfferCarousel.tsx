
import React, { useState, useEffect } from 'react';
import { ShoppingBag, Utensils } from 'lucide-react';
import { AppScreen } from '../types';

interface OfferCarouselProps {
  onNavigate: (screen: AppScreen) => void;
}

const OfferCarousel: React.FC<OfferCarouselProps> = ({ onNavigate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const offers = [
    {
      id: 1,
      action: AppScreen.MOBILE_RECHARGE,
      bgClass: 'bg-gradient-to-r from-violet-600 to-fuchsia-600',
      shadowClass: 'shadow-violet-200',
      content: (
        <>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-400 opacity-20 rounded-full -ml-10 -mb-10 blur-xl"></div>
          <div className="relative z-10">
              <span className="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold text-white border border-white/20 inline-block mb-1">
                  মোবাইল রিচার্জ
              </span>
              <h3 className="font-bold text-white text-lg mb-0.5">২০ টাকা ক্যাশব্যাক</h3>
              <p className="text-violet-100 text-xs">৫০ টাকা বা তার বেশি রিচার্জে</p>
          </div>
        </>
      )
    },
    {
      id: 2,
      action: AppScreen.PAYMENT,
      bgClass: 'bg-gradient-to-br from-orange-500 to-red-500',
      shadowClass: 'shadow-orange-200',
      content: (
        <>
          <div className="absolute top-10 right-10 w-40 h-40 bg-yellow-300 opacity-20 rounded-full blur-3xl"></div>
          <div className="relative z-10">
              <div className="flex justify-between items-start">
                <div>
                    <span className="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold text-white border border-white/20 inline-block mb-1">
                        সুপার শপ
                    </span>
                    <h3 className="font-bold text-white text-lg">স্বপ্ন-তে ১০% ছাড়</h3>
                    <p className="text-orange-100 text-xs mt-0.5">যেকোনো গ্রোসারি কেনাকাটায়</p>
                </div>
                <div className="bg-white/20 rounded-lg p-1.5 backdrop-blur-sm">
                    <ShoppingBag className="text-white w-5 h-5" />
                </div>
              </div>
          </div>
        </>
      )
    },
    {
      id: 3,
      action: AppScreen.ADD_MONEY,
      bgClass: 'bg-gradient-to-r from-blue-600 to-cyan-500',
      shadowClass: 'shadow-blue-200',
      content: (
        <>
           <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
           <div className="absolute bottom-0 left-0 w-24 h-24 bg-rose-500 opacity-20 rounded-full -ml-10 -mb-10 blur-xl"></div>
           
           <div className="relative z-10 flex justify-between items-center">
                <div className="space-y-1">
                    <span className="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold text-white border border-white/20 inline-block mb-0.5">
                        অ্যাড মানি
                    </span>
                    <h3 className="font-bold text-white text-lg">২০০০ টাকা অ্যাড মানি</h3>
                    <p className="text-indigo-100 text-xs">ব্যাংক/কার্ড থেকে</p>
                </div>
                <div className="text-right">
                    <span className="block text-2xl font-black text-white drop-shadow-sm">২০৳</span>
                    <span className="text-[10px] text-indigo-100 font-medium">বোনাস</span>
                </div>
            </div>
        </>
      )
    },
    {
      id: 4,
      action: AppScreen.PAYMENT,
      bgClass: 'bg-black',
      shadowClass: 'shadow-gray-300',
      content: (
        <>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop')] bg-cover opacity-40 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
          
          <div className="relative z-10 h-full flex flex-col justify-center">
              <div className="flex justify-between items-center mb-1">
                 <span className="bg-red-600 px-2 py-0.5 rounded text-[10px] font-bold text-white inline-block">
                      ফুড অফার
                  </span>
                  <div className="bg-white/10 backdrop-blur-sm p-1.5 rounded-lg">
                    <Utensils className="text-yellow-400 w-4 h-4" />
                  </div>
              </div>
              
              <h3 className="font-bold text-white text-lg leading-none">১টি কিনলে <span className="text-red-500">১টি ফ্রি!</span></h3>
              <p className="text-gray-300 text-[10px] mt-1">KFC-তে নির্দিষ্ট বার্গার এবং মিল অর্ডারে</p>
          </div>
        </>
      )
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % offers.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [offers.length]);

  return (
    <div className="w-full relative group touch-pan-y">
      <div className="overflow-hidden rounded-2xl">
        <div 
            className="flex transition-transform duration-700 ease-in-out" 
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
            {offers.map((offer) => (
                <div 
                    key={offer.id} 
                    className="w-full flex-shrink-0 cursor-pointer"
                    onClick={() => onNavigate(offer.action)}
                >
                    <div className={`relative overflow-hidden ${offer.bgClass} p-4 h-32 shadow-lg ${offer.shadowClass} flex flex-col justify-center`}>
                        {offer.content}
                    </div>
                </div>
            ))}
        </div>
      </div>
      
      {/* Indicators */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-20 pointer-events-none">
        {offers.map((_, idx) => (
          <div
            key={idx}
            className={`h-1 rounded-full transition-all duration-300 shadow-sm ${idx === currentIndex ? 'bg-white w-4' : 'bg-white/40 w-1'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default OfferCarousel;
