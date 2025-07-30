/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as specified by the block
  const headerRow = ['Hero (hero28)'];

  // --- Extract background image (2nd row) ---
  let bgImg = null;
  // Look for an <img> inside any descendant of the element
  const img = element.querySelector('img');
  if (img) {
    bgImg = img;
  }

  // --- Extract content (3rd row) ---
  let content = null;
  // Try to find the grid, and the second grid cell (usually contains text)
  const grid = element.querySelector('.w-layout-grid');
  let textCell = null;
  if (grid) {
    // Use only direct children
    const gridChildren = grid.querySelectorAll(':scope > div');
    if (gridChildren.length > 1) {
      textCell = gridChildren[1];
    }
  }
  // The content is typically nested further: look for a margin/padding/container wrapper with heading(s)
  let textBlock = textCell;
  if (textCell) {
    // Try to find the direct child that holds the main heading etc
    const candidate = textCell.querySelector(
      '.utility-margin-bottom-6rem, .container, .utility-text-align-center, h1, h2, h3, p'
    );
    if (candidate) {
      // If candidate is a wrapper, use it. Else fall back to textCell
      textBlock = candidate.closest('.utility-margin-bottom-6rem, .container') || candidate;
    }
  }
  // If nothing found, fallback to grid or element
  if (!textBlock) {
    textBlock = grid || element;
  }
  content = textBlock;

  // --- Build the block table ---
  const cells = [
    headerRow,
    [bgImg],
    [content],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}