/* global WebImporter */
export default function parse(element, { document }) {
  // Find the root grid layout
  const grid = element.querySelector('.w-layout-grid.grid-layout');
  if (!grid) return;
  const gridChildren = Array.from(grid.children);

  let imgElem = null;
  let textCell = null;

  // Find the div containing the hero image (background)
  for (const div of gridChildren) {
    const img = div.querySelector('img');
    if (img) {
      imgElem = img;
      break;
    }
  }

  // Find the div containing the headline, paragraphs, button etc.
  for (const div of gridChildren) {
    if (div.querySelector('h1, h2, h3, h4, h5, h6, p, .button, a')) {
      textCell = div;
      break;
    }
  }

  // If content is missing, still create table with nulls (robust)
  const rows = [
    ['Hero (hero39)'],
    [imgElem],
    [textCell],
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
