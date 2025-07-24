"use client";

import { useEffect, useRef, useState } from "react";
import CommunityCard from "./CommunityCard";

interface CommunityItem {
  id: string;
  image: string;
  title: string;
  subtitle: string;
}

interface CommunityCarouselProps {
  items: CommunityItem[];
}

export default function CommunityCarousel({ items }: CommunityCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollSpeed, setScrollSpeed] = useState(1);
  const scrollAmountRef = useRef(0);

  // Repeat items multiple times for infinite scroll effect (like the working carousel)
  const repeatItems = [
    ...items,
    ...items,
    ...items,
    ...items,
  ];

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
  }, [scrollSpeed, repeatItems.length]);

  const handleSupport = (item: CommunityItem) => {
    console.log(`Supporting: ${item.title}`); // TODO: Add support logic here
  };

  return (
    <div className="w-full overflow-hidden">
      <div 
        ref={scrollRef} 
        className="flex gap-6 overflow-x-hidden scrollbar-hide"
        onMouseEnter={() => setScrollSpeed(0.3)}
        onMouseLeave={() => setScrollSpeed(1)}
      >
        {repeatItems.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className="flex-shrink-0"
            onMouseEnter={() => setScrollSpeed(0.3)}
            onMouseLeave={() => setScrollSpeed(1)}
          >
            <CommunityCard
              image={item.image}
              title={item.title}
              subtitle={item.subtitle}
              onSupport={() => handleSupport(item)}
            />
          </div>
        ))}
      </div>
    </div>
  );
} 