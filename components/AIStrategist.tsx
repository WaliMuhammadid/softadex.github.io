
import React, { useState, useRef, useEffect } from 'react';
import { getAIStrategyResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

const AIStrategist: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Welcome to the Nebula Lab. I am your AI Strategy Consultant. How can I help you navigate the Web3 landscape today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    const response = await getAIStrategyResponse(input);
    setMessages(prev => [...prev, response]);
    setIsLoading(false);
  };

  return (
    <section className="py-16 bg-mesh" id="lab">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10 text-center">
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4 uppercase">Neural Strategy Lab</h2>
            <p className="text-gray-400 text-sm">Consult with our AI engine powered by Gemini for real-time market insights and strategy.</p>
          </div>
          <div className="glass rounded-3xl border border-white/10 overflow-hidden flex flex-col h-[500px] shadow-2xl">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                <span className="font-heading font-bold text-xs tracking-widest uppercase">AI Strategic Core</span>
              </div>
              <span className="text-[9px] text-gray-500 uppercase tracking-widest">v2.5 // Status: Synced</span>
            </div>
            <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-4 scroll-smooth">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-5 py-3 rounded-2xl ${
                    msg.role === 'user' ? 'bg-purple-600 text-white rounded-tr-none' : 'glass border border-white/10 text-gray-200 rounded-tl-none'
                  }`}>
                    <p className="text-xs md:text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    {msg.sources && (
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <p className="text-[9px] font-bold uppercase text-gray-500 mb-2">Verified Sources:</p>
                        <div className="flex flex-wrap gap-2">
                          {msg.sources.map((src, idx) => (
                            <a key={idx} href={src.uri} target="_blank" rel="noopener noreferrer" className="text-[9px] bg-white/10 hover:bg-white/20 px-2 py-1 rounded transition-colors text-blue-400 truncate max-w-[180px]">{src.title}</a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="glass border border-white/10 px-5 py-3 rounded-2xl rounded-tl-none flex gap-2">
                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-white/10 bg-black/40">
              <div className="relative flex items-center">
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} placeholder="Ask about DAO governance, NFT utility, or Web3 trends..." className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-3 focus:outline-none focus:border-purple-500 transition-colors text-xs" />
                <button onClick={handleSend} disabled={isLoading} className="absolute right-2 p-2 bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default AIStrategist;
