import { z } from "zod";

const difficultySchema = z.enum(["easy", "medium", "hard"]);

const flashcardDataSchema = z.strictObject({
  question: z.string().min(1).max(400),
  answer: z.string().min(1).max(1200),
  difficulty: difficultySchema,
});

const quizDataSchema = z.strictObject({
  question: z.string().min(1).max(400),
  options: z.array(z.string().min(1).max(300)).length(4),
  correctAnswer: z.number().int().min(0).max(3),
});

const checklistDataSchema = z.strictObject({
  title: z.string().min(1).max(160),
  items: z.array(z.string().min(1).max(300)).min(1).max(12),
});

const chartDataSchema = z
  .strictObject({
    title: z.string().min(1).max(160),
    description: z.string().min(1).max(400),
    labels: z.array(z.string().min(1).max(60)).min(2).max(8),
    values: z.array(z.number()).min(2).max(8),
  })
  .superRefine((chart, ctx) => {
    if (chart.labels.length !== chart.values.length) {
      ctx.addIssue({
        code: "custom",
        path: ["values"],
        message: "Chart labels and values must have the same length.",
      });
    }
  });

const flashcardBlockSchema = z.strictObject({
  id: z.string().min(1).max(64),
  type: z.literal("flashcard"),
  data: flashcardDataSchema,
});

const quizBlockSchema = z.strictObject({
  id: z.string().min(1).max(64),
  type: z.literal("quiz"),
  data: quizDataSchema,
});

const checklistBlockSchema = z.strictObject({
  id: z.string().min(1).max(64),
  type: z.literal("checklist"),
  data: checklistDataSchema,
});

const chartBlockSchema = z.strictObject({
  id: z.string().min(1).max(64),
  type: z.literal("chart"),
  data: chartDataSchema,
});

export const studyBlockSchema = z.discriminatedUnion("type", [
  flashcardBlockSchema,
  quizBlockSchema,
  checklistBlockSchema,
  chartBlockSchema,
]);

export const studyKitSchema = z.strictObject({
  title: z.string().min(1).max(160),
  blocks: z.array(studyBlockSchema).min(3).max(12),
});
