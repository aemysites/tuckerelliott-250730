/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards27) block: 2 columns, multiple rows. First row is block name.
  const headerRow = ['Cards (cards27)'];
  const rows = [headerRow];

  // Find the parent container holding all cards
  const cardContainer = element.querySelector('div.flex');
  if (!cardContainer) return;

  // Each card is a direct child div of the cardContainer
  const cardDivs = Array.from(cardContainer.children).filter(child => child.tagName === 'DIV');

  cardDivs.forEach(cardDiv => {
    // Image/Icon: always in the first inner div
    const imgDiv = cardDiv.querySelector('div');
    let img = '';
    if (imgDiv) {
      const imgEl = imgDiv.querySelector('img');
      if (imgEl) img = imgEl;
    }

    // Text content: always in the second inner div
    const textDiv = cardDiv.querySelector('div + div');
    const textContent = [];
    if (textDiv) {
      // Title (h3)
      const title = textDiv.querySelector('h3');
      if (title) textContent.push(title);
      // Description (p)
      const desc = textDiv.querySelector('p');
      if (desc) textContent.push(desc);
    }
    // Defensive: if no textContent, fallback to the whole textDiv
    if (textContent.length === 0 && textDiv) textContent.push(textDiv);

    rows.push([
      img ? img : '',
      textContent.length ? textContent : ''
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
