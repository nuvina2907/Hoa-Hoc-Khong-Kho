import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, XCircle, Lightbulb, ArrowRight, RotateCcw, Target, BookOpen, Zap, Beaker, Atom, Trophy } from 'lucide-react';
import clsx from 'clsx';

// --- DỮ LIỆU BÀI TẬP ---

// Phần 1
const P1_CORRECT_STEPS = ['Thu gom', 'Phân loại', 'Nghiền, cắt', 'Nung chảy', 'Tinh chế & Đúc'];

// Phần 2
type Method = 'nhiet' | 'thuy' | 'dien';
interface P2Item { id: string; label: string; correct: Method }
const P2_ITEMS: P2Item[] = [
  { id: '1', label: 'Al₂O₃', correct: 'dien' },
  { id: '2', label: 'Fe₂O₃', correct: 'nhiet' },
  { id: '3', label: 'CuSO₄', correct: 'thuy' },
  { id: '4', label: 'NaCl', correct: 'dien' },
  { id: '5', label: 'ZnO', correct: 'nhiet' },
  { id: '6', label: 'AgNO₃', correct: 'thuy' },
  { id: '7', label: 'MgCl₂', correct: 'dien' },
  { id: '8', label: 'PbO', correct: 'nhiet' },
];

// --- DỮ LIỆU PHẦN 4: TRẮC NGHIỆM ---
interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "Phương pháp nào sau đây dùng để điều chế các kim loại hoạt động hóa học mạnh (K, Na, Ca, Mg, Al)?",
    options: ["Nhiệt luyện", "Thủy luyện", "Điện phân nóng chảy", "Điện phân dung dịch"],
    correctIndex: 2,
    explanation: "Các kim loại mạnh chỉ có thể được điều chế bằng phương pháp điện phân nóng chảy hợp chất của chúng."
  },
  {
    id: 2,
    question: "Chất nào sau đây thường được dùng làm chất khử trong phương pháp nhiệt luyện?",
    options: ["CO", "CO2", "O2", "NaCl"],
    correctIndex: 0,
    explanation: "CO, C, H2 hoặc Al thường được dùng làm chất khử để chiếm Oxi của oxit kim loại ở nhiệt độ cao."
  },
  {
    id: 3,
    question: "Quá trình tái chế kim loại mang lại lợi ích gì?",
    options: ["Tiết kiệm năng lượng", "Giảm ô nhiễm môi trường", "Bảo tồn tài nguyên thiên nhiên", "Tất cả các ý trên"],
    correctIndex: 3,
    explanation: "Tái chế kim loại giúp tiết kiệm năng lượng, giảm lượng khí thải, và bảo vệ tài nguyên quặng đang cạn kiệt."
  },
  {
    id: 4,
    question: "Phương pháp thủy luyện thường dùng để điều chế các kim loại có mức độ hoạt động như thế nào?",
    options: ["Rất mạnh", "Trung bình", "Yếu", "Tất cả các kim loại"],
    correctIndex: 2,
    explanation: "Thủy luyện thường dùng để điều chế các kim loại yếu (như Cu, Ag, Au) bằng cách dùng kim loại mạnh hơn đẩy kim loại yếu ra khỏi dung dịch muối."
  },
  {
    id: 5,
    question: "Bước đầu tiên trong quy trình tái chế kim loại là gì?",
    options: ["Nung chảy", "Phân loại", "Thu gom", "Tinh chế"],
    correctIndex: 2,
    explanation: "Thu gom phế liệu là bước đầu tiên và quan trọng nhất để bắt đầu chu trình tái chế."
  },
  {
    id: 6,
    question: "Kim loại nào sau đây có thể được điều chế bằng phương pháp nhiệt luyện?",
    options: ["Na", "Mg", "Fe", "Ca"],
    correctIndex: 2,
    explanation: "Fe là kim loại hoạt động trung bình, có thể được điều chế bằng cách dùng CO hoặc H2 khử Fe2O3 ở nhiệt độ cao."
  },
  {
    id: 7,
    question: "Trong phương pháp thủy luyện, để điều chế Cu từ dung dịch CuSO4, ta có thể dùng kim loại nào sau đây?",
    options: ["Ag", "Fe", "Au", "Pt"],
    correctIndex: 1,
    explanation: "Fe hoạt động hóa học mạnh hơn Cu nên có thể đẩy Cu ra khỏi dung dịch muối CuSO4."
  },
  {
    id: 8,
    question: "Phản ứng: Fe2O3 + 3CO -> 2Fe + 3CO2 thuộc phương pháp điều chế kim loại nào?",
    options: ["Điện phân", "Nhiệt luyện", "Thủy luyện", "Tái chế"],
    correctIndex: 1,
    explanation: "Đây là phản ứng dùng chất khử CO để khử oxit kim loại ở nhiệt độ cao, đặc trưng của phương pháp nhiệt luyện."
  },
  {
    id: 9,
    question: "Tại sao không thể dùng phương pháp nhiệt luyện để điều chế Nhôm (Al) từ Al2O3?",
    options: ["Vì Al2O3 rất bền vững", "Vì Al là kim loại yếu", "Vì không có chất khử nào phản ứng được", "Cả A và C đều đúng"],
    correctIndex: 0,
    explanation: "Al2O3 là hợp chất rất bền vững, các chất khử thông thường như C, CO, H2 không thể khử được nó ở nhiệt độ cao. Phải dùng điện phân nóng chảy."
  },
  {
    id: 10,
    question: "Kim loại nào sau đây có khả năng tái chế cao nhất và phổ biến nhất trên thế giới?",
    options: ["Vàng (Au)", "Thép (hợp kim của Sắt)", "Đồng (Cu)", "Nhôm (Al)"],
    correctIndex: 1,
    explanation: "Thép là vật liệu được tái chế nhiều nhất trên thế giới do tính phổ biến trong xây dựng, sản xuất ô tô và dễ dàng phân loại bằng từ tính."
  }
];

