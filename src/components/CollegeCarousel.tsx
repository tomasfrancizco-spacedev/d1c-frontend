"use client";

import { useEffect, useRef, useState } from "react";
import CollegeCard from "./CollegeCard";
import { useSupportInfoModal } from "./SupportInfoModal";
import { CollegeData } from "@/types/api";
import { loadCollegesWithCache } from "@/lib/cache/colleges-cache";

interface CollegeCarouselProps {
  maxItems?: number;
  forceReload?: boolean;
}

export default function CollegeCarousel({ 
  maxItems = 30, 
  forceReload = false 
}: CollegeCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollSpeed, setScrollSpeed] = useState(1);
  const scrollAmountRef = useRef(0);
  const { openModal, SupportModal } = useSupportInfoModal();
  
  const [colleges, setColleges] = useState<CollegeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadColleges = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data, error, fromCache } = await loadCollegesWithCache(forceReload);

        if (error) {
          setError(error);
          setColleges([]);
        } else if (data) {
          // Shuffle and limit colleges for carousel display
          const shuffledColleges = data.sort(() => Math.random() - 0.5).slice(0, maxItems);
          setColleges(shuffledColleges);
          console.log(`Colleges loaded ${fromCache ? 'from cache' : 'from API'} for carousel`);
        }
      } catch (err) {
        console.error("Error loading colleges for carousel:", err);
        setError("Failed to load colleges");
        setColleges([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadColleges();
  }, [forceReload, maxItems]);

  // Carousel scrolling animation
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    const scroll = () => {
      if (!scrollContainer) return;

      scrollAmountRef.current += scrollSpeed;
      scrollContainer.scrollLeft = scrollAmountRef.current;

      if (
        scrollAmountRef.current >=
        (scrollContainer.scrollWidth - scrollContainer.clientWidth) * 0.75
      ) {
        scrollAmountRef.current = 0;
      }

      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [scrollSpeed, colleges.length]);

  const handleSupport = () => {
    openModal();
  };

  if (isLoading) {
    return (
      <div className="w-full overflow-hidden">
        <div className="flex gap-6 overflow-x-hidden">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex-shrink-0">
              <div className="w-[200px] h-[120px] bg-white/10 rounded-lg animate-pulse" />
            </div>
          ))}
        </div>
        <SupportModal />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full overflow-hidden">
        <div className="text-center text-red-400 p-8">
          <p>Error loading colleges</p>
        </div>
        <SupportModal />
      </div>
    );
  }

  // Main carousel render
  return (
    <div className="w-full overflow-hidden">
      <div 
        ref={scrollRef} 
        className="flex gap-6 overflow-x-hidden scrollbar-hide"
        onMouseEnter={() => setScrollSpeed(0.3)}
        onMouseLeave={() => setScrollSpeed(1)}
      >
        {colleges.map((college, index) => (
          <div
            key={`${college.nickname}-${index}`}
            className="flex-shrink-0"
            onMouseEnter={() => setScrollSpeed(0.3)}
            onMouseLeave={() => setScrollSpeed(1)}
          >
            <CollegeCard
              image={college.logo}
              title={college.name}
              subtitle={college.city + ", " + college.state}
              onSupport={() => handleSupport()}
            />
          </div>
        ))}
      </div>
      <SupportModal />
    </div>
  );
} 