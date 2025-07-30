/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid container
  const container = element.querySelector('.container');
  if (!container) return;
  const grid = container.querySelector('.grid-layout');
  if (!grid) return;

  // Gather the left/main column (main card)
  const mainCard = grid.querySelector('a.utility-link-content-block');

  // Gather the right-side top part (two smaller cards stacked)
  const rightTopGroup = grid.querySelectorAll('.flex-horizontal.flex-vertical.flex-gap-sm')[0];
  const rightTopCards = rightTopGroup ? rightTopGroup.querySelectorAll('a.utility-link-content-block') : [];
  const rightTopDiv = document.createElement('div');
  rightTopCards.forEach(card => rightTopDiv.appendChild(card));

  // Gather the right-side bottom part (list of text links)
  const rightBottomGroup = grid.querySelectorAll('.flex-horizontal.flex-vertical.flex-gap-sm')[1];
  const rightBottomDiv = document.createElement('div');
  if (rightBottomGroup) {
    Array.from(rightBottomGroup.children).forEach(child => {
      if (child.matches('a.utility-link-content-block') || child.matches('.divider')) {
        rightBottomDiv.appendChild(child);
      }
    });
  }

  // Build the right column as a vertical stack
  const rightCol = document.createElement('div');
  rightCol.appendChild(rightTopDiv);
  rightCol.appendChild(rightBottomDiv);

  // Compose table: first row is single header cell, next row has 2 cells (columns)
  const cells = [
    ['Columns (columns2)'], // Header row: exactly one cell
    [mainCard, rightCol]    // Second row: two cells for columns
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
