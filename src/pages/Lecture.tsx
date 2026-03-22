import { motion } from 'motion/react';
import { Mountain, Flame, Droplets, Zap, Recycle, BookOpen, CircleArrowUp, CircleArrowRight, CircleArrowDown, Scale, Hammer, Wind } from 'lucide-react';
import LectureSection from '../components/lecture/LectureSection';
import MiniQuiz from '../components/lecture/MiniQuiz';

export default function Lecture() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 relative"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyber-cyan/10 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="inline-flex items-center justify-center p-4 bg-cyber-black border border-cyber-cyan/50 rounded-none mb-6 shadow-[0_0_15px_rgba(0,240,255,0.2)] relative z-10">
          <BookOpen className="w-10 h-10 text-cyber-cyan" />
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-black mb-4 text-cyber-cyan tracking-widest uppercase glitch-text relative z-10" data-text="DỮ LIỆU LÝ THUYẾT">
          DỮ LIỆU LÝ THUYẾT
        </h1>
        <p className="text-lg text-cyber-light max-w-2xl mx-auto font-mono relative z-10 border-l-2 border-cyber-cyan pl-4 bg-cyber-cyan/5 py-2">
          <span className="text-cyber-cyan mr-2">{'>'}</span> Truy cập hồ sơ: Khai thác, Tinh chế và Tái chế Kim loại trong kỷ nguyên Cyberpunk.
        </p>
      </motion.div>

      {/* MODULE 01: QUẶNG */}
      <LectureSection 
        title="MODULE 01: NGUỒN GỐC KIM LOẠI" 
        icon={Mountain} 
        defaultOpen={true}
        colorClass="text-cyber-yellow"
      >
        <div className="prose prose-lg dark:prose-invert max-w-none font-mono">
          <p className="text-xl font-medium text-cyber-light">
            <span className="text-cyber-yellow mr-2">{'>'}</span> Dữ liệu đầu vào: Kim loại không tự sinh ra. Chúng được trích xuất từ các mỏ quặng sâu dưới lòng đất.
          </p>
          
          <div className="bg-cyber-black p-6 rounded-none my-6 border border-cyber-yellow/50 shadow-[0_0_15px_rgba(252,238,10,0.1)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-cyber-yellow"></div>
            <h3 className="font-display text-cyber-yellow font-bold text-2xl mt-0 mb-2 flex items-center gap-2 uppercase tracking-widest">
              <Mountain className="w-6 h-6" /> ĐỊNH NGHĨA: QUẶNG
            </h3>
            <p className="m-0 text-cyber-light">
              <strong>Quặng</strong> là các khối khoáng sản tự nhiên chứa hàm lượng kim loại (hoặc hợp chất) đủ cao để mang lại lợi nhuận khi khai thác công nghiệp.
            </p>
          </div>

          <p className="text-cyber-cyan uppercase tracking-wider">Danh sách quặng thiết yếu:</p>
          
          <ul className="space-y-4 my-6 list-none pl-0">
            <li className="flex items-start gap-4 bg-cyber-black p-5 rounded-none shadow-[0_0_10px_rgba(0,240,255,0.1)] border border-cyber-cyan/30 hover:border-cyber-cyan transition-colors group relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,240,255,0.05)_50%)] bg-[length:100%_4px] pointer-events-none"></div>
              <div className="w-12 h-12 bg-cyber-cyan/10 border border-cyber-cyan flex items-center justify-center shrink-0 text-2xl relative z-10">🪨</div>
              <div className="relative z-10">
                <strong className="text-cyber-cyan text-lg uppercase tracking-wider">Quặng Bô-xít (Bauxite):</strong> 
                <span className="ml-2 font-mono bg-cyber-cyan/20 border border-cyber-cyan px-2 py-1 text-cyber-light font-bold">Al<sub>2</sub>O<sub>3</sub>.2H<sub>2</sub>O</span>
                <p className="mt-2 text-sm text-cyber-gray leading-relaxed">
                  Nguyên liệu cốt lõi để tổng hợp <strong>Nhôm (Al)</strong>, dùng cho vỏ cyberware và phương tiện bay.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4 bg-cyber-black p-5 rounded-none shadow-[0_0_10px_rgba(255,0,60,0.1)] border border-cyber-magenta/30 hover:border-cyber-magenta transition-colors group relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(255,0,60,0.05)_50%)] bg-[length:100%_4px] pointer-events-none"></div>
              <div className="w-12 h-12 bg-cyber-magenta/10 border border-cyber-magenta flex items-center justify-center shrink-0 text-2xl relative z-10">🧲</div>
              <div className="relative z-10">
                <strong className="text-cyber-magenta text-lg uppercase tracking-wider">Quặng Hê-ma-tit (Hematite):</strong> 
                <span className="ml-2 font-mono bg-cyber-magenta/20 border border-cyber-magenta px-2 py-1 text-cyber-light font-bold">Fe<sub>2</sub>O<sub>3</sub></span>
                <p className="mt-2 text-sm text-cyber-gray leading-relaxed">
                  Nguồn cung cấp <strong>Sắt (Fe)</strong> khổng lồ, nền tảng của mọi cấu trúc hạ tầng Night City.
                </p>
              </div>
            </li>
          </ul>

          <MiniQuiz 
            question="Quặng Bô-xít (Bauxite) là nguyên liệu chính để sản xuất kim loại nào sau đây?"
            options={[
              { id: 'a', text: 'A. Sắt (Fe)', isCorrect: false, explanation: 'Sai rồi! Sắt được sản xuất chủ yếu từ quặng Hematite hoặc Magnetite cơ.' },
              { id: 'b', text: 'B. Nhôm (Al)', isCorrect: true, explanation: 'Chính xác! Bô-xít (Al2O3.2H2O) là nguồn cung cấp Nhôm khổng lồ cho thế giới.' },
              { id: 'c', text: 'C. Đồng (Cu)', isCorrect: false, explanation: 'Chưa đúng! Quặng đồng thường là Chalcopyrite (CuFeS2).' }
            ]}
          />
        </div>
      </LectureSection>

      {/* MODULE 02: TÁCH KIM LOẠI */}
      <LectureSection 
        title="MODULE 02: GIAO THỨC TÁCH KIM LOẠI" 
        icon={Flame}
        colorClass="text-cyber-magenta"
      >
        <div className="prose prose-lg dark:prose-invert max-w-none font-mono">
          <p className="text-xl font-medium text-cyber-light">
            <span className="text-cyber-magenta mr-2">{'>'}</span> Kim loại trong tự nhiên thường liên kết với Oxi. <strong>Tách kim loại</strong> là quá trình bẻ gãy các liên kết này bằng năng lượng cao.
          </p>

          <div className="my-8 p-6 bg-cyber-black rounded-none border border-cyber-cyan/50 shadow-[0_0_15px_rgba(0,240,255,0.1)] relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-cyber-cyan"></div>
            <h4 className="font-display font-bold text-xl mb-4 text-cyber-cyan uppercase tracking-widest">Phân loại theo mức năng lượng:</h4>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex flex-col items-center text-center p-4 bg-cyber-black border border-cyber-magenta/50 hover:border-cyber-magenta transition-colors">
                <CircleArrowUp className="w-10 h-10 text-cyber-magenta mb-2" />
                <strong className="text-cyber-magenta uppercase tracking-wider">Mức Alpha (Mạnh)</strong>
                <span className="text-sm text-cyber-gray mt-1 font-bold">K, Na, Ba, Ca, Mg, Al</span>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-cyber-black border border-cyber-yellow/50 hover:border-cyber-yellow transition-colors">
                <CircleArrowRight className="w-10 h-10 text-cyber-yellow mb-2" />
                <strong className="text-cyber-yellow uppercase tracking-wider">Mức Beta (Trung bình)</strong>
                <span className="text-sm text-cyber-gray mt-1 font-bold">Zn, Fe, Ni, Sn, Pb</span>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-cyber-black border border-cyber-cyan/50 hover:border-cyber-cyan transition-colors">
                <CircleArrowDown className="w-10 h-10 text-cyber-cyan mb-2" />
                <strong className="text-cyber-cyan uppercase tracking-wider">Mức Gamma (Yếu)</strong>
                <span className="text-sm text-cyber-gray mt-1 font-bold">Cu, Hg, Ag, Pt, Au</span>
              </div>
            </div>
          </div>

          <p className="font-display font-bold text-2xl mt-8 text-cyber-light uppercase tracking-widest">3 Giao thức cốt lõi:</p>

          {/* Bí kíp 1 */}
          <div className="mt-6 bg-cyber-black rounded-none p-6 border border-cyber-magenta/50 relative overflow-hidden shadow-[0_0_15px_rgba(255,0,60,0.1)]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-magenta/10 rounded-none -mr-8 -mt-8"></div>
            <h3 className="font-display flex items-center gap-3 text-2xl font-bold text-cyber-magenta mt-0 relative z-10 uppercase tracking-widest">
              <div className="p-2 bg-cyber-magenta/20 border border-cyber-magenta"><Flame className="w-6 h-6" /></div>
              Giao thức 1: Nhiệt luyện
            </h3>
            <p className="relative z-10 text-cyber-light">
              <strong className="text-cyber-magenta">Thực thi:</strong> Dùng nhiệt độ cực cao kết hợp với chất khử (C, CO, H<sub>2</sub>, Al) để bẻ gãy liên kết Oxit.
            </p>
            <p className="relative z-10 text-cyber-light">
              <strong className="text-cyber-magenta">Mục tiêu:</strong> Áp dụng cho kim loại mức <strong className="text-cyber-yellow">Beta</strong> và <strong className="text-cyber-cyan">Gamma</strong>.
            </p>
            <div className="bg-cyber-black p-4 rounded-none font-mono text-center my-4 overflow-x-auto border border-cyber-magenta/30 relative z-10 text-cyber-light">
              <span className="text-cyber-gray mr-2">SYS.LOG:</span> Fe<sub>2</sub>O<sub>3</sub> + 3CO <span className="text-cyber-magenta font-bold">→ (t°) →</span> 2Fe + 3CO<sub>2</sub>
            </div>
          </div>

          {/* Bí kíp 2 */}
          <div className="mt-8 bg-cyber-black rounded-none p-6 border border-cyber-cyan/50 relative overflow-hidden shadow-[0_0_15px_rgba(0,240,255,0.1)]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-cyan/10 rounded-none -mr-8 -mt-8"></div>
            <h3 className="font-display flex items-center gap-3 text-2xl font-bold text-cyber-cyan mt-0 relative z-10 uppercase tracking-widest">
              <div className="p-2 bg-cyber-cyan/20 border border-cyber-cyan"><Droplets className="w-6 h-6" /></div>
              Giao thức 2: Thủy luyện
            </h3>
            <p className="relative z-10 text-cyber-light">
              <strong className="text-cyber-cyan">Thực thi:</strong> Hòa tan quặng thành dung dịch, dùng kim loại mạnh hơn để thế chỗ.
            </p>
            <p className="relative z-10 text-cyber-light">
              <strong className="text-cyber-cyan">Mục tiêu:</strong> Trích xuất các kim loại mức <strong className="text-cyber-cyan">Gamma</strong> (Cu, Ag, Au).
            </p>
            <div className="bg-cyber-black p-4 rounded-none font-mono text-center my-4 overflow-x-auto border border-cyber-cyan/30 relative z-10 text-cyber-light">
              <span className="text-cyber-gray mr-2">SYS.LOG:</span> Fe + CuSO<sub>4</sub> <span className="text-cyber-cyan font-bold">→</span> FeSO<sub>4</sub> + Cu↓
            </div>
          </div>

          {/* Bí kíp 3 */}
          <div className="mt-8 bg-cyber-black rounded-none p-6 border border-cyber-yellow/50 relative overflow-hidden shadow-[0_0_15px_rgba(252,238,10,0.1)]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-yellow/10 rounded-none -mr-8 -mt-8"></div>
            <h3 className="font-display flex items-center gap-3 text-2xl font-bold text-cyber-yellow mt-0 relative z-10 uppercase tracking-widest">
              <div className="p-2 bg-cyber-yellow/20 border border-cyber-yellow"><Zap className="w-6 h-6" /></div>
              Giao thức 3: Điện phân nóng chảy
            </h3>
            <p className="relative z-10 text-cyber-light">
              <strong className="text-cyber-yellow">Thực thi:</strong> Nung chảy quặng và phóng xung điện EMP/DC cực mạnh qua hệ thống.
            </p>
            <p className="relative z-10 text-cyber-light">
              <strong className="text-cyber-yellow">Mục tiêu:</strong> Tuyệt chiêu cuối cho kim loại mức <strong className="text-cyber-magenta">Alpha</strong> (K, Na, Ca, Mg, Al).
            </p>
            <div className="bg-cyber-black p-4 rounded-none font-mono text-center my-4 overflow-x-auto border border-cyber-yellow/30 relative z-10 text-cyber-light">
              <span className="text-cyber-gray mr-2">SYS.LOG:</span> 2Al<sub>2</sub>O<sub>3</sub> <span className="text-cyber-yellow font-bold">→ (EMP) →</span> 4Al + 3O<sub>2</sub>↑
            </div>
          </div>

          <div className="mt-8">
            <MiniQuiz 
              question="Để điều chế Nhôm (Al) từ quặng Bô-xít, người ta BẮT BUỘC phải dùng phương pháp nào?"
              options={[
                { id: 'a', text: 'A. Nhiệt luyện (Dùng CO cướp Oxi)', isCorrect: false, explanation: 'Sai rồi! Nhôm là kim loại rất mạnh, CO không đủ "tuổi" để cướp Oxi của Nhôm đâu.' },
                { id: 'b', text: 'B. Thủy luyện', isCorrect: false, explanation: 'Chưa đúng! Nhôm tác dụng với nước, nên không thể dùng phương pháp dung dịch được.' },
                { id: 'c', text: 'C. Điện phân nóng chảy', isCorrect: true, explanation: 'Chính xác! Nhôm là kim loại mạnh, chỉ có dòng điện cực mạnh (điện phân nóng chảy) mới tách được nó ra khỏi Oxi.' }
              ]}
            />
          </div>
        </div>
      </LectureSection>

      {/* MODULE 03: TÁI CHẾ */}
      <LectureSection 
        title="MODULE 03: GIAO THỨC TÁI CHẾ" 
        icon={Recycle}
        colorClass="text-cyber-cyan"
      >
        <div className="prose prose-lg dark:prose-invert max-w-none font-mono">
          <div className="flex flex-col md:flex-row gap-8 items-center mb-10 bg-cyber-black p-8 rounded-none border border-cyber-cyan/50 shadow-[0_0_20px_rgba(0,240,255,0.15)] relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,240,255,0.05)_50%,transparent_75%)] bg-[length:20px_20px] pointer-events-none"></div>
            <div className="flex-1 relative z-10">
              <p className="text-xl font-medium text-cyber-light leading-relaxed m-0">
                <span className="text-cyber-cyan mr-2">{'>'}</span> Tài nguyên mỏ đang cạn kiệt. Tái chế phế liệu điện tử và kim loại là giao thức sống còn để duy trì Night City.
              </p>
            </div>
            <div className="relative w-40 h-40 shrink-0 flex items-center justify-center">
              {/* Custom Neon Green Cyberpunk Animation */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-2 border-dashed border-[#00ff00] rounded-full opacity-50"
              ></motion.div>
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 border-2 border-[#00ff00] rounded-full opacity-30"
              ></motion.div>
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-4 bg-[#00ff00]/20 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,255,0,0.5)] border border-[#00ff00]"
              >
                <Recycle className="w-16 h-16 text-[#00ff00] drop-shadow-[0_0_10px_rgba(0,255,0,1)]" />
              </motion.div>
            </div>
          </div>

          <h3 className="font-display text-2xl font-bold text-cyber-cyan mb-6 uppercase tracking-widest">Quy trình tái chế 5 bước:</h3>
          
          <div className="grid gap-4 mt-6">
            {[
              { step: 1, title: 'THU GOM', desc: 'Gom phế liệu từ bãi rác công nghiệp.', icon: Scale },
              { step: 2, title: 'PHÂN LOẠI', desc: 'Dùng từ trường mạnh tách sắt thép.', icon: CircleArrowRight },
              { step: 3, title: 'NGHIỀN NÁT', desc: 'Máy nghiền công suất lớn phá hủy cấu trúc.', icon: Hammer },
              { step: 4, title: 'NUNG CHẢY', desc: 'Lò hồ quang điện hóa lỏng phế liệu.', icon: Flame },
              { step: 5, title: 'TINH CHẾ', desc: 'Loại bỏ tạp chất, đúc khuôn linh kiện mới.', icon: Wind }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="flex items-center gap-5 bg-cyber-black p-5 rounded-none border border-cyber-cyan/30 shadow-sm hover:border-cyber-cyan hover:shadow-[0_0_15px_rgba(0,240,255,0.2)] transition-all group relative overflow-hidden">
                  <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,240,255,0.05)_50%)] bg-[length:100%_4px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative w-14 h-14 rounded-none bg-cyber-cyan/10 border border-cyber-cyan text-cyber-cyan flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform z-10">
                    <Icon className="w-7 h-7" />
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-cyber-cyan text-cyber-black rounded-none flex items-center justify-center text-xs font-bold shadow-[0_0_10px_rgba(0,240,255,0.5)]">
                      0{item.step}
                    </div>
                  </div>
                  <div className="relative z-10">
                    <h4 className="font-bold text-lg m-0 text-cyber-light group-hover:text-cyber-cyan transition-colors tracking-wider">{item.title}</h4>
                    <p className="m-0 text-cyber-gray text-sm mt-1">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10">
            <MiniQuiz 
              question="Trong quy trình tái chế, bước nào thường sử dụng nam châm điện khổng lồ?"
              options={[
                { id: 'a', text: 'A. Thu gom', isCorrect: false, explanation: 'Thu gom là đi nhặt phế liệu về, chưa cần dùng nam châm.' },
                { id: 'b', text: 'B. Phân loại', isCorrect: true, explanation: 'Đúng rồi! Nam châm điện được dùng để hút và tách riêng các kim loại có từ tính (như Sắt) ra khỏi đống phế liệu hỗn hợp.' },
                { id: 'c', text: 'C. Nung chảy', isCorrect: false, explanation: 'Nung chảy dùng nhiệt độ cao (lò nung), không dùng nam châm.' }
              ]}
            />
          </div>
        </div>
      </LectureSection>
    </div>
  );
}
