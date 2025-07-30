/* global WebImporter */
export default function parse(element, { document }) {
  // Find main grid for columns
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;
  // Get immediate children (should be image and content column)
  const columns = Array.from(grid.children);
  // Defensive: Only proceed if there are at least 2 columns
  if (columns.length < 2) return;
  // Table: first row is header, next is both columns (referencing actual elements)
  const cells = [
    ['Columns (columns32)'],
    [columns[0], columns[1]]
  ];
  // Create table block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the section with the new block
  element.replaceWith(table);
}
