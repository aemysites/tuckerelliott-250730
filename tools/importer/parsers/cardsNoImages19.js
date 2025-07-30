/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the block spec
  const rows = [['Cards']];
  // Each direct child of the grid is a card
  const cardDivs = element.querySelectorAll(':scope > div');
  cardDivs.forEach((cardDiv) => {
    // Each card content is the icon (optional) and the description
    // We'll put both in a fragment, referencing existing elements
    const frag = document.createDocumentFragment();
    // Add icon SVG if present (icon is a div with class .icon inside a div)
    const iconOuter = cardDiv.querySelector(':scope > div .icon');
    if (iconOuter) {
      frag.appendChild(iconOuter);
    }
    // The text is the <p> inside the card div
    const text = cardDiv.querySelector('p');
    if (text) {
      frag.appendChild(text);
    }
    rows.push([frag]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
