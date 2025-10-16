/* global WebImporter */
export default function parse(element, { document }) {
  // --- Extract background image ---
  let bgImg = null;
  // Use less specific selector to ensure image is found
  const img = element.querySelector('img');
  if (img) {
    bgImg = img;
  }

  // --- Extract heading (h1) ---
  const heading = element.querySelector('h1');

  // --- Extract subheading (p) ---
  // Use less specific selector to ensure all text is included
  let subheading = null;
  const paragraphs = element.querySelectorAll('p');
  if (paragraphs.length > 0) {
    // Use all paragraphs, not just the first after h1
    subheading = Array.from(paragraphs);
  }

  // --- Compose table rows ---
  const headerRow = ['Hero (hero4)'];
  const imageRow = [bgImg ? bgImg : ''];
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(...subheading);
  const contentRow = [contentCell];

  // --- Create table ---
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
