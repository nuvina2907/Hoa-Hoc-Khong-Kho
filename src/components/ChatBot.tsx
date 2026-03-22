import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import Markdown from 'react-markdown';
import clsx from 'clsx';

// Khởi tạo Gemini AI SDK. 
// Lưu ý: Trong môi trường AI Studio, API Key đã được tự động tiêm vào process.env.GEMINI_API_KEY
// Bạn không cần (và không nên) điền thủ công API Key vào đây để đảm bảo bảo mật.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `Bạn là "Netrunner Hóa học" - một AI hỗ trợ chiến thuật chuyên về vật liệu và hóa học trong thế giới Cyberpunk.
Nhiệm vụ chính của bạn là giải đáp các thắc mắc về Bài 15: Quặng, Tách kim loại và Tái chế kim loại.
Hãy giải thích mọi thứ thật đơn giản, dễ hiểu, dùng nhiều ví dụ thực tế liên quan đến công nghệ tương lai, cấy ghép cyberware, hoặc vũ khí.
Nếu người dùng hỏi các vấn đề ngoài lề quá xa, hãy khéo léo và ngầu lòi dẫn dắt họ quay lại chủ đề kim loại.`;

const SUGGESTIONS = [
  "Tại sao cyberware thường dùng hợp kim Titan?",
  "Làm sao để tách kim loại từ phế liệu điện tử ở bãi rác Night City?",
  "Điện phân nóng chảy có thể dùng để chế tạo vũ khí EMP không?"
];

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<any>(null);

  // Cuộn xuống tin nhắn mới nhất
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Khởi tạo phiên chat với Gemini
  useEffect(() => {
    chatRef.current = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });
  }, []);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const newUserMsg: Message = { id: Date.now().toString(), role: 'user', text };
    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Gửi tin nhắn tới Gemini API
      const response = await chatRef.current.sendMessage({ message: text });
      
      const newAiMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'ai', 
        text: response.text || "Xin lỗi, ta không thể trả lời lúc này." 
      };
      setMessages(prev => [...prev, newAiMsg]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMsg: Message = { 
        id: Date.now().toString(), 
        role: 'ai', 
        text: "Xin lỗi, phép thuật của ta đang bị nhiễu sóng. Con thử lại sau nhé!" 
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend(input);
    }
  };

  return (
    <>
      {/* Nút mở Chatbot */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: isOpen ? 0 : 1 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-cyber-yellow rounded-none shadow-[0_0_15px_rgba(252,238,10,0.5)] flex items-center justify-center text-cyber-black hover:scale-110 transition-transform border-2 border-cyber-yellow"
      >
        <MessageCircle className="w-7 h-7" />
      </motion.button>

      {/* Khung Chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] h-[600px] max-h-[80vh] max-w-[calc(100vw-3rem)] bg-cyber-black rounded-none shadow-[0_0_30px_rgba(0,240,255,0.2)] flex flex-col overflow-hidden border border-cyber-cyan"
          >
            {/* Header */}
            <div className="bg-cyber-black border-b border-cyber-cyan p-4 flex items-center justify-between text-cyber-cyan shadow-md z-10 relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,240,255,0.1)_50%,transparent_75%)] bg-[length:20px_20px] opacity-20"></div>
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 bg-cyber-cyan/20 rounded-none border border-cyber-cyan flex items-center justify-center backdrop-blur-sm">
                  <Bot className="w-6 h-6 text-cyber-cyan" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg leading-tight text-cyber-cyan glitch-text" data-text="NETRUNNER HÓA HỌC">NETRUNNER HÓA HỌC</h3>
                  <p className="text-cyber-cyan/70 text-xs flex items-center gap-1 font-mono uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" /> AI LINK ACTIVE
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-cyber-cyan/20 rounded-none transition-colors relative z-10 text-cyber-cyan"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Message List */}
            <div className="flex-1 overflow-y-auto p-4 bg-cyber-black/90 scroll-smooth font-mono text-sm">
              {messages.length === 0 && (
                <div className="text-center mb-6 mt-4">
                  <div className="w-16 h-16 bg-cyber-cyan/10 border border-cyber-cyan rounded-none flex items-center justify-center mx-auto mb-3 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                    <Bot className="w-8 h-8 text-cyber-cyan" />
                  </div>
                  <h4 className="font-display font-bold text-cyber-cyan mb-2 text-xl uppercase tracking-widest">Kết nối thành công</h4>
                  <p className="text-xs text-cyber-gray mb-6 uppercase tracking-wider">
                    &gt; Nhập truy vấn về Quặng &amp; Tách kim loại...
                  </p>
                  
                  {/* Gợi ý câu hỏi */}
                  <div className="space-y-2 text-left">
                    {SUGGESTIONS.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(suggestion)}
                        className="w-full text-left p-3 text-xs bg-cyber-black border border-cyber-cyan/30 rounded-none hover:border-cyber-cyan hover:bg-cyber-cyan/10 hover:shadow-[0_0_10px_rgba(0,240,255,0.2)] transition-all text-cyber-light"
                      >
                        <span className="text-cyber-yellow mr-2">{'>'}</span> {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={clsx(
                      "flex gap-3 max-w-[85%]",
                      msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                    )}
                  >
                    <div className={clsx(
                      "w-8 h-8 rounded-none border flex items-center justify-center shrink-0 mt-1",
                      msg.role === 'user' ? "bg-cyber-yellow/20 border-cyber-yellow text-cyber-yellow" : "bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan"
                    )}>
                      {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div className={clsx(
                      "p-3 rounded-none text-sm border",
                      msg.role === 'user' 
                        ? "bg-cyber-yellow/10 border-cyber-yellow text-cyber-yellow" 
                        : "bg-cyber-cyan/10 border-cyber-cyan text-cyber-light shadow-[0_0_10px_rgba(0,240,255,0.1)]"
                    )}>
                      {msg.role === 'user' ? (
                        msg.text
                      ) : (
                        <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-a:text-cyber-yellow">
                          <Markdown>{msg.text}</Markdown>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isLoading && (
                  <div className="flex gap-3 max-w-[85%]">
                    <div className="w-8 h-8 rounded-none border bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan flex items-center justify-center shrink-0 mt-1">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="p-4 bg-cyber-cyan/10 border border-cyber-cyan rounded-none shadow-[0_0_10px_rgba(0,240,255,0.1)] flex items-center gap-1">
                      <motion.div className="w-2 h-2 bg-cyber-cyan rounded-none" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0 }} />
                      <motion.div className="w-2 h-2 bg-cyber-cyan rounded-none" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }} />
                      <motion.div className="w-2 h-2 bg-cyber-cyan rounded-none" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 bg-cyber-black border-t border-cyber-cyan relative">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyber-cyan to-transparent"></div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="> NHẬP LỆNH..."
                  className="flex-1 bg-cyber-black border border-cyber-cyan/50 rounded-none px-4 py-3 text-sm font-mono focus:outline-none focus:border-cyber-cyan focus:shadow-[0_0_10px_rgba(0,240,255,0.3)] text-cyber-light uppercase tracking-wider placeholder-cyber-cyan/50"
                  disabled={isLoading}
                />
                <button
                  onClick={() => handleSend(input)}
                  disabled={!input.trim() || isLoading}
                  className="w-12 h-12 bg-cyber-cyan hover:bg-cyber-cyan/80 disabled:bg-cyber-gray/50 border border-cyber-cyan disabled:border-cyber-gray/50 rounded-none flex items-center justify-center text-cyber-black transition-colors shrink-0"
                >
                  <Send className="w-5 h-5 ml-1" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