export default function LuyenTapChuyenSau() {
  // --- STATE PHẦN 1: SƠ ĐỒ ---
  const [p1Bank, setP1Bank] = useState<string[]>([...P1_CORRECT_STEPS].sort(() => Math.random() - 0.5));
  const [p1Slots, setP1Slots] = useState<(string | null)[]>(Array(5).fill(null));
  const [p1Status, setP1Status] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [p1ShowHint, setP1ShowHint] = useState(false);

  const handleP1BankClick = (item: string) => {
    const firstEmpty = p1Slots.findIndex(s => s === null);
    if (firstEmpty !== -1) {
      const newSlots = [...p1Slots];
      newSlots[firstEmpty] = item;
      setP1Slots(newSlots);
      setP1Bank(p1Bank.filter(i => i !== item));
      setP1Status('idle');
    }
  };

  const handleP1SlotClick = (index: number) => {
    const item = p1Slots[index];
    if (item) {
      const newSlots = [...p1Slots];
      newSlots[index] = null;
      setP1Slots(newSlots);
      setP1Bank([...p1Bank, item]);
      setP1Status('idle');
    }
  };

  const checkP1 = () => {
    if (p1Slots.includes(null)) return;
    const isCorrect = p1Slots.every((val, idx) => val === P1_CORRECT_STEPS[idx]);
    setP1Status(isCorrect ? 'correct' : 'incorrect');
    if (!isCorrect) setP1ShowHint(false);
  };

  // --- STATE PHẦN 2: PHÂN LOẠI ---
  const [p2Bank, setP2Bank] = useState<P2Item[]>([...P2_ITEMS].sort(() => Math.random() - 0.5));
  const [p2Cols, setP2Cols] = useState<Record<Method, P2Item[]>>({ nhiet: [], thuy: [], dien: [] });
  const [p2Selected, setP2Selected] = useState<string | null>(null);
  const [p2Status, setP2Status] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [p2ShowHint, setP2ShowHint] = useState(false);

  const handleP2BankClick = (id: string) => {
    setP2Selected(id === p2Selected ? null : id);
  };

  const handleP2ColClick = (method: Method) => {
    if (!p2Selected) return;
    const item = p2Bank.find(i => i.id === p2Selected);
    if (item) {
      setP2Cols(prev => ({ ...prev, [method]: [...prev[method], item] }));
      setP2Bank(prev => prev.filter(i => i.id !== p2Selected));
      setP2Selected(null);
      setP2Status('idle');
    }
  };

  const handleP2ItemRemove = (method: Method, id: string) => {
    const item = p2Cols[method].find(i => i.id === id);
    if (item) {
      setP2Cols(prev => ({ ...prev, [method]: prev[method].filter(i => i.id !== id) }));
      setP2Bank(prev => [...prev, item]);
      setP2Status('idle');
    }
  };

  const checkP2 = () => {
    if (p2Bank.length > 0) return;
    let isCorrect = true;
    (['nhiet', 'thuy', 'dien'] as Method[]).forEach(method => {
      p2Cols[method].forEach(item => {
        if (item.correct !== method) isCorrect = false;
      });
    });
    setP2Status(isCorrect ? 'correct' : 'incorrect');
    if (!isCorrect) setP2ShowHint(false);
  };

  // --- STATE PHẦN 3: PHƯƠNG TRÌNH ---
  const [p3Eq1, setP3Eq1] = useState({ r: '', p: '' });
  const [p3Eq2, setP3Eq2] = useState({ r: '', p: '' });
  const [p3Eq3, setP3Eq3] = useState({ r: '', p: '' });
  const [p3Status, setP3Status] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [p3ShowHint, setP3ShowHint] = useState(false);

  const checkP3 = () => {
    const clean = (str: string) => str.toUpperCase().replace(/\s/g, '');
    
    // Eq1: Fe2O3 + [CO/C/H2] -> Fe + [CO2/CO/H2O]
    const r1 = clean(p3Eq1.r);
    const p1 = clean(p3Eq1.p);
    const eq1Ok = (r1==='CO'&&p1==='CO2') || (r1==='C'&&(p1==='CO2'||p1==='CO')) || (r1==='H2'&&p1==='H2O');

    // Eq2: 2Al2O3 -> 4[Al] + 3[O2]
    const r2 = clean(p3Eq2.r);
    const p2 = clean(p3Eq2.p);
    const eq2Ok = (r2==='AL'&&p2==='O2') || (r2==='O2'&&p2==='AL');

    // Eq3: Fe + CuSO4 -> [FeSO4] + [Cu]
    const r3 = clean(p3Eq3.r);
    const p3 = clean(p3Eq3.p);
    const eq3Ok = (r3==='FESO4'&&p3==='CU') || (r3==='CU'&&p3==='FESO4');

    const isCorrect = eq1Ok && eq2Ok && eq3Ok;
    setP3Status(isCorrect ? 'correct' : 'incorrect');
    if (!isCorrect) setP3ShowHint(false);
  };

  // --- STATE PHẦN 4: TRẮC NGHIỆM ---
  const [quizCurrentQ, setQuizCurrentQ] = useState(0);
  const [quizSelected, setQuizSelected] = useState<number | null>(null);
  const [quizStatus, setQuizStatus] = useState<'idle' | 'answered'>('idle');
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const handleQuizSelect = (index: number) => {
    if (quizStatus === 'answered') return;
    setQuizSelected(index);
  };

  const handleQuizSubmit = () => {
    if (quizSelected === null) return;
    setQuizStatus('answered');
    if (quizSelected === QUIZ_QUESTIONS[quizCurrentQ].correctIndex) {
      setQuizScore(s => s + 1);
    }
  };

  const handleQuizNext = () => {
    if (quizCurrentQ < QUIZ_QUESTIONS.length - 1) {
      setQuizCurrentQ(q => q + 1);
      setQuizSelected(null);
      setQuizStatus('idle');
    } else {
      setQuizFinished(true);
    }
  };

  const handleQuizReset = () => {
    setQuizCurrentQ(0);
    setQuizSelected(null);
    setQuizStatus('idle');
    setQuizScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 relative font-sans text-[var(--foreground)]">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[10%] left-[-5%] w-[40%] h-[40%] bg-[var(--secondary)]/5 blur-[100px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-[var(--accent)]/5 blur-[100px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-[var(--primary)]/20 to-transparent"></div>
      </div>

      {/* Header */}
      <div className="text-center mb-16 relative">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center justify-center p-4 bg-[var(--card)] border-2 border-[var(--secondary)] shadow-[0_0_15px_rgba(0,240,255,0.3)] mb-6 relative"
          style={{ clipPath: 'polygon(15% 0, 100% 0, 100% 85%, 85% 100%, 0 100%, 0 15%)' }}
        >
          <div className="absolute inset-0 bg-[var(--secondary)]/10"></div>
          <Beaker className="w-12 h-12 text-[var(--secondary)] relative z-10" />
        </motion.div>
        <h2 className="font-display text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[var(--secondary)] to-[var(--primary)] mb-6 tracking-widest uppercase drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]">
          KHU VỰC HUẤN LUYỆN
        </h2>
        <p className="text-[var(--foreground)]/70 max-w-2xl mx-auto text-lg font-mono uppercase tracking-wider">
          &gt; HỆ THỐNG MÔ PHỎNG THỰC TẾ ẢO<br/>
          &gt; HOÀN THÀNH BÀI KIỂM TRA ĐỂ NÂNG CẤP QUYỀN TRUY CẬP
        </p>
      </div>

      {/* PHẦN A: LUYỆN LÝ THUYẾT */}
      <div className="space-y-8 relative z-10">
        <div className="flex items-center gap-4 pb-4 border-b-2 border-[var(--secondary)]/50">
          <div className="p-3 bg-[var(--secondary)]/10 border border-[var(--secondary)] text-[var(--secondary)] shadow-[0_0_10px_rgba(0,240,255,0.2)]" style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 80%, 80% 100%, 0 100%, 0 20%)' }}>
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="font-display text-3xl font-black text-[var(--foreground)] tracking-widest uppercase">GIAI ĐOẠN 1: LÝ THUYẾT</h3>
        </div>

        {/* Bài 1: Sơ đồ tái chế */}
        <div className="cyber-card p-8 group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--secondary)]/5 blur-3xl -mr-32 -mt-32 transition-transform group-hover:scale-150 duration-700 pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 relative z-10">
            <div>
              <h4 className="font-display text-2xl font-bold text-[var(--secondary)] mb-2 flex items-center gap-2 uppercase tracking-wider">
                <span className="bg-[var(--secondary)]/20 border border-[var(--secondary)] text-[var(--secondary)] w-8 h-8 flex items-center justify-center text-sm font-black" style={{ clipPath: 'polygon(25% 0, 100% 0, 100% 75%, 75% 100%, 0 100%, 0 25%)' }}>1</span>
                Sơ đồ quy trình tái chế
              </h4>
              <p className="text-[var(--foreground)]/70 font-mono text-sm uppercase">&gt; Xác định trình tự các bước tái chế kim loại.</p>
            </div>
            <div className="cyber-badge px-4 py-2 text-sm font-bold flex items-center gap-2">
              <Zap className="w-4 h-4" /> KÉO THẢ / NHẤN
            </div>
          </div>

          {/* Bank */}
          <div className="flex flex-wrap gap-3 mb-10 min-h-[60px] p-6 bg-[var(--background)]/50 border border-[var(--border)] relative z-10 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
            <AnimatePresence>
              {p1Bank.map(item => (
                <motion.button
                  key={item}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => handleP1BankClick(item)}
                  className="px-6 py-3 bg-[var(--card)] border border-[#00ff00]/50 hover:border-[#00ff00] hover:bg-[#00ff00]/10 transition-all font-mono font-bold text-[#00ff00] uppercase tracking-wider shadow-[0_0_10px_rgba(0,255,0,0)] hover:shadow-[0_0_15px_rgba(0,255,0,0.3)]"
                  style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
                >
                  {item}
                </motion.button>
              ))}
              {p1Bank.length === 0 && <span className="text-[var(--foreground)]/40 text-sm font-mono uppercase tracking-widest my-auto w-full text-center">&gt; TRỐNG</span>}
            </AnimatePresence>
          </div>

          {/* Slots */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 relative z-10">
            {/* Đường nối background (chỉ hiện trên desktop) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-[#00ff00]/20 -z-10 -translate-y-1/2 overflow-hidden">
              <motion.div 
                className="h-full bg-[#00ff00] shadow-[0_0_10px_#00ff00]"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                style={{ width: '50%' }}
              />
            </div>
            
            {p1Slots.map((slot, idx) => (
              <React.Fragment key={idx}>
                <div 
                  onClick={() => handleP1SlotClick(idx)}
                  className={clsx(
                    "w-full md:w-40 h-20 flex items-center justify-center border transition-all cursor-pointer bg-[var(--card)] z-10 font-mono uppercase tracking-wider",
                    slot ? "border-[#00ff00] shadow-[0_0_15px_rgba(0,255,0,0.5)] scale-105" : "border-[var(--border)] hover:border-[#00ff00]/50 hover:bg-[#00ff00]/10 border-dashed"
                  )}
                  style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
                >
                  {slot ? (
                    <span className="font-bold text-[#00ff00] text-center text-sm px-2 drop-shadow-[0_0_5px_rgba(0,255,0,0.8)]">{slot}</span>
                  ) : (
                    <span className="text-[var(--foreground)]/40 font-medium text-sm">BƯỚC {idx + 1}</span>
                  )}
                </div>
                {idx < 4 && <ArrowRight className="w-8 h-8 text-[#00ff00]/50 md:hidden my-2" />}
              </React.Fragment>
            ))}
          </div>

          {/* Actions & Feedback */}
          <div className="mt-10 flex flex-col items-center gap-6 relative z-10">
            <button 
              onClick={checkP1}
              disabled={p1Slots.includes(null)}
              className="cyber-button px-10 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              XÁC THỰC DỮ LIỆU
            </button>

            {p1Status === 'correct' && (
              <motion.div initial={{ opacity: 0, y: 10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="flex items-center gap-3 text-[var(--secondary)] font-mono font-bold bg-[var(--secondary)]/10 border border-[var(--secondary)] px-6 py-4 shadow-[0_0_15px_rgba(0,240,255,0.2)] uppercase tracking-wider" style={{ clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)' }}>
                <CheckCircle className="w-6 h-6" /> &gt; XÁC THỰC THÀNH CÔNG. QUY TRÌNH HỢP LỆ.
              </motion.div>
            )}

            {p1Status === 'incorrect' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-4 w-full">
                <div className="flex items-center gap-3 text-[var(--accent)] font-mono font-bold bg-[var(--accent)]/10 border border-[var(--accent)] px-6 py-4 shadow-[0_0_15px_rgba(255,0,60,0.2)] uppercase tracking-wider" style={{ clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)' }}>
                  <XCircle className="w-6 h-6" /> &gt; LỖI TRÌNH TỰ. YÊU CẦU SẮP XẾP LẠI.
                </div>
                {!p1ShowHint ? (
                  <button onClick={() => setP1ShowHint(true)} className="flex items-center gap-2 text-[var(--primary)] hover:text-[var(--primary)]/80 font-mono font-bold uppercase tracking-widest text-sm">
                    <Lightbulb className="w-5 h-5" /> &gt; YÊU CẦU HỖ TRỢ HỆ THỐNG
                  </button>
                ) : (
                  <div className="bg-[var(--card)] border border-[var(--primary)]/50 p-6 text-[var(--foreground)] font-mono text-sm max-w-2xl text-left shadow-[0_0_15px_rgba(252,238,10,0.1)]" style={{ clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)' }}>
                    <strong className="text-[var(--primary)] block mb-2">&gt; HỆ THỐNG GỢI Ý:</strong> Quy trình tái chế luôn bắt đầu bằng việc đi <strong className="text-[var(--secondary)]">Thu gom</strong> phế liệu, sau đó phải <strong className="text-[var(--secondary)]">Phân loại</strong> chúng ra trước khi đem đi <strong className="text-[var(--secondary)]">Nghiền, cắt</strong> và <strong className="text-[var(--secondary)]">Nung chảy</strong>.
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* Bài 2: Phân loại phương pháp */}
        <div className="cyber-card p-8 group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary)]/5 blur-3xl -mr-32 -mt-32 transition-transform group-hover:scale-150 duration-700 pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 relative z-10">
            <div>
              <h4 className="font-display text-2xl font-bold text-[var(--primary)] mb-2 flex items-center gap-2 uppercase tracking-wider">
                <span className="bg-[var(--primary)]/20 border border-[var(--primary)] text-[var(--primary)] w-8 h-8 flex items-center justify-center text-sm font-black" style={{ clipPath: 'polygon(25% 0, 100% 0, 100% 75%, 75% 100%, 0 100%, 0 25%)' }}>2</span>
                Phân loại phương pháp điều chế
              </h4>
              <p className="text-[var(--foreground)]/70 font-mono text-sm uppercase">&gt; Phân loại các hợp chất theo phương pháp xử lý tương ứng.</p>
            </div>
            <div className="cyber-badge px-4 py-2 text-sm font-bold flex items-center gap-2">
              <Atom className="w-4 h-4" /> PHÂN LOẠI
            </div>
          </div>

          {/* Bank */}
          <div className="mb-8 p-6 bg-[var(--background)]/50 border border-[var(--border)] relative z-10 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
            <h5 className="text-sm font-bold text-[var(--secondary)] mb-4 uppercase tracking-widest flex items-center gap-2 font-mono">
              <div className="w-2 h-2 bg-[var(--secondary)] animate-pulse"></div> DANH SÁCH CHỜ XỬ LÝ
            </h5>
            <div className="flex flex-wrap gap-3 min-h-[50px]">
              <AnimatePresence>
                {p2Bank.map(item => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => handleP2BankClick(item.id)}
                    className={clsx(
                      "px-4 py-2 font-mono text-base font-bold transition-all shadow-sm border",
                      p2Selected === item.id 
                        ? "bg-[var(--primary)]/20 border-[var(--primary)] text-[var(--primary)] scale-110 shadow-[0_0_15px_rgba(252,238,10,0.3)]" 
                        : "bg-[var(--card)] border-[var(--border)] text-[var(--foreground)] hover:border-[var(--secondary)] hover:text-[var(--secondary)] hover:-translate-y-1"
                    )}
                    style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
                  >
                    {item.label}
                  </motion.button>
                ))}
                {p2Bank.length === 0 && <span className="text-[var(--foreground)]/40 text-sm font-mono uppercase tracking-widest my-auto w-full text-center">&gt; TRỐNG</span>}
              </AnimatePresence>
            </div>
          </div>

          {/* Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            {(['nhiet', 'thuy', 'dien'] as Method[]).map(method => {
              const titles = {
                nhiet: { title: 'NHIỆT LUYỆN', color: 'border-[var(--accent)] bg-[var(--accent)]/5', text: 'text-[var(--accent)]', icon: '🔥' },
                thuy: { title: 'THỦY LUYỆN', color: 'border-[var(--secondary)] bg-[var(--secondary)]/5', text: 'text-[var(--secondary)]', icon: '💧' },
                dien: { title: 'ĐIỆN PHÂN', color: 'border-[var(--primary)] bg-[var(--primary)]/5', text: 'text-[var(--primary)]', icon: '⚡' }
              };
              const config = titles[method];

              return (
                <div 
                  key={method}
                  onClick={() => handleP2ColClick(method)}
                  className={clsx(
                    "border p-6 min-h-[250px] transition-all backdrop-blur-sm",
                    config.color,
                    p2Selected ? `cursor-pointer hover:shadow-[0_0_20px_currentColor] hover:scale-[1.02] ${config.text}` : ""
                  )}
                  style={{ clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)' }}
                >
                  <h5 className={clsx("font-display text-xl font-black text-center mb-6 border-b border-current pb-3 opacity-90 flex items-center justify-center gap-2 tracking-widest", config.text)}>
                    <span>{config.icon}</span> {config.title}
                  </h5>
                  <div className="flex flex-col gap-3">
                    <AnimatePresence>
                      {p2Cols[method].map(item => (
                        <motion.button
                          key={item.id}
                          initial={{ opacity: 0, x: -10, scale: 0.9 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          onClick={(e) => { e.stopPropagation(); handleP2ItemRemove(method, item.id); }}
                          className="bg-[var(--card)] border border-[var(--border)] hover:border-[var(--accent)] px-4 py-3 font-mono text-base font-bold text-[var(--foreground)] flex justify-between items-center group transition-all"
                          style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
                        >
                          {item.label}
                          <XCircle className="w-5 h-5 text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.button>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Actions & Feedback */}
          <div className="mt-10 flex flex-col items-center gap-6 relative z-10">
            <button 
              onClick={checkP2}
              disabled={p2Bank.length > 0}
              className="cyber-button px-10 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              XÁC THỰC DỮ LIỆU
            </button>

            {p2Status === 'correct' && (
              <motion.div initial={{ opacity: 0, y: 10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="flex items-center gap-3 text-[var(--secondary)] font-mono font-bold bg-[var(--secondary)]/10 border border-[var(--secondary)] px-6 py-4 shadow-[0_0_15px_rgba(0,240,255,0.2)] uppercase tracking-wider" style={{ clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)' }}>
                <CheckCircle className="w-6 h-6" /> &gt; XÁC THỰC THÀNH CÔNG. PHÂN LOẠI CHÍNH XÁC.
              </motion.div>
            )}

            {p2Status === 'incorrect' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-4 w-full">
                <div className="flex items-center gap-3 text-[var(--accent)] font-mono font-bold bg-[var(--accent)]/10 border border-[var(--accent)] px-6 py-4 shadow-[0_0_15px_rgba(255,0,60,0.2)] uppercase tracking-wider" style={{ clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)' }}>
                  <XCircle className="w-6 h-6" /> &gt; LỖI PHÂN LOẠI. PHÁT HIỆN DỮ LIỆU SAI LỆCH.
                </div>
                {!p2ShowHint ? (
                  <button onClick={() => setP2ShowHint(true)} className="flex items-center gap-2 text-[var(--primary)] hover:text-[var(--primary)]/80 font-mono font-bold uppercase tracking-widest text-sm">
                    <Lightbulb className="w-5 h-5" /> &gt; YÊU CẦU HỖ TRỢ HỆ THỐNG
                  </button>
                ) : (
                  <div className="bg-[var(--card)] border border-[var(--primary)]/50 p-6 text-[var(--foreground)] font-mono text-sm max-w-2xl text-left shadow-[0_0_15px_rgba(252,238,10,0.1)]" style={{ clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)' }}>
                    <strong className="text-[var(--primary)] block mb-2">&gt; HỆ THỐNG GỢI Ý:</strong><br/>
                    - Kim loại <strong className="text-[var(--secondary)]">MẠNH</strong> (K, Na, Ca, Mg, Al) ➔ Điện phân nóng chảy.<br/>
                    - Kim loại <strong className="text-[var(--secondary)]">TRUNG BÌNH</strong> (Zn, Fe, Pb, Cu) ➔ Nhiệt luyện.<br/>
                    - Kim loại <strong className="text-[var(--secondary)]">YẾU</strong> (Cu, Ag, Au) ➔ Thủy luyện (hoặc Nhiệt luyện).
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* PHẦN B: GIẢI QUYẾT VẤN ĐỀ */}
      <div className="space-y-8 mt-16 relative z-10">
        <div className="flex items-center gap-4 pb-4 border-b border-[var(--primary)]/30">
          <div className="p-3 bg-[var(--primary)]/10 rounded-none text-[var(--primary)] border border-[var(--primary)]/50" style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
            <Target className="w-8 h-8" />
          </div>
          <h3 className="font-display text-3xl font-bold text-[var(--foreground)] tracking-wider uppercase" style={{ textShadow: '0 0 10px var(--primary)' }}>Giai Đoạn 2: Giải Quyết Vấn Đề</h3>
        </div>

        {/* Bài 3: Hoàn thành phương trình */}
        <div className="cyber-card p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary)]/5 rounded-full blur-3xl -mr-32 -mt-32 transition-transform group-hover:scale-150 duration-700"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 relative z-10">
            <div>
              <h4 className="font-display text-2xl font-bold text-[var(--primary)] mb-2 flex items-center gap-2 uppercase tracking-wide">
                <span className="bg-[var(--primary)]/20 text-[var(--primary)] w-8 h-8 flex items-center justify-center text-sm border border-[var(--primary)]/50" style={{ clipPath: 'polygon(5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%, 0 5px)' }}>3</span>
                Hoàn thành phương trình hóa học
              </h4>
              <p className="text-[var(--foreground)]/70 font-mono text-sm">&gt; Điền công thức hóa học của chất còn thiếu vào ô trống (không cần ghi hệ số cân bằng).</p>
            </div>
            <div className="cyber-badge flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[var(--primary)]" /> ĐIỀN KHUYẾT
            </div>
          </div>

          <div className="space-y-6 max-w-4xl mx-auto relative z-10">
            {/* Eq 1 */}
            <div className="flex flex-col md:flex-row items-center gap-6 bg-[var(--card)] p-6 border border-[var(--primary)]/30 hover:border-[var(--primary)] transition-colors" style={{ clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)' }}>
              <div className="w-10 h-10 bg-[var(--primary)]/20 flex items-center justify-center font-bold text-[var(--primary)] shrink-0 border border-[var(--primary)]/50" style={{ clipPath: 'polygon(5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%, 0 5px)' }}>1</div>
              <div className="flex flex-wrap items-center justify-center gap-4 font-mono text-xl font-bold text-[var(--foreground)] w-full">
                <span>Fe₂O₃</span>
                <span className="text-[var(--primary)]/50">+</span>
                <input 
                  type="text" 
                  value={p3Eq1.r} 
                  onChange={e => setP3Eq1({...p3Eq1, r: e.target.value})}
                  placeholder="Chất khử" 
                  className="cyber-input w-32 text-center uppercase" 
                />
                <div className="flex flex-col items-center justify-center mx-2">
                  <span className="text-xs text-[var(--accent)] font-mono">t°</span>
                  <ArrowRight className="w-6 h-6 text-[var(--accent)]" />
                </div>
                <span>Fe</span>
                <span className="text-[var(--primary)]/50">+</span>
                <input 
                  type="text" 
                  value={p3Eq1.p} 
                  onChange={e => setP3Eq1({...p3Eq1, p: e.target.value})}
                  placeholder="Sản phẩm" 
                  className="cyber-input w-32 text-center uppercase" 
                />
              </div>
            </div>

            {/* Eq 2 */}
            <div className="flex flex-col md:flex-row items-center gap-6 bg-[var(--card)] p-6 border border-[var(--secondary)]/30 hover:border-[var(--secondary)] transition-colors" style={{ clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)' }}>
              <div className="w-10 h-10 bg-[var(--secondary)]/20 flex items-center justify-center font-bold text-[var(--secondary)] shrink-0 border border-[var(--secondary)]/50" style={{ clipPath: 'polygon(5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%, 0 5px)' }}>2</div>
              <div className="flex flex-wrap items-center justify-center gap-4 font-mono text-xl font-bold text-[var(--foreground)] w-full">
                <span>2Al₂O₃</span>
                <div className="flex flex-col items-center justify-center mx-2">
                  <span className="text-xs text-[var(--secondary)] font-mono">đpnc</span>
                  <ArrowRight className="w-6 h-6 text-[var(--secondary)]" />
                </div>
                <span>4</span>
                <input 
                  type="text" 
                  value={p3Eq2.r} 
                  onChange={e => setP3Eq2({...p3Eq2, r: e.target.value})}
                  placeholder="Kim loại" 
                  className="cyber-input w-32 text-center uppercase" 
                />
                <span className="text-[var(--secondary)]/50">+</span>
                <span>3</span>
                <input 
                  type="text" 
                  value={p3Eq2.p} 
                  onChange={e => setP3Eq2({...p3Eq2, p: e.target.value})}
                  placeholder="Khí" 
                  className="cyber-input w-32 text-center uppercase" 
                />
              </div>
            </div>

            {/* Eq 3 */}
            <div className="flex flex-col md:flex-row items-center gap-6 bg-[var(--card)] p-6 border border-[var(--accent)]/30 hover:border-[var(--accent)] transition-colors" style={{ clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)' }}>
              <div className="w-10 h-10 bg-[var(--accent)]/20 flex items-center justify-center font-bold text-[var(--accent)] shrink-0 border border-[var(--accent)]/50" style={{ clipPath: 'polygon(5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%, 0 5px)' }}>3</div>
              <div className="flex flex-wrap items-center justify-center gap-4 font-mono text-xl font-bold text-[var(--foreground)] w-full">
                <span>Fe</span>
                <span className="text-[var(--accent)]/50">+</span>
                <span>CuSO₄</span>
                <div className="flex flex-col items-center justify-center mx-2">
                  <ArrowRight className="w-6 h-6 text-[var(--accent)]" />
                </div>
                <input 
                  type="text" 
                  value={p3Eq3.r} 
                  onChange={e => setP3Eq3({...p3Eq3, r: e.target.value})}
                  placeholder="Muối mới" 
                  className="cyber-input w-36 text-center uppercase" 
                />
                <span className="text-[var(--accent)]/50">+</span>
                <input 
                  type="text" 
                  value={p3Eq3.p} 
                  onChange={e => setP3Eq3({...p3Eq3, p: e.target.value})}
                  placeholder="Kim loại" 
                  className="cyber-input w-32 text-center uppercase" 
                />
              </div>
            </div>
          </div>

          {/* Actions & Feedback */}
          <div className="mt-10 flex flex-col items-center gap-6 relative z-10">
            <button 
              onClick={checkP3}
              disabled={!p3Eq1.r || !p3Eq1.p || !p3Eq2.r || !p3Eq2.p || !p3Eq3.r || !p3Eq3.p}
              className="cyber-button px-10 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              XÁC NHẬN KẾT QUẢ
            </button>

            {p3Status === 'correct' && (
              <motion.div initial={{ opacity: 0, y: 10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="flex items-center gap-3 text-[#00ff00] font-mono font-bold bg-[#00ff00]/10 border border-[#00ff00]/50 px-6 py-4 shadow-[0_0_15px_rgba(0,255,0,0.2)]" style={{ clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)' }}>
                <CheckCircle className="w-6 h-6" /> &gt; HỆ THỐNG XÁC NHẬN: PHƯƠNG TRÌNH CHÍNH XÁC 100%
              </motion.div>
            )}

            {p3Status === 'incorrect' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-4 w-full">
                <div className="flex items-center gap-3 text-[var(--primary)] font-mono font-bold bg-[var(--primary)]/10 border border-[var(--primary)]/50 px-6 py-4 shadow-[0_0_15px_rgba(255,0,60,0.2)]" style={{ clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)' }}>
                  <XCircle className="w-6 h-6" /> &gt; CẢNH BÁO: PHÁT HIỆN SAI SÓT TRONG PHƯƠNG TRÌNH
                </div>
                {!p3ShowHint ? (
                  <button onClick={() => setP3ShowHint(true)} className="flex items-center gap-2 text-[var(--secondary)] hover:text-[var(--secondary)]/80 font-mono font-bold uppercase tracking-widest text-sm">
                    <Lightbulb className="w-5 h-5" /> &gt; YÊU CẦU HỖ TRỢ HỆ THỐNG
                  </button>
                ) : (
                  <div className="bg-[var(--card)] border border-[var(--secondary)]/50 p-6 text-[var(--foreground)] font-mono text-sm max-w-2xl text-left shadow-[0_0_15px_rgba(0,240,255,0.1)]" style={{ clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)' }}>
                    <strong className="text-[var(--secondary)] block mb-2">&gt; HỆ THỐNG GỢI Ý:</strong><br/>
                    - <strong className="text-[var(--primary)]">PT 1 (Nhiệt luyện):</strong> Cần chất khử (như CO, C, H2) để cướp Oxi, tạo ra khí tương ứng (CO2, CO, H2O).<br/>
                    - <strong className="text-[var(--primary)]">PT 2 (Điện phân):</strong> Al2O3 bị dòng điện xé toạc thành kim loại Nhôm (Al) và khí Oxi (O2).<br/>
                    - <strong className="text-[var(--primary)]">PT 3 (Thủy luyện):</strong> Sắt (Fe) mạnh hơn Đồng (Cu) nên đẩy Đồng ra khỏi muối, tạo thành muối Sắt (FeSO4) và kim loại Đồng.
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* PHẦN C: TRẮC NGHIỆM NHANH */}
      <div className="space-y-8 mt-16 relative z-10">
        <div className="flex items-center gap-4 pb-4 border-b border-[var(--primary)]/30">
          <div className="p-3 bg-[var(--primary)]/10 rounded-none text-[var(--primary)] border border-[var(--primary)]/50" style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
            <CheckCircle className="w-8 h-8" />
          </div>
          <h3 className="font-display text-3xl font-bold text-[var(--foreground)] tracking-wider uppercase" style={{ textShadow: '0 0 10px var(--primary)' }}>Giai Đoạn 3: Kiểm Tra Hệ Thống</h3>
        </div>

        <div className="cyber-card p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)]/5 rounded-full blur-3xl -mr-32 -mt-32 transition-transform group-hover:scale-150 duration-700"></div>
          
          {!quizFinished ? (
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                <h4 className="font-display text-2xl font-bold text-[var(--accent)] flex items-center gap-2 uppercase tracking-wide">
                  DỮ LIỆU {quizCurrentQ + 1}/{QUIZ_QUESTIONS.length}
                </h4>
                <div className="text-[var(--foreground)]/70 font-mono font-bold">
                  ĐIỂM TÍN NHIỆM: <span className="text-[var(--accent)] text-xl">{quizScore}</span>
                </div>
              </div>

              <div className="bg-[var(--card)] p-6 border border-[var(--accent)]/30 mb-8" style={{ clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)' }}>
                <p className="text-xl font-medium text-[var(--foreground)] font-mono">
                  {QUIZ_QUESTIONS[quizCurrentQ].question}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {QUIZ_QUESTIONS[quizCurrentQ].options.map((opt, idx) => {
                  const isSelected = quizSelected === idx;
                  const isCorrect = idx === QUIZ_QUESTIONS[quizCurrentQ].correctIndex;
                  const showCorrect = quizStatus === 'answered' && isCorrect;
                  const showWrong = quizStatus === 'answered' && isSelected && !isCorrect;

                  return (
                    <button
                      key={idx}
                      onClick={() => handleQuizSelect(idx)}
                      disabled={quizStatus === 'answered'}
                      className={clsx(
                        "p-4 border text-left font-mono transition-all relative overflow-hidden",
                        quizStatus === 'idle' 
                          ? isSelected 
                            ? "border-[var(--accent)] bg-[var(--accent)]/20 text-[var(--accent)] shadow-[0_0_15px_rgba(255,0,255,0.2)]" 
                            : "border-[var(--primary)]/30 bg-[var(--card)] text-[var(--foreground)]/80 hover:border-[var(--accent)] hover:text-[var(--accent)]"
                          : showCorrect
                            ? "border-[#00ff00] bg-[#00ff00]/20 text-[#00ff00] shadow-[0_0_15px_rgba(0,255,0,0.2)]"
                            : showWrong
                              ? "border-[var(--primary)] bg-[var(--primary)]/20 text-[var(--primary)] shadow-[0_0_15px_rgba(255,0,60,0.2)]"
                              : "border-[var(--primary)]/10 bg-[var(--card)]/50 text-[var(--foreground)]/30"
                      )}
                      style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
                    >
                      <div className="flex items-center justify-between relative z-10">
                        <span><span className="font-bold mr-2 text-[var(--secondary)]">[{String.fromCharCode(65 + idx)}]</span> {opt}</span>
                        {showCorrect && <CheckCircle className="w-5 h-5 text-[#00ff00]" />}
                        {showWrong && <XCircle className="w-5 h-5 text-[var(--primary)]" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {quizStatus === 'answered' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 p-6 bg-[var(--secondary)]/10 border border-[var(--secondary)]/50" style={{ clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)' }}>
                  <p className="text-[var(--foreground)] font-mono flex items-start gap-3">
                    <Lightbulb className="w-6 h-6 shrink-0 mt-0.5 text-[var(--secondary)]" />
                    <span><strong className="text-[var(--secondary)]">&gt; GIẢI MÃ DỮ LIỆU:</strong> {QUIZ_QUESTIONS[quizCurrentQ].explanation}</span>
                  </p>
                </motion.div>
              )}

              <div className="flex justify-end">
                {quizStatus === 'idle' ? (
                  <button 
                    onClick={handleQuizSubmit}
                    disabled={quizSelected === null}
                    className="cyber-button px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    TRUYỀN DỮ LIỆU
                  </button>
                ) : (
                  <button 
                    onClick={handleQuizNext}
                    className="cyber-button px-8 py-3 flex items-center gap-2"
                  >
                    {quizCurrentQ < QUIZ_QUESTIONS.length - 1 ? 'TIẾP TỤC QUÉT' : 'XUẤT BÁO CÁO'} <ArrowRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12 relative z-10">
              <Trophy className="w-24 h-24 text-[var(--accent)] mx-auto mb-6 drop-shadow-[0_0_20px_rgba(255,0,255,0.5)]" />
              <h4 className="font-display text-4xl font-bold text-[var(--foreground)] mb-4 uppercase tracking-wider" style={{ textShadow: '0 0 10px var(--accent)' }}>QUÁ TRÌNH QUÉT HOÀN TẤT</h4>
              <p className="text-2xl text-[var(--foreground)]/80 font-mono mb-8">
                ĐIỂM TÍN NHIỆM: <span className="font-black text-[var(--accent)] text-5xl">{quizScore}/{QUIZ_QUESTIONS.length}</span>
              </p>
              
              <button 
                onClick={handleQuizReset}
                className="cyber-button px-8 py-4 flex items-center justify-center gap-2 mx-auto"
              >
                <RotateCcw className="w-6 h-6" /> KHỞI ĐỘNG LẠI CHUỖI QUÉT
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
