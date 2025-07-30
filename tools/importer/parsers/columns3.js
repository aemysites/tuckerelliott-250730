/* global WebImporter */
export default function parse(element, { document }) {
  // Try to find the grid layout, which contains the columns
  let grid = element.querySelector('.grid-layout');
  let columns = [];
  if (grid) {
    columns = Array.from(grid.children);
  } else {
    // Fallback: try container immediate children as columns
    const container = element.querySelector('.container');
    if (container) {
      columns = Array.from(container.children);
    } else {
      // As a last resort, treat all direct children of the element as columns
      columns = Array.from(element.children);
    }
  }

  // The block name must exactly match the example: 'Columns (columns3)'
  const headerRow = ['Columns (columns3)'];
  // The second row is the columns, each existing column block as a cell
  const contentRow = columns;

  // Even if some column is empty, still include its (empty) node to maintain structure
  const cells = [
    headerRow,
    contentRow
  ];
  // Create and replace as a block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
