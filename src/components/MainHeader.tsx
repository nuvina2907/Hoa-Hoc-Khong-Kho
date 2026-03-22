import { motion } from 'motion/react';
import { Cpu, Zap } from 'lucide-react';

export default function MainHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="text-center mb-16 relative"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#00f0ff]/10 blur-[80px] rounded-full pointer-events-none"></div>
      
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
        className="inline-flex items-center justify-center w-24 h-24 border-2 border-[#fcee0a] bg-[#050505] shadow-[0_0_20px_rgba(252,238,10,0.5)] mb-8 text-[#fcee0a] relative overflow-hidden"
        style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 80%, 80% 100%, 0 100%, 0 20%)' }}
      >
        <div className="absolute inset-0 bg-[#fcee0a]/10"></div>
        <Cpu className="w-12 h-12 relative z-10" />
      </motion.div>

      <h1 className="font-display text-5xl md:text-8xl font-black mb-6 tracking-widest uppercase relative inline-block">
        <span className="glitch-text text-white drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]" data-text="HÓA HỌC 2077">
          HÓA HỌC 2077
        </span>
        <Zap className="absolute -top-8 -right-12 w-12 h-12 text-[#ff003c] animate-pulse hidden md:block" />
      </h1>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="text-lg md:text-2xl text-[#00f0ff] max-w-3xl mx-auto leading-relaxed font-mono uppercase tracking-widest border-l-4 border-[#ff003c] pl-4 text-left"
      >
        &gt; KHỞI CHẠY GIAO THỨC KIM LOẠI...<br/>
        &gt; TÁCH / TINH CHẾ / TÁI CHẾ<br/>
        &gt; MỤC TIÊU: TƯƠNG LAI BỀN VỮNG
      </motion.p>
    </motion.div>
  );
}
