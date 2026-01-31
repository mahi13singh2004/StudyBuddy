import StudyRoom from "../models/studyRoom.model.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const handleSocketConnection = (io) => {
    io.on('connection', (socket) => {
       

        // Join a study room
        socket.on('join-room', async (data) => {
            const { roomId, userId, username } = data;

            

            try {
                const room = await StudyRoom.findOne({ roomId, isActive: true });
                if (!room) {
                    socket.emit('error', { message: 'Room not found' });
                    return;
                }

                socket.join(roomId);
                socket.userId = userId;
                socket.username = username;
                socket.roomId = roomId;

                // Notify others that user joined
                socket.to(roomId).emit('user-joined', {
                    userId,
                    username,
                    message: `${username} joined the study room`
                });

              
            } catch (error) {
                console.error('Error joining room:', error);
                socket.emit('error', { message: 'Failed to join room' });
            }
        });

        // Handle chat messages
        socket.on('send-message', async (data) => {
            const { roomId, message, userId, username } = data;

            

            if (!username) {
                socket.emit('error', { message: 'Username is required' });
                return;
            }

            try {
                const room = await StudyRoom.findOne({ roomId, isActive: true });
                if (!room) {
                    socket.emit('error', { message: 'Room not found' });
                    return;
                }

                // Save message to database
                const newMessage = {
                    userId,
                    username,
                    message,
                    isAI: false,
                    timestamp: new Date()
                };

                room.messages.push(newMessage);
                await room.save();

                // Broadcast message to all users in the room
                io.to(roomId).emit('new-message', newMessage);

                // Check if message is asking AI for help
                const messageText = message.toLowerCase();
                if (messageText.includes('@ai') || messageText.includes('ai help') || messageText.startsWith('ai ')) {
               
                    setTimeout(async () => {
                        try {
                            
                            const aiResponse = await generateAIResponse(message, room.messages);
                            
                            const aiMessage = {
                                userId: 'ai-tutor',
                                username: 'AI Tutor',
                                message: aiResponse,
                                isAI: true,
                                timestamp: new Date()
                            };

                            room.messages.push(aiMessage);
                            await room.save();

                            io.to(roomId).emit('new-message', aiMessage);
                            
                        } catch (error) {
                            console.error('AI response error:', error);
                            // Send error message to user
                            const errorMessage = {
                                userId: 'ai-tutor',
                                username: 'AI Tutor',
                                message: "Sorry, I'm having trouble right now. Please try again!",
                                isAI: true,
                                timestamp: new Date()
                            };
                            io.to(roomId).emit('new-message', errorMessage);
                        }
                    }, 1000);
                }
            } catch (error) {
                console.error('Error sending message:', error);
                socket.emit('error', { message: 'Failed to send message' });
            }
        });

        // Handle user leaving room
        socket.on('leave-room', () => {
            if (socket.roomId && socket.username) {
                socket.to(socket.roomId).emit('user-left', {
                    username: socket.username,
                    message: `${socket.username} left the study room`
                });
            }
        });

        // Handle disconnect
        socket.on('disconnect', () => {
            if (socket.roomId && socket.username) {
                socket.to(socket.roomId).emit('user-left', {
                    username: socket.username,
                    message: `${socket.username} disconnected`
                });
            }
            
        });
    });
};

const generateAIResponse = async (userMessage, chatHistory) => {
    try {
       

        // Simple test response first
        if (userMessage.toLowerCase().includes('test')) {
            return "Hello! I'm your AI tutor and I'm working perfectly! 🤖 How can I help you study today?";
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const recentMessages = chatHistory.slice(-10).map(msg =>
            `${msg.username}: ${msg.message}`
        ).join('\n');

        const prompt = `You are an AI tutor in a collaborative study room. Students are studying together and need your help.

Recent conversation:
${recentMessages}

Current question: ${userMessage}

Please provide a helpful, encouraging response that:
1. Answers their question clearly
2. Encourages collaborative learning
3. Asks follow-up questions to deepen understanding
4. Keeps the response concise (2-3 sentences max)

Response:`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const responseText = response.text();
       
        return responseText;
    } catch (error) {
        console.error('AI generation error:', error);
        return "I'm having trouble processing that right now. Can you try rephrasing your question?";
    }
};