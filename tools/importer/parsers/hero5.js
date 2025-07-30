/* global WebImporter */
export default function parse(element, { document }) {
  // Block header: must match example exactly
  const headerRow = ['Hero (hero5)'];

  // The block structure is: 1 column, 3 rows: header, image, then content
  // 1. Find the main grid (direct child of section)
  const grid = element.querySelector(':scope > .w-layout-grid');
  if (!grid) return;

  // 2. Find the image in direct children of grid
  let imageEl = null;
  for (const child of grid.children) {
    if (child.tagName && child.tagName.toLowerCase() === 'img') {
      imageEl = child;
      break;
    }
  }
  const imageRow = [imageEl || ''];

  // 3. Collect content: heading, paragraph, button group (all as elements)
  // Find the inner grid (container block)
  let contentBlock = null;
  const grids = grid.querySelectorAll(':scope > .w-layout-grid');
  const innerGrid = grids[0];
  if (innerGrid) {
    // Usually only one div direct child with heading, text, and buttons
    const sectionDiv = innerGrid.querySelector(':scope > div');
    if (sectionDiv) {
      const fragment = document.createDocumentFragment();
      // Heading (h1/h2/h3)
      const heading = sectionDiv.querySelector('h1, h2, h3');
      if (heading) fragment.appendChild(heading);
      // Subheading or rich text
      const para = sectionDiv.querySelector('.rich-text, p');
      if (para) fragment.appendChild(para);
      // CTA button group (may have multiple links)
      const buttonGroup = sectionDiv.querySelector('.button-group');
      if (buttonGroup) fragment.appendChild(buttonGroup);
      contentBlock = fragment.childNodes.length ? fragment : '';
    }
  }
  const contentRow = [contentBlock || ''];

  // Assemble table in correct order
  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
