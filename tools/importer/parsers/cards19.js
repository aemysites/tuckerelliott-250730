/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards19) block parsing
  // 1. Find the parent container for all cards
  const cardsContainer = element.querySelector('ul.imageGrid');
  if (!cardsContainer) return;

  // 2. Get all card items (li elements)
  const cardItems = Array.from(cardsContainer.querySelectorAll('li'));

  // 3. Prepare the table rows
  // Header row as per block guidelines
  const rows = [['Cards (cards19)']];

  // 4. For each card, extract image, text, and CTA
  cardItems.forEach((li) => {
    // Image: first img inside the card
    const img = li.querySelector('img');

    // Text content container (contains heading, description, CTA)
    // Avoid using invalid pseudo-class selectors
    // Find the div with class containing 'text-left' or 'pt-5' or 'min-w-0' (all present in text container)
    let textContent = li.querySelector('div.text-left, div.pt-5, div.min-w-0');
    if (textContent) {
      // Use the inner div if present (usually wraps all text)
      const innerDiv = textContent.querySelector('div');
      if (innerDiv) textContent = innerDiv;
    } else {
      // Fallback: try to find a div with a heading inside
      textContent = li.querySelector('div h3')?.parentElement || li;
    }

    // Table row: [image, text content]
    rows.push([img, textContent]);
  });

  // 5. Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);

  // 6. Replace the original element with the block table
  element.replaceWith(blockTable);
}
