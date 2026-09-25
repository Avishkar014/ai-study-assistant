import Quiz from "../Quiz";

function QuizBlock({ blocks }) {
  const questions = blocks.map((block) => ({ id: block.id, ...block.data }));

  return <Quiz questions={questions} />;
}

export default QuizBlock;

