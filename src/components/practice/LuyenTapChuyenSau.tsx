import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, XCircle, Lightbulb, ArrowRight, RotateCcw, Target, BookOpen, Zap } from 'lucide-react';
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

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="font-display text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-slate-100 mb-4">
          Dashboard Luyện Tập Chuyên Sâu
        </h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Hệ thống lại toàn bộ kiến thức Bài 15 thông qua các thử thách tư duy. Hoàn thành xuất sắc để chứng tỏ bạn đã "thoát mất gốc"!
        </p>
      </div>

      {/* PHẦN A: LUYỆN LÝ THUYẾT */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 border-b-2 border-teal-500 pb-2">
          <BookOpen className="w-6 h-6 text-teal-600 dark:text-teal-400" />
          <h3 className="font-display text-2xl font-bold text-slate-800 dark:text-slate-100">Phần A: Luyện Lý Thuyết</h3>
        </div>

        {/* Bài 1: Sơ đồ tái chế */}
        <div className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h4 className="font-display text-xl font-bold text-teal-700 dark:text-teal-400 mb-2">1. Sơ đồ quy trình tái chế</h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Nhấn vào các thẻ bên dưới để điền vào sơ đồ theo đúng thứ tự 5 bước tái chế kim loại.</p>
            </div>
            <div className="bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 px-3 py-1 rounded-full text-sm font-bold">
              Kéo thả / Nhấn
            </div>
          </div>

          {/* Bank */}
          <div className="flex flex-wrap gap-3 mb-8 min-h-[50px] p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-600">
            <AnimatePresence>
              {p1Bank.map(item => (
                <motion.button
                  key={item}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => handleP1BankClick(item)}
                  className="px-4 py-2 bg-white dark:bg-slate-700 border-2 border-teal-200 dark:border-teal-800 rounded-lg shadow-sm hover:border-teal-400 dark:hover:border-teal-500 transition-colors font-medium text-slate-700 dark:text-slate-200"
                >
                  {item}
                </motion.button>
              ))}
              {p1Bank.length === 0 && <span className="text-slate-400 text-sm italic my-auto">Đã chọn hết thẻ</span>}
            </AnimatePresence>
          </div>

          {/* Slots */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 md:gap-0 relative">
            {/* Đường nối background (chỉ hiện trên desktop) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-slate-200 dark:bg-slate-700 -z-10 -translate-y-1/2"></div>
            
            {p1Slots.map((slot, idx) => (
              <React.Fragment key={idx}>
                <div 
                  onClick={() => handleP1SlotClick(idx)}
                  className={clsx(
                    "w-full md:w-32 h-16 flex items-center justify-center rounded-xl border-2 transition-all cursor-pointer bg-white dark:bg-slate-800 z-10",
                    slot ? "border-teal-500 shadow-md" : "border-dashed border-slate-300 dark:border-slate-600 hover:border-teal-300 dark:hover:border-teal-700"
                  )}
                >
                  {slot ? (
                    <span className="font-bold text-teal-700 dark:text-teal-400 text-center text-sm px-2">{slot}</span>
                  ) : (
                    <span className="text-slate-400 text-sm">Bước {idx + 1}</span>
                  )}
                </div>
                {idx < 4 && <ArrowRight className="w-6 h-6 text-slate-300 dark:text-slate-600 md:hidden my-1" />}
              </React.Fragment>
            ))}
          </div>

          {/* Actions & Feedback */}
          <div className="mt-8 flex flex-col items-center gap-4">
            <button 
              onClick={checkP1}
              disabled={p1Slots.includes(null)}
              className="px-8 py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-bold rounded-xl transition-colors shadow-md"
            >
              Kiểm tra
            </button>

            {p1Status === 'correct' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-lg">
                <CheckCircle className="w-5 h-5" /> Chính xác! Quy trình tái chế chuẩn không cần chỉnh.
              </motion.div>
            )}

            {p1Status === 'incorrect' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-3 w-full">
                <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-900/20 px-4 py-2 rounded-lg">
                  <XCircle className="w-5 h-5" /> Chưa đúng thứ tự rồi. Hãy thử lại nhé!
                </div>
                {!p1ShowHint ? (
                  <button onClick={() => setP1ShowHint(true)} className="flex items-center gap-2 text-amber-600 dark:text-amber-400 hover:underline font-medium">
                    <Lightbulb className="w-4 h-4" /> Gợi ý từ chuyên gia
                  </button>
                ) : (
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 rounded-xl text-amber-900 dark:text-amber-100 text-sm max-w-2xl text-center">
                    <strong>💡 Gợi ý:</strong> Quy trình tái chế luôn bắt đầu bằng việc đi <strong>Thu gom</strong> phế liệu, sau đó phải <strong>Phân loại</strong> chúng ra (sắt theo sắt, nhôm theo nhôm) trước khi đem đi <strong>Nghiền, cắt</strong> và <strong>Nung chảy</strong> nhé!
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* Bài 2: Phân loại phương pháp */}
        <div className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h4 className="font-display text-xl font-bold text-blue-700 dark:text-blue-400 mb-2">2. Phân loại phương pháp điều chế</h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Nhấn chọn một chất ở danh sách chờ, sau đó nhấn vào cột phương pháp phù hợp để phân loại.</p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-bold">
              Phân loại
            </div>
          </div>

          {/* Bank */}
          <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-600">
            <h5 className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">Danh sách chờ</h5>
            <div className="flex flex-wrap gap-2 min-h-[40px]">
              <AnimatePresence>
                {p2Bank.map(item => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => handleP2BankClick(item.id)}
                    className={clsx(
                      "px-3 py-1.5 rounded-lg font-mono text-sm font-bold transition-all shadow-sm border-2",
                      p2Selected === item.id 
                        ? "bg-blue-100 dark:bg-blue-900/50 border-blue-500 text-blue-700 dark:text-blue-300 scale-110" 
                        : "bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:border-blue-300"
                    )}
                  >
                    {item.label}
                  </motion.button>
                ))}
                {p2Bank.length === 0 && <span className="text-slate-400 text-sm italic my-auto">Đã phân loại hết</span>}
              </AnimatePresence>
            </div>
          </div>

          {/* Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['nhiet', 'thuy', 'dien'] as Method[]).map(method => {
              const titles = {
                nhiet: { title: 'Nhiệt luyện', color: 'border-rose-200 bg-rose-50 dark:border-rose-900/50 dark:bg-rose-900/10', text: 'text-rose-700 dark:text-rose-400' },
                thuy: { title: 'Thủy luyện', color: 'border-cyan-200 bg-cyan-50 dark:border-cyan-900/50 dark:bg-cyan-900/10', text: 'text-cyan-700 dark:text-cyan-400' },
                dien: { title: 'Điện phân', color: 'border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-900/10', text: 'text-amber-700 dark:text-amber-400' }
              };
              const config = titles[method];

              return (
                <div 
                  key={method}
                  onClick={() => handleP2ColClick(method)}
                  className={clsx(
                    "border-2 rounded-xl p-4 min-h-[200px] transition-all",
                    config.color,
                    p2Selected ? "cursor-pointer hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500" : ""
                  )}
                >
                  <h5 className={clsx("font-display font-bold text-center mb-4 border-b pb-2 border-current opacity-80", config.text)}>
                    {config.title}
                  </h5>
                  <div className="flex flex-col gap-2">
                    <AnimatePresence>
                      {p2Cols[method].map(item => (
                        <motion.button
                          key={item.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          onClick={(e) => { e.stopPropagation(); handleP2ItemRemove(method, item.id); }}
                          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-lg font-mono text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm flex justify-between items-center group"
                        >
                          {item.label}
                          <XCircle className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.button>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Actions & Feedback */}
          <div className="mt-8 flex flex-col items-center gap-4">
            <button 
              onClick={checkP2}
              disabled={p2Bank.length > 0}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-bold rounded-xl transition-colors shadow-md"
            >
              Kiểm tra
            </button>

            {p2Status === 'correct' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-lg">
                <CheckCircle className="w-5 h-5" /> Xuất sắc! Bạn đã nắm vững nguyên tắc điều chế.
              </motion.div>
            )}

            {p2Status === 'incorrect' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-3 w-full">
                <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-900/20 px-4 py-2 rounded-lg">
                  <XCircle className="w-5 h-5" /> Có chất bị xếp nhầm nhà rồi. Hãy kiểm tra lại!
                </div>
                {!p2ShowHint ? (
                  <button onClick={() => setP2ShowHint(true)} className="flex items-center gap-2 text-amber-600 dark:text-amber-400 hover:underline font-medium">
                    <Lightbulb className="w-4 h-4" /> Gợi ý từ chuyên gia
                  </button>
                ) : (
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 rounded-xl text-amber-900 dark:text-amber-100 text-sm max-w-2xl text-center">
                    <strong>💡 Thần chú:</strong><br/>
                    - Kim loại <strong>MẠNH</strong> (K, Na, Ca, Mg, Al) ➔ Điện phân nóng chảy.<br/>
                    - Kim loại <strong>TRUNG BÌNH</strong> (Zn, Fe, Pb, Cu) ➔ Nhiệt luyện.<br/>
                    - Kim loại <strong>YẾU</strong> (Cu, Ag, Au) ➔ Thủy luyện (hoặc Nhiệt luyện).
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* PHẦN B: GIẢI QUYẾT VẤN ĐỀ */}
      <div className="space-y-6 mt-12">
        <div className="flex items-center gap-3 border-b-2 border-rose-500 pb-2">
          <Target className="w-6 h-6 text-rose-600 dark:text-rose-400" />
          <h3 className="font-display text-2xl font-bold text-slate-800 dark:text-slate-100">Phần B: Giải Quyết Vấn Đề</h3>
        </div>

        {/* Bài 3: Hoàn thành phương trình */}
        <div className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h4 className="font-display text-xl font-bold text-rose-700 dark:text-rose-400 mb-2">3. Hoàn thành phương trình hóa học</h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Điền công thức hóa học của chất còn thiếu vào ô trống (không cần ghi hệ số cân bằng).</p>
            </div>
            <div className="bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-3 py-1 rounded-full text-sm font-bold">
              Điền khuyết
            </div>
          </div>

          <div className="space-y-6 max-w-3xl mx-auto">
            {/* Eq 1 */}
            <div className="flex flex-col md:flex-row items-center gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-slate-500 w-8">1.</span>
              <div className="flex flex-wrap items-center justify-center gap-3 font-mono text-lg font-bold text-slate-800 dark:text-slate-200">
                <span>Fe₂O₃</span>
                <span>+</span>
                <input 
                  type="text" 
                  value={p3Eq1.r} 
                  onChange={e => setP3Eq1({...p3Eq1, r: e.target.value})}
                  placeholder="Chất khử" 
                  className="w-24 text-center bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-lg px-2 py-1 focus:border-rose-500 outline-none uppercase" 
                />
                <span className="text-rose-500">→ (t°) →</span>
                <span>Fe</span>
                <span>+</span>
                <input 
                  type="text" 
                  value={p3Eq1.p} 
                  onChange={e => setP3Eq1({...p3Eq1, p: e.target.value})}
                  placeholder="Sản phẩm" 
                  className="w-24 text-center bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-lg px-2 py-1 focus:border-rose-500 outline-none uppercase" 
                />
              </div>
            </div>

            {/* Eq 2 */}
            <div className="flex flex-col md:flex-row items-center gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-slate-500 w-8">2.</span>
              <div className="flex flex-wrap items-center justify-center gap-3 font-mono text-lg font-bold text-slate-800 dark:text-slate-200">
                <span>2Al₂O₃</span>
                <span className="text-amber-500">→ (đpnc) →</span>
                <span>4</span>
                <input 
                  type="text" 
                  value={p3Eq2.r} 
                  onChange={e => setP3Eq2({...p3Eq2, r: e.target.value})}
                  placeholder="Kim loại" 
                  className="w-24 text-center bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-lg px-2 py-1 focus:border-amber-500 outline-none uppercase" 
                />
                <span>+</span>
                <span>3</span>
                <input 
                  type="text" 
                  value={p3Eq2.p} 
                  onChange={e => setP3Eq2({...p3Eq2, p: e.target.value})}
                  placeholder="Khí" 
                  className="w-24 text-center bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-lg px-2 py-1 focus:border-amber-500 outline-none uppercase" 
                />
              </div>
            </div>

            {/* Eq 3 */}
            <div className="flex flex-col md:flex-row items-center gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-slate-500 w-8">3.</span>
              <div className="flex flex-wrap items-center justify-center gap-3 font-mono text-lg font-bold text-slate-800 dark:text-slate-200">
                <span>Fe</span>
                <span>+</span>
                <span>CuSO₄</span>
                <span className="text-cyan-500">→</span>
                <input 
                  type="text" 
                  value={p3Eq3.r} 
                  onChange={e => setP3Eq3({...p3Eq3, r: e.target.value})}
                  placeholder="Muối mới" 
                  className="w-28 text-center bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-lg px-2 py-1 focus:border-cyan-500 outline-none uppercase" 
                />
                <span>+</span>
                <input 
                  type="text" 
                  value={p3Eq3.p} 
                  onChange={e => setP3Eq3({...p3Eq3, p: e.target.value})}
                  placeholder="Kim loại" 
                  className="w-24 text-center bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-lg px-2 py-1 focus:border-cyan-500 outline-none uppercase" 
                />
              </div>
            </div>
          </div>

          {/* Actions & Feedback */}
          <div className="mt-8 flex flex-col items-center gap-4">
            <button 
              onClick={checkP3}
              disabled={!p3Eq1.r || !p3Eq1.p || !p3Eq2.r || !p3Eq2.p || !p3Eq3.r || !p3Eq3.p}
              className="px-8 py-3 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-bold rounded-xl transition-colors shadow-md"
            >
              Kiểm tra
            </button>

            {p3Status === 'correct' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-lg">
                <CheckCircle className="w-5 h-5" /> Quá đỉnh! Bạn viết phương trình chuẩn như SGK.
              </motion.div>
            )}

            {p3Status === 'incorrect' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-3 w-full">
                <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-900/20 px-4 py-2 rounded-lg">
                  <XCircle className="w-5 h-5" /> Có phương trình chưa chính xác. Hãy kiểm tra lại các chất!
                </div>
                {!p3ShowHint ? (
                  <button onClick={() => setP3ShowHint(true)} className="flex items-center gap-2 text-amber-600 dark:text-amber-400 hover:underline font-medium">
                    <Lightbulb className="w-4 h-4" /> Gợi ý từ chuyên gia
                  </button>
                ) : (
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 rounded-xl text-amber-900 dark:text-amber-100 text-sm max-w-2xl text-left space-y-2">
                    <p><strong>💡 Gợi ý:</strong></p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>PT 1 (Nhiệt luyện):</strong> Cần chất khử (như CO, C, H2) để cướp Oxi, tạo ra khí tương ứng (CO2, CO, H2O).</li>
                      <li><strong>PT 2 (Điện phân):</strong> Al2O3 bị dòng điện xé toạc thành kim loại Nhôm (Al) và khí Oxi (O2).</li>
                      <li><strong>PT 3 (Thủy luyện):</strong> Sắt (Fe) mạnh hơn Đồng (Cu) nên đẩy Đồng ra khỏi muối, tạo thành muối Sắt (FeSO4) và kim loại Đồng.</li>
                    </ul>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
