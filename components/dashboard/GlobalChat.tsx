import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, Bot, User, Sparkles, Maximize2, Minimize2 } from 'lucide-react';
import { sendGlobalChatMessage } from '../../services/aiService';
import { AuditReport, ReviewSet } from '../../types';

interface GlobalChatProps {
  reports: AuditReport[];
  reviewSets: ReviewSet[];
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

const GlobalChat: React.FC<GlobalChatProps> = ({ reports, reviewSets }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hello! I am your Vetted AI analyst. I can help you compare vendors, summarize risks, or answer security questions about your active reports.' }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      // Prepare history for API (mapping our internal type to API type)
      const apiHistory = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const responseText = await sendGlobalChatMessage(
        userMsg, 
        apiHistory, 
        { reports, reviewSets }
      );

      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-primary hover:bg-blue-600 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-105 flex items-center justify-center group"
      >
        <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-300 animate-pulse" fill="currentColor" />
        <MessageSquare size={24} />
      </button>
    );
  }

  return (
    <div className={`fixed z-50 bg-white dark:bg-gray-800 shadow-2xl rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden transition-all duration-300 ${isExpanded ? 'top-6 bottom-6 right-6 left-6 md:left-auto md:w-[600px]' : 'bottom-6 right-6 w-[380px] h-[600px] max-h-[80vh]'}`}>
      
      {/* Header */}
      <div className="bg-neutralDark p-4 flex items-center justify-between text-white shrink-0">
        <div className="flex items-center space-x-2">
           <div className="bg-white/10 p-1.5 rounded-lg">
             <Bot size={20} className="text-primary" />
           </div>
           <div>
             <h3 className="font-bold text-sm">Vetted AI Analyst</h3>
             <div className="flex items-center space-x-1">
               <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
               <span className="text-[10px] text-gray-300">Context Active ({reports.length} Reports)</span>
             </div>
           </div>
        </div>
        <div className="flex items-center space-x-1">
          <button onClick={() => setIsExpanded(!isExpanded)} className="p-2 hover:bg-white/10 rounded-lg text-gray-300 hover:text-white transition-colors">
            {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-lg text-gray-300 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
              m.role === 'user' 
                ? 'bg-primary text-white rounded-br-none' 
                : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none shadow-sm'
            }`}>
              {m.role === 'model' && (
                  <div className="flex items-center gap-2 mb-1 opacity-50 text-xs font-bold uppercase tracking-wider">
                      <Bot size={12} /> AI Analyst
                  </div>
              )}
              <div className="whitespace-pre-wrap">{m.text}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl rounded-bl-none p-4 shadow-sm flex items-center space-x-2">
               <Bot size={16} className="text-primary animate-pulse" />
               <div className="flex space-x-1">
                 <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                 <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-100"></div>
                 <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-200"></div>
               </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 shrink-0">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about risks, vendors, or compliance..."
            className="w-full pl-4 pr-12 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm text-neutralDark dark:text-white"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || loading}
            className="absolute right-2 p-2 bg-primary text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>
        <div className="text-center mt-2">
            <p className="text-[10px] text-gray-400">AI can make mistakes. Please verify important information.</p>
        </div>
      </form>
    </div>
  );
};

export default GlobalChat;