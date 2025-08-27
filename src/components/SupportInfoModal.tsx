"use client";

import { useState } from "react";

interface SupportInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SupportInfoModal({ isOpen, onClose }: SupportInfoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50 p-4 rounded-md">
      <div className="bg-[#03211e] border border-white/20 rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">Support a School</h3>
          <button
            onClick={onClose}
            className="cursor-pointer text-white/60 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="text-white/80 mb-6">
          <p>After logging in, click &apos;Select School&apos; in the menu and choose your favorite school to start supporting them!</p>
        </div>
        
        <button
          onClick={onClose}
          className="cursor-pointer w-full bg-[#15C0B9] hover:bg-[#15C0B9]/80 text-white font-medium py-3 px-4 rounded-md transition-all duration-200"
        >
          Got it!
        </button>
      </div>
    </div>
  );
}

export function useSupportInfoModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const SupportModal = () => (
    <SupportInfoModal isOpen={isModalOpen} onClose={closeModal} />
  );

  return {
    openModal,
    closeModal,
    SupportModal,
  };
}
