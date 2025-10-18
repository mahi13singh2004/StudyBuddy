import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axios.js";
import { useAuthStore } from "../store/auth.store.js";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

const ProfilePage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuthStore();

    const fetchStats = async () => {
        try {
            const res = await axiosInstance.get(`/api/stats`);
            setStats(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center pt-16">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-500 mx-auto mb-3 sm:mb-4"></div>
                    <p className="text-slate-300 text-sm sm:text-base">Loading your profile...</p>
                </div>
            </div>
        );
    }

    const statCards = [
        {
            title: "Notes Created",
            value: stats?.notesCount || 0,
            icon: "📝",
            color: "from-blue-500 to-blue-600",
            bgColor: "bg-blue-500/10",
            borderColor: "border-blue-500/20"
        },
        {
            title: "PDFs Uploaded",
            value: stats?.pdfCount || 0,
            icon: "📄",
            color: "from-green-500 to-green-600",
            bgColor: "bg-green-500/10",
            borderColor: "border-green-500/20"
        },
        {
            title: "AI Queries",
            value: stats?.aiQueries || 0,
            icon: "🤖",
            color: "from-purple-500 to-purple-600",
            bgColor: "bg-purple-500/10",
            borderColor: "border-purple-500/20"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
                    <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-lg sm:text-2xl">
                                {user.name?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div className="text-center sm:text-left">
                            <h1 className="text-2xl sm:text-3xl font-bold text-white">{user.name}</h1>
                            <p className="text-slate-400 text-sm sm:text-base">{user.email}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    {statCards.map((stat, index) => (
                        <div
                            key={index}
                            className={`${stat.bgColor} ${stat.borderColor} border rounded-xl p-4 sm:p-6 backdrop-blur-sm`}
                        >
                            <div className="flex items-center justify-between mb-3 sm:mb-4">
                                <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                                    <span className="text-xl sm:text-2xl">{stat.icon}</span>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
                                    <div className="text-slate-400 text-xs sm:text-sm">{stat.title}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2">
                        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center">
                            <span className="mr-2 sm:mr-3">📊</span>
                            Study Activity
                        </h2>
                        <div className="text-slate-400 text-xs sm:text-sm">Last 30 Days</div>
                    </div>

                    {stats?.chartData && stats.chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={stats.chartData}>
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                                />
                                <YAxis
                                    allowDecimals={false}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1e293b',
                                        border: '1px solid #475569',
                                        borderRadius: '8px',
                                        color: '#f1f5f9'
                                    }}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="notes"
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                    name="Notes"
                                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="pdfs"
                                    stroke="#10b981"
                                    strokeWidth={2}
                                    name="PDFs"
                                    dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="text-center py-8 sm:py-12">
                            <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">📈</div>
                            <p className="text-slate-400 text-sm sm:text-base">No activity data available yet</p>
                            <p className="text-slate-500 text-xs sm:text-sm">Start creating notes and uploading PDFs to see your activity!</p>
                        </div>
                    )}
                </div>

                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center">
                        <span className="mr-2 sm:mr-3">🎯</span>
                        Study Goals
                    </h3>
                    <div className="space-y-2 sm:space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-300 text-sm sm:text-base">Notes this week</span>
                            <span className="text-blue-400 font-semibold text-sm sm:text-base">0/10</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-1.5 sm:h-2">
                            <div className="bg-blue-500 h-1.5 sm:h-2 rounded-full" style={{ width: '0%' }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
