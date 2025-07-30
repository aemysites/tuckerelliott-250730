/* global WebImporter */
export default function parse(element, { document }) {
  // The footer HTML provided consists ONLY of the footer columns (logo/social + 3 link columns)
  // The example markdown, however, contains a much richer set of columns: list, image, etc.
  // But, for the footer HTML given, the only reasonable parse is to extract its four columns as in the actual DOM.
  // To ensure exact table header and row structure, and reference only existing blocks, we proceed as follows:
  
  // Find the grid container
  const grid = element.querySelector('.w-layout-grid');
  if (!grid) return;
  // Get all direct children representing columns (should be 4 for this footer)
  const columns = Array.from(grid.children);
  // Defensive: If columns missing, exit
  if (columns.length === 0) return;

  // Header row: exactly matching example
  const headerRow = ['Columns (columns9)'];
  // Content row: reference the column blocks directly (which may be div or ul)
  const contentRow = columns;

  // Only output the correct table structure: 1 header cell, then a single content row with as many columns as the grid
  const cells = [headerRow, contentRow];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
