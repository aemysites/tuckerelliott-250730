/* global WebImporter */
export default function parse(element, { document }) {
  // --- Hero (hero2) block parser ---
  // 1. Header row: must match exactly
  const headerRow = ['Hero (hero2)'];

  // 2. Background image row
  // Locate the hero image: <img> inside <picture> within .Multimedia
  let bgImg = null;
  const multimedia = element.querySelector('.Multimedia');
  if (multimedia) {
    const picture = multimedia.querySelector('picture');
    if (picture) {
      // Reference the actual <img> element
      const img = picture.querySelector('img');
      if (img) {
        bgImg = img;
      }
    }
  }

  // 3. Content row: heading, subheading, CTA (if present)
  // Only heading (h1) is present in this example
  const contentEls = [];
  const h1 = element.querySelector('h1');
  if (h1) {
    contentEls.push(h1);
  }
  // No subheading or CTA in this example

  // Defensive: handle missing image or heading
  const rows = [
    headerRow,
    [bgImg ? bgImg : ''],
    [contentEls.length ? contentEls : ''],
  ];

  // Create the table with correct structure
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
