/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns23)'];

  // Find the flex container holding the columns
  const flexContainer = element.querySelector(':scope > div');
  if (!flexContainer) return;

  // Get all direct child divs (each is a column)
  const columnDivs = Array.from(flexContainer.children).filter(child => child.tagName === 'DIV');
  if (!columnDivs.length) return;

  // For each column, extract only the meaningful content (icon, heading, paragraph)
  const columnsRow = columnDivs.map(col => {
    // Find the icon/image container and the content container
    const iconDiv = col.children[0]; // first child div (icon)
    const contentDiv = col.children[1]; // second child div (content)
    // Create a wrapper div for the cell
    const cellDiv = document.createElement('div');
    if (iconDiv) cellDiv.appendChild(iconDiv.cloneNode(true));
    if (contentDiv) cellDiv.appendChild(contentDiv.cloneNode(true));
    return cellDiv;
  });

  // Create the table with the header and one row of columns
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow
  ], document);

  // Replace the original section with the new table
  element.replaceWith(table);
}
