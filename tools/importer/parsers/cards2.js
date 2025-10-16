/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards2) block parsing
  // Header row per spec
  const headerRow = ['Cards (cards2)'];
  const rows = [headerRow];

  // Find the container holding all cards
  // In this HTML, it's the first div inside the section
  const cardsContainer = element.querySelector('div');
  if (!cardsContainer) return;

  // Each card is a direct child div of the container
  // FIX: Use Array.from(cardsContainer.children) and ensure all are elements
  //      Do NOT filter by tagName, just nodeType === 1
  //      This ensures all cards are included, even if there are comments or whitespace nodes
  const cardDivs = Array.from(cardsContainer.childNodes).filter(child => child.nodeType === 1);

  cardDivs.forEach(card => {
    // Image/Icon: first child div inside card, contains img
    const wrappers = card.querySelectorAll(':scope > div');
    const imgWrapper = wrappers[0];
    const img = imgWrapper ? imgWrapper.querySelector('img') : null;

    // Text content: second child div inside card
    const textWrapper = wrappers[1];
    let cardText = [];
    if (textWrapper) {
      // Title (h3)
      const title = textWrapper.querySelector('h3');
      if (title) cardText.push(title);
      // Description (p)
      const desc = textWrapper.querySelector('p');
      if (desc) cardText.push(desc);
    }

    // Add row: [image/icon, text content]
    rows.push([
      img || '',
      cardText.length ? cardText : ''
    ]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
