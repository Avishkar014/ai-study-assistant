import FlashcardBlock from "./FlashcardBlock";
import QuizBlock from "./QuizBlock";
import ChecklistBlock from "./ChecklistBlock";
import ChartBlock from "./ChartBlock";

const GROUPED_BLOCK_TYPES = ["flashcard", "quiz"];

function groupBlocks(blocks) {
  const groups = [];

  blocks.forEach((block, index) => {
    const previous = groups[groups.length - 1];

    if (
      previous &&
      previous.type === block.type &&
      GROUPED_BLOCK_TYPES.includes(block.type)
    ) {
      previous.blocks.push(block);
      return;
    }

    groups.push({
      key: `${block.id}-${index}`,
      type: block.type,
      blocks: [block],
    });
  });

  return groups;
}

function renderBlock(group) {
  switch (group.type) {
    case "flashcard":
      return <FlashcardBlock blocks={group.blocks} />;

    case "quiz":
      return <QuizBlock blocks={group.blocks} />;

    case "checklist":
      return <ChecklistBlock data={group.blocks[0]?.data} />;

    case "chart":
      return <ChartBlock data={group.blocks[0]?.data} />;

    default:
      return (
        <section className="study-block unsupported-block">
          <p>This study block type is not supported yet.</p>
        </section>
      );
  }
}

function StudyBlockRenderer({ blocks }) {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return null;
  }

  return (
    <div className="study-blocks">
      {groupBlocks(blocks).map((group) => (
        <div className="block-slot" key={group.key}>
          {renderBlock(group)}
        </div>
      ))}
    </div>
  );
}

export default StudyBlockRenderer;
