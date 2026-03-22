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

const SYSTEM_INSTRUCTION = `Bạn là "Phù thủy hóa học" - một gia sư thân thiện, hài hước, chuyên giúp đỡ các học sinh mất gốc môn Hóa học.
Nhiệm vụ chính của bạn là giải đáp các thắc mắc về Bài 15: Quặng, Tách kim loại và Tái chế kim loại.
Hãy giải thích mọi thứ thật đơn giản, dễ hiểu, dùng nhiều ví dụ thực tế.
Nếu học sinh hỏi các vấn đề ngoài lề quá xa, hãy khéo léo và hài hước dẫn dắt họ quay lại chủ đề kim loại.`;

const SUGGESTIONS = [
  "Tại sao vỏ lon bia lại làm từ nhôm mà không phải sắt?",
  "Làm sao để nhớ được công thức quặng Bauxite?",
  "Nếu không có điện phân nóng chảy, ta có tách được Natri không?"
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
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform"
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
            className="fixed bottom-6 right-6 z-50 w-[380px] h-[600px] max-h-[80vh] max-w-[calc(100vw-3rem)] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-700"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-600 to-cyan-500 p-4 flex items-center justify-between text-white shadow-md z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg leading-tight">Phù thủy Hóa học</h3>
                  <p className="text-teal-100 text-xs flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Trợ lý AI thông minh
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Message List */}
            <div className="flex-1 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-900/50 scroll-smooth">
              {messages.length === 0 && (
                <div className="text-center mb-6 mt-4">
                  <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Bot className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                  </div>
                  <h4 className="font-display font-bold text-slate-800 dark:text-slate-200 mb-2">Xin chào chiến binh!</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                    Ta là Phù thủy Hóa học. Con có thắc mắc gì về Quặng hay Tách kim loại không?
                  </p>
                  
                  {/* Gợi ý câu hỏi */}
                  <div className="space-y-2 text-left">
                    {SUGGESTIONS.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(suggestion)}
                        className="w-full text-left p-3 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-teal-400 dark:hover:border-teal-500 hover:shadow-sm transition-all text-slate-700 dark:text-slate-300"
                      >
                        {suggestion}
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
                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1",
                      msg.role === 'user' ? "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400" : "bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400"
                    )}>
                      {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div className={clsx(
                      "p-3 rounded-2xl text-sm",
                      msg.role === 'user' 
                        ? "bg-blue-600 text-white rounded-tr-sm" 
                        : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-sm shadow-sm"
                    )}>
                      {msg.role === 'user' ? (
                        msg.text
                      ) : (
                        <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-ul:my-1">
                          <Markdown>{msg.text}</Markdown>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isLoading && (
                  <div className="flex gap-3 max-w-[85%]">
                    <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 mt-1">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1">
                      <motion.div className="w-2 h-2 bg-teal-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} />
                      <motion.div className="w-2 h-2 bg-teal-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} />
                      <motion.div className="w-2 h-2 bg-teal-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Hỏi Phù thủy hóa học..."
                  className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 dark:text-slate-200"
                  disabled={isLoading}
                />
                <button
                  onClick={() => handleSend(input)}
                  disabled={!input.trim() || isLoading}
                  className="w-12 h-12 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 rounded-full flex items-center justify-center text-white transition-colors shrink-0"
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
