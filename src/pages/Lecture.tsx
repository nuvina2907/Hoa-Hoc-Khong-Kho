import { motion } from 'motion/react';
import { Mountain, Flame, Droplets, Zap, Recycle, BookOpen } from 'lucide-react';
import LectureSection from '../components/lecture/LectureSection';
import MiniQuiz from '../components/lecture/MiniQuiz';

export default function Lecture() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center justify-center p-3 bg-teal-100 dark:bg-teal-900/30 rounded-2xl mb-4">
          <BookOpen className="w-8 h-8 text-teal-600 dark:text-teal-400" />
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-extrabold mb-4 text-slate-800 dark:text-slate-100">
          Bí Kíp Nguyên Tố
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Hành trình biến những cục đá vô tri thành kim loại lấp lánh và giải cứu Trái Đất.
        </p>
      </motion.div>

      {/* PHẦN 1: QUẶNG */}
      <LectureSection 
        title="Phần 1: Kim loại đến từ đâu? (Dễ như ăn kẹo)" 
        icon={Mountain} 
        defaultOpen={true}
        colorClass="text-amber-600 dark:text-amber-400"
      >
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-xl font-medium text-slate-700 dark:text-slate-300">
            Bạn có bao giờ tự hỏi sắt, nhôm, đồng... lấy từ đâu ra không? Chúng không mọc trên cây đâu!
          </p>
          
          <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-2xl my-6 border border-amber-200 dark:border-amber-800/50">
            <h3 className="font-display text-amber-800 dark:text-amber-300 font-bold text-2xl mt-0 mb-2">🏔️ Quặng là gì?</h3>
            <p className="m-0 text-amber-900 dark:text-amber-100">
              Hiểu đơn giản: <strong>Quặng</strong> chính là những cục <strong>đất đá</strong> có chứa rất nhiều kim loại (hoặc hợp chất của kim loại). Vì nó chứa nhiều kim loại nên người ta mới cất công đào lên để lấy kim loại đem bán!
            </p>
          </div>

          <p>Dưới đây là một số loại quặng siêu phổ biến mà bạn cần nhớ tên (như nhớ tên crush vậy):</p>
          
          <ul className="space-y-4 my-6 list-none pl-0">
            <li className="flex items-start gap-3 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
              <span className="text-2xl">🪨</span>
              <div>
                <strong className="text-teal-700 dark:text-teal-400 text-lg">Quặng Bô-xít (Bauxite):</strong> 
                <span className="ml-2 font-mono bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded text-rose-600 dark:text-rose-400">Al<sub>2</sub>O<sub>3</sub>.2H<sub>2</sub>O</span>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  Dùng để sản xuất <strong>Nhôm (Al)</strong>. Công thức này nghĩa là cứ 1 phân tử Nhôm Oxit thì có 2 phân tử Nước bám theo.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
              <span className="text-2xl">🧲</span>
              <div>
                <strong className="text-teal-700 dark:text-teal-400 text-lg">Quặng Hê-ma-tit (Hematite):</strong> 
                <span className="ml-2 font-mono bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded text-rose-600 dark:text-rose-400">Fe<sub>2</sub>O<sub>3</sub></span>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  Dùng để sản xuất <strong>Sắt (Fe)</strong>. Đây chính là thành phần làm cho đất có màu đỏ gạch đấy!
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

      {/* PHẦN 2: TÁCH KIM LOẠI */}
      <LectureSection 
        title="Phần 2: Bí kíp tách kim loại (Không còn là ảo thuật!)" 
        icon={Flame}
        colorClass="text-rose-500 dark:text-rose-400"
      >
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-xl font-medium text-slate-700 dark:text-slate-300">
            Kim loại trong tự nhiên rất nhút nhát, chúng thường "ôm chặt" lấy Oxi (tạo thành Oxit) hoặc các nguyên tố khác. 
            <strong>Tách kim loại</strong> chính là quá trình chúng ta "bắt" kim loại phải tách ra đứng một mình!
          </p>

          <p className="font-display font-bold text-2xl mt-8 text-teal-700 dark:text-teal-400">Có 3 bí kíp chính để làm việc này:</p>

          {/* Bí kíp 1 */}
          <div className="mt-6 border-l-4 border-rose-500 pl-6 py-2">
            <h3 className="font-display flex items-center gap-2 text-2xl font-bold text-rose-600 dark:text-rose-400 mt-0">
              <Flame className="w-6 h-6" /> Bí kíp 1: Nhiệt luyện (Dùng lửa "nướng" quặng)
            </h3>
            <p>
              <strong>Cách làm:</strong> Dùng nhiệt độ cực cao kết hợp với các "sát thủ cướp Oxi" (gọi là chất khử) như <strong>C, CO, H<sub>2</sub></strong> hoặc <strong>Al</strong>.
            </p>
            <p>
              <strong>Mục tiêu:</strong> Các chất khử này sẽ lao vào cướp lấy Oxi của oxit kim loại, để lại kim loại đứng bơ vơ một mình. Phương pháp này chuyên dùng cho các kim loại có độ hoạt động <strong>trung bình và yếu</strong> (như Zn, Fe, Sn, Pb, Cu).
            </p>
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl font-mono text-center my-4 overflow-x-auto">
              <span className="text-slate-500">Ví dụ:</span> Fe<sub>2</sub>O<sub>3</sub> + 3CO <span className="text-rose-500">→ (t°) →</span> 2Fe + 3CO<sub>2</sub>
            </div>
            <p className="text-sm text-slate-500 italic">Giải thích: Khí CO đã cướp Oxi của Fe2O3 để biến thành CO2, bỏ lại Sắt (Fe) nguyên chất.</p>
          </div>

          {/* Bí kíp 2 */}
          <div className="mt-10 border-l-4 border-blue-500 pl-6 py-2">
            <h3 className="font-display flex items-center gap-2 text-2xl font-bold text-blue-600 dark:text-blue-400 mt-0">
              <Droplets className="w-6 h-6" /> Bí kíp 2: Thủy luyện (Dùng "nước thần")
            </h3>
            <p>
              <strong>Cách làm:</strong> Đầu tiên, hòa tan quặng vào một dung dịch (như axit). Sau đó, dùng một kim loại <strong>mạnh hơn</strong> ném vào dung dịch đó.
            </p>
            <p>
              <strong>Mục tiêu:</strong> Theo quy luật giang hồ, kẻ mạnh sẽ "đẩy" kẻ yếu ra khỏi dung dịch. Phương pháp này dùng để điều chế các kim loại <strong>yếu</strong> (như Cu, Ag, Au).
            </p>
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl font-mono text-center my-4 overflow-x-auto">
              <span className="text-slate-500">Ví dụ:</span> Fe + CuSO<sub>4</sub> <span className="text-blue-500">→</span> FeSO<sub>4</sub> + Cu↓
            </div>
            <p className="text-sm text-slate-500 italic">Giải thích: Sắt (Fe) mạnh hơn Đồng (Cu), nên Sắt đã nhảy vào dung dịch chiếm chỗ, đẩy Đồng rớt ra ngoài (kết tủa).</p>
          </div>

          {/* Bí kíp 3 */}
          <div className="mt-10 border-l-4 border-amber-500 pl-6 py-2">
            <h3 className="font-display flex items-center gap-2 text-2xl font-bold text-amber-600 dark:text-amber-400 mt-0">
              <Zap className="w-6 h-6" /> Bí kíp 3: Điện phân nóng chảy (Dùng "sét" đánh)
            </h3>
            <p>
              <strong>Cách làm:</strong> Nung chảy quặng ở nhiệt độ khổng lồ, sau đó cắm 2 điện cực vào và phóng dòng điện một chiều cực mạnh qua.
            </p>
            <p>
              <strong>Mục tiêu:</strong> Dòng điện sẽ bẻ gãy mọi liên kết hóa học. Đây là "tuyệt chiêu cuối" dành riêng cho các kim loại <strong>cực kỳ mạnh</strong> (như K, Na, Ca, Mg, Al) - những kẻ mà Nhiệt luyện hay Thủy luyện đều bó tay.
            </p>
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl font-mono text-center my-4 overflow-x-auto">
              <span className="text-slate-500">Ví dụ:</span> 2Al<sub>2</sub>O<sub>3</sub> <span className="text-amber-500">→ (điện phân nóng chảy) →</span> 4Al + 3O<sub>2</sub>↑
            </div>
            <p className="text-sm text-slate-500 italic">Giải thích: Dòng điện xé toạc Nhôm oxit, giải phóng Nhôm (Al) ở cực âm và khí Oxi (O2) bay lên ở cực dương.</p>
          </div>

          <MiniQuiz 
            question="Để điều chế Nhôm (Al) từ quặng Bô-xít, người ta BẮT BUỘC phải dùng phương pháp nào?"
            options={[
              { id: 'a', text: 'A. Nhiệt luyện (Dùng CO cướp Oxi)', isCorrect: false, explanation: 'Sai rồi! Nhôm là kim loại rất mạnh, CO không đủ "tuổi" để cướp Oxi của Nhôm đâu.' },
              { id: 'b', text: 'B. Thủy luyện', isCorrect: false, explanation: 'Chưa đúng! Nhôm tác dụng với nước, nên không thể dùng phương pháp dung dịch được.' },
              { id: 'c', text: 'C. Điện phân nóng chảy', isCorrect: true, explanation: 'Chính xác! Nhôm là kim loại mạnh, chỉ có dòng điện cực mạnh (điện phân nóng chảy) mới tách được nó ra khỏi Oxi.' }
            ]}
          />
        </div>
      </LectureSection>

      {/* PHẦN 3: TÁI CHẾ */}
      <LectureSection 
        title="Phần 3: Tái chế kim loại - Anh hùng bảo vệ Trái Đất" 
        icon={Recycle}
        colorClass="text-emerald-500 dark:text-emerald-400"
      >
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <div className="flex flex-col md:flex-row gap-6 items-center mb-8">
            <div className="flex-1">
              <p className="text-xl font-medium text-slate-700 dark:text-slate-300">
                Đào quặng mãi rồi cũng hết. Tái chế kim loại (như vỏ lon bò húc, sắt vụn...) không chỉ giúp <strong>tiết kiệm tài nguyên</strong> mà còn <strong>giảm ô nhiễm môi trường</strong> và tiết kiệm năng lượng cực lớn!
              </p>
            </div>
            <div className="w-32 h-32 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center shrink-0">
              <Recycle className="w-16 h-16 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>

          <h3 className="font-display text-3xl font-bold text-emerald-700 dark:text-emerald-400">Quy trình tái chế 5 bước (Dễ nhớ):</h3>
          
          <div className="grid gap-4 mt-6">
            {[
              { step: 1, title: 'Thu gom', desc: 'Gom phế liệu kim loại từ bãi rác, nhà máy.' },
              { step: 2, title: 'Phân loại', desc: 'Tách riêng sắt, nhôm, đồng... (thường dùng nam châm khổng lồ để hút sắt).' },
              { step: 3, title: 'Nghiền, cắt', desc: 'Cắt nhỏ phế liệu ra để dễ nấu chảy.' },
              { step: 4, title: 'Nung chảy', desc: 'Cho vào lò nung nhiệt độ cao biến thành chất lỏng.' },
              { step: 5, title: 'Tinh chế & Đúc', desc: 'Loại bỏ tạp chất và đổ vào khuôn tạo thành sản phẩm mới.' }
            ].map((item) => (
              <div key={item.step} className="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-lg shrink-0">
                  {item.step}
                </div>
                <div>
                  <h4 className="font-bold text-lg m-0 text-slate-800 dark:text-slate-200">{item.title}</h4>
                  <p className="m-0 text-slate-600 dark:text-slate-400 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <MiniQuiz 
            question="Trong quy trình tái chế, bước nào thường sử dụng nam châm điện khổng lồ?"
            options={[
              { id: 'a', text: 'A. Thu gom', isCorrect: false, explanation: 'Thu gom là đi nhặt phế liệu về, chưa cần dùng nam châm.' },
              { id: 'b', text: 'B. Phân loại', isCorrect: true, explanation: 'Đúng rồi! Nam châm điện được dùng để hút và tách riêng các kim loại có từ tính (như Sắt) ra khỏi đống phế liệu hỗn hợp.' },
              { id: 'c', text: 'C. Nung chảy', isCorrect: false, explanation: 'Nung chảy dùng nhiệt độ cao (lò nung), không dùng nam châm.' }
            ]}
          />
        </div>
      </LectureSection>
    </div>
  );
}
