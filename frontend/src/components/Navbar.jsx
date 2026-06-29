import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store.js';
import logo from '../assets/logo.png';
import Spinner from './Spinner.jsx';

const Navbar = () => {
    const navigate = useNavigate();
    const { user, logout, loading } = useAuthStore();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const dropdownRef = useRef(null);

    const features = [
        {
            icon: "📝",
            title: "Smart Notes",
            description: "Organize your study materials",
            link: "/notes",
            color: "hover:bg-green-50 hover:text-green-600"
        },
        {
            icon: "🤖",
            title: "AI Assistant",
            description: "Transform notes into flashcards",
            link: "/ai",
            color: "hover:bg-green-50 hover:text-green-600"
        },
        {
            icon: "📄",
            title: "PDF Chat",
            description: "Chat with your PDF documents",
            link: "/chat",
            color: "hover:bg-green-50 hover:text-green-600"
        },
        {
            icon: "👥",
            title: "Study Rooms",
            description: "Collaborate with AI assistance",
            link: "/study-rooms",
            color: "hover:bg-indigo-50 hover:text-indigo-600"
        },
        {
            icon: "📊",
            title: "Analytics",
            description: "Track your study progress",
            link: "/profile",
            color: "hover:bg-orange-50 hover:text-orange-600"
        }
    ];

    const handleLogout = async () => {
        setIsLoggingOut(true);
        await logout();
        setTimeout(() => {
            navigate('/login');
            setIsLoggingOut(false);
        }, 300);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
            {isLoggingOut && (
                <div className="fixed inset-0 z-[9999] bg-[#0a0a0a] flex items-center justify-center">
                    <div className="text-center max-w-md mx-auto px-6">
                        <img
                            src={logo}
                            alt="StudyBuddy"
                            className="h-20 mx-auto mb-6"
                            onError={(e) => {
                                e.target.style.display = 'none';
                            }}
                        />

                        <h1 className="text-4xl font-bold text-white mb-2">
                            Study<span className="text-green-500">Buddy</span>
                        </h1>

                        <p className="text-slate-300 text-lg mb-6">Logging you out...</p>

                        <div className="mb-6 flex justify-center">
                            <Spinner size="lg" color="green" />
                        </div>

                        <div className="text-slate-400 text-sm">
                            <p className="animate-pulse">● Signing out securely</p>
                        </div>
                    </div>
                </div>
            )}
            <nav className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 fixed top-0 left-0 right-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <Link to="/" className="flex items-center space-x-2 sm:space-x-3 hover:opacity-80 transition-opacity">
                            <img src={logo} alt="StudyBuddy" className="h-8 sm:h-10" />
                            <h1 className="text-lg sm:text-2xl font-bold text-white">StudyBuddy</h1>
                        </Link>

                        <div className="hidden md:flex items-center space-x-4">
                            {user ? (
                                <>
                                    <div className="relative z-[60]" ref={dropdownRef}>
                                        <button
                                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                            className="px-3 py-2 sm:px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
                                        >
                                            <span>⚡</span>
                                            <span className="hidden sm:inline">Features</span>
                                            <span className={`transform transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}>
                                                ▼
                                            </span>
                                        </button>

                                        {isDropdownOpen && (
                                            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-slate-800/95 backdrop-blur-sm rounded-xl shadow-2xl border border-slate-600 py-2 z-[70] animate-in slide-in-from-top-2 duration-200">
                                                <div className="px-4 py-2 border-b border-slate-600">
                                                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Study Features</h3>
                                                </div>
                                                {features.map((feature, index) => (
                                                    <Link
                                                        key={index}
                                                        to={feature.link}
                                                        onClick={() => setIsDropdownOpen(false)}
                                                        className="block px-4 py-3 text-slate-200 hover:bg-slate-700/50 transition-colors duration-150"
                                                    >
                                                        <div className="flex items-center space-x-3">
                                                            <span className="text-2xl">{feature.icon}</span>
                                                            <div>
                                                                <div className="font-medium text-white">{feature.title}</div>
                                                                <div className="text-sm text-slate-400">{feature.description}</div>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <Link
                                        to="/profile"
                                        className="px-3 py-2 sm:px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex items-center space-x-2"
                                    >
                                        <span>👤</span>
                                        <span className="hidden sm:inline">Profile</span>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="px-3 py-2 sm:px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                                    >
                                        <span>🚪</span>
                                        <span className="hidden sm:inline">Logout</span>
                                    </button>
                                </>
                            ) : (
                                <Link
                                    to="/login"
                                    className="px-3 py-2 sm:px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                                >
                                    <span>🔑</span>
                                    <span className="hidden sm:inline">Login</span>
                                </Link>
                            )}
                        </div>

                        <div className="md:hidden">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="p-2 text-white hover:bg-slate-700 rounded-lg transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {isMobileMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>

                    {isMobileMenuOpen && (
                        <div className="md:hidden border-t border-slate-700 py-4 relative z-[60]">
                            {user ? (
                                <div className="space-y-3">
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide px-2">Features</h3>
                                        {features.map((feature, index) => (
                                            <Link
                                                key={index}
                                                to={feature.link}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="block px-4 py-3 bg-slate-800/50 rounded-lg text-white hover:bg-slate-700/50 transition-colors"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <span className="text-xl">{feature.icon}</span>
                                                    <div>
                                                        <div className="font-medium">{feature.title}</div>
                                                        <div className="text-sm text-slate-400">{feature.description}</div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                    <div className="border-t border-slate-700 pt-3 space-y-2">
                                        <Link
                                            to="/profile"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="block px-4 py-3 bg-slate-700 rounded-lg text-white hover:bg-slate-600 transition-colors"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <span>👤</span>
                                                <span>Profile</span>
                                            </div>
                                        </Link>
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className="w-full px-4 py-3 bg-red-600 rounded-lg text-white hover:bg-red-700 transition-colors text-left"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <span>🚪</span>
                                                <span>Logout</span>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <Link
                                    to="/login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block px-4 py-3 bg-green-600 rounded-lg text-white hover:bg-green-700 transition-colors"
                                >
                                    <div className="flex items-center space-x-3">
                                        <span>🔑</span>
                                        <span>Login</span>
                                    </div>
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </nav>
        </>
    );
};

export default Navbar;
