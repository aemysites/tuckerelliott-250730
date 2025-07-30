/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare table rows
  const rows = [];
  // Header row
  rows.push(['Cards (cards17)']);

  // For each card, extract image and any possible text content
  const cardDivs = element.querySelectorAll(':scope > div');
  cardDivs.forEach(cardDiv => {
    // Extract image (first <img> in the cardDiv)
    const img = cardDiv.querySelector('img');
    // Extract text content (if any), including text nodes or elements not the image
    const textContent = [];
    Array.from(cardDiv.childNodes).forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() !== 'img') {
        textContent.push(node);
      } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        const span = document.createElement('span');
        span.textContent = node.textContent.trim();
        textContent.push(span);
      }
    });
    // If nothing but the image, use an empty string for the text cell
    rows.push([
      img,
      textContent.length ? textContent : ''
    ]);
  });

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
