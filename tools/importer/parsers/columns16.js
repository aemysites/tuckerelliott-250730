/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid container inside the element
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;

  // Get all immediate children of the grid (each is a column wrapper)
  const columnDivs = Array.from(grid.children);

  // For each column, extract the full content block for the column
  // Use the *contents* of each column's primary child (usually a wrapper div)
  // If the column div has only one child and it's a DIV, use its children; otherwise use columnDiv's children
  const columns = columnDivs.map(colDiv => {
    // If there is a single child and it's a div, use its children as the column content
    if (colDiv.children.length === 1 && colDiv.firstElementChild && colDiv.firstElementChild.tagName === 'DIV') {
      return Array.from(colDiv.firstElementChild.childNodes).filter(node => {
        // Only include elements or text nodes (skip comments etc)
        return node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim());
      });
    }
    // Otherwise, include all child nodes (for robustness)
    return Array.from(colDiv.childNodes).filter(node => {
      return node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim());
    });
  });

  // Compose the table rows
  const headerRow = ['Columns (columns16)'];
  // Each column's content is an array, so pass as is (createTable supports arrays in cells)
  const cells = [
    headerRow,
    columns
  ];

  // Create the table using the helper
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block table
  element.replaceWith(table);
}
