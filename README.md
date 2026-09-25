# AI Study Assistant

An AI-powered study assistant that transforms any topic or study material into an interactive learning experience with flashcards, quizzes, checklists, and charts.

Built with React, Node.js, Express, Google Gemini, and Zod validation.

---

## ✨ Features

- 🤖 AI-powered study kit generation
- 🃏 Interactive flashcards
- 📝 Multiple-choice quizzes
- ✅ Interactive checklists
- 📊 Data visualization with charts
- ⚡ Streaming generation with live progress
- 🔄 AI-powered study kit refinement
- 💾 Save and reload previous study sessions
- 🗑️ Delete saved sessions
- 🌙 Dark mode
- ⌨️ Keyboard navigation
- 📱 Responsive interface
- 🛡️ Zod validation for AI-generated data
- 🔐 Gemini API key stays on the backend
- 🚨 Graceful handling of invalid, empty, slow, or failed AI responses

---

## 🏗️ Architecture

```text
                    ┌─────────────────────┐
                    │     React / Vite    │
                    │      Frontend       │
                    └──────────┬──────────┘
                               │
                               │ HTTP / SSE
                               ▼
                    ┌─────────────────────┐
                    │   Node.js / Express │
                    │       Backend       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    Google Gemini    │
                    │      AI Model       │
                    └─────────────────────┘

                               │
                               ▼

                    ┌─────────────────────┐
                    │   Zod Validation    │
                    │  Structured Output  │
                    └─────────────────────┘
🧰 Tech Stack
Frontend
React
Vite
JavaScript
CSS
Server-Sent Events
LocalStorage
Backend
Node.js
Express.js
Google Gemini API
CORS
dotenv
Validation
Zod
📂 Project Structure
ai-study-assistant/
│
├── public/
│
├── server/
│   ├── server.js
│   └── studyKit.js
│
├── src/
│   ├── components/
│   │   ├── blocks/
│   │   │   ├── ChartBlock.jsx
│   │   │   ├── ChecklistBlock.jsx
│   │   │   ├── FlashcardBlock.jsx
│   │   │   ├── QuizBlock.jsx
│   │   │   └── StudyBlockRenderer.jsx
│   │   ├── EmptyState.jsx
│   │   ├── ErrorState.jsx
│   │   ├── Flashcard.jsx
│   │   ├── FlashcardDeck.jsx
│   │   ├── Header.jsx
│   │   ├── LoadingState.jsx
│   │   ├── PromptInput.jsx
│   │   ├── Quiz.jsx
│   │   ├── RefinementPanel.jsx
│   │   └── SessionList.jsx
│   │
│   ├── services/
│   │   ├── api.js
│   │   ├── sessionStorage.js
│   │   └── theme.js
│   │
│   ├── utils/
│   │   └── validateResult.js
│   │
│   ├── App.jsx
│   ├── App.css
│   └── index.css
│
├── validation/
│   ├── studyKitSchema.js
│   └── testValidation.js
│
├── .env.example
├── .gitignore
├── index.html
├── package.json
└── vite.config.js
🚀 Getting Started
Prerequisites

Make sure you have installed:

Node.js 20+
npm
A Google Gemini API key
📦 Installation

Clone the repository:

git clone https://github.com/Avishkar014/ai-study-assistant.git

Navigate into the project:

cd ai-study-assistant

Install dependencies:

npm install
🔐 Environment Variables

Create a .env file in the project root.

LLM_API_KEY=your_gemini_api_key
FRONTEND_URL=http://localhost:5173
VITE_API_URL=http://localhost:3001

Do not commit .env to GitHub.

▶️ Run the Application

Start the backend:

node server/server.js

The backend will run on:

http://localhost:3001

Start the frontend in another terminal:

npm run dev

The frontend will run on:

http://localhost:5173

Open the frontend in your browser:

http://localhost:5173
🧠 How It Works

The application follows a structured AI generation pipeline:

User Input
    ↓
React Frontend
    ↓
Express API
    ↓
Gemini API
    ↓
Structured JSON Response
    ↓
JSON Parsing
    ↓
Zod Validation
    ↓
Validated Study Kit
    ↓
React Block Renderer
    ↓
Interactive Learning Experience

The application does not directly trust AI output.

The generated response is parsed and validated before it reaches the UI.

🛡️ AI Output Validation

AI-generated responses can contain:

Invalid JSON
Missing properties
Incorrect data types
Unexpected block types
Invalid quiz options
Invalid chart data
Incorrect array lengths

The application uses Zod to validate the complete response structure.

Supported study blocks include:

flashcard
quiz
checklist
chart

Invalid responses are rejected before rendering.

⚡ Streaming Generation

The application supports streaming study-kit generation using Server-Sent Events.

Frontend
   ↓
/api/generate/stream
   ↓
Backend
   ↓
Gemini
   ↓
Progress Events
   ↓
Frontend Progress UI
   ↓
Validated Final Result

If streaming fails in a recoverable way, the application can fall back to the normal generation endpoint.

🔄 Study Kit Refinement

Users can refine an existing study kit without starting from scratch.

Examples:

Make the questions harder
Add more practical examples
Make the quiz more interview focused
Simplify the explanations

The existing study kit is sent together with the refinement instruction and the resulting response is validated again before being displayed.

💾 Session Management

Study sessions are stored locally in the browser.

Users can:

Save generated study kits
Reload previous sessions
Switch between sessions
Delete sessions
Continue refining an existing session

The application limits stored sessions to prevent uncontrolled local storage growth.

🌙 Dark Mode

The application includes light and dark themes.

The selected theme is persisted so that it remains available after refreshing the page.

The interface also respects reduced-motion preferences.

⌨️ Keyboard Navigation
Flashcards
← Previous card
→ Next card
Space Flip card
Quiz
1 Select option 1
2 Select option 2
3 Select option 3
4 Select option 4

Keyboard interaction is designed to make the application usable without relying entirely on mouse input.

🔌 API Endpoints
Health Check
GET /api/health
Generate Study Kit
POST /api/generate

Request:

{
  "input": "React Hooks"
}
Stream Study Kit
POST /api/generate/stream

Uses Server-Sent Events to provide generation progress.

Refine Study Kit
POST /api/refine

Used to modify an existing study kit using a follow-up instruction.

🧪 Validation Tests

Run the validation tests with:

node validation/testValidation.js

The validation suite checks both valid and intentionally invalid study-kit structures.

🏗️ Production Build

Create a production frontend build:

npm run build

The generated production files are placed in:

dist/
🎯 Assignment Requirements

This project addresses the core requirements of the assignment:

Real LLM API

Google Gemini is used to generate study content.

Structured Output

The model is instructed to return structured JSON rather than free-form text.

Unpredictable AI Output

AI output is parsed and validated before reaching the frontend.

Reliable UI

React state manages:

Loading
Errors
Generated content
Streaming progress
Refinement
Sessions
Theme
Failure Handling

The application handles:

Empty input
Invalid JSON
Invalid response structure
API failures
AI quota errors
Empty AI responses
Streaming failures
Secure API Key Handling

The Gemini API key is only used by the backend and is never exposed to the browser.

🎬 Demo Video

The demo video demonstrates:

Entering a study topic
Generating an AI study kit
Viewing interactive flashcards
Taking the quiz
Using checklist and chart blocks
Streaming generation progress
Refining the generated study kit
Saving and loading sessions
Switching between light and dark mode
Keyboard navigation
Error handling and validation
🔗 Links

GitHub Repository:

https://github.com/Avishkar014/ai-study-assistant

👨‍💻 Author

Avishkar Tambe

Computer Engineering | Software Engineer

GitHub:
https://github.com/Avishkar014

LinkedIn:
https://www.linkedin.com/in/avishkar-tambe/
