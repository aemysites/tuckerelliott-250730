/* global WebImporter */
export default function parse(element, { document }) {
  // Get all direct child divs (the columns of the grid)
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  // Build the content row: for each column, use first child if present (for wrapper div), else the column
  const contentRow = columns.map(col => (col.children.length ? col.children[0] : col));
  // Build the header row: block name in first cell, empty string for each additional content column
  const headerRow = [
    'Columns (columns29)',
    ...Array(contentRow.length - 1).fill('')
  ];
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);
  element.replaceWith(table);
}
