import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Moon, Sun, BookOpen, Home, HelpCircle, Gamepad2 } from 'lucide-react';
import { motion } from 'motion/react';
import ChatBot from './ChatBot';

export default function Layout() {
  const [isDark, setIsDark] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check system preference or localStorage
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const navItems = [
    { path: '/', label: 'Trang chủ', icon: Home },
    { path: '/lecture', label: 'Bài giảng', icon: BookOpen },
    { path: '/quiz', label: 'Luyện tập', icon: HelpCircle },
    { path: '/game', label: 'Trò chơi', icon: Gamepad2 },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
      <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-bold text-xl">
            <BookOpen className="w-6 h-6" />
            <span className="font-display font-bold tracking-wide">Chiến Binh Nguyên Tố</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-teal-600 dark:hover:text-teal-400 ${
                    isActive ? 'text-teal-600 dark:text-teal-400' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="underline"
                      className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-teal-600 dark:bg-teal-400"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-[var(--border)] py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-slate-500 dark:text-slate-400">
          <p>© 2026 Hóa Học 12 - Bài 15: Tách và Tái chế kim loại.</p>
        </div>
      </footer>
      
      <ChatBot />
    </div>
  );
}
