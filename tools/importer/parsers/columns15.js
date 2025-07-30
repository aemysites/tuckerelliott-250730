/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid for columns
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;
  // Collect immediate children of the grid (to get all columns)
  const gridChildren = Array.from(grid.children);
  if (gridChildren.length < 2) return;

  // For each column, gather all of its content (as elements)
  // This way, it will adapt to future HTML with e.g. more columns
  const contentRow = gridChildren.map(col => {
    // If it's a DIV, include all child nodes (not just elements, to get text & structure)
    if (col.tagName === 'DIV') {
      // Get all child nodes (including text)
      const nodes = Array.from(col.childNodes).filter(n => {
        // Skip empty text nodes
        if (n.nodeType === Node.TEXT_NODE) return n.textContent.trim().length > 0;
        return true;
      });
      // If empty (defensive), fallback to the div itself
      return nodes.length ? nodes : col;
    }
    // Otherwise, just include the element (for e.g. IMG)
    return col;
  });

  const headerRow = ['Columns (columns15)'];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);
  element.replaceWith(table);
}
