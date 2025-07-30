/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row (exact block name from the spec)
  const headerRow = ['Hero (hero6)'];

  // 2. Extract background image (optional)
  // Look for .cover-image IMG child anywhere in the block
  let bgImg = element.querySelector('img.cover-image');
  let bgImgCell = '';
  if (bgImg) {
    bgImgCell = bgImg;
  }

  // 3. Extract main content card (contains headline, subheading, CTA)
  // This is the .card ...
  let card = element.querySelector('.card');
  let contentCell = '';
  if (card) {
    contentCell = card;
  }

  // 4. Table definition: 1 column, 3 rows
  const cells = [
    headerRow,
    [bgImgCell],
    [contentCell],
  ];

  // 5. Replace the original element with the new table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
