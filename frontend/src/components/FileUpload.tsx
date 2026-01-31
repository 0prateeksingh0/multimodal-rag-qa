import React, { useCallback, useState } from 'react';
import { Upload, File, CheckCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadFile } from '../api/client';

interface FileUploadProps {
    onUploadSuccess: (fileId: string) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
    const [fileName, setFileName] = useState('');

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragging(true);
        } else if (e.type === 'dragleave') {
            setIsDragging(false);
        }
    }, []);

    const handleDrop = useCallback(async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            await processUpload(files[0]);
        }
    }, []);

    const processUpload = async (file: File) => {
        setFileName(file.name);
        setStatus('uploading');
        try {
            const data = await uploadFile(file);
            setStatus('success');
            setTimeout(() => onUploadSuccess(data.file_id), 1000);
        } catch (err) {
            setStatus('error');
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`glass p-12 rounded-3xl text-center transition-all duration-300 ${isDragging ? 'scale-105 border-primary ring-2 ring-primary/20' : ''
                    }`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
            >
                <AnimatePresence mode="wait">
                    {status === 'idle' && (
                        <motion.div
                            key="idle"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center"
                        >
                            <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                                <Upload className="text-primary w-10 h-10" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Upload your content</h2>
                            <p className="text-slate-400 mb-8">
                                Drop your PDF, Audio, or Video files here to start the magic
                            </p>
                            <input
                                type="file"
                                className="hidden"
                                id="file-upload"
                                onChange={(e) => e.target.files && processUpload(e.target.files[0])}
                            />
                            <label
                                htmlFor="file-upload"
                                className="px-8 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold cursor-pointer transition-all"
                            >
                                Browse Files
                            </label>
                        </motion.div>
                    )}

                    {status === 'uploading' && (
                        <motion.div
                            key="uploading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center"
                        >
                            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                            <p className="text-xl font-medium">Processing {fileName}...</p>
                            <p className="text-sm text-slate-500 mt-2">Transcribing and indexing content</p>
                        </motion.div>
                    )}

                    {status === 'success' && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center"
                        >
                            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                            <p className="text-xl font-bold">Successfully Uploaded!</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};
