/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards20) block: 2 columns, multiple rows, first row is block name
  const headerRow = ['Cards (cards20)'];
  const rows = [headerRow];

  // Find the parent UL containing the cards
  const ul = element.querySelector('ul.imageGrid');
  if (!ul) return;

  // Each LI is a card
  ul.querySelectorAll('li').forEach((li) => {
    // Image: first img in card
    const img = li.querySelector('img');

    // Find the card content container (the div after the image container)
    // This is the div that contains h3 and description
    let textBlock = document.createElement('div');
    const contentDivs = Array.from(li.querySelectorAll('div'));
    let found = false;
    for (const div of contentDivs) {
      const h3 = div.querySelector('h3');
      const desc = h3 ? h3.nextElementSibling : null;
      if (h3 && desc && desc.tagName === 'DIV') {
        textBlock.appendChild(h3.cloneNode(true));
        textBlock.appendChild(desc.cloneNode(true));
        found = true;
        break;
      }
    }
    // Fallback: if not found, try to get all text content
    if (!found) {
      const h3 = li.querySelector('h3');
      if (h3) textBlock.appendChild(h3.cloneNode(true));
      // Try to get the description div after h3
      if (h3 && h3.nextElementSibling && h3.nextElementSibling.tagName === 'DIV') {
        textBlock.appendChild(h3.nextElementSibling.cloneNode(true));
      }
    }
    rows.push([img, textBlock]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
