import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { BookOpen, HelpCircle, Gamepad2, ArrowRight, Cpu, Terminal, Zap } from 'lucide-react';
import MainHeader from '../components/MainHeader';

export default function Home() {
  const modules = [
    {
      title: 'DỮ LIỆU LÝ THUYẾT',
      description: 'Truy cập cơ sở dữ liệu về các phương pháp tách kim loại và giao thức tái chế.',
      icon: BookOpen,
      path: '/lecture',
      color: 'cyber-cyan',
      bgDark: 'bg-cyber-cyan/10',
      text: 'text-cyber-cyan',
      border: 'border-cyber-cyan',
      shadow: 'shadow-[0_0_15px_rgba(0,240,255,0.3)]'
    },
    {
      title: 'KHU VỰC HUẤN LUYỆN',
      description: 'Kiểm tra năng lực với hệ thống mô phỏng trắc nghiệm đa dạng và chi tiết.',
      icon: HelpCircle,
      path: '/quiz',
      color: 'cyber-yellow',
      bgDark: 'bg-cyber-yellow/10',
      text: 'text-cyber-yellow',
      border: 'border-cyber-yellow',
      shadow: 'shadow-[0_0_15px_rgba(252,238,10,0.3)]'
    },
    {
      title: 'GIẢI TRÍ ĐIỆN TỬ',
      description: 'Nâng cấp phản xạ qua các minigame thực tế ảo giúp ghi nhớ dữ liệu lâu hơn.',
      icon: Gamepad2,
      path: '/game',
      color: 'cyber-magenta',
      bgDark: 'bg-cyber-magenta/10',
      text: 'text-cyber-magenta',
      border: 'border-cyber-magenta',
      shadow: 'shadow-[0_0_15px_rgba(255,0,60,0.3)]'
    },
  ];

  return (
    <div className="max-w-6xl mx-auto relative">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-none bg-cyber-cyan/5 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-none bg-cyber-magenta/5 blur-[100px]" />
        <div className="absolute top-[40%] left-[20%] w-[20%] h-[20%] rounded-none bg-cyber-yellow/5 blur-[80px]" />
      </div>

      <section className="py-16 md:py-24 flex flex-col items-center relative">
        <MainHeader />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-wrap justify-center gap-6 mt-12 relative z-10"
        >
          <Link 
            to="/lecture" 
            className="cyber-button text-xl px-10 py-5"
          >
            <span className="relative z-10 flex items-center gap-3">
              BẮT ĐẦU CHIẾN DỊCH <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </span>
          </Link>
        </motion.div>

        {/* Floating Cyber Icons */}
        <motion.div 
          animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }} 
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 md:left-20 text-cyber-cyan/20 hidden md:block"
        >
          <Cpu className="w-24 h-24" />
        </motion.div>
        <motion.div 
          animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }} 
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-10 right-10 md:right-20 text-cyber-magenta/20 hidden md:block"
        >
          <Terminal className="w-20 h-20" />
        </motion.div>
      </section>

      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="grid md:grid-cols-3 gap-8 mt-12 px-4"
      >
        {modules.map((mod, index) => {
          const Icon = mod.icon;
          return (
            <motion.div
              key={mod.title}
              whileHover={{ y: -10 }}
              className={`group relative bg-cyber-black rounded-none p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border ${mod.border} overflow-hidden flex flex-col h-full cyber-card`}
            >
              {/* Scanline effect */}
              <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20"></div>
              
              <div className={`absolute top-0 right-0 w-32 h-32 ${mod.bgDark} opacity-20 rounded-none -mr-8 -mt-8 transition-transform group-hover:scale-110`}></div>
              
              <div className={`w-16 h-16 rounded-none flex items-center justify-center mb-6 bg-cyber-black border ${mod.border} ${mod.text} ${mod.shadow} transform group-hover:rotate-6 transition-transform relative z-10`}>
                <Icon className="w-8 h-8" />
              </div>
              
              <h3 className={`font-display text-2xl font-bold mb-4 ${mod.text} tracking-widest uppercase relative z-10`}>{mod.title}</h3>
              <p className="text-cyber-light mb-8 flex-1 text-base leading-relaxed font-mono relative z-10">{mod.description}</p>
              
              <Link 
                to={mod.path}
                className={`inline-flex items-center gap-2 font-bold text-lg mt-auto group/link ${mod.text} relative z-10 uppercase tracking-widest`}
              >
                TRUY CẬP <ArrowRight className="w-5 h-5 group-hover/link:translate-x-2 transition-transform" />
              </Link>
            </motion.div>
          );
        })}
      </motion.section>
    </div>
  );
}
