/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards21) block: 2 columns, 1 header row, 1 card row
  const headerRow = ['Cards (cards21)'];

  // Find the card body (required for content)
  // Structure: element > ... > .card-body
  let cardBody = element.querySelector('.card-body');

  // Defensive: if missing, fallback to full element
  if (!cardBody) cardBody = element;

  // Image: first <img> in cardBody
  const img = cardBody.querySelector('img');

  // Title: .h4-heading, h1, h2, h3, h4 (prefer order)
  let title = cardBody.querySelector('.h4-heading,h1,h2,h3,h4');
  // Defensive: fallback to first heading
  if (!title) title = cardBody.querySelector('h1,h2,h3,h4');

  // Description: look for paragraph or any text nodes after title
  // In this HTML, there's only a heading and image - no explicit description/cta
  // If description existed, we'd want text following title (excluding image)

  // Build the text cell contents
  const textCell = [];
  if (title) textCell.push(title);
  // If there are paragraphs or additional descriptive text, add them too (not present in this sample)
  // Get all child nodes after title up to img
  if (title) {
    let n = title.nextSibling;
    while (n) {
      if (n.nodeType === Node.ELEMENT_NODE && n.matches('img')) break;
      if (n.nodeType === Node.ELEMENT_NODE) textCell.push(n);
      // If text node and not empty/whitespace only, add as text
      if (n.nodeType === Node.TEXT_NODE && n.textContent.trim()) {
        textCell.push(document.createTextNode(n.textContent));
      }
      n = n.nextSibling;
    }
  }

  // Compose the rows for the table
  const rows = [
    headerRow,
    [img, textCell]
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original with the new table
  element.replaceWith(table);
}
