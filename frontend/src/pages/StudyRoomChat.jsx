import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import axiosInstance from '../utils/axios';
import { useAuthStore } from '../store/auth.store';

const StudyRoomChat = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [roomDetails, setRoomDetails] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!user || !user._id) {
            console.log('User not loaded yet:', user);
            return;
        }

        // Initialize socket connection
        const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
            withCredentials: true
        });

        setSocket(newSocket);

        // Join the room
        newSocket.emit('join-room', {
            roomId,
            userId: user._id,
            username: user.name || user.email || 'Anonymous'
        });

        // Listen for messages
        newSocket.on('new-message', (message) => {
            setMessages(prev => [...prev, message]);
        });

        // Listen for user events
        newSocket.on('user-joined', (data) => {
            setMessages(prev => [...prev, {
                _id: Date.now(),
                username: 'System',
                message: data.message,
                isAI: false,
                timestamp: new Date(),
                isSystem: true
            }]);
        });

        newSocket.on('user-left', (data) => {
            setMessages(prev => [...prev, {
                _id: Date.now(),
                username: 'System',
                message: data.message,
                isAI: false,
                timestamp: new Date(),
                isSystem: true
            }]);
        });

        newSocket.on('error', (error) => {
            console.error('Socket error:', error);
            alert(error.message);
        });

        // Fetch room details
        fetchRoomDetails();

        return () => {
            newSocket.emit('leave-room');
            newSocket.close();
        };
    }, [roomId, user]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchRoomDetails = async () => {
        try {
            const response = await axiosInstance.get(`/api/study-rooms/${roomId}`);

            if (response.data.success) {
                setRoomDetails(response.data.room);
                setMessages(response.data.room.messages || []);
                setParticipants(response.data.room.participants || []);
            }
        } catch (error) {
            console.error('Error fetching room details:', error);
            alert('Room not found');
            navigate('/study-rooms');
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = () => {
        if (!newMessage.trim() || !socket) return;

        socket.emit('send-message', {
            roomId,
            message: newMessage.trim(),
            userId: user._id,
            username: user.name || user.email || 'Anonymous'
        });

        setNewMessage('');
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-white">Joining study room...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-16">
            {/* Header */}
            <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 px-6 py-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-semibold text-white">{roomDetails?.roomName}</h1>
                        <p className="text-slate-300 text-sm">Room ID: {roomId} • {participants.length} participants</p>
                    </div>
                    <button
                        onClick={() => navigate('/study-rooms')}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Leave Room
                    </button>
                </div>
            </div>

            <div className="flex h-[calc(100vh-80px)]">
                {/* Participants Sidebar */}
                <div className="w-64 bg-slate-800/50 backdrop-blur-sm border-r border-slate-700 p-4">
                    <h3 className="font-semibold mb-4 text-white">Participants ({participants.length})</h3>
                    <div className="space-y-2">
                        {participants.map((participant) => (
                            <div key={participant.userId} className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-sm text-slate-300">{participant.username}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 p-4 bg-blue-900/30 rounded-lg border border-blue-800/50">
                        <h4 className="font-semibold text-sm mb-2 text-blue-300">💡 AI Help</h4>
                        <p className="text-xs text-slate-400">
                            Try these commands:
                        </p>
                        <ul className="text-xs text-slate-400 mt-1 space-y-1">
                            <li>• "@ai test" - Test AI response</li>
                            <li>• "@ai help with math" - Get study help</li>
                            <li>• "ai explain photosynthesis" - Ask questions</li>
                        </ul>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col">
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((message, index) => (
                            <div key={message._id || index} className={`flex ${message.isSystem ? 'justify-center' :
                                message.userId === user._id ? 'justify-end' : 'justify-start'
                                }`}>
                                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.isSystem ? 'bg-slate-700 text-slate-300 text-sm' :
                                    message.isAI ? 'bg-purple-900/50 border border-purple-700 text-white' :
                                        message.userId === user._id ? 'bg-blue-600 text-white' : 'bg-slate-700 border border-slate-600 text-white'
                                    }`}>
                                    {!message.isSystem && (
                                        <div className="text-xs opacity-75 mb-1">
                                            {message.isAI ? '🤖 AI Tutor' : message.username}
                                        </div>
                                    )}
                                    <div className="text-sm">{message.message}</div>
                                    <div className="text-xs opacity-50 mt-1">
                                        {new Date(message.timestamp).toLocaleTimeString()}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Message Input */}
                    <div className="border-t border-slate-700 bg-slate-800/50 backdrop-blur-sm p-4">
                        <div className="flex space-x-2">
                            <textarea
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your message... (Use @ai for AI help)"
                                className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-white placeholder-slate-400"
                                rows="2"
                            />
                            <button
                                onClick={sendMessage}
                                disabled={!newMessage.trim()}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudyRoomChat;