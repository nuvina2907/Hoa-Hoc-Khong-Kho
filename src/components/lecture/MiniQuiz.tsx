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
    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 mt-6">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-amber-500" />
        <h4 className="font-bold text-lg text-slate-800 dark:text-slate-200">Câu hỏi ôn tập nhanh</h4>
      </div>
      
      <p className="text-slate-700 dark:text-slate-300 mb-4 font-medium">{question}</p>
      
      <div className="space-y-3 mb-6">
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
                "w-full text-left px-4 py-3 rounded-xl border-2 transition-all duration-200 flex justify-between items-center",
                !isSubmitted && !isSelected && "border-slate-200 dark:border-slate-700 hover:border-teal-400 dark:hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-teal-900/20",
                !isSubmitted && isSelected && "border-teal-500 bg-teal-50 dark:bg-teal-900/30",
                showCorrect && "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30",
                showWrong && "border-rose-500 bg-rose-50 dark:bg-rose-900/30",
                isSubmitted && !isSelected && !option.isCorrect && "border-slate-200 dark:border-slate-700 opacity-50 cursor-not-allowed"
              )}
            >
              <span className={clsx(
                "font-medium",
                showCorrect ? "text-emerald-700 dark:text-emerald-300" : showWrong ? "text-rose-700 dark:text-rose-300" : "text-slate-700 dark:text-slate-300"
              )}>
                {option.text}
              </span>
              {showCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
              {showWrong && <XCircle className="w-5 h-5 text-rose-500" />}
            </button>
          );
        })}
      </div>

      {!isSubmitted ? (
        <button
          onClick={handleSubmit}
          disabled={!selectedId}
          className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold transition-colors"
        >
          Kiểm tra đáp án
        </button>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className={clsx(
              "p-4 rounded-xl border",
              selectedOption?.isCorrect 
                ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800" 
                : "bg-rose-50 border-rose-200 dark:bg-rose-900/20 dark:border-rose-800"
            )}
          >
            <p className={clsx(
              "font-bold mb-1",
              selectedOption?.isCorrect ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400"
            )}>
              {selectedOption?.isCorrect ? "🎉 Chính xác! Giỏi quá!" : "😅 Chưa đúng rồi, thử lại nhé!"}
            </p>
            <p className="text-slate-700 dark:text-slate-300 text-sm">
              {selectedOption?.explanation}
            </p>
            
            {!selectedOption?.isCorrect && (
              <button 
                onClick={handleRetry}
                className="mt-3 text-sm font-bold text-teal-600 dark:text-teal-400 hover:underline"
              >
                Thử lại
              </button>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
