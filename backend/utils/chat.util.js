import { GoogleGenerativeAI } from "@google/generative-ai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "models/gemini-3.1-flash-lite" });

const chatHistories = new Map();
const vectorStores = new Map(); // Store text chunks per PDF (simple approach)

const ChatUtil = {
  // Simple text chunking without vector embeddings (to avoid dependency issues)
  initializePDFVectorStore: async (pdfId, pdfText) => {
    try {
      // Check if already initialized
      if (vectorStores.has(pdfId)) {
        return;
      }

      // STEP 1: Split text into chunks using LangChain
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000, // Characters per chunk
        chunkOverlap: 200, // Overlap for context continuity
      });

      const docs = await textSplitter.createDocuments([pdfText]);
      const chunks = docs.map(doc => doc.pageContent);

      // STEP 2: Store chunks (simple text search instead of vector search)
      vectorStores.set(pdfId, chunks);
      console.log(`✅ Text chunks created for PDF ${pdfId}: ${chunks.length} chunks`);
    } catch (error) {
      console.error("Error initializing text chunks:", error);
      throw error;
    }
  },

  chatWithHistory: async ({ pdfId, userId, pdfText, userMessage }) => {
    try {
      const chatKey = `${pdfId}-${userId}`;
      let chatHistory = chatHistories.get(chatKey) || [];
      chatHistory.push({ role: "user", content: userMessage });

      // STEP 3: Get relevant chunks using simple keyword matching
      let contextText = pdfText; // Fallback to full text

      if (!vectorStores.has(pdfId)) {
        await ChatUtil.initializePDFVectorStore(pdfId, pdfText);
      }

      const chunks = vectorStores.get(pdfId);
      if (chunks && chunks.length > 0) {
        // Simple relevance scoring based on keyword overlap
        const queryWords = userMessage.toLowerCase().split(' ').filter(word => word.length > 3);

        const scoredChunks = chunks.map(chunk => {
          const chunkLower = chunk.toLowerCase();
          const score = queryWords.reduce((acc, word) => {
            return acc + (chunkLower.includes(word) ? 1 : 0);
          }, 0);
          return { chunk, score };
        });

        // Get top 3 most relevant chunks
        const relevantChunks = scoredChunks
          .sort((a, b) => b.score - a.score)
          .slice(0, 3)
          .map(item => item.chunk);

        if (relevantChunks.length > 0) {
          contextText = relevantChunks.join("\n\n");
          console.log(`📄 Retrieved ${relevantChunks.length} relevant chunks for query`);
        }
      }

      // STEP 4: Build context-aware prompt
      const recentHistory = chatHistory.slice(-4).map(msg =>
        `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
      ).join('\n');

      const contextPrompt = `You are an AI assistant helping users understand a PDF document.

RELEVANT CONTENT FROM PDF:
${contextText}

RECENT CONVERSATION:
${recentHistory}

CURRENT QUESTION: ${userMessage}

Instructions:
- Answer based on the relevant PDF content above and conversation history
- Keep responses concise and well-formatted
- Use bullet points or numbered lists when appropriate
- If the answer isn't in the provided content, say so clearly
- Be direct and avoid verbose explanations

Provide a clear, concise response:`;

      const result = await model.generateContent(contextPrompt);
      const aiResponse = result.response;
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

  clearVectorStore: (pdfId) => {
    vectorStores.delete(pdfId);
  },

  getChatHistory: (pdfId, userId) => {
    const chatKey = `${pdfId}-${userId}`;
    return chatHistories.get(chatKey) || [];
  },
};

export default ChatUtil;