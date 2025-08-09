"use client";

import { useEffect, useRef, useState } from "react";
import CollegeCard from "./CollegeCard";

interface CollegeItem {
  logo: string;
  schoolName: string;
  commonName: string;
  nickname: string;
  city: string;
  state: string;
  type: string;
  subdivision: string;
  primary: string;
}

interface CollegeCarouselProps {
  items: CollegeItem[];
}

export default function CollegeCarousel({ items }: CollegeCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollSpeed, setScrollSpeed] = useState(1);
  const scrollAmountRef = useRef(0);

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
  }, [scrollSpeed, items.length]);

  const handleSupport = (item: CollegeItem) => {
    console.log(`Supporting: ${item.schoolName}`); // TODO: Add support logic here
  };

  return (
    <div className="w-full overflow-hidden">
      <div 
        ref={scrollRef} 
        className="flex gap-6 overflow-x-hidden scrollbar-hide"
        onMouseEnter={() => setScrollSpeed(0.3)}
        onMouseLeave={() => setScrollSpeed(1)}
      >
        {items.map((item, index) => (
          <div
            key={`${item.nickname}-${index}`}
            className="flex-shrink-0"
            onMouseEnter={() => setScrollSpeed(0.3)}
            onMouseLeave={() => setScrollSpeed(1)}
          >
            <CollegeCard
              image={item.logo}
              title={item.schoolName}
              subtitle={item.city + ", " + item.state}
              onSupport={() => handleSupport(item)}
            />
          </div>
        ))}
      </div>
    </div>
  );
} 