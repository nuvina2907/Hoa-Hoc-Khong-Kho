import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, Lightbulb } from 'lucide-react';
import clsx from 'clsx';

interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

interface MiniQuizProps {
  question: string;
  options: Option[];
}

export default function MiniQuiz({ question, options }: MiniQuizProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSelect = (id: string) => {
    if (isSubmitted) return;
    setSelectedId(id);
  };

  const handleSubmit = () => {
    if (!selectedId) return;
    setIsSubmitted(true);
  };

  const handleRetry = () => {
    setSelectedId(null);
    setIsSubmitted(false);
  };

  const selectedOption = options.find((o) => o.id === selectedId);

  return (
    <div className="bg-cyber-black/60 backdrop-blur-md rounded-none p-8 border border-cyber-cyan/50 mt-8 shadow-[0_0_20px_rgba(0,240,255,0.1)] relative overflow-hidden">
      {/* Cyberpunk decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyber-cyan/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyber-cyan via-cyber-magenta to-cyber-yellow opacity-50"></div>
      <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-cyber-cyan opacity-30"></div>
      
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="p-2.5 bg-cyber-yellow/10 rounded-none border border-cyber-yellow/50 shadow-[0_0_15px_rgba(252,238,10,0.2)]">
          <Lightbulb className="w-6 h-6 text-cyber-yellow" />
        </div>
        <h4 className="font-display font-bold text-2xl text-cyber-light tracking-widest uppercase">KIỂM TRA HỆ THỐNG</h4>
      </div>
      
      <p className="text-cyber-light mb-6 font-mono text-lg leading-relaxed relative z-10 border-l-2 border-cyber-cyan pl-4 bg-cyber-cyan/5 py-2">
        <span className="text-cyber-cyan mr-2">{'>'}</span>{question}
      </p>
      
      <div className="space-y-3 mb-8 relative z-10 font-mono">
        {options.map((option) => {
          const isSelected = selectedId === option.id;
          const showCorrect = isSubmitted && option.isCorrect;
          const showWrong = isSubmitted && isSelected && !option.isCorrect;

          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              disabled={isSubmitted}
              className={clsx(
                "w-full text-left px-5 py-4 rounded-none border transition-all duration-300 flex justify-between items-center group relative overflow-hidden",
                !isSubmitted && !isSelected && "border-cyber-cyan/30 bg-cyber-black hover:border-cyber-cyan hover:bg-cyber-cyan/10 hover:shadow-[0_0_15px_rgba(0,240,255,0.2)]",
                !isSubmitted && isSelected && "border-cyber-yellow bg-cyber-yellow/10 shadow-[0_0_15px_rgba(252,238,10,0.3)]",
                showCorrect && "border-cyber-cyan bg-cyber-cyan/20 shadow-[0_0_20px_rgba(0,240,255,0.3)]",
                showWrong && "border-cyber-magenta bg-cyber-magenta/20 shadow-[0_0_20px_rgba(255,0,60,0.3)]",
                isSubmitted && !isSelected && !option.isCorrect && "border-cyber-gray/30 bg-cyber-black opacity-40 cursor-not-allowed"
              )}
            >
              {/* Scanline effect on hover/select */}
              {(!isSubmitted && isSelected) && <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(252,238,10,0.1)_50%)] bg-[length:100%_4px] pointer-events-none"></div>}
              
              <span className={clsx(
                "font-medium text-base transition-colors relative z-10 uppercase tracking-wider",
                showCorrect ? "text-cyber-cyan" : showWrong ? "text-cyber-magenta" : isSelected ? "text-cyber-yellow" : "text-cyber-light group-hover:text-cyber-cyan"
              )}>
                <span className="opacity-50 mr-2">[{option.id}]</span> {option.text}
              </span>
              {showCorrect && <CheckCircle2 className="w-6 h-6 text-cyber-cyan drop-shadow-[0_0_8px_rgba(0,240,255,0.8)] relative z-10" />}
              {showWrong && <XCircle className="w-6 h-6 text-cyber-magenta drop-shadow-[0_0_8px_rgba(255,0,60,0.8)] relative z-10" />}
            </button>
          );
        })}
      </div>

      <div className="relative z-10">
        {!isSubmitted ? (
          <button
            onClick={handleSubmit}
            disabled={!selectedId}
            className="w-full py-4 rounded-none bg-cyber-cyan hover:bg-cyber-cyan/80 disabled:bg-cyber-gray/20 disabled:border-cyber-gray/50 border-2 border-cyber-cyan text-cyber-black disabled:text-cyber-gray font-bold text-lg shadow-[0_0_15px_rgba(0,240,255,0.4)] disabled:shadow-none transition-all uppercase tracking-widest font-display"
          >
            THỰC THI
          </button>
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={clsx(
                "p-6 rounded-none border backdrop-blur-sm font-mono",
                selectedOption?.isCorrect 
                  ? "bg-cyber-cyan/10 border-cyber-cyan shadow-[0_0_20px_rgba(0,240,255,0.2)]" 
                  : "bg-cyber-magenta/10 border-cyber-magenta shadow-[0_0_20px_rgba(255,0,60,0.2)]"
              )}
            >
              <p className={clsx(
                "font-display font-bold text-xl mb-2 flex items-center gap-2 uppercase tracking-widest",
                selectedOption?.isCorrect ? "text-cyber-cyan" : "text-cyber-magenta"
              )}>
                {selectedOption?.isCorrect ? "> TRUY CẬP ĐƯỢC CẤP PHÉP" : "> LỖI HỆ THỐNG"}
              </p>
              <p className="text-cyber-light text-sm leading-relaxed border-l border-current pl-3">
                {selectedOption?.explanation}
              </p>
              
              {!selectedOption?.isCorrect && (
                <button 
                  onClick={handleRetry}
                  className="mt-4 px-6 py-2 rounded-none font-bold text-cyber-yellow bg-cyber-black hover:bg-cyber-yellow/10 border border-cyber-yellow transition-colors shadow-[0_0_10px_rgba(252,238,10,0.2)] uppercase tracking-widest text-sm"
                >
                  REBOOT
                </button>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
