import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  User
} from 'lucide-react';
import { chatWithAssistant } from '../services/api';

export default function SchemeSaathiChat({ profile, activeScheme, matchedSchemes }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Namaste ${profile?.name || 'Entrepreneur'}! I am **SchemeSaathi**, your guide for discovering government business schemes.\n\nHow can I help you? You can ask me what schemes suit you, what documents are typically required, or where to apply.`,
      source: 'Scheme Knowledge Engine'
    }
  ]);

  const messagesEndRef = useRef(null);

  const sampleChips = [
    "What schemes may suit me?",
    "Why do I match this scheme?",
    "What benefits does this scheme provide?",
    "What documents will I need?",
    "Where do I apply?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (queryText) => {
    const text = (queryText || inputQuery).trim();
    if (!text || isLoading) return;

    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const res = await chatWithAssistant(text, profile, activeScheme?.scheme, matchedSchemes);
      const assistantMsg = {
        role: 'assistant',
        content: res.reply || "I could not retrieve details for that query right now.",
        source: res.source || 'Scheme Knowledge Engine'
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: "Sorry, I am temporarily having trouble reaching the knowledge engine. Please ensure the backend is running.",
          source: 'System Notice'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-gov-navy to-slate-900 text-white p-3.5 sm:p-4 rounded-2xl shadow-2xl hover:shadow-orange-500/20 border border-slate-700 flex items-center gap-3 transition transform hover:scale-105 active:scale-95 group"
        >
          <div className="w-8 h-8 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-inner">
            <Sparkles className="w-4 h-4 text-orange-200" />
          </div>
          <div className="text-left hidden sm:block">
            <span className="font-bold text-xs text-white block">Ask SchemeSaathi</span>
            <span className="text-[10px] text-orange-400">Scheme Discovery Guide</span>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-300 w-[92vw] sm:w-[400px] h-[520px] max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-gov-navy to-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-orange-600 flex items-center justify-center font-black text-sm text-white">
                SS
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">SchemeSaathi</h4>
                <p className="text-[10px] text-slate-300">
                  Govt Scheme Discovery Assistant
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Prompt Chips */}
          <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {sampleChips.map((chip, i) => (
              <button
                key={i}
                onClick={() => handleSend(chip)}
                className="whitespace-nowrap bg-white border border-slate-300 hover:border-orange-500 text-slate-700 hover:text-orange-700 text-[11px] font-medium px-2.5 py-1 rounded-lg shadow-2xs transition flex-shrink-0"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Messages Thread */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                    SS
                  </div>
                )}
                
                <div className={`max-w-[85%] rounded-2xl p-3 leading-relaxed whitespace-pre-line ${
                  m.role === 'user'
                    ? 'bg-gov-navy text-white rounded-tr-none'
                    : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
                }`}>
                  {m.content}
                </div>

                {m.role === 'user' && (
                  <div className="w-6 h-6 rounded-lg bg-slate-700 text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs py-2">
                <div className="w-6 h-6 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center text-[10px]">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                </div>
                <span>Finding information...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask about schemes, eligibility, or where to apply..."
                className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-gov-navy"
              />
              <button
                type="submit"
                disabled={!inputQuery.trim() || isLoading}
                className="p-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white rounded-xl transition shadow active:scale-95 flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      )}

    </div>
  );
}
