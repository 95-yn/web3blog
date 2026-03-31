'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence, Transition } from 'motion/react';

interface RotatingTextProps {
  texts: string[];
  rotationInterval?: number;
  transition?: Transition;
  className?: string;
  splitBy?: 'characters' | 'words';
  staggerDuration?: number;
}

const RotatingText: React.FC<RotatingTextProps> = ({
  texts,
  rotationInterval = 2500,
  transition = { type: 'spring', damping: 25, stiffness: 300 },
  className = '',
  splitBy = 'characters',
  staggerDuration = 0.025,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % texts.length);
  }, [texts.length]);

  useEffect(() => {
    const id = setInterval(next, rotationInterval);
    return () => clearInterval(id);
  }, [next, rotationInterval]);

  const elements = useMemo(() => {
    const text = texts[currentIndex];
    if (splitBy === 'words') {
      return text.split(' ').map((w, i, arr) => ({
        chars: [w],
        space: i < arr.length - 1,
      }));
    }
    const words = text.split(' ');
    return words.map((word, i) => ({
      chars: Array.from(word),
      space: i < words.length - 1,
    }));
  }, [texts, currentIndex, splitBy]);

  const totalChars = elements.reduce((s, w) => s + w.chars.length, 0);

  return (
    <span className={`inline-flex items-center overflow-hidden ${className}`}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={currentIndex} className="inline-flex items-center">
          {elements.map((wordObj, wi) => {
            const prevCount = elements.slice(0, wi).reduce((s, w) => s + w.chars.length, 0);
            return (
              <span key={wi} className="inline-flex whitespace-pre">
                {wordObj.chars.map((char, ci) => (
                  <motion.span
                    key={ci}
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: '-100%', opacity: 0 }}
                    transition={{
                      ...transition,
                      delay: (prevCount + ci) * staggerDuration,
                    }}
                    className="inline-block"
                  >
                    {char}
                  </motion.span>
                ))}
                {wordObj.space && <span>&nbsp;</span>}
              </span>
            );
          })}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

export default RotatingText;
