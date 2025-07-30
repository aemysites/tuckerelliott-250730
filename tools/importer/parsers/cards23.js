/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as specified in the example
  const rows = [['Cards (cards23)']];

  // Each tab pane contains a grid of cards
  const tabPanes = element.querySelectorAll('.w-tab-pane');
  tabPanes.forEach((pane) => {
    // Find the grid of cards in each tab pane
    const grid = pane.querySelector('.w-layout-grid');
    if (!grid) return;
    // Each direct child <a> represents a card
    const cards = Array.from(grid.children).filter(child => child.tagName === 'A');
    cards.forEach(card => {
      // IMAGE CELL: Find the first <img> under the card (the card's image, mandatory for this variant)
      let imageEl = card.querySelector('img');
      // If no image, provide an empty span (the block expects image slot always present)
      if (!imageEl) {
        imageEl = document.createElement('span');
        imageEl.textContent = '';
      }
      // TEXT CELL: Title and description (grouped in original order)
      const textParts = [];
      // Heading (h3 or .h4-heading)
      const heading = card.querySelector('h3, .h4-heading');
      if (heading) textParts.push(heading);
      // All relevant paragraph-sm divs (exclude if it's a container div)
      card.querySelectorAll('div.paragraph-sm').forEach(paragraph => {
        textParts.push(paragraph);
      });
      // Compose text cell
      let textCell = textParts;
      // If no heading or paragraph, use an empty span for structure
      if (!textParts.length) {
        textCell = document.createElement('span');
        textCell.textContent = '';
      }
      // Add the card row: [image, text cell]
      rows.push([imageEl, textCell]);
    });
  });

  // Create and replace with the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
