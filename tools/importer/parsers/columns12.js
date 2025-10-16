/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns12)'];

  // Get immediate child divs (each column)
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Defensive: Only proceed if we have columns
  if (columns.length === 0) return;

  // For each column, extract the main button/link (assume one per column)
  const rowCells = columns.map(col => {
    // Find the first anchor (button styled as link)
    const btn = col.querySelector('a');
    // Defensive: Only add if found
    return btn ? btn : document.createElement('span'); // fallback empty span if missing
  });

  // Table: header row, then content row with columns
  const cells = [headerRow, rowCells];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
