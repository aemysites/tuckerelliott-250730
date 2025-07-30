/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid layout container (the columns wrapper)
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;

  // Get all top-level children of the grid (should correspond to columns)
  const columns = Array.from(grid.children);
  if (columns.length === 0) return;

  // Build the header row exactly as required
  const headerRow = ['Columns (columns1)'];

  // Second row: one cell per column, referencing the original nodes
  const columnsRow = columns.map(col => col);

  // Create and replace with the block table
  const table = WebImporter.DOMUtils.createTable([headerRow, columnsRow], document);
  element.replaceWith(table);
}
