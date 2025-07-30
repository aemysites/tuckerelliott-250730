/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid container that holds columns
  const grid = element.querySelector('.w-layout-grid');
  if (!grid) return;
  // Get all direct children of the grid (these are the columns)
  const columns = Array.from(grid.children);
  if (columns.length < 2) return;

  // According to the HTML, the first column is content, the second is image
  // We want to reference the actual existing elements, not clones
  const left = columns[0];
  const right = columns[1];

  // Table header as per requirements
  const headerRow = ['Columns (columns27)'];
  // Content row with two columns
  const contentRow = [left, right];

  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(block);
}
