import FlashcardDeck from "../FlashcardDeck";

function FlashcardBlock({ blocks }) {
  const cards = blocks.map((block) => ({ id: block.id, ...block.data }));

  return <FlashcardDeck cards={cards} />;
}

export default FlashcardBlock;

