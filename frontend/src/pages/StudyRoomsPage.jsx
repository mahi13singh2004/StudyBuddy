import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axios';
import { useAuthStore } from '../store/auth.store';

const StudyRoomsPage = () => {
    const [activeRooms, setActiveRooms] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [roomName, setRoomName] = useState('');
    const [joinRoomId, setJoinRoomId] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuthStore();

    useEffect(() => {
        fetchActiveRooms();
    }, []);

    const fetchActiveRooms = async () => {
        try {
            const response = await axiosInstance.get('/api/study-rooms');
            setActiveRooms(response.data.rooms);
        } catch (error) {
            console.error('Error fetching rooms:', error);
        }
    };

    const createRoom = async () => {
        if (!roomName.trim()) return;

        setLoading(true);
        try {
            const response = await axiosInstance.post('/api/study-rooms/create', {
                roomName: roomName.trim()
            });

            if (response.data.success) {
                navigate(`/study-room/${response.data.room.roomId}`);
            }
        } catch (error) {
            console.error('Error creating room:', error);
            alert('Failed to create room');
        } finally {
            setLoading(false);
        }
    };

    const joinRoom = async (roomId) => {
        setLoading(true);
        try {
            const response = await axiosInstance.post(`/api/study-rooms/join/${roomId}`, {});

            if (response.data.success) {
                navigate(`/study-room/${roomId}`);
            }
        } catch (error) {
            console.error('Error joining room:', error);
            alert('Failed to join room');
        } finally {
            setLoading(false);
        }
    };

    const joinRoomById = () => {
        if (!joinRoomId.trim()) return;
        joinRoom(joinRoomId.trim().toUpperCase());
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-16 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Study Rooms</h1>
                    <p className="text-slate-300">Join collaborative study sessions with AI assistance</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-8">
                    <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-slate-700">
                        <h3 className="text-lg font-semibold mb-4 text-white">Create New Room</h3>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            + Create Study Room
                        </button>
                    </div>

                    <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-slate-700">
                        <h3 className="text-lg font-semibold mb-4 text-white">Join by Room ID</h3>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Enter Room ID (e.g., ABC123)"
                                value={joinRoomId}
                                onChange={(e) => setJoinRoomId(e.target.value.toUpperCase())}
                                className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-400"
                                maxLength={6}
                            />
                            <button
                                onClick={joinRoomById}
                                disabled={loading || !joinRoomId.trim()}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                            >
                                Join
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-slate-700">
                    <div className="p-6 border-b border-slate-700">
                        <h2 className="text-xl font-semibold text-white">Active Study Rooms</h2>
                    </div>

                    <div className="p-6">
                        {activeRooms.length === 0 ? (
                            <div className="text-center py-8 text-slate-400">
                                <div className="text-4xl mb-4">📚</div>
                                <p>No active study rooms right now</p>
                                <p className="text-sm">Create one to get started!</p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {activeRooms.map((room) => (
                                    <div key={room.roomId} className="border border-slate-600 rounded-lg p-4 hover:bg-slate-700/50 transition-colors">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h3 className="font-semibold text-lg text-white">{room.roomName}</h3>
                                                <p className="text-slate-300 text-sm">
                                                    Room ID: {room.roomId} • {room.participantCount} participant{room.participantCount !== 1 ? 's' : ''}
                                                </p>
                                                <p className="text-slate-400 text-xs">
                                                    Created {new Date(room.createdAt).toLocaleString()}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => joinRoom(room.roomId)}
                                                disabled={loading}
                                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                                            >
                                                Join Room
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {showCreateModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-slate-800 p-6 rounded-lg w-full max-w-md border border-slate-700">
                            <h3 className="text-lg font-semibold mb-4 text-white">Create Study Room</h3>
                            <input
                                type="text"
                                placeholder="Enter room name"
                                value={roomName}
                                onChange={(e) => setRoomName(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 text-white placeholder-slate-400"
                                maxLength={50}
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        setShowCreateModal(false);
                                        setRoomName('');
                                    }}
                                    className="flex-1 px-4 py-2 border border-slate-600 rounded-lg hover:bg-slate-700 transition-colors text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={createRoom}
                                    disabled={loading || !roomName.trim()}
                                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                                >
                                    {loading ? 'Creating...' : 'Create'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudyRoomsPage;