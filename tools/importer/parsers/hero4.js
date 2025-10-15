/* global WebImporter */
export default function parse(element, { document }) {
  // Hero (hero4) block: 1 column, 3 rows
  // Row 1: Block name
  // Row 2: Background image (none in this HTML)
  // Row 3: Title, subheading, CTA (only a title in this HTML)

  // Header row
  const headerRow = ['Hero (hero4)'];

  // Row 2: Background image (none present)
  const imageRow = [''];

  // Row 3: Title, subheading, CTA
  // Find the heading (h1)
  let titleContent = '';
  const h1 = element.querySelector('h1');
  if (h1) {
    // Use the h1 element directly for resilience
    titleContent = h1;
  } else {
    // Fallback: use all text content
    titleContent = element.textContent.trim();
  }

  const contentRow = [titleContent];

  // Build the table
  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
