import { motion } from 'motion/react';

export default function MainHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="text-center mb-10"
    >
      <h1 className="font-display text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-500 dark:from-teal-300 dark:to-cyan-200 dark:drop-shadow-[0_0_20px_rgba(45,212,191,0.6)]">
          Chiến Binh Nguyên Tố
        </span>
      </h1>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="text-lg md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium"
      >
        Làm chủ quy trình tách & tái chế kim loại để bảo vệ Trái Đất.
      </motion.p>
    </motion.div>
  );
}
