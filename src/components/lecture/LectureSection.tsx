import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';

interface LectureSectionProps {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
  colorClass?: string;
}

export default function LectureSection({ 
  title, 
  icon: Icon, 
  children, 
  defaultOpen = false,
  colorClass = "text-teal-600 dark:text-teal-400"
}: LectureSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={clsx(
      "mb-8 bg-cyber-black/80 backdrop-blur-xl rounded-none border border-cyber-cyan/30 shadow-[0_0_15px_rgba(0,240,255,0.1)] overflow-hidden transition-all duration-300 relative",
      isOpen ? "shadow-[0_0_30px_rgba(0,240,255,0.2)] border-cyber-cyan" : "hover:border-cyber-cyan/70"
    )}>
      {/* Cyberpunk decorative elements */}
      <div className="absolute top-0 left-0 w-2 h-full bg-cyber-cyan opacity-50"></div>
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyber-cyan opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyber-cyan opacity-50"></div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-6 flex items-center justify-between bg-cyber-black/50 hover:bg-cyber-cyan/5 transition-all group relative z-10"
      >
        <div className="flex items-center gap-5">
          <div className={clsx(
            "p-3 rounded-none bg-cyber-black border border-cyber-cyan/50 group-hover:border-cyber-cyan transition-all duration-300", 
            colorClass,
            isOpen && "shadow-[0_0_15px_currentColor] border-current"
          )}>
            <Icon className="w-7 h-7" />
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-cyber-light text-left tracking-widest uppercase">
            {title}
          </h2>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
          className={clsx(
            "p-2 rounded-none border transition-colors",
            isOpen ? "text-cyber-cyan border-cyber-cyan shadow-[0_0_10px_rgba(0,240,255,0.3)]" : "text-cyber-gray border-cyber-gray/50 group-hover:text-cyber-cyan group-hover:border-cyber-cyan/50"
          )}
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden relative z-10"
          >
            <div className="p-6 md:p-10 border-t border-cyber-cyan/30 bg-cyber-black/40">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
