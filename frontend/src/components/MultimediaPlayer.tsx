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
    topics: Topic[];
}

export const MultimediaPlayer: React.FC<MultimediaPlayerProps> = ({ fileId, fileType, topics }) => {
    const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement>(null);
    const mediaUrl = `http://localhost:8000/uploads/${fileId}.${fileType}`;

    const seekTo = (time: number) => {
        if (mediaRef.current) {
            mediaRef.current.currentTime = time;
            mediaRef.current.play();
        }
    };

    return (
        <div className="space-y-6">
            <div className="glass rounded-3xl overflow-hidden aspect-video bg-black flex items-center justify-center">
                {fileType === 'pdf' ? (
                    <div className="text-center p-10">
                        <p className="text-slate-400">PDF Viewer would go here</p>
                    </div>
                ) : fileType === 'mp4' || fileType === 'mov' || fileType === 'mkv' ? (
                    <video ref={mediaRef as any} src={mediaUrl} controls className="w-full h-full" />
                ) : (
                    <div className="w-full p-10">
                        <audio ref={mediaRef as any} src={mediaUrl} controls className="w-full" />
                    </div>
                )}
            </div>

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
                    {topics.length === 0 && (
                        <p className="text-sm text-slate-500 col-span-full py-10 text-center">
                            No topics extracted yet or not supported for this file type.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};
