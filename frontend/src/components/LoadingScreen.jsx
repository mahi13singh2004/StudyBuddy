import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axios.js';

const LoadingScreen = ({ onLoadingComplete }) => {
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('Initializing...');

    useEffect(() => {
        const wakeUpBackend = async () => {
            try {
                setStatus('Waking up backend...');
                await axiosInstance.get('/api/auth/checkAuth');
                setStatus('Backend is ready!');
            } catch (error) {
                console.log('Backend wake-up request failed:', error);
                setStatus('Backend connection established');
            }
        };

        const loadingInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(loadingInterval);
                    setTimeout(() => {
                        onLoadingComplete();
                    }, 500);
                    return 100;
                }
                return prev + 1;
            });
        }, 60);

        wakeUpBackend();

        return () => clearInterval(loadingInterval);
    }, [onLoadingComplete]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
            <div className="text-center max-w-md mx-auto px-6">
                <div className="mb-8">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center animate-pulse">
                        <span className="text-white font-bold text-2xl">SB</span>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2">
                        Study<span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">Buddy</span>
                    </h1>
                    <p className="text-slate-400 text-lg">Your intelligent study companion</p>
                </div>

                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-300 text-sm">{status}</span>
                        <span className="text-slate-400 text-sm">{progress}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>

                <div className="flex justify-center space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>

                <p className="text-slate-500 text-sm mt-6">
                    Preparing your study environment...
                </p>
            </div>
        </div>
    );
};

export default LoadingScreen;
