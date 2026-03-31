'use client';

import React, { useRef, useEffect, useState } from 'react';

interface AnimatedContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  distance?: number;
  direction?: 'vertical' | 'horizontal';
  reverse?: boolean;
  duration?: number;
  ease?: string;
  initialOpacity?: number;
  scale?: number;
  threshold?: number;
  delay?: number;
}

const AnimatedContent: React.FC<AnimatedContentProps> = ({
  children,
  distance = 50,
  direction = 'vertical',
  reverse = false,
  duration = 0.6,
  ease = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  initialOpacity = 0,
  scale = 1,
  threshold = 0.1,
  delay = 0,
  className = '',
  ...props
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const axis = direction === 'horizontal' ? 'X' : 'Y';
  const offset = reverse ? -distance : distance;

  const style: React.CSSProperties = {
    opacity: isVisible ? 1 : initialOpacity,
    transform: isVisible
      ? 'translate3d(0, 0, 0) scale(1)'
      : `translate3d(${axis === 'X' ? offset : 0}px, ${axis === 'Y' ? offset : 0}px, 0) scale(${scale})`,
    transition: `opacity ${duration}s ${ease} ${delay}s, transform ${duration}s ${ease} ${delay}s`,
    willChange: 'opacity, transform',
  };

  return (
    <div ref={ref} className={className} style={style} {...props}>
      {children}
    </div>
  );
};

export default AnimatedContent;
