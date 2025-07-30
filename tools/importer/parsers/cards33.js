/* global WebImporter */
export default function parse(element, { document }) {
  // Table header exactly as in the example
  const headerRow = ['Cards (cards33)'];
  const cardRows = [];

  // Get all direct children <a> elements, each being a card
  const cards = element.querySelectorAll(':scope > a');
  cards.forEach((card) => {
    // IMAGE: get the first <img> in the card (should always be present)
    const img = card.querySelector('img');

    // TEXT: get card's text content (the div that contains all the tags, heading, p, and 'Read')
    // Find the grid div (contains img and then a content div)
    const grid = card.querySelector('.w-layout-grid');
    let contentDiv;
    if (grid) {
      // usually: [img, contentDiv] are direct children of grid
      contentDiv = Array.from(grid.children).find((child) => child !== img && child.tagName === 'DIV');
    }
    // Fallback: get the first div that contains an h3 (heading)
    if (!contentDiv) {
      contentDiv = card.querySelector('h3')?.parentElement;
    }
    // Fallback: last div in card
    if (!contentDiv) {
      const divs = card.querySelectorAll('div');
      if (divs.length) contentDiv = divs[divs.length - 1];
    }
    // If no text content found, use a dummy empty div to avoid failure
    if (!contentDiv) {
      contentDiv = document.createElement('div');
    }
    // Reference the existing contentDiv (do not clone)
    cardRows.push([img, contentDiv]);
  });

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...cardRows
  ], document);

  element.replaceWith(table);
}
