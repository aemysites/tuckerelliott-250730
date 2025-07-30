/* global WebImporter */
export default function parse(element, { document }) {
  // Collect all immediate children of the grid (each column)
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // For each column, extract the first image, or the whole div if no image
  const contentCells = columns.map((col) => {
    const img = col.querySelector('img');
    return img || col;
  });

  // Create a single-cell header row matching the example
  const headerRow = ['Columns (columns38)'];

  // The table consists of a single header row and a single content row with multiple cells
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentCells // This is a single array representing the second (content) row
  ], document);

  // Replace the original grid element with the new table
  element.replaceWith(table);
}
