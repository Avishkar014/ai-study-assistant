import { z } from "zod";

const flashcardSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1),
  answer: z.string().min(1),
  difficulty: z.enum(["easy", "medium", "hard"]),
}).strict();

const quizQuestionSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1),
  options: z.array(z.string().min(1)).length(4),
  correctAnswer: z.number().int().min(0).max(3),
}).strict();

export const studyKitSchema = z.object({
  cards: z.array(flashcardSchema).length(5),
  quiz: z.array(quizQuestionSchema).length(5),
}).strict();