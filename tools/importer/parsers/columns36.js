/* global WebImporter */
export default function parse(element, { document }) {
  // Block header as specified
  const headerRow = ['Columns (columns36)'];

  // Get immediate grid columns (should be two main children: left and right)
  const container = element.querySelector(':scope > .container');
  if (!container) return;
  const mainGrid = container.querySelector(':scope > .grid-layout');
  if (!mainGrid) return;
  const columns = mainGrid.querySelectorAll(':scope > div');
  if (columns.length < 2) return;
  // Reference the left (text and buttons) and right (images grid)
  const leftCol = columns[0];
  const rightCol = columns[1];

  // For the right column, get the inner grid of images
  let imagesGrid = rightCol.querySelector('.grid-layout');
  // If not found, fall back to the whole rightCol
  if (!imagesGrid) imagesGrid = rightCol;

  // Compose table: header row, then content row with left & right
  const cells = [
    headerRow,
    [leftCol, imagesGrid]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}