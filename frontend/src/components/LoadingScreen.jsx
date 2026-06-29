import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axios.js';

const LoadingScreen = ({ onLoadingComplete }) => {
    const [status, setStatus] = useState('Waking up backend...');
    const [dots, setDots] = useState('');
    const [timeElapsed, setTimeElapsed] = useState(0);

    useEffect(() => {
        let attempts = 0;
        const maxAttempts = 12;
        let dotsInterval;
        let timeInterval;

        dotsInterval = setInterval(() => {
            setDots(prev => prev.length >= 3 ? '' : prev + '.');
        }, 500);

        timeInterval = setInterval(() => {
            setTimeElapsed(prev => prev + 1);
        }, 1000);

        const wakeUpBackend = async () => {
            attempts++;

            try {
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

                setStatus('Server is ready');
                setTimeout(() => {
                    onLoadingComplete();
                }, 1000);

                return true;
            } catch (error) {
                if (attempts >= maxAttempts) {
                    setStatus('Proceeding to app...');
                    setTimeout(() => {
                        onLoadingComplete();
                    }, 2000);
                    return true;
                }

                if (attempts <= 3) {
                    setStatus('Waking up backend...');
                } else if (attempts <= 6) {
                    setStatus('Still waking up, almost there...');
                } else {
                    setStatus('Just a few more seconds...');
                }

                const delay = Math.min(3000 + (attempts * 1000), 8000);
                setTimeout(wakeUpBackend, delay);
                return false;
            }
        };

        wakeUpBackend();

        return () => {
            if (dotsInterval) clearInterval(dotsInterval);
            if (timeInterval) clearInterval(timeInterval);
        };
    }, [onLoadingComplete]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}s`;
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
            <div className="text-center space-y-10 px-6 max-w-2xl">
                <div className="mb-10">
                    <div className="w-24 h-24 mx-auto bg-gray-800 rounded-2xl flex items-center justify-center border border-gray-700">
                        <span className="text-gray-100 font-bold text-3xl">SB</span>
                    </div>
                </div>

                <div className="w-16 h-16 mx-auto mb-8">
                    <div className="w-full h-full border-4 border-gray-700 border-t-gray-400 rounded-full animate-spin"></div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-3xl font-semibold text-gray-100">
                        {status}{dots}
                    </h2>

                    <p className="text-lg text-gray-400 leading-relaxed">
                        The backend server is starting up. This typically takes 30-60 seconds on initial load.
                    </p>

                    <div className="text-base text-gray-500 space-y-3 pt-4">
                        <p>Time elapsed: {formatTime(timeElapsed)}</p>
                        <p className="text-sm">Please wait, do not refresh</p>
                    </div>
                </div>

                <div className="w-full max-w-lg mx-auto pt-6">
                    <div className="w-full bg-gray-800 rounded-full h-1.5">
                        <div
                            className="bg-gray-500 h-1.5 rounded-full transition-all duration-1000"
                            style={{ width: `${Math.min((timeElapsed / 60) * 100, 100)}%` }}
                        ></div>
                    </div>
                </div>

                <div className="mt-10 p-6 bg-gray-900 border border-gray-800 rounded-lg max-w-lg mx-auto">
                    <p className="text-base text-gray-400 leading-relaxed">
                        Free tier services sleep after inactivity. The application will respond normally once the server is active.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;
