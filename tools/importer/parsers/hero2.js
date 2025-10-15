/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row
  const headerRow = ['Hero (hero2)'];

  // 2. Extract background image (picture or img)
  let imageEl = null;
  // Look for a <picture> or <img> inside the hero section
  const picture = element.querySelector('picture');
  if (picture) {
    imageEl = picture;
  } else {
    // fallback: direct img
    const img = element.querySelector('img');
    if (img) imageEl = img;
  }

  // 3. Extract headline and other text content
  // For this example, headline is in h1
  let contentEls = [];
  const h1 = element.querySelector('h1');
  if (h1) {
    contentEls.push(h1);
  }
  // No subheading or CTA in this example, but code is robust for future cases
  // If subheading (h2, h3, p) exists, add to contentEls
  const subheading = element.querySelector('h2, h3, p');
  if (subheading) {
    contentEls.push(subheading);
  }
  // Look for CTA (button or link)
  const cta = element.querySelector('a, button');
  if (cta) {
    contentEls.push(cta);
  }

  // 4. Build table rows
  const rows = [
    headerRow,
    [imageEl ? imageEl : ''],
    [contentEls.length ? contentEls : ''],
  ];

  // 5. Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
