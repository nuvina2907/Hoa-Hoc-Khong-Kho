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
    <div className="mb-6 bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className={clsx("p-2 rounded-xl bg-white dark:bg-slate-900 shadow-sm", colorClass)}>
            <Icon className="w-6 h-6" />
          </div>
          <h2 className="font-display text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100 text-left">
            {title}
          </h2>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-6 h-6 text-slate-400" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-6 md:p-8 border-t border-[var(--border)]">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
