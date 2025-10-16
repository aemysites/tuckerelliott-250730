/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards4) block: 2 columns, first row is header, each subsequent row is [image/icon, text content]
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  // Find the card container: the direct child div with flex-wrap
  const cardsContainer = element.querySelector('div.flex.flex-wrap');
  if (!cardsContainer) return;

  // Each card is a direct child div of the container
  const cardDivs = Array.from(cardsContainer.children).filter(child => child.querySelector('img'));

  cardDivs.forEach(card => {
    // Image/Icon (first cell)
    const imgEl = card.querySelector('img');

    // Text content (second cell): heading, description, price, and red divider
    // The text container is the second direct child div of card
    const cardChildren = Array.from(card.children);
    let textContainer = null;
    if (cardChildren.length > 1) {
      textContainer = cardChildren[1];
    }
    let textParts = [];
    if (textContainer) {
      // Heading
      const heading = textContainer.querySelector('h3');
      if (heading) textParts.push(heading);
      // Description
      const desc = textContainer.querySelector('p');
      if (desc) textParts.push(desc);
      // Red divider (visual separator)
      const divider = document.createElement('hr');
      divider.style.background = '#CC0000';
      divider.style.height = '2px';
      divider.style.border = 'none';
      divider.style.width = '45px';
      divider.style.margin = '16px 0 0 0';
      textParts.push(divider);
    }
    // Defensive: if no text parts found, use the whole text container
    if (textParts.length === 0 && textContainer) textParts = [textContainer];

    rows.push([
      imgEl || '',
      textParts
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
