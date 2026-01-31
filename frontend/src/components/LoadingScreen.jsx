import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axios.js';
import Spinner from './Spinner.jsx';

const LoadingScreen = ({ onLoadingComplete }) => {
    const [status, setStatus] = useState('Initializing...');
    const [progress, setProgress] = useState(0);
    const [dots, setDots] = useState('');

    useEffect(() => {
        let attempts = 0;
        const maxAttempts = 12;
        let progressInterval;
        let dotsInterval;

        dotsInterval = setInterval(() => {
            setDots(prev => prev.length >= 3 ? '' : prev + '.');
        }, 500);

        const wakeUpBackend = async () => {
            attempts++;

            try {
                setStatus(`Waking up server${dots}`);
                setProgress((attempts / maxAttempts) * 100);

    
                let response;
                try {
                    response = await axiosInstance.get('/api/health', {
                        timeout: 5000 
                    });
                } catch (healthError) {
                    response = await axiosInstance.get('/api/auth/checkAuth', {
                        timeout: 8000 
                    });
                }

                setStatus('Server is ready!');
                setProgress(100);

                setTimeout(() => {
                    onLoadingComplete();
                }, 1000);

                return true;
            } catch (error) {
                

                if (attempts >= maxAttempts) {
                    setStatus('Proceeding to app...');
                    setProgress(100);
                    setTimeout(() => {
                        onLoadingComplete();
                    }, 2000);
                    return true;
                }

                if (attempts <= 3) {
                    setStatus(`Starting server${dots}`);
                } else if (attempts <= 6) {
                    setStatus(`Server warming up${dots}`);
                } else if (attempts <= 9) {
                    setStatus(`Almost ready${dots}`);
                } else {
                    setStatus(`Final checks${dots}`);
                }

                const delay = Math.min(3000 + (attempts * 1000), 8000);
                setTimeout(wakeUpBackend, delay);
                return false;
            }
        };

        wakeUpBackend();

        return () => {
            if (progressInterval) clearInterval(progressInterval);
            if (dotsInterval) clearInterval(dotsInterval);
        };
    }, [onLoadingComplete, dots]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
            <div className="text-center max-w-md mx-auto px-6">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                    <span className="text-white font-bold text-2xl">SB</span>
                </div>

                <h1 className="text-4xl font-bold text-white mb-2">
                    Study<span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">Buddy</span>
                </h1>

                <p className="text-slate-300 text-lg mb-6 min-h-[28px]">{status}</p>

                <div className="w-full bg-slate-700 rounded-full h-2 mb-6 overflow-hidden">
                    <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>

                <div className="mb-6">
                    <Spinner size="lg" color="blue" className="mx-auto" />
                </div>

                <div className="text-slate-400 text-sm space-y-2">
                    <p>🚀 Preparing your study environment</p>
                    <p className="text-xs">This may take up to 60 seconds on first load</p>
                </div>

                <div className="mt-8 text-slate-500 text-xs">
                    {progress < 25 && "☕ Server is having its morning coffee..."}
                    {progress >= 25 && progress < 50 && "📚 Loading your study materials..."}
                    {progress >= 50 && progress < 75 && "🤖 AI is getting ready to help..."}
                    {progress >= 75 && progress < 100 && "✨ Almost there, just a moment..."}
                    {progress >= 100 && "🎉 Ready to study smarter!"}
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;
