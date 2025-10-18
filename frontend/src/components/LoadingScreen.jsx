import React, { useEffect } from 'react';
import axiosInstance from '../utils/axios.js';
import Spinner from './Spinner.jsx';

const LoadingScreen = ({ onLoadingComplete }) => {
    useEffect(() => {
        const wakeUpBackend = async () => {
            try {
                await axiosInstance.get('/api/auth/checkAuth');
            } catch (error) {
                console.log('Backend wake-up request failed:', error);
            }
        };

        const timer = setTimeout(() => {
            onLoadingComplete();
        }, 60000);

        wakeUpBackend();

        return () => clearTimeout(timer);
    }, [onLoadingComplete]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
            <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <Spinner size="lg" color="white" />
                </div>
                <h1 className="text-4xl font-bold text-white mb-2">
                    Study<span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">Buddy</span>
                </h1>
                <p className="text-slate-400 text-lg">Loading your study environment...</p>
            </div>
        </div>
    );
};

export default LoadingScreen;
