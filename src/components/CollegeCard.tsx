"use client";

import Image from "next/image";

interface CollegeCardProps {
  image: string;
  title: string;
  subtitle: string;
  rank?: number;
  isRanked?: boolean;
  onSupport?: () => void;
}

export default function CollegeCard({
  image,
  title,
  subtitle,
  rank,
  isRanked,
  onSupport,
}: CollegeCardProps) {

  return (
    <div className="flex-shrink-0 w-[200px] h-[280px] bg-white/5 backdrop-blur-md border border-white/10 rounded-md overflow-hidden hover:bg-white/10 hover:border-[#15C0B9]/30 transition-all duration-300 shadow-2xl flex flex-col">
      {/* Image Section */}
      <div className="relative h-32 w-full bg-white">
        <Image src={image} alt={title} fill className="object-contain p-2" />
        {isRanked && (
          <div className="absolute top-2 left-2 h-[20px] w-[20px] text-white bg-[#03211e]/90 backdrop-blur-md border border-white/10 rounded-md flex items-center justify-center z-10">
            <p className="text-xs">{rank}</p>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-3 flex-1 flex flex-col">
        <h3 className="text-sm font-semibold text-[#E6F0F0] mb-1 line-clamp-2 flex items-center">
          {title}
        </h3>

        <p className="text-[#E6F0F0]/70 text-xs mb-3 line-clamp-2 flex-1">
          {subtitle}
        </p>

        <button
          onClick={onSupport}
          className="cursor-pointer w-full bg-[#0f4941] hover:bg-[#104f47] text-white font-medium py-2 px-3 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#15C0B9] focus:ring-offset-2 focus:ring-offset-[#19181C] text-xs mt-auto"
        >
          Support them
        </button>
      </div>
    </div>
  );
}
