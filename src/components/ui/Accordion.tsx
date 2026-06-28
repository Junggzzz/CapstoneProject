"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface AccordionItem {
  question: string;
  answer: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
}

export default function Accordion({ items }: AccordionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleIndex = (index: number) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className="w-full space-y-4">
      {items.map((item, index) => {
        const isActive = activeIndex === index;
        
        return (
          <div 
            key={index} 
            className={`border border-white/10 rounded-2xl overflow-hidden transition-colors duration-300 ${isActive ? 'bg-[var(--color-secondary)] border-[var(--color-accent)]/30' : 'bg-[var(--color-background)] hover:border-white/20'}`}
          >
            <button
              onClick={() => toggleIndex(index)}
              className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
            >
              <span className="font-semibold text-lg pr-8">{item.question}</span>
              <motion.div
                animate={{ rotate: isActive ? 180 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className={`flex-shrink-0 ${isActive ? 'text-[var(--color-accent)]' : 'text-[var(--color-muted)]'}`}
              >
                <ChevronDown size={24} />
              </motion.div>
            </button>
            
            <AnimatePresence initial={false}>
              {isActive && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="px-6 pb-6 text-[var(--color-muted)] leading-relaxed">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
