/* global WebImporter */
export default function parse(element, { document }) {
  // Header for the table
  const headerRow = ['Cards (cards7)'];

  // Get all the direct child divs (each is a card)
  const cardDivs = element.querySelectorAll(':scope > div');

  // Build the card rows
  const rows = Array.from(cardDivs).map(cardDiv => {
    // Find the image in the card (mandatory)
    const img = cardDiv.querySelector('img');
    // Each card row: [image, '']
    // No text in this variant, only image per card
    return [img, ''];
  });

  // Combine header and rows
  const cells = [headerRow, ...rows];

  // Create the table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
