/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Gather all direct child divs (these are columns)
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  // 2. Construct the cells array: header is a single cell, then one row with all columns
  const cells = [
    ['Columns (columns4)'], // Header row must be single cell
    columns // Second row: one cell per column (each is a div)
  ];
  // 3. Create the block table using the helper
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // 4. Replace the original element with the new block table
  element.replaceWith(block);
}
