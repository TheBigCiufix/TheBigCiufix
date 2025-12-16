import React, { useState, useRef, useEffect } from 'react';
import { askTheSage } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Send, Bot, Sparkles, Loader2 } from 'lucide-react';

const OracleChat: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Bella regà. Sono il Saggio del Faellino. Chiedetemi regole di Magic, idee per la cena chimica o che gioco fare alla Play.'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const responseText = await askTheSage(userMsg.text);
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[500px] w-full bg-faella-800 rounded-xl overflow-hidden border border-faella-700 shadow-xl">
      {/* Header */}
      <div className="p-4 bg-faella-900 border-b border-faella-700 flex items-center gap-3">
        <div className="bg-purple-600 p-2 rounded-full">
          <Sparkles className="text-white w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-white">Oracolo di Faella</h3>
          <p className="text-xs text-gray-400">Powered by Gemini AI</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] rounded-2xl p-3 px-4 ${
              msg.role === 'user' 
                ? 'bg-faella-green text-faella-900 font-medium rounded-tr-none' 
                : 'bg-faella-700 text-gray-200 rounded-tl-none'
            }`}>
              {msg.role === 'model' && <Bot className="w-4 h-4 mb-1 text-purple-400" />}
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-faella-700 rounded-2xl rounded-tl-none p-3 flex items-center gap-2 text-gray-400 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Il Saggio sta pensando...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-faella-900 border-t border-faella-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Chiedi qualcosa..."
            className="flex-1 bg-faella-800 border border-faella-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-faella-green transition-all"
          />
          <button 
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-faella-green hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-faella-900 rounded-lg p-3 transition-colors font-bold"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OracleChat;