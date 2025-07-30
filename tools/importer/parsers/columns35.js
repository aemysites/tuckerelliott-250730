/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must be a single cell and match the block name and variant exactly
  const header = ['Columns (columns35)'];

  // Find the grid that holds the columns, and the direct columns inside
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;

  const columns = Array.from(grid.children);

  // If there is only one column, we put all content in one cell in the single content row
  // If there are multiple columns, we preserve each column in its own cell in the row
  // For this HTML, there are two blocks: left (heading/p) and right (button)
  // But the example markdown and screenshots indicate that we should combine related content
  // into a single cell when only one logical column exists, else split as needed.
  // For this HTML, we should keep two columns in the content row

  // Build the row with the original elements
  const contentRow = columns.map(col => col);

  // Only create the table if content row has at least one element
  if (contentRow.length === 0) return;

  // Compose the final block table
  const table = WebImporter.DOMUtils.createTable([
    header,
    contentRow
  ], document);

  element.replaceWith(table);
}
