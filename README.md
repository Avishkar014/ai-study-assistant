# AI Study Assistant

An AI-powered study assistant that transforms study notes or a topic into an interactive study kit.

The application uses a React frontend and a Node.js/Express backend. Gemini generates structured study content, while Zod validates the generated data before it is rendered by the frontend.

## Features

### Core Features

- Enter a study topic or paste study notes
- Generate an AI-powered study kit
- Interactive flashcards
- Interactive multiple-choice quizzes
- AI-generated checklists
- AI-generated charts
- Structured JSON output from Gemini
- Runtime validation using Zod
- Loading states
- Error states
- Responsive UI
- Backend API key protection

### Stretch Goals

- Multiple AI-generated content block types
- Streaming generation with live progress
- Refinement loop for modifying an existing study kit
- Save and reload study sessions
- Delete saved sessions
- Dark mode
- Theme persistence
- Flashcard keyboard navigation
- Quiz keyboard shortcuts
- Animations
- Responsive mobile layout
- Reduced-motion support

---

# How It Works

The application follows a structured AI generation pipeline:

```text
User Input
    |
    v
React Frontend
    |
    v
Express Backend
    |
    v
Gemini API
    |
    v
Structured JSON
    |
    v
JSON Parsing
    |
    v
Zod Validation
    |
    v
Validated Study Kit
    |
    v
React UI
```
AI-generated content is never rendered directly.

The backend first parses the response and validates its structure using Zod. Only validated data is returned to the frontend.

AI Output

The AI generates a study kit containing different types of blocks.

Supported block types:

Flashcard
Quiz
Checklist
Chart

Example:

{
  "title": "React Hooks",
  "blocks": [
    {
      "id": "block-1",
      "type": "flashcard",
      "data": {
        "question": "What is useState?",
        "answer": "useState is a React Hook used to manage state in functional components.",
        "difficulty": "easy"
      }
    },
    {
      "id": "block-2",
      "type": "quiz",
      "data": {
        "question": "Which Hook is used to manage state?",
        "options": [
          "useEffect",
          "useState",
          "useContext",
          "useMemo"
        ],
        "correctAnswer": 1
      }
    },
    {
      "id": "block-3",
      "type": "checklist",
      "data": {
        "title": "React Hooks Revision",
        "items": [
          "Understand useState",
          "Understand useEffect",
          "Learn the Rules of Hooks"
        ]
      }
    },
    {
      "id": "block-4",
      "type": "chart",
      "data": {
        "title": "Hook Usage",
        "labels": [
          "useState",
          "useEffect",
          "useContext"
        ],
        "values": [
          80,
          65,
          45
        ]
      }
    }
  ]
}
Validation

AI responses are unpredictable, so the application does not assume that the model always returns valid data.

The response passes through multiple validation stages:

Gemini Response
      |
      v
JSON.parse()
      |
      v
Zod safeParse()
      |
      +---- Invalid
      |       |
      |       v
      |   Error Response
      |
      v
Validated Study Kit
      |
      v
Frontend

Validation checks include:

Required fields
Study kit structure
Valid block types
Flashcard structure
Flashcard difficulty
Quiz structure
Exactly four quiz options
Correct answer index
Checklist structure
Chart structure
Chart label/value consistency
Minimum and maximum block counts

Invalid AI responses are rejected before they reach the UI.

The project also contains validation tests for intentionally invalid responses.

Run:

node validation/testValidation.js
Structured AI Output

The model is explicitly instructed to return JSON instead of free-form text.

The backend uses:

responseMimeType: "application/json"

The application then performs:

Gemini
  ↓
JSON
  ↓
JSON.parse()
  ↓
Zod safeParse()
  ↓
Validated object

This prevents malformed or incorrectly structured AI output from being blindly rendered.

Streaming Generation

The application supports streaming study-kit generation.

Endpoint:

POST /api/generate/stream

The frontend receives progress events while generation is running.

The flow is:

User Input
    |
    v
Backend
    |
    v
Gemini Generation
    |
    v
Streaming Progress
    |
    v
Complete Response
    |
    v
