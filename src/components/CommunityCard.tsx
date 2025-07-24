"use client";

import Image from "next/image";

interface CommunityCardProps {
  image: string;
  title: string;
  subtitle: string;
  onSupport?: () => void;
}

export default function CommunityCard({ 
  image, 
  title, 
  subtitle, 
  onSupport 
}: CommunityCardProps) {
  return (
    <div className="flex-shrink-0 w-80 bg-white/5 backdrop-blur-md border border-white/10 rounded-md overflow-hidden hover:bg-white/10 hover:border-[#15C0B9]/30 transition-all duration-300 shadow-2xl">
      {/* Image Section */}
      <div className="relative h-48 w-full">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      
      {/* Content Section */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-[#E6F0F0] mb-2 line-clamp-2">
          {title}
        </h3>
        
        <p className="text-[#E6F0F0]/70 text-sm mb-4 line-clamp-3">
          {subtitle}
        </p>
        
        <button
          onClick={onSupport}
          className="cursor-pointer w-full bg-[#0f4941] hover:bg-[#104f47] text-white font-medium py-3 px-4 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#15C0B9] focus:ring-offset-2 focus:ring-offset-[#19181C]"
        >
          Support them
        </button>
      </div>
    </div>
  );
} 