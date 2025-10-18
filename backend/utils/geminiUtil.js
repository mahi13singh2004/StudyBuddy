import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY is missing in .env");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "models/gemini-2.0-flash" });

function buildPrompt(action, content) {
  switch (action) {
    case "summarize":
      return `Summarize the following notes in a clear, concise way:\n\n${content}`;
    case "flashcards":
      return `Generate Q&A flashcards from the following notes. Format them as:
Q: ...
A: ...
Q: ...
A: ...\n\n${content}`;
    case "questions":
      return `Generate 5 exam-style questions with answers from the following notes:\n\n${content}`;
    default:
      throw new Error("Invalid AI action");
  }
}

const GeminiUtil = {
  generateAIResult: async (action, content) => {
    if (!content || content.trim() === "") {
      throw new Error("Note content is empty");
    }

    const prompt = buildPrompt(action, content);

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (err) {
      console.error("❌ GeminiUtil Error:", err);
      throw new Error("Failed to generate AI response");
    }
  },
};

export default GeminiUtil;
