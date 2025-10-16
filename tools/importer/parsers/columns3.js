/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Columns (columns3)
  const headerRow = ['Columns (columns3)'];

  // Find the main flex container that holds the columns
  const flexContainer = element.querySelector('.flex.flex-col-reverse.flex-wrap');
  if (!flexContainer) return;
  const columns = flexContainer.children;
  if (columns.length < 2) return;

  // Left column: contains heading, subheading, paragraph, and CTA
  const leftCol = columns[0];
  // Right column: contains image
  const rightCol = columns[1];

  // Extract left column content
  // Get the main content wrapper inside leftCol
  const leftContentWrapper = leftCol.querySelector(':scope > div');
  if (!leftContentWrapper) return;

  // Compose left column cell: include all direct children (heading, subheading, paragraph, CTA)
  const leftCell = document.createElement('div');
  Array.from(leftContentWrapper.children).forEach(child => {
    leftCell.appendChild(child.cloneNode(true));
  });

  // Extract right column content (image)
  // Find the image inside the right column
  const rightContentWrapper = rightCol.querySelector(':scope > div');
  if (!rightContentWrapper) return;
  const img = rightContentWrapper.querySelector('img');
  const rightCell = document.createElement('div');
  if (img) {
    rightCell.appendChild(img.cloneNode(true));
  }

  // Compose the table rows
  const tableRows = [
    headerRow,
    [leftCell, rightCell]
  ];

  // Create the block table and replace the original element
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
