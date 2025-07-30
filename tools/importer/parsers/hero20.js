/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row: Block name exactly as in example
  const headerRow = ['Hero (hero20)'];

  // 2. Background images: all images in the image grid
  let backgroundCell = '';
  const grid = element.querySelector('.grid-layout.desktop-3-column.utility-min-height-100dvh');
  if (grid) {
    // reference all <img> in grid
    const imgs = Array.from(grid.querySelectorAll('img'));
    if (imgs.length > 0) {
      const bgDiv = document.createElement('div');
      imgs.forEach(img => bgDiv.appendChild(img));
      backgroundCell = bgDiv;
    }
  }

  // 3. Content cell: heading, subheading, CTAs
  let contentCell = '';
  const mainContent = element.querySelector('.ix-hero-scale-3x-to-1x-content .container');
  if (mainContent) {
    const frag = document.createDocumentFragment();
    // Heading (h1)
    const heading = mainContent.querySelector('h1');
    if (heading) frag.appendChild(heading);
    // Subheading (p)
    const subheading = mainContent.querySelector('p');
    if (subheading) frag.appendChild(subheading);
    // Buttons (all <a> in .button-group)
    const buttonGroup = mainContent.querySelector('.button-group');
    if (buttonGroup) {
      Array.from(buttonGroup.querySelectorAll('a')).forEach(btn => frag.appendChild(btn));
    }
    if (frag.childNodes.length > 0) contentCell = frag;
  }

  // Compose table structure as in example: 1 column, 3 rows
  const cells = [
    headerRow,
    [backgroundCell],
    [contentCell],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}