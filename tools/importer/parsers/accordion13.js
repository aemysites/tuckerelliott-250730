/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: single cell/column exactly as in the example
  const headerRow = ['Accordion (accordion13)'];
  // Extract all accordion items (each .divider is an item)
  const accordionItems = Array.from(element.querySelectorAll(':scope > .divider'));
  // Prepare table rows, with the header as a single cell
  const rows = [headerRow];
  // Each accordion item is a content row with two cells: title and content
  accordionItems.forEach((divider) => {
    // Find child grid (holds title and content)
    const grid = divider.querySelector(':scope > .w-layout-grid, :scope > .grid-layout');
    if (grid) {
      const children = Array.from(grid.children);
      if (children.length >= 2) {
        // Reference elements directly
        const titleEl = children[0];
        const contentEl = children[1];
        rows.push([titleEl, contentEl]);
      } else if (children.length === 1) {
        // Fallback, just in case (shouldn't happen for this block type)
        rows.push([children[0], '']);
      }
    }
  });
  // Build and replace with the block table
  if (rows.length > 1) {
    const block = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(block);
  }
}
