"use client";

import { useState } from "react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQProps {
  className?: string;
}

const faqData: FAQItem[] = [
  {
    id: "1",
    question: "What is Division One Crypto (D1C)?",
    answer: "Division One Crypto is a platform that connects college sports fans with their favorite teams through cryptocurrency trading. Every trade helps fund real athletes at participating schools through NIL-compliant contributions."
  },
  {
    id: "2", 
    question: "How does trading help student athletes?",
    answer: "For every 100 $D1C you trade, 2 $D1C is automatically sent to support your chosen school's athletic programs. This creates a direct impact where your trading activity helps fund scholarships, equipment, and other resources for student athletes."
  },
  {
    id: "3",
    question: "Is this compliant with NIL rules?",
    answer: "Yes, D1C is designed to align with NCAA Name, Image, and Likeness (NIL) regulations. All contributions are structured to comply with current NIL guidelines while supporting student athletes in a transparent and legal manner."
  },
  {
    id: "4",
    question: "How do I get started?",
    answer: "Getting started is simple: connect your Solana wallet, pick your favorite school from our list of participating institutions, and start trading. Your contributions will automatically flow to your chosen school with every trade."
  },
  {
    id: "5",
    question: "What wallet do I need?",
    answer: "D1C works with any Solana-compatible wallet, including Phantom, Solflare, and other popular options. Simply connect your existing wallet or create a new one to get started with trading and supporting your favorite teams."
  }
];

export default function FAQ({ className = "" }: FAQProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(["1"])); // First item expanded by default

  const toggleItem = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      {/* Title */}
      <div className="text-center mb-12">
        <h3 className="text-2xl md:text-3xl lg:text-4xl text-[#E6F0F0] mb-4">
          Frequently Asked Questions
        </h3>
      </div>

      {/* FAQ Items */}
      <div className="space-y-4">
        {faqData.map((item) => {
          const isExpanded = expandedItems.has(item.id);
          
          return (
            <div
              key={item.id}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-md overflow-hidden hover:bg-white/10 hover:border-[#15C0B9]/30 transition-all duration-300"
            >
              {/* Question Header */}
              <button
                onClick={() => toggleItem(item.id)}
                className="cursor-pointer w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-[#15C0B9] focus:ring-inset"
              >
                <h4 className="text-lg font-semibold text-[#E6F0F0] pr-4">
                  {item.question}
                </h4>
                <div className="flex-shrink-0">
                  <svg
                    className={`w-5 h-5 text-[#15C0B9] transition-transform duration-300 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>

              {/* Answer Content */}
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isExpanded 
                    ? "max-h-96 opacity-100" 
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-5">
                  <div className="border-t border-white/10 pt-4">
                    <p className="text-[#E6F0F0]/80 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 