JSON Parsing
    |
    v
Zod Validation
    |
    v
Study Kit

Streaming does not bypass validation.

The final study kit is still parsed and validated before being rendered.

The application also supports the normal /api/generate endpoint as a fallback when streaming is unavailable or disabled.

Refinement Loop

The application supports modifying an existing study kit without generating an entirely new study kit from scratch.

Users can provide instructions such as:

Make the questions harder
Simplify the explanations
Focus more on interview preparation
Add more difficult questions

The refinement flow is:

Existing Study Kit
       |
       v
User Instruction
       |
       v
Gemini
       |
       v
JSON Parsing
       |
       v
Zod Validation
       |
       v
Updated Study Kit

The refined response goes through the same validation process as the original response.

Endpoint:

POST /api/refine
Sessions

Generated study kits can be saved locally in the browser.

Each session stores:

Session ID
Study title
Original input
Generated study kit
Creation time

Users can:

Save study kits
Reload previous sessions
Select a previous session
Delete sessions

The application limits stored sessions to the most recent 10 sessions.

Corrupted localStorage data is handled safely instead of causing the application to crash.

API keys and backend configuration are not stored in localStorage.

Dark Mode

The application includes light and dark themes.

Theme preferences are persisted using localStorage.

When there is no saved preference, the application can use the user's system theme preference.

Theme switching is available directly from the application header.

Keyboard Navigation

Flashcards support keyboard interaction.

Key	Action
ArrowLeft	Previous flashcard
ArrowRight	Next flashcard
Space	Flip flashcard

Quiz navigation supports:

Key	Action
1	Select option 1
2	Select option 2
3	Select option 3
4	Select option 4

Interactive controls also support normal keyboard navigation using the Tab key.

Visible focus states are provided for keyboard users.

Error Handling

The application handles realistic failure scenarios including:

Empty input
Invalid input
Empty AI response
Malformed JSON
Invalid AI response structure
Invalid block type
Invalid quiz data
Invalid chart data
Gemini API failures
Gemini quota errors
Authentication errors
Backend failures
Network failures
Failed streaming requests
Failed refinement requests
Corrupted session data

The frontend displays user-friendly error messages instead of exposing internal server details.

API Key Security

The Gemini API key is stored only on the backend.

The browser never communicates directly with Gemini.

Browser
   |
   | Study request
   v
Express Backend
   |
   | Gemini API key
   v
Gemini API

The frontend only communicates with the local backend API.

The API key is not included in frontend code.

The .env file is excluded from Git using .gitignore.

Technology Stack
Frontend
React
Vite
JavaScript
CSS
Backend
Node.js
Express
CORS
dotenv
AI
Google Gemini
@google/genai
Validation
Zod
Storage
Browser localStorage
Project Structure
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
│   │   │
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
├── package-lock.json
├── vite.config.js
└── README.md
API Endpoints
Health Check
GET /api/health

Example response:

{
  "success": true,
  "message": "Study Assistant API is running"
}
Generate Study Kit
POST /api/generate

Request:

{
  "input": "React Hooks"
}

The endpoint:

Validates the input
Sends the request to Gemini
Receives structured JSON
Parses the JSON
Validates it using Zod
Returns the validated study kit
Streaming Generation
POST /api/generate/stream

Request:

{
  "input": "React Hooks"
}

The endpoint returns progress events while the study kit is generated.

The final response is validated before being returned to the frontend.

Refine Study Kit
POST /api/refine

Request:

{
  "studyKit": {},
  "instruction": "Make the questions harder"
}

The backend sends the existing study kit and refinement instruction to Gemini and validates the returned study kit before returning it.

Environment Variables

Create a .env file in the project root.

LLM_API_KEY=your_gemini_api_key

The API key is only used by the backend.

Do not commit the .env file to GitHub.

A sample environment file is provided:

.env.example
Installation

Clone the repository:

git clone https://github.com/Avishkar014/ai-study-assistant.git

Navigate to the project:

cd ai-study-assistant

Install dependencies:

npm install

Create the environment file:

.env

Add:

LLM_API_KEY=your_gemini_api_key
Running the Application

