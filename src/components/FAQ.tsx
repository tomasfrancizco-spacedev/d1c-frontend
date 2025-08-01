"use client";

import { useState } from "react";
import Image from "next/image";

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
    answer:
      "Division One Crypto is a fan powered platform that lets you support your favorite college teams and athletes through blockchain. Ever token trade helps fund NIL programs at the school you choose.",
  },
  {
    id: "2",
    question: "How do I support my team?",
    answer:
      "For every 100 $D1C you trade, 2 $D1C is automatically sent to support your chosen school's athletic programs. This creates a direct impact where your trading activity helps fund scholarships, equipment, and other resources for student athletes.",
  },
  {
    id: "3",
    question: "What do I need to get started?",
    answer:
      "To get started, you need to connect your Phantom wallet to the platform. Then, you can pick your favorite school and start trading. Your contributions will automatically flow to your chosen school with every trade.",
  },
  {
    id: "4",
    question: "What is $D1C and how does it work?",
    answer:
      "$D1C is the native token of Division One Crypto. It is used to trade on the platform and support your favorite teams. For every 100 $D1C you trade, 2 $D1C is automatically sent to support your chosen school's athletic programs.",
  },
  {
    id: "5",
    question: "Can I benefit financially from trading D1C?",
    answer:
      "No, D1C is not a financial instrument and does not offer any financial benefits. It is a platform that allows you to support your favorite teams and athletes through blockchain.",
  },
];

export default function FAQ({ className = "" }: FAQProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    new Set(["1"])
  ); // First item expanded by default

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
        <h3 className="text-2xl md:text-3xl lg:text-4xl text-white font-semibold mb-4">
          Frequently Asked Questions
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start lg:items-stretch">
        <div className="order-1 lg:order-2">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-md relative w-full h-96 lg:h-full">
            <Image
              src="/landing/faq.png"
              alt="FAQ"
              fill
              className="object-contain lg:object-none lg:object-center rounded-md"
            />
          </div>
        </div>

        <div className="order-2 lg:order-1">
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
        </div>
      </div>
  );
}
