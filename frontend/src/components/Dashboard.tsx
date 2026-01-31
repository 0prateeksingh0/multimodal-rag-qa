import React, { useEffect, useState } from 'react';
import { getSummary, getTopics } from '../api/client';
import { ChatBox } from './ChatBox';
import { MultimediaPlayer } from './MultimediaPlayer';
import { motion } from 'framer-motion';
import { FileText, Sparkles, ArrowLeft } from 'lucide-react';

interface DashboardProps {
    fileId: string;
    onBack: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ fileId, onBack }) => {
    const [data, setData] = useState<any>(null);
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [summaryRes, topicsRes] = await Promise.all([
                    getSummary(fileId),
                    getTopics(fileId)
                ]);
                setData(summaryRes);
                setTopics(topicsRes);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [fileId]);

    if (loading) return (
        <div className="flex items-center justify-center h-screen">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
            />
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-6 py-10">
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
            >
                <ArrowLeft size={20} /> Back to Upload
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-10">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass p-8 rounded-3xl"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                                <FileText size={20} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">{data?.filename}</h1>
                                <p className="text-sm text-slate-500 uppercase tracking-widest">{data?.file_type}</p>
                            </div>
                        </div>

                        <div className="relative p-6 bg-white/5 rounded-2xl border border-white/5">
                            <div className="absolute -top-3 left-6 px-4 py-1 bg-primary text-white text-xs font-bold rounded-full flex items-center gap-2">
                                <Sparkles size={12} /> AI Summary
                            </div>
                            <p className="text-slate-300 leading-relaxed italic">
                                "{data?.summary}"
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <MultimediaPlayer fileId={fileId} fileType={data?.file_type} topics={topics} />
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-1"
                >
                    <ChatBox fileId={fileId} />
                </motion.div>
            </div>
        </div>
    );
};
