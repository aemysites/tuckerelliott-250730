/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must have exactly one column
  const headerRow = ['Columns (columns14)'];

  // Find the grid container
  const grid = element.querySelector('.w-layout-grid');
  if (!grid) return;
  // Find all direct children of the grid (these are the columns)
  const cols = Array.from(grid.children);
  // If there are no columns, do not proceed
  if (!cols.length) return;

  // Content row: references to each column node
  const contentRow = cols;

  // Table: single-cell header row, then content row with N columns
  const cells = [
    headerRow, // header row, single cell
    contentRow // data row, one cell per column
  ];

  // Create table and replace element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
