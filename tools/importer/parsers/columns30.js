/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid containing the columns (should be .grid-layout)
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;

  // Get all direct children (these are the columns), as elements
  const columns = Array.from(grid.children);
  if (columns.length === 0) return;

  // Header row: exactly one column containing the block name
  const headerRow = ['Columns (columns30)'];
  // Content row: as many columns as in the grid
  const contentRow = columns;

  // Build the table data: header, then content
  const cells = [headerRow, contentRow];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