The frontend and backend run separately.

Start Backend

From the project root:

node server/server.js

The backend runs at:

http://localhost:3001
Start Frontend

Open another terminal:

npm run dev

The frontend runs at:

http://localhost:5173

Open the frontend URL in your browser.

Testing
Validate AI Output

Run:

node validation/testValidation.js

The validation tests verify that invalid study-kit structures are rejected and valid structures are accepted.

Build

Run:

npm run build
Lint

Run:

npm run lint
Design Decisions

The main design decision was to treat AI output as untrusted data.

Instead of assuming that the model will always return the expected structure, the application validates every generated result before rendering it.

The application uses:

Structured JSON generation
JSON parsing
Runtime schema validation
Discriminated block types
Client-side validation
Backend validation
Explicit loading states
Explicit error states
Streaming fallback
Safe session storage
Backend API isolation

This makes the AI output predictable enough for an interactive React application.

Assignment Requirements

This project addresses the main requirements of the AI Study Assistant assignment.

Calling a Real LLM API

The application uses the Gemini API through the Node.js backend.

React
  ↓
Express
  ↓
Gemini
Structured JSON Output

The AI is instructed to return structured JSON rather than free-form text.

The backend requests an application/json response and parses the returned data.

Parsing and Validating Unpredictable Model Output

The application does not directly trust the model response.

The response passes through:

AI Response
    ↓
JSON.parse()
    ↓
Zod safeParse()
    ↓
Validated Data
    ↓
React

Invalid responses are rejected.

Real React State and Interactive Components

React state manages:

User input
Loading state
Streaming state
Generation progress
Error state
Study kit
Flashcard state
Quiz state
Checklist state
Sessions
Refinement
Theme

The generated blocks are mapped to dedicated React components.

Failure Handling

The application handles:

Malformed JSON
Invalid response shapes
Empty responses
API failures
Quota errors
Network errors
Streaming failures
Refinement failures
Invalid localStorage data

The UI displays an appropriate state instead of crashing.

API Key Protection

The Gemini API key is never exposed to the browser.

All Gemini requests are routed through the Express backend.

Frontend
   |
   v
Backend
   |
   v
Gemini
Component Architecture

The application uses a block-based rendering architecture.

Study Kit
    |
    v
StudyBlockRenderer
    |
    +---- flashcard ----> FlashcardBlock
    |
    +---- quiz ---------> QuizBlock
    |
    +---- checklist ----> ChecklistBlock
    |
    +---- chart ---------> ChartBlock

This allows the AI to return different content types while keeping the rendering logic separated by block type.

Unknown block types are handled safely instead of crashing the application.

Accessibility

The application includes:

Semantic buttons
Keyboard navigation
Visible focus states
ARIA attributes where appropriate
Keyboard-accessible interactive elements
Reduced-motion support
Responsive layouts
Responsive Design

The interface supports:

Desktop screens
Tablets
Mobile devices

The layout adapts at smaller screen widths and maintains usable controls for interactive study content.

Performance Considerations

The application avoids unnecessary dependencies and keeps the frontend architecture component-based.

Streaming generation provides immediate progress feedback during longer AI requests.

The refinement flow avoids requiring the user to completely regenerate the study kit when only a small change is required.

Session storage is limited to 10 sessions to prevent uncontrolled localStorage growth.

Security Considerations

The application follows these basic security practices:

Gemini API key remains server-side
.env is excluded from Git
Backend validates incoming input
AI output is validated before rendering
Client responses are validated
Invalid data is rejected
Internal server errors are not exposed directly to users
Future Improvements

Possible future improvements include:

User authentication
Cloud session storage
Spaced repetition
Learning progress analytics
Study history synchronization
Export study kits
PDF generation
Additional visualization types
More study block types
Collaborative study sessions
Personalized learning recommendations
Author
Avishkar Tambe

GitHub:

https://github.com/Avishkar014

Project Repository:

https://github.com/Avishkar014/ai-study-assistant


After pasting it into `README.md`, save it and run:

```powershell
git status
git add README.md
git commit -m "Improve project documentation"
git push origin master
