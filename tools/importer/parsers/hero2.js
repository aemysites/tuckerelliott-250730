/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row: always block name
  const headerRow = ['Hero (hero2)'];

  // 2. Background image extraction
  // Find the <img> inside <picture> (background image)
  let bgImg = null;
  const picture = element.querySelector('picture');
  if (picture) {
    bgImg = picture.querySelector('img');
  }

  // 3. Content extraction: heading, subheading, CTA
  // For this example, only <h1> is present
  let contentElements = [];
  const h1 = element.querySelector('h1');
  if (h1) {
    contentElements.push(h1);
  }
  // If there were subheading or CTA, add them here

  // 4. Table construction
  const cells = [
    headerRow,
    [bgImg ? bgImg : ''],
    [contentElements.length ? contentElements : ''],
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
