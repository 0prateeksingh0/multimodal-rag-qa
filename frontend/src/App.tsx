import { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { Dashboard } from './components/Dashboard';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

function App() {
  const [fileId, setFileId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] w-[30%] h-[30%] bg-secondary/10 rounded-full blur-[120px]" />
      </div>

      <header className="relative z-10 py-8 px-10 flex items-center justify-between border-b border-white/5 backdrop-blur-md bg-slate-950/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Sparkles className="text-white" size={24} />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            AuraMind AI
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <a href="#" className="hover:text-white transition-colors">Documentation</a>
          <a href="#" className="hover:text-white transition-colors">API Keys</a>
          <button className="px-5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all">
            Settings
          </button>
        </div>
      </header>

      <main className="relative z-10">
        <AnimatePresence mode="wait">
          {!fileId ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="px-6"
            >
              <div className="text-center max-w-3xl mx-auto mt-24 mb-16">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-6"
                >
                  <Sparkles size={14} /> NEW: Whisper v3 Integration
                </motion.div>
                <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
                  Converse with your <span className="gradient-text">Multimedia.</span>
                </h1>
                <p className="text-xl text-slate-400 leading-relaxed">
                  Upload PDF, Video, or Audio. Get instant summaries, topic maps, and answers powered by GPT-4o and Whisper.
                </p>
              </div>
              <FileUpload onUploadSuccess={setFileId} />
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
            >
              <Dashboard fileId={fileId} onBack={() => setFileId(null)} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="relative z-10 mt-40 py-10 border-t border-white/5 text-center text-slate-500 text-sm">
        <p>© 2026 AuraMind AI. SDE-1 Assignment Implementation.</p>
      </footer>
    </div>
  );
}

export default App;
