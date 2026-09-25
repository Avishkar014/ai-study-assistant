import { studyKitSchema } from "./studyKitSchema.js";

const invalidStudyKit = {
  cards: [
    {
      id: "card-1",
      question: "What is React?",
      answer: "A JavaScript library.",
      difficulty: "very-hard",
    },
  ],
  quiz: [],
};

const result = studyKitSchema.safeParse(invalidStudyKit);

if (result.success) {
  console.log("Validation failed: invalid data was accepted.");
} else {
  console.log("Validation passed: invalid data was rejected.");
  console.log(result.error.issues);
}