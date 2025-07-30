/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid container
  const grid = element.querySelector('.w-layout-grid');
  if (!grid) return;

  // Get all direct children of the grid
  const columns = Array.from(grid.children);

  // Identify left column: everything except the image (text block and ul)
  let leftCol = [];
  let rightCol = [];

  // Find intro/text div
  const introDiv = columns.find(child => child.tagName === 'DIV' && child.querySelector('.eyebrow'));
  if (introDiv) leftCol.push(introDiv);

  // Find ul (contact info)
  const contactList = columns.find(child => child.tagName === 'UL');
  if (contactList) leftCol.push(contactList);

  // Find image for right column
  const image = columns.find(child => child.tagName === 'IMG');
  if (image) rightCol.push(image);

  // Compose the table: header is a single cell spanning columns, next row is two columns
  const cells = [
    ['Columns (columns18)'],
    [leftCol, rightCol]
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
