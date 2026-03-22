import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { BookOpen, HelpCircle, Gamepad2, ArrowRight } from 'lucide-react';
import MainHeader from '../components/MainHeader';

export default function Home() {
  const modules = [
    {
      title: 'Bài giảng',
      description: 'Tìm hiểu lý thuyết về các phương pháp tách kim loại và tầm quan trọng của việc tái chế.',
      icon: BookOpen,
      path: '/lecture',
      color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
    },
    {
      title: 'Luyện tập',
      description: 'Kiểm tra kiến thức với hệ thống câu hỏi trắc nghiệm đa dạng và chi tiết.',
      icon: HelpCircle,
      path: '/quiz',
      color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    },
    {
      title: 'Trò chơi',
      description: 'Vừa học vừa chơi qua các minigame thú vị giúp ghi nhớ lâu hơn.',
      icon: Gamepad2,
      path: '/game',
      color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <section className="py-16 md:py-24 flex flex-col items-center">
        <MainHeader />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-wrap justify-center gap-4 mt-4"
        >
          <Link 
            to="/lecture" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-lg shadow-teal-500/30 dark:shadow-teal-400/20"
          >
            Bắt đầu chiến dịch <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>

      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="grid md:grid-cols-3 gap-6 mt-8"
      >
        {modules.map((mod, index) => {
          const Icon = mod.icon;
          return (
            <motion.div
              key={mod.title}
              whileHover={{ y: -5 }}
              className="bg-[var(--card)] rounded-2xl p-6 shadow-sm border border-[var(--border)] flex flex-col h-full"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${mod.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-display text-2xl font-bold mb-2">{mod.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6 flex-1">{mod.description}</p>
              <Link 
                to={mod.path}
                className="inline-flex items-center gap-2 text-teal-600 dark:text-teal-400 font-medium hover:underline mt-auto"
              >
                Khám phá <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          );
        })}
      </motion.section>
    </div>
  );
}
