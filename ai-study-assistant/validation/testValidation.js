import { studyKitSchema } from "./studyKitSchema.js";

const validStudyKit = {
  title: "React hooks",
  blocks: [
    {
      id: "block-1",
      type: "flashcard",
      data: {
        question: "What is useState?",
        answer: "A React Hook used to manage state.",
        difficulty: "easy",
      },
    },
    {
      id: "block-2",
      type: "quiz",
      data: {
        question: "Which Hook manages state?",
        options: ["useEffect", "useState", "useContext", "useMemo"],
        correctAnswer: 1,
      },
    },
    {
      id: "block-3",
      type: "checklist",
      data: {
        title: "React Hooks checklist",
        items: ["Understand useState", "Understand useEffect"],
      },
    },
    {
      id: "block-4",
      type: "chart",
      data: {
        title: "Hook usage",
        description: "How often each Hook appears in a codebase",
        labels: ["useState", "useEffect", "useMemo"],
        values: [10, 8, 4],
      },
    },
  ],
};

const invalidStudyKits = {
  "missing blocks": { title: "React hooks" },
  "invalid block type": {
    title: "React hooks",
    blocks: [
      { id: "block-1", type: "video", data: { url: "https://example.com" } },
      { id: "block-2", type: "video", data: { url: "https://example.com" } },
      { id: "block-3", type: "video", data: { url: "https://example.com" } },
    ],
  },
  "missing block data": {
    title: "React hooks",
    blocks: [
      { id: "block-1", type: "flashcard" },
      { id: "block-2", type: "flashcard" },
      { id: "block-3", type: "flashcard" },
    ],
  },
  "wrong field types": {
    title: "React hooks",
    blocks: [
      {
        id: "block-1",
        type: "flashcard",
        data: { question: 42, answer: null, difficulty: "easy" },
      },
      {
        id: "block-2",
        type: "flashcard",
        data: { question: "Question", answer: "Answer", difficulty: "easy" },
      },
      {
        id: "block-3",
        type: "flashcard",
        data: { question: "Question", answer: "Answer", difficulty: "easy" },
      },
    ],
  },
  "invalid difficulty": {
    title: "React hooks",
    blocks: [
      {
        id: "block-1",
        type: "flashcard",
        data: {
          question: "Question",
          answer: "Answer",
          difficulty: "very-hard",
        },
      },
      {
        id: "block-2",
        type: "flashcard",
        data: { question: "Question", answer: "Answer", difficulty: "easy" },
      },
      {
        id: "block-3",
        type: "flashcard",
        data: { question: "Question", answer: "Answer", difficulty: "easy" },
      },
    ],
  },
  "quiz options that are not exactly four strings": {
    title: "React hooks",
    blocks: [
      {
        id: "block-1",
        type: "quiz",
        data: {
          question: "Which Hook manages state?",
          options: ["useEffect", "useState", "useContext"],
          correctAnswer: 1,
        },
      },
      {
        id: "block-2",
        type: "quiz",
        data: {
          question: "Which Hook manages state?",
          options: ["useEffect", "useState", "useContext", "useMemo"],
          correctAnswer: 1,
        },
      },
      {
        id: "block-3",
        type: "quiz",
        data: {
          question: "Which Hook manages state?",
          options: ["useEffect", "useState", "useContext", 7],
          correctAnswer: 1,
        },
      },
    ],
  },
  "invalid quiz correctAnswer": {
    title: "React hooks",
    blocks: [
      {
        id: "block-1",
        type: "quiz",
        data: {
          question: "Which Hook manages state?",
          options: ["useEffect", "useState", "useContext", "useMemo"],
          correctAnswer: 4,
        },
      },
      {
        id: "block-2",
        type: "quiz",
        data: {
          question: "Which Hook manages state?",
          options: ["useEffect", "useState", "useContext", "useMemo"],
          correctAnswer: "1",
        },
      },
      {
        id: "block-3",
        type: "quiz",
        data: {
          question: "Which Hook manages state?",
          options: ["useEffect", "useState", "useContext", "useMemo"],
          correctAnswer: 1,
        },
      },
    ],
  },
  "checklist items that are not strings": {
    title: "React hooks",
    blocks: [
      {
        id: "block-1",
        type: "checklist",
        data: { title: "Checklist", items: ["Understand useState", 5] },
      },
      {
        id: "block-2",
        type: "checklist",
        data: { title: "Checklist", items: [] },
      },
      {
        id: "block-3",
        type: "checklist",
        data: { title: "Checklist", items: "Understand useState" },
      },
    ],
  },
  "chart labels and values with incompatible structure": {
    title: "React hooks",
    blocks: [
      {
        id: "block-1",
        type: "chart",
        data: {
          title: "Hook usage",
          description: "How often each Hook is used",
          labels: ["useState", "useEffect", "useMemo"],
          values: [10, 8],
        },
      },
      {
        id: "block-2",
        type: "chart",
        data: {
          title: "Hook usage",
          description: "How often each Hook is used",
          labels: "useState, useEffect",
          values: [10, 8],
        },
      },
      {
        id: "block-3",
        type: "chart",
        data: {
          title: "Hook usage",
          description: "How often each Hook is used",
          labels: ["useState", "useEffect"],
          values: ["10", "8"],
        },
      },
    ],
  },

};

const validResult = studyKitSchema.safeParse(validStudyKit);

if (validResult.success) {
  console.log("Validation passed: valid data was accepted.");
} else {
  console.log("Validation failed: valid data was rejected.");
  console.log(validResult.error.issues);
}

Object.entries(invalidStudyKits).forEach(([label, studyKit]) => {
  const result = studyKitSchema.safeParse(studyKit);

  if (result.success) {
    console.log(`Validation failed: invalid data was accepted (${label}).`);
  } else {
    console.log(`Validation passed: invalid data was rejected (${label}).`);
  }
});
