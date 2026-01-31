import React, { useRef } from 'react';
import { Play, Clock } from 'lucide-react';

interface Topic {
    id: number;
    topic: string;
    start_time: number;
    end_time: number;
}

interface MultimediaPlayerProps {
    fileId: string;
    fileType: string;
    filePath: string;
    topics: Topic[];
}

export const MultimediaPlayer: React.FC<MultimediaPlayerProps> = ({ fileType, filePath, topics }) => {

    const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement>(null);
    const mediaUrl = filePath.startsWith('http')
        ? filePath
        : `http://localhost:8000/${filePath}`;


    const seekTo = (time: number) => {
        if (mediaRef.current) {
            mediaRef.current.currentTime = time;
            mediaRef.current.play();
        }
    };

    return (
        <div className="space-y-6">
            <div className="glass rounded-3xl overflow-hidden aspect-video bg-black flex flex-col items-center justify-center">
                {fileType === 'pdf' ? (
                    <div className="w-full h-full flex flex-col">
                        <object
                            data={mediaUrl}
                            type="application/pdf"
                            className="w-full h-full border-none"
                        >
                            <div className="flex flex-col items-center justify-center h-full p-10 text-center">
                                <p className="text-slate-400 mb-4">PDF viewer could not be embedded.</p>
                                <a
                                    href={mediaUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors"
                                >
                                    View Full PDF
                                </a>
                            </div>
                        </object>
                        <div className="py-2 px-4 bg-white/5 border-t border-white/5 flex justify-end">
                            <a
                                href={mediaUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline flex items-center gap-1"
                            >
                                Open in New Tab
                            </a>
                        </div>
                    </div>
                ) : fileType === 'mp4' || fileType === 'mov' || fileType === 'mkv' ? (
                    <video ref={mediaRef as any} src={mediaUrl} controls className="w-full h-full" />
                ) : (
                    <div className="w-full p-10">
                        <audio ref={mediaRef as any} src={mediaUrl} controls className="w-full" />
                    </div>
                )}
            </div>


            {topics.length > 0 && (
                <div className="glass p-6 rounded-3xl">
                    <h4 className="font-bold flex items-center gap-2 mb-4 text-primary">
                        <Clock size={18} /> Extracted Topics
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {topics.map((topic) => (
                            <button
                                key={topic.id}
                                onClick={() => seekTo(topic.start_time)}
                                className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-primary/10 border border-white/5 hover:border-primary/20 transition-all text-left group"
                            >
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                    <Play size={16} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate text-slate-200">{topic.topic}</p>
                                    <p className="text-xs text-slate-500">
                                        {Math.floor(topic.start_time / 60)}:{(topic.start_time % 60).toFixed(0).padStart(2, '0')}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
};
