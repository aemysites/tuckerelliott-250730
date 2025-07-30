/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid-layout containing the columns
  const grid = element.querySelector('.grid-layout');
  let columns = [];
  if (grid) {
    columns = Array.from(grid.children);
  } else {
    columns = Array.from(element.children);
  }

  // Remove empty columns (robustness)
  columns = columns.filter(col => {
    if (!col) return false;
    return Array.from(col.childNodes).some(n => n.textContent.trim().length > 0 || n.nodeName === 'IMG' || n.nodeName === 'A');
  });

  // Header row with ONE column only
  const headerRow = ['Columns (columns31)'];
  // Content row with one cell per column
  const contentRow = columns;

  // cells: first row is header (single column), second row is all columns
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(table);
}