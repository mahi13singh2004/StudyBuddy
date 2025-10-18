# 🧠 **StudyBuddy AI** – Your Ultimate Smart Study Companion 📚✨  
“Study smarter, not harder.”

A full-stack AI-powered productivity app built with ❤️ using the **MERN stack**, designed to help students and learners manage their notes, summarize content, chat with documents, and boost retention with flashcards — all in one place.

---

## 🛠 **Tech Stack**

### 🖥️ Frontend  
- React + Tailwind CSS  
- Zustand (State Management)  

### 🧠 Backend  
- Node.js + Express  
- MongoDB (Mongoose)  
- LangChain + Gemini API (AI Engine)  

### 🌐 Others  
- JWT Authentication  
- Multer for file uploads  
- PDF parsing + LangChain for chunking and querying  

---

## ✨ **Core Features**

### 📝 **1. Create & Manage Notes**  
- Rich Markdown-based note editor  
- Organize notes inside folders  
- CRUD operations for folders and notes  
- Instant autosave and structure for easy studying

---

### 🧠 **2. AI Summarization & Question Generation**  
- Select a **folder** and let Gemini **summarize** all the notes inside  
- Generate **potential questions** from your notes automatically 🪄  
- Perfect for quick revisions before exams

---

### 🗂 **3. Upload PDFs & Chat with Documents (LangChain)**  
- Upload large PDFs (up to 60–70 pages) 📄  
- Backend uses LangChain + text splitter to process and index documents efficiently  
- Chat with your PDF — ask any question, get context-aware answers in seconds  
- Chat history is session-aware for deeper conversations

---

### 🧠 **4. Flashcard Generator**  
- Instantly convert notes or AI summaries into **interactive flashcards** 🃏  
- Review mode to boost memory with spaced repetition  
- Ideal for active recall sessions before tests

---

## 🔐 **Authentication & Security**  
- Secure JWT-based login system  
- Role-based access ready for future teacher/student expansions  
- All file uploads handled securely on server

---

## 📁 **Project Structure**  
```
StudyBuddyAI/
├── backend/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── utils/
│ └── index.js
│
├── frontend/
│ ├── src/
│ │ ├── pages/
│ │ ├── components/
│ │ ├── store/
│ │ └── App.jsx
│
└── README.md
```

---

### Installation
1. Clone the repo:
   ```bash
   git clone https://github.com/your-username/studybuddy-ai.git
   ```
2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```
4. Create `.env` files:
   In `backend/`, add:
   ```
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_gemini_api_key
   ```
5. Run the backend:
   ```bash
   cd backend
   npm run dev
   ```
7. Run the frontend:
   ```bash
   cd frontend
   npm run dev
   ```
---


