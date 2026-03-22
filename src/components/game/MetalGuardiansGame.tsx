import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Zap, Droplets, Recycle, Heart, Trophy, AlertTriangle, Play, RotateCcw, ShieldAlert, Sparkles, Crosshair } from 'lucide-react';
import clsx from 'clsx';

type EnemyType = 'nhiet' | 'dien' | 'thuy' | 'recycle';

interface Enemy {
  id: string;
  type: EnemyType;
  label: string;
  x: number; // 0 to 100
  y: number; // 15 to 85
  speed: number;
  offset: number; // For floating animation
  visualTheme: string;
}

interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  text?: string;
  life: number; 
  maxLife: number;
  type: 'text' | 'spark' | 'smoke';
}

interface Boss {
  active: boolean;
  hp: number;
  maxHp: number;
  x: number;
  y: number;
  speed: number;
  direction: number;
}

const ENEMY_DICT: Record<EnemyType, string[]> = {
  nhiet: ['Fe₂O₃', 'CuO', 'PbO', 'ZnO'],
  dien: ['Al₂O₃', 'Na₂O', 'MgCl₂', 'NaCl'],
  thuy: ['Fe³⁺', 'Cu²⁺', 'Ag⁺'],
  recycle: ['Vỏ lon nhôm', 'Sắt vụn', 'Dây đồng cũ']
};

