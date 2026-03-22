import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { BookOpen, Home, HelpCircle, Gamepad2, Cpu } from 'lucide-react';
import { motion } from 'motion/react';
import ChatBot from './ChatBot';

export default function Layout() {
  const location = useLocation();

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const navItems = [
    { path: '/', label: 'TRANG CHỦ', icon: Home },
    { path: '/lecture', label: 'BÀI GIẢNG', icon: BookOpen },
    { path: '/quiz', label: 'LUYỆN TẬP', icon: HelpCircle },
    { path: '/game', label: 'TRÒ CHƠI', icon: Gamepad2 },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300 font-sans">
      <header className="sticky top-0 z-50 w-full border-b-2 border-[var(--secondary)] bg-[var(--background)]/90 backdrop-blur-md shadow-[0_0_15px_rgba(0,240,255,0.2)]">
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-50"></div>
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 text-[var(--primary)] font-bold text-2xl hover:scale-105 transition-transform group">
            <div className="p-2 border border-[var(--primary)] bg-[var(--primary)]/10 group-hover:bg-[var(--primary)]/20 transition-colors">
              <Cpu className="w-8 h-8" />
            </div>
            <span className="font-display font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] drop-shadow-[0_0_8px_rgba(252,238,10,0.5)]">
              HÓA HỌC 2077
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex items-center gap-2 text-sm font-bold font-mono tracking-widest transition-colors hover:text-[var(--primary)] ${
                    isActive ? 'text-[var(--secondary)]' : 'text-[var(--foreground)]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="underline"
                      className="absolute -bottom-[28px] left-0 right-0 h-1 bg-[var(--secondary)] shadow-[0_0_10px_var(--secondary)]"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-2 font-mono text-xs text-[var(--accent)] border border-[var(--accent)] px-3 py-1 bg-[var(--accent)]/10">
            <span className="animate-pulse">●</span> SYS.ONLINE
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12 relative">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[var(--secondary)] via-transparent to-[var(--primary)] opacity-20"></div>
        <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-[var(--accent)] via-transparent to-[var(--secondary)] opacity-20"></div>
        <Outlet />
      </main>

      <footer className="border-t-2 border-[var(--border)] py-8 mt-auto bg-[var(--card)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent opacity-50"></div>
        <div className="container mx-auto px-4 text-center text-sm text-[var(--foreground)] font-mono">
          <p className="mb-2 tracking-widest text-[var(--secondary)]">© 2077 HÓA HỌC 12 - BÀI 15: TÁCH VÀ TÁI CHẾ KIM LOẠI.</p>
          <p className="text-xs opacity-50">NETWORK: SECURE // ENCRYPTION: ACTIVE</p>
        </div>
      </footer>
      
      <ChatBot />
    </div>
  );
}
