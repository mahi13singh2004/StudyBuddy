import { GoogleGenerativeAI } from "@google/generative-ai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "models/gemini-3.1-flash-lite" });

const chatHistories = new Map();
const vectorStores = new Map(); 

const ChatUtil = {
  initializePDFVectorStore: async (pdfId, pdfText) => {
    try {
      if (vectorStores.has(pdfId)) {
        return;
      }

      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000, 
        chunkOverlap: 200,  continuity
      });
      const chunks = await textSplitter.createDocuments([pdfText]);


      const embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GEMINI_API_KEY,
        modelName: "embedding-001",
      });


      const vectorStore = await MemoryVectorStore.fromDocuments(
        chunks,
        embeddings
      );

      vectorStores.set(pdfId, vectorStore);
      console.log(`✅ Vector store initialized for PDF ${pdfId} with ${chunks.length} chunks`);
    } catch (error) {
      console.error("Error initializing vector store:", error);
      throw error;
    }
  },

  chatWithHistory: async ({ pdfId, userId, pdfText, userMessage }) => {
    try {
      const chatKey = `${pdfId}-${userId}`;
      let chatHistory = chatHistories.get(chatKey) || [];
      chatHistory.push({ role: "user", content: userMessage });

     
      let contextText = pdfText; 

      if (!vectorStores.has(pdfId)) {
        await ChatUtil.initializePDFVectorStore(pdfId, pdfText);
      }

      const vectorStore = vectorStores.get(pdfId);
      if (vectorStore) {
    
        const relevantDocs = await vectorStore.similaritySearch(userMessage, 3);
        contextText = relevantDocs.map(doc => doc.pageContent).join("\n\n");
        console.log(`📄 Retrieved ${relevantDocs.length} relevant chunks for query`);
      }

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

  clearVectorStore: (pdfId) => {
    vectorStores.delete(pdfId);
  },

  getChatHistory: (pdfId, userId) => {
    const chatKey = `${pdfId}-${userId}`;
    return chatHistories.get(chatKey) || [];
  },
};

export default ChatUtil;
