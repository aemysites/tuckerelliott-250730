/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per block definition
  const headerRow = ['Hero (hero12)'];

  // Find the immediate children of the grid-layout
  const grid = element.querySelector('.grid-layout');
  const gridChildren = grid ? grid.querySelectorAll(':scope > div') : [];

  // Background image: first img inside the first grid child
  let bgImg = null;
  if (gridChildren.length > 0) {
    bgImg = gridChildren[0].querySelector('img');
  }

  // Content cell: the card-body inside the second grid child
  let content = null;
  if (gridChildren.length > 1) {
    const container = gridChildren[1];
    const cardBody = container.querySelector('.card-body');
    if (cardBody) {
      content = cardBody;
    }
  }

  // If image or content is missing, use empty string for resilience
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    [bgImg || ''],
    [content || '']
  ], document);

  element.replaceWith(table);
}