export default function MetalGuardiansGame() {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'boss' | 'victory' | 'gameover'>('start');
  const [, forceUpdate] = useState({});
  const [highScore, setHighScore] = useState(0);
  const [beam, setBeam] = useState<{ active: boolean; type: string; y: number }>({ active: false, type: '', y: 50 });
  const [shake, setShake] = useState(0); // Intensity of shake

  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  
  const enemiesRef = useRef<Enemy[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const hpRef = useRef(100);
  const scoreRef = useRef(0);
  const progressRef = useRef(0); // 0 to 100
  const ultimateRef = useRef({ ready: false, active: false, timer: 0 });
  const bossRef = useRef<Boss>({ active: false, hp: 1500, maxHp: 1500, x: -20, y: 50, speed: 2.5, direction: 1 });
  const shakeTimerRef = useRef(0);
  const beamTimeoutRef = useRef<any>(null);

  useEffect(() => {
    const hs = localStorage.getItem('metalGuardiansHS');
    if (hs) setHighScore(parseInt(hs));
  }, [gameState]);

  const triggerShake = (duration: number = 0.5, intensity: number = 1) => {
    setShake(intensity);
    shakeTimerRef.current = duration;
  };

  const spawnExplosion = (x: number, y: number, colorClass: string) => {
    const colorHex = colorClass.includes('rose') ? '#f43f5e' : 
                     colorClass.includes('cyan') ? '#22d3ee' : 
                     colorClass.includes('blue') ? '#3b82f6' : 
                     colorClass.includes('emerald') ? '#10b981' : 
                     colorClass.includes('lime') ? '#4ade80' : '#fbbf24';
                     
    for (let i = 0; i < 15; i++) {
      particlesRef.current.push({
        id: Math.random().toString(),
        x, y,
        vx: (Math.random() - 0.5) * 40,
        vy: (Math.random() - 0.5) * 40,
        color: colorHex,
        life: 0.5 + Math.random() * 0.5,
        maxLife: 1,
        type: 'spark'
      });
    }
  };

  const startGame = () => {
    enemiesRef.current = [];
    particlesRef.current = [];
    hpRef.current = 100;
    scoreRef.current = 0;
    progressRef.current = 0;
    ultimateRef.current = { ready: false, active: false, timer: 0 };
    bossRef.current = { active: false, hp: 1500, maxHp: 1500, x: -20, y: 50, speed: 2.5, direction: 1 };
    lastTimeRef.current = performance.now();
    setGameState('playing');
  };

  const update = useCallback((time: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = time;
    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;

    if (gameState === 'playing' || gameState === 'boss') {
      // Handle Shake
      if (shakeTimerRef.current > 0) {
        shakeTimerRef.current -= deltaTime / 1000;
        if (shakeTimerRef.current <= 0) setShake(0);
      }

      // Handle Ultimate
      if (ultimateRef.current.active) {
        ultimateRef.current.timer -= deltaTime / 1000;
        if (ultimateRef.current.timer <= 0) {
          ultimateRef.current.active = false;
        } else {
          // Clear enemies while active
          if (enemiesRef.current.length > 0) {
            enemiesRef.current.forEach(e => spawnExplosion(e.x, e.y, 'text-purple-400'));
            scoreRef.current += enemiesRef.current.length * 10;
            enemiesRef.current = [];
            triggerShake(0.2, 2);
          }
          // Damage boss if active
          if (bossRef.current.active) {
            bossRef.current.hp -= 300 * (deltaTime / 1000);
            if (bossRef.current.hp <= 0) handleBossDefeat();
          }
        }
      }

      // Spawn logic (only in playing state)
      if (gameState === 'playing' && !ultimateRef.current.active) {
        // TĂNG TỐC ĐỘ SPAWN
        const spawnRate = 0.01 + (scoreRef.current / 40000); 
        if (Math.random() < spawnRate) {
          const types: EnemyType[] = ['nhiet', 'dien', 'thuy', 'recycle'];
          const type = types[Math.floor(Math.random() * types.length)];
          const labels = ENEMY_DICT[type];
          const label = labels[Math.floor(Math.random() * labels.length)];
          
          const themes = ['rose', 'cyan', 'blue', 'emerald', 'amber', 'purple'];
          enemiesRef.current.push({
            id: Math.random().toString(),
            type,
            label,
            x: -10,
            y: 15 + Math.random() * 70,
            // TĂNG TỐC ĐỘ DI CHUYỂN
            speed: 7 + Math.random() * 6 + (scoreRef.current / 250), 
            offset: Math.random() * Math.PI * 2,
            visualTheme: themes[Math.floor(Math.random() * themes.length)]
          });
        }
      }

      // Boss logic
      if (gameState === 'boss' && bossRef.current.active && !ultimateRef.current.active) {
        if (bossRef.current.x < 15) {
          bossRef.current.x += bossRef.current.speed * (deltaTime / 1000) * 5; 
        } else {
          bossRef.current.y += bossRef.current.speed * bossRef.current.direction * (deltaTime / 100);
          if (bossRef.current.y > 80) bossRef.current.direction = -1;
          if (bossRef.current.y < 20) bossRef.current.direction = 1;
          bossRef.current.x += bossRef.current.speed * 0.3 * (deltaTime / 1000); 
        }

        if (Math.random() < 0.025) {
          const types: EnemyType[] = ['nhiet', 'dien', 'thuy'];
          const type = types[Math.floor(Math.random() * types.length)];
          const themes = ['rose', 'cyan', 'blue', 'emerald', 'amber', 'purple'];
          enemiesRef.current.push({
            id: Math.random().toString(),
            type,
            label: 'Mảnh vỡ',
            x: bossRef.current.x + 10,
            y: bossRef.current.y + (Math.random() * 20 - 10),
            speed: 12,
            offset: 0,
            visualTheme: themes[Math.floor(Math.random() * themes.length)]
          });
        }

        if (bossRef.current.x > 75) {
          hpRef.current -= 100; 
          checkGameOver();
        }
      }

      // Move enemies
      enemiesRef.current.forEach(e => {
        e.x += e.speed * (deltaTime / 1000);
      });

      // Check collisions
      const reached = enemiesRef.current.filter(e => e.x > 85);
      if (reached.length > 0) {
        hpRef.current -= reached.length * 10;
        enemiesRef.current = enemiesRef.current.filter(e => e.x <= 85);
        triggerShake(0.3, 1.5);
        checkGameOver();
      }

      // Update particles
      particlesRef.current.forEach(p => {
        p.life -= deltaTime / 1000;
        p.x += p.vx * (deltaTime / 1000);
        p.y += p.vy * (deltaTime / 1000);
        if (p.type === 'spark') {
          p.vy += 60 * (deltaTime / 1000); // Gravity
        }
      });
      particlesRef.current = particlesRef.current.filter(p => p.life > 0);

      forceUpdate({});
    }

    requestRef.current = requestAnimationFrame(update);
  }, [gameState]);

  const checkGameOver = () => {
    if (hpRef.current <= 0) {
      setGameState('gameover');
      triggerShake(1, 3);
      const hs = localStorage.getItem('metalGuardiansHS');
      if (!hs || scoreRef.current > parseInt(hs)) {
        localStorage.setItem('metalGuardiansHS', scoreRef.current.toString());
      }
    }
  };

  const handleBossDefeat = () => {
    bossRef.current.active = false;
    scoreRef.current += 5000;
    triggerShake(2, 3);
    spawnExplosion(bossRef.current.x, bossRef.current.y, 'text-purple-500');
    spawnExplosion(bossRef.current.x + 5, bossRef.current.y + 5, 'text-rose-500');
    spawnExplosion(bossRef.current.x - 5, bossRef.current.y - 5, 'text-cyan-500');
    setGameState('victory');
    const hs = localStorage.getItem('metalGuardiansHS');
    if (!hs || scoreRef.current > parseInt(hs)) {
      localStorage.setItem('metalGuardiansHS', scoreRef.current.toString());
    }
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [update]);

  const handleShoot = useCallback((type: EnemyType | 'ultimate') => {
    if (gameState !== 'playing' && gameState !== 'boss') return;

    if (type === 'ultimate') {
      if (ultimateRef.current.ready && !ultimateRef.current.active) {
        ultimateRef.current.active = true;
        ultimateRef.current.ready = false;
        ultimateRef.current.timer = 3; 
        triggerShake(3, 2);
      }
      return;
    }

    if (beamTimeoutRef.current) clearTimeout(beamTimeoutRef.current);
    setBeam({ active: true, type, y: 50 });
    beamTimeoutRef.current = setTimeout(() => setBeam(b => ({ ...b, active: false })), 400);

    // Boss hit logic
    if (gameState === 'boss' && bossRef.current.active) {
      bossRef.current.hp -= 80;
      scoreRef.current += 20;
      particlesRef.current.push({
        id: Math.random().toString(),
        x: bossRef.current.x,
        y: bossRef.current.y,
        vx: 0, vy: -20,
        color: '#fbbf24',
        text: '-80',
        life: 1, maxLife: 1, type: 'text'
      });
      spawnExplosion(bossRef.current.x, bossRef.current.y, 'text-yellow-400');
      if (bossRef.current.hp <= 0) {
        handleBossDefeat();
      }
      return; 
    }

    // Normal enemy hit logic
    let closestIdx = -1;
    let maxX = -1;
    enemiesRef.current.forEach((e, idx) => {
      if (e.x > maxX) {
        maxX = e.x;
        closestIdx = idx;
      }
    });

    if (closestIdx !== -1) {
      const target = enemiesRef.current[closestIdx];
      
      const colorClass = type === 'nhiet' ? 'text-rose-500' :
                         type === 'dien' ? 'text-cyan-400' :
                         type === 'thuy' ? 'text-blue-400' :
                         'text-lime-400';
                         
      setBeam(b => ({ ...b, y: target.y }));

      if (target.type === type) {
        // Hit
        scoreRef.current += 10;
        spawnExplosion(target.x, target.y, colorClass);
        
        if (gameState === 'playing') {
          progressRef.current = Math.min(100, progressRef.current + 3.5);
          if (progressRef.current >= 50 && !ultimateRef.current.active) {
            ultimateRef.current.ready = true;
          }
          if (progressRef.current >= 100 && gameState === 'playing') {
            setGameState('boss');
            bossRef.current.active = true;
            triggerShake(1.5, 2);
          }
        }

        particlesRef.current.push({
          id: Math.random().toString(),
          x: target.x,
          y: target.y,
          vx: 0, vy: -30,
          color: colorClass.includes('rose') ? '#f43f5e' : colorClass.includes('cyan') ? '#22d3ee' : colorClass.includes('blue') ? '#3b82f6' : '#4ade80',
          text: '+10',
          life: 1, maxLife: 1, type: 'text'
        });
        enemiesRef.current.splice(closestIdx, 1);
      } else {
        // Miss
        scoreRef.current = Math.max(0, scoreRef.current - 5);
        particlesRef.current.push({
          id: Math.random().toString(),
          x: target.x,
          y: target.y,
          vx: 0, vy: -20,
          color: '#ef4444',
          text: 'Trượt!',
          life: 1, maxLife: 1, type: 'text'
        });
      }
    }
  }, [gameState]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing' && gameState !== 'boss') return;
      if (e.key === '1') handleShoot('nhiet');
      if (e.key === '2') handleShoot('dien');
      if (e.key === '3') handleShoot('thuy');
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        handleShoot('recycle');
      }
      if (e.key.toLowerCase() === 'r') {
        handleShoot('ultimate');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleShoot, gameState]);

  const renderEnemy = (e: Enemy) => {
    const themeMap: Record<string, { color: string, glow: string }> = {
      rose: { color: 'text-rose-400 border-rose-500/50', glow: 'shadow-[0_0_15px_rgba(244,63,94,0.4),inset_0_0_10px_rgba(244,63,94,0.2)]' },
      cyan: { color: 'text-cyan-400 border-cyan-500/50', glow: 'shadow-[0_0_15px_rgba(34,211,238,0.4),inset_0_0_10px_rgba(34,211,238,0.2)]' },
      blue: { color: 'text-blue-400 border-blue-500/50', glow: 'shadow-[0_0_15px_rgba(59,130,246,0.4),inset_0_0_10px_rgba(59,130,246,0.2)]' },
      emerald: { color: 'text-emerald-400 border-emerald-500/50', glow: 'shadow-[0_0_15px_rgba(16,185,129,0.4),inset_0_0_10px_rgba(16,185,129,0.2)]' },
      amber: { color: 'text-amber-400 border-amber-500/50', glow: 'shadow-[0_0_15px_rgba(245,158,11,0.4),inset_0_0_10px_rgba(245,158,11,0.2)]' },
      purple: { color: 'text-purple-400 border-purple-500/50', glow: 'shadow-[0_0_15px_rgba(168,85,247,0.4),inset_0_0_10px_rgba(168,85,247,0.2)]' },
    };

    const style = themeMap[e.visualTheme || 'amber'];
    const floatY = Math.sin((Date.now() / 500) + e.offset) * 3;

    return (
      <div 
        key={e.id}
        className={clsx(
          "absolute flex items-center gap-2 px-3 py-1.5 border-2 font-mono font-bold text-sm transform -translate-y-1/2 whitespace-nowrap bg-slate-900/80 backdrop-blur-md rounded-xl",
          style.color, style.glow
        )}
        style={{ left: `${e.x}%`, top: `calc(${e.y}% + ${floatY}px)` }}
      >
        {e.label}
      </div>
    );
  };

  const renderBeam = () => {
    if (!beam.active) return null;
    
    if (beam.type === 'nhiet') {
      const flicker = 0.6 + Math.random() * 0.8;
      const width = 80 + Math.random() * 10;
      return (
        <div 
          className="absolute right-[15%] h-24 origin-right z-20 flex items-center"
          style={{ top: `${beam.y}%`, width: `${width}%`, transform: `translateY(-50%) scaleY(${flicker})` }}
        >
          <div className="w-full h-full bg-gradient-to-l from-rose-600 via-orange-500 to-transparent opacity-90 blur-md absolute"></div>
          <div className="w-full h-6 bg-gradient-to-l from-yellow-300 via-orange-400 to-transparent rounded-full shadow-[0_0_30px_#f97316] relative z-10 blur-[2px]"></div>
          <div className="w-full h-2 bg-white rounded-full shadow-[0_0_20px_#ffffff] relative z-20"></div>
          <svg className="absolute w-full h-full z-30" preserveAspectRatio="none" viewBox="0 0 100 100">
            <path d={`M 100 ${40 + Math.random()*20} L 0 ${40 + Math.random()*20}`} fill="none" stroke="#fef08a" strokeWidth={1 + Math.random()*3} className="drop-shadow-[0_0_5px_#f97316]" />
            <path d={`M 100 ${30 + Math.random()*40} L 20 ${30 + Math.random()*40}`} fill="none" stroke="#fde047" strokeWidth={1 + Math.random()*2} />
          </svg>
        </div>
      );
    }
    if (beam.type === 'dien') {
      const flicker = 0.8 + Math.random() * 0.4;
      return (
        <div 
          className="absolute right-[15%] h-32 origin-right z-20 flex items-center justify-center"
          style={{ top: `${beam.y}%`, width: '85%', transform: `translateY(-50%) scaleY(${flicker})` }}
        >
          {/* Core beam */}
          <div className="absolute w-full h-4 bg-white rounded-full shadow-[0_0_30px_#22d3ee,0_0_60px_#22d3ee] z-20"></div>
          {/* Outer glow */}
          <div className="absolute w-full h-12 bg-cyan-400/50 blur-md rounded-full z-10"></div>
          {/* Lightning arcs */}
          <svg className="absolute w-full h-full z-30" preserveAspectRatio="none" viewBox="0 0 100 100">
            <path d={`M 100 50 Q 75 ${20 + Math.random()*60} 50 50 T 0 50`} fill="none" stroke="#ffffff" strokeWidth="2" className="drop-shadow-[0_0_8px_#22d3ee]" />
            <path d={`M 100 50 Q 80 ${10 + Math.random()*80} 40 50 T 0 50`} fill="none" stroke="#a5f3fc" strokeWidth="1.5" className="drop-shadow-[0_0_5px_#22d3ee]" />
            <path d={`M 100 50 Q 60 ${10 + Math.random()*80} 30 50 T 0 50`} fill="none" stroke="#cffafe" strokeWidth="1" className="drop-shadow-[0_0_5px_#22d3ee]" />
          </svg>
        </div>
      );
    }
    if (beam.type === 'thuy') {
      return (
        <div 
          className="absolute right-[15%] h-[300px] w-[300px] border-[12px] border-blue-400/80 rounded-full z-20 animate-[water-ripple_0.4s_ease-out_forwards]"
          style={{ top: '50%', transform: 'translate(50%, -50%)', boxShadow: '0 0 60px #3b82f6, inset 0 0 60px #3b82f6' }}
        >
           <div className="absolute inset-0 border-[6px] border-cyan-300/60 rounded-full animate-[water-ripple_0.3s_ease-out_forwards_0.1s]"></div>
        </div>
      );
    }
    if (beam.type === 'recycle') {
      const flicker = 0.8 + Math.random() * 0.4;
      const width = 85 + Math.random() * 5;
      return (
        <div 
          className="absolute right-[15%] h-24 rounded-l-full origin-right z-20 flex items-center overflow-hidden"
          style={{ top: `${beam.y}%`, width: `${width}%`, transform: `translateY(-50%) scaleY(${flicker})` }}
        >
          {/* Base glow */}
          <div className="w-full h-full bg-gradient-to-l from-lime-400/90 via-emerald-500/90 to-transparent blur-md absolute"></div>
          
          {/* Core energy line */}
          <div className="w-full h-2 bg-white rounded-full shadow-[0_0_30px_#4ade80,0_0_15px_#22c55e] relative z-10"></div>
          
          {/* Custom Animation: Digital/Energy Pull */}
          <svg className="absolute w-full h-full z-20" preserveAspectRatio="none" viewBox="0 0 100 100">
            {/* Top wave */}
            <path d="M 100 25 Q 75 5 50 25 T 0 25" fill="none" stroke="#86efac" strokeWidth="1.5" strokeDasharray="10 10" className="animate-[dash-pull_0.5s_linear_infinite] drop-shadow-[0_0_5px_#22c55e]" />
            {/* Bottom wave */}
            <path d="M 100 75 Q 75 95 50 75 T 0 75" fill="none" stroke="#86efac" strokeWidth="1.5" strokeDasharray="10 10" className="animate-[dash-pull_0.5s_linear_infinite_reverse] drop-shadow-[0_0_5px_#22c55e]" />
            {/* Center fast stream */}
            <line x1="100" y1="50" x2="0" y2="50" stroke="#ffffff" strokeWidth="3" strokeDasharray="15 15" className="animate-[dash-pull_0.2s_linear_infinite] drop-shadow-[0_0_8px_#4ade80]" />
            <line x1="100" y1="35" x2="0" y2="35" stroke="#bbf7d0" strokeWidth="1" strokeDasharray="5 10" className="animate-[dash-pull_0.3s_linear_infinite]" />
            <line x1="100" y1="65" x2="0" y2="65" stroke="#bbf7d0" strokeWidth="1" strokeDasharray="5 10" className="animate-[dash-pull_0.3s_linear_infinite]" />
          </svg>
          
          {/* Floating energy blocks moving left */}
          <div className="absolute inset-0 z-30 flex items-center">
             <div className="w-[200%] h-full flex items-center justify-around animate-[slide-left_0.4s_linear_infinite]">
                {[...Array(15)].map((_, i) => (
                  <div key={i} className="h-12 w-2 bg-lime-300/90 rounded-sm shadow-[0_0_15px_#4ade80] skew-x-[-20deg]"></div>
                ))}
             </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="font-display text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-rose-500 mb-2 drop-shadow-lg">
          KỶ NGUYÊN KIM LOẠI
        </h2>
        <p className="text-slate-400 font-medium tracking-wide uppercase text-sm">
          Hành Trình Cuối Cùng - Cinematic Edition
        </p>
      </div>

      <div 
        className={clsx(
          "relative w-full h-[550px] bg-slate-950 overflow-hidden rounded-[2rem] border border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_0_100px_rgba(15,23,42,1)] font-sans select-none transition-transform",
        )}
        style={{
          transform: shake > 0 ? `translate(${(Math.random() - 0.5) * 10 * shake}px, ${(Math.random() - 0.5) * 10 * shake}px)` : 'none'
        }}
      >
        <style>{`
          @keyframes water-ripple {
            0% { transform: translate(50%, -50%) scale(0.1); opacity: 1; border-width: 20px; }
            100% { transform: translate(50%, -50%) scale(5); opacity: 0; border-width: 2px; }
          }
          @keyframes float-particle {
            0% { transform: translateY(0) translateX(0); opacity: 0; }
            50% { opacity: 0.5; }
            100% { transform: translateY(-100px) translateX(20px); opacity: 0; }
          }
          @keyframes slide-left {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes dash-pull {
            from { stroke-dashoffset: 100; }
            to { stroke-dashoffset: 0; }
          }
          .neumorphic-panel {
            background: linear-gradient(145deg, #0f172a, #1e293b);
            box-shadow:  -5px -5px 10px rgba(255,255,255,0.02), 5px 5px 15px rgba(0,0,0,0.5);
          }
        `}</style>

        {/* Ambient Particle Background */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-1 h-1 bg-slate-500 rounded-full animate-[float-particle_10s_linear_infinite]"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${10 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>
        
        {/* Ultimate Effect */}
        {ultimateRef.current.active && (
          <div className="absolute inset-0 z-10 bg-white/10 backdrop-blur-md animate-pulse flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-rose-500/20 mix-blend-overlay"></div>
            <h2 className="font-display text-6xl md:text-8xl font-black text-white tracking-widest drop-shadow-[0_0_30px_rgba(255,255,255,1)] z-20">
              HỢP NHẤT TOÀN NĂNG
            </h2>
          </div>
        )}

        {/* Game Elements */}
        {(gameState === 'playing' || gameState === 'boss') && (
          <>
            {/* Progress Bar (Neumorphic) */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 w-1/2 max-w-md">
              <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                <span>Tiến độ tinh chế</span>
                <span className="text-cyan-400">{Math.floor(progressRef.current)}%</span>
              </div>
              <div className="h-3 bg-slate-900 rounded-full p-0.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] border border-slate-800">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-rose-500 shadow-[0_0_10px_rgba(168,85,247,0.5)] transition-all duration-500 ease-out"
                  style={{ width: `${progressRef.current}%` }}
                />
              </div>
            </div>

            {enemiesRef.current.map(renderEnemy)}
            
            {/* Boss */}
            {gameState === 'boss' && bossRef.current.active && (
              <div 
                className="absolute flex flex-col items-center justify-center z-20 transform -translate-y-1/2 -translate-x-1/2"
                style={{ left: `${bossRef.current.x}%`, top: `${bossRef.current.y}%` }}
              >
                <div className="w-40 h-40 neumorphic-panel border border-purple-500/50 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(168,85,247,0.3),inset_0_0_20px_rgba(168,85,247,0.2)] relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#a855f7_0%,_transparent_70%)] opacity-40 animate-pulse"></div>
                  <ShieldAlert className="w-20 h-20 text-purple-400 relative z-10 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)] animate-[pulse_2s_ease-in-out_infinite]" />
                </div>
                <div className="mt-4 bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-full px-4 py-1.5 text-sm font-bold text-purple-300 uppercase tracking-widest shadow-lg">
                  Dị Vật Quặng Cổ Đại
                </div>
                {/* Boss HP */}
                <div className="w-40 h-2.5 bg-slate-900 rounded-full mt-3 overflow-hidden border border-slate-800 shadow-[inset_0_1px_3px_rgba(0,0,0,0.8)]">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-600 to-rose-500 transition-all duration-200"
                    style={{ width: `${(bossRef.current.hp / bossRef.current.maxHp) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {particlesRef.current.map(p => (
              <div 
                key={p.id}
                className={clsx(
                  "absolute pointer-events-none transition-opacity",
                  p.type === 'text' ? "font-black text-2xl drop-shadow-lg" : "rounded-full"
                )}
                style={{ 
                  left: `${p.x}%`, 
                  top: `${p.y}%`,
                  opacity: p.life / p.maxLife,
                  transform: 'translate(-50%, -50%)',
                  color: p.type === 'text' ? p.color : undefined,
                  backgroundColor: p.type === 'spark' ? p.color : undefined,
                  width: p.type === 'spark' ? '6px' : undefined,
                  height: p.type === 'spark' ? '6px' : undefined,
                  boxShadow: p.type === 'spark' ? `0 0 10px ${p.color}` : undefined
                }}
              >
                {p.text}
              </div>
            ))}

            {renderBeam()}
          </>
        )}

        {/* High-Tech Furnace SVG */}
        <div className="absolute right-0 top-0 bottom-0 w-[18%] neumorphic-panel border-l border-slate-700 flex flex-col items-center justify-center z-30">
          <div className="absolute inset-0 overflow-hidden">
            <svg viewBox="0 0 100 200" className="w-full h-full opacity-30">
              <path d="M 20 0 L 80 0 L 100 50 L 100 150 L 80 200 L 20 200 Z" fill="none" stroke="#ea580c" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx="60" cy="100" r="30" fill="none" stroke="#f97316" strokeWidth="0.5" className="animate-[spin_10s_linear_infinite]" />
              <circle cx="60" cy="100" r="20" fill="none" stroke="#f43f5e" strokeWidth="0.5" className="animate-[spin_7s_linear_infinite_reverse]" />
            </svg>
          </div>

          <div className="text-orange-500 font-display font-black text-2xl mb-8 text-center tracking-[0.2em] drop-shadow-[0_0_10px_rgba(234,88,12,0.8)] relative z-10">
            LÒ LUYỆN
          </div>
          
          <div className="w-10 h-56 bg-slate-950 rounded-full border-4 border-slate-800 relative overflow-hidden flex flex-col justify-end shadow-[inset_0_10px_20px_rgba(0,0,0,0.8)] z-10">
            <div 
              className={clsx(
                "w-full transition-all duration-300 relative",
                hpRef.current > 50 ? "bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5)]" :
                hpRef.current > 20 ? "bg-gradient-to-t from-amber-600 to-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.5)]" :
                "bg-gradient-to-t from-rose-600 to-rose-400 animate-pulse shadow-[0_0_20px_rgba(225,29,72,0.8)]"
              )}
              style={{ height: `${Math.max(0, hpRef.current)}%` }}
            >
              {/* Animated bubbles inside HP bar */}
              <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')] animate-[float-particle_2s_linear_infinite]"></div>
            </div>
          </div>
          <div className="mt-4 font-mono text-orange-400 font-black text-xl flex items-center gap-2 drop-shadow-[0_0_5px_rgba(234,88,12,0.5)] z-10">
            <Heart className="w-5 h-5 fill-current" /> {Math.max(0, Math.floor(hpRef.current))}
          </div>
        </div>

        {/* HUD */}
        <div className="absolute top-6 left-6 z-30 flex gap-4">
          <div className="neumorphic-panel px-5 py-3 rounded-2xl flex items-center gap-4 border border-slate-700/50">
            <Trophy className="w-6 h-6 text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]" />
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Điểm số</div>
              <div className="font-mono text-3xl font-black text-white leading-none drop-shadow-md">{scoreRef.current}</div>
            </div>
          </div>
        </div>

        {/* Weapons */}
        <div className="absolute bottom-6 left-6 flex gap-3 z-30">
          <WeaponKey k="1" label="PHÁO HỎA THẦN" color="rose" icon={<Flame className="w-6 h-6"/>} />
          <WeaponKey k="2" label="TIA PLASMA" color="cyan" icon={<Zap className="w-6 h-6"/>} />
          <WeaponKey k="3" label="SÓNG THANH TẨY" color="blue" icon={<Droplets className="w-6 h-6"/>} />
          <WeaponKey k="SPACE" label="TÁI CHẾ" color="lime" icon={<Recycle className="w-6 h-6"/>} />
          
          {/* Ultimate Key */}
          <div className={clsx(
            "flex flex-col items-center p-3 rounded-2xl border backdrop-blur-md w-[88px] ml-4 transition-all duration-300",
            ultimateRef.current.ready 
              ? "border-purple-400 text-purple-300 bg-purple-900/40 shadow-[0_0_20px_rgba(168,85,247,0.6),inset_0_0_15px_rgba(168,85,247,0.3)] animate-pulse" 
              : "border-slate-700 text-slate-500 bg-slate-900/60 shadow-lg"
          )}>
            <div className="mb-2 opacity-90"><Sparkles className="w-6 h-6"/></div>
            <div className="w-full h-10 rounded-lg bg-slate-950 flex items-center justify-center font-display font-black text-xl mb-1.5 border-b-2 border-slate-800 shadow-[inset_0_2px_5px_rgba(0,0,0,0.5)]">
              R
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-center leading-tight opacity-90">NỘ TỔNG HỢP</span>
          </div>
        </div>

        {/* Overlays */}
        <AnimatePresence>
          {gameState === 'start' && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 z-40 bg-slate-950/80 backdrop-blur-md flex items-center justify-center"
            >
              <div className="neumorphic-panel border border-slate-700 p-10 rounded-[2rem] max-w-lg text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-rose-500"></div>
                <h2 className="font-display text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-rose-400 mb-4 drop-shadow-lg">
                  KỶ NGUYÊN KIM LOẠI
                </h2>
                <p className="text-slate-300 mb-8 text-lg">
                  Bảo vệ Lò Luyện Kim, tinh chế 100% kim loại và tiêu diệt Dị Vật Quặng Cổ Đại!
                </p>
                <div className="space-y-4 text-left bg-slate-950/50 p-6 rounded-2xl mb-8 border border-slate-800/50 shadow-inner">
                  <div className="flex items-center gap-4 text-sm text-slate-200"><span className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center font-black text-rose-400 shadow-md">1</span> Pháo Hỏa Thần ➔ Diệt Oxit TB/Yếu</div>
                  <div className="flex items-center gap-4 text-sm text-slate-200"><span className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center font-black text-cyan-400 shadow-md">2</span> Tia Plasma ➔ Diệt Oxit Mạnh</div>
                  <div className="flex items-center gap-4 text-sm text-slate-200"><span className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center font-black text-blue-400 shadow-md">3</span> Sóng Thanh Tẩy ➔ Lọc Ion tạp chất</div>
                  <div className="flex items-center gap-4 text-sm text-slate-200"><span className="w-16 h-8 bg-slate-800 rounded-lg flex items-center justify-center font-black text-lime-400 text-xs shadow-md">SPACE</span> Tái Chế ➔ Thu gom phế liệu</div>
                  <div className="flex items-center gap-4 text-sm text-slate-200"><span className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center font-black text-purple-400 shadow-md">R</span> Nộ ➔ Quét sạch màn hình (Khi đủ 50%)</div>
                </div>
                <button 
                  onClick={startGame}
                  className="w-full py-5 bg-gradient-to-r from-cyan-600 via-purple-600 to-rose-600 hover:from-cyan-500 hover:via-purple-500 hover:to-rose-500 text-white font-black text-2xl rounded-2xl shadow-[0_10px_30px_rgba(168,85,247,0.4)] transition-all hover:scale-[1.02] flex items-center justify-center gap-3"
                >
                  <Play className="w-7 h-7 fill-current" /> BẮT ĐẦU CHIẾN DỊCH
                </button>
              </div>
            </motion.div>
          )}

          {gameState === 'gameover' && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 z-40 bg-rose-950/90 backdrop-blur-xl flex items-center justify-center"
            >
              <div className="neumorphic-panel border border-rose-500/50 p-10 rounded-[2rem] shadow-[0_0_100px_rgba(225,29,72,0.4)] max-w-md text-center">
                <AlertTriangle className="w-20 h-20 text-rose-500 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(225,29,72,0.8)]" />
                <h2 className="font-display text-5xl font-black text-rose-500 mb-3 drop-shadow-md">LÒ ĐÃ VỠ!</h2>
                <p className="text-rose-200/70 mb-8 text-lg">Bạn đã để lọt quá nhiều tạp chất.</p>
                
                <div className="bg-slate-950/50 rounded-2xl p-6 mb-8 border border-rose-900/50 shadow-inner">
                  <div className="text-sm text-rose-400/80 font-bold uppercase tracking-widest mb-2">Điểm của bạn</div>
                  <div className="font-mono text-5xl font-black text-white drop-shadow-lg">{scoreRef.current}</div>
                </div>

                <button 
                  onClick={startGame}
                  className="w-full py-5 bg-slate-800 hover:bg-slate-700 text-white font-black text-xl rounded-2xl transition-all flex items-center justify-center gap-3 border border-slate-600 shadow-lg hover:scale-[1.02]"
                >
                  <RotateCcw className="w-6 h-6" /> THỬ LẠI
                </button>
              </div>
            </motion.div>
          )}

          {gameState === 'victory' && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 z-40 bg-slate-950/95 backdrop-blur-xl flex items-center justify-center overflow-hidden"
            >
              {/* Cinematic Fireworks */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(30)].map((_, i) => (
                  <div 
                    key={i}
                    className="absolute w-1 h-1 rounded-full animate-[water-ripple_2s_ease-out_infinite]"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      borderColor: ['#34d399', '#22d3ee', '#c084fc', '#fbbf24'][Math.floor(Math.random() * 4)],
                      animationDelay: `${Math.random() * 3}s`,
                      borderStyle: 'solid'
                    }}
                  />
                ))}
              </div>

              <div className="neumorphic-panel border border-emerald-500/50 p-10 rounded-[2rem] shadow-[0_0_80px_rgba(16,185,129,0.3)] max-w-lg text-center relative z-10">
                <Trophy className="w-24 h-24 text-emerald-400 mx-auto mb-6 drop-shadow-[0_0_20px_rgba(52,211,153,0.8)]" />
                <h2 className="font-display text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-4 drop-shadow-lg">
                  CHIẾN DỊCH HOÀN THÀNH!
                </h2>
                <p className="text-slate-300 mb-8 text-lg leading-relaxed">
                  Bạn đã tiêu diệt Dị Vật Quặng Cổ Đại và tái chế thành công <br/>
                  <strong className="text-emerald-400 text-3xl font-mono block mt-2 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">{scoreRef.current} TẤN</strong><br/>
                  kim loại, bảo vệ môi trường xanh!
                </p>
                
                <button 
                  onClick={startGame}
                  className="w-full py-5 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-black text-xl rounded-2xl shadow-[0_10px_30px_rgba(16,185,129,0.4)] transition-all hover:scale-[1.02] flex items-center justify-center gap-3"
                >
                  <Play className="w-6 h-6 fill-current" /> CHƠI LẠI TỪ ĐẦU
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const WeaponKey = ({ k, label, color, icon }: any) => {
  const colorClasses: any = {
    rose: 'border-rose-500/40 text-rose-400 bg-rose-900/20 shadow-[0_0_15px_rgba(225,29,72,0.2)]',
    cyan: 'border-cyan-500/40 text-cyan-400 bg-cyan-900/20 shadow-[0_0_15px_rgba(6,182,212,0.2)]',
    blue: 'border-blue-500/40 text-blue-400 bg-blue-900/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]',
    emerald: 'border-emerald-500/40 text-emerald-400 bg-emerald-900/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]',
    fuchsia: 'border-fuchsia-500/40 text-fuchsia-400 bg-fuchsia-900/20 shadow-[0_0_15px_rgba(217,70,239,0.2)]',
    lime: 'border-lime-500/40 text-lime-400 bg-lime-900/20 shadow-[0_0_15px_rgba(163,230,53,0.2)]',
  };
  
  return (
    <div className={clsx("flex flex-col items-center p-3 rounded-2xl border backdrop-blur-md w-[88px]", colorClasses[color])}>
      <div className="mb-2 opacity-90">{icon}</div>
      <div className="w-full h-10 rounded-lg bg-slate-950 flex items-center justify-center font-display font-black text-xl mb-1.5 border-b-2 border-slate-800 shadow-[inset_0_2px_5px_rgba(0,0,0,0.5)]">
        {k}
      </div>
      <span className="text-[9px] font-black uppercase tracking-widest text-center leading-tight opacity-90">{label}</span>
    </div>
  );
};
