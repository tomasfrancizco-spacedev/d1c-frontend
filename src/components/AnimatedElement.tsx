"use client";
import React, { ReactNode } from 'react';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';

interface AnimatedElementProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
  threshold?: number;
  rootMargin?: string;
}

export default function AnimatedElement({
  children,
  className = '',
  delay = 0,
  duration = 1000,
  distance = 30,
  once = true,
  threshold = 0.1,
  rootMargin = '0px'
}: AnimatedElementProps) {
  const [ref, isVisible] = useIntersectionObserver<HTMLDivElement>({
    threshold,
    rootMargin
  }, once);

  const delayStyle = delay ? `${delay}ms` : '0ms';
  const durationStyle = `${duration}ms`;

  return (
    <div
      ref={ref}
      className={`transition-all ease-out ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : `translateY(${distance}px)`,
        transitionDuration: durationStyle,
        transitionDelay: delayStyle,
      }}
    >
      {children}
    </div>
  );
} 