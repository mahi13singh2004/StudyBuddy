import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "models/gemini-2.0-flash" });

const chatHistories = new Map();

const ChatUtil = {
  chatWithHistory: async ({ pdfId, userId, pdfText, userMessage }) => {
    try {
      const chatKey = `${pdfId}-${userId}`;

      let chatHistory = chatHistories.get(chatKey) || [];

      chatHistory.push({ role: "user", content: userMessage });

      const contextPrompt = `
You are an AI assistant helping users understand and discuss a PDF document. 
Here is the PDF content:

${pdfText}

Instructions:
- Answer the user's question based the PDF content above and use your own knowledge
- Keep responses concise and well-formatted
- Use bullet points, numbered lists, or clear paragraphs
- If the question cannot be answered from the PDF try to form answers
- Be direct and to the point
- Avoid overly verbose explanations

User's question: ${userMessage}

Provide a clear, concise, and well-formatted response based on the PDF content.
`;

      const result = await model.generateContent(contextPrompt);
      const aiResponse = await result.response;
      const aiMessage = aiResponse.text().trim();

      chatHistory.push({ role: "assistant", content: aiMessage });


      chatHistories.set(chatKey, chatHistory);

      return aiMessage;
    } catch (error) {
      console.error("Chat with PDF Error:", error);
      throw new Error("Failed to generate AI response");
    }
  },

  clearChatHistory: (pdfId, userId) => {
    const chatKey = `${pdfId}-${userId}`;
    chatHistories.delete(chatKey);
  },

  getChatHistory: (pdfId, userId) => {
    const chatKey = `${pdfId}-${userId}`;
    return chatHistories.get(chatKey) || [];
  },
};

export default ChatUtil;
