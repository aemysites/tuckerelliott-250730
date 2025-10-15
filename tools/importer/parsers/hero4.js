/* global WebImporter */
export default function parse(element, { document }) {
  // Hero (hero4) block: 1 column, 3 rows
  // 1st row: block name
  // 2nd row: background image (none in this case)
  // 3rd row: headline, subheading, CTA (only headline present)

  // Header row
  const headerRow = ['Hero (hero4)'];

  // 2nd row: background image (none in source HTML)
  const imageRow = [''];

  // 3rd row: headline
  // Find the headline element (h1)
  let headline = null;
  const h1 = element.querySelector('h1');
  if (h1) {
    // Defensive: use the h1 itself, not just its text
    headline = h1;
  } else {
    // Fallback: use all text content
    headline = document.createElement('div');
    headline.textContent = element.textContent.trim();
  }

  // Only headline present, no subheading or CTA
  const contentRow = [headline];

  // Compose the table
  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
