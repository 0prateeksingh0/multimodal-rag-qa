import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { chatWithFile } from '../api/client';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface ChatBoxProps {
    fileId: string;
}

export const ChatBox: React.FC<ChatBoxProps> = ({ fileId }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsLoading(true);

        try {
            const data = await chatWithFile(fileId, userMsg);
            setMessages(prev => [...prev, { role: 'assistant', content: data.answer }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error processing your request." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[600px] glass rounded-3xl overflow-hidden">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h3 className="font-bold flex items-center gap-2">
                    <Bot className="text-primary" /> AI Assistant
                </h3>
                <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20">
                    PDF & Multimedia Context
                </span>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
                <AnimatePresence initial={false}>
                    {messages.map((msg, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-primary' : 'bg-slate-700'
                                    }`}>
                                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                                </div>
                                <div className={`p-4 rounded-2xl ${msg.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-white/5 text-slate-200 rounded-tl-none'
                                    }`}>
                                    <p className="text-sm leading-relaxed">{msg.content}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    {isLoading && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                                    <Bot size={16} />
                                </div>
                                <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none">
                                    <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="p-6 bg-white/5">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask anything about the file..."
                        className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-6 pr-14 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-primary text-white rounded-xl hover:bg-primary/90 disabled:opacity-50 transition-all"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};
