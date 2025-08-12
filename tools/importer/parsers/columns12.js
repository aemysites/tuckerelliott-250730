/* global WebImporter */
export default function parse(element, { document }) {
  // Get all direct column children
  const columns = Array.from(element.querySelectorAll(':scope > .parsys_column'));
  // For each column, extract its main content
  const columnContents = columns.map(col => {
    // From each column, find the .container (the colored/card block)
    const container = col.querySelector(':scope > .styledcontainer > .container');
    return container || col;
  });

  // Prepare the header row: single cell, NOT multiple columns
  const headerRow = ['Columns (columns12)'];
  // Prepare cells array: header row, then content row
  const tableCells = [headerRow, columnContents];

  // Create the table with WebImporter.DOMUtils.createTable
  const block = WebImporter.DOMUtils.createTable(tableCells, document);

  // Fix the header row to span all columns if necessary
  // (createTable does not set colspan, so we must do it here)
  const headerTr = block.querySelector('tr');
  if (headerTr && headerTr.children.length === 1) {
    headerTr.children[0].setAttribute('colspan', columnContents.length);
  }

  // Replace original element
  element.replaceWith(block);
}
